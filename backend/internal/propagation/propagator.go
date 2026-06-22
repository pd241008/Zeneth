package propagation

import (
	"time"

	"project-zenith-backend/internal/models"

	"github.com/joshuaferrara/go-satellite"
)

// Propagator handles calculating satellite positions from TLE data.
type Propagator struct{}

// NewPropagator creates a new Propagator instance.
func NewPropagator() *Propagator {
	return &Propagator{}
}

// CalculatePosition takes TLE data and a target time, and returns the calculated Telemetry.
func (p *Propagator) CalculatePosition(tle models.TLEData, targetTime time.Time) (models.Telemetry, error) {
	sat := satellite.TLEToSat(tle.Line1, tle.Line2, "wgs84")

	year, month, day := targetTime.Date()
	hour, minute, second := targetTime.Clock()
	
	position, velocity := satellite.Propagate(sat, year, int(month), day, hour, minute, second)

	jDay := satellite.JDay(year, int(month), day, hour, minute, second)
	altitude, _, latLong := satellite.ECIToLLA(position, jDay)

	telemetry := models.Telemetry{
		ObjectID:  tle.ObjectID,
		Timestamp: targetTime,
		X:         position.X,
		Y:         position.Y,
		Z:         position.Z,
		VX:        velocity.X,
		VY:        velocity.Y,
		VZ:        velocity.Z,
		Latitude:  latLong.Latitude * (180.0 / 3.14159265358979323846),
		Longitude: latLong.Longitude * (180.0 / 3.14159265358979323846),
		Altitude:  altitude,
	}

	return telemetry, nil
}
