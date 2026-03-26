import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getTrendingManga, getPopularManga, searchManga, type Manga } from "@/lib/anilist";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";

function MangaCard({ manga, index }: { manga: Manga; index: number }) {
  const title = manga.title.english || manga.title.romaji;
  const score = manga.averageScore ? (manga.averageScore / 10).toFixed(1) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border bg-muted">
        <img
          src={manga.coverImage.large}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {score && (
            <div className="flex items-center gap-1 text-xs text-yellow-400 mb-1">
              <Star size={10} fill="currentColor" /> {score}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen size={10} />
            {manga.chapters ? `${manga.chapters} ch` : manga.volumes ? `${manga.volumes} vol` : manga.status}
          </div>
        </div>
        {manga.format && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/80 text-primary-foreground">
            {manga.format}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm font-medium text-foreground line-clamp-2">{title}</p>
    </motion.div>
  );
}

export default function MangaPage() {
  const [trending, setTrending] = useState<Manga[]>([]);
  const [popular, setPopular] = useState<Manga[]>([]);
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrendingManga(1, 18), getPopularManga(1, 18)])
      .then(([t, p]) => { setTrending(t); setPopular(p); })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const results = await searchManga(query.trim(), 1, 24);
      setSearchResults(results);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">📖 Manga</h1>
          <p className="text-muted-foreground mb-6">Discover trending and popular manga from AniList</p>

          {/* Search */}
          <div className="flex gap-2 mb-8 max-w-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search manga..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl glass text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <button onClick={handleSearch} className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
              Search
            </button>
          </div>
        </motion.div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4">Search Results</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {searchResults.map((m, i) => <MangaCard key={m.id} manga={m} index={i} />)}
            </div>
          </section>
        )}

        {/* Trending */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">🔥 Trending Manga</h2>
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}><div className="aspect-[2/3] rounded-xl bg-muted animate-pulse" /></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {trending.map((m, i) => <MangaCard key={m.id} manga={m} index={i} />)}
            </div>
          )}
        </section>

        {/* Popular */}
        <section className="mb-10">
          <h2 className="text-xl font-display font-semibold text-foreground mb-4">⭐ Popular Manga</h2>
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i}><div className="aspect-[2/3] rounded-xl bg-muted animate-pulse" /></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {popular.map((m, i) => <MangaCard key={m.id} manga={m} index={i} />)}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
