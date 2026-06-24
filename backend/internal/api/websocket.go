package api

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"project-zenith-backend/internal/models"
	"project-zenith-backend/internal/propagation"
	"project-zenith-backend/internal/storage"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Restrict to Next.js frontend origin
		origin := r.Header.Get("Origin")
		return origin == "http://localhost:3000" || origin == "http://127.0.0.1:3000"
	},
}

// WSHub manages active WebSocket connections
type WSHub struct {
	db         *storage.DB
	propagator *propagation.Propagator
	clients    map[*websocket.Conn]string
	mu         sync.Mutex
}

func NewWSHub(db *storage.DB, propagator *propagation.Propagator) *WSHub {
	return &WSHub{
		db:         db,
		propagator: propagator,
		clients:    make(map[*websocket.Conn]string),
	}
}

// HandleWS upgrades the HTTP connection to a WebSocket
func (h *WSHub) HandleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Failed to upgrade WS: %v", err)
		return
	}

	h.mu.Lock()
	// Default to ISS
	h.clients[conn] = "NORAD-25544"
	h.mu.Unlock()

	log.Printf("Client connected. Total clients: %d", len(h.clients))

	go func() {
		defer func() {
			h.mu.Lock()
			delete(h.clients, conn)
			h.mu.Unlock()
			conn.Close()
			log.Println("Client disconnected")
		}()

		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				break
			}

			var data struct {
				Action string `json:"action"`
				ID     string `json:"id"`
			}
			if err := json.Unmarshal(msg, &data); err == nil {
				if data.Action == "subscribe" && data.ID != "" {
					h.mu.Lock()
					h.clients[conn] = data.ID
					h.mu.Unlock()
					log.Printf("Client subscribed to %s", data.ID)
				}
			}
		}
	}()
}

// StartBroadcasting streams live telemetry to all connected clients
func (h *WSHub) StartBroadcasting() {
	ticker := time.NewTicker(1 * time.Second)

	for range ticker.C {
		h.mu.Lock()
		if len(h.clients) == 0 {
			h.mu.Unlock()
			continue
		}

		if h.db == nil {
			// Mock telemetry when ClickHouse is unavailable
			telemetry := models.Telemetry{
				ObjectID:  "NORAD-25544",
				Timestamp: time.Now(),
				Latitude:  0.0,
				Longitude: 0.0,
				Altitude:  400.0,
			}
			for client := range h.clients {
				err := client.WriteJSON(telemetry)
				if err != nil {
					client.Close()
					delete(h.clients, client) // safe because we're locking WSHub
				}
			}
			h.mu.Unlock()
			continue
		}

		// Group clients by subscribed object ID
		subs := make(map[string][]*websocket.Conn)
		for client, id := range h.clients {
			subs[id] = append(subs[id], client)
		}

		for id, clients := range subs {
			tle, err := h.db.GetTLE(context.Background(), id)
			if err != nil {
				continue
			}

			telemetry, err := h.propagator.CalculatePosition(tle, time.Now())
			if err != nil {
				continue
			}

			for _, client := range clients {
				err := client.WriteJSON(telemetry)
				if err != nil {
					client.Close()
					delete(h.clients, client)
				}
			}
		}
		h.mu.Unlock()
	}
}
