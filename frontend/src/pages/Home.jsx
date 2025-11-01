import React from 'react';
import Collections from '../components/Collections';

const Home = () => {
  return (
    <div className="min-h-screen pt-0">
      {/* Hero Section with Banner */}
      <section className="w-full pt-0">
        <img 
          src="https://res.cloudinary.com/duc9svg7w/image/upload/v1761978463/Effortlessly_smoothen_every_fabric_20251101_014257_0000_pmkwyh.png" 
          alt="SareeSansaar - Premium Saree Collection"
          className="block w-full h-auto object-cover"
        />
      </section>

      {/* Featured Collections */}
      <Collections />

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-amber-600 bg-clip-text text-transparent">
            Why Choose SareeSansaar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '✨', title: 'Premium Quality', desc: 'Handpicked finest fabrics' },
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
              { icon: '💎', title: 'Authentic', desc: '100% genuine products' },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
