import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config/baseUrl";
import useAuth from "../hooks/useAuth";

import Toolbar from "../components/Toolbar";

const SingleAnswerPage = () => {
  const { id } = useParams();
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);

  const { isAuthenticated, userId, loading } = useAuth();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const answerRes = await axios.get(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/answers/${id}`
      );

      setAnswer(answerRes.data);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.message
          : "Something went wrong while fetching data!"
      );
    }
  };

  if (!answer || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800">
        <div className="text-center text-2xl text-gray-700 dark:text-gray-200">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Toolbar userId={userId} isAuthenticated={isAuthenticated} />
      <div className="md:mx-20 mx-5 my-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-500 mb-12 dark:text-blue-400">
            {answer.question.title}
          </h1>
          <div className="p-4 bg-white border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 text-justify">
              {answer.body}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-2 dark:text-gray-400">
              <span>Posted by: </span>
              <a
                href={`/users/${answer.author._id}`}
                className="ml-2 text-blue-600 hover:underline dark:text-blue-400"
              >
                {answer.author.username}
              </a>
              <span className="ml-4">
                {new Date(answer.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default SingleAnswerPage;
