import React, { useState } from "react";
import axios from "axios";
import config from "../../utility/config";

const SearchModal = ({ onSelect, token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMatchingResults = async () => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("mrNumber", query);
      queryParams.append("policyNumber", query);
      queryParams.append("page", 1);
      queryParams.append("limit", 10);

      const res = await axios.get(
        `${config.apiUrl}/omp?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(res.data.data || []);
    } catch (err) {
      console.error("Search fetch error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-white rounded cursor-pointer"
      >
        🔍
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#000000a8] bg-opacity-20 flex items-center justify-center z-50 text-base">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Search Policy No</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* Input & Manual Search Button */}
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Policy number or MR number"
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={fetchMatchingResults}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            {/* Results */}
            {isLoading && (
              <p className="text-sm text-gray-400 mt-2">Searching...</p>
            )}

            {!isLoading && results.length > 0 && (
              <ul className="mt-2 border rounded shadow max-h-48 overflow-y-auto">
                {results.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                  >
                    {item.policyNo}
                  </li>
                ))}
              </ul>
            )}

            {!isLoading && query && results.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No results found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
