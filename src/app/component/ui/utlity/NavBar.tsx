"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Person,
  FavoriteBorder,
  Search,
  Menu,
  Close,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import CartDrawer from "../modals/CartDrawer";
import { usePathname, useRouter } from "next/navigation";
import ProfilePopUp from "../modals/ProfilePopUp";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useWishlist } from "@/app/contexts/WishlistContext";

// Remove local CartItem interface since we're using CartContext
interface ProfilePopUpProps {
  isOpen: boolean;
  onClose: () => void;
  isSignedIn: boolean;
  userName?: string;
  mobileNumber?: string;
  onLogout?: () => void;
}

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { getCartItemCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [showProfile, setShowProfile] = useState(false);

  const suggestions = [
    "Modern Art",
    "Oil Paintings",
    "Sketch Artists",
    "Sculptures",
    "Digital Arts",
    "Photography",
  ];
  const filteredSuggestions = suggestions.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      if (window.innerWidth < 1024 && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [isSearchOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("");
  };
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleNav = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  // Remove local cart functions since we're using CartContext

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowProfile(false);
  };

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "ARTS", href: "/arts" },
    { name: "ARTISTS", href: "/artists" },
    { name: "COURSES", href: "/courses" },
    { name: "EVENTS", href: "/events" },
    { name: "CONTACT US", href: "/contact" },
  ];

  const SearchBar = () => (
    <div className="w-full animate-fadeIn">
      <div className="max-w-3xl mx-auto px-4 py-3 relative">
        <button
          onClick={toggleSearch}
          className="absolute right-6 top-5 text-gray-300 hover:text-white lg:block hidden"
        >
          <Close className="w-6 h-6" />
        </button>

        <div className="flex items-center bg-transparent border border-white rounded-lg px-3 py-2">
          <SearchOutlined className="text-white mr-2" />
          <input
            type="text"
            placeholder="Search for products..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-300 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {searchQuery && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {s}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50">
        <div
          className={`transition-all duration-500 ease-in-out w-full p-2 ${
            isScrolled
              ? "bg-[#61503c]/95 backdrop-blur-lg shadow-lg"
              : "bg-[#61503c]/95 backdrop-blur-md"
          }`}
        >
          <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg"
              >
                {isMobileMenuOpen ? (
                  <Close className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              <Image
                src="/images/logo1.PNG"
                alt="Logo"
                width={150}
                height={50}
                className="object-contain cursor-pointer"
              />
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={`relative px-1 py-2 transition-all duration-300 group bg-transparent ${
                    pathname === item.href
                      ? "text-yellow-400"
                      : "text-white hover:text-yellow-400"
                  }`}
                >
                  <span className="font-medium text-sm tracking-wide">
                    {item.name}
                  </span>
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                      pathname === item.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSearch}
                className="hidden lg:block p-2 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg"
              >
                <Search className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  className="p-2 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  <Person className="w-5 h-5" />
                </button>

                {/* ✅ Profile Popup Render */}
                {showProfile && (
                  <ProfilePopUp
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                    isSignedIn={!!user}
                    userName={user ? `${user.firstName} ${user.lastName}` : undefined}
                    mobileNumber={user?.mobileNo}
                    userEmail={user?.email}
                    onLogout={handleLogout}
                  />
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => handleNav("/wishlist")}
                  className="p-2 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg"
                >
                  <FavoriteBorder className="w-5 h-5" />
                </button>
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={toggleCart}
                  className="p-2 text-white hover:text-yellow-400 hover:bg-white/10 rounded-lg"
                >
                  <ShoppingCartOutlined className="w-5 h-5" />
                </button>
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartItemCount()}
                </span>
              </div>
            </div>
          </div>

          {isSearchOpen && <SearchBar />}

          <div
            className={`lg:hidden transition-all duration-500 ease-in-out ${
              isMobileMenuOpen
                ? "max-h-[700px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="px-4 py-3 border-t border-white/10">
              <SearchBar />
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-4 space-y-2 border-t border-white/10">
              {navItems.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleNav(item.href)}
                  className={`w-full block text-left p-3 rounded-lg transition-all duration-300 mt-2 bg-transparent ${
                    pathname === item.href
                      ? "bg-yellow-400/20 text-yellow-100"
                      : "text-white hover:text-yellow-400 hover:bg-white/10"
                  }`}
                >
                  <span className="font-medium tracking-wide">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer
        isCartOpen={isCartOpen}
        toggleCart={toggleCart}
      />

      <div className="h-20"></div>
    </>
  );
};

export default NavBar;
