package storage

import (
	"context"
	"fmt"
	"log"
	"time"

	"project-zenith-backend/internal/models"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/ClickHouse/clickhouse-go/v2/lib/driver"
)

// DB represents the ClickHouse database connection.
type DB struct {
	conn driver.Conn
}

// Connect initializes the connection to ClickHouse.
func Connect(dsn string) (*DB, error) {
	opts, err := clickhouse.ParseDSN(dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to parse DSN: %w", err)
	}

	conn, err := clickhouse.Open(opts)
	if err != nil {
		return nil, fmt.Errorf("failed to open ClickHouse connection: %w", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := conn.Ping(ctx); err != nil {
		return nil, fmt.Errorf("failed to ping ClickHouse: %w", err)
	}

	log.Println("Connected to ClickHouse successfully")
	return &DB{conn: conn}, nil
}

// InitSchema creates the necessary tables if they do not exist.
func (db *DB) InitSchema(ctx context.Context) error {
	celestialObjectsQuery := `
	CREATE TABLE IF NOT EXISTS celestial_objects (
		id String,
		name String,
		type String,
		designator String,
		first_updated DateTime,
		last_updated DateTime,
		line1 String,
		line2 String,
		epoch DateTime
	) ENGINE = ReplacingMergeTree(last_updated)
	ORDER BY (id)
	`

	err := db.conn.Exec(ctx, celestialObjectsQuery)
	if err != nil {
		return fmt.Errorf("failed to create celestial_objects table: %w", err)
	}

	log.Println("Database schema initialized successfully")
	return nil
}

// UpsertObject inserts or updates a celestial object and its latest TLE.
func (db *DB) UpsertObject(ctx context.Context, obj models.CelestialObject, tle models.TLEData) error {
	query := `
	INSERT INTO celestial_objects (id, name, type, designator, first_updated, last_updated, line1, line2, epoch)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	err := db.conn.Exec(ctx, query,
		obj.ID, obj.Name, obj.Type, obj.Designator, obj.FirstUpdated, obj.LastUpdated,
		tle.Line1, tle.Line2, tle.Epoch,
	)
	if err != nil {
		return fmt.Errorf("failed to upsert object %s: %w", obj.ID, err)
	}
	return nil
}

// SearchObjects retrieves objects matching a simple name query.
func (db *DB) SearchObjects(ctx context.Context, query string) ([]models.CelestialObject, error) {
	searchQuery := `
	SELECT id, name, type, designator, first_updated, last_updated
	FROM celestial_objects
	FINAL
	WHERE name ILIKE ?
	LIMIT 100
	`
	rows, err := db.conn.Query(ctx, searchQuery, "%"+query+"%")
	if err != nil {
		return nil, fmt.Errorf("failed to search objects: %w", err)
	}
	defer rows.Close()

	var results []models.CelestialObject
	for rows.Next() {
		var obj models.CelestialObject
		if err := rows.Scan(&obj.ID, &obj.Name, &obj.Type, &obj.Designator, &obj.FirstUpdated, &obj.LastUpdated); err != nil {
			return nil, err
		}
		results = append(results, obj)
	}
	return results, nil
}

// GetTLE retrieves the latest TLE for a specific object.
func (db *DB) GetTLE(ctx context.Context, objectID string) (models.TLEData, error) {
	query := `
	SELECT id, line1, line2, epoch, last_updated
	FROM celestial_objects
	FINAL
	WHERE id = ?
	`
	var tle models.TLEData
	err := db.conn.QueryRow(ctx, query, objectID).Scan(
		&tle.ObjectID, &tle.Line1, &tle.Line2, &tle.Epoch, &tle.FetchedTime,
	)
	if err != nil {
		return tle, fmt.Errorf("failed to get TLE for object %s: %w", objectID, err)
	}
	return tle, nil
}
