import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTrendingAnime, getPopularAnime, getTopRatedAnime, getRecentAnime, getRandomAnime } from "@/lib/anilist";
import type { Anime } from "@/lib/types";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ContentSection from "@/components/ContentSection";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";
import GenreGrid from "@/components/GenreGrid";
import Footer from "@/components/Footer";
import { Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [recent, setRecent] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: continueItems } = useContinueWatching();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      getTrendingAnime(1, 20),
      getPopularAnime(1, 20),
      getTopRatedAnime(1, 20),
      getRecentAnime(1, 20),
    ])
      .then(([t, p, tr, r]) => {
        setTrending(t);
        setPopular(p);
        setTopRated(tr);
        setRecent(r);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRandomAnime = async () => {
    try {
      const random = await getRandomAnime();
      navigate(`/anime/${random.id}`);
    } catch {
      // fallback: pick random from trending
      if (trending.length) {
        const rand = trending[Math.floor(Math.random() * trending.length)];
        navigate(`/anime/${rand.id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSlider anime={trending} />
      <div className="-mt-16 relative z-10">
        {/* Random anime button */}
        <div className="container mx-auto px-4 lg:px-8 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRandomAnime}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-primary-foreground font-semibold text-sm glow-primary-sm hover:glow-primary transition-all"
          >
            <Shuffle size={16} />
            Random Anime
          </motion.button>
        </div>

        {continueItems.length > 0 && <ContinueWatchingSection />}
        <ContentSection title="🔥 Trending Now" anime={trending} loading={loading} viewAllPath="/anime" />
        <ContentSection title="⭐ Top Rated" anime={topRated} loading={loading} viewAllPath="/anime" />
        <ContentSection title="🎬 Most Popular" anime={popular} loading={loading} viewAllPath="/anime" />
        <ContentSection title="🆕 New Releases" anime={recent} loading={loading} viewAllPath="/new-releases" />
        <GenreGrid />
      </div>
      <Footer />
    </div>
  );
}
