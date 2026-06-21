.PHONY: dev dev-frontend dev-backend build build-frontend build-backend lint clean

GO_BIN   = bin/api
GO_SRC   = ./cmd/api/main.go

dev:
	$(MAKE) dev-backend & $(MAKE) dev-frontend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && go run ./cmd/api/main.go

build: build-frontend build-backend

build-frontend:
	cd frontend && npm run build

build-backend:
	cd backend && mkdir -p bin && go build -o $(GO_BIN) $(GO_SRC)

lint:
	cd frontend && npm run lint

clean:
	rm -rf backend/bin frontend/.next frontend/node_modules
