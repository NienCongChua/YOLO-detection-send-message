import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./Component/home";
import Login from "./Component/login";
import Register from "./Component/register";
import EnterCode from "./Component/enterCode";
import Navbar from "./Component/navbar";
import ForgotPassword from "./Component/ForgotPassword";
import ResetPassword from "./Component/ResetPassword";
import ChangePassword from "./Component/changePassword";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [canAccessEnterCode, setCanAccessEnterCode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const AuthRoute = ({ element }) => {
    return isAuthenticated ? <Navigate to="/home" /> : element;
  };

  const EnterCodeRoute = ({ element }) => {
    return canAccessEnterCode ? element : <Navigate to="/register" />;
  };

  return (
    <Router>
      <Navbar handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/login" element={<AuthRoute element={<Login />} />} />
        <Route path="/register" element={<AuthRoute element={<Register setCanAccessEnterCode={setCanAccessEnterCode} />} />} />
        <Route path="/enter-code" element={<EnterCodeRoute element={<EnterCode />} />} />
        <Route path="/forgot-password" element={<AuthRoute element={<ForgotPassword />} />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<PrivateRoute element={<ChangePassword />} />} />
      </Routes>
    </Router>
  );
}

export default App;