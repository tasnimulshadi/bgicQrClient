import axios from "axios";
import { useEffect, useState, useCallback } from "react"; // Added useCallback for better performance
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotFound from "../NotFound";
import moment from "moment";
import {
  FaChevronDown,
  FaChevronUp,
  FaTrashAlt,
  FaEdit,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import MRPdf from "./MRPdf"; // Assuming MRPdf component is defined elsewhere for PDF generation
import headerImage from "../../assets/pdfheaderimg2.jpg"; // Path to header image for PDF/display
import {
  convertAmountToWords,
  formatNumberToComma,
} from "../../utility/utilityFunctions"; // Utility for number formatting
import config from "../../utility/config"; // Configuration for API endpoints
import { toast } from "react-toastify"; // For displaying notifications
import Loading from "../../components/Loading"; // Loading spinner component

/**
 * Main MR component to display details of a single MR,
 * and provide options to edit, delete, download PDF, and print.
 */
export default function MR() {
  const { id } = useParams(); // Get MR ID from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const { isAuthenticated, token } = useAuth(); // Authentication context
  const [data, setData] = useState(null); // State to store MR data
  // console.log(data);

  const [error, setError] = useState(""); // State to store error messages
  const [notFound, setNotFound] = useState(false); // State to track if MR is not found (404)
  const [qrImage, setQrImage] = useState(null); // State to store QR code image URL (base64)
  const [loading, setLoading] = useState(true); // State to manage overall loading status

  /**
   * Generates a PDF blob URL from the MRPdf component.
   * This is used for both download and print functionalities.
   * returns Promise<string> A promise that resolves to the object URL of the PDF blob.
   */
  const generatePdfBlob = useCallback(async () => {
    if (!qrImage || !data) return null; // Ensure data and QR image are available
    try {
      const blob = await pdf(<MRPdf qrImage={qrImage} data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      return url;
    } catch (pdfError) {
      console.error("Error generating PDF blob:", pdfError);
      setError("Failed to generate PDF for download/print.");
      return null;
    }
  }, [qrImage, data]); // Dependencies for useCallback

  /**
   * Handles the printing of the MR certificate.
   * Generates a PDF blob and opens it in a hidden iframe for printing.
   */
  const handlePrint = async () => {
    const url = await generatePdfBlob();

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);

    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (printError) {
      console.error("Error during print operation:", printError);
      toast.error(
        "Could not initiate printing. Please try downloading the PDF instead."
      );
    }
  };

  /**
   * Effect hook to fetch MR data by ID and generate QR code.
   * Runs once on component mount or when 'id' changes.
   */
  useEffect(() => {
    document.title = `BGIC - Money Receipt`; // Set document title dynamically

    const fetchDataById = async () => {
      setLoading(true); // Set loading true before fetching
      try {
        const res = await axios.get(`${config.apiUrl}/mr/${id}`);
        setData(res.data);
        setError(""); // Clear previous errors
        setNotFound(false); // Ensure notFound is false on success
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true); // Set notFound if resource is not found
        } else {
          setError(err.response?.data?.error || "Failed to load MR data.");
        }
      } finally {
        setLoading(false); // Set loading false after fetch attempt
      }
    };
    fetchDataById();

    // Generate QR code for the current page URL
    const pageUrl = `${window.location.origin}/mr/${id}`;
    QRCode.toDataURL(pageUrl, { errorCorrectionLevel: "H", width: 200 }) // Added width for better control
      .then((url) => setQrImage(url))
      .catch((err) => {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code.");
      });
  }, [id]); // Dependency array includes 'id'

  /**
   * Handles navigation to the edit MR form.
   */
  const handleEdit = () => {
    navigate(`/mr/edit/${id}`); // Navigate to the edit route for the current MR
  };

  /**
   * Handles the deletion of the current MR.
   * Displays a confirmation dialog before proceeding with deletion.
   */
  const handleDelete = async () => {
    // Custom modal for confirmation instead of window.confirm
    const userConfirmed = await new Promise((resolve) => {
      const confirmDialog = document.createElement("div");
      confirmDialog.className =
        "fixed inset-0 bg-[#4a5565ab]  flex items-center justify-center z-50";
      confirmDialog.innerHTML = `
        <div class="bg-white rounded-lg p-8 shadow-xl max-w-sm mx-auto text-center">
          <p class="text-lg font-semibold mb-4">Are you sure you want to delete this data?</p>
          <p class="text-red-500 mb-6">This action cannot be undone.</p>
          <div class="flex justify-center gap-4">
            <button id="cancelDelete" class="px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
            <button id="confirmDelete" class="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmDialog);

      document.getElementById("cancelDelete").onclick = () => {
        document.body.removeChild(confirmDialog);
        resolve(false);
      };
      document.getElementById("confirmDelete").onclick = () => {
        document.body.removeChild(confirmDialog);
        resolve(true);
      };
    });

    if (!userConfirmed) return;

    setLoading(true); // Set loading true during deletion
    try {
      await axios.delete(`${config.apiUrl}/mr/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        <div>
          <p className="font-bold">Success!</p>
          <p>MR {data?.mrNumber} Successfully Deleted.</p>
        </div>
      );

      navigate("/mr", { replace: true }); // Redirect to MR list after successful deletion
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete MR.");
      console.error("Delete error:", err);
    } finally {
      setLoading(false); // Set loading false after deletion attempt
    }
  };

  /**
   * Effect hook to display error toasts when the 'error' state changes.
   */
  useEffect(() => {
    if (error) {
      toast.error(
        <div>
          <p className="font-bold">Error!</p>
          <p>{error}</p>
        </div>
      );
      setError(""); // Clear the error after showing the toast
    }
  }, [error]);

  // Conditional rendering based on loading, notFound, or data availability
  if (notFound) return <NotFound />; // Render NotFound component if MR is not found
  if (loading || !data) return <Loading message="Loading MR details..." />; // Show loading spinner while fetching or if data is null

  // Main render for MR details
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Action Buttons: Edit, Delete, Download PDF, Print */}
      <div className="w-full flex flex-col md:flex-row gap-4 mb-6 md:justify-between px-4">
        {/* Edit and Delete Buttons (only if authenticated) */}
        {isAuthenticated && (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
              disabled={loading} // Disable during loading
            >
              <FaEdit className="text-lg" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
              disabled={loading} // Disable during loading
            >
              <FaTrashAlt className="text-lg" /> Delete
            </button>
          </div>
        )}

        {/* Download and Print Buttons */}
        <div className="flex flex-wrap gap-3 md:ml-auto">
          <PDFDownloadLink
            document={<MRPdf qrImage={qrImage} data={data} />}
            fileName={`Money Receipt-${data.mrNo}.pdf`}
            className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
          >
            {({ loading: pdfLoading }) =>
              pdfLoading ? (
                "Generating PDF..."
              ) : (
                <>
                  <FaDownload className="text-lg" /> Download
                </>
              )
            }
          </PDFDownloadLink>
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={handlePrint}
            disabled={loading} // Disable during loading
          >
            <FaPrint className="text-lg" /> Print
          </button>
        </div>
      </div>

      {/* <PDFViewer width="100%" height="800">
        <MRPdf qrImage={qrImage} data={data} />
      </PDFViewer> */}

      {/* MR Info */}
      <div className="mx-auto bg-white shadow-xl rounded-sm sm:rounded-lg p-2 sm:p-6  w-full text-xl md:text-base">
        <Header />
        <MoneyReceiptInfo data={data} />
        <PremiumBox data={data} qrImage={qrImage} />
        <Footer />
      </div>
    </div>
  );
}

// Component
function Header() {
  return (
    <header className="">
      <img alt="bgic logo" src={headerImage} className="h-full w-full" />

      {/* heading */}
      <div className="text-center mt-5 px-6">
        <p className="">Head Office: 42, Dilkusha C/A Motijheel Dhaka.</p>
        <p className="">Phone: 02223383056-8, 02223351090-1 Fax: 02223384212</p>
        <p className="">Email: info@bgicinsure.com web: www.bgicinsure.com</p>

        <h3 className="text-left my-3">BIN : 000001322-0202</h3>
        <h2 className="text-md md:text-xl mb-2 uppercase">MONEY RECEIPT</h2>
        <h3 className="">MUSHAK: 6.3</h3>
      </div>
    </header>
  );
}

function MoneyReceiptInfo({ data }) {
  return (
    <div className=" p-6 leading-relaxed">
      {/* Header Info */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <LabelValue label="Issuing Office" value={data.mrOffice} />
        <LabelValue
          label="Date"
          value={moment(data.mrDate).format("DD-MM-YYYY")}
        />
        <LabelValue label="Money Receipt No" value={data.mrNo} />
        <LabelValue label="MR Number" value={data.mrNumber} />
        <LabelValue label="Class of Insurance" value={data.policyClass} />
      </div>

      <hr className="border-gray-300 my-2" />

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <LabelValue label="Received from" value={data.receivedFrom} />
        <LabelValue
          label="The sum of"
          // value={`Tk. ${parseFloat(data.total).toFixed(2)}`}
          value={`Tk. ${formatNumberToComma(
            data.total
          )} (${convertAmountToWords(data.total)} taka)`}
        />
      </div>

      <hr className="border-gray-300 my-2" />

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <LabelValue label="Mode of Payment" value={data.mop} />
        <LabelValue label="Cheque No / Reference" value={data.chequeNo} />
        <LabelValue
          label="Cheque Date"
          value={moment(data.chequeDate).format("DD-MM-YYYY")}
        />
        <LabelValue label="Bank" value={data.bank} />
        {data.bankBranch && (
          <LabelValue label="Bank Branch" value={data.bankBranch} />
        )}
      </div>

      <hr className="border-gray-300 my-2" />

      {/* Policy Info */}
      <LabelValue
        label="Issued Against"
        value={data.policyNo}
        className="mb-4 col-span-2"
      />
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <LabelValue label="Policy Number" value={data.policyNumber} />
        <LabelValue
          label="Policy Date"
          value={moment(data.policyDate).format("DD-MM-YYYY")}
        />
      </div>

      {data.note && (
        <LabelValue
          label="Note"
          value={data.note}
          className="mb-4 col-span-2"
        />
      )}
    </div>
  );
}

function LabelValue({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value || "—"}</span>
    </div>
  );
}

function PremiumBox({ data, qrImage }) {
  return (
    <section className="flex flex-col md:flex-row md:justify-between items-center text-center md:text-left px-6">
      {/* Premium */}
      <table className="mb-6 w-full md:w-1/2 border border-gray-400 text-left">
        <tbody>
          <ReceiptRow label="Premium" amount={data.premium} />
          {data.mrClassCode === "MC" && (
            <ReceiptRow label="Stamp" amount={data.stamp} />
          )}
          {data.coins === "Co-Ins" && (
            <ReceiptRow label="Coins (Net)" amount={data.coinsnet} />
          )}
          {data.mrClassCode === "MISC/OMP" && (
            <ReceiptRow label="VAT" amount={data.vat} />
          )}
          <ReceiptRow
            label="Total"
            amount={data.total}
            className="bg-gray-300"
          />
        </tbody>
      </table>

      {/* QR */}
      <div className="w-1/2 flex justify-center items-center">
        <div className=" w-48 h-48 mx-auto md:mx-0">
          <img
            src={qrImage}
            className="w-full h-full object-contain"
            alt="QR Code"
          />
        </div>
      </div>
    </section>
  );
}

function ReceiptRow({ label, amount, className }) {
  return (
    <tr className={`${className}`}>
      <td className="border px-3 py-1">{label}</td>
      <td className="border px-3 py-1">BDT</td>
      <td className="border px-3 py-1 text-right">
        {/* {parseFloat(amount).toFixed(2)} */}
        {formatNumberToComma(amount)}
      </td>
    </tr>
  );
}

function Footer() {
  return (
    <section className="my-6 text-center">
      <div className="text-xs text-gray-600 space-y-1">
        <p>
          This RECEIPT is computer generated, authorized signature is not
          required.
        </p>
        <p>Receipt valid subject to encashment of cheque / P.O. / D.D.</p>
        <p>Note: If you have any complaint about Insurance, call 16130.</p>
      </div>
    </section>
  );
}
