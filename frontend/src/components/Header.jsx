import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { 
      name: 'Silk', 
      path: '/category/silk',
      subcategories: [
        { name: 'Soft Silk Sarees', path: '/category/silk/soft-silk' },
        { name: 'Kanjivaram Sarees', path: '/category/silk/kanjivaram' },
        { name: 'Banarasi Sarees', path: '/category/silk/banarasi' },
        { name: 'Maheshwari Silk', path: '/category/silk/maheshwari' },
        { name: 'Raw Silk Sarees', path: '/category/silk/raw-silk' },
        { name: 'Mysore Silk Sarees', path: '/category/silk/mysore-silk' },
        { name: 'Sambalpuri Sarees', path: '/category/silk/sambalpuri-sarees' },
        { name: 'Kalamkari Print Saree', path: '/category/silk/kalamkari-print-saree' }

      ]
    },
    { 
      name: 'Cotton', 
      path: '/category/cotton',
      subcategories: [
  { name: 'Bengali Cotton Sarees', path: '/category/cotton/bengali-cotton-sarees' },
  { name: 'Maheshwari Cotton Sarees', path: '/category/cotton/maheshwari-cotton-sarees' },
  { name: 'Jaipur Cotton Sarees', path: '/category/cotton/jaipur-cotton-sarees' },
  { name: 'South Cotton Sarees', path: '/category/cotton/south-cotton-sarees' },
  { name: 'Office Wear Cotton Sarees', path: '/category/cotton/office-wear-cotton-sarees' },
  { name: 'Dr.Khadi Cotton Sarees', path: '/category/cotton/dr-khadi-cotton-sarees' },
  { name: 'Block Printed Cotton Sarees', path: '/category/cotton/block-printed-cotton-sarees' },
  { name: 'Bagru Print Cotton Sarees', path: '/category/cotton/bagru-print-cotton-sarees' },
  { name: 'Ajrakh Print Cotton Sarees', path: '/category/cotton/ajrakh-print-cotton-sarees' },
  { name: 'Ikkat Cotton Sarees', path: '/category/cotton/ikkat-cotton-sarees' },
  { name: 'Chanderi Cotton Silks', path: '/category/cotton/chanderi-cotton-silks' },
  { name: 'Kalamkari Cotton Sarees', path: '/category/cotton/kalamkari-cotton-sarees' },]

    },
    {
      name: 'Regional',
      path: '/category/regional',
      subcategories: [
        { name: 'Sambalpuri Regional Sarees', path: '/category/regional/sambalpuri-regional-sarees' },
        { name: 'Kanjivaram Regional Sarees', path: '/category/regional/kanjivaram-regional-sarees' },
        { name: 'Bengali Regional Sarees', path: '/category/regional/bengali-regional-sarees' },
        { name: 'Mysore Regional Sarees', path: '/category/regional/mysore-regional-sarees' },
        { name: 'Maheshwari Regional Sarees', path: '/category/regional/maheshwari-regional-sarees' },
        { name: 'Karnataka Regional Sarees', path: '/category/regional/karnataka-regional-sarees' },
        { name: 'Tamilnadu Regional Sarees', path: '/category/regional/tamilnadu-regional-sarees' },
        { name: 'Banarasi Regional Sarees', path: '/category/regional/banarasi-regional-sarees' },
        { name: 'Banarasi Regional Dupatta', path: '/category/regional/banarasi-regional-dupatta' }
      ]
    },
    { 
      name: 'Banarasi', 
      path: '/category/banarasi',
      subcategories: [
        { name: 'Banarasi Sarees', path: '/category/banarasi/banarasi-regional-sarees' },
        { name: 'Banarasi Dupatta', path: '/category/banarasi/banarasi-regional-dupatta' },
        { name: 'Banarasi Dress Material', path: '/category/banarasi/banarasi-regional-dress-material' }
      ]
    },
    { 
      name: 'Designer Sarees', 
      path: '/category/designer-sarees',
      subcategories: [
        { name: 'Party Wear Saree', path: '/category/designer-sarees/party-wear-saree' },
        { name: 'Wedding Sarees', path: '/category/designer-sarees/wedding-sarees' },
        { name: 'Festive Sarees', path: '/category/designer-sarees/festive-sarees' },
        { name: 'Bollywood Style Sarees', path: '/category/designer-sarees/bollywood-style-sarees' },
        { name: 'Heavy Embroidered Sarees', path: '/category/designer-sarees/heavy-embroidered-sarees' }
      ]
    },
    { 
      name: 'Printed Sarees', 
      path: '/category/printed-sarees',
      subcategories: [
        { name: 'Floral Printed Sarees', path: '/category/printed-sarees/floral-printed-sarees' },
        { name: 'Digital Printed Sarees', path: '/category/printed-sarees/digital-printed-sarees' },
        { name: 'Block Printed Sarees', path: '/category/printed-sarees/block-printed-sarees' },
        { name: 'Abstract Printed Sarees', path: '/category/printed-sarees/abstract-printed-sarees' },
        { name: 'Geometric Printed Sarees', path: '/category/printed-sarees/geometric-printed-sarees' }
      ]
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (categoryName, e) => {
    // Only toggle category if it's not a link click
    if (e && e.target.tagName === 'A') {
      if (window.innerWidth < 768) {
        setActiveCategory(null);
      }
      return;
    }
    setActiveCategory(prev => (prev === categoryName ? null : categoryName));
  };

  return (
    <header className="sticky top-16 md:top-20 z-40 bg-white border-t border-gray-200 shadow-sm">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-8 py-3" ref={headerRef}>
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <div 
                className={`flex items-center text-gray-700 hover:text-rose-500 font-medium text-sm whitespace-nowrap transition-colors duration-200 relative cursor-pointer ${
                  activeCategory === category.name ? 'text-rose-500' : ''
                }`}
                onClick={() => handleClick(category.name)}
              >
                {category.name}
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    activeCategory === category.name ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-amber-400 group-hover:w-full transition-all duration-300"></span>
              </div>

              {/* Dropdown */}
              {category.subcategories && activeCategory === category.name && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 z-50">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden w-56">
                    <Link
                      to={category.path}
                      className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-rose-500 border-b border-gray-100"
                      onClick={() => setActiveCategory(null)}
                    >
                      All {category.name}
                    </Link>
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          to={subcategory.path}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-150"
                          onClick={() => setActiveCategory(null)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="md:hidden -mx-4 relative z-50">
          {/* Main Categories */}
          <div className="flex space-x-1 overflow-x-auto px-4 pt-3 pb-2 hide-scrollbar sticky top-16 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
            {categories.map((category) => (
              <div key={category.name} className="shrink-0">
                <button
                  onClick={(e) => {
                    // First tap opens subcategories, second tap navigates to the category page
                    if (activeCategory === category.name) {
                      setActiveCategory(null);
                      navigate(category.path);
                    } else {
                      handleClick(category.name, e);
                    }
                  }}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap relative flex items-center ${
                    activeCategory === category.name 
                      ? 'text-rose-500 border-b-2 border-rose-500' 
                      : 'text-gray-700 hover:text-rose-500 border-b-2 border-transparent'
                  }`}
                >
                  {category.name}
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      activeCategory === category.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Subcategories */}
          {activeCategory && (
            <div className="bg-white border-t border-gray-200 mt-2 z-50 relative">
              <div className="sticky top-16 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">
                  {categories.find(cat => cat.name === activeCategory)?.name} Categories
                </h3>
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="text-rose-500 text-sm font-medium hover:text-rose-600"
                >
                  Close
                </button>
              </div>
              <div className="relative max-h-[calc(100vh-180px)] overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {categories
                    .find(cat => cat.name === activeCategory)
                    ?.subcategories?.map((subcategory) => (
                    <Link
                      key={subcategory.name}
                      to={subcategory.path}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveCategory(null);
                        navigate(subcategory.path);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveCategory(null);
                        navigate(subcategory.path);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="block px-6 py-3 text-sm text-gray-700 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-200"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
                <div className="sticky bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
              </div>
            </div>
          )}
          
          <style jsx>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
              height: 0;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
              scrollbar-height: none;
            }
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #e5e7eb #f9fafb;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f9fafb;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #e5e7eb;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #d1d5db;
            }
          `}</style>
        </div>
      </div>
    </header>
  );
};

export default Header;
