import { Routes, Route, Navigate, useNavigate, BrowserRouter } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import authAxios from "./authAxios";

export default function AppRoutes() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  }

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuth(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const interceptor = authAxios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.msg?.toLowerCase().includes('token')
        ) {
          alert('Oops! You have been inactive for a while. Kindly log in again.');
          localStorage.removeItem('token');
          setIsAuth(false);
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      authAxios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return (
    <>
    {isAuth && <Navbar onLogout={handleLogout} />}
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login onLogin={() => setIsAuth(true)} />} />
      <Route path="/signUp" element={<SignUp />} />

      {/* Protected Route */}
      <Route
        path="/home"
        element={isAuth ? <Home /> : <Navigate to="/login" />}
    />
    </Routes>
    </>
  );
}
