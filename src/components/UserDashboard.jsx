import React, { useState, useEffect } from "react";
import { useAuth } from "../authContext";
import { Link, useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const BACKEND = import.meta.env.VITE_BACKEND_URL;

  const [featuredContent, setFeaturedContent] = useState(null);
  const [topMovies, setTopMovies] = useState([]);
  const [freeMovies, setFreeMovies] = useState([]);
  const [paidMovies, setPaidMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [continueWatchingMovies, setContinueWatchingMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH Movies from Backend (Admin Uploaded Movies)
  useEffect(() => {
    async function fetchDBMovies() {
      try {
        const res = await fetch(`${BACKEND}/api/movies`);
        const data = await res.json();
        const published = data.filter((m) => m.status === "published");

        setMovies(
          published.map((m) => ({
            ...m,
            poster_path: m.posterUrl,
            vote_average: m.rating,
          }))
        );
      } catch (err) {
        console.error("Error fetching DB movies:", err);
      }
    }
    fetchDBMovies();
  }, []);

  // TMDB API Calls via Backend Proxy
  const fetchFromAPI = async (path, setter, slice = null) => {
    try {
      const res = await fetch(`${BACKEND}/api/tmdb/${path}`);
      const result = await res.json();
      const list = result.data?.results || [];

      setter(slice ? list.slice(0, slice) : list);
    } catch (err) {
      console.error(path, err);
    }
  };

  useEffect(() => {
    fetchFromAPI("popular", setFeaturedContent);
    fetchFromAPI("top-rated", setTopMovies, 10);
    fetchFromAPI("free", setFreeMovies);
    fetchFromAPI("premium", setPaidMovies);
    fetchFromAPI("trending", setTrendingMovies, 10);

    fetchFromAPI("genres", (g) => setGenres(g.data.genres));
    fetchFromAPI("continue", setContinueWatchingMovies, 6);
    fetchFromAPI("recommended", setRecommendedMovies, 6);

    setLoading(false);
  }, []);

  // SEARCH Filter
  useEffect(() => {
    if (!searchQuery.trim()) setFilteredMovies(movies);
    else {
      setFilteredMovies(
        movies.filter((m) =>
          m.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, movies]);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin h-10 w-10 border-2 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <nav className="bg-black bg-opacity-90 fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link to="/home" className="text-2xl font-bold text-red-600">
            LuxeStream
          </Link>

          <div className="flex items-center space-x-4">
            <input
              placeholder="Search..."
              className="bg-gray-800 text-sm px-3 py-2 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className="bg-red-600 px-3 py-2 rounded hover:bg-red-700"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Featured Banner */}
      {featuredContent && (
        <div
          className="mt-16 h-[60vh] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredContent.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black"></div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        {/* DB NEW MOVIES */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Exclusive LuxeStream Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} isPaid={true} />
            ))}
          </div>
        </section>

        {/* TMDB CATEGORIES */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Top Rated</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topMovies.map((m) => (
              <MovieCard key={`top-${m.id}`} movie={m} isPaid={true} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            Premium Movies
            <span className="ml-3 px-2 bg-red-600 text-xs rounded-full">
              Subscription Needed
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {paidMovies.map((m) => (
              <MovieCard key={`paid-${m.id}`} movie={m} isPaid={true} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trendingMovies.map((m) => (
              <MovieCard key={`trend-${m.id}`} movie={m} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
