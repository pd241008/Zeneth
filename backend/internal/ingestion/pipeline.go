package ingestion

import (
	"context"
	"log"
	"time"

	"project-zenith-backend/internal/config"
	"project-zenith-backend/internal/storage"
)

// StartPipeline begins the background job for data ingestion.
func StartPipeline(ctx context.Context, cfg *config.Config, db *storage.DB) {
	log.Println("Starting data ingestion pipeline...")

	go func() {
		err := FetchAndParseCelesTrak(ctx, cfg.CelesTrakURL, db)
		if err != nil {
			log.Printf("Initial CelesTrak fetch failed: %v", err)
		}
	}()

	ticker := time.NewTicker(6 * time.Hour)
	go func() {
		for {
			select {
			case <-ticker.C:
				log.Println("Running scheduled data ingestion...")
				err := FetchAndParseCelesTrak(ctx, cfg.CelesTrakURL, db)
				if err != nil {
					log.Printf("Scheduled CelesTrak fetch failed: %v", err)
				}
				
				FetchNASAHorizons(ctx, cfg.HorizonsAPIURL, db)
			case <-ctx.Done():
				log.Println("Stopping data ingestion pipeline...")
				ticker.Stop()
				return
			}
		}
	}()
}
