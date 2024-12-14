import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config/baseUrl";
import useAuth from "../hooks/useAuth";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    minViews: "",
    maxViews: "",
    createdAfter: "",
    createdBefore: "",
    updatedAfter: "",
    updatedBefore: "",
    minAnswers: "",
    maxAnswers: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: "", body: "" });
  const [showPostNew, setShowPostNew] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, token, userId } = useAuth();

  useEffect(() => {
    fetchQuestions();
    fetchUsersByReputation();
  }, [page]);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  const togglePostNew = () => {
    setError(null);
    setShowPostNew((prev) => !prev);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    setQuestions([]);
    setPage(1);
    fetchQuestions();
  };

  const buildQueryParams = (params) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    return queryParams.toString();
  };

  const handleScroll = (e) => {
    if (
      window.innerHeight + e.target.documentElement.scrollTop + 1 >=
      e.target.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePostNewQuestion = async () => {
    if (!newQuestion.title || !newQuestion.body) {
      setError("Title and body are required!");
      return;
    }

    try {
      if (!token) {
        setError("You must be logged in to post a question!");
        return;
      }

      const response = await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/questions`,
        {
          title: newQuestion.title,
          body: newQuestion.body,
          author: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuestions([response.data, ...questions]);
      setNewQuestion({ title: "", body: "" });

      setError(null);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Something went wrong while submitting your question."
      );
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams({
        page,
        limit: 5,
        ...filters,
      });

      const res = await axios.get(
        `${baseUrl}:${
          import.meta.env.VITE_BACKEND_PORT
        }/questions?${queryParams}`
      );
      setQuestions((prev) => [...prev, ...res.data.questions]);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Something went wrong while fetching data (questions)!"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersByReputation = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}:${
          import.meta.env.VITE_BACKEND_PORT
        }/users/byReputation?page=1&limit=10`
      );

      setUsers(res.data.users);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Something went wrong while fetching data (users)!"
      );
    }
  };

  return (
    <div className="flex flex-row md:mx-20 mx-5 my-10 xl:justify-around justify-between">
      <div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
            <button
              onClick={toggleFilters}
              className="text-sm text-blue-600 hover:underline"
            >
              {showFilters ? "Hide" : "Show"}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {/* Minimum Views */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="minViews"
                >
                  Minimum Views
                </label>
                <input
                  id="minViews"
                  type="number"
                  name="minViews"
                  value={filters.minViews}
                  onChange={handleFilterChange}
                  placeholder="Enter Min Views"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Maximum Views */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="maxViews"
                >
                  Maximum Views
                </label>
                <input
                  id="maxViews"
                  type="number"
                  name="maxViews"
                  value={filters.maxViews}
                  onChange={handleFilterChange}
                  placeholder="Enter Max Views"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Created After */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="createdAfter"
                >
                  Created After
                </label>
                <input
                  id="createdAfter"
                  type="date"
                  name="createdAfter"
                  value={filters.createdAfter}
                  onChange={handleFilterChange}
                  placeholder="Select Start Date"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Created Before */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="createdBefore"
                >
                  Created Before
                </label>
                <input
                  id="createdBefore"
                  type="date"
                  name="createdBefore"
                  value={filters.createdBefore}
                  onChange={handleFilterChange}
                  placeholder="Select End Date"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Updated After */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="updatedAfter"
                >
                  Updated After
                </label>
                <input
                  id="updatedAfter"
                  type="date"
                  name="updatedAfter"
                  value={filters.updatedAfter}
                  onChange={handleFilterChange}
                  placeholder="Select Start Date"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Updated Before */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="updatedBefore"
                >
                  Updated Before
                </label>
                <input
                  id="updatedBefore"
                  type="date"
                  name="updatedBefore"
                  value={filters.updatedBefore}
                  onChange={handleFilterChange}
                  placeholder="Select End Date"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Minimum Answers */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="minAnswers"
                >
                  Minimum Answers
                </label>
                <input
                  id="minAnswers"
                  type="number"
                  name="minAnswers"
                  value={filters.minAnswers}
                  onChange={handleFilterChange}
                  placeholder="Enter Min Answers"
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Maximum Answers */}
              <div>
                <label
                  className="block text-sm text-gray-700 mb-1 ml-1"
                  htmlFor="maxAnswers"
                >
                  Maximum Answers
                </label>
                <input
                  id="maxAnswers"
                  type="number"
                  name="maxAnswers"
                  value={filters.maxAnswers}
                  onChange={handleFilterChange}
                  placeholder="Enter Max Answers"
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          )}

          {showFilters && (
            <button
              onClick={handleApplyFilters}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Apply Filters
            </button>
          )}
        </div>

        {isAuthenticated ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-700">
                Post a New Question
              </h2>
              <button
                onClick={togglePostNew}
                className="text-sm text-blue-600 hover:underline"
              >
                {showPostNew ? "Hide" : "Show"}
              </button>
            </div>
            <div>
              {showPostNew ? (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Enter a Title"
                      value={newQuestion.title}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          title: e.target.value,
                        })
                      }
                      className="w-2/5 p-2 border rounded border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-2">
                    <textarea
                      placeholder="Write your question..."
                      value={newQuestion.body}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          body: e.target.value,
                        })
                      }
                      className="w-4/5 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows="4"
                    />
                  </div>

                  <div className="mb-3">
                    <button
                      onClick={handlePostNewQuestion}
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}

              {error && <p className="text-red-500 mb-2">{error}</p>}
            </div>
          </div>
        ) : (
          <></>
        )}

        <h1 className="text-3xl font-bold text-gray-700 mt-10">Questions</h1>

        {questions.map((q) => (
          <div key={q._id} className="border-b py-4">
            <Link
              to={`/questions/${q._id}`}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {q.title}
            </Link>
            <p className="text-sm text-gray-500">
              {q.body.substring(0, 100)}...
            </p>
            <p className="text-sm text-gray-800 mt-1">
              Posted by{" "}
              <Link
                to={`/users/${q.author._id}`}
                className="text-blue-500 hover:underline"
              >
                {q.author.username}
              </Link>
            </p>
            <p className="text-sm text-gray-500">Views: {q.views}</p>
          </div>
        ))}

        {loading && (
          <p className="text-center mt-4 text-gray-500">
            Loading more questions...
          </p>
        )}
      </div>

      <div className="w-1/6 h-full hidden lg:block">
        {" "}
        {/*bg-gray-100 rounded shadow*/}
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Top Users</h2>
        <div>
          {users.map((user) => (
            <div key={user._id} className="border-b py-2">
              <Link
                to={`/users/${user._id}`}
                className="text-blue-600 hover:underline"
              >
                {user.username}
              </Link>
              <p className="text-sm text-gray-500">
                Reputation: {user.reputation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
