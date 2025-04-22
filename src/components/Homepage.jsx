import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import Footer from './Footer';
import { ThemeToggle } from './ThemeContext';

const Homepage = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=012c99e22d2da82680b0e1206ac07ffa');
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (email) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <header className="flex justify-between items-center p-2 md:p-4 bg-black bg-opacity-75">
        <h1 className="text-xl md:text-3xl font-bold text-red-600">LuxeStream</h1>
        <ThemeToggle />
        <Link
          to="/userlogin"
          className="text-sm md:text-base text-white border border-gray-300 px-2 md:px-4 py-1 md:py-2 rounded hover:bg-gray-300 hover:text-black transition duration-300 no-underline"
        >
          Sign In
        </Link>
      </header>
      <div
        className="relative h-[40vh] md:h-[60vh] w-full bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative h-full container mx-auto px-3 md:px-4 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">Unlimited movies, TV shows and more</h1>
          <p className="text-base md:text-xl mb-2 md:mb-4">Starts at ₹149. Cancel at any time.</p>
          <p className="text-sm md:text-lg mb-2 md:mb-4">
            Ready to watch? Enter your email to create or restart your membership.
          </p> 
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="p-2 md:p-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={handleGetStarted}
              className="bg-red-600 text-white py-2 md:py-4 px-4 md:px-8 rounded font-semibold hover:bg-red-700 transition duration-300"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">Trending Now</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;