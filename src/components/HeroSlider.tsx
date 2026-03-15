import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Play, Plus, Info, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Anime } from "@/lib/types";

interface HeroSliderProps {
  anime: Anime[];
}

export default function HeroSlider({ anime }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const items = anime.slice(0, 6);

  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);
  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  if (!items.length) {
    return (
      <div className="w-full h-[70vh] bg-muted animate-pulse" />
    );
  }

  const item = items[current];
  const title = item.title.english || item.title.romaji;
  const score = item.averageScore ? (item.averageScore / 10).toFixed(1) : null;
  const banner = item.bannerImage || item.coverImage.extraLarge;

  function stripHtml(html: string) {
    const el = document.createElement("div");
    el.innerHTML = html;
    return el.textContent || "";
  }

  return (
    <div className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={banner}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradients */}
      <div className="absolute inset-0 gradient-overlay" />
      <div className="absolute inset-0 gradient-overlay-left" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-16 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              {score && (
                <div className="flex items-center gap-1 glass px-2.5 py-1 rounded-full">
                  <Star size={12} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-semibold text-foreground">{score}</span>
                </div>
              )}
              {item.seasonYear && (
                <span className="text-xs text-muted-foreground">{item.seasonYear}</span>
              )}
              {item.episodes && (
                <span className="text-xs text-muted-foreground">{item.episodes} eps</span>
              )}
              {item.duration && (
                <span className="text-xs text-muted-foreground">{item.duration} min</span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-3 leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {item.genres.slice(0, 4).map((g) => (
                <span
                  key={g}
                  className="px-3 py-1 text-[11px] font-medium rounded-full border border-primary/30 text-primary bg-primary/5"
                >
                  {g}
                </span>
              ))}
            </div>

            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 max-w-lg leading-relaxed">
                {stripHtml(item.description)}
              </p>
            )}

            <div className="flex items-center gap-3">
              <Link
                to={`/anime/${item.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 glow-primary-sm hover:glow-primary transition-all"
              >
                <Play size={16} fill="currentColor" />
                Watch Now
              </Link>
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass text-foreground text-sm font-medium hover:bg-muted/60 transition-colors">
                <Plus size={16} />
                My List
              </button>
              <Link
                to={`/anime/${item.id}`}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Info size={16} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
