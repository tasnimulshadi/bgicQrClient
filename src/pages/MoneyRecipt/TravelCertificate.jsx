import moment from "moment";

const TravelCertificate = ({ data }) => {
  // {
  //   policyNumber: "",
  //   issuingDate: "",
  //   plan: "",
  //   destinationCountries: [],
  //   travelStartDate: "",
  //   travelEndDate: "",
  //   countryOfResidence: "",
  //   telephone: "",
  //   insuredPerson: {
  //     fullName: "",
  //     dateOfBirth: "",
  //     passportNumber: "",
  //   },
  // }
  return (
    <div className="mx-auto bg-white shadow-lg rounded-lg p-6">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">
          Bangladesh General Insurance Company PLC
        </h1>
        <h2 className="text-xl font-semibold mt-2">
          Travel Health Insurance Certificate
        </h2>
      </header>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Policy Details</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <p>
            <strong>Policy Number:</strong> {data.policyNumber}
          </p>
          <p>
            <strong>Issuing Date:</strong>{" "}
            {moment(data.issuingDate).format("DD/MM/YYYY")}
          </p>
          <p>
            <strong>Plan:</strong> {data.plan}
          </p>
          <p>
            <strong>Destination:</strong>{" "}
            {data.destinationCountries.length > 1
              ? data.destinationCountries.slice(0, -1).join(", ") +
                " and " +
                data.destinationCountries[data.destinationCountries.length - 1]
              : data.destinationCountries[0] || ""}
          </p>
          <p>
            <strong>Travel Period:</strong>{" "}
            {moment(data.travelStartDate).format("DD/MM/YYYY")} to{" "}
            {moment(data.travelEndDate).format("DD/MM/YYYY")}
          </p>
          <p>
            <strong>Country of Residence:</strong> {data.countryOfResidence}
          </p>
          <p>
            <strong>Telephone:</strong> {data.telephone}
          </p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Insured Person</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <p>
            <strong>Full Name:</strong> {data.insuredPerson.fullName}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {moment(data.insuredPerson.dateOfBirth).format("DD/MM/YYYY")}
          </p>
          <p>
            <strong>Passport Number:</strong>{" "}
            {data.insuredPerson.passportNumber}
          </p>
        </div>
      </section>

      <section className="mb-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2">Benefits Summary</h3>
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Benefit</th>
              <th className="p-2 border">Sum Insured</th>
              <th className="p-2 border">Excess</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">
                Emergency Medical & Hospitalization
              </td>
              <td className="p-2 border">Up to USD 50,000</td>
              <td className="p-2 border">USD 100</td>
            </tr>
            <tr>
              <td className="p-2 border">Covid-19 Medical Expenses</td>
              <td className="p-2 border">Up to USD 35,000</td>
              <td className="p-2 border">USD 5,000</td>
            </tr>
            <tr>
              <td className="p-2 border">Emergency Dental Care</td>
              <td className="p-2 border">Up to USD 500</td>
              <td className="p-2 border">USD 50</td>
            </tr>
            <tr>
              <td className="p-2 border">Medical Evacuation & Repatriation</td>
              <td className="p-2 border">Up to Actual Cost</td>
              <td className="p-2 border">Included</td>
            </tr>
            <tr>
              <td className="p-2 border">Repatriation of Mortal Remains</td>
              <td className="p-2 border">Up to USD 5,000</td>
              <td className="p-2 border">-</td>
            </tr>
            <tr>
              <td className="p-2 border">Escort of Minor Child</td>
              <td className="p-2 border">Up to USD 5,000</td>
              <td className="p-2 border">-</td>
            </tr>
            <tr>
              <td className="p-2 border">Trip Cancellation/Curtailment</td>
              <td className="p-2 border">Up to USD 500</td>
              <td className="p-2 border">-</td>
            </tr>
            <tr>
              <td className="p-2 border">Loss of Passport</td>
              <td className="p-2 border">Up to USD 300</td>
              <td className="p-2 border">-</td>
            </tr>
            <tr>
              <td className="p-2 border">Accidental Death</td>
              <td className="p-2 border">Up to USD 5,000</td>
              <td className="p-2 border">-</td>
            </tr>
            <tr>
              <td className="p-2 border">Personal Liability</td>
              <td className="p-2 border">Up to USD 5,000</td>
              <td className="p-2 border">-</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Contact for Assistance</h3>
        <p>
          Contact <strong>Swan International Assistance</strong> 24/7:
        </p>
        <ul className="list-disc list-inside">
          <li>
            <strong>USA/Canada:</strong> +1 514 448 4417
          </li>
          <li>
            <strong>France/Europe:</strong> +33 9 75 18 52 99
          </li>
          <li>
            <strong>International:</strong> +961 9 211 662
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:request@swanassistance.com"
              className="text-blue-600 underline"
            >
              request@swanassistance.com
            </a>
          </li>
        </ul>
      </section>

      <footer className="text-center text-sm text-gray-600 mt-8">
        <p>Premium (incl. VAT): BDT 1,496.00</p>
        <p>Claims settled in Euro for Schengen equivalent to USD.</p>
        <p className="mt-2">Authorized Signatory & Stamp</p>
      </footer>
    </div>
  );
};

export default TravelCertificate;
