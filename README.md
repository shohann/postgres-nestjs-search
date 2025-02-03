Tech Stack
Frontend: React (TypeScript)
Backend: Nest.js (TypeScript)
Database: PostgreSQL (Prisma ORM)
Infra: Docker, Docker Compose
Monorepo: Turborepo
Search: PostgreSQL Full-Text Search + Trigram (pg_trgm)
Setup Guide
Prerequisites
Docker & Docker Compose installed
Steps
Clone the Repository

git clone https://github.com/shohann/postgres-nestjs-search.git
cd postgres-nestjs-search
Set Up Environment Variables

Create .env files in root directory:
DATABASE_URL="postgresql://chat_db_user:postgres@localhost:5431/chat_db"
Set Up Environment Variables

# Build all Docker images (backend, frontend, PostgreSQL)

docker compose build

# Start all services

docker compose up
Access the App
Frontend: http://localhost:3000
Backend API: http://localhost:4000
Key Docker Commands
Command Purpose
docker compose build Rebuilds all Docker images (after code changes)
docker compose up -d Starts the app and database in the background
docker compose down Stops and removes all containers
docker compose logs View logs for debugging
docker compose restart Restarts containers without rebuilding
How It Works
PostgreSQL: Runs in a Docker container with preconfigured database.
Backend (Nest.js): Automatically starts on port 4000 inside a Docker container.
Frontend (React): Built and served via Docker on port 3000.
Key Features
Voice & Text Search

Click the mic icon to speak (e.g., “Find a doctor in Uttara”).
Converts speech to text using the browser’s Web Speech API (ready for integration).
Fuzzy Matching

Handles typos/abbreviations (e.g., “doc” → “doctor”, “bhaka” → “Dhaka”).
Monorepo Structure

├── apps  
│ ├── client (React.js)  
│ └── api(Nest.js)  
├── prisma  
│ ├── schema.prisma
│  
└── turbo.json (build pipelines)  
How It Works
Trigram Index: Powers fuzzy search with pg_trgm (e.g., matches “cal” to “California”).
Full-Text Search: Combines category, zones, and branches into a searchable text vector.
React UI: Simple search bar with mic button. Results show name, rating, and location.
Why This Search Approach
✅ Combining Trigram Similarity (pg_trgm) with Full-Text Search

Trigram similarity helps with typos and fuzzy matches (e.g., "toctor" → "doctor").
Full-text search improves semantic and phrase-based search (e.g., "best heart specialist").
Together, they provide fast and accurate search results.
✅ Smart Category & Location Matching

If a user searches for a profession (e.g., "doctor"), we prioritize category matches.
If a location (e.g., "Uttara") is included, results must match that location (zones/branches).
If no location is found, we return all professionals in that category.
✅ Better Ranking of Search Results

Category relevance is given the most weight in sorting results.
If a location match exists, it is also considered in ranking.
This ensures users get the most relevant professionals first.
Notes
The entire app (frontend, backend, database) runs in isolated Docker containers.
No need to install Node.js or NPM locally — everything is handled by Docker!
To update the app:
docker compose down  
git pull origin main  
docker compose build && docker compose up -d
