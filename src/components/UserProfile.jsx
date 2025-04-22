import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHistory, FaCrown, FaHeart, FaCog, FaChartLine, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useAuth } from '../authContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  const [watchHistory, setWatchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [watchTimeData, setWatchTimeData] = useState({});
  const [plans] = useState([
    { name: 'Basic', amount: 499 },
    { name: 'Standard', amount: 799 },
    { name: 'Premium', amount: 1200 }
  ]);
  const [isChangingPlan, setIsChangingPlan] = useState(false);

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line
  }, [user?._id]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?._id) {
        throw new Error('Authentication required');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const responses = await Promise.allSettled([
        fetch(`http://localhost:5000/api/users/${user._id}/watch-history`, { headers }),
        fetch(`http://localhost:5000/api/users/${user._id}/favorites`, { headers }),
        fetch(`http://localhost:5000/api/users/${user._id}/subscription`, { headers })
      ]);

      const [historyRes, favoritesRes, subscriptionRes] = responses;

      if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
        const history = await historyRes.value.json();
        setWatchHistory(history.data);
      }

      if (favoritesRes.status === 'fulfilled' && favoritesRes.value.ok) {
        const favorites = await favoritesRes.value.json();
        setFavorites(favorites.data);
      }

      if (subscriptionRes.status === 'fulfilled' && subscriptionRes.value.ok) {
        const subscription = await subscriptionRes.value.json();
        setSubscriptionData(subscription.data);
      }

      // Process watch time data
      const watchTimeByGenre = (historyRes.status === 'fulfilled' && historyRes.value.ok)
        ? (await historyRes.value.json()).data.reduce((acc, movie) => {
          acc[movie.genre] = (acc[movie.genre] || 0) + (movie.watchTime || 0);
          return acc;
        }, {})
        : {};
      setWatchTimeData(watchTimeByGenre);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetch favorites
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/users/${user._id}/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.data);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  // Fetch on mount and when tab changes to 'favorites'
  useEffect(() => {
    if (activeTab === 'favorites') {
      fetchFavorites();
    }
  }, [activeTab, user?._id]);

  // Remove a movie from watch history
  const handleRemoveHistory = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${user._id}/watch-history/${movieId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWatchHistory(watchHistory.filter(m => m._id !== movieId));
    } catch (err) {
      alert('Failed to remove from history');
    }
  };

  // Remove a movie from favorites
  const handleRemoveFavorite = async (movieId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${user._id}/favorites/${movieId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFavorites(favorites.filter(m => m._id !== movieId));
    } catch (err) {
      alert('Failed to remove from favorites');
    }
  };

  // Add a movie to favorites (for demo, add first movie from history)
  const handleAddFavorite = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${user._id}/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieId: movie._id })
      });
      setFavorites([...favorites, movie]);
    } catch (err) {
      alert('Failed to add to favorites');
    }
  };

  // Change subscription plan
  const handleChangePlan = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${user._id}/subscription`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planName: plan.name, amount: plan.amount })
      });
      setSubscriptionData({
        ...subscriptionData,
        planName: plan.name,
        amount: plan.amount,
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      setIsChangingPlan(false);
    } catch (err) {
      alert('Failed to change plan');
    }
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/users/${user._id}/subscription`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSubscriptionData(null);
    } catch (err) {
      alert('Failed to cancel subscription');
    }
  };

  // Responsive Watch History
  const renderWatchHistory = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {watchHistory.length === 0 && (
        <div className="text-center text-gray-400 col-span-full">No watch history yet.</div>
      )}
      {watchHistory.map((movie) => (
        <div key={movie._id} className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-24 h-36 object-cover rounded shadow"
          />
          <div className="flex-1 w-full">
            <h3 className="font-bold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-400">Watched on: {new Date(movie.watchedAt).toLocaleDateString()}</p>
            <p className="text-sm text-gray-400">Watch time: {Math.round(movie.watchTime / 60)} mins</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center text-xs"
                onClick={() => handleRemoveHistory(movie._id)}
              >
                <FaTrash className="mr-1" /> Remove
              </button>
              {!favorites.find(f => f._id === movie._id) && (
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center text-xs"
                  onClick={() => handleAddFavorite(movie)}
                >
                  <FaPlus className="mr-1" /> Add to Favorites
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Responsive Favorites
  const renderFavorites = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.length === 0 && (
        <div className="text-center text-gray-400 col-span-full">No favorites yet.</div>
      )}
      {favorites.map((movie) => (
        <div key={movie._id} className="bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-24 h-36 object-cover rounded shadow"
          />
          <div className="flex-1 w-full">
            <h3 className="font-bold mb-2">{movie.title}</h3>
            <p className="text-sm text-gray-400">{movie.genre}</p>
            <p className="text-sm text-gray-400">Rating: {movie.rating}/10</p>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center text-xs mt-2"
              onClick={() => handleRemoveFavorite(movie._id)}
            >
              <FaMinus className="mr-1" /> Remove from Favorites
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Responsive Subscription with plan change/cancel
  const renderSubscription = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Current Plan</h3>
        {subscriptionData ? (
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <div>
                <p className="font-bold text-lg">{subscriptionData.planName}</p>
                <p className="text-gray-400">₹{subscriptionData.amount}/month</p>
              </div>
              <FaCrown className="text-yellow-500 text-2xl" />
            </div>
            <div className="space-y-2">
              <p>Status: <span className="text-green-500">Active</span></p>
              <p>Next billing date: {new Date(subscriptionData.nextBilling).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setIsChangingPlan(!isChangingPlan)}
              >
                {isChangingPlan ? 'Cancel' : 'Change Plan'}
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            </div>
            {isChangingPlan && (
              <div className="mt-4 flex flex-col gap-2">
                {plans.map(plan => (
                  <button
                    key={plan.name}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    onClick={() => handleChangePlan(plan)}
                  >
                    {plan.name} - ₹{plan.amount}/month
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-4">No active subscription.</p>
            <div className="flex flex-col gap-2">
              {plans.map(plan => (
                <button
                  key={plan.name}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleChangePlan(plan)}
                >
                  Subscribe to {plan.name} - ₹{plan.amount}/month
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Responsive Analytics
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Watch Time by Genre</h3>
        <div className="h-64">
          <Pie
            data={{
              labels: Object.keys(watchTimeData),
              datasets: [{
                data: Object.values(watchTimeData),
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF'
                ]
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Viewing Activity</h3>
        <div className="h-64">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                label: 'Hours Watched',
                data: [10, 15, 8, 12, 9, 14],
                borderColor: '#FF6384',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  // Responsive Settings
  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Account Settings</h3>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Email Notifications</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                New releases
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                Recommendations
              </label>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Playback Settings</label>
            <select className="bg-gray-700 w-full p-2 rounded">
              <option>Auto-play next episode</option>
              <option>Ask before playing next</option>
            </select>
          </div>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={user?.profileImage || 'https://res.cloudinary.com/ds48qgepn/image/upload/v1745156571/th_ijcfgb.jpg'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user?.username}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-gray-400">
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg h-fit">
            <nav className="space-y-2">
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${activeTab === 'history' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('history')}
              >
                <FaHistory /> Watch History
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${activeTab === 'subscription' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('subscription')}
              >
                <FaCrown /> Subscription
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${activeTab === 'favorites' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('favorites')}
              >
                <FaHeart /> Favorites
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${activeTab === 'analytics' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('analytics')}
              >
                <FaChartLine /> Analytics
              </button>
              <button
                className={`w-full text-left px-4 py-2 rounded flex items-center gap-3 ${activeTab === 'settings' ? 'bg-red-600' : 'hover:bg-gray-700'}`}
                onClick={() => setActiveTab('settings')}
              >
                <FaCog /> Settings
              </button>
            </nav>
          </div>

          <div className="md:col-span-4">
            {activeTab === 'history' && renderWatchHistory()}
            {activeTab === 'subscription' && renderSubscription()}
            {activeTab === 'favorites' && renderFavorites()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
