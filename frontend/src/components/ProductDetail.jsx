import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaRupeeSign, FaArrowLeft, FaStar, FaRegStar, FaBolt, FaSpinner } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { fetchSareeById } from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [saree, setSaree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const loadSaree = async () => {
      try {
        setLoading(true);
        const data = await fetchSareeById(id);
        setSaree(data);
      } catch (err) {
        console.error('Failed to load saree details:', err);
        setError('Failed to load saree details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadSaree();
  }, [id]);

  const handleAddToCart = async () => {
    if (!saree) return;
    setIsAdding(true);
    try {
      await addToCart(id, quantity);
      alert(`${saree.title} ${quantity > 1 ? `(${quantity} items) ` : ''}added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!saree) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Product not found</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Browse Sarees
        </button>
      </div>
    );
  }

  const sellingPrice = Math.round(saree.mrp - (saree.mrp * (saree.discountPercent || 0) / 100));

  return (
    <div className="min-h-screen bg-gray-50 py-4">

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          
          {/* Image Section */}
          <div className="w-full overflow-hidden rounded-xl bg-gray-50">
            <div className="relative pt-[100%] md:pt-[90%] overflow-hidden">
              <img
                src={saree.images?.image1 || 'https://via.placeholder.com/600x800?text=Image+Not+Available'}
                alt={saree.title}
                className="absolute top-0 left-0 w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x800?text=Image+Not+Available';
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="py-2 px-2">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{saree.title}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  star <= 4 ? <FaStar key={star} /> : <FaRegStar key={star} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">(24 Reviews)</span>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <FaRupeeSign className="text-gray-700" />
                <span className="text-2xl font-bold text-gray-900 ml-1">
                  {sellingPrice.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-400 text-base line-through ml-4">
                ₹{saree.mrp.toLocaleString()}
              </span>
              {saree.discountPercent > 0 && (
                <span className="bg-pink-100 text-pink-700 text-sm font-medium px-2.5 py-0.5 rounded ml-4">
                  {saree.discountPercent}% OFF
                </span>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {saree.description}
              </p>

              {/* Quantity Selector and Action Buttons */}
              <div className="flex items-center mb-6">
                <span className="text-gray-700 font-medium mr-4">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button 
                    onClick={decrementQuantity}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={incrementQuantity}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button 
                  className="flex-1 bg-white text-[#800020] py-2.5 px-5 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#660019] hover:text-white transition-colors disabled:opacity-70 cursor-pointer shadow-sm border border-[#800020]"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                >
                  <FaShoppingCart className="h-5 w-5" />
                  <span className="font-medium">{isAdding ? 'Adding...' : 'Add to Cart'}</span>
                </button>
                <button 
                  className="flex-1 bg-[#800020] text-white py-2.5 px-5 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#660019] transition-colors cursor-pointer shadow-sm border border-[#800020]"
                  onClick={handleBuyNow}
                >
                  <FaBolt className="h-5 w-5" />
                  <span className="font-medium">Buy Now</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Product Information</h4>
                <div className="space-y-3 text-gray-700">
                  <div className="flex">
                    <span className="w-36 font-medium text-gray-600">Brand:</span>
                    <span>{saree.product_info?.brand || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-medium text-gray-600">Manufacturer:</span>
                    <span>{saree.product_info?.manufacturer || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-medium text-gray-600">Category:</span>
                    <span>{saree.category}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-medium text-gray-600">Material:</span>
                    <span>{saree.product_info?.SareeMaterial || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-medium text-gray-600">Color:</span>
                    <span>{saree.product_info?.SareeColor || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-36 font-medium text-gray-600">Length:</span>
                    <span>{saree.product_info?.SareeLength || 'N/A'}</span>
                  </div>
                  {saree.product_info?.IncludedComponents && (
                    <div className="flex">
                      <span className="w-36 font-medium text-gray-600">Included:</span>
                      <span>{saree.product_info.IncludedComponents}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700">Free shipping on orders over ₹5,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
