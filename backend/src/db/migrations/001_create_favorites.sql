CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  pokemon_name VARCHAR(100) NOT NULL UNIQUE,
  pokemon_id INTEGER NOT NULL,
  image_url TEXT,
  note VARCHAR(280),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_favorites_pokemon_name ON favorites (pokemon_name);