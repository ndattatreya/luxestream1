import React, { useEffect, useState } from 'react';

const Recommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5001/recommend?user_id=${userId}`)
      .then(res => res.json())
      .then(data => { 
        setRecommendations(data.recommendations);
      })
      .catch(err => console.error('Error fetching recommendations:', err));
  }, [userId]);

  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">Recommended for You</h2>
      <ul className="list-disc list-inside">
        {recommendations.map((movie, index) => (
          <li key={index}>{movie}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
