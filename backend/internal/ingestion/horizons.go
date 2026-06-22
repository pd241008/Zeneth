package ingestion

import (
	"context"
	"log"
	
	"project-zenith-backend/internal/storage"
)

// FetchNASAHorizons fetches ephemeris data for major planets.
func FetchNASAHorizons(ctx context.Context, url string, db *storage.DB) error {
	log.Println("Starting NASA Horizons ingestion (stubbed)...")
	return nil
}
