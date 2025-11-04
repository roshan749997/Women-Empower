'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Person, 
  Phone, 
  Email, 
  LocationOn, 
  ShoppingBag, 
  Settings, 
  Logout, 
  Edit, 
  Save, 
  Cancel, 
  ArrowBack, 
  LocalShipping, 
  Receipt, 
  Star, 
  Shield, 
  Help, 
  Support, 
  Add, 
  Delete, 
  Home, 
  Work, 
  Business, 
  AccountCircle 
} from '@mui/icons-material';

// Import sub-components
import ProfileHeader from './ProfileHeader';
import SidebarNavigation from './SidebarNavigation';
import ProfileTab from './ProfileTab';
import OrdersTab from './OrdersTab';
import AddressesTab from './AddressesTab';
import HelpTab from './HelpTab';

// Import AuthContext
import { useAuth } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';

// Import types
import { User, Address, Order } from '../../types/profile';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnUrl = searchParams?.get('returnUrl');
  const { addToCart } = useCart();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Address management states
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1a9d8bd1-30b4-42c0-8e0b-441c581c71c1',
      type: 'Home',
      address: '123 Main Street, Building 3A',
      pincode: '560001',
      city: 'Maharashtra',
      state: 'Maharashtra',
      landmark: 'Near City Mall',
      mobileNo: '9877583210',
      userId: '4cf0865c-ae9c-4381-84ce-4ddec3582db8'
    },
    {
      id: '2a9d8bd1-30b4-42c0-8e0b-441c581c71c2',
      type: 'Work',
      address: '456 Business Park, Bandra Kurla Complex',
      pincode: '400051',
      city: 'Mumbai',
      state: 'Maharashtra',
      landmark: 'Near Metro Station',
      mobileNo: '9876543210',
      userId: '4cf0865c-ae9c-4381-84ce-4ddec3582db8'
    }
  ]);
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    type: 'Home',
    address: '',
    pincode: '',
    city: '',
    state: '',
    landmark: '',
    mobileNo: '',
    userId: user?.id || ''
  });
  
  const [editedUser, setEditedUser] = useState<User | null>(user);

  const orders: Order[] = [
    {
      id: 'ORD001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2499,
      items: 2,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop'
    },
    {
      id: 'ORD002',
      date: '2024-01-10',
      status: 'shipped',
      total: 1299,
      items: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop'
    },
    {
      id: 'ORD003',
      date: '2024-01-05',
      status: 'processing',
      total: 3999,
      items: 3,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'
    }
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Person },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: LocationOn },
    { id: 'help', label: 'Help', icon: Help },
  ];

  // Update editedUser when user changes
  useEffect(() => {
    if (user) {
      setEditedUser(user);
      setNewAddress(prev => ({ ...prev, userId: user.id }));
    }
  }, [user]);

  // Redirect already logged-in admin users to dashboard
  useEffect(() => {
    if (user && !isLoading && user.role === 'admin') {
      console.log('🔄 Admin user detected on profile page, redirecting to dashboard');
      console.log('👤 User role:', user.role);
      console.log('📧 User email:', user.email);
      
      // Add a small delay to ensure component is fully loaded
      setTimeout(() => {
        console.log('🚀 Redirecting admin to dashboard...');
        window.location.href = "/dashboardmaintab";
      }, 100);
    }
  }, [user, isLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const loginUrl = returnUrl 
        ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : '/login';
      router.push(loginUrl);
    }
  }, [isAuthenticated, isLoading, returnUrl, router]);

  // Address management functions
  const handleAddAddress = () => {
    if (newAddress.address && newAddress.city && newAddress.state && newAddress.pincode && newAddress.mobileNo) {
      const address: Address = {
        ...newAddress,
        id: generateId()
      };
      setAddresses([...addresses, address]);
      setNewAddress({
        type: 'Home',
        address: '',
        pincode: '',
        city: '',
        state: '',
        landmark: '',
        mobileNo: '',
        userId: user?.id || ''
      });
      setShowAddAddress(false);
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowAddAddress(true);
  };

  const handleUpdateAddress = () => {
    if (editingAddress && newAddress.address && newAddress.city && newAddress.state && newAddress.pincode && newAddress.mobileNo) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr
      ));
      setEditingAddress(null);
      setNewAddress({
        type: 'Home',
        address: '',
        pincode: '',
        city: '',
        state: '',
        landmark: '',
        mobileNo: '',
        userId: user?.id || ''
      });
      setShowAddAddress(false);
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSaveProfile = () => {
    if (editedUser) {
      setEditedUser(editedUser);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setEditedUser(user);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // Show loading state
  if (isLoading) {
    console.log('Auth is loading...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main Profile Dashboard
  return (
    <div className="min-h-screen bg-[#f1f3f6]">
      <div className="max-w-7xl mx-auto p-2 lg:p-4">
        {/* Profile Header */}
        <ProfileHeader user={user} onLogout={handleLogout} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <SidebarNavigation 
              tabs={tabs} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-sm p-4 lg:p-4">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && editedUser && (
                <ProfileTab
                  user={user}
                  editedUser={editedUser}
                  setEditedUser={setEditedUser}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleSaveProfile={handleSaveProfile}
                  handleCancelEdit={handleCancelEdit}
                />
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <OrdersTab orders={orders} />
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <AddressesTab
                  addresses={addresses}
                  showAddAddress={showAddAddress}
                  setShowAddAddress={setShowAddAddress}
                  editingAddress={editingAddress}
                  setEditingAddress={setEditingAddress}
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                  handleAddAddress={handleAddAddress}
                  handleEditAddress={handleEditAddress}
                  handleUpdateAddress={handleUpdateAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  user={user}
                />
              )}

              {/* Help Tab */}
              {activeTab === 'help' && <HelpTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
