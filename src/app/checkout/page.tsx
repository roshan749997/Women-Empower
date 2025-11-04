'use client';
import React, { useState, useEffect } from 'react';
import {
  Home,
  Work,
  Business,
  Add,
  Edit,
  Delete,
  CreditCard,
  AccountBalance,
  Payment,
  AccountBalanceWallet,
  QrCode,
  Visibility,
  VisibilityOff,
  ArrowBack,
  Check,
  LocationOn,
  Phone,
  Person
} from '@mui/icons-material';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryAddress {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  mobileNo: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  name: string;
  details: string;
}

const CheckoutFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'delivery' | 'payment' | 'confirmation'>('delivery');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);

  // Form states
  const [newAddress, setNewAddress] = useState({
    type: 'work' as 'home' | 'work' | 'other',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    mobileNo: '',
    isDefault: false
  });

  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiDetails, setUpiDetails] = useState({
    upiId: '',
    showQr: false
  });

  // Sample data
  const cartItems: CartItem[] = [
    {
      id: '1',
      name: 'Premium Headphones',
      price: 3999,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    }
  ];

  const [addresses, setAddresses] = useState<DeliveryAddress[]>([
    {
      id: '2a9d8bd1-30b4-42c0-8e0b-441c581c71c2',
      type: 'work',
      address: '456 Business Park, Bandra Kurla Complex',
      pincode: '400051',
      city: 'Mumbai',
      state: 'Maharashtra',
      landmark: 'Near Metro Station',
      mobileNo: '9876543210',
      isDefault: true
    }
  ]);

  const paymentMethods = [
    { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
    { id: 'netbanking', name: 'Netbanking', icon: AccountBalance },
    { id: 'upi', name: 'UPI', icon: Payment },
    { id: 'wallet', name: 'Wallets', icon: AccountBalanceWallet }
  ];

  const totalMRP = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = totalMRP;

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      }
    }
  }, [addresses]);

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'work': return <Work className="w-5 h-5" />;
      default: return <Business className="w-5 h-5" />;
    }
  };

  const handleAddAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.state && newAddress.pincode && newAddress.mobileNo) {
      if (editingAddress) {
        // Update existing address
        setAddresses(prev => prev.map(addr => {
          if (addr.id === editingAddress) {
            return {
              ...newAddress,
              id: editingAddress
            };
          }
          // If this is set as default, update other addresses
          if (newAddress.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        }));
        setSelectedAddress(editingAddress);
      } else {
        // Add new address
        const address: DeliveryAddress = {
          ...newAddress,
          id: Date.now().toString()
        };
        
        // If this is set as default, update existing addresses
        if (newAddress.isDefault) {
          setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
        }
        
        setAddresses(prev => [...prev, address]);
        setSelectedAddress(address.id);
      }
      
      // Reset form
      setNewAddress({
        type: 'work',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        mobileNo: '',
        isDefault: false
      });
      setShowAddAddress(false);
      setEditingAddress(null);
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleEditAddress = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      setNewAddress({
        type: address.type,
        address: address.address,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark,
        mobileNo: address.mobileNo,
        isDefault: address.isDefault
      });
      setEditingAddress(addressId);
      setShowAddAddress(true);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      if (selectedAddress === addressId) {
        setSelectedAddress('');
      }
    }
  };

  const handleCardNumberChange = (value: string) => {
    // Remove non-digits and limit to 16
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (value: string) => {
    // Remove non-digits and limit to 4
    let cleaned = value.replace(/\D/g, '').slice(0, 4);
    // Add slash after 2 digits
    if (cleaned.length >= 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    setCardDetails(prev => ({ ...prev, expiry: cleaned }));
  };

  const validateCard = () => {
    const { number, name, expiry, cvv } = cardDetails;
    return number.replace(/\s/g, '').length === 16 && 
           name.trim().length > 0 && 
           expiry.length === 5 && 
           cvv.length === 3;
  };

  const validateUPI = () => {
    return upiDetails.upiId.includes('@') && upiDetails.upiId.length > 5;
  };

  const proceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    setCurrentStep('payment');
  };

  const proceedToPay = () => {
    if (selectedPaymentMethod === 'card' && !validateCard()) {
      alert('Please fill all card details correctly');
      return;
    }
    if (selectedPaymentMethod === 'upi' && !validateUPI()) {
      alert('Please enter a valid UPI ID');
      return;
    }
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setCurrentStep('confirmation');
  };

  const generateQRCode = () => {
    setUpiDetails(prev => ({ ...prev, showQr: true }));
  };

  // Handle back to delivery
  const handleBackToDelivery = () => {
    // Reset payment method when going back
    setSelectedPaymentMethod('');
    setShowCardForm(false);
    setShowUpiForm(false);
    // Reset form data
    setCardDetails({
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    });
    setUpiDetails({
      upiId: '',
      showQr: false
    });
    // Go back to delivery step
    setCurrentStep('delivery');
  };

  // Delivery Address Step
  if (currentStep === 'delivery') {
    return (
      <div className="min-h-screen bg-white py-4 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">SELECT DELIVERY ADDRESS</h2>
                
                <div className="space-y-4 mb-6">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="w-5 h-5 text-blue-600 mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded font-medium uppercase">
                              {address.type}
                            </span>
                            {address.isDefault && (
                              <span className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                                <span>DEFAULT</span>
                                <Check className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                          <div className="text-gray-600 text-sm mb-1">
                            {address.address}
                          </div>
                          {address.landmark && (
                            <div className="text-gray-600 text-sm mb-1">
                              Landmark: {address.landmark}
                            </div>
                          )}
                          <div className="text-gray-600 text-sm mb-1">
                            {address.city}, {address.state} - {address.pincode}
                          </div>
                          <div className="text-gray-600 text-sm">Mobile: {address.mobileNo}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditAddress(address.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            <Delete className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setNewAddress({
                      type: 'work',
                      address: '',
                      city: '',
                      state: '',
                      pincode: '',
                      landmark: '',
                      mobileNo: '',
                      isDefault: false
                    });
                    setShowAddAddress(true);
                  }}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  <Add className="w-5 h-5 inline mr-2" />
                  ADD NEW ADDRESS
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">PRICE DETAILS</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total MRP</span>
                    <span className="font-semibold">₹{totalMRP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Payable Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={proceedToPayment}
                  className="w-full bg-[#695946] text-white py-3 rounded-lg font-semibold mt-6 hover:bg-[#695946] transition-colors"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>

          {/* Add/Edit Address Modal - Right Side Slide-in */}
          {showAddAddress && (
            <>
              {/* Backdrop with blur effect */}
              <div 
                className="fixed inset-0 backdrop-blur-sm z-40"
                onClick={() => {
                  setShowAddAddress(false);
                  setEditingAddress(null);
                }}
              />
              
              {/* Modal - Sliding from right with increased width */}
              <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] lg:w-[500px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
                showAddAddress ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-900">
                      {editingAddress ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowAddAddress(false);
                        setEditingAddress(null);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ArrowBack className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form Content */}
                  <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                        <select
                          value={newAddress.type}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                        <textarea
                          value={newAddress.address}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="House no, Building, Street, Area"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                        <input
                          type="text"
                          value={newAddress.landmark}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                          placeholder="Near Metro Station, Mall, etc."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                            placeholder="City"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="State"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                        <input
                          type="text"
                          value={newAddress.pincode}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setNewAddress(prev => ({ ...prev, pincode: value }));
                          }}
                          placeholder="6-digit pincode"
                          maxLength={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                        <input
                          type="tel"
                          value={newAddress.mobileNo}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, mobileNo: e.target.value }))}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-700">
                          Make this my default address
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Buttons */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAddAddress}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        {editingAddress ? 'Update Address' : 'Save Address'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddAddress(false);
                          setEditingAddress(null);
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Payment Step
  if (currentStep === 'payment') {
    return (
      <div className="min-h-screen bg-white py-4 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <button
              onClick={handleBackToDelivery}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowBack className="w-5 h-5" />
              <span>Back to Delivery</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm">
                {/* Payment Method Selection */}
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Other Payments</h2>
                  <p className="text-gray-600 text-sm mb-6">Pay using cards, Net Banking, Wallets</p>
                  
                  <div className="space-y-1">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => {
                            setSelectedPaymentMethod(method.id);
                            setShowCardForm(method.id === 'card');
                            setShowUpiForm(method.id === 'upi');
                          }}
                          className={`w-full flex items-center space-x-4 p-4 rounded-lg border-2 transition-colors ${
                            selectedPaymentMethod === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-gray-600" />
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Forms */}
                {showCardForm && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Debit / Credit Card Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            placeholder="Enter card number here"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                          />
                          <CreditCard className="absolute right-3 top-3 w-6 h-6 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value.toUpperCase() }))}
                          placeholder="Enter name on card"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            placeholder="MM / YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                            placeholder="CVV"
                            maxLength={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <button
                        onClick={proceedToPay}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Proceed to pay
                      </button>
                    </div>
                  </div>
                )}

                {showUpiForm && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay by any UPI app</h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Scan the QR using any UPI app on your mobile phone like PhonePe, Paytm, GooglePay, BHIM, etc
                    </p>

                    <div className="flex justify-center space-x-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">Ph</div>
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">GP</div>
                      <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center text-white text-sm font-bold">PT</div>
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">BH</div>
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">PY</div>
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">AM</div>
                    </div>

                    {!upiDetails.showQr ? (
                      <div className="text-center mb-6">
                        <button
                          onClick={generateQRCode}
                          className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                          Generate QR Code
                        </button>
                      </div>
                    ) : (
                      <div className="text-center mb-6">
                        <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto flex items-center justify-center mb-4">
                          <QrCode className="w-32 h-32 text-gray-600" />
                        </div>
                        <p className="text-sm text-gray-600">Scan this QR code with any UPI app</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID / VPA</label>
                        <input
                          type="text"
                          value={upiDetails.upiId}
                          onChange={(e) => setUpiDetails(prev => ({ ...prev, upiId: e.target.value }))}
                          placeholder="e.g rakesh@upi"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-2">A collect request will be sent to this UPI ID</p>
                      </div>

                      <div className="text-center text-xs text-gray-400 flex items-center justify-center space-x-2">
                        <span>secured by</span>
                        <span className="font-bold text-blue-600">JUSPAY</span>
                      </div>

                      <button
                        onClick={proceedToPay}
                        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Proceed to pay
                      </button>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'netbanking' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Bank</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'PNB'].map(bank => (
                        <button
                          key={bank}
                          className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-center font-medium"
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={proceedToPay}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Proceed to pay
                    </button>
                  </div>
                )}

                {selectedPaymentMethod === 'wallet' && (
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Wallet</h3>
                    <div className="space-y-3 mb-6">
                      {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik'].map(wallet => (
                        <button
                          key={wallet}
                          className="w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left font-medium"
                        >
                          {wallet}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={proceedToPay}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Proceed to pay
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">PRICE DETAILS</h3>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total MRP</span>
                    <span className="font-semibold">₹{totalMRP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Payable Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Step
  if (currentStep === 'confirmation') {
    return (
      <div className="min-h-screen bg-white py-4 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">#ORD415181</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">₹3,999</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">{selectedPaymentMethod}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setCurrentStep('delivery')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckoutFlow;