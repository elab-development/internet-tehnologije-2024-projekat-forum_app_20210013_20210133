import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config/baseUrl";
import useAuth from "../hooks/useAuth";

const SingleQuestionPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [error, setError] = useState(null);

  const { isAuthenticated, token, userId } = useAuth();

  useEffect(() => {
    increaseViewCount();
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const questionRes = await axios.get(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/questions/${id}`
      );
      setQuestion(questionRes.data);

      const answersRes = await axios.get(
        `${baseUrl}:${
          import.meta.env.VITE_BACKEND_PORT
        }/answers/byQuestion/${id}`
      );
      setAnswers(answersRes.data);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Something went wrong while fetching data (answers)!"
      );
    }
  };

  const increaseViewCount = async () => {
    try {
      await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/questions/${id}/viewed`
      );
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Something went wrong while updating view count on question!"
      );
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer) {
      setError("Answer body is required!");
      return;
    }

    try {
      if (!token) {
        setError("You must be logged in to answer a question!");
        return;
      }

      const res = await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/answers`,
        {
          body: newAnswer,
          questionId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswers((prev) => [res.data, ...prev]);
      setNewAnswer("");
      setError(null);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Something went wrong while submitting your answer!"
      );
    }
  };

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="md:mx-20 mx-5 my-10">
      <div className="max-w-4xl mx-auto">
        {" "}
        {/* bg-gray-50 rounded shadow*/}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">
            {question.title}
          </h1>
          <p className="text-gray-700 mb-4">{question.body}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>Posted by: </span>
            <a
              href={`/users/${question.author._id}`}
              className="ml-2 text-blue-600 hover:underline"
            >
              {question.author.username}
            </a>
            <span className="ml-4">
              {new Date(question.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        {isAuthenticated ? (
          <div className="mb-3">
            <textarea
              className="w-full border rounded p-2 text-gray-700 resize-none"
              placeholder="Write your answer..."
              rows="3"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
            ></textarea>
            <button
              onClick={handleAddAnswer}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Answer
            </button>
          </div>
        ) : (
          <></>
        )}
        {error ? (
          <p className="text-red-500 mb-8">{error}</p>
        ) : (
          <div className="mb-8"></div>
        )}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-700">Answers</h2>
          {answers.length === 0 ? (
            isAuthenticated ? (
              <p className="text-gray-500">
                No answers yet. Be the first to answer!
              </p>
            ) : (
              <p className="text-gray-500">
                No answers yet. Login to be the first to answer!
              </p>
            )
          ) : (
            answers.map((answer) => (
              <div
                key={answer._id}
                className="p-4 bg-white border rounded shadow-sm"
              >
                <p className="text-gray-700">{answer.body}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span>Posted by: </span>
                  <a
                    href={`/users/${answer.author._id}`}
                    className="ml-2 text-blue-600 hover:underline"
                  >
                    {answer.author.username}
                  </a>
                  <span className="ml-4">
                    {new Date(answer.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleQuestionPage;
