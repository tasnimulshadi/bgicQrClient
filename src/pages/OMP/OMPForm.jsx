// src/pages/OMP/OMPForm.jsx
import axios from "axios";
import { useEffect, useState } from "react"; // Removed useRef as it's no longer needed
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import config from "../../utility/config";
import { toast } from "react-toastify";

// Dropdown data and VAT percentage are constant, so define them outside the component
// to prevent re-creation on every render.
const dropdownData = {
  plan: [
    {
      id: "CZ1",
      value:
        "Plan A : Zone 1 Students & Accompanying Spouse (Worldwide Including USA, CANADA)",
      limit: 100000,
    },
    {
      id: "CZ2",
      value:
        "Plan A : Zone 2 Students & Accompanying Spouse (Worldwide Excluding USA, CANADA)",
      limit: 50000,
    },
    {
      id: "DZ1",
      value:
        "Plan B : Zone 1 Students & Accompanying Spouse (Worldwide Including USA, CANADA)",
      limit: 150000,
    },
    {
      id: "DZ2",
      value:
        "Plan B : Zone 2 Students & Accompanying Spouse (Worldwide Excluding USA, CANADA)",
      limit: 75000,
    },
    {
      id: "AZ1",
      value: "Plan A : Zone 1 Worldwide Including USA, CANADA",
      limit: 100000,
    },
    {
      id: "AZ2",
      value: "Plan A : Zone 2 Worldwide Excluding USA, CANADA",
      limit: 50000,
    },
    {
      id: "BZ1",
      value: "Plan B : Zone 1 Worldwide Including USA, CANADA",
      limit: 150000,
    },
    {
      id: "BZ2",
      value: "Plan B : Zone 2 Worldwide Excluding USA, CANADA",
      limit: 75000,
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
  vatPercentage: 30,
};

export default function OMPForm() {
  const params = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    plan: "",
    planCode: "",
    policyOffice: "Dhaka Zonal Office",
    policyOfficeCode: "DZO",
    policyClass: "Miscellaneous",
    policyClassCode: "MISC/OMP",
    policyNumber: "",
    policyDate: moment().format("YYYY-MM-DD"), // Use moment directly for default
    policyNo: "",

    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    address: "",
    mobile: "",
    email: "",
    passport: "",

    destination: "",
    travelDateFrom: moment().format("YYYY-MM-DD"),
    travelDays: "",
    travelDateTo: "",
    countryOfResidence: "Bangladesh",
    limitOfCover: "",
    currency: "",
    premium: "",
    vat: "",
    total: 0,
  });

  // Calculate age based on DOB
  const age = data.dob
    ? moment().diff(moment(data.dob, "YYYY-MM-DD"), "years")
    : null;

  // Effect to set document title and fetch data for edit mode
  useEffect(() => {
    document.title = `BGIC - OMP ${params.id ? "Update" : "Create"}`;

    const fetchDataById = async () => {
      try {
        setLoading(true); // Set loading true
        const res = await axios.get(`${config.apiUrl}/omp/${params.id}`);

        // Ensure all date fields are correctly formatted to YYYY-MM-DD for input type="date"
        const transformedData = {
          ...res.data,
          policyDate: moment(res.data.policyDate).format("YYYY-MM-DD"),
          travelDateFrom: moment(res.data.travelDateFrom).format("YYYY-MM-DD"),
          travelDateTo: res.data.travelDateTo
            ? moment(res.data.travelDateTo).format("YYYY-MM-DD")
            : "",
          dob: res.data.dob ? moment(res.data.dob).format("YYYY-MM-DD") : "",
        };

        setData((prev) => ({ ...prev, ...transformedData }));
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load data");
      } finally {
        setLoading(false); // Set loading false
      }
    };

    if (params.id) {
      fetchDataById();
    }

    // Focus on the first input field on component mount
    document.getElementById("plan").focus();
  }, [params.id]); // Added params.id to dependency array

  // Effect to handle error toasts
  useEffect(() => {
    if (error) {
      toast.error(
        <div>
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      );
      setError(""); // Clear error after showing toast
    }
  }, [error]);

  // Unified handleChange function to manage all input changes and derived calculations
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let newData = { ...data, [name]: updatedValue };

    // Specific logic for different fields
    switch (name) {
      case "plan": {
        const foundType = dropdownData.plan.find(
          (item) => item.value === value
        );
        if (foundType) {
          newData = {
            ...newData,
            plan: value,
            planCode: foundType.id,
            limitOfCover: foundType.limit, // Update limit of cover
          };
        }
        break;
      }
      case "policyNumber": {
        // Ensure policyNumber is a number and within range

        const numOmp = parseInt(value, 10);
        if (!isNaN(numOmp) && numOmp >= 1 && numOmp <= 9999) {
          const strOmp = String(numOmp);
          newData.policyNumber = strOmp;
        } else if (value === "") {
          // Allow clearing the field
          newData.policyNumber = "";
        } else {
          return; // Prevent setting invalid number
        }
        break;
      }
      case "firstName":
      case "lastName":
      case "bank":
      case "bankbranch":
        // Allow letters, spaces, dot, comma for specific text fields
        if (!/^[A-Za-z\s.,]*$/.test(value)) {
          return; // Do not update state if invalid characters
        }
        break;
      case "mobile":
        // Basic mobile number validation (length and starts with 01)
        if (!/^\d*$/.test(value) || value.length > 11) {
          return; // Prevent setting invalid characters or exceeding length
        }
        break;
      case "travelDays": {
        // Ensure travelDays is a number and within range
        const numDays = parseInt(value, 10);
        if (!isNaN(numDays) && numDays >= 1 && numDays <= 120) {
          newData.travelDays = numDays;
        } else if (value === "") {
          // Allow clearing the field
          newData.travelDays = "";
        } else {
          return; // Prevent setting invalid number
        }
        break;
      }
      case "premium":
      case "vat": {
        // Ensure number
        const num = parseFloat(value);
        if (!isNaN(num)) {
          newData[name] = num;
        } else if (value === "") {
          // Allow clearing the field
          newData[name] = "";
        } else {
          return; // Prevent setting invalid number
        }
        break;
      }
      case "limitOfCover": {
        // Ensure limitOfCover is a number
        const numLimit = parseInt(value, 10);
        if (!isNaN(numLimit) && numLimit >= 1) {
          newData.limitOfCover = numLimit;
        } else if (value === "") {
          // Allow clearing the field
          newData.limitOfCover = "";
        } else {
          return; // Prevent setting invalid number
        }
        break;
      }
    }

    setData(newData);
  };

  // Effect to calculate policyNo
  useEffect(() => {
    if (data.policyNumber && data.policyDate) {
      const formattedPolicyDate = moment(data.policyDate).format("/MM/YYYY");
      setData((prev) => ({
        ...prev,
        policyNo: `BGIC/${prev.policyOfficeCode}/${prev.policyClassCode}-${prev.policyNumber}${formattedPolicyDate}`,
      }));
    } else {
      setData((prev) => ({ ...prev, policyNo: "" }));
    }
  }, [data.policyNumber, data.policyDate]);

  // Effect to calculate travelDateTo based on travelDateFrom and travelDays
  useEffect(() => {
    const calculateTravelDateTo = (startDate, days) => {
      const travelDaysNum = parseInt(days, 10);
      if (!startDate || isNaN(travelDaysNum) || travelDaysNum <= 0) return "";

      // Inclusive: Add (days - 1)
      return moment(startDate)
        .add(travelDaysNum - 1, "days")
        .format("YYYY-MM-DD");
    };

    setData((prev) => ({
      ...prev,
      travelDateTo: calculateTravelDateTo(prev.travelDateFrom, prev.travelDays),
    }));
  }, [data.travelDateFrom, data.travelDays]);

  // Effect to calculate premium
  useEffect(() => {
    const premium = Number(data.premium) || 0;
    const vat = Number(data.vat) || 0;

    setData((prev) => ({
      ...prev,
      total: premium + vat,
    }));
  }, [data.premium, data.vat]);

  // handleKeyDown function for improved form navigation
  const handleKeyDown = (e, nextId) => {
    const el = e.target;
    const tag = el.tagName;
    const type = el.type;

    // 🚫 Disable ↑↓ arrow keys for <select>, <input type="number">, and <input type="date">
    if (
      tag === "SELECT" ||
      (tag === "INPUT" && (type === "number" || type === "date"))
    ) {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault(); // prevent value change or dropdown navigation
        return; // stop further handling
      }
    }

    // ⏎ Handle Enter key: move focus to the next field by ID
    if (e.key === "Enter") {
      if (tag === "SELECT" && el.value) {
        e.preventDefault(); // prevent form submission
        const next = document.getElementById(nextId);
        if (next) next.focus(); // move focus
      } else if (tag === "INPUT") {
        e.preventDefault(); // prevent form submission
        const next = document.getElementById(nextId);
        if (next) next.focus(); // move focus
      }
    }
  };

  // SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading true on submit

    // Client-side validation before API call
    if (
      !data.plan ||
      !data.policyNumber ||
      !data.policyDate ||
      !data.firstName ||
      !data.lastName ||
      !data.dob ||
      !data.gender ||
      !data.address ||
      !data.mobile ||
      !data.email ||
      !data.passport ||
      !data.destination ||
      !data.travelDays ||
      !data.travelDateFrom ||
      !data.limitOfCover ||
      !data.currency ||
      !data.premium ||
      !data.vat
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Validate mobile number format
    if (!/^01[0-9]{9}$/.test(data.mobile)) {
      setError("Mobile number must start with '01' and be 11 digits long.");
      setLoading(false);
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Trimming string values before sending
      const trimmedData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );

      // API Call
      if (params.id) {
        // Edit
        await axios.patch(
          `${config.apiUrl}/omp/${trimmedData.id}`,
          trimmedData,
          {
            // Use trimmedData for patch
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success(
          <div>
            <p className="font-bold">OMP Updated.</p>
            <p>{trimmedData.policyNo}</p>
          </div>
        );
        navigate(`/omp/${trimmedData.id}`, { replace: true });
      } else {
        // Create
        await axios.post(`${config.apiUrl}/omp`, trimmedData, {
          // Use trimmedData for post
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(
          <div>
            <p className="font-bold">OMP Created.</p>
            <p>{trimmedData.policyNo}</p>
          </div>
        );
        navigate("/omp", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    } finally {
      setLoading(false); // Always set loading false after API call
    }
  };

  return (
    <div className="flex flex-col items-center">
      {" "}
      {/* Added padding for better mobile view */}
      <h1 className="text-4xl font-bold mb-6 text-blue-950">
        {params.id ? "Update OMP" : "Create New OMP"}
      </h1>
      <form
        className=" grid grid-cols-1 gap-6 w-full  bg-white p-8 rounded-lg shadow-2xl" // Max width and shadow for better presentation
        onSubmit={handleSubmit}
      >
        {/* Type of TRV = Dropdown */}
        <div>
          <label
            htmlFor="plan"
            className="block mb-1 font-medium text-gray-700"
          >
            Type of TRV
          </label>
          <select
            name="plan"
            value={data.plan ?? ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            id="plan"
            tabIndex={1}
            onKeyDown={(e) => handleKeyDown(e, "policyNumber")}
          >
            <option value="" disabled>
              Select Plan
            </option>
            {dropdownData.plan.map((item) => (
              <option key={item.id} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>

        {/* Policy No. Section */}
        <div className="grid sm:grid-cols-4 gap-4">
          {/* OMP No. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="policyNumber"
              className="block mb-1 font-medium text-gray-700"
            >
              OMP No.
            </label>
            <input
              type="number"
              name="policyNumber"
              onChange={handleChange}
              value={data.policyNumber ?? ""}
              min={1}
              max={9999}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter OMP No."
              tabIndex={2}
              onWheel={(e) => e.target.blur()} // Prevents number input from changing on scroll
              id="policyNumber"
              onKeyDown={(e) => handleKeyDown(e, "policyDate")}
            />
          </div>

          {/* Issue Date */}
          <div className="sm:col-span-1">
            <label
              htmlFor="policyDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Issue Date
            </label>
            <input
              type="date"
              name="policyDate"
              value={data.policyDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={3}
              min="2000-01-01"
              title="Date format: MM/DD/YYYY. Example: 12/31/2022"
              id="policyDate"
              onKeyDown={(e) => handleKeyDown(e, "firstName")}
            />
          </div>

          {/* Policy No. (Read-only) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="policyNo"
              className="block mb-1 font-medium text-gray-700"
            >
              Policy No.
            </label>
            <input
              type="text"
              name="policyNo"
              value={data.policyNo ?? ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              readOnly
              disabled
              placeholder="Auto-generated Policy No."
              id="policyNo" // Added ID for consistency
            />
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Issued Person Info */}
        <div className="grid sm:grid-cols-4 gap-4">
          {/* First Name */}
          <div className="sm:col-span-1">
            <label
              htmlFor="firstName"
              className="block mb-1 font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              value={data.firstName ?? ""}
              onChange={handleChange}
              placeholder="Enter First Name"
              tabIndex={4}
              id="firstName"
              onKeyDown={(e) => handleKeyDown(e, "lastName")}
            />
          </div>

          {/* Last Name */}
          <div className="sm:col-span-1">
            <label
              htmlFor="lastName"
              className="block mb-1 font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              value={data.lastName ?? ""}
              onChange={handleChange}
              placeholder="Enter Last Name"
              tabIndex={5}
              id="lastName"
              onKeyDown={(e) => handleKeyDown(e, "dob")}
            />
          </div>

          {/* Date of Birth */}
          <div className="sm:col-span-1">
            <label
              htmlFor="dob"
              className="block mb-1 font-medium text-gray-700"
            >
              Date of Birth {age ? `(${age} Years)` : null}
            </label>
            <input
              type="date"
              name="dob"
              value={data.dob}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={6}
              min="1925-01-01"
              title="Date format: MM/DD/YYYY. Example: 12/31/2022"
              id="dob"
              onKeyDown={(e) => handleKeyDown(e, "gender")}
            />
          </div>

          {/* Gender */}
          <div className="sm:col-span-1">
            <label
              htmlFor="gender"
              className="block mb-1 font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              name="gender"
              value={data.gender ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={7}
              id="gender"
              onKeyDown={(e) => handleKeyDown(e, "address")}
            >
              <option value="" disabled>
                Select Gender
              </option>
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
          <label
            htmlFor="address"
            className="block mb-1 font-medium text-gray-700"
          >
            Address
          </label>
          <input // Changed to input as original was input
            name="address"
            value={data.address ?? ""}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md resize-y shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            placeholder="Enter Full Address Here."
            tabIndex={8}
            id="address"
            onKeyDown={(e) => handleKeyDown(e, "mobile")}
          />
        </div>

        {/* Issued Person Contact Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Mobile No. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mobile"
              className="block mb-1 font-medium text-gray-700"
            >
              Mobile No.
            </label>
            <input
              type="tel"
              name="mobile"
              required
              value={data.mobile ?? ""}
              onChange={handleChange}
              pattern="^01[0-9]{9}$"
              maxLength={11}
              title="Mobile number must start with '01' and be 11 digits long."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Mobile Number"
              tabIndex={9}
              id="mobile"
              onKeyDown={(e) => handleKeyDown(e, "email")}
            />
          </div>

          {/* E Mail */}
          <div className="sm:col-span-1">
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              E Mail
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              value={data.email ?? ""}
              onChange={handleChange}
              placeholder="Enter E-Mail"
              tabIndex={10}
              id="email"
              onKeyDown={(e) => handleKeyDown(e, "passport")}
            />
          </div>

          {/* Passport No. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="passport"
              className="block mb-1 font-medium text-gray-700"
            >
              Passport No.
            </label>
            <input
              type="text"
              name="passport"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              value={data.passport ?? ""}
              onChange={handleChange}
              placeholder="Enter Passport Number"
              tabIndex={11}
              id="passport"
              onKeyDown={(e) => handleKeyDown(e, "destination")}
            />
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Destination*/}
        <div>
          <label
            htmlFor="destination"
            className="block mb-1 font-medium text-gray-700"
          >
            Destination
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={data.destination ?? ""}
            onChange={handleChange}
            name="destination"
            placeholder="Enter Travel Destination. For Multiple Destinations Please Use Comma"
            title="For multiple destinations, separate with commas (,) and use 'and' before the last one. Example: France, UK and Germany"
            tabIndex={12}
            id="destination"
            onKeyDown={(e) => handleKeyDown(e, "travelDays")}
          />
        </div>

        {/* Travel Dates & Days */}
        <div className="grid sm:grid-cols-5 gap-4 items-end">
          {/* Travel Days */}
          <div className="sm:col-span-1">
            <label
              htmlFor="travelDays"
              className="block mb-1 font-medium text-gray-700"
            >
              Travel Days
            </label>
            <input
              type="number"
              name="travelDays"
              required
              min={1}
              max={120}
              value={data.travelDays ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Travel Days"
              tabIndex={13}
              onWheel={(e) => e.target.blur()}
              id="travelDays"
              onKeyDown={(e) => handleKeyDown(e, "travelDateFrom")}
            />
          </div>

          {/* Travel Date From */}
          <div className="sm:col-span-2">
            <label
              htmlFor="travelDateFrom"
              className="block mb-1 font-medium text-gray-700"
            >
              From
            </label>
            <input
              type="date"
              name="travelDateFrom"
              value={data.travelDateFrom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={14}
              min="2000-01-01"
              title="Date format: MM/DD/YYYY. Example: 12/31/2022"
              id="travelDateFrom"
              onKeyDown={(e) => handleKeyDown(e, "limitOfCover")}
            />
          </div>

          {/* Travel Date To (Read-only) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="travelDateTo"
              className="block mb-1 font-medium text-gray-700"
            >
              To
            </label>
            <input
              type="date"
              value={data.travelDateTo}
              readOnly
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              id="travelDateTo" // Added ID for consistency
            />
          </div>
        </div>

        {/* Premium & Cover */}
        <div className="grid sm:grid-cols-5 gap-4 items-end">
          {/* Limit Of Cover */}
          <div className="sm:col-span-1">
            <label
              htmlFor="limitOfCover"
              className="block mb-1 font-medium text-gray-700"
            >
              Limit Of Cover
            </label>
            <input
              type="number"
              step="0.01"
              name="limitOfCover"
              min={1}
              onChange={handleChange}
              required
              value={data.limitOfCover ?? ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Limit Of Cover"
              title="Enter Limit Of Cover Amount"
              tabIndex={15}
              onWheel={(e) => e.target.blur()}
              id="limitOfCover"
              onKeyDown={(e) => handleKeyDown(e, "currency")}
            />
          </div>

          {/* Limit Of Cover Currency */}
          <div className="sm:col-span-1">
            <label
              htmlFor="currency"
              className="block mb-1 font-medium text-gray-700"
            >
              Currency
            </label>
            <select
              name="currency"
              value={data.currency ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={16}
              id="currency"
              onKeyDown={(e) => handleKeyDown(e, "premium")}
            >
              <option value="" disabled>
                Select Currency
              </option>
              {dropdownData.currency.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          {/* Premium */}
          <div className="sm:col-span-1">
            <label
              htmlFor="premium"
              className="block mb-1 font-medium text-gray-700"
            >
              Premium
            </label>
            <input
              type="number"
              step="0.01"
              name="premium"
              required
              min={1}
              inputMode="numeric"
              value={data.premium ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Premium Amount"
              title="Enter Premium Amount"
              tabIndex={17}
              onWheel={(e) => e.target.blur()}
              id="premium"
              onKeyDown={(e) => handleKeyDown(e, "vat")}
            />
          </div>

          {/* Vat*/}
          <div className="sm:col-span-1">
            <label
              htmlFor="vat"
              className="block mb-1 font-medium text-gray-700"
            >
              vat
            </label>
            <input
              type="number"
              step="0.01"
              name="vat"
              required
              min={1}
              inputMode="numeric"
              value={data.vat ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Vat Amount"
              title="Enter Vat Amount"
              tabIndex={17}
              onWheel={(e) => e.target.blur()}
              id="vat"
              onKeyDown={(e) => handleKeyDown(e, "submitButton")}
            />
          </div>

          {/* Total (Read-only) */}
          <div className="sm:col-span-1">
            <label
              htmlFor="total"
              className="block mb-1 font-medium text-gray-700"
            >
              Total
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={Number(data.total).toFixed(2)} // Format to 2 decimal places
              readOnly
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              id="total" // Added ID for consistency
            />
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Submit */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            tabIndex={26}
            id="submitButton"
            disabled={loading} // Disable button when loading
          >
            {loading
              ? "Processing..."
              : params.id
              ? "Update OMP"
              : "Create OMP"}
          </button>
        </div>
      </form>
    </div>
  );
}
