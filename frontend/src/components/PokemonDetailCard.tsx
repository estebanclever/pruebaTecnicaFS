import type { PokemonDetail } from "../types";

type PokemonDetailCardProps = {
  detail: PokemonDetail | null;
  onAddFavorite: () => void;
};

export default function PokemonDetailCard({
  detail,
  onAddFavorite,
}: PokemonDetailCardProps) {
  if (!detail) return null;

  return (
    <section style={{ marginBottom: 20 }}>
      <h2>Detalle</h2>
      <p>
        <strong>{detail.name}</strong> (#{detail.id})
      </p>
      {detail.image && <img src={detail.image} alt={detail.name} width={120} />}
      <p>Tipos: {detail.types.join(", ")}</p>
      <button onClick={onAddFavorite}>Agregar a favoritos</button>
    </section>
  );
}