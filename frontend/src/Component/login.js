import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        email: identifier.includes('@') ? identifier : undefined,
        username: !identifier.includes('@') ? identifier : undefined,
        password: password,
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("username", identifier);
      navigate("/home");
    } catch (error) {
      setMessage("Invalid credentials!");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="identifier">Email hoặc Tên đăng nhập</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-3 bg-gray-100 text-gray-500 flex items-center justify-center">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="example@gmail.com hoặc tên đăng nhập"
                className="w-full px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700" htmlFor="password">Mật Khẩu</label>
              <Link to="/forgot-password" className="text-pink-500">Quên Mật Khẩu?</Link>
            </div>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-3 bg-gray-100 text-gray-500 flex items-center justify-center">
                <i className="fas fa-eye" onClick={togglePasswordVisibility}></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Vui Lòng Nhập Mật Khẩu"
                className="w-full px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-lg flex items-center justify-center">
            <i className="fas fa-sign-in-alt mr-2"></i> Đăng Nhập
          </button>
        </form>
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
        <div className="text-center mt-4">
          <p>Chưa Có Tài Khoản? <Link to="/register" className="text-teal-500">Đăng Ký</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;