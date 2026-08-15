import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Heart, ChevronLeft, ChevronRight, Film, Star } from "lucide-react";
import heroBg from "../assets/h.webp";
import { useFavorites } from "../context/FavoritesContext";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const API_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();

  const rowRef = useRef(null);
  const observerRef = useRef(null);

  const fetchPopular = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/movie/popular`, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch popular movies");
      const data = await response.json();
      setMovies(data.results || []);
    } catch {
      setError("Unable to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearch = useCallback(async (query, pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      const response = await fetch(
        `${API_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to search movies");
      const data = await response.json();

      setSearchResults((prev) =>
        pageNumber === 1 ? data.results : [...prev, ...data.results]
      );
      setPage(pageNumber);
      setHasMore(pageNumber < data.total_pages);
    } catch {
      setError("Unable to search movies. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = search.trim();
      if (query) {
        setPage(1);
        fetchSearch(query, 1);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchSearch]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      rowRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const lastMovieRef = useCallback(
    (node) => {
      if (loadingMore || loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && search.trim()) {
            fetchSearch(search.trim(), page + 1);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, loading, hasMore, page, search, fetchSearch]
  );

  const topFiveMovies = movies.slice(0, 5);
  const remainingMovies = movies.slice(5);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat pb-40 pt-24 sm:pt-32" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-[#020617]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white leading-tight drop-shadow-md">
            Stream Endless Entertainment Anytime
          </h1>

          <p className="mt-4 text-sm sm:text-base text-gray-200 max-w-xl drop-shadow">
            Discover trending blockbusters, search effortlessly, and curate your personal watch list.
          </p>

          <div className="mt-8 flex w-full max-w-xl items-center rounded-xl border border-gray-700 bg-black/80 px-4 shadow-2xl backdrop-blur-md">
            <Search size={20} className="shrink-0 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, blockbusters, genres..."
              className="h-14 w-full bg-transparent px-3 text-sm text-white outline-none placeholder:text-gray-400"
              aria-label="Search movies"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg className="relative block w-full h-12 sm:h-20" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="#020617" />
            <path d="M0,2 C480,82 960,82 1440,2" stroke="#E50914" strokeWidth="3" />
          </svg>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        
        {error && (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-center text-sm text-red-400 mb-6">
            {error}
          </div>
        )}

        {loading && !search.trim() && (
          <div className="py-20 text-center text-sm text-gray-400">Loading movies...</div>
        )}

        {/* --- TOP 5 SLIDER (Optimized width to cover space) --- */}
        {!search.trim() && topFiveMovies.length > 0 && (
          <div className="space-y-4 mb-12">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Top 5 Trending</h2>
              <span className="text-xs sm:text-sm text-gray-400">Top Rated Selection</span>
            </div>

            <div className="relative group">
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>

              <div
                ref={rowRef}
                className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-2 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {topFiveMovies.map((movie, index) => {
                  const posterUrl = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null;
                  const favorite = isFavorite(movie.id);

                  return (
                    <div key={movie.id} className="w-[180px] sm:w-[215px] flex items-center shrink-0">
                      <span className="text-6xl sm:text-8xl font-black text-transparent [-webkit-text-stroke:2px_#64748b] select-none -mr-8 z-10">
                        {index + 1}
                      </span>

                      <article className="group/card relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-md transition duration-300 hover:-translate-y-1 hover:border-gray-700 w-full">
                        <div className="relative aspect-[2/3] overflow-hidden bg-gray-950">
                          {posterUrl ? (
                            <img
                              src={posterUrl}
                              alt={movie.title}
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
                            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black"
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
                            {movie.title}
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
                })}
              </div>

              <button
                onClick={() => handleScroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* --- REMAINING MOVIES GRID --- */}
        {!search.trim() && remainingMovies.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">More Movies</h2>
              <span className="text-xs sm:text-sm text-gray-400">{remainingMovies.length} titles</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {remainingMovies.map((movie) => {
                const posterUrl = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null;
                const favorite = isFavorite(movie.id);

                return (
                  <article
                    key={movie.id}
                    className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-md transition duration-300 hover:-translate-y-1 hover:border-gray-700"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-950">
                      {posterUrl ? (
                        <img
                          src={posterUrl}
                          alt={movie.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-2 text-center text-xs text-gray-500">
                          <Film className="w-8 h-8 mb-1" /> No Poster
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleFavorite(movie)}
                        className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black"
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
                        {movie.title}
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
                );
              })}
            </div>
          </div>
        )}

        {/* --- SEARCH RESULTS GRID --- */}
        {search.trim() && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Search Results for "{search}"
              </h2>
              <span className="text-xs sm:text-sm text-gray-400">{searchResults.length} titles</span>
            </div>

            {searchResults.length === 0 && !loading ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 py-20 text-center">
                <p className="text-base text-gray-300">No movies found</p>
                <p className="mt-1 text-xs text-gray-500">Try searching for another movie title.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {searchResults.map((movie, index) => {
                  const lastMovie = index === searchResults.length - 1;
                  const posterUrl = movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null;
                  const favorite = isFavorite(movie.id);

                  return (
                    <article
                      key={`${movie.id}-${index}`}
                      ref={lastMovie ? lastMovieRef : null}
                      className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-md transition duration-300 hover:-translate-y-1 hover:border-gray-700"
                    >
                      <div className="relative aspect-[2/3] overflow-hidden bg-gray-950">
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={movie.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-2 text-center text-xs text-gray-500">
                            <Film className="w-8 h-8 mb-1" /> No Poster
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleFavorite(movie)}
                          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur transition hover:bg-black"
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
                          {movie.title}
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
                  );
                })}
              </div>
            )}
          </div>
        )}

        {loadingMore && (
          <div className="py-8 text-center text-xs text-gray-400">Loading more movies...</div>
        )}
      </section>
    </main>
  );
}

export default Home;