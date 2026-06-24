package ingestion

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"project-zenith-backend/internal/models"
	"project-zenith-backend/internal/storage"
)

// HorizonsResponse represents the basic JSON structure from NASA Horizons API
type HorizonsResponse struct {
	Signature struct {
		Version string `json:"version"`
		Source  string `json:"source"`
	} `json:"signature"`
	Result string `json:"result"`
}

// FetchNASAHorizons fetches ephemeris data for major planets.
func FetchNASAHorizons(ctx context.Context, apiURL string, db *storage.DB) error {
	log.Println("Starting NASA Horizons ingestion...")

	// Example: Fetch ephemeris for Mars (Command 499)
	reqURL := fmt.Sprintf("%s?format=json&COMMAND='499'&OBJ_DATA='YES'&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTOR'&START_TIME='2024-01-01'&STOP_TIME='2024-01-02'&STEP_SIZE='1 d'", apiURL)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return fmt.Errorf("failed to create Horizons request: %w", err)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to fetch from Horizons: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("horizons API returned status %d", resp.StatusCode)
	}

	var data HorizonsResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return fmt.Errorf("failed to decode Horizons response: %w", err)
	}

	log.Printf("Successfully fetched Horizons data (Version: %s)", data.Signature.Version)

	if db != nil {
		obj := models.CelestialObject{
			ID:           "HORIZONS-499",
			Name:         "Mars",
			Type:         "planet",
			Designator:   "499",
			FirstUpdated: time.Now(),
			LastUpdated:  time.Now(),
		}
		tle := models.TLEData{
			ObjectID:    "HORIZONS-499",
			Line1:       "", // Horizons provides vectors, not TLEs, but we satisfy the schema
			Line2:       "",
			Epoch:       time.Now(),
			FetchedTime: time.Now(),
		}
		
		if err := db.UpsertObject(ctx, obj, tle); err != nil {
			log.Printf("Failed to upsert Mars object: %v", err)
		} else {
			log.Println("Successfully upserted Mars object to database")
		}
	}

	return nil
}
