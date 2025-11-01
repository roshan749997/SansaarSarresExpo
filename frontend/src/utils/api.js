const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(url, { ...options, headers, credentials: 'include' });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}

export const api = {
  signin: (payload) => request('/api/auth/signin', { method: 'POST', body: JSON.stringify(payload) }),
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (payload) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me', { method: 'GET' }),
  // Cart endpoints
  getCart: () => request('/api/cart', { method: 'GET' }),
  addToCart: ({ productId, quantity = 1 }) => request('/api/cart/add', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  removeFromCart: (productId) => request(`/api/cart/remove/${productId}`, { method: 'DELETE' }),
};

export default api;



