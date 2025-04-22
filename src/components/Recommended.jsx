import React, { useEffect, useState } from "react";

const Recommended = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Step 1: Get recommendations from Flask API
    fetch("http://localhost:5001/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
        const movieIds = data.map((m) => m.movie_id);
        return fetch("/api/movie-details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movieIds }),
        });
      })
      .then((res) => res.json())
      .then((movieData) => setMovies(movieData));
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-bold">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-gray-900 p-4 rounded-xl">
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded" />
            <p className="text-white mt-2">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}; 

export default Recommended;