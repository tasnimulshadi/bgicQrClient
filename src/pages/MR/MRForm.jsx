// src/pages/MRForm.jsx
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
  issuingOffice: [{ id: "DZO", value: "Dhaka Zonal Office" }],
  classOfInsurance: [
    { id: "MC", value: "Marine Cargo" },
    { id: "MISC/OMP", value: "Miscellaneous" },
  ],
  coIns: [{ id: "1", value: "Co-Ins" }],
  typeOfTRV: [
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
  mop: [
    { id: 1, value: "Cash" },
    { id: 2, value: "Cheque" },
    { id: 3, value: "D.D" },
    { id: 4, value: "T.T" },
    { id: 5, value: "Pay Order" },
    { id: 6, value: "Credit Advice" },
    { id: 7, value: "Bank Guarantee" },
  ],
  vatPercentage: 30, // Renamed for clarity
};

export default function MRForm() {
  const params = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [data, setData] = useState({
    typeOfTRV: "",
    planCode: "",
    ompNumber: "",
    policyNumber: "",
    issueDate: moment().format("YYYY-MM-DD"), // Use moment directly for default
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
    vat: 0, // Initialize vat as 0
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

  // Effect to set document title and fetch data for edit mode
  useEffect(() => {
    document.title = `BGIC - MR ${params.id ? "Update" : "Create"}`;

    const fetchDataById = async () => {
      try {
        setLoading(true); // Set loading true
        const res = await axios.get(`${config.apiUrl}/omp/${params.id}`);

        // Ensure all date fields are correctly formatted to YYYY-MM-DD for input type="date"
        const transformedData = {
          ...res.data,
          issueDate: moment(res.data.issueDate).format("YYYY-MM-DD"),
          travelDateFrom: moment(res.data.travelDateFrom).format("YYYY-MM-DD"),
          travelDateTo: res.data.travelDateTo
            ? moment(res.data.travelDateTo).format("YYYY-MM-DD")
            : "",
          dob: res.data.dob ? moment(res.data.dob).format("YYYY-MM-DD") : "",
          mrDate: res.data.mrDate
            ? moment(res.data.mrDate).format("YYYY-MM-DD")
            : "",
          chequeDate: res.data.chequeDate
            ? moment(res.data.chequeDate).format("YYYY-MM-DD")
            : "",
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
    document.getElementById("issuingOffice").focus();
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
      case "typeOfTRV": {
        const foundType = dropdownData.typeOfTRV.find(
          (item) => item.value === value
        );
        if (foundType) {
          newData = {
            ...newData,
            typeOfTRV: value,
            planCode: foundType.id,
            limitOfCover: foundType.limit, // Update limit of cover
          };
        }
        break;
      }
      case "ompNumber": {
        // Ensure ompNumber is a number and within range

        const numOmp = parseInt(value, 10);
        if (!isNaN(numOmp) && numOmp >= 1 && numOmp <= 9999) {
          const strOmp = String(numOmp);
          newData.ompNumber = strOmp;
        } else if (value === "") {
          // Allow clearing the field
          newData.ompNumber = "";
        } else {
          return; // Prevent setting invalid number
        }
        break;
      }
      case "firstName":
      case "lastName":
      case "bank":
      case "bankBranch":
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
      case "premium": {
        // Ensure premium is a number
        const numPremium = parseFloat(value);
        if (!isNaN(numPremium)) {
          newData.premium = numPremium;
          newData.vat = (numPremium * dropdownData.vatPercentage) / 100;
        } else if (value === "") {
          // Allow clearing the field
          newData.premium = "";
          newData.vat = 0;
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

  // Effect to calculate policyNumber
  useEffect(() => {
    if (data.ompNumber && data.issueDate) {
      const formattedIssueDate = moment(data.issueDate).format("/MM/YYYY");
      setData((prev) => ({
        ...prev,
        policyNumber: `BGIC/DZO/MISC/OMP-${prev.ompNumber}${formattedIssueDate}`,
      }));
    } else {
      setData((prev) => ({ ...prev, policyNumber: "" }));
    }
  }, [data.ompNumber, data.issueDate]);

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
      !data.typeOfTRV ||
      !data.ompNumber ||
      !data.issueDate ||
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
      !data.mrNo ||
      !data.mrDate ||
      !data.mop ||
      !data.chequeNo ||
      !data.chequeDate ||
      !data.bank ||
      !data.bankBranch
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
            <p className="font-bold">MR Updated.</p>
            <p>{trimmedData.policyNumber}</p>
          </div>
        );
        navigate(`/mr/${trimmedData.id}`, { replace: true });
      } else {
        // Create
        await axios.post(`${config.apiUrl}/omp`, trimmedData, {
          // Use trimmedData for post
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(
          <div>
            <p className="font-bold">MR Created.</p>
            <p>{trimmedData.policyNumber}</p>
          </div>
        );
        navigate("/mr", { replace: true });
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
        {params.id ? "Update MR" : "Create New MR"}
      </h1>
      <form
        className=" grid grid-cols-1 gap-6 w-full  bg-white p-8 rounded-lg shadow-2xl" // Max width and shadow for better presentation
        onSubmit={handleSubmit}
      >
        {/* Issuing */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Issuing Office = Dropdown */}
          <div className="sm:col-span-1">
            <label
              htmlFor="issuingOffice"
              className="block mb-1 font-medium text-gray-700"
            >
              Issuing Office
            </label>
            <select
              name="issuingOffice"
              value={data.issuingOffice ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              id="issuingOffice"
              tabIndex={1}
              onKeyDown={(e) => handleKeyDown(e, "classOfInsurance")}
            >
              <option value="" disabled>
                Select Office
              </option>
              {dropdownData.issuingOffice.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          {/* Class of Insurance = Dropdown */}
          <div className="sm:col-span-1">
            <label
              htmlFor="classOfInsurance"
              className="block mb-1 font-medium text-gray-700"
            >
              Class of Insurance
            </label>
            <select
              name="classOfInsurance"
              value={data.classOfInsurance ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              id="classOfInsurance"
              tabIndex={1}
              onKeyDown={(e) => handleKeyDown(e, "mrId")}
            >
              <option value="" disabled>
                Select Class
              </option>
              {dropdownData.classOfInsurance.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Issued Against */}
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Issued Against (Read-only) */}
          <div className="sm:col-span-3">
            <label
              htmlFor="mrNo"
              className="block mb-1 font-medium text-gray-700"
            >
              Issued Against: Policy No
            </label>
            <input
              type="text"
              name="mrNo"
              value={data.mrNo ?? ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              readOnly
              disabled
              placeholder="Auto-generated Policy No"
              id="mrNo" // Added ID for consistency
            />
          </div>

          {/* Policy Id. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mrId"
              className="block mb-1 font-medium text-gray-700"
            >
              Policy ID
            </label>
            <input
              type="number"
              name="mrId"
              onChange={handleChange}
              value={data.mrId ?? ""}
              min={1}
              max={9999}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Policy ID"
              tabIndex={2}
              onWheel={(e) => e.target.blur()} // Prevents number input from changing on scroll
              id="mrId"
              onKeyDown={(e) => handleKeyDown(e, "mrDate")}
            />
          </div>

          {/* Policy Date > Issued Against */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mrDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Policy Date
            </label>
            <input
              type="date"
              name="mrDate"
              value={data.mrDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={3}
              min="2000-01-01"
              title="Date format: MM/DD/YYYY. Example: 12/31/2022"
              id="mrDate"
              onKeyDown={(e) => handleKeyDown(e, "Adfghjsdfghjkdsfgfdhdfg")}
            />
          </div>

          {/* Co-Ins = Dropdown */}
          <div className="sm:col-span-1">
            <label
              htmlFor="classOfInsurance"
              className="block mb-1 font-medium text-gray-700"
            >
              Co-Ins
            </label>
            <select
              name="classOfInsurance"
              value={data.classOfInsurance ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              id="classOfInsurance"
              tabIndex={1}
              onKeyDown={(e) => handleKeyDown(e, "mrId")}
            >
              <option value="">No</option>
              {dropdownData.coIns.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* MR No. Section */}
        <div className="grid sm:grid-cols-4 gap-4">
          {/* MR Id. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mrId"
              className="block mb-1 font-medium text-gray-700"
            >
              MR ID
            </label>
            <input
              type="number"
              name="mrId"
              onChange={handleChange}
              value={data.mrId ?? ""}
              min={1}
              max={9999}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter MR ID"
              tabIndex={2}
              onWheel={(e) => e.target.blur()} // Prevents number input from changing on scroll
              id="mrId"
              onKeyDown={(e) => handleKeyDown(e, "mrDate")}
            />
          </div>

          {/* MR Date */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mrDate"
              className="block mb-1 font-medium text-gray-700"
            >
              MR Date
            </label>
            <input
              type="date"
              name="mrDate"
              value={data.mrDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={3}
              min="2000-01-01"
              title="Date format: MM/DD/YYYY. Example: 12/31/2022"
              id="mrDate"
              onKeyDown={(e) => handleKeyDown(e, "Adfghjsdfghjkdsfgfdhdfg")}
            />
          </div>

          {/* MR No (Read-only) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="mrNo"
              className="block mb-1 font-medium text-gray-700"
            >
              MR No
            </label>
            <input
              type="text"
              name="mrNo"
              value={data.mrNo ?? ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              readOnly
              disabled
              placeholder="Auto-generated MR No"
              id="mrNo" // Added ID for consistency
            />
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Received From*/}
        <div>
          <label
            htmlFor="destination"
            className="block mb-1 font-medium text-gray-700"
          >
            Received From
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={data.destination ?? ""}
            onChange={handleChange}
            name="destination"
            placeholder="Received with thanks from"
            title="Received with thanks from"
            tabIndex={12}
            id="destination"
            onKeyDown={(e) => handleKeyDown(e, "travelDays")}
          />
        </div>

        <hr className="border-gray-300" />

        {/* Premium & MOP */}
        <div className="grid sm:grid-cols-4 gap-4 items-end">
          {/* Limit Of Cover */}
          {/* <div className="sm:col-span-2">
            <label
              htmlFor="limitOfCover"
              className="block mb-1 font-medium text-gray-700"
            >
              Limit Of Cover
            </label>
            <input
              type="number"
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
          </div> */}

          {/* Currency */}
          {/* <div className="sm:col-span-2">
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
          </div> */}

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
              onKeyDown={(e) => handleKeyDown(e, "stamp")}
            />
          </div>

          {/* Stamp */}
          <div className="sm:col-span-1">
            <label
              htmlFor="stamp"
              className="block mb-1 font-medium text-gray-700"
            >
              Stamp
            </label>
            <input
              type="number"
              name="stamp"
              required
              min={1}
              inputMode="numeric"
              value={data.stamp ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Stamp Amount"
              title="Enter Stamp Amount"
              tabIndex={17}
              onWheel={(e) => e.target.blur()}
              id="stamp"
              onKeyDown={(e) => handleKeyDown(e, "coinsnet")}
            />
          </div>

          {/* CoIns(Net) */}
          <div className="sm:col-span-1">
            <label
              htmlFor="coinsnet"
              className="block mb-1 font-medium text-gray-700"
            >
              CoIns(Net)
            </label>
            <input
              type="number"
              name="coinsnet"
              required
              min={1}
              inputMode="numeric"
              value={data.coinsnet ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter CoIns(net) Amount"
              title="Enter CoIns(net) Amount"
              tabIndex={17}
              onWheel={(e) => e.target.blur()}
              id="coinsnet"
              onKeyDown={(e) => handleKeyDown(e, "mrNo")}
            />
          </div>

          {/* Vat (Read-only) */}
          <div className="sm:col-span-1">
            <label
              htmlFor="vat"
              className="block mb-1 font-medium text-gray-700"
            >
              Vat
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={Number(data.vat).toFixed(2)} // Format to 2 decimal places
              readOnly
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              id="vat" // Added ID for consistency
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
              value={(Number(data.premium) + Number(data.vat)).toFixed(2)} // Calculate and format
              readOnly
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              id="total" // Added ID for consistency
            />
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Bank Info */}
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          {/* MOP */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mop"
              className="block mb-1 font-medium text-gray-700"
            >
              MOP
            </label>
            <select
              name="mop"
              value={data.mop ?? ""}
              onChange={handleChange}
              title="Method Of Payment"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={20}
              id="mop"
              onKeyDown={(e) => handleKeyDown(e, "chequeNo")}
            >
              <option value="" disabled>
                Select MOP
              </option>
              {dropdownData.mop.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          {/* Cheque No. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="chequeNo"
              className="block mb-1 font-medium text-gray-700"
            >
              Cheque No.
            </label>
            <input
              type="text"
              name="chequeNo"
              required={data.mop === "Cheque"} // Make required only if MOP is Cheque
              value={data.chequeNo ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Cheque No."
              tabIndex={21}
              id="chequeNo"
              onKeyDown={(e) => handleKeyDown(e, "chequeDate")}
            />
          </div>

          {/* Cheque Date */}
          <div className="sm:col-span-1">
            <label
              htmlFor="chequeDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Cheque Date
            </label>
            <input
              type="date"
              name="chequeDate"
              value={data.chequeDate}
              onChange={handleChange}
              required={data.mop === "Cheque"} // Make required only if MOP is Cheque
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              tabIndex={22}
              min="2000-01-01"
              title="Date format: MM/DD/YYYY. Example: 12/31/2022"
              id="chequeDate"
              onKeyDown={(e) => handleKeyDown(e, "bank")}
            />
          </div>

          {/* Bank */}
          <div className="sm:col-span-1">
            <label
              htmlFor="bank"
              className="block mb-1 font-medium text-gray-700"
            >
              Bank
            </label>
            <input
              type="text"
              name="bank"
              required={data.mop === "Cheque"} // Make required only if MOP is Cheque
              value={data.bank ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Bank Name"
              tabIndex={23}
              id="bank"
              onKeyDown={(e) => handleKeyDown(e, "bankBranch")}
            />
          </div>

          {/* Branch */}
          <div className="sm:col-span-1">
            <label
              htmlFor="bankBranch"
              className="block mb-1 font-medium text-gray-700"
            >
              Branch
            </label>
            <input
              type="text"
              name="bankBranch"
              required={data.mop === "Cheque"} // Make required only if MOP is Cheque
              value={data.bankBranch ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Bank's Branch Name"
              tabIndex={24}
              id="bankBranch"
              onKeyDown={(e) => handleKeyDown(e, "note")}
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label
            htmlFor="note"
            className="block mb-1 font-medium text-gray-700"
          >
            Note
          </label>
          <input
            type="text"
            name="note"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={data.note ?? ""}
            placeholder="Any additional notes..."
            tabIndex={25}
            id="note"
            onKeyDown={(e) => handleKeyDown(e, "submitButton")}
          />
        </div>

        <hr className="border-gray-300" />

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
            {loading ? "Processing..." : params.id ? "Update MR" : "Create MR"}
          </button>
        </div>
      </form>
    </div>
  );
}
