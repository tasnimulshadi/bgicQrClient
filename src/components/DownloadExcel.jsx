import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadExcel({ data, filename = "data" }) {
  const downloadExcel = () => {
    // 1. Add serial number
    const dataWithSL = data.map((item, index) => ({
      SL: index + 1,
      ...item, // keep other properties
    }));

    // 2. Convert JSON array to worksheet
    const worksheet = XLSX.utils.json_to_sheet(dataWithSL);

    // 3. Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 4. Write workbook to binary string
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // 5. Save file using FileSaver
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${filename}.xlsx`);
  };

  return (
    <button
      onClick={downloadExcel}
      className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg shadow-xl transition duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-1 self-end"
    >
      <FaDownload size={20} />
      Download
    </button>
  );
}
