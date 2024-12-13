import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to Our Forum</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        Explore questions, share your knowledge, and collaborate with a vibrant community.
      </p>
      <div className="flex gap-4">
        <Link
          to="/questions"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
        >
          Browse Questions
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;