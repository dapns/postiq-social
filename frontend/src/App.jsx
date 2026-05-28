import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import MyPosts from "@/pages/MyPosts";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Toast from "@/components/common/Toast";
import "./styles/buttons.css";
import "./styles/globals.css";
import "./styles/Auth.css";
import "./styles/Toast.css";
import "./App.css";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/common/ProtectedRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt to restore session by calling refresh endpoint
    initializeAuth(dispatch);
  }, [dispatch]);
  return (
    <>
      <Toast />
      <BrowserRouter>
        <Routes>

          {/* Main Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            {/* Auth Routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/myposts" element={<ProtectedRoute element={<MyPosts />} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
