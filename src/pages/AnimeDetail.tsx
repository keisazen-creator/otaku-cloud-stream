import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Plus, Share2, Star, Calendar, Film, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getAnimeById } from "@/lib/anilist";
import type { Anime } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAnimeById(Number(id))
      .then(setAnime)
      .finally(() => setLoading(false));
  }, [id]);

  function stripHtml(html: string) {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el.textContent || "";
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 container mx-auto px-4 lg:px-8">
          <div className="h-[60vh] bg-muted animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Anime not found.</p>
      </div>
    );
  }

  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;
  const banner = anime.bannerImage || anime.coverImage.extraLarge;
  const studio = anime.studios?.nodes?.[0]?.name;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Banner */}
      <div className="relative w-full h-[50vh] min-h-[350px]">
        <img src={banner} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute inset-0 gradient-overlay-left" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 -mt-40 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <img
              src={anime.coverImage.extraLarge}
              alt={title}
              className="w-48 lg:w-60 rounded-xl shadow-2xl shadow-background/80 border border-border"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">{title}</h1>
            {anime.title.native && (
              <p className="text-sm text-muted-foreground mb-4">{anime.title.native}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              {score && (
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="text-foreground font-semibold">{score}</span>
                </div>
              )}
              {anime.seasonYear && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{anime.seasonYear}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="flex items-center gap-1">
                  <Film size={14} />
                  <span>{anime.episodes} episodes</span>
                </div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{anime.duration} min/ep</span>
                </div>
              )}
              {studio && <span>{studio}</span>}
              {anime.status && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  {anime.status}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-pointer"
                >
                  {g}
                </span>
              ))}
            </div>

            {anime.description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-8">
                {stripHtml(anime.description)}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 glow-primary-sm hover:glow-primary transition-all">
                <Play size={16} fill="currentColor" />
                Watch Now
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass text-foreground text-sm font-medium hover:bg-muted/60 transition-colors">
                <Plus size={16} />
                Add to List
              </button>
              <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Episode placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Episodes</h2>
          <div className="glass p-8 text-center">
            <p className="text-muted-foreground text-sm">
              Episode streaming is available via the Consumet API integration.
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Connect a Consumet API endpoint to enable episode playback.
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
