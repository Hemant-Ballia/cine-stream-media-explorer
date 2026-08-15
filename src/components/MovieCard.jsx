import { Film, Heart, Star } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { getImageUrl } from "../utils/helpers";

export default function MovieCard({ movie, rank }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  if (!movie) return null;

  const posterUrl = getImageUrl(movie.poster_path);
  const favorite = isFavorite(movie.id);

  return (
    <div className="flex items-center shrink-0 w-full">
      {rank && (
        <span className="text-6xl sm:text-8xl font-black text-transparent [-webkit-text-stroke:2px_#64748b] select-none -mr-8 z-10">
          {rank}
        </span>
      )}
      <article className="group/card relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-md transition duration-300 hover:-translate-y-1 hover:border-gray-700 w-full">
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-950">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || "Movie poster"}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-xs text-gray-500">
              <Film className="w-8 h-8 mb-1" /> No Poster
            </div>
          )}

          <button
            type="button"
            onClick={() => toggleFavorite(movie)}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-black/60 backdrop-blur transition hover:bg-black"
            aria-label="Toggle favorite"
          >
            <Heart
              size={16}
              className={favorite ? "fill-red-500 text-red-500" : "text-white"}
            />
          </button>
        </div>

        <div className="p-3">
          <h3 className="truncate text-sm font-medium text-white" title={movie.title}>
            {movie.title || "Unknown Title"}
          </h3>
          <div className="mt-1.5 flex items-center justify-between text-xs text-gray-400">
            <span>{movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}</span>
            <span className="text-gray-300 flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}