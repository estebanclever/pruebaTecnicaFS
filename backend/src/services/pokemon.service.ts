import { env } from "../config/env";

export const getPokemonList = async (limit = 20, offset = 0) => {
  const url = `${env.POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`PokéAPI error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getPokemonDetail = async (name: string) => {
  const url = `${env.POKEAPI_BASE_URL}/pokemon/${name}`;

  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`PokéAPI error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites?.other?.["official-artwork"]?.front_default ??
      data.sprites?.front_default ??
      null,
    types: (data.types ?? []).map((t: { type: { name: string } }) => t.type.name),
    stats: (data.stats ?? []).map(
      (s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name,
        value: s.base_stat,
      })
    ),
  };
};