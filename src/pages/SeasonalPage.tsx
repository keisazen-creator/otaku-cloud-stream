import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSeasonalAnime } from "@/lib/anilist";
import type { Anime } from "@/lib/types";
import Navbar from "@/components/Navbar";
import AnimeCard from "@/components/AnimeCard";
import Footer from "@/components/Footer";

const SEASONS = ["WINTER", "SPRING", "SUMMER", "FALL"] as const;
const SEASON_LABELS: Record<string, string> = { WINTER: "❄️ Winter", SPRING: "🌸 Spring", SUMMER: "☀️ Summer", FALL: "🍂 Fall" };

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentSeason = currentMonth < 3 ? "WINTER" : currentMonth < 6 ? "SPRING" : currentMonth < 9 ? "SUMMER" : "FALL";

export default function SeasonalPage() {
  const [season, setSeason] = useState<string>(currentSeason);
  const [year, setYear] = useState(currentYear);
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getSeasonalAnime(season, year, 1, 30)
      .then(setAnime)
      .finally(() => setLoading(false));
  }, [season, year]);

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground mb-6">Seasonal Anime</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  season === s ? "bg-primary text-primary-foreground glow-primary-sm" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {SEASON_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  year === y ? "bg-accent text-accent-foreground" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}><div className="aspect-[2/3] rounded-xl bg-muted animate-pulse" /></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {anime.map((a, i) => <AnimeCard key={a.id} anime={a} index={i} />)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
