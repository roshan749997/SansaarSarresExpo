import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'verification_failed':
        return 'Payment verification failed. Please contact support.';
      case 'payment_failed':
        return 'Payment was not successful. Please try again.';
      case 'unauthorized':
        return 'Unauthorized access. Please sign in and try again.';
      case 'server_error':
        return 'Server error occurred. Please try again later.';
      default:
        return 'Payment was not successful. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-4">
          {getErrorMessage()}
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
          </p>
        )}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout/address', { replace: true })}
            className="w-full bg-[#800020] text-white py-3 px-4 rounded-md font-medium hover:bg-[#660019] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-300 transition-colors"
          >
            Go to Home
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          If the problem persists, please contact our support team.
        </p>
      </div>
    </div>
  );
}



