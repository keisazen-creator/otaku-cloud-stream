import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Settings, Maximize, SkipForward } from "lucide-react";
import { getAnimeById } from "@/lib/anilist";
import { kogemiGetImdb, kogemiGetStream } from "@/lib/kogemi";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import type { Anime } from "@/lib/types";
import Navbar from "@/components/Navbar";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const episode = Number(searchParams.get("ep") || 1);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [server, setServer] = useState<"primary" | "backup">("primary");
  const [streamData, setStreamData] = useState<{ primary: string; backup: string } | null>(null);
  const { updateProgress } = useContinueWatching();

  useEffect(() => {
    if (!id) return;
    getAnimeById(Number(id)).then(setAnime);
  }, [id]);

  useEffect(() => {
    if (!anime) return;
    setLoading(true);
    setStreamError(null);
    const title = anime.title.english || anime.title.romaji;

    kogemiGetImdb(title)
      .then((imdb) => kogemiGetStream(imdb.imdb, 1, episode).then((data) => {
        setStreamData(data);
        setStreamUrl(data.primary);
        setServer("primary");
        // Save to continue watching
        updateProgress({
          animeId: anime.id,
          animeTitle: title,
          animeImage: anime.coverImage.large,
          episode,
          totalEpisodes: anime.episodes || 12,
          progress: episode / (anime.episodes || 12),
        });
      }))
      .catch((err) => setStreamError(err.message))
      .finally(() => setLoading(false));
  }, [anime, episode]);

  const switchServer = () => {
    if (!streamData) return;
    if (server === "primary") {
      setStreamUrl(streamData.backup);
      setServer("backup");
    } else {
      setStreamUrl(streamData.primary);
      setServer("primary");
    }
  };

  const totalEps = anime?.episodes || 12;
  const title = anime ? (anime.title.english || anime.title.romaji) : "Loading...";

  const goToEp = (ep: number) => {
    if (ep >= 1 && ep <= totalEps) {
      setSearchParams({ ep: String(ep) });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Player */}
        <div className="w-full bg-black aspect-video max-h-[75vh] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : streamError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <p className="text-destructive mb-2">Failed to load stream</p>
              <p className="text-muted-foreground text-sm mb-4">{streamError}</p>
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                Retry
              </button>
            </div>
          ) : streamUrl ? (
            <iframe
              src={streamUrl}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; encrypted-media"
              style={{ border: "none" }}
            />
          ) : null}
        </div>

        {/* Controls */}
        <div className="container mx-auto px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to={`/anime/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Back to Details
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={switchServer}
                className="px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Server: {server === "primary" ? "Primary" : "Backup"}
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-display font-bold text-foreground mb-1">{title}</h1>
            <p className="text-sm text-muted-foreground mb-4">Episode {episode} of {totalEps}</p>
          </motion.div>

          {/* Episode navigation */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => goToEp(episode - 1)}
              disabled={episode <= 1}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg glass text-sm disabled:opacity-30 hover:bg-muted/60 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              onClick={() => goToEp(episode + 1)}
              disabled={episode >= totalEps}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-30 hover:bg-primary/90 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>

          {/* Episode grid */}
          <h3 className="text-sm font-semibold text-foreground mb-3">Episodes</h3>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
            {Array.from({ length: totalEps }, (_, i) => i + 1).map((ep) => (
              <button
                key={ep}
                onClick={() => goToEp(ep)}
                className={`h-10 rounded-lg text-xs font-medium transition-all ${
                  ep === episode
                    ? "bg-primary text-primary-foreground glow-primary-sm"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {ep}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
