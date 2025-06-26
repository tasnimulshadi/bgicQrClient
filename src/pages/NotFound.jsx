// src/pages/NotFound.jsx
import React from "react"; // Import React for JSX

/**
 * NotFound component displays a 404 error page.
 * It provides a friendly message and directs the user.
 */
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-center p-4">
      {/* 404 Heading */}
      <h1 className="text-8xl font-extrabold text-gray-800 mb-4 animate-bounce">
        {" "}
        {/* Added subtle bounce animation */}
        404
      </h1>
      {/* Page Not Found Subheading */}
      <h2 className="text-4xl font-bold text-gray-700 mb-3">Page Not Found</h2>
      {/* Explanatory Message */}
      <p className="mb-8 text-lg text-gray-600 max-w-md">
        Oops! It seems the page you are looking for does not exist or has been
        moved.
      </p>
      {/* Link to go back home or dashboard */}
      {/* <a
        href="/dashboard" // Assuming '/dashboard' is the home or main landing page
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Go to Dashboard
      </a> */}
    </div>
  );
}

export default NotFound;
