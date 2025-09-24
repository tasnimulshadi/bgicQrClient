import { useRef, useState, useEffect } from "react";
import { FaDownload, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import config from "../utility/config";
import axios from "axios";
import { toast } from "react-toastify";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";

export default function DownloadDropdown({ filters }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FETCH DATA
  async function fetchData() {
    try {
      const query = new URLSearchParams();
      if (filters?.claim_no) query.append("claim_no", filters.claim_no.trim());
      if (filters?.policy_no)
        query.append("policy_no", filters.policy_no.trim());
      if (filters?.insured_name)
        query.append("insured_name", filters.insured_name.trim());
      if (filters?.date_from) query.append("date_from", filters.date_from);
      if (filters?.date_to) query.append("date_to", filters.date_to);

      const res = await axios.get(
        `${config.apiUrl}/claim?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data?.data || [];
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data.");
      return [];
    }
  }

  // DOWNLOAD - PDF
  //   async function downloadPdf() {
  //     setLoading(true);
  //     try {
  //       const freshData = await fetchData();
  //       if (freshData.length === 0) {
  //         toast.warning("No data available to download.");
  //         return;
  //       }

  //       const rows = freshData.map((item, index) => [
  //         index + 1,
  //         item.claim_no,
  //         item.policy_no,
  //         item.insured_name,
  //         item.loss_date?.split("T")[0] || "",
  //         item.amount,
  //         item.present_status,
  //       ]);

  //       const doc = new jsPDF("landscape");

  //       doc.setFontSize(14);
  //       doc.text("Claims Report", 14, 15);
  //       doc.setFontSize(10);
  //       doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

  //       autoTable(doc, {
  //         head: [
  //           [
  //             "SL",
  //             "Claim No",
  //             "Policy No",
  //             "Insured Name",
  //             "Loss Date",
  //             "Amount",
  //             "Status",
  //           ],
  //         ],
  //         body: rows,
  //         startY: 30,
  //         styles: { fontSize: 9 },
  //         headStyles: { fillColor: [0, 128, 128] },
  //       });

  //       doc.save("claims.pdf");
  //       setDropdownOpen(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  async function downloadPdf() {
    setLoading(true);
    try {
      const freshData = await fetchData();
      if (freshData.length === 0) {
        toast.warning("No data available to download.");
        return;
      }

      const rows = freshData.map((item, index) => [
        index + 1,
        item.claim_no,
        item.policy_no,
        item.insured_name,
        item.loss_date ? moment(item.loss_date).format("DD MMM YYYY") : "",
        item.amount,
        item.present_status
          ? moment(item.present_status).format("DD MMM YYYY")
          : "",
      ]);

      const doc = new jsPDF("p", "mm", "a4"); // portrait A4

      // Header
      doc.setFontSize(14);
      doc.text("Claims Report", 14, 22);

      // Table
      autoTable(doc, {
        head: [
          [
            "SL",
            "Claim No",
            "Policy No",
            "Insured Name",
            "Loss Date",
            "Amount",
            "Status",
          ],
        ],
        body: rows,
        startY: 30,
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 40 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
        },
      });

      doc.save("claims.pdf");
      setDropdownOpen(false);
    } finally {
      setLoading(false);
    }
  }

  // DOWNLOAD - EXCEL
  async function downloadExcel() {
    setLoading(true);
    try {
      const freshData = await fetchData();
      if (freshData.length === 0) {
        toast.warning("No data available to download.");
        return;
      }

      const dataWithSL = freshData.map((item, index) => ({
        SL: index + 1,
        "Claim No": item.claim_no,
        "Policy No": item.policy_no,
        "Insured Name": item.insured_name,
        "Loss Date": item.loss_date
          ? moment(item.loss_date).format("DD MMM YYYY")
          : "",
        Amount: item.amount,
        Status: item.present_status
          ? moment(item.present_status).format("DD MMM YYYY")
          : "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataWithSL);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "claims.xlsx");

      setDropdownOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-xl transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-2 disabled:opacity-50"
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        disabled={loading}
      >
        <FaDownload size={18} />
        {loading ? "Processing..." : "Download"}
      </button>

      {/* Animated Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-36 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 transform transition-all duration-200 origin-top-right
          ${
            dropdownOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="flex flex-col">
          <button
            className="px-4 py-2 flex items-center gap-2 hover:bg-amber-100 transition duration-200 font-semibold"
            onClick={downloadPdf}
            disabled={loading}
          >
            <FaFilePdf size={18} /> PDF
          </button>

          <button
            className="px-4 py-2 flex items-center gap-2 hover:bg-amber-100 transition duration-200 font-semibold"
            onClick={downloadExcel}
            disabled={loading}
          >
            <FaFileExcel size={18} /> Excel
          </button>
        </div>
      </div>
    </div>
  );
}
