import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loadCart } = useCart();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart after successful payment
    loadCart();
    
    // Redirect to orders page after 3 seconds
    const timer = setTimeout(() => {
      navigate('/profile?tab=orders', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, loadCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
          </p>
        )}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/profile?tab=orders', { replace: true })}
            className="w-full bg-[#800020] text-white py-3 px-4 rounded-md font-medium hover:bg-[#660019] transition-colors"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Redirecting to orders page in 3 seconds...
        </p>
      </div>
    </div>
  );
}



