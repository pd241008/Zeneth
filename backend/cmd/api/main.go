package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"project-zenith-backend/internal/api"
	"project-zenith-backend/internal/config"
	"project-zenith-backend/internal/ingestion"
	"project-zenith-backend/internal/propagation"
	"project-zenith-backend/internal/storage"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	cfg := config.Load()

	var db *storage.DB
	if cfg.ClickHouseDSN != "" {
		var err error
		db, err = storage.Connect(cfg.ClickHouseDSN)
		if err != nil {
			log.Printf("Failed to connect to ClickHouse: %v", err)
		} else {
			ctx := context.Background()
			if err := db.InitSchema(ctx); err != nil {
				log.Printf("Failed to initialize schema: %v", err)
			} else {
				ingestion.StartPipeline(ctx, cfg, db)
			}
		}
	} else {
		log.Println("Skipping ClickHouse connection and ingestion pipeline (DSN empty)")
	}

	apiHandler := api.NewAPI(db)
	propagator := propagation.NewPropagator()
	wsHub := api.NewWSHub(db, propagator)

	go wsHub.StartBroadcasting()

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	r.Route("/api", func(r chi.Router) {
		r.Get("/objects", apiHandler.SearchObjectsHandler)
		r.Get("/objects/{id}", apiHandler.GetObjectHandler)
	})

	r.Get("/ws", wsHub.HandleWS)

	fmt.Printf("Server starting on port %s\n", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
