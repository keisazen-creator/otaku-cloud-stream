import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, Monitor, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const InstallPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <div className="inline-flex p-4 rounded-full bg-primary/20">
            <Download className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Install OtakuCloud</h1>
          <p className="text-lg text-muted-foreground">
            Install OtakuCloud on your device for the best experience — fast loading, offline access, and a native app feel.
          </p>

          {isInstalled ? (
            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/10">
              <p className="text-primary font-semibold text-lg">✅ OtakuCloud is installed!</p>
            </div>
          ) : deferredPrompt ? (
            <Button onClick={handleInstall} size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              <Download className="mr-2" /> Install Now
            </Button>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <Smartphone className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold text-foreground">iPhone / iPad</h3>
                  <p className="text-sm text-muted-foreground">
                    Tap <Share2 className="inline w-4 h-4" /> Share → "Add to Home Screen"
                  </p>
                </div>
                <div className="p-6 rounded-2xl border border-border bg-card space-y-3">
                  <Monitor className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="font-semibold text-foreground">Android / Desktop</h3>
                  <p className="text-sm text-muted-foreground">
                    Tap the browser menu → "Install app" or "Add to Home Screen"
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default InstallPage;
