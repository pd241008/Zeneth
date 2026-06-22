package api

import (
	"encoding/json"
	"net/http"

	"project-zenith-backend/internal/storage"

	"github.com/go-chi/chi/v5"
)

// API holds the dependencies for the REST handlers
type API struct {
	db *storage.DB
}

// NewAPI creates a new API instance
func NewAPI(db *storage.DB) *API {
	return &API{db: db}
}

// SearchObjectsHandler handles searching for celestial objects
func (api *API) SearchObjectsHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "Query parameter 'q' is required", http.StatusBadRequest)
		return
	}

	results, err := api.db.SearchObjects(r.Context(), query)
	if err != nil {
		http.Error(w, "Failed to search objects", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// GetObjectHandler retrieves details for a specific object, including its live propagated position
func (api *API) GetObjectHandler(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		http.Error(w, "Object ID is required", http.StatusBadRequest)
		return
	}

	tle, err := api.db.GetTLE(r.Context(), id)
	if err != nil {
		http.Error(w, "Object not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tle)
}
