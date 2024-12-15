import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config/baseUrl";
import useAuth from "../hooks/useAuth";

import Toolbar from "../components/Toolbar";

const UserProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [toggleView, setToggleView] = useState("questions");

  const { isAuthenticated, token, userId, isAdmin, loading } = useAuth();

  useEffect(() => {
    fetchUserData();
    fetchQuestions();
    fetchAnswers();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const userRes = await axios.get(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/users/${id}`
      );

      setUser(userRes.data);
      fetchQuestions();
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const questionsRes = await axios.get(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/questions/byUser/${id}`
      );
      setQuestions(questionsRes.data);
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  const fetchAnswers = async () => {
    try {
      const answersRes = await axios.get(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/answers/byUser/${id}`
      );
      setAnswers(answersRes.data);
    } catch (error) {
      console.error("Error fetching answers: ", error);
    }
  };

  const toggleContent = (view) => {
    setToggleView(view);
    if (view === "questions") {
      fetchQuestions();
    } else if (view === "answers") {
      fetchAnswers();
    }
  };

  const handleBanUnban = async () => {
    try {
      const action = user.isBanned ? "unban" : "ban";
      await axios.put(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/users/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, isBanned: !user.isBanned });
    } catch (error) {
      console.error("Error performing ban/unban: ", error);
    }
  };

  const handlePromote = async () => {
    try {
      await axios.put(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/users/${id}/promote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser({ ...user, isAdmin: true });
    } catch (error) {
      console.error("Error promoting user: ", error);
    }
  };

  if (!user || !questions || !answers || loading)
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-gray-800">
        <div className="text-center text-2xl text-gray-700 dark:text-gray-200">
          Loading...
        </div>
      </div>
    );

  return (
    <>
      <Toolbar userId={userId} isAuthenticated={isAuthenticated} />
      <div className="md:mx-20 mx-5 my-24">
        <div className="max-w-4xl mx-auto">
          {/* User Info Section */}
          <div className="flex flex-col items-center bg-white p-6 shadow-lg shadow-gray-200 dark:shadow-gray-900 rounded-lg border dark:bg-gray-800 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              {user.username}
            </h1>
            <p className="text-gray-600 text-lg mt-2 dark:text-gray-300">
              Reputation: {user.reputation}
            </p>
            {user.isAdmin ? (
              <p className="mt-1 text-green-600 font-medium dark:text-green-400">
                Admin
              </p>
            ) : user.isBanned ? (
              <p className="mt-1 text-red-600 font-medium dark:text-red-400">
                Banned
              </p>
            ) : null}

            {/* Admin Actions */}
            {isAdmin && !user.isAdmin && (
              <div className="mt-6 flex space-x-4">
                {!user.isBanned && (
                  <button
                    onClick={handlePromote}
                    className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    Promote User
                  </button>
                )}
                <button
                  onClick={handleBanUnban}
                  className={`px-4 py-2 text-white rounded shadow ${
                    user.isBanned
                      ? "bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600"
                      : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  }`}
                >
                  {user.isBanned ? "Unban User" : "Ban User"}
                </button>
              </div>
            )}
          </div>

          {/* Toggle Radiobuttons */}
          <div className="mt-8 flex justify-center space-x-8">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="view"
                value="questions"
                checked={toggleView === "questions"}
                onChange={() => toggleContent("questions")}
                className="form-radio text-blue-600 dark:text-blue-400"
              />
              <span className="text-lg text-gray-800 dark:text-gray-200">
                Questions
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="view"
                value="answers"
                checked={toggleView === "answers"}
                onChange={() => toggleContent("answers")}
                className="form-radio text-blue-600 dark:text-blue-400"
              />
              <span className="text-lg text-gray-800 dark:text-gray-200">
                Answers
              </span>
            </label>
          </div>

          {/* Content Section */}
          <div className="mt-10 space-y-6">
            {toggleView === "questions" &&
              (questions.length === 0 ? (
                <p className="text-gray-500 text-center dark:text-gray-400">
                  This user hasn't asked any questions yet!
                </p>
              ) : (
                questions.map((q) => (
                  <div
                    key={q._id}
                    className="border-b pb-4 text-center dark:border-gray-700"
                  >
                    <Link
                      to={`/questions/${q._id}`}
                      className="text-lg font-semibold text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-500"
                    >
                      {q.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                      {q.body.substring(0, 60)}...
                    </p>
                    <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                      Views: {q.views}
                    </p>
                  </div>
                ))
              ))}

            {toggleView === "answers" &&
              (answers.length === 0 ? (
                <p className="text-gray-500 text-center dark:text-gray-400">
                  This user hasn't posted any answers yet!
                </p>
              ) : (
                answers.map((answer) => (
                  <div
                    key={answer._id}
                    className="p-4 bg-white border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  >
                    <Link to={`/answers/${answer._id}`}>
                      <p className="text-gray-700 text-justify dark:text-gray-300">
                        {answer.body}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mt-2 dark:text-gray-400">
                        <span>
                          {new Date(answer.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
