import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getAnimeByGenre } from "@/lib/anilist";
import type { Anime } from "@/lib/types";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import Footer from "@/components/Footer";

const GENRES = [
  "Action", "Adventure", "Fantasy", "Romance", "Comedy",
  "Horror", "Sci-Fi", "Slice of Life", "Mecha", "Drama",
  "Mystery", "Sports", "Music", "Supernatural",
];

export default function GenresPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState(searchParams.get("genre") || "Action");
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnimeByGenre(selected, 1, 24)
      .then(setAnime)
      .finally(() => setLoading(false));
  }, [selected]);

  function selectGenre(g: string) {
    setSelected(g);
    setSearchParams({ genre: g });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground mb-6">Genres</h1>
          <div className="flex flex-wrap gap-2 mb-8">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => selectGenre(g)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selected === g
                    ? "bg-primary text-primary-foreground glow-primary-sm"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
                <div className="mt-2 h-4 w-3/4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {anime.map((a, i) => (
              <AnimeCard key={a.id} anime={a} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
