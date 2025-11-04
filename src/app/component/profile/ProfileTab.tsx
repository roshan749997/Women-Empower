import React from 'react';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { User } from '../../types/auth';

interface ProfileTabProps {
  user: User;
  editedUser: User | null;
  setEditedUser: (user: User | null | ((prev: User | null) => User | null)) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  user,
  editedUser,
  setEditedUser,
  isEditing,
  setIsEditing,
  handleSaveProfile,
  handleCancelEdit
}) => {
  // Type-safe event handlers
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser(prev => prev ? { ...prev, firstName: e.target.value } : null);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser(prev => prev ? { ...prev, lastName: e.target.value } : null);
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedUser(prev => prev ? { ...prev, gender: e.target.value as 'male' | 'female' } : null);
  };

  const handleMobileNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUser(prev => prev ? { ...prev, mobileNo: e.target.value } : null);
  };

  // Format the joining date safely
  const formatJoiningDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Cancel className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editedUser?.firstName || ''}
              onChange={handleFirstNameChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.firstName}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          {isEditing ? (
            <input
              type="text"
              value={editedUser?.lastName || ''}
              onChange={handleLastNameChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.lastName}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          {isEditing ? (
            <select
              value={editedUser?.gender || 'male'}
              onChange={handleGenderChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 capitalize">{user.gender}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.email}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={editedUser?.mobileNo || ''}
              onChange={handleMobileNoChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.mobileNo}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
          <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
            {formatJoiningDate(user.joining_date)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;