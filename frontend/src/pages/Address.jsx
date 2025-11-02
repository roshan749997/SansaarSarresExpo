import React, { useState, useContext, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
].sort();

export default function AddressForm() {
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [filteredStates, setFilteredStates] = useState([...indianStates]);
  const [searchTerm, setSearchTerm] = useState('');
  const stateDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter states based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredStates(
        indianStates.filter(state =>
          state.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredStates([...indianStates]);
    }
  }, [searchTerm]);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    addressType: 'home'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const { cart, cartTotal: total } = useCart();

  // Calculate price details
  const calculatePriceDetails = () => {
    const subtotal = total || 0;
    const protectFee = Math.round(subtotal * 0.02); // 2% of subtotal
    const tax = Math.round(subtotal * 0.05); // 5% GST
    const totalPayable = subtotal + protectFee + tax;
    const savings = Math.round(subtotal * 0.35); // Assuming 35% savings
    const supercoins = Math.min(30, Math.floor(subtotal / 1000) * 10); // 10 supercoins per 1000 spent, max 30

    return {
      subtotal,
      protectFee,
      tax,
      total: totalPayable,
      savings,
      supercoins,
      items: cart?.length || 0,
      cartItems: cart || []
    };
  };

  const priceDetails = calculatePriceDetails();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      addressType: type
    }));
  };

  const handleUseCurrentLocation = () => {
    alert('Location feature would access your GPS coordinates');
  };

  const validateForm = () => {
    const errors = [];
    
    // Required fields validation
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.mobile.trim()) errors.push('Mobile number is required');
    if (!formData.pincode.trim()) errors.push('Pincode is required');
    if (!formData.locality.trim()) errors.push('Locality is required');
    if (!formData.address.trim()) errors.push('Address is required');
    if (!formData.city.trim()) errors.push('City is required');
    if (!formData.state.trim()) errors.push('State is required');
    
    // Format validations
    if (formData.mobile.trim() && !/^\d{10}$/.test(formData.mobile.trim())) {
      errors.push('Mobile number must be 10 digits');
    }
    
    if (formData.pincode.trim() && !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.push('Pincode must be 6 digits');
    }
    
    if (formData.alternatePhone.trim() && !/^\d{10}$/.test(formData.alternatePhone.trim())) {
      errors.push('Alternate phone must be 10 digits if provided');
    }
    
    return errors;
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }
    
    // If we get here, all validations passed
    alert('Address saved successfully!');
    console.log('Save address:', formData);
    setShowSuccess(true);
    
    // In a real app, you would save the address to your backend here
    // Example: saveAddress(formData).then(() => setShowSuccess(true));
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  // Price details are now calculated from cart data

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSaveAddress} className="bg-white shadow-sm rounded">
            <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
              <span>1</span>
              <span className="font-medium">DELIVERY ADDRESS</span>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600">
                  <input type="radio" checked readOnly className="w-4 h-4" />
                  EDIT ADDRESS
                </label>
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="mb-6 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Use my current location
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">10-digit mobile number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    placeholder="Enter 6-digit pincode"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Locality</label>
                  <input
                    type="text"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    placeholder="Enter your locality"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Address (Area and Street)</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter your complete address"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">City/District/Town</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="relative" ref={stateDropdownRef}>
                  <label className="block text-xs text-gray-600 mb-1">State</label>
                  <div 
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
                    onClick={() => setShowStateDropdown(!showStateDropdown)}
                  >
                    {formData.state || 'Select State'}
                  </div>
                  
                  {showStateDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          placeholder="Search state..."
                          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredStates.length > 0 ? (
                          filteredStates.map((state) => (
                            <div
                              key={state}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                                formData.state === state ? 'bg-blue-50 text-blue-700' : ''
                              }`}
                              onClick={() => {
                                setFormData({ ...formData, state });
                                setShowStateDropdown(false);
                                setSearchTerm('');
                              }}
                            >
                              {state}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">No states found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="E.g., Near Central Mall"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Alternate Phone (Optional)</label>
                  <input
                    type="text"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="Alternate phone (Optional)"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-2">Address Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="addressType"
                      checked={formData.addressType === 'home'}
                      onChange={() => handleAddressTypeChange('home')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Home (All day delivery)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="addressType"
                      checked={formData.addressType === 'work'}
                      onChange={() => handleAddressTypeChange('work')}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Work (Delivery between 10 AM - 5 PM)</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full">
                <button
                  type="submit"
                  className="bg-[#800020] hover:bg-[#660019] text-white px-8 py-3 rounded font-medium transition-colors cursor-pointer w-full sm:w-auto text-center"
                >
                  SAVE AND DELIVER HERE
                </button>
                <button
                  onClick={handleCancel}
                  className="text-blue-600 hover:text-blue-700 px-6 py-3 rounded font-medium transition cursor-pointer w-full sm:w-auto text-center border border-blue-600 hover:bg-blue-50"
                >
                  CANCEL
                </button>
              </div>

              {showSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Address saved successfully!
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm rounded p-4 sticky top-4">
            <h3 className="text-gray-500 text-sm font-medium mb-4">PRICE DETAILS</h3>
            
            <div className="space-y-3 mb-4 pb-4 border-b">
              <div className="flex justify-between text-sm">
                <span>Price ({priceDetails.items} items)</span>
                <span>₹{priceDetails.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (5%)</span>
                <span>₹{priceDetails.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Protect Promise Fee</span>
                <span>₹{priceDetails.protectFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between font-medium text-base mb-4 pb-4 border-b">
              <span>Total Payable</span>
              <span>₹{priceDetails.total.toLocaleString()}</span>
            </div>


            <button 
              onClick={() => {
                // TODO: Implement payment processing
                alert('Proceeding to payment...');
              }}
              className="w-full mt-4 bg-[#800020] text-white py-3 px-4 rounded-md hover:bg-[#660019] transition-colors font-medium cursor-pointer"
            >
              PROCEED TO PAYMENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}