import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          navigate('/signin', { replace: true });
          return;
        }
        const me = await api.me();
        setUser(me.user);
        const cartRes = await api.getCart();
        const items = (cartRes?.items || []).map(i => {
          const p = i.product || {};
          const price = typeof p.price === 'number' ? p.price : (typeof p.mrp === 'number' ? Math.round(p.mrp - (p.mrp * (p.discountPercent || 0) / 100)) : 0);
          return {
            id: p._id,
            title: p.title,
            image: p.images?.image1,
            price,
            mrp: p.mrp,
            quantity: i.quantity || 1,
          };
        });
        setCart(items);
      } catch (e) {
        setError(e.message || 'Failed to load profile');
      }
    };
    load();
  }, [navigate]);

  const cartCount = useMemo(() => cart.reduce((n, it) => n + (it.quantity || 1), 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0), [cart]);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-semibold text-neutral-800">Your Profile</h1>
            <p className="text-sm text-neutral-500">Manage your account information and view your shopping activity</p>
          </div>
          <Link to="/cart" className="px-3 py-2 text-sm border rounded-md hover:bg-neutral-50">Go to Cart</Link>
        </div>

        {/* Top Grid: Profile + Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-neutral-500">Name</div>
                <div className="text-lg font-medium text-neutral-800">{user.name}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Email</div>
                <div className="text-lg font-medium text-neutral-800">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Member Since</div>
                <div className="text-lg font-medium text-neutral-800">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Last Updated</div>
                <div className="text-lg font-medium text-neutral-800">{new Date(user.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 sm:p-8 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-neutral-600">Items in Cart</div>
                <div className="text-xl font-semibold">{cartCount}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-neutral-600">Cart Total</div>
                <div className="text-xl font-semibold">₹{cartTotal.toLocaleString()}</div>
              </div>
              <Link to="/cart" className="block text-center mt-2 px-3 py-2 text-sm border rounded-md hover:bg-neutral-50">View Cart</Link>
            </div>
          </div>
        </div>

        {/* Recent Cart Items */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Recent Cart Items</h2>
            <Link to="/cart" className="text-sm text-rose-600 hover:text-rose-700">See all</Link>
          </div>
          {cart.length === 0 ? (
            <div className="text-sm text-neutral-500">Your cart is empty.</div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {cart.slice(0,5).map(item => (
                <li key={item.id} className="py-3 flex items-center">
                  <img src={item.image} alt={item.title} className="w-14 h-14 rounded object-cover bg-neutral-100" />
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-neutral-800 line-clamp-1">{item.title}</div>
                    <div className="text-xs text-neutral-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold">₹{(item.price * item.quantity).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
