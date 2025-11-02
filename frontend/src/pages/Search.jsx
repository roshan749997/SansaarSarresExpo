import { useEffect, useMemo, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaRupeeSign } from 'react-icons/fa';
import { searchProducts } from '../services/api';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const Search = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const q = (query.get('q') || '').trim();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchResults = async () => {
      setError('');
      setResults([]);
      if (!q || q.length < 2) return;
      setLoading(true);
      try {
        const data = await searchProducts(q);
        const items = data?.results || [];
        if (active) setResults(items);
      } catch (e) {
        if (active) setError('Failed to load results');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchResults();
    return () => { active = false; };
  }, [q]);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const term = (form.get('q') || '').toString().trim();
    if (term.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(term)}`);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {q && <h1 className="text-2xl md:text-3xl font-semibold mb-8">Results for "{q}"</h1>}

        {loading && <div className="text-gray-600">Searching…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && q && results.length === 0 && (
          <div className="text-gray-600">No products found for "{q}"</div>
        )}

        {!loading && results.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
            {results.map((p) => (
              <li key={p._id || p.id || p.title} className="group bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-pink-100">
                <Link to={`/product/${p._id || p.id || ''}`} className="block">
                  <div className="relative w-full aspect-[3/4] bg-gray-50">
                    <img
                      src={p.images?.image1 || p.image || 'https://via.placeholder.com/300x400?text=Image+Not+Available'}
                      alt={p.title || p.name || 'Product'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Image+Not+Available'; }}
                    />
                    {(p.discountPercent > 0 || p.discount) && (
                      <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {p.discountPercent || p.discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="relative p-4">
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7A2A2A] via-[#A56E2C] to-[#C89D4B] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10"></div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium text-gray-600 line-clamp-1">
                        {p.product_info?.manufacturer || 'VARNICRAFTS'}
                      </h3>
                      <span className="text-xs text-gray-400">Sponsored</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">{p.title || p.name || 'Product'}</p>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <div className="flex items-center">
                        <FaRupeeSign className="h-3.5 w-3.5 text-gray-900" />
                        <span className="text-lg font-bold text-gray-900 ml-0.5">
                          {p.price?.toLocaleString() || (p.mrp ? Math.round(p.mrp - p.mrp * ((p.discountPercent || 0) / 100)).toLocaleString() : '0')}
                        </span>
                      </div>
                      {p.mrp && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{p.mrp.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
