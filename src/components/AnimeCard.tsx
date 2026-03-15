import { Link } from "react-router-dom";
import { Play, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Anime } from "@/lib/types";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

export default function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;
  const score = anime.averageScore ? (anime.averageScore / 10).toFixed(1) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative flex-shrink-0 w-[160px] sm:w-[180px]"
    >
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted">
          <img
            src={anime.coverImage.extraLarge || anime.coverImage.large}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center glow-primary scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play size={20} className="text-primary-foreground ml-0.5" fill="currentColor" />
            </div>
          </div>
          {/* Score badge */}
          {score && (
            <div className="absolute top-2 left-2 glass px-2 py-0.5 flex items-center gap-1 rounded-md">
              <Star size={10} className="text-yellow-400" fill="currentColor" />
              <span className="text-[10px] font-semibold text-foreground">{score}</span>
            </div>
          )}
          {/* Add to list */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-background/80 transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="mt-2 px-0.5">
          <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
            {anime.genres.slice(0, 2).join(" • ")}
            {anime.seasonYear && ` • ${anime.seasonYear}`}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
