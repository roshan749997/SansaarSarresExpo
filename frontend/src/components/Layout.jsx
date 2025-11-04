import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer - Hidden on mobile, shown on md screens and up */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
