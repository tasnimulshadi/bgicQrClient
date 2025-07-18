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
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import QRCode from "qrcode";
import OMPPdf from "./OMPPdf"; // Assuming OMPPdf component is defined elsewhere for PDF generation
import headerImage from "../../assets/pdfheaderimg.jpg"; // Path to header image for PDF/display
import signatureImage from "../../assets/signature.jpg"; // Path to signature image for PDF/display
import { formatNumberToComma } from "../../utility/utilityFunctions"; // Utility for number formatting
import config from "../../utility/config"; // Configuration for API endpoints
import { toast } from "react-toastify"; // For displaying notifications
import Loading from "../../components/Loading"; // Loading spinner component

/**
 * Main OMP component to display details of a single OMP policy,
 * and provide options to edit, delete, download PDF, and print.
 */
export default function OMP() {
  const { id } = useParams(); // Get OMP ID from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const { isAuthenticated, token } = useAuth(); // Authentication context
  const [data, setData] = useState(null); // State to store OMP policy data
  const [error, setError] = useState(""); // State to store error messages
  const [notFound, setNotFound] = useState(false); // State to track if OMP is not found (404)
  const [qrImage, setQrImage] = useState(null); // State to store QR code image URL (base64)
  const [loading, setLoading] = useState(true); // State to manage overall loading status

  /**
   * Generates a PDF blob URL from the OMPPdf component.
   * This is used for both download and print functionalities.
   * returns Promise<string> A promise that resolves to the object URL of the PDF blob.
   */
  const generatePdfBlob = useCallback(async () => {
    if (!qrImage || !data) return null; // Ensure data and QR image are available
    try {
      const blob = await pdf(<OMPPdf qrImage={qrImage} data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      return url;
    } catch (pdfError) {
      console.error("Error generating PDF blob:", pdfError);
      setError("Failed to generate PDF for download/print.");
      return null;
    }
  }, [qrImage, data]); // Dependencies for useCallback

  /**
   * Handles the printing of the OMP certificate.
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
   * Effect hook to fetch OMP data by ID and generate QR code.
   * Runs once on component mount or when 'id' changes.
   */
  useEffect(() => {
    document.title = `BGIC - OMP Certificate`; // Set document title dynamically

    const fetchDataById = async () => {
      setLoading(true); // Set loading true before fetching
      try {
        const res = await axios.get(`${config.apiUrl}/omp/${id}`);
        setData(res.data);
        setError(""); // Clear previous errors
        setNotFound(false); // Ensure notFound is false on success
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true); // Set notFound if resource is not found
        } else {
          setError(err.response?.data?.error || "Failed to load OMP data.");
        }
      } finally {
        setLoading(false); // Set loading false after fetch attempt
      }
    };
    fetchDataById();

    // Generate QR code for the current page URL
    const pageUrl = `${window.location.origin}/omp/${id}`;
    QRCode.toDataURL(pageUrl, { errorCorrectionLevel: "H", width: 200 }) // Added width for better control
      .then((url) => setQrImage(url))
      .catch((err) => {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code.");
      });
  }, [id]); // Dependency array includes 'id'

  /**
   * Handles navigation to the edit OMP form.
   */
  const handleEdit = () => {
    navigate(`/omp/edit/${id}`); // Navigate to the edit route for the current OMP
  };

  /**
   * Handles the deletion of the current OMP policy.
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
      await axios.delete(`${config.apiUrl}/omp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        <div>
          <p className="font-bold">Success!</p>
          <p>OMP {data?.policyNumber} Successfully Deleted.</p>
        </div>
      );

      navigate("/omp", { replace: true }); // Redirect to OMP list after successful deletion
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete OMP.");
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
  if (notFound) return <NotFound />; // Render NotFound component if OMP is not found
  if (loading || !data) return <Loading message="Loading OMP details..." />; // Show loading spinner while fetching or if data is null

  // Main render for OMP details
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
            document={<OMPPdf qrImage={qrImage} data={data} />}
            fileName={`OMP-Certificate-${data.policyNo}.pdf`}
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

      {/* OMP Info */}
      <div className="mx-auto bg-white shadow-xl rounded-sm sm:rounded-lg p-2 sm:p-6  w-full">
        <Header />
        <PolicyInfo data={data} />
        <Benefits />
        <Premium data={data} />
        <Assistance />
        <Authorization qrImage={qrImage} />
      </div>
    </div>
  );
}

// Component
function Header() {
  return (
    <header className="">
      <img alt="bgic logo" src={headerImage} className="h-full w-full" />
    </header>
  );
}

function PolicyInfo({ data }) {
  return (
    <section className="mt-4">
      {/* heading */}
      <div className="text-center mb-2">
        <h2 className="text-[#2d455f] font-bold text-md md:text-xl mb-2">
          TRAVEL HEALTH INSURANCE CERTIFICATE
        </h2>
        <h3 className="text-lg">{data.typeOfTRV}</h3>
      </div>

      {/* form */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <p>
            <b>POLICY NUMBER:</b> {data.policyNo}
          </p>
          <p>
            <b>ISSUING DATE:</b> {moment(data.issueDate).format("DD/MM/YYYY")}
          </p>
        </div>

        {/* form table */}
        {/* 
      On mobile, we use grid-cols-1 so that each cell takes the full width.
      On md screens and above, we revert to using 8 columns.
    */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-1 my-2 text-sm">
          {/* Header Row */}
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 order-1 sm:order-none">
            DESTINATION
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 order-3 sm:order-none">
            FROM
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 order-5 sm:order-none">
            TO
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 order-7 sm:order-none">
            COUNTRY OF RESIDENCE
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 order-9 sm:order-none">
            TELEPHONE NUMBER
          </div>

          {/* Data Row */}
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 font-bold order-2 sm:order-none">
            {data.destination}
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 font-bold order-4 sm:order-none">
            {moment(data.travelDateFrom).format("DD/MM/YYYY")}
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 font-bold order-6 sm:order-none">
            {moment(data.travelDateTo).format("DD/MM/YYYY")}
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 font-bold order-8 sm:order-none">
            {data.countryOfResidence}
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 font-bold order-10 sm:order-none">
            +88 {data.mobile}
          </div>

          {/* Second Header Row */}
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 order-11 sm:order-none">
            FULL NAME
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 order-13 sm:order-none">
            DATE OF BIRTH
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 order-15 sm:order-none">
            PASSPORT NUMBER
          </div>
          <div className="hidden md:block md:col-span-2 order-none"></div>

          {/* Second Data Row */}
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 font-bold uppercase order-12 sm:order-none">
            {data.firstName} {data.lastName}
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 font-bold order-14 sm:order-none">
            {moment(data.dob).format("DD/MM/YYYY")}
          </div>
          <div className="bg-[#d3d3d3] px-2 sm:px-1 py-1 md:col-span-2 font-bold order-16 sm:order-none">
            {data.passport}
          </div>
        </div>

        {/* info */}
        <div>
          <p className="text-[#696969] italic">
            Contrary to any stipulations stated in the General Conditions, the
            Plan subscribed to, under this Letter of Confirmation, covers
            exclusively the below mentioned Benefits, Limitations & Excesses
            shown in the table hereafter.
          </p>
          <p className="text-[#696969] italic">
            The General Conditions form an integral part of this Letter of
            Confirmation.
          </p>
          <p className="text-sm font-semibold leading-4 my-2">
            For more info/modification regarding your policy, kindly do not
            hesitate to contact your authorized agent or e-mail us on
            support@siassistance.com
          </p>
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const [showBenefits, setShowBenefits] = useState(false);
  const benefits = [
    {
      benefits:
        "Emergency Medical, Hospitalization, Pharmaceutical Expenses, and Surgical Expenses Abroad, Due to Accident / Sudden Illness",
      sumInsured: "Up to USD 50,000",
      excess: "USD 100",
    },
    {
      benefits:
        "Emergency Medical Expenses Due to Covid-19 Until Stabilization",
      sumInsured: "Up to USD 35,000",
      excess: "USD 5,000",
    },
    {
      benefits: "Emergency Dental Care Abroad.",
      sumInsured: "Up to USD 500",
      excess: "USD 50",
    },
    {
      benefits:
        "Transport to a Properly Equipped Medical Facility/ Repatriation in Case of Accident/ Sudden Illness (Medical Evacuation & Repatriation).",
      sumInsured: "Up to Actual Cost Included Under Medical Expense",
      excess: "",
    },
    {
      benefits: "Repatriation Of Mortal Remains to The Country of Residence.",
      sumInsured: "Up to USD 5,000",
      excess: "",
    },
    {
      benefits: "Repatriation of family member travelling with the insured",
      sumInsured: "Up to cost of Return Economy Ticket",
      excess: "",
    },
    {
      benefits:
        "Emergency return home to the country of residence following death of aclose family member.",
      sumInsured: "Up to cost of Return Economy Ticket",
      excess: "",
    },
    {
      benefits:
        "Travel And Stay of One Immediate Family Member to Stay with The Insured in Case of Accident/ Sudden Illness (Compassionate Visit)",
      sumInsured:
        "Up to cost of Return Economy Ticket Per Day UP TO USD100 UP TO USD 500",
      excess: "",
    },
    {
      benefits:
        "Escort of Minor Child in Case of Accident/ Sudden Illness of The Insured",
      sumInsured: "Up to USD 5,000",
      excess: "",
    },
    {
      benefits: "Travel assistance services",
      sumInsured: "Covered 24'7",
      excess: "",
    },
    {
      benefits:
        "Delivery of medicines or dispatched of a specialized physician abroad",
      sumInsured: "Assistance Only",
      excess: "",
    },
    {
      benefits:
        "Medical referral/appointment of local medical specialist abroad",
      sumInsured: "Assistance Only",
      excess: "",
    },
    {
      benefits: "Connection services",
      sumInsured: "Assistance Only",
      excess: "",
    },
    {
      benefits: "Relay Of Urgent Messages",
      sumInsured: "Assistance Only",
      excess: "",
    },
    {
      benefits: "Trip cancellation and Curtailment abroad",
      sumInsured: "Up to USD 500",
      excess: "",
    },
    {
      benefits: "Delayed departure abroad",
      sumInsured: "Per Hour UP TO USD 50 UP TO USD 500 For Necessary Items",
      excess: "6 hours",
    },
    {
      benefits: "Missed flight connection abroad",
      sumInsured: "Replacement of flight ticket",
      excess: "",
    },
    {
      benefits: "Compensation for in-flight loss of checked-in Luggage",
      sumInsured: "Per Bag UP TO USD 100 Per Item UP TO USD 50 UP TO USD 300",
      excess: "",
    },
    {
      benefits:
        "Compensation for Delay in The Arrival of Checked-In Luggage Abroad",
      sumInsured: "UP TO USD 300 For Necessary Items",
      excess: "12 Hours",
    },
    {
      benefits:
        "Location And Forwarding of Delayed Checked-In Luggage and Personal Effects",
      sumInsured: "Assistance Only",
      excess: "",
    },
    {
      benefits: "Loss of Passport abroad",
      sumInsured: "Up to USD 300",
      excess: "",
    },
    {
      benefits: "Accidental Death While Abroad",
      sumInsured: "Sum Insured: up to USD 5,000",
      excess: "",
    },
    {
      benefits: "Permanent Total Disability",
      sumInsured: "100% of Sum Insured",
      excess: "",
    },
    {
      benefits: "Permanent Partial Disability",
      sumInsured: "% of Sum Insured as per Wording scale",
      excess: "",
    },
    {
      benefits: "Personal Liability",
      sumInsured: "Up to USD 5,000",
      excess: "",
    },
    {
      benefits: "Legal Assistance",
      sumInsured: "Up to USD 2,500",
      excess: "",
    },
    {
      benefits: "Advance of Bail Bond",
      sumInsured: "Up to USD 2,500",
      excess: "",
    },
  ];

  return (
    <section>
      <button
        className="text-lg font-bold flex justify-center items-center gap-2 cursor-pointer mb-2 text-[#2c455a]"
        onClick={() => setShowBenefits(!showBenefits)}
      >
        {showBenefits ? "Hide" : "Show"} Benefits
        {showBenefits ? (
          <FaChevronUp color="#2c455a" />
        ) : (
          <FaChevronDown color="#2c455a" />
        )}
      </button>
      {showBenefits && (
        <table className="w-full" aria-expanded={showBenefits}>
          <thead className="bg-[#d3d3d3] w-full text-left">
            <tr className="border-[1px] border-[#929292]">
              <th colSpan={3} className="px-1 w-4/8">
                BENEFITS
              </th>
              <th colSpan={2} className="px-1 w-3/8">
                SUM INSURED
              </th>
              <th colSpan={1} className="px-1 w-1/8">
                EXCESS
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#d3d3d3] w-full text-left text-sm">
            {benefits.map((item, index) => (
              <tr
                className={`${
                  index % 2 == 0 ? "bg-white" : "bg-[#d3d3d3]"
                } py-2 border-[1px] border-[#929292]`}
                key={index}
              >
                <td
                  colSpan={3}
                  className=" px-1 font-semibold w-4/8 border-r-1 border-[#929292]"
                >
                  {item.benefits}
                </td>
                <td
                  colSpan={2}
                  className="px-1 w-3/8 border-r-1 border-[#929292]"
                >
                  {item.sumInsured}
                </td>
                <td colSpan={1} className="px-1 w-1/8">
                  {item.excess}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function Premium({ data }) {
  return (
    <section>
      {/* Premium */}
      <h2 className="text-lg font-bold my-2">
        Premium (including VAT) : BDT{" "}
        {formatNumberToComma(Number(data.premium) + Number(data.vat))}
      </h2>
      <div className="text-sm font-bold">
        Above sums insured are per person & per period of cover.
        <br />
        Claim will be settled in Euro for Schengen country equivalent to USD.
        <br />
        The Premium of the policy is not refundable/adjustable under any
        circumstances.
      </div>

      {/* Important Notes */}
      <div className="font-bold text-sm my-4">
        <p className="underline mb-2">Important Notes:</p>
        <p>
          - Coverage starts when the insured leaves the country of his residence
          and ceases in case. The insured returns to his country of residence;
          or number of days lapsed.
        </p>
        <p>
          - * Excess is changeable depending on the Age of the insured. Please
          refer to the deductibles table in the General Conditions document.
        </p>
      </div>
    </section>
  );
}

function Assistance() {
  const [showAssistance, setShowAssistance] = useState(false);

  return (
    <section>
      <div
        className="mb-2 flex justify-between items-center"
        onClick={() => setShowAssistance(!showAssistance)}
      >
        <h2 className="text-lg md:text-xl font-bold text-[#2c455a]">
          HOW TO REQUEST ASSISTANCE?
        </h2>
        <div className="text-lg font-bold flex justify-center items-center gap-2 cursor-pointer mb-2 text-[#2c455a]">
          {showAssistance ? "Hide" : "Show"}
          {showAssistance ? (
            <FaChevronUp color="#2c455a" />
          ) : (
            <FaChevronDown color="#2c455a" />
          )}
        </div>
      </div>

      {showAssistance && (
        <div className="text-sm font-semibold" aria-expanded={showAssistance}>
          <p>
            The Reinsured/Cedant will insert "clear indications" in the issued
            policies advising the "Insured" to contact The Assistance Company
            seeking the Covered Benefits and Services and avoid reimbursement
            procedures.
          </p>
          <p>
            Since the appearance of an event that could be included in any of
            the guarantees described previously, the Beneficiary or any person
            acting in his place will necessarily contact, in the shortest
            possible time, in every case, the Alarm Centre (24 Hrs./7 days)
            mentioned below, which will be available to help any person.
          </p>
          <p>
            In the event of any claim Covered under this policy, the liability
            of the Assistance Company shall be conditional on the insured
            claiming indemnity or Benefit having complied with and continuing to
            comply with the terms of this Policy.
          </p>
          <p>
            If a Benefit Covered by the policy or assistance is needed, the
            Insured shall:
          </p>
          <p className="mt-4">
            1) Take all reasonable precautions to minimize the loss.
          </p>
          <p>
            2) As soon as possible contact Swan International Assistance to
            notify the claim stating the Benefits required:
          </p>

          {/* Contact Table */}
          <table className="my-4 w-full text-center border-[1px] border-gray-500 text-lg md:text-xl">
            <tbody>
              <tr className="bg-[#c0e3a9]">
                <td className="border-[1px] border-gray-500 py-1" colSpan={2}>
                  Available 24 Hrs. / 7 days
                </td>
              </tr>
              <tr>
                <td className="border-[1px] w-1/2 border-gray-500 py-1">
                  Country
                </td>
                <td className="border-[1px] w-1/2 border-gray-500">
                  Contact Numbers
                </td>
              </tr>
              <tr>
                <td className="border-[1px] w-1/2 border-gray-500 py-1">
                  USA / Canada
                </td>
                <td className="border-[1px] w-1/2 border-gray-500">
                  +1 514 448 4417
                </td>
              </tr>
              <tr>
                <td className="border-[1px] w-1/2 border-gray-500 py-1">
                  France / Europe
                </td>
                <td className="border-[1px] w-1/2 border-gray-500">
                  +33 9 75 18 52 99
                </td>
              </tr>
              <tr>
                <td className="border-[1px] w-1/2 border-gray-500 py-1">
                  International
                </td>
                <td className="border-[1px] w-1/2 border-gray-500">
                  +961 9 211 662
                </td>
              </tr>
              <tr className="bg-[#059255]">
                <td
                  className="border-[1px] w-1/2 border-gray-500 py-1 text-white"
                  colSpan={2}
                >
                  Email : request@swanassistance.com
                </td>
              </tr>
            </tbody>
          </table>

          <p>3) Freely provide all relevant information.</p>
          <p>
            4) Make "NO" admission of liability or offer promise or payment of
            any kind.
          </p>
        </div>
      )}
    </section>
  );
}

function Authorization({ qrImage }) {
  // Construct full URL for this page for QR code
  // You might want to change the base URL for production

  return (
    <section className="my-6 flex flex-col md:flex-row md:justify-between items-center text-center md:text-left gap-6">
      {/* QR */}
      <div>
        <p className="font-semibold">Confirmation Code</p>
        <div className="border-2 w-48 h-48 mx-auto md:mx-0">
          <img
            src={qrImage}
            className="w-full h-full object-contain"
            alt="QR Code"
          />
        </div>
        <p className="text-gray-500 italic max-w-xs mx-auto md:mx-0">
          For official use, scan the above code to validate this confirmation
          letter.
        </p>
      </div>

      {/* Signature */}
      <div className="flex flex-col items-center md:items-end font-semibold">
        <p>AUTHORIZED SIGNATORY AND STAMP</p>
        <img src={signatureImage} alt="signature" className="w-44 mt-2" />
      </div>
    </section>
  );
}
