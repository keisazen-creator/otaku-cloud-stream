import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Settings, LogOut, Heart, Clock, Film, Star, Edit } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  total_anime_watched: number;
  total_episodes_watched: number;
  total_watch_time_minutes: number;
}

export default function ProfilePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    (supabase as any)
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }: any) => setProfile(data));

    (supabase as any)
      .from("watchlist")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }: any) => setWatchlistCount(count || 0));
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-muted animate-pulse mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4 lg:px-8 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="glass p-8 text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <User size={32} className="text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground mb-1">Guest User</h1>
              <p className="text-sm text-muted-foreground mb-6">Sign in to track your anime and save your watchlist</p>
              <Link to="/login" className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = profile?.display_name || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 lg:px-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
          <div className="glass p-8 text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-primary" />
              )}
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-1">{displayName}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {profile?.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Film, label: "Anime", value: profile?.total_anime_watched || 0 },
              { icon: Star, label: "Episodes", value: profile?.total_episodes_watched || 0 },
              { icon: Clock, label: "Hours", value: Math.round((profile?.total_watch_time_minutes || 0) / 60) },
            ].map((stat) => (
              <div key={stat.label} className="glass p-4 text-center">
                <stat.icon size={18} className="text-primary mx-auto mb-2" />
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {[
              { icon: Heart, label: "My Watchlist", desc: `${watchlistCount} anime saved`, path: "/watchlist" },
              { icon: Clock, label: "Watch History", desc: "Continue where you left off", path: "/" },
              { icon: Settings, label: "Settings", desc: "Preferences & notifications" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item.path ? (
                  <Link to={item.path} className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-muted/60 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </Link>
                ) : (
                  <button className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-muted/60 transition-colors text-left">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </button>
                )}
              </motion.div>
            ))}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => { signOut(); navigate("/"); }}
              className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-destructive/10 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <LogOut size={18} className="text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your account</p>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
