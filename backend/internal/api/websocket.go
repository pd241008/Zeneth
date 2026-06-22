package api

import (
	"context"
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
		// Allow Next.js frontend
		return true 
	},
}

// WSHub manages active WebSocket connections
type WSHub struct {
	db         *storage.DB
	propagator *propagation.Propagator
	clients    map[*websocket.Conn]bool
	mu         sync.Mutex
}

func NewWSHub(db *storage.DB, propagator *propagation.Propagator) *WSHub {
	return &WSHub{
		db:         db,
		propagator: propagator,
		clients:    make(map[*websocket.Conn]bool),
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
	h.clients[conn] = true
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
			_, _, err := conn.ReadMessage()
			if err != nil {
				break
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
		
		tle, err := h.db.GetTLE(context.Background(), "NORAD-25544")
		var telemetry models.Telemetry

		if err == nil {
			telemetry, _ = h.propagator.CalculatePosition(tle, time.Now())
		}

		for client := range h.clients {
			err := client.WriteJSON(telemetry)
			if err != nil {
				log.Printf("Error broadcasting to client: %v", err)
				client.Close()
				delete(h.clients, client)
			}
		}
		h.mu.Unlock()
	}
}
