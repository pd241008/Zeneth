package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all the environment variables needed for the application.
type Config struct {
	Port           string
	ClickHouseDSN  string
	HorizonsAPIURL string
	CelesTrakURL   string
}

// Load loads the environment variables into the Config struct.
// It will attempt to load from a .env file first, but will not fail
// if the file is missing, relying on system environment variables instead.
func Load() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	chDSN := os.Getenv("CLICKHOUSE_DSN")
	if chDSN == "" {
		log.Fatal("CLICKHOUSE_DSN is not set in the environment")
	}

	horizonsURL := os.Getenv("HORIZONS_API_URL")
	if horizonsURL == "" {
		log.Fatal("HORIZONS_API_URL is not set in the environment")
	}

	celesTrakURL := os.Getenv("CELESTRAK_API_URL")
	if celesTrakURL == "" {
		log.Fatal("CELESTRAK_API_URL is not set in the environment")
	}

	return &Config{
		Port:           port,
		ClickHouseDSN:  chDSN,
		HorizonsAPIURL: horizonsURL,
		CelesTrakURL:   celesTrakURL,
	}
}
