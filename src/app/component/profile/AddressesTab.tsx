import React from 'react';
import { LocationOn, Home, Work, Add, Edit, Delete, Cancel } from '@mui/icons-material';
import { Address } from './ProfileSection';
import { User } from '../../types/auth';

interface AddressesTabProps {
  addresses: Address[];
  showAddAddress: boolean;
  setShowAddAddress: (show: boolean) => void;
  editingAddress: Address | null;
  setEditingAddress: (address: Address | null) => void;
  newAddress: Omit<Address, 'id'>;
  setNewAddress: (address: Omit<Address, 'id'>) => void;
  handleAddAddress: () => void;
  handleEditAddress: (address: Address) => void;
  handleUpdateAddress: () => void;
  handleDeleteAddress: (id: string) => void;
  user: User;
}

const AddressesTab: React.FC<AddressesTabProps> = ({
  addresses,
  showAddAddress,
  setShowAddAddress,
  editingAddress,
  setEditingAddress,
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleEditAddress,
  handleUpdateAddress,
  handleDeleteAddress,
  user
}) => {
  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'Home': return <Home className="w-5 h-5" />;
      case 'Work': return <Work className="w-5 h-5" />;
      default: return <LocationOn className="w-5 h-5" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => {
            setEditingAddress(null);
            setNewAddress({
              type: 'Home',
              address: '',
              pincode: '',
              city: '',
              state: '',
              landmark: '',
              mobileNo: '',
              userId: user.id
            });
            setShowAddAddress(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
        >
          <Add className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600 mt-1">
                  {getAddressIcon(address.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{address.type}</h3>
                  </div>
                  <p className="text-gray-600 mb-1">{address.address}</p>
                  <p className="text-gray-600 mb-1">{address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-gray-600 mb-1">Landmark: {address.landmark}</p>
                  <p className="text-gray-500 text-sm">Mobile: {address.mobileNo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <Delete className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-12">
            <LocationOn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No addresses saved</h3>
            <p className="text-gray-600">Add your first address to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddAddress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => {
                  setShowAddAddress(false);
                  setEditingAddress(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Cancel className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value as 'Home' | 'Work' | 'Other' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={newAddress.address}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                  placeholder="Pincode"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                  placeholder="Nearby landmark"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={newAddress.mobileNo}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, mobileNo: e.target.value }))}
                  placeholder="Mobile number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                className="flex-1 bg-[#61503c] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
              <button
                onClick={() => {
                  setShowAddAddress(false);
                  setEditingAddress(null);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesTab;