import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [imdbRating, setImdbRating] = useState(null);
  const [imdbDetails, setImdbDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=012c99e22d2da82680b0e1206ac07ffa`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchImdbDetails = async () => {
      if (!movie?.title) return;
      try {
        const response = await fetch(`http://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&apikey=951519c3&plot=full`);
        const data = await response.json();
        if (data.Response === "True") {
          setImdbRating(data.imdbRating);
          setImdbDetails(data);
        }
      } catch (error) {
        console.error('Error fetching IMDb details:', error);
      }
    };

    fetchImdbDetails();
  }, [movie?.title]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=012c99e22d2da82680b0e1206ac07ffa`);
        const data = await response.json();
        setReviews(data.results.slice(0, 5));
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  const handlePayment = () => {
    const options = {
      key: 'rzp_test_5NFOiDIrADrIHb', // Replace with your Razorpay test key
      amount: 50000, // Amount in paise (50000 paise = ₹500)
      currency: 'INR',
      name: `${movie.title} Movie Rental`,
      description: `Rent ${movie.title} for 48 hours`,
      handler: function (response) {
        console.log('Payment successful:', response);
        alert('Payment successful! Redirecting to video...');
        navigate('/video', { state: { movie } });
      },
      prefill: {
        name: 'User Name',
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!movie) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Toggle Button */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="text-xl font-bold">
            LuxeStream
          </Link>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="container mx-auto px-3 md:px-4 py-3 md:py-8 max-w-7xl mt-16">
        {/* Mobile Hero Section */}
        <div className="md:hidden mb-4">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title}
            className="w-full h-auto rounded-lg shadow-lg" 
          />
          <h1 className="text-xl font-bold mt-3">{movie.title}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Movie Poster - Desktop */}
          <div className="hidden md:block md:w-1/3">
            <div className="md:sticky md:top-24">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-[80vh] object-cover rounded-lg shadow-lg" 
              />
            </div>
          </div>

          {/* Movie Details */}
          <div className="w-full md:w-2/3">
            <h1 className="hidden md:block text-3xl md:text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="space-y-3 md:space-y-6">
              <p className="text-sm md:text-base text-gray-300">{movie.overview}</p>
              
              {/* Payment Section */}
              <div className="bg-gray-900 p-4 md:p-6 rounded-lg">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Rent This Movie</h2>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-sm md:text-base text-gray-300">Rent for 48 hours</p>
                    <p className="text-2xl md:text-3xl font-bold text-white">₹500</p>
                  </div>
                  <button
                    onClick={handlePayment}
                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Rent Now
                  </button>
                </div>
              </div>

              {/* IMDb Details */}
              {imdbDetails && (
                <div className="bg-gray-900 p-3 md:p-6 rounded-lg">
                  <h2 className="text-base md:text-xl font-semibold mb-2 md:mb-4">IMDb Details</h2>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-400">IMDb Rating</p>
                      <p className="text-sm md:text-lg text-white">{imdbRating}/10</p>
                    </div>
                    <div className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-400">IMDb Votes</p>
                      <p className="text-sm md:text-lg text-white">{imdbDetails.imdbVotes}</p>
                    </div>
                    <div className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-400">Director</p>
                      <p className="text-sm md:text-lg text-white line-clamp-2">{imdbDetails.Director}</p>
                    </div>
                    <div className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-400">Writers</p>
                      <p className="text-sm md:text-lg text-white line-clamp-2">{imdbDetails.Writer}</p>
                    </div>
                    <div className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-400">Genre</p>
                      <p className="text-sm md:text-lg text-white line-clamp-2">{imdbDetails.Genre}</p>
                    </div>
                    <div className="p-2 md:p-3">
                      <p className="text-xs md:text-sm text-gray-400">Awards</p>
                      <p className="text-sm md:text-lg text-white line-clamp-2">{imdbDetails.Awards}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Movie Stats */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-400">Release Date</p>
                  <p className="text-sm md:text-base text-white">{movie.release_date}</p>
                </div>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-400">Runtime</p>
                  <p className="text-sm md:text-base text-white">{movie.runtime} minutes</p>
                </div>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-400">Language</p>
                  <p className="text-sm md:text-base text-white">{movie.original_language.toUpperCase()}</p>
                </div>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-400">Budget</p>
                  <p className="text-sm md:text-base text-white">${movie.budget.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 p-2 md:p-4 rounded-lg">
                  <p className="text-xs md:text-sm text-gray-400">Revenue</p>
                  <p className="text-sm md:text-base text-white">${movie.revenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Reviews Section */}
              {reviews.length > 0 && (
                <div className="mt-4 md:mt-8">
                  <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Top Reviews</h2>
                  <div className="space-y-2 md:space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-900 p-2 md:p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <p className="text-xs md:text-base font-semibold">{review.author}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xs md:text-sm text-gray-300 line-clamp-3 md:line-clamp-none">{review.content}</p>
                        <div className="mt-1 md:mt-2">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs md:text-sm text-gray-400 ml-1">{review.author_details.rating}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 