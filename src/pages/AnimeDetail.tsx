import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Plus, Check, Share2, Star, Calendar, Film, Clock, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getAnimeById, getAnimeByGenre } from "@/lib/anilist";
import type { Anime } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimeCard from "@/components/AnimeCard";

export default function AnimeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [episodeCount, setEpisodeCount] = useState<number>(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [similar, setSimilar] = useState<Anime[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getAnimeById(Number(id))
      .then((a) => {
        setAnime(a);
        setEpisodeCount(a.episodes || 12);
        // Try to get more accurate episode count from Kogemi
        const title = a.title.english || a.title.romaji;
        kogemiAnimeInfo(title).then((info) => {
          if (info.episodes) setEpisodeCount(info.episodes);
        }).catch(() => {});
        // Load similar anime
        if (a.genres.length > 0) {
          getAnimeByGenre(a.genres[0], 1, 12).then(setSimilar).catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Check watchlist status
  useEffect(() => {
    if (!user || !id) return;
    (supabase as any)
      .from("watchlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("anime_id", Number(id))
      .maybeSingle()
      .then(({ data }: any) => setInWatchlist(!!data));
  }, [user, id]);

  const toggleWatchlist = async () => {
    if (!user) { navigate("/login"); return; }
    if (!anime) return;
    const title = anime.title.english || anime.title.romaji;
    if (inWatchlist) {
      await (supabase as any).from("watchlist").delete().eq("user_id", user.id).eq("anime_id", anime.id);
      setInWatchlist(false);
      toast.success("Removed from watchlist");
    } else {
      await (supabase as any).from("watchlist").insert({
        user_id: user.id,
        anime_id: anime.id,
        anime_title: title,
        anime_image: anime.coverImage.large,
      });
      setInWatchlist(true);
      toast.success("Added to watchlist!");
    }
  };

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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
            <img src={anime.coverImage.extraLarge} alt={title} className="w-48 lg:w-60 rounded-xl shadow-2xl shadow-background/80 border border-border" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-2">{title}</h1>
            {anime.title.native && <p className="text-sm text-muted-foreground mb-4">{anime.title.native}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              {score && (
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400" fill="currentColor" />
                  <span className="text-foreground font-semibold">{score}</span>
                </div>
              )}
              {anime.seasonYear && (
                <div className="flex items-center gap-1"><Calendar size={14} /><span>{anime.seasonYear}</span></div>
              )}
              {episodeCount && (
                <div className="flex items-center gap-1"><Film size={14} /><span>{episodeCount} episodes</span></div>
              )}
              {anime.duration && (
                <div className="flex items-center gap-1"><Clock size={14} /><span>{anime.duration} min/ep</span></div>
              )}
              {studio && <span>{studio}</span>}
              {anime.status && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">{anime.status}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map((g) => (
                <Link key={g} to={`/genres?genre=${encodeURIComponent(g)}`} className="px-3 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors">
                  {g}
                </Link>
              ))}
            </div>

            {anime.description && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-8">{stripHtml(anime.description)}</p>
            )}

            <div className="flex items-center gap-3">
              <Link
                to={`/watch/${anime.id}?ep=1`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 glow-primary-sm hover:glow-primary transition-all"
              >
                <Play size={16} fill="currentColor" /> Watch Now
              </Link>
              <button
                onClick={toggleWatchlist}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors ${
                  inWatchlist ? "bg-primary/20 text-primary border border-primary/30" : "glass text-foreground hover:bg-muted/60"
                }`}
              >
                {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                {inWatchlist ? "In Watchlist" : "Add to List"}
              </button>
              <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Episodes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">Episodes</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
              <Link
                key={ep}
                to={`/watch/${anime.id}?ep=${ep}`}
                className="h-12 rounded-lg glass flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all"
              >
                {ep}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Similar Anime */}
        {similar.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-12">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">More Like This</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
              {similar.filter((s) => s.id !== anime.id).slice(0, 10).map((a, i) => (
                <AnimeCard key={a.id} anime={a} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
