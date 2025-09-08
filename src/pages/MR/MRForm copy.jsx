// src/pages/MRForm.jsx
import axios from "axios";
import { useEffect, useState } from "react"; // Removed useRef as it's no longer needed
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import config from "../../utility/config";
import { toast } from "react-toastify";
import SearchModal from "./SearchModal";

// Dropdown data and VAT percentage are constant, so define them outside the component
// to prevent re-creation on every render.
const dropdownData = {
  mrOffice: [{ id: "DZO", value: "Dhaka Zonal Office" }],
  mrClass: [
    { id: "MC", value: "Marine Cargo" },
    { id: "MISC/OMP", value: "Miscellaneous" },
  ],
  coins: [
    { id: 0, value: "N/A" },
    { id: 1, value: "Co-Ins" },
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
  vatPercentage: 30,
};

export default function MRForm() {
  const params = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    mrOffice: "",
    mrOfficeCode: "",
    mrClass: "",
    mrClassCode: "",
    mrNumber: "",
    mrDate: "",
    mrNo: "",
    receivedFrom: "",
    mop: "",
    chequeNo: "",
    chequeDate: "",
    bank: "",
    bankbranch: "",

    policyOffice: "",
    policyOfficeCode: "",
    policyClass: "",
    policyClassCode: "",
    policyNumber: "",
    policyDate: "",
    coins: "",
    policyNo: "",

    premium: "",
    stamp: "",
    coinsnet: "",
    vat: "",
    total: "",

    note: "",
  });

  // console.log(data);

  // Effect to set document title and fetch data for edit mode
  useEffect(() => {
    document.title = `BGIC - MR ${params.id ? "Update" : "Create"}`;

    const fetchDataById = async () => {
      try {
        setLoading(true); // Set loading true
        const res = await axios.get(`${config.apiUrl}/mr/${params.id}`);

        // Ensure all date fields are correctly formatted to YYYY-MM-DD for input type="date"
        const transformedData = {
          ...res.data,
          mrDate: moment(res.data.mrDate).format("YYYY-MM-DD"),
          chequeDate: moment(res.data.chequeDate).format("YYYY-MM-DD"),
          policyDate: moment(res.data.policyDate).format("YYYY-MM-DD"),
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
    document.getElementById("mrOffice").focus();
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
      case "mrOffice": {
        const foundOffice = dropdownData.mrOffice.find(
          (item) => item.value === value
        );
        if (foundOffice) {
          newData = {
            ...newData,
            mrOffice: value,
            mrOfficeCode: foundOffice.id,
            policyOffice: value,
            policyOfficeCode: foundOffice.id,
          };
        }
        break;
      }
      case "mrClass": {
        const foundClass = dropdownData.mrClass.find(
          (item) => item.value === value
        );
        if (foundClass) {
          newData = {
            ...newData,
            mrClass: value,
            mrClassCode: foundClass.id,
            policyClass: value,
            policyClassCode: foundClass.id,
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
      case "mrNumber": {
        // Ensure mrNumber is a number and within range

        const numOmp = parseInt(value, 10);
        if (!isNaN(numOmp) && numOmp >= 1 && numOmp <= 9999) {
          const strOmp = String(numOmp);
          newData.mrNumber = strOmp;
        } else if (value === "") {
          // Allow clearing the field
          newData.mrNumber = "";
        } else {
          return; // Prevent setting invalid number
        }
        break;
      }
      case "bank":
      case "bankbranch":
        // Allow letters, spaces, dot, comma for specific text fields
        if (!/^[A-Za-z\s.,]*$/.test(value)) {
          return; // Do not update state if invalid characters
        }
        break;
      case "premium":
      case "vat":
      case "stamp":
      case "coinsnet": {
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
    }

    setData(newData);
  };

  // Effect to calculate policyNo
  useEffect(() => {
    if (
      data.policyNumber &&
      data.policyDate &&
      data.policyOfficeCode &&
      data.policyClassCode &&
      data.coins
    ) {
      const formattedPolicyDate = moment(data.policyDate).format("/MM/YYYY");
      const coInsAvailable = data.coins === "Co-Ins" ? `-(${data.coins})` : "";
      setData((prev) => ({
        ...prev,
        policyNo: `BGIC/${prev.policyOfficeCode}/${prev.policyClassCode}-${prev.policyNumber}${formattedPolicyDate}${coInsAvailable}`,
      }));
    } else {
      setData((prev) => ({ ...prev, policyNo: "" }));
    }

    if (data.policyClassCode !== "MC") {
      setData((prev) => ({ ...prev, stamp: 0 }));
    }
    if (data.policyClassCode !== "MISC/OMP") {
      setData((prev) => ({ ...prev, vat: 0 }));
    }
    if (data.coins !== "Co-Ins") {
      setData((prev) => ({ ...prev, coinsnet: 0 }));
    }
  }, [
    data.policyNumber,
    data.policyDate,
    data.policyOfficeCode,
    data.policyClassCode,
    data.coins,
  ]);

  // Effect to calculate mrNo
  useEffect(() => {
    if (data.mrNumber && data.mrDate && data.mrOfficeCode) {
      setData((prev) => ({
        ...prev,
        mrNo: `${prev.mrOfficeCode}-${moment(prev.mrDate).year()}-${
          prev.mrNumber
        }`,
      }));
    } else {
      setData((prev) => ({ ...prev, mrNo: "" }));
    }
  }, [data.mrNumber, data.mrDate, data.mrOfficeCode]);

  // Effect to calculate premium
  useEffect(() => {
    const premium = Number(data.premium) || 0;
    const vat = Number(data.vat) || 0;
    const stamp = Number(data.stamp) || 0;
    const coinsnet = Number(data.coinsnet) || 0;

    setData((prev) => ({
      ...prev,
      total: premium + vat + stamp + coinsnet,
    }));
  }, [data.premium, data.vat, data.stamp, data.coinsnet]);

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

  // Search Policy
  const handleSelectedItem = (item) => {
    // console.log("Selected:", item);

    setData((prev) => ({
      ...prev,
      mrOffice: item.policyOffice,
      mrOfficeCode: item.policyOfficeCode,
      policyOffice: item.policyOffice,
      policyOfficeCode: item.policyOfficeCode,
      mrClass: item.policyClass,
      mrClassCode: item.policyClassCode,
      policyClass: item.policyClass,
      policyClassCode: item.policyClassCode,
      policyNumber: item.policyNumber,
      policyDate: moment(item.policyDate).format("YYYY-MM-DD"),
      policyNo: item.policyNo,
      premium: item.premium,
      vat: item.vat,
      total: item.total,
      coins: "N/A",
    }));
  };

  // SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading true on submit

    // Client-side validation before API call

    if (
      !data.mrNumber ||
      !data.mrDate ||
      !data.mrNo ||
      !data.mrOffice ||
      !data.mrOfficeCode ||
      !data.mrClass ||
      !data.mrClassCode ||
      !data.receivedFrom ||
      !data.policyOffice ||
      !data.policyOfficeCode ||
      !data.policyClass ||
      !data.policyClassCode ||
      !data.policyNumber ||
      !data.policyDate ||
      !data.coins ||
      !data.policyNo ||
      !data.premium ||
      !data.mop
    ) {
      setError("Please fill in all required fields.");
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
          `${config.apiUrl}/mr/${trimmedData.id}`,
          trimmedData,
          {
            // Use trimmedData for patch
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        toast.success(
          <div>
            <p className="font-bold">MR Updated.</p>
            <p>{trimmedData.mrNo}</p>
          </div>
        );
        navigate(`/mr/${trimmedData.id}`, { replace: true });
      } else {
        // Create
        await axios.post(`${config.apiUrl}/mr`, trimmedData, {
          // Use trimmedData for post
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(
          <div>
            <p className="font-bold">MR Created.</p>
            <p>{trimmedData.mrNo}</p>
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
        {params.id ? (
          ""
        ) : (
          <SearchModal onSelect={handleSelectedItem} token={token} />
        )}
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
              htmlFor="mrOffice"
              className="block mb-1 font-medium text-gray-700"
            >
              Issuing Office
            </label>
            <select
              name="mrOffice"
              value={data.mrOffice ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              id="mrOffice"
              tabIndex={1}
              onKeyDown={(e) => handleKeyDown(e, "mrClass")}
            >
              <option value="" disabled>
                Select Office
              </option>
              {dropdownData.mrOffice.map((item) => (
                <option key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>

          {/* Class of Insurance = Dropdown */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mrClass"
              className="block mb-1 font-medium text-gray-700"
            >
              Class of Insurance
              <button
                type="button"
                onClick={() => navigate("/cob")}
                className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Add
              </button>
            </label>
            <select
              name="mrClass"
              value={data.mrClass ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              id="mrClass"
              tabIndex={1}
              onKeyDown={(e) => handleKeyDown(e, "policyNumber")}
            >
              <option value="" disabled>
                Select Class
              </option>
              {dropdownData.mrClass.map((item) => (
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
          {/* POlicy No. > Issued Against (Read-only) */}
          <div className="sm:col-span-3">
            <label
              htmlFor="policyNo"
              className="block mb-1 font-medium text-gray-700"
            >
              Issued Against: Policy No
            </label>
            <input
              type="text"
              name="policyNo"
              value={data.policyNo ?? ""}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
              readOnly
              disabled
              placeholder="Auto-generated Policy No"
              id="policyNo" // Added ID for consistency
            />
          </div>

          {/* Policy Number > Issued Against */}
          <div className="sm:col-span-1">
            <label
              htmlFor="policyNumber"
              className="block mb-1 font-medium text-gray-700"
            >
              Policy Number
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
              placeholder="Enter Policy ID"
              tabIndex={2}
              onWheel={(e) => e.target.blur()} // Prevents number input from changing on scroll
              id="policyNumber"
              onKeyDown={(e) => handleKeyDown(e, "policyDate")}
            />
          </div>

          {/* Policy Date > Issued Against */}
          <div className="sm:col-span-1">
            <label
              htmlFor="policyDate"
              className="block mb-1 font-medium text-gray-700"
            >
              Policy Date
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
              onKeyDown={(e) => handleKeyDown(e, "coins")}
            />
          </div>

          {/* Co-Ins > Issued Against > Dropdown */}
          <div className="sm:col-span-1">
            <label
              htmlFor="coins"
              className="block mb-1 font-medium text-gray-700"
            >
              Co-Ins
            </label>
            <select
              name="coins"
              value={data.coins ?? ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              id="coins"
              tabIndex={1}
              onKeyDown={(e) => handleKeyDown(e, "mrNumber")}
            >
              <option value="" disabled>
                Select Co Ins
              </option>
              {dropdownData.coins.map((item) => (
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
          {/* MR Number. */}
          <div className="sm:col-span-1">
            <label
              htmlFor="mrNumber"
              className="block mb-1 font-medium text-gray-700"
            >
              MR Number
            </label>
            <input
              type="number"
              name="mrNumber"
              onChange={handleChange}
              value={data.mrNumber ?? ""}
              min={1}
              max={9999}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter MR ID"
              tabIndex={2}
              onWheel={(e) => e.target.blur()} // Prevents number input from changing on scroll
              id="mrNumber"
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
              onKeyDown={(e) => handleKeyDown(e, "receivedFrom")}
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
            htmlFor="receivedFrom"
            className="block mb-1 font-medium text-gray-700"
          >
            Received From
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            value={data.receivedFrom ?? ""}
            onChange={handleChange}
            name="receivedFrom"
            placeholder="Received with thanks from"
            title="Received with thanks from"
            tabIndex={12}
            id="receivedFrom"
            onKeyDown={(e) => handleKeyDown(e, "premium")}
          />
        </div>

        <hr className="border-gray-300" />

        {/* Premium*/}
        <div className="grid sm:grid-cols-3 gap-4 items-end">
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
              step="0.01"
              name="stamp"
              readOnly={data.mrClassCode !== "MC"}
              required
              min={1}
              inputMode="numeric"
              value={data.stamp ?? ""}
              onChange={handleChange}
              className={
                data.mrClassCode !== "MC"
                  ? "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              }
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
              step="0.01"
              name="coinsnet"
              readOnly={data.coins !== "Co-Ins"}
              required
              min={1}
              inputMode="numeric"
              value={data.coinsnet ?? ""}
              onChange={handleChange}
              className={
                data.coins !== "Co-Ins"
                  ? "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              }
              placeholder="Enter CoIns(net) Amount"
              title="Enter CoIns(net) Amount"
              tabIndex={17}
              onWheel={(e) => e.target.blur()}
              id="coinsnet"
              onKeyDown={(e) => handleKeyDown(e, "vat")}
            />
          </div>

          {/* Vat */}
          <div className="sm:col-span-1">
            <label
              htmlFor="vat"
              className="block mb-1 font-medium text-gray-700"
            >
              Vat
            </label>
            <input
              type="number"
              step="0.01"
              name="vat"
              readOnly={data.mrClassCode !== "MISC/OMP"}
              required
              min={1}
              inputMode="numeric"
              value={data.vat ?? ""}
              onChange={handleChange}
              className={
                data.mrClassCode !== "MISC/OMP"
                  ? "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              }
              placeholder="Enter Vat Amount"
              title="Enter Vat Amount"
              tabIndex={17}
              onWheel={(e) => e.target.blur()}
              id="vat"
              onKeyDown={(e) => handleKeyDown(e, "mop")}
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
              value={Number(data.total).toFixed(2)} // Calculate and format
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
              // required={data.mop === "Cheque"} // Make required only if MOP is Cheque
              required
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
              onKeyDown={(e) => handleKeyDown(e, "bankbranch")}
            />
          </div>

          {/* Branch */}
          <div className="sm:col-span-1">
            <label
              htmlFor="bankbranch"
              className="block mb-1 font-medium text-gray-700"
            >
              Branch
            </label>
            <input
              type="text"
              name="bankbranch"
              // required={data.mop === "Cheque"} // Make required only if MOP is Cheque
              value={data.bankbranch ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              placeholder="Enter Bank's Branch Name"
              tabIndex={24}
              id="bankbranch"
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
