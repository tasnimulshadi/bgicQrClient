import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFound from "../NotFound";
import moment from "moment";
import { FaEdit, FaDownload } from "react-icons/fa";
import config from "../../utility/config";
import {
  getFileIcon,
  getFileNameFromFullPath,
  groupFilesByCategory,
} from "../../utility/utilityFunctions";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const allowedRoles = {
  view: config.roles.level_4,
  edit: config.roles.level_3,
  delete: config.roles.level_2,
};

export default function Claim() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [claimData, setClaimData] = useState(null);
  const [fileData, setFileData] = useState(null);
  // console.log({ claimData, fileData });

  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // FETCH
  useEffect(() => {
    const fetchDataById = async () => {
      setLoading(true);
      setError("");
      setNotFound(false);

      try {
        // Fetch Claim
        const claimRes = await axios.get(`${config.apiUrl}/claim/${id}/plus`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Save Claims
        setClaimData(claimRes.data);

        // Fetch Files
        const filesRes = await axios.get(`${config.apiUrl}/file/claim/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Save grouped & sorted files
        // setFileData(groupFilesByCategory(filesRes.data));
        setFileData(filesRes.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.error || "Failed to load data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDataById();
  }, [id, token]);

  // Handle Buttons
  const handleEdit = () => {
    navigate(`/claim/edit/${id}`);
  };

  const handleDownload = async () => {
    try {
      const modifiedClaimData = {
        id: claimData?.id,
        "Class Of Business": claimData?.class_name,
        "Claom No": claimData?.claim_no,
        "Policy No": claimData?.policy_no,
        "Insured Name": claimData?.insured_name,
        "Insured Address": claimData?.insured_address,
        "Insured Mobile": claimData?.insured_mobile,
        "Insured Email": claimData?.insured_email,
        "Date Of Loss": claimData?.loss_date,
        "Claim Amount": claimData?.amount,
        "All Paper Received Date": claimData?.present_status,
        "Final Survey Report":
          claimData?.survey_report == 0 ? "Not Received" : "Received",
        Summary: claimData?.summary,
        Remarks: claimData?.remarks,
      };

      // 1. Convert claim details to Excel
      const ws = XLSX.utils.json_to_sheet([modifiedClaimData]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "ClaimDetails");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      // 3. Create ZIP
      const zip = new JSZip();

      // Add Excel file
      zip.file("ClaimDetails.xlsx", excelBuffer);

      // Add uploaded files
      for (let file of fileData) {
        const fileUrl = `http://localhost:5000${file.path}`;
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        // Extract file name from path
        const fileName = file.path.split("/").pop();
        zip.file(fileName, blob);
      }

      // 4. Generate & download
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(
        content,
        `${claimData.claim_no ? claimData.claim_no : "Claim"}.zip`
      );
    } catch (error) {
      console.error("Download failed:", error);
      setError("Download failed. Please try again.");
    }
  };

  // Table Construction
  const tableRows = [
    { label: "Claim No", value: claimData?.claim_no },
    { label: "Policy No", value: claimData?.policy_no },
    { label: "Class Of Business", value: claimData?.class_name },
    {
      label: "Loss Date",
      value: moment(claimData?.loss_date).format("DD MMM YYYY"),
    },
    { label: "Insured Name", value: claimData?.insured_name },
    { label: "Insured Address", value: claimData?.insured_address },
    { label: "Insured Mobile", value: claimData?.insured_mobile },
    { label: "Insured Email", value: claimData?.insured_email },
    { label: "All Papers Received Date", value: claimData?.present_status },
    {
      label: "Final Survey Report",
      value: claimData?.survey_report == 0 ? "Not Received" : "Received",
    },
    { label: "Final Summary", value: claimData?.summary },
    { label: "Remarks", value: claimData?.remarks },
  ];

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

  if (notFound) return <NotFound />;
  if (loading || !claimData)
    return <Loading message="Loading Claim details..." />;

  // Main render
  return (
    <div className="">
      <div className="w-full bg-white p-8 rounded-lg shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="col-span-full lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b-2 text-gray-800 pb-2">
            <h2 className="text-2xl font-bold text-gray-800">Claim Details</h2>
          </div>

          <div className="w-full bg-white rounded-lg shadow-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {tableRows.map((row, index) => (
                  <tr
                    key={index}
                    className={`transition-colors duration-200 ease-in-out ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="p-2 whitespace-nowrap text-gray-800 font-bold capitalize">
                      {row.label}
                    </td>
                    <td className="p-2 whitespace-nowrap text-gray-900">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-span-full lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-4 border-b-2 text-gray-800 pb-2">
            <h2 className="text-2xl font-bold text-gray-800 mt-6 lg:mt-0">
              Claim Files
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* {fileData.map((group, idx) => ( */}
            {groupFilesByCategory(fileData).map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <h3 className="font-semibold text-gray-700">
                  {group.category}
                </h3>
                {group.files.map((file, index) => (
                  <FileRow key={index} file={file} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        {allowedRoles.edit?.includes(user?.role) && (
          <div className="col-span-full flex justify-center flex-wrap gap-6 ">
            {/* Edit */}
            <button
              type="button"
              className="w-full lg:w-1/4 bg-blue-600 text-white font-bold p-2 rounded-lg shadow-xl hover:bg-blue-700 transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1"
              onClick={handleEdit}
            >
              <FaEdit size={20} /> Edit
            </button>

            {/* Download */}
            {/* <button
              type="button"
              className="w-full lg:w-1/4 bg-amber-500 text-white font-bold p-2 rounded-lg shadow-xl hover:bg-amber-600 transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1"
              onClick={handleDownload}
            >
              <FaDownload size={20} /> Download
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
}

// Component
function FileRow({ file }) {
  return (
    <div
      className="flex gap-2 items-center shadow-md rounded-md p-2 hover:bg-gray-100 cursor-pointer"
      onClick={() => window.open(`http://localhost:5000${file.path}`, "_blank")}
    >
      <img
        src={getFileIcon(file.path)}
        alt="file-icon"
        className="h-12 w-12 object-cover"
      />
      <p className=" text-gray-800">{getFileNameFromFullPath(file.path)}</p>
    </div>
  );
}
