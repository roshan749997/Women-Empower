"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import NavBar from "../ui/utlity/NavBar";
import Footer from "../ui/utlity/Footer";
import ScrollToTopButton from "../ui/utlity/ScrollToTopButton";
import DashboardLayout from "../../DashboardLayout";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#61503c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = isAuthenticated && user?.role === 'admin';

  console.log('🔍 LayoutWrapper - Auth State:', {
    isAuthenticated,
    userRole: user?.role,
    isAdmin,
    userEmail: user?.email
  });

  if (isAdmin) {
    // Admin Layout - Dashboard
    return (
      <DashboardLayout>
        <ScrollToTopButton />
        {children}
      </DashboardLayout>
    );
  } else {
    // Regular User Layout
    return (
      <>
        <NavBar />
        <ScrollToTopButton />
        {children}
        <Footer />
      </>
    );
  }
};

export default LayoutWrapper;

