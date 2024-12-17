import { Link } from "react-router-dom";

const Question = ({ question, showAuthor, align }) => {
  if (!question) {
    return (
      <div className="text-gray-500 dark:text-gray-400 mb-4">Loading...</div>
    );
  }

  return (
    <div
      key={question._id}
      className={`border-b border-gray-300 dark:border-gray-600 py-4 text-${align}`}
    >
      <Link
        to={`/questions/${question._id}`}
        className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        {question.title}
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {question.body.substring(0, 60)}...
      </p>
      {showAuthor ? (
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
          Posted by{" "}
          <Link
            to={`/users/${question.author._id}`}
            className="text-blue-500 dark:text-blue-300 hover:underline"
          >
            {question.author.username}
          </Link>
        </p>
      ) : (
        <></>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Views: {question.views}
      </p>
    </div>
  );
};

export default Question;
