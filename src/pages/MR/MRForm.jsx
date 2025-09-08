// src/pages/MR/MRForm.jsx
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import config from "../../utility/config";
import { toast } from "react-toastify";

export default function MRForm() {
  const params = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropDown, setDropDown] = useState({
    office: [],
    class: [],
    client: [],
    mop: [],
    bank: [],
    bankbranch: [],
  });
  const [data, setData] = useState({
    mrOfficeId: "",
    mrClassId: "",
    mrNumber: "",
    mrDate: moment(new Date()).format("YYYY-MM-DD"),
    mrNo: "",
    receivedFrom: "",
    mopId: "",
    chequeNo: "",
    chequeDate: moment(new Date()).format("YYYY-MM-DD"),
    bankId: "",
    bankbranchId: "",
    policyOfficeId: "",
    policyClassId: "",
    policyNumber: "",
    policyDate: moment(new Date()).format("YYYY-MM-DD"),
    policyNo: "",
    isCoins: 0,
    isStamp: 0,
    isVat: 0,
    premium: "",
    vat: 0,
    stamp: 0,
    coinsnet: 0,
    note: "",
    clientId: "",
  });
  // console.log(data);

  // Single useEffect for all data fetching and side effects
  useEffect(() => {
    document.title = `BGIC - MR ${params.id ? "Update" : "Create"}`;

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch dropdowns
        const dropDownRes = await axios.get(
          `${config.apiUrl}/mr/getAllDropDown`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDropDown(dropDownRes.data);

        // Fetch data for edit mode
        if (params.id) {
          const mrRes = await axios.get(`${config.apiUrl}/mr/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log(mrRes.data);
          setData((prev) => ({ ...prev, ...mrRes.data }));
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, token]);

  // Effect for Calculate Data
  useEffect(() => {
    setData((prev) => {
      const newData = { ...prev };

      // mrNo
      if (
        prev.mrNumber &&
        prev.mrDate &&
        prev.mrOfficeId &&
        dropDown?.office?.length > 0
      ) {
        const mrOfficeCode = dropDown.office.find(
          (o) => o.id == prev.mrOfficeId
        )?.officeCode;

        newData.mrNo = `${mrOfficeCode}-${moment(prev.mrDate).year()}-${
          prev.mrNumber
        }`;
      } else {
        newData.mrNo = "";
      }

      // policyNo
      if (
        prev.policyNumber &&
        prev.policyDate &&
        prev.mrOfficeId &&
        prev.mrClassId != null &&
        prev.isCoins != undefined &&
        dropDown?.office?.length > 0 &&
        dropDown?.class?.length > 0
      ) {
        const formattedPolicyDate = moment(prev.policyDate).format("/MM/YYYY");
        const coInsAvailable = prev.isCoins === 1 ? `-(Co-Ins)` : "";
        const policyOfficeCode = dropDown.office.find(
          (o) => o.id == prev.mrOfficeId
        )?.officeCode;
        const policyClassCode = dropDown.class.find(
          (c) => c.id == prev.mrClassId
        )?.classCode;

        newData.policyNo = `BGIC/${policyOfficeCode}/${policyClassCode}-${prev.policyNumber}${formattedPolicyDate}${coInsAvailable}`;
        newData.policyOfficeId = prev.mrOfficeId;
        newData.policyClassId = prev.mrClassId;
      } else {
        newData.policyNo = "";
      }

      // coinsnet
      if (prev.isCoins === 0) {
        newData.coinsnet = 0;
      }

      // stamp
      if (prev.isStamp === 0) {
        newData.stamp = 0;
      }

      // vat
      if (prev.isVat === 0) {
        newData.vat = 0;
      }

      return newData;
    });
  }, [
    dropDown.class,
    dropDown.office,
    data.mrNumber,
    data.mrDate,
    data.mrOfficeId,
    data.isCoins,
    data.mrClassId,
    data.policyDate,
    data.policyNumber,
    data.isStamp,
    data.isVat,
  ]);

  const totalAmount = useMemo(
    () =>
      Number(data?.premium) +
      Number(data?.coinsnet) +
      Number(data?.vat) +
      Number(data?.stamp),
    [data.premium, data.coinsnet, data.vat, data.stamp]
  );

  // Single useEffect to handle toasts for errors
  useEffect(() => {
    if (error) {
      toast.error(
        <div>
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      );
      setError("");
    }
  }, [error]);

  // handleChange function to manage all input changes
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setData({
      ...data,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // SUBMIT SUBMIT SUBMIT SUBMIT SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation before API call
    // ... (Your existing validation logic) ...
    if (
      !data.mrNumber ||
      !data.mrDate ||
      !data.mrNo ||
      !data.mrOfficeId ||
      !data.mrClassId ||
      !data.policyNumber ||
      !data.policyDate ||
      !data.policyNo ||
      !data.premium ||
      !data.mopId || // Corrected mop to mopId
      !data.chequeDate
    ) {
      setError("Please fill in all required* fields.");
      setLoading(false);
      return;
    }

    try {
      // trim string
      const payload = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );

      if (params.id) {
        await axios.put(`${config.apiUrl}/mr/${params.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(
          <div>
            <p className="font-bold">Money Receipt Updated.</p>
            <p>{payload.mrNo}</p>
          </div>
        );
        navigate(`/mr/${params.id}`, { replace: true });
      } else {
        await axios.post(`${config.apiUrl}/mr`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success(
          <div>
            <p className="font-bold">Money Receipt Created.</p>
            <p>{payload.mrNo}</p>
          </div>
        );
        navigate("/mr", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Added padding for better mobile view */}
      <h1 className="text-4xl font-bold mb-6 text-blue-950">
        {params.id ? "Update Money Receipt" : "Create Money Receipt"}
      </h1>
      <form
        className=" grid grid-cols-1 gap-6 w-full  bg-white p-8 rounded-lg shadow-2xl" // Max width and shadow for better presentation
        onSubmit={handleSubmit}
      >
        {/* MR and Policy Info */}
        <div className="grid sm:grid-cols-4 gap-4">
          {/* Issuing Office = Dropdown */}
          <InputFieldDropDown
            label={"Issuing Office"}
            name={"mrOfficeId"}
            colSpan={"sm:col-span-2"}
            dropDownData={dropDown?.office}
            dropDownOption={"officeName"}
            handleChange={handleChange}
            required={true}
            value={data.mrOfficeId}
          />

          {/* Class of Insurance = Dropdown */}
          <InputFieldDropDown
            label={"Class of Insurance"}
            name={"mrClassId"}
            colSpan={"sm:col-span-2"}
            dropDownData={dropDown?.class}
            dropDownOption={"className"}
            handleChange={handleChange}
            required={true}
            value={data.mrClassId}
          />

          {/* Policy Number > Issued Against */}
          <InputField
            label={"Policy Number"}
            name={"policyNumber"}
            type={"number"}
            required={true}
            handleChange={handleChange}
            value={data.policyNumber}
          />

          {/* Policy Date > Issued Against */}
          <InputFieldDate
            label={"Policy Date"}
            name={"policyDate"}
            required={true}
            handleChange={handleChange}
            value={data?.policyDate}
          />

          {/* POlicy No. > Issued Against (Read-only) */}
          <InputField
            label={"Policy No"}
            name={"policyNo"}
            colSpan={"sm:col-span-2"}
            placeholder="Auto-generated Policy No"
            required={true}
            disabled={true}
            value={data.policyNo}
          />

          {/* MR Number. */}
          <InputField
            label={"MR Number"}
            name={"mrNumber"}
            type={"number"}
            required={true}
            handleChange={handleChange}
            value={data.mrNumber}
          />

          {/* MR Date */}
          <InputFieldDate
            label={"MR Date"}
            name={"mrDate"}
            className={""}
            required={true}
            handleChange={handleChange}
            value={data?.mrDate}
          />

          {/* MR No (Read-only) */}
          <InputField
            label={"MR No"}
            name={"mrNo"}
            colSpan={"sm:col-span-2"}
            placeholder="Auto-generated MR No"
            disabled={true}
            required={true}
            value={data.mrNo}
          />

          {/*  Client -> Client Dropdown */}
          <InputFieldDropDown
            label={"Client Name"}
            name={"clientId"}
            colSpan={"sm:col-span-2"}
            dropDownData={dropDown?.client}
            dropDownOption={"name"}
            handleChange={handleChange}
            // required={true}
            value={data.clientId}
          />

          {/* Client -> Received From */}
          <InputField
            label={"Extra information of client"}
            name={"receivedFrom"}
            colSpan={"sm:col-span-2"}
            handleChange={handleChange}
            value={data.receivedFrom}
          />
        </div>

        <hr className="border-gray-300" />

        {/* Premium and Bank Info */}
        <div className="grid sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-full sm:col-start-2 flex justify-around mb-2">
            <InputFieldCheckbox
              label="Co Ins"
              name="isCoins"
              checked={data.isCoins === 1}
              handleChange={handleChange}
            />
            <InputFieldCheckbox
              label="Stamp"
              name="isStamp"
              checked={data.isStamp === 1}
              handleChange={handleChange}
            />
            <InputFieldCheckbox
              label="Vat"
              name="isVat"
              checked={data.isVat === 1}
              handleChange={handleChange}
            />
          </div>

          {/* Premium */}
          <InputField
            label={"Premium"}
            name={"premium"}
            required={true}
            type={"number"}
            colSpan={"sm:col-span-1 sm:col-start-1"}
            handleChange={handleChange}
            value={data.premium}
          />

          {/* CoIns(Net) */}
          <InputField
            label={"CoIns(Net)"}
            name={"coinsnet"}
            type={"number"}
            disabled={data.isCoins == 0}
            handleChange={handleChange}
            value={data.coinsnet}
          />

          {/* Stamp */}
          <InputField
            label={"Stamp"}
            name={"stamp"}
            type={"number"}
            disabled={data.isStamp == 0}
            handleChange={handleChange}
            value={data.stamp}
          />

          {/* Vat */}
          <InputField
            label={"Vat"}
            name={"vat"}
            disabled={data.isVat == 0}
            type={"number"}
            handleChange={handleChange}
            value={data.vat}
          />

          {/* Total (Read-only) */}
          <InputField
            label={"Total"}
            type={"number"}
            disabled={true}
            value={totalAmount}
          />

          {/* MOP */}
          <InputFieldDropDown
            label={"MOP"}
            name={"mopId"}
            colSpan={"sm:col-span-1 sm:col-start-1"}
            dropDownData={dropDown?.mop}
            dropDownOption={"name"}
            handleChange={handleChange}
            required={true}
            value={data.mopId}
          />

          {/* Cheque Date */}
          <InputFieldDate
            label={"Payment / Cheque Date"}
            name={"chequeDate"}
            required={true}
            handleChange={handleChange}
            value={data?.chequeDate}
          />

          {/* Cheque No */}
          <InputField
            label={"Cheque No / Reference"}
            name={"chequeNo"}
            handleChange={handleChange}
            value={data.chequeNo}
          />

          {/* Bank */}
          <InputFieldDropDown
            label={"Bank"}
            name={"bankId"}
            dropDownData={dropDown?.bank}
            dropDownOption={"name"}
            handleChange={handleChange}
            value={data.bankId}
          />

          {/* Branch */}
          {data.bankId && (
            <InputFieldDropDown
              label={"Bank Branch"}
              name={"bankbranchId"}
              dropDownData={dropDown?.bankbranch}
              dropDownOption={"name"}
              handleChange={handleChange}
              value={data.bankbranchId}
            />
          )}

          {/* Note */}
          <InputField
            label={"Note"}
            name={"note"}
            colSpan={"sm:col-span-4"}
            handleChange={handleChange}
            value={data.note}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            tabIndex={26}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Processing..." : params.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Components
function InputFieldDate({
  handleChange,
  value,
  required = false,
  className,
  colSpan = "sm:col-span-1",
  name,
  label,
}) {
  return (
    <div className={`${colSpan} ${className}`}>
      <label className="block mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="date"
        name={name}
        value={moment(value || new Date()).format("YYYY-MM-DD")}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
        min="2000-01-01"
      />
    </div>
  );
}

function InputFieldDropDown({
  handleChange,
  value,
  required = false,
  className = "",
  colSpan = "sm:col-span-1",
  name,
  label,
  dropDownData,
  dropDownOption,
}) {
  return (
    <div className={`${colSpan} ${className}`}>
      <label className="block mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <select
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
      >
        <option value="" className="text-gray-400" disabled>
          Select {label}
        </option>
        {dropDownData &&
          dropDownData.map((item) => (
            <option key={item.id} value={item.id}>
              {item[dropDownOption]}
            </option>
          ))}
        <option value="" className="text-gray-400">
          Null
        </option>
      </select>
    </div>
  );
}

function InputField({
  handleChange = () => {},
  value,
  required = false,
  className = "",
  colSpan = "sm:col-span-1",
  name,
  label,
  type = "text",
  disabled = false,
  placeholder,
}) {
  return (
    <div className={`${colSpan} ${className}`}>
      <label className="block mb-1 font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        onChange={handleChange}
        value={value ?? ""}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-black"
        placeholder={placeholder ?? `Enter ${label}`}
        disabled={disabled}
        onWheel={(e) => e.target.blur()}
      />
    </div>
  );
}

function InputFieldCheckbox({ label, name, checked, handleChange = () => {} }) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition duration-150 ease-in-out"
      />
      <span>{label}</span>
    </label>
  );
}
