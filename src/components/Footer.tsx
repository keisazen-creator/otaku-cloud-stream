import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">O</span>
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                Otaku<span className="text-gradient">Cloud</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premium anime streaming platform. Watch thousands of anime titles for free.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Browse</h4>
            <div className="flex flex-col gap-2">
              {["Trending", "Popular", "Top Rated", "New Releases"].map((item) => (
                <Link key={item} to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Genres</h4>
            <div className="flex flex-col gap-2">
              {["Action", "Romance", "Fantasy", "Sci-Fi"].map((item) => (
                <Link key={item} to="/genres" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Connect</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                <Github size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 OtakuCloud. All anime data provided by AniList. This site does not host any media files.
          </p>
        </div>
      </div>
    </footer>
  );
}
