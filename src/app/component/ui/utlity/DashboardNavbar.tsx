import React from "react";
import { Menu, X } from "lucide-react";
import SearchBar from "@/app/component/dashboard/navbar/SearchBar";
import ProfileMenu from "../../dashboard/navbar/ProfileMenu";

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
}

const DashboardNavbar = ({
  userInfo = { name: "", email: "", avatar: "" },
  onMenuToggle = () => {},
  isMobileMenuOpen = false,
}: {
  userInfo?: UserInfo;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}) => {
  return (
    <nav className="bg-white text-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Left side: Menu button + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-blue-300">
                  <span className="text-xl sm:text-2xl font-bold text-blue-700">W</span>
                </div>
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg sm:text-xl text-blue-800 tracking-wide leading-none">
                  Woman Empower
                </h1>
                <p className="text-[10px] sm:text-xs text-purple-600 font-semibold tracking-widest mt-0.5">
                  JOURNEY
                </p>
              </div>
            </div>
          </div>

          {/* Center: Search Bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 justify-center px-8 max-w-md lg:max-w-lg xl:max-w-xl">
            {/* <SearchBar /> */}
          </div>

          {/* Right side: Profile Menu */}
          <div className="flex items-center space-x-4 flex-shrink-0 z-50 border border-gray-200 rounded-xl p-1 hover:shadow-md transition-shadow-lg cursor-pointer">
            <ProfileMenu userInfo={userInfo} />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          {/* <SearchBar /> */}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;