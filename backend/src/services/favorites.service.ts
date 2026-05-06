import { pool } from "../db";

export interface Favorite {
  id: number;
  pokemon_name: string;
  pokemon_id: number;
  image_url: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFavoriteInput {
  pokemon_name: string;
  pokemon_id: number;
  image_url?: string;
  note?: string;
}

export const listFavorites = async (): Promise<Favorite[]> => {
  const result = await pool.query<Favorite>(
    `SELECT id, pokemon_name, pokemon_id, image_url, note, created_at, updated_at
     FROM favorites
     ORDER BY created_at DESC`
  );

  return result.rows;
};

export const createFavorite = async (
  input: CreateFavoriteInput
): Promise<Favorite> => {
  const result = await pool.query<Favorite>(
    `INSERT INTO favorites (pokemon_name, pokemon_id, image_url, note)
     VALUES ($1, $2, $3, $4)
     RETURNING id, pokemon_name, pokemon_id, image_url, note, created_at, updated_at`,
    [
      input.pokemon_name.toLowerCase(),
      input.pokemon_id,
      input.image_url ?? null,
      input.note ?? null,
    ]
  );

  return result.rows[0];
};

export const deleteFavoriteById = async (id: number): Promise<Favorite | null> => {
  const result = await pool.query<Favorite>(
    `DELETE FROM favorites
     WHERE id = $1
     RETURNING id, pokemon_name, pokemon_id, image_url, note, created_at, updated_at`,
    [id]
  );

  return result.rows[0] ?? null;
};

export const updateFavoriteNoteById = async (
  id: number,
  note: string | null
): Promise<Favorite | null> => {
  const result = await pool.query<Favorite>(
    `UPDATE favorites
     SET note = $2,
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, pokemon_name, pokemon_id, image_url, note, created_at, updated_at`,
    [id, note]
  );

  return result.rows[0] ?? null;
};