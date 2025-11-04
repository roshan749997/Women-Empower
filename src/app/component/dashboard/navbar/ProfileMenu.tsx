
"use client";
import React, { useState } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
}

const ProfileMenu = ({ userInfo }: { userInfo: UserInfo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
      >
        {userInfo.avatar ? (
          <img
            className="h-9 w-9 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            src={userInfo.avatar}
            alt={userInfo.name}
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center border-2 border-gray-200 shadow-sm">
            <User size={18} className="text-white" />
          </div>
        )}
        <div className="hidden sm:block text-left min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate max-w-24 lg:max-w-none">
            {userInfo.name.split(" ")[0]}
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`hidden sm:block transition-transform duration-200 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay background click */}
          <div
            className="fixed inset-0 z-100"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-100">
            <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                {userInfo.avatar ? (
                  <img
                    className="h-14 w-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    src={userInfo.avatar}
                    alt={userInfo.name}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center border-2 border-gray-200 shadow-sm">
                    <User size={24} className="text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {userInfo.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
              >
                <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors mr-4">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <p className="font-medium">Logout</p>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;

