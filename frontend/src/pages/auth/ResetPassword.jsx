import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../config/baseUrl";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const userData = { newPassword: newPassword };

    try {
      setError("");

      await axios.post(
        `${baseUrl}:${
          import.meta.env.VITE_BACKEND_PORT
        }/users/resetPassword/${token}`,
        userData
      );

      navigate("/login");
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
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Reset password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-gray-600 mb-1">
              New password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full border border-gray-300 rounded-lg p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            Reset
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
