import { useCallback, useEffect, useRef, useState } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "../assets/h.webp";
import { useFavorites } from "../context/FavoritesContext";
import AiMoodMatcher from "../components/AiMoodMatcher";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { fetchPopularMovies, searchMovies } from "../api/tmdb";

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

  const loadPopularMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchPopularMovies();
      setMovies(data.results || []);
    } catch {
      setError("Unable to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSearchResults = useCallback(async (query, pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      const data = await searchMovies(query, pageNumber);

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
    loadPopularMovies();
  }, [loadPopularMovies]);

  useEffect(() => {
    const query = search.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setPage(1);
      loadSearchResults(query, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, loadSearchResults]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
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
            loadSearchResults(search.trim(), page + 1);
          }
        },
        { rootMargin: "200px" }
      );

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, loading, hasMore, page, search, loadSearchResults]
  );

  const handleMovieMatched = (movieTitle) => {
    setSearch(movieTitle);
  };

  const topFiveMovies = movies.slice(0, 5);
  const remainingMovies = movies.slice(5);

  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <section
        className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat pb-32 pt-20 sm:pt-28 md:pt-32"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-[#020617]" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center sm:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Stream Endless Entertainment Anytime
          </h1>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-200 max-w-xl drop-shadow">
            Discover trending blockbusters, search effortlessly, and curate your personal watch list.
          </p>

          <div className="mt-6 w-full">
            <AiMoodMatcher onMovieMatched={handleMovieMatched} />
          </div>

          <div className="mt-2 flex w-full max-w-xl items-center rounded-xl border border-gray-700 bg-black/80 px-3 sm:px-4 shadow-2xl backdrop-blur-md">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies, blockbusters, genres..."
              className="h-12 sm:h-14 w-full bg-transparent px-2 sm:px-3 text-xs sm:text-sm text-white outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:appearance-none"
              aria-label="Search movies"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 text-red-500 hover:text-red-400 transition p-1"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg className="relative block w-full h-10 sm:h-16" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="#020617" />
            <path d="M0,2 C480,82 960,82 1440,2" stroke="#E50914" strokeWidth="3" />
          </svg>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pb-20 pt-2">
        {error && (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-center text-xs sm:text-sm text-red-400 mb-6">
            {error}
          </div>
        )}

        {loading && !search.trim() && <Loader />}

        {!search.trim() && topFiveMovies.length > 0 && (
          <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-12">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Top 5 Trending</h2>
              <span className="text-[11px] sm:text-xs text-gray-400">Top Rated Selection</span>
            </div>

            <div className="relative group">
              <button
                onClick={() => handleScroll("left")}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition duration-300"
                aria-label="Scroll left"
              >
                <ChevronLeft size={24} />
              </button>

              <div
                ref={rowRef}
                className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-2 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {topFiveMovies.map((movie, index) => (
                  <div key={movie.id} className="w-[150px] sm:w-[180px] md:w-[215px] flex items-center shrink-0">
                    <MovieCard
                      movie={movie}
                      rank={index + 1}
                      isFavorite={isFavorite}
                      toggleFavorite={toggleFavorite}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleScroll("right")}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition duration-300"
                aria-label="Scroll right"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {!search.trim() && remainingMovies.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">More Movies</h2>
              <span className="text-[11px] sm:text-xs text-gray-400">{remainingMovies.length} titles</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {remainingMovies.map((movie) => (
                <div key={movie.id}>
                  <MovieCard
                    movie={movie}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {search.trim() && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-left text-white truncate max-w-[70%]">
                Search Results for &quot;{search}&quot;
              </h2>
              <span className="text-[11px] sm:text-xs text-gray-400">{searchResults.length} titles</span>
            </div>

            {searchResults.length === 0 && !loading ? (
              <div className="rounded-xl border border-gray-800 bg-gray-900/40 py-16 text-center">
                <p className="text-sm sm:text-base text-gray-300">No movies found</p>
                <p className="mt-1 text-xs text-gray-500">Try searching for another movie title.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {searchResults.map((movie, index) => {
                  const lastMovie = index === searchResults.length - 1;
                  return (
                    <div key={`${movie.id}-${index}`} ref={lastMovie ? lastMovieRef : null}>
                      <MovieCard
                        movie={movie}
                        isFavorite={isFavorite}
                        toggleFavorite={toggleFavorite}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {loadingMore && <Loader />}
      </section>
    </main>
  );
}

export default Home;