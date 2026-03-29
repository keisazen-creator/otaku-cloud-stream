import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Server, Globe, Subtitles, Volume2 } from "lucide-react";
import { getAnimeById } from "@/lib/anilist";
import { kogemiGetImdb, kogemiGetStream } from "@/lib/kogemi";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import type { Anime } from "@/lib/types";
import Navbar from "@/components/Navbar";

type ServerKey = "megaplay-aniwatch" | "megaplay-mal" | "megaplay-anilist" | "kogemi";
type Lang = "sub" | "dub";

interface ServerInfo {
  key: ServerKey;
  label: string;
  icon: React.ReactNode;
  getUrl: (anime: Anime, ep: number, lang: Lang, kogemiStream?: string) => string | null;
}

const SERVERS: ServerInfo[] = [
  {
    key: "megaplay-aniwatch",
    label: "MegaPlay S1",
    icon: <Server size={14} />,
    getUrl: (anime, ep, lang) => {
      // Use AniList ID as aniwatch-style ID (s-2 format)
      return `https://megaplay.buzz/stream/s-2/${anime.id}/${lang}`;
    },
  },
  {
    key: "megaplay-mal",
    label: "MegaPlay MAL",
    icon: <Globe size={14} />,
    getUrl: (anime, ep, lang) => {
      if (!anime.idMal) return null;
      return `https://megaplay.buzz/stream/mal/${anime.idMal}/${ep}/${lang}`;
    },
  },
  {
    key: "megaplay-anilist",
    label: "MegaPlay AL",
    icon: <Globe size={14} />,
    getUrl: (anime, ep, lang) => {
      return `https://megaplay.buzz/stream/ani/${anime.id}/${ep}/${lang}`;
    },
  },
  {
    key: "kogemi",
    label: "Kogemi",
    icon: <Server size={14} />,
    getUrl: () => null, // handled separately
  },
];

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const episode = Number(searchParams.get("ep") || 1);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState<ServerKey>("megaplay-anilist");
  const [lang, setLang] = useState<Lang>("sub");
  const [kogemiUrls, setKogemiUrls] = useState<{ primary: string; backup: string } | null>(null);
  const [kogemiServer, setKogemiServer] = useState<"primary" | "backup">("primary");
  const { updateProgress } = useContinueWatching();

  useEffect(() => {
    if (!id) return;
    getAnimeById(Number(id)).then(setAnime);
  }, [id]);

  // Build stream URL for non-kogemi servers
  const buildUrl = useCallback(
    (serverKey: ServerKey, a: Anime, ep: number, l: Lang) => {
      const server = SERVERS.find((s) => s.key === serverKey);
      if (!server) return null;
      return server.getUrl(a, ep, l);
    },
    []
  );

  // Handle server switch
  const switchToServer = useCallback(
    async (serverKey: ServerKey) => {
      if (!anime) return;
      setActiveServer(serverKey);
      setStreamError(null);
      setLoading(true);

      if (serverKey === "kogemi") {
        // Kogemi uses IMDB lookup
        try {
          const title = anime.title.english || anime.title.romaji;
          const imdb = await kogemiGetImdb(title);
          const data = await kogemiGetStream(imdb.imdb, 1, episode);
          setKogemiUrls(data);
          setKogemiServer("primary");
          setStreamUrl(data.primary);
        } catch (err: any) {
          setStreamError(err.message || "Kogemi stream failed");
          setStreamUrl(null);
        }
      } else {
        const url = buildUrl(serverKey, anime, episode, lang);
        if (url) {
          setStreamUrl(url);
        } else {
          setStreamError("This server is not available for this anime (missing ID)");
          setStreamUrl(null);
        }
      }
      setLoading(false);
    },
    [anime, episode, lang, buildUrl]
  );

  // Initial load + episode/lang change
  useEffect(() => {
    if (!anime) return;
    switchToServer(activeServer);
    // Save progress
    const title = anime.title.english || anime.title.romaji;
    updateProgress({
      animeId: anime.id,
      animeTitle: title,
      animeImage: anime.coverImage.large,
      episode,
      totalEpisodes: anime.episodes || 12,
      progress: episode / (anime.episodes || 12),
    });
  }, [anime, episode, lang]);

  // When lang changes, rebuild URL for MegaPlay servers
  useEffect(() => {
    if (!anime || activeServer === "kogemi") return;
    const url = buildUrl(activeServer, anime, episode, lang);
    if (url) {
      setStreamUrl(url);
    }
  }, [lang]);

  const toggleKogemiServer = () => {
    if (!kogemiUrls) return;
    if (kogemiServer === "primary") {
      setStreamUrl(kogemiUrls.backup);
      setKogemiServer("backup");
    } else {
      setStreamUrl(kogemiUrls.primary);
      setKogemiServer("primary");
    }
  };

  const totalEps = anime?.episodes || 12;
  const title = anime ? anime.title.english || anime.title.romaji : "Loading...";

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
        <div className="w-full bg-black aspect-video max-h-[75vh] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm">Loading stream...</p>
              </motion.div>
            ) : streamError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
              >
                <p className="text-destructive mb-2 font-semibold">Stream unavailable</p>
                <p className="text-muted-foreground text-sm mb-4 max-w-md">{streamError}</p>
                <p className="text-muted-foreground text-xs mb-4">Try switching to another server below</p>
              </motion.div>
            ) : streamUrl ? (
              <motion.iframe
                key={streamUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={streamUrl}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media"
                style={{ border: "none" }}
              />
            ) : null}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="container mx-auto px-4 lg:px-8 py-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/anime/${id}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Back to Details
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-xl font-display font-bold text-foreground mb-1">{title}</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Episode {episode} of {totalEps}
            </p>
          </motion.div>

          {/* Server selection + Language toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Servers */}
            <div className="flex flex-wrap gap-2">
              {SERVERS.map((s) => {
                const isActive = activeServer === s.key;
                const isDisabled = s.key === "megaplay-mal" && !anime?.idMal;
                return (
                  <button
                    key={s.key}
                    onClick={() => !isDisabled && switchToServer(s.key)}
                    disabled={isDisabled}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground glow-primary-sm"
                        : isDisabled
                        ? "glass text-muted-foreground/40 cursor-not-allowed"
                        : "glass text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {s.icon}
                    {s.label}
                  </button>
                );
              })}

              {/* Kogemi sub-server toggle */}
              {activeServer === "kogemi" && kogemiUrls && (
                <button
                  onClick={toggleKogemiServer}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg glass text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Server size={14} />
                  {kogemiServer === "primary" ? "Backup" : "Primary"}
                </button>
              )}
            </div>

            {/* Sub / Dub toggle */}
            <div className="flex gap-1 p-1 rounded-lg glass">
              <button
                onClick={() => setLang("sub")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  lang === "sub"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Subtitles size={14} /> SUB
              </button>
              <button
                onClick={() => setLang("dub")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  lang === "dub"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Volume2 size={14} /> DUB
              </button>
            </div>
          </div>

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
