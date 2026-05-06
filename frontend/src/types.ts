export type PokemonListItem = {
    name: string;
    url: string;
  };
  
  export type PokemonDetail = {
    id: number;
    name: string;
    image: string | null;
    types: string[];
    stats: { name: string; value: number }[];
  };
  
  export type Favorite = {
    id: number;
    pokemon_name: string;
    pokemon_id: number;
    image_url: string | null;
    note: string | null;
    created_at: string;
    updated_at: string;
  };