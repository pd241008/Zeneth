package ingestion

import (
	"bufio"
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"project-zenith-backend/internal/models"
	"project-zenith-backend/internal/storage"
)

// FetchAndParseCelesTrak fetches TLE data from CelesTrak and stores it in ClickHouse.
func FetchAndParseCelesTrak(ctx context.Context, url string, db *storage.DB) error {
	log.Println("Starting CelesTrak ingestion...")
	
	client := &http.Client{Timeout: 30 * time.Second}
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to fetch CelesTrak data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code from CelesTrak: %d", resp.StatusCode)
	}

	scanner := bufio.NewScanner(resp.Body)
	var lines []string
	now := time.Now()
	var count int

	for scanner.Scan() {
		lines = append(lines, strings.TrimSpace(scanner.Text()))
		if len(lines) == 3 {
			name := lines[0]
			line1 := lines[1]
			line2 := lines[2]
			lines = []string{}

			if len(line1) < 68 || len(line2) < 68 {
				continue
			}

			noradID := strings.TrimSpace(line2[2:7])

			obj := models.CelestialObject{
				ID:           "NORAD-" + noradID,
				Name:         name,
				Type:         "satellite",
				Designator:   strings.TrimSpace(line1[9:17]),
				FirstUpdated: now,
				LastUpdated:  now,
			}

			tle := models.TLEData{
				ObjectID:    obj.ID,
				Line1:       line1,
				Line2:       line2,
				Epoch:       now,
				FetchedTime: now,
			}

			if err := db.UpsertObject(ctx, obj, tle); err != nil {
				log.Printf("Failed to upsert object %s: %v", name, err)
			} else {
				count++
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return fmt.Errorf("error reading CelesTrak response: %w", err)
	}

	log.Printf("Successfully ingested %d active satellites from CelesTrak", count)
	return nil
}
