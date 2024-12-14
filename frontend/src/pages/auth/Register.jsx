import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { username: username, email: email, password: password };

    try {
      setError("");

      await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/users/register`,
        userData
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Something went wrong on register attempt!"
      );
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
            Register
          </button>
        </form>
        <div className="mt-4 flex justify-between items-center text-sm">
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterPage;
