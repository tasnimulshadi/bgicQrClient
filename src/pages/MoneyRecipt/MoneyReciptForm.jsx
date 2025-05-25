/* eslint-disable no-unused-vars */
// src/pages/DataForm.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

const dummy = {
  policyNumber: "BGIC/DZO/MISC/OMP-1250/05/2025",
  issuingDate: "2025-05-19",
  plan: "B : Zone 2 Worldwide Excl. USA, CANADA",
  destinationCountries: ["Poland", "Turkey", "Saudi Arabia"],
  travelStartDate: "2025-07-10",
  travelEndDate: "2025-08-06",
  countryOfResidence: "Bangladesh",
  telephone: "+8801671558822",
  insuredPerson: {
    fullName: "AMAYRA TARANNUM",
    dateOfBirth: "2019-11-12",
    passportNumber: "A08753703",
  },
};

function MoneyReciptForm() {
  const params = useParams();
  const [error, setError] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    policyNumber: "",
    issuingDate: "",
    plan: "",
    destinationCountries: [],
    travelStartDate: "",
    travelEndDate: "",
    countryOfResidence: "",
    telephone: "",
    premium: "",
    insuredPerson: {
      fullName: "",
      dateOfBirth: "",
      passportNumber: "",
    },
  });

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/money-receipt/${params.id}`
        );
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data");
      }
    };

    if (params.id) {
      fetchDataById();
    }
  }, [params]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in data.insuredPerson) {
      setData((prev) => ({
        ...prev,
        insuredPerson: {
          ...prev.insuredPerson,
          [name]: value,
        },
      }));
    } else if (name === "destinationCountries") {
      setData((prev) => ({
        ...prev,
        [name]: value.split(",").map((c) => c.trim()),
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (params.id) {
        // Edit
        await axios.patch(
          `http://localhost:5000/api/money-receipt/${data._id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        navigate(`/money-receipt/${data._id}`);
      } else {
        // Create
        await axios.post("http://localhost:5000/api/money-receipt", data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/money-receipt");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">
        {params.id ? "Edit Policy" : "Add New Policy"}
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl grid grid-cols-1 gap-6"
      >
        <div>
          <label className="block mb-1 font-medium">Policy Number</label>
          <input
            type="text"
            name="policyNumber"
            value={data.policyNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Issuing Date</label>
            <input
              type="date"
              name="issuingDate"
              value={moment(data.issuingDate).format("YYYY-MM-DD")}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Plan</label>
            <input
              type="text"
              name="plan"
              value={data.plan}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Destination Countries (comma separated)
          </label>
          <input
            type="text"
            name="destinationCountries"
            value={data.destinationCountries.join(", ")}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Travel Start Date</label>
            <input
              type="date"
              name="travelStartDate"
              value={moment(data.travelStartDate).format("YYYY-MM-DD")}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Travel End Date</label>
            <input
              type="date"
              name="travelEndDate"
              value={moment(data.travelEndDate).format("YYYY-MM-DD")}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              Country of Residence
            </label>
            <input
              type="text"
              name="countryOfResidence"
              value={data.countryOfResidence}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Telephone</label>
            <input
              type="tel"
              name="telephone"
              value={data.telephone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <h2 className="font-semibold text-lg mb-2">Insured Person</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={data.insuredPerson.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={moment(data.insuredPerson.dateOfBirth).format(
                  "YYYY-MM-DD"
                )}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Passport Number</label>
              <input
                type="text"
                name="passportNumber"
                value={data.insuredPerson.passportNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h2 className="font-semibold text-lg mb-2">Premium & VAT</h2>
          <div className="grid sm:grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Premium (write in text)
              </label>
              <input
                type="text"
                name="premium"
                value={data.premium}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default MoneyReciptForm;
