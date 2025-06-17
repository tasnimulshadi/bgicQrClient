// src/pages/OMPForm.jsx
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import config from "../../utility/config";
import { toast } from "react-toastify";

export default function OMPForm() {
  const params = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const policyNumberInputRef = useRef(null);

  const [error, setError] = useState("");
  const [data, setData] = useState({
    typeOfTRV: "",
    planCode: "",
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
    currency: "",
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
      {
        id: "CZ1",
        value:
          "Plan A : Zone 1 Students & Accompanying Spouse (Worldwide Including USA, CANADA)",
      },
      {
        id: "CZ2",
        value:
          "Plan A : Zone 2 Students & Accompanying Spouse (Worldwide Excluding USA, CANADA)",
      },
      {
        id: "DZ1",
        value:
          "Plan B : Zone 1 Students & Accompanying Spouse (Worldwide Including USA, CANADA)",
      },
      {
        id: "DZ2",
        value:
          "Plan B : Zone 2 Students & Accompanying Spouse (Worldwide Excluding USA, CANADA)",
      },
      {
        id: "AZ1",
        value: "Plan A : Zone 1 Worldwide Including USA, CANADA",
      },
      {
        id: "AZ2",
        value: "Plan A : Zone 2 Worldwide Excluding USA, CANADA",
      },
      {
        id: "BZ1",
        value: "Plan B : Zone 1 Worldwide Including USA, CANADA",
      },
      {
        id: "BZ2",
        value: "Plan B : Zone 2 Worldwide Excluding USA, CANADA",
      },
    ],
    gender: [
      { id: 1, value: "Male" },
      { id: 2, value: "Female" },
    ],
    currency: [
      { id: 1, value: "US$" },
      { id: 2, value: "EURO" },
      { id: 3, value: "TK" },
    ],
    mop: [
      { id: 1, value: "Cash" },
      { id: 2, value: "Cheque" },
      { id: 3, value: "D.D" },
      { id: 4, value: "T.T" },
      { id: 5, value: "Pay Order" },
      { id: 6, value: "Credit Advice" },
    ],
    vatPecentage: 30,
  };

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await axios.get(`${config.apiUrl}/omp/${params.id}`);

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
      // trimming the names of empty spaces
      const trimmedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );
      setData(trimmedData);

      // API Call
      if (params.id) {
        // Edit
        await axios.patch(`${config.apiUrl}/omp/${data.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(
          <div>
            <p className="font-bold">OMP Updated.</p>
            <p>{data.policyNumber}</p>
          </div>
        );
        navigate(`/omp/${data.id}`, { replace: true });
      } else {
        // Create
        await axios.post(`${config.apiUrl}/omp`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(
          <div>
            <p className="font-bold">OMP Created.</p>
            <p>{data.policyNumber}</p>
          </div>
        );
        navigate("/omp", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    }
  };

  function handleChange_typeOfTRV(e) {
    const value = e.target.value; // this is item.id
    const foundItem = dropdownData.typeOfTRV.find(
      (item) => item.value === value
    );

    setData({
      ...data,
      typeOfTRV: value,
      planCode: foundItem.id,
      limitOfCover: foundItem.limit,
    });
  }

  // OMP No.
  // Policy No. // OMP No.
  function handleChange_ompNumber(e) {
    // 1250
    // BGIC/DZO/MISC/OMP-1250/05/2025
    const value = e.target.value;

    if (/^\d{0,4}$/.test(value)) {
      setData({
        ...data,
        ompNumber: value,
        policyNumber:
          value === ""
            ? ""
            : "BGIC/DZO/MISC/OMP-" +
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
      .add(data.travelDays - 1, "days")
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
      .add(value - 1, "days")
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

  const handleChange_onlyText = (e) => {
    const { name, value } = e.target;
    // Allow letters, spaces, dot, comma
    if (/^[A-Za-z\s.,]*$/.test(value)) {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Date of Birth // Age
  const age = moment().diff(moment(data.dob, "YYYY-MM-DD"), "years");

  if (error) {
    toast.error(
      <div>
        <p className="font-bold">Error!</p>
        <p>{error}</p>
      </div>
    );
    setError("");
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Form 2</h1>

      {/* {error && <p className="text-red-600 mb-4">{error}</p>} */}

      <form className=" grid grid-cols-1 gap-6 w-full">
        {/* Type of TRV = Dropdown */}
        <div>
          <label className="block mb-1 font-medium">Type of TRV</label>
          <select
            name="typeOfTRV"
            value={data.typeOfTRV}
            onChange={handleChange_typeOfTRV}
            required
            className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
            title=""
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
          {/* OMP No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">OMP No.</label>
            <input
              type="number"
              name="ompNumber"
              onChange={handleChange_ompNumber}
              value={data.ompNumber}
              min={1}
              max={9999}
              required
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              ref={policyNumberInputRef}
              placeholder="Enter OMP No."
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

          {/* Policy No. */}
          <div className="sm:col-span-2">
            <label className="block mb-1 font-medium">Policy No.</label>
            <input
              type="text"
              name="policyNumber"
              value={data.policyNumber}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-600 text-white"
              readOnly
              onFocus={() => policyNumberInputRef.current.focus()}
              placeholder="Enter OMP No."
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
              onChange={handleChange_onlyText}
              placeholder="Enter First Name"
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
              onChange={handleChange_onlyText}
              placeholder="Enter Last Name"
            />
          </div>

          {/* Date of Birth */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">
              Date of Birth {age ? `(${age} Years)` : null}
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
            placeholder="Enter Full Address Here."
          />
        </div>

        {/* Issued Person Contact Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Mobile No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Mobile No.</label>
            <input
              type="tel"
              name="mobile"
              required
              value={data.mobile}
              onChange={handleChange}
              pattern="^01[0-9]{9}$"
              maxLength={11} // works on type="tel"
              title="Mobile number must start with 01 and be exactly 11 digits"
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter Mobile Number"
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
              placeholder="Enter E-Mail"
            />
          </div>

          {/* Passport No. */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Passport No.</label>
            <input
              type="text"
              name="passport"
              required
              // pattern="^[A-Z][0-9]{8}$"
              // title="Passport number must be 1 capital letter followed by 8 digits"
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              value={data.passport}
              onChange={handleChange}
              placeholder="Enter Passport Number"
            />
          </div>
        </div>

        <hr />

        {/* Destination*/}
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
              placeholder="Enter Travel Destination. For Multiple Destinations Please Use Comma"
              title="For Multiple Destinations Please Use Comma"
            />
          </div>
        </div>

        {/* Tavel Days */}
        <div className="grid sm:grid-cols-5 gap-4 items-end">
          {/* Tavel Days */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Tavel Days</label>
            <input
              type="number"
              name="travelDays"
              required
              min={1}
              max={120}
              value={data.travelDays}
              onChange={handleChange_travelDays}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter Travel Days"
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
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-600 text-white"
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
              min={1}
              onChange={handleChange}
              required
              value={data.limitOfCover}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-600 text-white"
              placeholder="Enter Limit Of Cover"
              title="Enter Limit Of Cover Amount"
            />
          </div>

          {/* Limit Of Cover Currency */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Currency</label>
            <select
              name="currency"
              value={data.currency}
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
              min={1}
              inputMode="numeric"
              value={data.premium}
              onChange={handleChange_premium}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter Premium Amount"
              title="Enter Premium Amount"
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
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-600 text-white"
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
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-600 text-white"
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
              min={1}
              value={data.mrNo ? data.mrNo : ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter MR Number"
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
              value={data.mop ? data.mop : ""}
              onChange={handleChange}
              title="Method Of Payment"
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
            <label className="block mb-1 font-medium">Cheque No.</label>
            <input
              type="text"
              name="chequeNo"
              // required
              value={data.chequeNo ? data.chequeNo : ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter Cheque No."
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
              value={data.bank ? data.bank : ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter Bank Name"
            />
          </div>

          {/* Branch */}
          <div className="sm:col-span-1">
            <label className="block mb-1 font-medium">Branch</label>
            <input
              type="text"
              name="bankBranch"
              // required
              value={data.bankBranch ? data.bankBranch : ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded shadow-xl bg-gray-100"
              placeholder="Enter Bank's Branch Name"
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
            value={data.note ? data.note : ""}
            placeholder=""
          />
        </div>

        <hr />

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            onClick={handleSubmit}
          >
            {params.id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
