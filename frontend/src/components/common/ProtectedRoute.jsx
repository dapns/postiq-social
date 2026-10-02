/**
 * Protected Route Component
 * Use this to protect routes that require authentication
 * 
 * Example usage in App.jsx:
 * 
 * import ProtectedRoute from "@/components/ProtectedRoute";
 * import MyProfile from "@/pages/MyProfile";
 * 
 * <Route path="/my-profile" element={<ProtectedRoute element={<MyProfile />} />} />
 */

import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading, isAuthInitialized } = useAuth();

  if (!isAuthInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
