import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../config/baseUrl";
import { useEffect, useState } from "react";

const Answer = ({
  answer,
  setAnswer,
  token,
  userId,
  isAuthenticated,
  clickable,
}) => {
  const [totalScore, setTotalScore] = useState(null);
  const [vote, setVote] = useState(null);

  useEffect(() => {
    setTotalScore(answer.totalVoteScore);
    setVote(
      answer.userVotes.some(
        (vote) => vote.user._id === userId && vote.vote === "upvote"
      )
        ? "upvote"
        : answer.userVotes.some(
            (vote) => vote.user._id === userId && vote.vote === "downvote"
          )
        ? "downvote"
        : null
    );
  }, [answer]);

  const handleVote = async (vote) => {
    try {
      const response = await axios.post(
        `${baseUrl}:${import.meta.env.VITE_BACKEND_PORT}/answers/${
          answer._id
        }/vote`,
        { vote },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTotalScore(response.data.totalVoteScore);
      setVote(
        response.data.userVotes.some(
          (vote) => vote.user._id === userId && vote.vote === "upvote"
        )
          ? "upvote"
          : response.data.userVotes.some(
              (vote) => vote.user._id === userId && vote.vote === "downvote"
            )
          ? "downvote"
          : null
      );

      if (!setAnswer) return;

      setAnswer((prevAnswer) => ({
        ...prevAnswer,
        totalVoteScore: response.data.totalVoteScore,
        userVotes: response.data.userVotes,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (!answer) {
    return (
      <div className="text-gray-500 dark:text-gray-400 mb-4">Loading...</div>
    );
  }

  return (
    <div className="p-4 bg-white border rounded shadow-sm dark:bg-gray-800 dark:border-gray-700 flex items-center">
      {/* Voting Section */}
      {isAuthenticated && (
        <div className="flex flex-col items-center justify-center mr-4">
          <button
            onClick={() => handleVote("upvote")}
            className={
              vote === "upvote"
                ? "text-green-500"
                : "text-gray-400 hover:text-green-500"
            }
          >
            ▲
          </button>
          <span className="text-gray-700 dark:text-gray-200 font-bold">
            {totalScore}
          </span>
          <button
            onClick={() => handleVote("downvote")}
            className={
              vote === "downvote"
                ? "text-red-500"
                : "text-gray-400 hover:text-red-500"
            }
          >
            ▼
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="flex-1 mb-1">
        <div>
          {clickable ? (
            <Link
              to={`/answers/${answer._id}`}
              className="text-gray-700 text-justify dark:text-gray-200 hover:underline"
            >
              {answer.body}
            </Link>
          ) : (
            <p className="text-gray-700 text-justify dark:text-gray-200">
              {answer.body}
            </p>
          )}
          <div className="flex items-center text-sm text-gray-500 mt-2 dark:text-gray-400">
            <span>Posted by: </span>
            <Link
              to={`/users/${answer.author._id}`}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              {answer.author.username}
            </Link>
            <span className="ml-4">
              {new Date(answer.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
