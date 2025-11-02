import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { getMyAddress } from '../services/api';

export default function FlipkartAccountSettings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [expandedMenu, setExpandedMenu] = useState('account');

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const fetchUserData = async () => {
    try {
      const userData = await api.me();
      // Assuming the backend returns name as "firstName lastName"
      const [firstName, ...lastNameParts] = userData.user?.name?.split(' ') || [];
      const lastName = lastNameParts.join(' ');
      
      setUser({
        firstName: firstName || '',
        lastName: lastName || '',
        email: userData.user?.email || '',
        mobile: userData.user?.phone || '',
        gender: userData.user?.gender || 'male'
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const addressData = await getMyAddress();
      if (addressData && addressData._id) {
        setAddresses([addressData]);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAddresses();
  }, []);

  const toggleMenu = (menu) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const handleLogout = async () => {
    try {
      // Clear the auth token from localStorage
      localStorage.removeItem('auth_token');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex w-full">
          <div className="w-64 bg-white shadow-sm flex-shrink-0">
            {/* User Profile */}
            <div className="p-5 border-b flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xl font-semibold">
                {user.firstName.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-gray-500">Hello,</div>
                <div className="font-semibold text-gray-800">{user.firstName} {user.lastName}</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="py-2">
              {/* MY ORDERS */}
              <div 
                onClick={() => setActiveSection('orders')}
                className={`flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 ${
                  activeSection === 'orders' ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
                  </svg>
                  <span className="text-sm font-medium">MY ORDERS</span>
                </div>
                <span className="text-gray-400">›</span>
              </div>

              {/* Profile Information */}
              <div 
                onClick={() => setActiveSection('profile')}
                className={`flex items-center justify-between px-5 py-3 cursor-pointer ${
                  activeSection === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span className="text-sm font-medium">Profile Information</span>
                </div>
              </div>

              {/* Manage Addresses */}
              <div 
                onClick={() => setActiveSection('addresses')}
                className={`flex items-center justify-between px-5 py-3 cursor-pointer ${
                  activeSection === 'addresses' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="text-sm font-medium">Manage Addresses</span>
                </div>
              </div>


              {/* LOGOUT */}
              <div 
                onClick={handleLogout}
                className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-red-50 text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span className="text-sm font-medium">Logout</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 bg-gray-50 flex justify-center">
            {activeSection === 'profile' && (
              <div className="w-full max-w-3xl">
                {/* Personal Information */}
                <div className="bg-white rounded shadow-sm mb-6">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800">Personal Information</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <input 
                        type="text" 
                        value={user.firstName}
                        className="px-4 py-3 border border-gray-300 rounded text-sm bg-gray-50"
                        readOnly
                      />
                      <input 
                        type="text" 
                        value={user.lastName}
                        className="px-4 py-3 border border-gray-300 rounded text-sm bg-gray-50"
                        readOnly
                      />
                    </div>
                    <div>
                      <div className="text-sm text-gray-700 mb-2">Your Gender</div>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="gender" 
                            checked={user.gender === 'male'}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">Male</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="gender" 
                            checked={user.gender === 'female'}
                            readOnly
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">Female</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="bg-white rounded shadow-sm mb-6">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800">Email Address</h2>
                  </div>
                  <div className="p-6">
                    <input 
                      type="text" 
                      value={user.email}
                      placeholder=""
                      className="w-full px-4 py-3 border border-gray-300 rounded text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="bg-white rounded shadow-sm mb-6">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800">Mobile Number</h2>
                  </div>
                  <div className="p-6">
                    <input 
                      type="text" 
                      value={user.mobile}
                      className="w-full px-4 py-3 border border-gray-300 rounded text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>

                {/* FAQs */}
                <div className="bg-white rounded shadow-sm">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800">FAQs</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="font-medium text-gray-800 mb-2">
                        What happens when I update my email address (or mobile number)?
                      </div>
                      <div className="text-sm text-gray-600">
                        Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="font-medium text-gray-800 mb-2">
                        When will my Flipkart account be updated with the new email address (or mobile number)?
                      </div>
                      <div className="text-sm text-gray-600">
                        It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-gray-800 mb-2">
                        What happens to my existing Flipkart account when I update my email address (or mobile number)?
                      </div>
                      <div className="text-sm text-gray-600">
                        Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your Order history, saved information and personal details.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div className="bg-white rounded shadow-sm p-8">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600">You haven't placed any orders yet.</p>
                </div>
              </div>
            )}

            {activeSection === 'addresses' && (
              <div className="w-full max-w-4xl">
                <div className="bg-white rounded shadow-sm mb-6">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-800">My Addresses</h2>
                  </div>
                  <div className="p-6">
                    {loadingAddresses ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-800">{address.fullName}</h3>
                                <p className="text-sm text-gray-600 mt-1">{address.addressLine1}</p>
                                {address.addressLine2 && (
                                  <p className="text-sm text-gray-600">{address.addressLine2}</p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {address.city}, {address.state} - {address.pincode}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Phone:</span> {address.phoneNumber}
                                </p>
                                {address.isDefault && (
                                  <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                    Default Address
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No Addresses Saved</h3>
                        <p className="text-gray-600 mb-4">You haven't added any addresses yet.</p>
                        <button 
                          onClick={() => window.location.href = '/address'}
                          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add New Address
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div className="bg-white rounded shadow-sm p-8">
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Your Wishlist is Empty</h3>
                  <p className="text-gray-600">Add items you like to your wishlist.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}