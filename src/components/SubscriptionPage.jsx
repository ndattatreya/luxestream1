import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 149,
      duration: '1 Month',
      features: [
        'Access to all free content',
        'HD available',
        'Watch on your mobile phone and tablet',
        'Cancel anytime'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 499,
      duration: '3 Months',
      features: [
        'Access to all premium content',
        'Full HD available',
        'Watch on your laptop and TV',
        'Download & watch offline',
        'Cancel anytime'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 899,
      duration: '6 Months',
      features: [
        'Access to all premium content',
        'Ultra HD available',
        'Watch on all your devices',
        'Download & watch offline',
        'First access to new releases',
        'Cancel anytime'
      ]
    }
  ];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!selectedPlan) {
      console.error('No plan selected');
      return;
    }

    setLoading(true);
    try { 
      console.log('Creating order for plan:', selectedPlan);
      const response = await fetch('http://localhost:5000/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price * 100, // Razorpay expects amount in paise
          currency: 'INR',
          planId: selectedPlan.id,
        }),
      });

      const order = await response.json();
      console.log('Order created:', order);

      const options = {
        key: 'rzp_test_5NFOiDIrADrIHb', // Replace with your Razorpay key
        amount: selectedPlan.price * 100,
        currency: 'INR',
        name: 'LuxeStream',
        description: `${selectedPlan.name} Plan Subscription`,
        order_id: order.id,
        handler: function (response) {
          console.log('Payment successful:', response);
          // Redirect to VideoPlayer page with movie details and allowed attempts
          navigate('/video-player', {
            state: {
              movie: selectedPlan, // Pass the selected plan or movie details
              allowedAttempts: 3, // Set the allowed attempts
            },
          });
        },
        prefill: {
          email: 'user@example.com', // Replace with user's email
        },
        theme: {
          color: '#dc2626',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`bg-gray-800 rounded-lg p-6 cursor-pointer transition-transform hover:scale-105 ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-red-600' : ''
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-2">₹{plan.price}</p>
              <p className="text-gray-400 mb-6">{plan.duration}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handlePayment}
            disabled={!selectedPlan || loading}
            className={`bg-red-600 text-white px-8 py-3 rounded-lg font-semibold 
              ${(!selectedPlan || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
          >
            {loading ? 'Processing...' : `Subscribe Now for ₹${selectedPlan?.price || '0'}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;