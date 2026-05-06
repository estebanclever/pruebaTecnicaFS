import type { Favorite } from "../types";

type FavoritesListProps = {
  favorites: Favorite[];
  onDelete: (id: number) => void;
  onChangeNoteLocal: (id: number, note: string) => void;
  onSaveNote: (id: number, note: string) => void;
};

export default function FavoritesList({
  favorites,
  onDelete,
  onChangeNoteLocal,
  onSaveNote,
}: FavoritesListProps) {
  return (
    <section>
      <h2>Favoritos</h2>
      {favorites.length === 0 ? (
        <p>No hay favoritos aún.</p>
      ) : (
        <ul>
          {favorites.map((f) => (
            <li key={f.id} style={{ marginBottom: 8 }}>
              {f.pokemon_name} (#{f.pokemon_id}){" "}
              <button onClick={() => onDelete(f.id)}>Eliminar</button>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: "block", fontSize: 12 }}>Nota personal</label>
                <input
                  style={{ width: "100%", maxWidth: 520 }}
                  value={f.note ?? ""}
                  placeholder="Escribe una nota (máx. 280)..."
                  onChange={(e) => onChangeNoteLocal(f.id, e.target.value)}
                />
                <div style={{ marginTop: 6 }}>
                  <button type="button" onClick={() => onSaveNote(f.id, f.note ?? "")}>
                    Guardar nota
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}