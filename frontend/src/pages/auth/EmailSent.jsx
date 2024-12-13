import React from "react";

const EmailSentPage = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Email sent</h1>
      <p className="text-gray-700 mb-6 text-center max-w-md">
        An email with instructions to reset your password has been sent. Please
        check your inbox and follow the provided link to complete the process.
      </p>
    </div>
  );
};

export default EmailSentPage;
