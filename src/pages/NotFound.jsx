// src/pages/NotFound.jsx
import { useEffect, useState } from "react";
import config from "../utility/config";

function NotFound() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/test`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // console.log(config.apiUrl);
  console.log(data);

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
