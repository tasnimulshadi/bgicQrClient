// src/pages/OMPForm.jsx
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";

export default function OMPForm() {
  const params = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const policyNumberInputRef = useRef(null);

  const [error, setError] = useState("");
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
    destination: "",
    travelDateFrom: moment(new Date()).format("YYYY-MM-DD"),
    travelDays: "",
    travelDateTo: "",
    countryOfResidence: "Bangladesh",
    limitOfCover: "",
    limitOfCoverCurrency: "",
    premium: "",
    vat: "",
    producer: "Md. Imran Rouf",
    mrNo: "",
    mrDate: "",
    mop: "",
    chequeNo: "",
    chequeDate: "",
    bank: "",
    bankBranch: "",
    note: "",
  });

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
    currency: [
      { id: 1, value: "US$" },
      { id: 2, value: "BDT" },
      { id: 3, value: "INR" },
      { id: 4, value: "EUR" },
    ],
    mop: [
      { id: 1, value: "Pay Order" },
      { id: 2, value: "Bank Transfer" },
    ],
    vatPecentage: 30,
  };

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/omp/${params.id}`
        );

        const transformedData = {
          ...res.data,
          issueDate: moment(res.data.issueDate).format("YYYY-MM-DD"),
        };
        setData((prev) => ({ ...prev, ...transformedData }));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data");
      }
    };

    if (params.id) {
      fetchDataById();
    }
  }, [params]);

  // SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (params.id) {
        // Edit
        await axios.patch(`http://localhost:5000/api/v1/omp/${data.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate(`/omp/${data.id}`, { replace: true });
      } else {
        // Create
        await axios.post("http://localhost:5000/api/v1/omp", data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        navigate("/omp", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    }
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
  // Tavel Date to
  function handleChange_travelDateFrom(e) {
    const startDate = e.target.value;
    const endDate = moment(startDate)
      .add(data.travelDays, "days")
      .format("YYYY-MM-DD");

    setData({
      ...data,
      travelDateFrom: e.target.value,
      travelDateTo: endDate,
    });
  }

  // Tavel Days
  // Tavel Date to
  function handleChange_travelDays(e) {
    const value = e.target.value;
    const endDate = moment(data.travelDateFrom)
      .add(value, "days")
      .format("YYYY-MM-DD");

    // Only allow digits (positive integers)
    if (/^\d*$/.test(value)) {
      setData({
        ...data,
        travelDays: value,
        travelDateTo: endDate,
      });
    }
  }

  // Premium
  // Vat
  // Total
  function handleChange_premium(e) {
    const premiumValue = e.target.value;
    const vatValue = (premiumValue * dropdownData.vatPecentage) / 100;
    setData({
      ...data,
      premium: premiumValue,
      vat: vatValue,
    });
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
  // Limit Of Cover
  // Limit Of Cover Currency
  // Mr No.
  // Mr Date
  // Bank
  // Bank Branch
  // Cheque No.
  // Cheque Date
  // MOP
  // Destination
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

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Form 2</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form className=" grid grid-cols-1 gap-6 w-full" onSubmit={handleSubmit}>
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
              value={
                data.issueDate
                  ? moment(data.issueDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>
        </div>

        <hr />

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
              value={data.dob ? moment(data.dob).format("YYYY-MM-DD") : ""}
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

        <hr />

        {/* Destination Read Only*/}
        <div className="grid sm:grid-cols-1 gap-4 items-end">
          <div className="">
            <label className="block mb-1 font-medium">Destination</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              value={data.destination}
              onChange={handleChange}
              name="destination"
            />
          </div>
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
              value={
                data.travelDateFrom
                  ? moment(data.travelDateFrom).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange_travelDateFrom}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Tavel Date To */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">To</label>
            <input
              type="date"
              value={
                data.travelDateTo
                  ? moment(data.travelDateTo).format("YYYY-MM-DD")
                  : ""
              }
              readOnly
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-200"
            />
          </div>
        </div>

        {/* Premium & Cover*/}
        <div className="grid sm:grid-cols-5 gap-4 items-end">
          {/* Limit Of Cover */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Limit Of Cover</label>
            <input
              type="number"
              name="limitOfCover"
              required
              value={data.limitOfCover}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Limit Of Cover Currency */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Currency</label>
            <select
              name="limitOfCoverCurrency"
              value={data.limitOfCoverCurrency}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            >
              <option value="">Select A Currency</option>
              {dropdownData.currency.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          {/* Premium */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Premium</label>
            <input
              type="number"
              name="premium"
              required
              inputMode="numeric"
              value={data.premium}
              onChange={handleChange_premium}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Vat */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Vat</label>
            <input
              type="text"
              inputMode="numeric"
              value={data.vat}
              readOnly
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-200"
            />
          </div>

          {/* Total */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Total</label>
            <input
              type="text"
              inputMode="numeric"
              value={Number(data.premium) + Number(data.vat)}
              readOnly
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-200"
            />
          </div>
        </div>

        <hr />

        {/* MR */}
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          {/* Mr No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Mr No.</label>
            <input
              type="number"
              name="mrNo"
              // required
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.mrNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Mr Date */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Mr Date</label>
            <input
              type="date"
              name="mrDate"
              value={
                data.mrDate ? moment(data.mrDate).format("YYYY-MM-DD") : ""
              }
              onChange={handleChange}
              // required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>
        </div>

        {/* Bank Info */}
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          {/* MOP */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">MOP</label>
            <select
              name="mop"
              value={data.mop}
              onChange={handleChange}
              // required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            >
              <option value="">Select A MOP</option>
              {dropdownData.mop.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          {/* Cheque No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Cheque No</label>
            <input
              type="text"
              name="chequeNo"
              // required
              pattern="[0-9]*"
              value={data.chequeNo}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Cheque Date */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Cheque Date</label>
            <input
              type="date"
              name="chequeDate"
              value={
                data.chequeDate
                  ? moment(data.chequeDate).format("YYYY-MM-DD")
                  : ""
              }
              onChange={handleChange}
              // required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Bank */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Bank</label>
            <input
              type="text"
              name="bank"
              // required
              value={data.bank}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>

          {/* Branch */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Branch</label>
            <input
              type="text"
              name="bankBranch"
              // required
              value={data.bankBranch}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block mb-1 font-medium">Note</label>
          <input
            type="text"
            name="note"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            value={data.note}
          />
        </div>

        <hr />

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {params.id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
