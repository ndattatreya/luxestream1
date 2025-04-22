import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext'; // Add this import

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const getPosterUrl = (poster_path) => {
  if (poster_path?.startsWith('http')) {
    return poster_path;
  } else if (poster_path?.startsWith('/')) {
    return `https://image.tmdb.org/t/p/w500${poster_path}`;
  }
  return poster_path || '/placeholder-poster.jpg';
};

const MovieCard = ({ movie, isPaid, progress, onClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [imdbRating, setImdbRating] = useState("N/A");

  useEffect(() => {
    const fetchImdbRating = async () => {
      try {
        const searchYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
        const url = movie.imdb_id
          ? `http://www.omdbapi.com/?apikey=951519c3&i=${movie.imdb_id}`
          : `http://www.omdbapi.com/?apikey=951519c3&t=${encodeURIComponent(movie.title)}&y=${searchYear}`;
        
        console.log("Fetching OMDb data for:", movie.title, searchYear);

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.Response === "True") {
          const titleMatches = data.Title.toLowerCase().trim() === movie.title.toLowerCase().trim();
          const yearMatches = !searchYear || data.Year.includes(searchYear.toString());
          
          if (movie.imdb_id) {
            setImdbRating(data.imdbRating || "N/A");
          } else if (titleMatches && yearMatches) {
            setImdbRating(data.imdbRating || "N/A");
            if (data.imdbID) {
              movie.imdb_id = data.imdbID;
            }
          } else {
            console.log(`Title mismatch: ${data.Title} vs ${movie.title}`);
            setImdbRating("N/A");
          }
        } else {
          console.log(`No match found for: ${movie.title}`);
          setImdbRating("N/A");
        }
      } catch (error) {
        console.error("Error fetching IMDb rating:", error);
        setImdbRating("N/A");
      }
    };

    if (movie.title) {
      fetchImdbRating();
    }
  }, [movie.title, movie.imdb_id, movie.release_date]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handlePayment = async () => {
    try {
      const movieId = movie._id || movie.id; // Ensure we have a valid ID
      if (!movieId) {
        throw new Error('Invalid movie ID');
      }
 
      const token = localStorage.getItem('token');
      const orderResponse = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: 1200,
          movieId: movieId,
          userId: user?._id
        })
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LuxeStream',
        description: `Payment for ${movie.title}`,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('http://localhost:5000/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?._id,
                movieId: movieId
              })
            });

            if (verifyResponse.ok) {
              alert('Payment successful!');
              navigate(`/movie/${movie.id}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.username || '',
          email: user?.email || ''
        },
        theme: {
          color: '#dc2626'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  return (
    <div 
      className="relative group cursor-pointer" 
      onClick={onClick}
    >
      <Link 
        to={`/moviedetails/${movie.id}`} 
        className="block"
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 shadow-lg group">
          <div className="relative pb-[150%]">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-poster.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <h3 className="text-xs md:text-sm font-semibold text-white line-clamp-2">{movie.title}</h3>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-xs md:text-sm">★</span>
                <span className="text-gray-200 text-xs md:text-sm ml-1">{imdbRating}</span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 md:p-4 flex flex-col justify-end">
              <h3 className="text-sm md:text-base font-semibold text-white mb-1 md:mb-2">{movie.title}</h3>
              <p className="text-xs md:text-sm text-gray-300 line-clamp-3 md:line-clamp-4">{movie.overview}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-xs md:text-sm">★</span>
                  <span className="text-gray-200 text-xs md:text-sm ml-1">{imdbRating}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate('/login');
                  }}
                  className="bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Watch Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;