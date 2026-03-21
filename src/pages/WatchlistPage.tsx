import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Play, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface WatchlistItem {
  id: string;
  anime_id: number;
  anime_title: string;
  anime_image: string | null;
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data as WatchlistItem[]) || []);
        setLoading(false);
      });
  }, [user]);

  const removeItem = async (id: string) => {
    await supabase.from("watchlist").delete().eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <Heart size={48} className="text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Your Watchlist</h1>
          <p className="text-muted-foreground mb-6">Sign in to save anime to your watchlist</p>
          <Link to="/login" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            Sign In
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">My Watchlist</h1>
          <p className="text-muted-foreground mb-8">{items.length} anime saved</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Your watchlist is empty. Start adding anime!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <Link to={`/anime/${item.anime_id}`}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted">
                    {item.anime_image && (
                      <img src={item.anime_image} alt={item.anime_title} className="w-full h-full object-cover" loading="lazy" />
                    )}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Play size={24} className="text-primary" fill="currentColor" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground line-clamp-1">{item.anime_title}</p>
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive/80 flex items-center justify-center text-destructive-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
