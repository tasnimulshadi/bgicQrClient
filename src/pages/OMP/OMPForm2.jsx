/* eslint-disable no-unused-vars */
// src/pages/DataForm.jsx
import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

export default function OMPForm2() {
  const [error, setError] = useState("");
  const policyNumberInputRef = useRef(null);

  const dropdownData = {
    typeOfTRV: [
      { id: 1, value: "Plan A : Zone 1 Worldwide Including USA, CANADA" },
      { id: 2, value: "Plan A : Zone 2 Worldwide Excluding USA, CANADA" },
      { id: 3, value: "Plan B : Zone 1 Worldwide Including USA, CANADA" },
      { id: 4, value: "Plan B : Zone 2 Worldwide Excluding USA, CANADA" },
    ],
    gender: [
      { id: 1, value: "Male" },
      { id: 2, value: "Female" },
    ],
    countriesList: [
      { id: 1, value: "Bangladesh" },
      { id: 2, value: "India" },
      { id: 3, value: "Pakistan" },
      { id: 4, value: "Nepal" },
      { id: 5, value: "Sri Lanka" },
      { id: 6, value: "China" },
      { id: 7, value: "Japan" },
      { id: 8, value: "South Korea" },
      { id: 9, value: "United States" },
      { id: 10, value: "Canada" },
      { id: 11, value: "United Kingdom" },
      { id: 12, value: "Germany" },
      { id: 13, value: "France" },
      { id: 14, value: "Italy" },
      { id: 15, value: "Australia" },
      { id: 16, value: "New Zealand" },
      { id: 17, value: "South Africa" },
      { id: 18, value: "Brazil" },
      { id: 19, value: "Russia" },
      { id: 20, value: "Turkey" },
    ],
  };

  const [data, setData] = useState({
    typeOfTRV: "",
    ompNumber: "",
    policyNumber: "",
    issueDate: moment(new Date()).format("YYYY-MM-DD"),
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    address: "",
    mobile: "",
    email: "",
    passport: "",
    destination: [
      {
        id: 1748340096882,
        country: "India",
        remarks: "",
      },
    ],
    travelDateFrom: moment(new Date()).format("YYYY-MM-DD"),
    travelDays: "",
    travelDateTo: "",
    //

    countryOfResidence: "",
    telephone: "",
    premium: "",
    insuredPerson: {
      fullName: "",
      dateOfBirth: "",
      passportNumber: "",
    },
  });
  console.log(data);

  // Destination
  // Edit
  const handleDestinationChange = (index, field, value) => {
    const updated = [...data.destination];
    updated[index][field] = value;
    setData({ ...data, destination: updated });
  };

  // Destination
  // Add
  const handleAddMore = () => {
    setData({
      ...data,
      destination: [
        ...data.destination,
        { id: Date.now(), country: "", remarks: "" },
      ],
    });
  };

  // Destination
  // Delete
  const handleDelete = (id) => {
    const filtered = data.destination.filter((item) => item.id !== id);
    setData({ ...data, destination: filtered });
  };

  // OMP No.
  // Policy No. // OMP No.
  function handleChange_ompNumber(e) {
    // 1250
    // BGIC/DZO/MISC/OMP-1250/05/2025
    const value = e.target.value;

    if (value.length <= 4 && value.length > 0) {
      setData({
        ...data,
        ompNumber: value,
        policyNumber:
          "BGIC/DZO/MISC/OMP-" +
          value +
          moment(data.issueDate).format("/MM/YYYY"),
      });
    }
  }

  // Tavel Date From
  function handleChange_travelDateFrom(e) {
    setData({
      ...data,
      travelDateFrom: e.target.value,
      travelDateTo: "",
    });
  }

  // Tavel Days
  // Tavel Date to
  function handleChange_travelDays(e) {
    const value = e.target.value;
    const futureDate = moment(data.travelDateFrom)
      .add(value, "days")
      .format("YYYY-MM-DD");

    // Only allow digits (positive integers)
    if (/^\d*$/.test(value) && value > 0) {
      setData({
        ...data,
        travelDays: value,
        travelDateTo: futureDate,
      });
    }
  }

  // Type of TRV
  // Policy No. // Issue Date
  // First Name
  // Last Name
  // Gender
  // Address
  // Mobile
  // E Mail
  // Passport
  // Tavel Date From
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  }

  // Date of Birth // Age
  const age = moment().diff(moment(data.dob, "YYYY-MM-DD"), "years");
  // Tavel Days
  const travelDays = moment(data.travelDateTo, "YYYY-MM-DD").diff(
    moment(data.travelDateFrom, "YYYY-MM-DD"),
    "days"
  );

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Form 2</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form className=" grid grid-cols-1 gap-6 w-full">
        {/* Type of TRV = Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Type of TRV</label>
          <select
            name="typeOfTRV"
            value={data.typeOfTRV}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
          >
            <option value="">Select A Type of TRV</option>
            {dropdownData.typeOfTRV.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>

        {/* Policy No. */}
        <div className="grid sm:grid-cols-4 gap-4">
          {/* Policy No. */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">Policy No.</label>
            <input
              type="text"
              name="policyNumber"
              value={data.policyNumber}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-200"
              readOnly
              onFocus={() => policyNumberInputRef.current.focus()}
            />
          </div>

          {/* OMP No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">OMP No.</label>
            <input
              type="text"
              name="ompNumber"
              onChange={handleChange_ompNumber}
              value={data.ompNumber}
              pattern="^\d{1,4}$" // allow only digits
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              ref={policyNumberInputRef}
            />
          </div>

          {/* Issue Date */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={data.issueDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>
        </div>

        {/* Issued Person Info */}
        <div className="grid sm:grid-cols-4 gap-4">
          {/* First Name */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              value={data.firstName}
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              value={data.lastName}
              onChange={handleChange}
            />
          </div>

          {/* Date of Birth */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">
              Date of Birth ( {age} Years )
            </label>
            <input
              type="date"
              name="dob"
              value={data.dob}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Gender */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={data.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            >
              <option value="">Select A Gender</option>
              {dropdownData.gender.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input
            name="address"
            value={data.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded resize-y shadow-xl bg-gray-100"
          />
        </div>

        {/* Issued Person Contact Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Mobile No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Mobile No.</label>
            <input
              type="text"
              name="mobile"
              required
              maxLength={11}
              value={data.mobile}
              onChange={handleChange}
              pattern="^01[0-9]{9}$"
              title="Mobile number must start with 01 and be exactly 11 digits"
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* E Mail */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">E Mail</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              value={data.email}
              onChange={handleChange}
            />
          </div>

          {/* Passport No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Passport No.</label>
            <input
              type="text"
              name="passport"
              required
              pattern="^[A-Z][0-9]{8}$"
              title="Passport number must be 1 capital letter followed by 8 digits"
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              value={data.passport}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Destination*/}
        <div className="space-y-4">
          {data.destination.map((item, index) => (
            <div key={item.id} className="grid sm:grid-cols-5 gap-4 items-end">
              {/* Country Select */}
              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium">Destination</label>
                <select
                  className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
                  value={item.country}
                  onChange={(e) =>
                    handleDestinationChange(index, "country", e.target.value)
                  }
                >
                  <option value="">Select a destination</option>
                  {dropdownData.countriesList.map((country) => (
                    <option key={country.id} value={country.value}>
                      {country.value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks Input */}
              <div className="sm:col-span-2">
                <label className="block mb-1 font-medium">Remarks</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded  shadow-xl bg-gray-100"
                  value={item.remarks}
                  onChange={(e) =>
                    handleDestinationChange(index, "remarks", e.target.value)
                  }
                />
              </div>

              {/* Delete Button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 shadow-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            type="button"
            onClick={handleAddMore}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 shadow-xl"
          >
            Add More
          </button>
        </div>

        {/* Destination Read Only*/}
        <div>
          <label className="block mb-1 font-medium">Destination</label>
          <input
            type="text"
            readOnly
            className="w-full px-4 py-2 border rounded shadow-xl bg-gray-200"
            value={formatDestinationList(data.destination)}
          />
        </div>

        {/* Tavel Days */}
        <div className="grid sm:grid-cols-5 gap-4 items-end">
          {/* Tavel Days */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Tavel Days</label>
            <input
              type="text"
              name="travelDays"
              required
              inputMode="numeric"
              pattern="[1-9]*"
              value={data.travelDays}
              onChange={handleChange_travelDays}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Tavel Date From */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">From</label>
            <input
              type="date"
              name="travelDateFrom"
              value={data.travelDateFrom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Tavel Date To */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">To</label>
            <input
              type="date"
              value={data.travelDateTo}
              readOnly
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-200"
            />
          </div>
        </div>

        {/*  */}

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

function formatDestinationList(destinations) {
  const countries = destinations.map((d) => d.country).filter(Boolean);

  if (countries.length === 0) return "";
  if (countries.length === 1) return countries[0];
  if (countries.length === 2) return `${countries[0]} and ${countries[1]}`;

  const allButLast = countries.slice(0, -1).join(", ");
  const last = countries[countries.length - 1];
  return `${allButLast} and ${last}`;
}
