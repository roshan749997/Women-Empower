"use client";
 
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
 
interface ProfilePopUpProps {
  isOpen: boolean;
  onClose: () => void;
  isSignedIn: boolean;
  userName?: string;
  mobileNumber?: string;
  userEmail?: string;
  onLogout?: () => void;
}
 
const ProfilePopUp: React.FC<ProfilePopUpProps> = ({
  isOpen,
  onClose,
  isSignedIn,
  userName,
  mobileNumber,
  userEmail,
  onLogout,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
 
  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
 
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
 
  if (!isOpen) return null;
 
  return (
    <div
      ref={popupRef}
      className="absolute top-14 right-0 w-60 bg-white shadow-md rounded-xl p-2 border-0 z-50"
    >
      {isSignedIn ? (
        <>
          {/* Header with Avatar + Name + Mobile */}
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
            <Image
              src="/images/profile.png"
              alt="profile"
              width={50}
              height={50}
              loading="lazy"
              className="rounded-full"
            />
            <div>
              <h2 className="font-semibold text-gray-800">
                {userName || 'User'}
              </h2>
            </div>
          </div>
 
          {/* Actions */}
          <div className="pt-2 space-y-2">
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-black-800 transition hover:bg-blue-100 rounded-md px-2 py-2 w-full"
            >
              <User size={20} />
              <span>My Profile</span>
            </Link>
           
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-red-600 hover:bg-red-100 rounded-md px-2 py-2 transition w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <Image
              src="/images/profile.png"
              alt="profile"
              width={50}
              height={50}
              loading="lazy"
              className="mx-auto rounded-full"
            />
            <h2 className="mt-2 text-lg font-semibold text-gray-800">
              Hey User 👋
            </h2>
            <p className="text-sm text-gray-500">
              Sign up to access your profile
            </p>
          </div>
 
        {(() => {
          const target = typeof window !== 'undefined' 
            ? `/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`
            : '/login';
          return (
            <Link
              href={target}
              onClick={onClose}
              className="block w-full text-center bg-[#efb200] text-white font-medium py-2 rounded-md mt-5 hover:bg-[#cf9f00] transition"
            >
              Sign Up
            </Link>
          );
        })()}

        </>
      )}
    </div>
  );
};
 
export default ProfilePopUp;