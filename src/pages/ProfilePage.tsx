import { motion } from "framer-motion";
import { User, Settings, LogOut, Heart, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
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
            <p className="text-sm text-muted-foreground">Sign in to track your anime and save your watchlist</p>
          </div>

          <div className="space-y-2">
            {[
              { icon: Heart, label: "My Watchlist", desc: "Your saved anime" },
              { icon: Clock, label: "Watch History", desc: "Continue where you left off" },
              { icon: Settings, label: "Settings", desc: "Preferences & notifications" },
              { icon: LogOut, label: "Sign Out", desc: "Log out of your account" },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full flex items-center gap-4 p-4 rounded-xl glass hover:bg-muted/60 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
