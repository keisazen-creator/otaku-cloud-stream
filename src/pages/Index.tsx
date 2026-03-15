import { useEffect, useState } from "react";
import { getTrendingAnime, getPopularAnime, getTopRatedAnime, getRecentAnime } from "@/lib/anilist";
import type { Anime } from "@/lib/types";
import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import ContentSection from "@/components/ContentSection";
import GenreGrid from "@/components/GenreGrid";
import Footer from "@/components/Footer";

export default function Index() {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [recent, setRecent] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSlider anime={trending} />
      <div className="-mt-16 relative z-10">
        <ContentSection title="🔥 Trending Now" anime={trending} loading={loading} />
        <ContentSection title="⭐ Top Rated" anime={topRated} loading={loading} />
        <ContentSection title="🎬 Most Popular" anime={popular} loading={loading} />
        <ContentSection title="🆕 New Releases" anime={recent} loading={loading} />
        <GenreGrid />
      </div>
      <Footer />
    </div>
  );
}
