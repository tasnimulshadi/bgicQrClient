// Utility

export function formatNumberToComma(num) {
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDestinationList(destinations) {
  const countries = destinations.map((d) => d.country).filter(Boolean);

  if (countries.length === 0) return "";
  if (countries.length === 1) return countries[0];
  if (countries.length === 2) return `${countries[0]} and ${countries[1]}`;

  const allButLast = countries.slice(0, -1).join(", ");
  const last = countries[countries.length - 1];
  return `${allButLast} and ${last}`;
}

export function convertAmountToWords(amount) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convert(num) {
    if (num < 20) return ones[num];
    if (num < 100)
      return (
        tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
      );
    if (num < 1000)
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 ? " " + convert(num % 100) : "")
      );
    if (num < 100000)
      return (
        convert(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 ? " " + convert(num % 1000) : "")
      );
    if (num < 1000000)
      return (
        convert(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 ? " " + convert(num % 100000) : "")
      );
    return "Amount too large";
  }

  const integer = parseInt(amount);
  if (isNaN(integer)) return "Invalid amount";

  return convert(integer);
}

export function getFileIcon(filePath) {
  if (!filePath) return "/assets/icons/document.png"; // default if no file

  const ext = filePath.split(".").pop().toLowerCase();

  switch (ext) {
    case "pdf":
      return "/assets/icons/pdf.png";
    case "doc":
    case "docx":
      return "/assets/icons/doc.png";
    case "xls":
    case "xlsx":
    case "csv":
      return "/assets/icons/xls.png";
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return "/assets/icons/jpg.png";
    default:
      return "/assets/icons/document.png"; // default icon
  }
}

// Get filename from full path
export function getFileNameFromFullPath(filePath) {
  if (!filePath) return "";
  return filePath.split("/").pop();
}

// Group files by category
export function groupFilesByCategory(files = []) {
  const grouped = Object.values(
    (files || []).reduce((acc, row) => {
      const category = row.category_name || "Uncategorized";
      if (!acc[category]) acc[category] = { category, files: [] };
      acc[category].files.push(row);
      return acc;
    }, {})
  );

  // Sort categories alphabetically, move 'Uncategorized' and 'Final Survey Report' to bottom
  grouped.sort((a, b) => {
    const order = ["Uncategorized", "Final Survey Report"];

    if (a.category === b.category) return 0;

    // Push 'Uncategorized' and 'Final Survey Report' to the end
    if (order.includes(a.category)) return 1;
    if (order.includes(b.category)) return -1;

    return a.category.localeCompare(b.category);
  });

  // Optionally: sort files inside each category by name
  // grouped.forEach((group) => {
  //   group.files.sort((a, b) => a.name.localeCompare(b.name));
  // });

  return grouped;
}
