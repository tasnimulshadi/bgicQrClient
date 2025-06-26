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
