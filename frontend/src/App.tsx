import { useEffect, useState } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import FavoritesList from "./components/FavoritesList";
import PokemonDetailCard from "./components/PokemonDetailCard";
import PokemonSelector from "./components/PokemonSelector";
import Toast from "./components/Toast";
import type { Favorite, PokemonDetail, PokemonListItem } from "./types";

const API_URL = import.meta.env.VITE_API_URL as string;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

// Socket singleton (evita comportamientos raros por re-renders/StrictMode)
const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

function App() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);

  const loadPokemon = async () => {
    const { data } = await axios.get(`${API_URL}/pokemon?limit=20&offset=0`);
    setPokemon(data.results ?? []);
  };

  const loadFavorites = async () => {
    const { data } = await axios.get(`${API_URL}/favorites`);
    setFavorites(data);
  };

  const loadDetail = async (name: string) => {
    const { data } = await axios.get(`${API_URL}/pokemon/${name}`);
    setDetail(data);
  };

  const addFavorite = async () => {
    if (!detail) return;

    try {
      const { data } = await axios.post(`${API_URL}/favorites`, {
        pokemon_name: detail.name,
        pokemon_id: detail.id,
        image_url: detail.image ?? null,
      });

      // Actualización inmediata local
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === data.id);
        return exists ? prev : [data, ...prev];
      });
    } catch (error: any) {
      if (error?.response?.status === 409) {
        alert("Este pokémon ya está en favoritos.");
        return;
      }

      alert("No se pudo agregar a favoritos.");
      console.error(error);
    }
  };

  const removeFavorite = async (id: number) => {
    await axios.delete(`${API_URL}/favorites/${id}`);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  
    setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  };

  const updateFavoriteNote = async (id: number, note: string) => {
    const { data } = await axios.patch(`${API_URL}/favorites/${id}/note`, {
      note: note.trim().length ? note.trim() : null,
    });

    setFavorites((prev) => prev.map((f) => (f.id === id ? data : f)));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadPokemon(), loadFavorites()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedName) return;
    loadDetail(selectedName);
  }, [selectedName]);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("[socket] conectado:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] connect_error:", err.message);
    });

    socket.on("favorite:added", (favorite: Favorite) => {
      console.log("[socket] favorite:added", favorite);

      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === favorite.id);
        if (exists) return prev; // normalmente es tu propia acción local
        showToast(`Se agregó ${favorite.pokemon_name} a favoritos (evento remoto)`);
        return [favorite, ...prev];
      });
    });

    socket.on("favorite:removed", (payload: { id: number; pokemon_name?: string }) => {
      console.log("[socket] favorite:removed", payload);

      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === payload.id);
        if (!exists) return prev; // ya no estaba en esta pestaña
        showToast(
          `Se eliminó ${payload.pokemon_name ?? "un pokémon"} de favoritos (evento remoto)`
        );
        return prev.filter((f) => f.id !== payload.id);
      });
    });

    socket.on("favorite:updated", (favorite: Favorite) => {
      console.log("[socket] favorite:updated", favorite);

      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === favorite.id);
        if (!exists) return prev;
        showToast(`Se actualizó la nota de ${favorite.pokemon_name} (evento remoto)`);
        return prev.map((f) => (f.id === favorite.id ? favorite : f));
      });
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("favorite:added");
      socket.off("favorite:removed");
      socket.off("favorite:updated");
      socket.disconnect();
    };
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Pokémon Favorites</h1>
      {loading && <p>Cargando...</p>}

      <PokemonSelector
        pokemon={pokemon}
        selectedName={selectedName}
        onSelect={setSelectedName}
      />

      <PokemonDetailCard detail={detail} onAddFavorite={addFavorite} />

      <FavoritesList
        favorites={favorites}
        onDelete={removeFavorite}
        onChangeNoteLocal={(id, note) =>
          setFavorites((prev) =>
            prev.map((item) => (item.id === id ? { ...item, note } : item))
          )
        }
        onSaveNote={updateFavoriteNote}
      />

      <Toast visible={toastVisible} message={toastMessage} />
    </main>
  );
}

export default App;