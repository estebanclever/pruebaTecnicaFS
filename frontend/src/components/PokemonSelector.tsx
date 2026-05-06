import type { PokemonListItem } from "../types";

type PokemonSelectorProps = {
  pokemon: PokemonListItem[];
  selectedName: string;
  onSelect: (value: string) => void;
};

export default function PokemonSelector({
  pokemon,
  selectedName,
  onSelect,
}: PokemonSelectorProps) {
  return (
    <section style={{ marginBottom: 20 }}>
      <h2>Listado Pokémon</h2>
      <select value={selectedName} onChange={(e) => onSelect(e.target.value)}>
        <option value="">Selecciona uno</option>
        {pokemon.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
    </section>
  );
}