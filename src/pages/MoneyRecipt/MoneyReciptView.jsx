import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFound from "../NotFound";
import TravelCertificate from "./TravelCertificate";

function MoneyReciptView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/money-receipt/${id}`
        );
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.error || "Failed to load data");
        }
      }
    };

    fetchDataById();
  }, [id]);

  const handleEdit = () => {
    navigate(`/money-receipt/edit/${id}`); // Adjust route based on your app
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this data? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/money-receipt/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/money-receipt"); // Redirect to data list after delete
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete data");
    }
  };

  if (notFound) return <NotFound />;
  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!data) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      {/* <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
      <p className="mb-2">
        <strong>Content:</strong> {data.content}
      </p>
      <p className="mb-4">
        <strong>ID:</strong> {data._id}
      </p> */}

      {isAuthenticated && (
        <div className="flex gap-4 m-4">
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}

      <TravelCertificate data={data} />
    </div>
  );
}

export default MoneyReciptView;
