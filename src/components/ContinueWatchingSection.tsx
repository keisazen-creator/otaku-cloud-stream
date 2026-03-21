import { Link } from "react-router-dom";
import { Play, X } from "lucide-react";
import { motion } from "framer-motion";
import { useContinueWatching } from "@/hooks/useContinueWatching";

export default function ContinueWatchingSection() {
  const { items, removeItem } = useContinueWatching();

  if (items.length === 0) return null;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-xl font-display font-semibold text-foreground mb-4">▶️ Continue Watching</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 lg:px-8">
        {items.map((item, i) => (
          <motion.div
            key={item.animeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative flex-shrink-0 w-[200px]"
          >
            <Link to={`/watch/${item.animeId}?ep=${item.episode}`} className="block">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <img src={item.animeImage} alt={item.animeTitle} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Play size={16} className="text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/60">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(item.progress * 100).toFixed(0)}%` }} />
                </div>
              </div>
              <div className="mt-2 px-0.5">
                <h3 className="text-xs font-medium text-foreground line-clamp-1">{item.animeTitle}</h3>
                <p className="text-[10px] text-muted-foreground">EP {item.episode} / {item.totalEpisodes}</p>
              </div>
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); removeItem(item.animeId); }}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
