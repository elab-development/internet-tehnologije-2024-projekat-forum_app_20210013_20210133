import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { email: email, password: password };

    try {
      setError("");

      const response = await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/users/login`,
        userData
      );
      localStorage.setItem("token", response.data.token);
      navigate("/questions");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Something went wrong on login attempt!"
      );
    }
  };

  const handleSendPasswordResetEmail = async (e) => {
    e.preventDefault();

    const userData = { email: email };

    try {
      setError("");

      await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/users/forgotPassword`,
        userData
      );

      navigate("/forgot-password");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Something went wrong on password reset attempt!"
      );
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center text-sm">
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
          <span
            onClick={handleSendPasswordResetEmail}
            className="text-gray-500 hover:underline cursor-pointer"
          >
            Forgot password?
          </span>
        </div>
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
