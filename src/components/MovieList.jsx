import React from 'react';

const MovieList = ({ movies }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">New Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            {movie.posterUrl && (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4"> 
              <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
              <p className="text-sm text-gray-400 mb-2">{movie.genre}</p>
              <p className="text-sm text-gray-400 mb-2">Rating: {movie.rating}/10</p>
              <p className="text-sm text-gray-400 line-clamp-2">{movie.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MovieList;