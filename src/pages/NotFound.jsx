// src/pages/NotFound.jsx

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center animate-fade-in">
      <h1 className="text-6xl font-extrabold text-black mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
      <p className="mb-6 text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>
    </div>
  );
}

export default NotFound;
