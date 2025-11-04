import React from 'react';
import { Logout } from '@mui/icons-material';
import { User } from '../../types/auth';

interface ProfileHeaderProps {
  user: User;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-white rounded-sm p-2 lg:p-2 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border-4 border-blue-100">
            <span className="text-2xl font-bold text-amber-600">
              {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-1xl lg:text-2xl text-gray-900">{user.firstName} {user.lastName}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">Member since {new Date(user.joining_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
        >
          <Logout className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;