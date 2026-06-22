package models

import "time"

// CelestialObject represents a trackable object in space (satellite, planet, etc.)
type CelestialObject struct {
	ID           string    `json:"id" ch:"id"`
	Name         string    `json:"name" ch:"name"`
	Type         string    `json:"type" ch:"type"` // e.g., "satellite", "planet", "iss"
	Designator   string    `json:"designator,omitempty" ch:"designator"` // e.g., International Designator for satellites
	FirstUpdated time.Time `json:"first_updated" ch:"first_updated"`
	LastUpdated  time.Time `json:"last_updated" ch:"last_updated"`
}

// TLEData represents Two-Line Element data for a satellite.
type TLEData struct {
	ObjectID    string    `json:"object_id" ch:"object_id"`
	Line1       string    `json:"line1" ch:"line1"`
	Line2       string    `json:"line2" ch:"line2"`
	Epoch       time.Time `json:"epoch" ch:"epoch"`
	FetchedTime time.Time `json:"fetched_time" ch:"fetched_time"`
}

// Telemetry represents a calculated position of an object at a specific time.
type Telemetry struct {
	ObjectID  string    `json:"object_id" ch:"object_id"`
	Timestamp time.Time `json:"timestamp" ch:"timestamp"`
	// Coordinates in Earth-Centered, Earth-Fixed (ECEF) or Earth-Centered Inertial (ECI).
	// We'll use XYZ in kilometers.
	X float64 `json:"x" ch:"x"`
	Y float64 `json:"y" ch:"y"`
	Z float64 `json:"z" ch:"z"`

	// Velocity components in km/s
	VX float64 `json:"vx" ch:"vx"`
	VY float64 `json:"vy" ch:"vy"`
	VZ float64 `json:"vz" ch:"vz"`

	// Optional Geodetic coordinates for easier map plotting
	Latitude  float64 `json:"latitude,omitempty" ch:"latitude"`
	Longitude float64 `json:"longitude,omitempty" ch:"longitude"`
	Altitude  float64 `json:"altitude,omitempty" ch:"altitude"` // Altitude in km above Earth's surface
}
