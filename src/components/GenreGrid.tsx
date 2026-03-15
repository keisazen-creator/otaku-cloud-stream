import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const GENRES = [
  { name: "Action", color: "from-red-500/20 to-orange-500/20", border: "border-red-500/20" },
  { name: "Adventure", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20" },
  { name: "Fantasy", color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/20" },
  { name: "Romance", color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/20" },
  { name: "Comedy", color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/20" },
  { name: "Horror", color: "from-gray-500/20 to-zinc-500/20", border: "border-gray-500/20" },
  { name: "Sci-Fi", color: "from-cyan-500/20 to-blue-500/20", border: "border-cyan-500/20" },
  { name: "Slice of Life", color: "from-lime-500/20 to-green-500/20", border: "border-lime-500/20" },
  { name: "Mecha", color: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/20" },
];

export default function GenreGrid() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">Browse by Genre</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GENRES.map((genre, i) => (
            <motion.div
              key={genre.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/genres?genre=${encodeURIComponent(genre.name)}`}
                className={`block p-5 rounded-xl bg-gradient-to-br ${genre.color} border ${genre.border} hover:scale-[1.03] hover:glow-primary-sm transition-all duration-300 text-center`}
              >
                <span className="font-display font-semibold text-sm text-foreground">{genre.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
