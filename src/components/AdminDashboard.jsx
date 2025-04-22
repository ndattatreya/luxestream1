import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUser, FaChartBar, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [movieStatus, setMovieStatus] = useState('draft'); // 'draft' or 'published'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    genre: '',
    posterUrl: '',
    rating: '',
    status: 'draft', // Add status field
    reviews: [], // Add reviews field
    publishDate: null
  });
  const [newMovieData, setNewMovieData] = useState({
    title: '',
    description: '',
    genre: 'Action', // default value
    rating: '',
    posterUrl: '',
    status: 'draft',
    reviews: []
  });
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all'); // Add this state for tracking current filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add this state for managing movie edit modal
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  // Fetch all movies
  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movies');
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setMovies(data);
      } else if (data.success && Array.isArray(data.data)) {
        setMovies(data.data);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Check if we have the data array in the response
      if (result.success && Array.isArray(result.data)) {
        setUsers(result.data);
        setFilteredUsers(result.data);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add useEffect to fetch movies on mount
  useEffect(() => {
    fetchMovies();
  }, []);

  // Add another useEffect to update filteredUsers when users change
  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.role === currentFilter);
      setFilteredUsers(filtered);
    }
  }, [users, currentFilter]);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add this function to handle filtering
  const handleFilterChange = (filterValue) => {
    setCurrentFilter(filterValue);
    if (filterValue === 'all') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => user.role === filterValue);
      setFilteredUsers(filtered);
    }
  };

  // Add or update a movie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMovieId) {
        // Update movie
        await fetch(`http://localhost:5000/api/movies/${editingMovieId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new movie
        await fetch('http://localhost:5000/api/movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setFormData({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        posterUrl: '',
        rating: '',
        status: 'draft',
        reviews: [],
        publishDate: null
      });
      setEditingMovieId(null);
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  // Add handler for new movie submission
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMovieData)
      });

      if (!response.ok) {
        throw new Error('Failed to add movie');
      }

      const result = await response.json();
      
      // Update movies list with new movie
      setMovies(prevMovies => [...prevMovies, result.data]);
      
      // Reset form and close modal
      setShowMovieModal(false);
      setNewMovieData({
        title: '',
        description: '',
        genre: 'Action',
        rating: '',
        posterUrl: '',
        status: 'draft',
        reviews: []
      });
      
      // Show success message
      alert('Movie added successfully');
      
      // Refresh movies list
      await fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
      alert(error.message);
    }
  };

  // Delete a movie
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/movies/${id}`, { method: 'DELETE' });
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  // Update the handleEdit function
  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setShowMovieModal(true);
  };
 
  // Add handleMovieUpdate function
  const handleMovieUpdate = async (movieId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update movie');
      }

      fetchMovies(); // Refresh movies list
      setShowMovieModal(false);
      setEditingMovie(null);
      alert('Movie updated successfully');
    } catch (error) {
      console.error('Error updating movie:', error);
      alert(error.message);
    }
  };

  // Add this function to handle movie publishing
  const handlePublish = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies/${movieId}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'published',
          publishDate: new Date()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish movie');
      }

      fetchMovies(); // Refresh the movies list
    } catch (error) {
      console.error('Error publishing movie:', error);
    }
  };

  // Add these functions to handle review management
  const handleDeleteReview = async (movieId, reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/movies/${movieId}/reviews/${reviewId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      fetchMovies(); // Refresh the movies list
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Promote or demote a user
  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if you have auth
        },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      await fetchUsers(); // Refresh users list
      setFilteredUsers(users); // Update filtered users as well
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role'); // Add user feedback
    }
  };

  // Remove a user
  const handleRemoveUser = async (id) => {
    try {
      // Add confirmation dialog
      const confirmDelete = window.confirm('Are you sure you want to remove this user?');
      if (!confirmDelete) {
        return;
      }

      const response = await fetch(`http://localhost:5000/api/users/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Log the response for debugging
      console.log('Delete response:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove user');
      }

      // Update both users and filteredUsers states after successful removal
      setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
      setFilteredUsers(prevFiltered => prevFiltered.filter(user => user._id !== id));
      
      // Show success message
      alert('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error);
      alert(error.message || 'Failed to remove user');
    }
  };

  // Handle user profile updates
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user (${response.status})`);
      }

      const result = await response.json();

      if (result.success) {
        // Update both users and filteredUsers states
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? result.data : user
          )
        );
        setFilteredUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId ? result.data : user
          )
        );
        setShowUserModal(false);
        alert('User updated successfully');
      } else {
        throw new Error(result.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.message);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/');
  };

  // Calculate analytics
  const totalMovies = movies?.length || 0;

  const averageRating = movies?.length 
    ? movies.reduce((sum, movie) => {
        const rating = parseFloat(movie?.rating) || 0;
        return sum + rating;
      }, 0) / movies.length 
    : 0;

  const moviesByGenre = movies?.reduce((acc, movie) => {
    if (movie?.genre) {
      acc[movie.genre] = (acc[movie.genre] || 0) + 1;
    }
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation Bar */}
      <nav className="bg-black bg-opacity-90 fixed w-full z-50 top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-red-600">LuxeStream Admin</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 mt-16">

        {/* Analytics Section */}
        {/*<section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Movie Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-2">Total Movies</h4>
              <p className="text-3xl font-bold">{totalMovies}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-2">Average Rating</h4>
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mb-2">Movies by Genre</h4>
              <ul>
                {Object.entries(moviesByGenre).map(([genre, count]) => (
                  <li key={genre} className="text-gray-400">
                    {genre}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>*/}

        {/* Movie Management Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Manage Movies</h3>
            <button
              onClick={() => {
                setEditingMovie(null);
                setNewMovieData({
                  title: '',
                  description: '',
                  genre: 'Action',
                  rating: '',
                  posterUrl: '',
                  status: 'draft',
                  reviews: []
                });
                setShowMovieModal(true);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Add New Movie
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="relative">
                  {movie.posterUrl && (
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded text-sm ${
                    movie.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}>
                    {movie.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{movie.title}</h3>
                <p className="text-gray-400 mb-2">{movie.genre}</p>
                <p className="text-gray-400 mb-2">Rating: {movie.rating}</p>
                <p className="text-gray-400 mb-4 line-clamp-2">{movie.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  
                  {movie.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(movie._id)}
                      className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                    >
                      Publish
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
                
                {/* Reviews Section */}
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Reviews ({movie.reviews?.length || 0})</h4>
                  <div className="max-h-40 overflow-y-auto">
                    {movie.reviews?.map((review, index) => (
                      <div key={index} className="bg-gray-700 p-2 rounded mb-2">
                        <p className="text-sm">{review.content}</p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{review.username}</span>
                          <button
                            onClick={() => handleDeleteReview(movie._id, review._id)}
                            className="text-red-400 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* User Management Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Manage Users</h3>
            <div className="flex gap-4">
              <select 
                className="bg-gray-700 text-white px-4 py-2 rounded"
                value={currentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="user">Regular Users</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-4">No users found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{user.username}</h3>
                      <p className="text-gray-400 mb-1">Email: {user.email}</p>
                      <p className="text-gray-400 mb-1">Role: {user.role}</p>
                      <p className="text-gray-400 mb-1">Status: {user.status || 'Active'}</p>
                      <p className="text-gray-400 mb-4">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUserModal(true);
                      }}
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                    >
                      <FaEdit className="inline mr-1" /> Edit Profile
                    </button>
                    
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleRoleChange(user._id, 'admin')}
                        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                      >
                        <FaArrowUp className="inline mr-1" /> Promote
                      </button>
                    )}
                    
                    {user.role === 'admin' && (
                      <button
                        onClick={() => handleRoleChange(user._id, 'user')}
                        className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
                      >
                        <FaArrowDown className="inline mr-1" /> Demote
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleRemoveUser(user._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                    >
                      <FaTrash className="inline mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Edit Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Edit User Profile</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(selectedUser._id, {
                  username: e.target.username.value,
                  email: e.target.email.value,
                  status: e.target.status.value,
                });
              }}>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={selectedUser.username}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedUser.email}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-400 mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedUser.status || 'active'}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Movie Add/Edit Modal */}
        {showMovieModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">
                {editingMovie ? 'Edit Movie' : 'Add New Movie'}
              </h2>
              <form onSubmit={editingMovie ? handleMovieUpdate : handleAddMovie}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editingMovie ? editingMovie.title : newMovieData.title}
                      onChange={(e) => editingMovie 
                        ? setEditingMovie({...editingMovie, title: e.target.value})
                        : setNewMovieData({...newMovieData, title: e.target.value})
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Genre</label>
                    <select
                      name="genre"
                      value={editingMovie ? editingMovie.genre : newMovieData.genre}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, genre: e.target.value})
                        : setNewMovieData({...newMovieData, genre: e.target.value})
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      required
                    >
                      <option value="Action">Action</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Drama">Drama</option>
                      <option value="Horror">Horror</option>
                      <option value="Thriller">Thriller</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="10"
                      step="0.1"
                      value={editingMovie ? editingMovie.rating : newMovieData.rating}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, rating: e.target.value})
                        : setNewMovieData({...newMovieData, rating: e.target.value})
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-400 mb-2">Poster URL</label>
                    <input
                      type="url"
                      name="posterUrl"
                      value={editingMovie ? editingMovie.posterUrl : newMovieData.posterUrl}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, posterUrl: e.target.value})
                        : setNewMovieData({...newMovieData, posterUrl: e.target.value})
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded"
                      required
                    />
                  </div>
                  <div className="mb-4 col-span-2">
                    <label className="block text-gray-400 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={editingMovie ? editingMovie.description : newMovieData.description}
                      onChange={(e) => editingMovie
                        ? setEditingMovie({...editingMovie, description: e.target.value})
                        : setNewMovieData({...newMovieData, description: e.target.value})
                      }
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded h-32"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMovieModal(false);
                      setEditingMovie(null);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {editingMovie ? 'Save Changes' : 'Add Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;