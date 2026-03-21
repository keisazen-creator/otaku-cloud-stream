import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "./AnimeCard";
import type { Anime } from "@/lib/types";

interface ContentSectionProps {
  title: string;
  anime: Anime[];
  loading?: boolean;
  viewAllPath?: string;
}

export default function ContentSection({ title, anime, loading, viewAllPath }: ContentSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-foreground">{title}</h2>
          <div className="flex items-center gap-2">
            {viewAllPath && (
              <Link to={viewAllPath} className="text-xs text-primary hover:underline mr-2">
                View All
              </Link>
            )}
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 lg:px-8"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px]">
                <div className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
                <div className="mt-2 h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="mt-1 h-3 w-1/2 bg-muted rounded animate-pulse" />
              </div>
            ))
          : anime.map((a, i) => <AnimeCard key={a.id} anime={a} index={i} />)}
      </div>
    </section>
  );
}
