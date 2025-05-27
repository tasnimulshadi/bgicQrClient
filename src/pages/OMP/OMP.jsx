import axios from "axios";
import { useEffect, useState } from "react";
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
} from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";

export default function OMP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchDataById = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/omp/${id}`);
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.error || "Failed to load data");
        }
      }
    };

    fetchDataById();
  }, [id]);

  const handleEdit = () => {
    navigate(`/omp/edit/${id}`); // Adjust route based on your app
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this data? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/omp/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/omp"); // Redirect to data list after delete
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete data");
    }
  };

  const handleDownload = () => {
    alert("PDF is not available yet.");
  };

  if (notFound) return <NotFound />;
  if (error) return <p className="text-red-600 p-4">{error}</p>;
  if (!data) return <p className="p-4 text-center">Loading...</p>;

  return (
    <div className="">
      <div className="flex gap-4 mb-4 justify-between">
        {isAuthenticated && (
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer shadow-2xl flex gap-2 items-center"
            >
              Edit <FaEdit />
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer shadow-2xl flex gap-2 items-center"
            >
              Delete <FaTrashAlt />
            </button>
          </div>
        )}
        <button
          onClick={handleDownload}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 transition cursor-pointer shadow-2xl flex gap-2 items-center"
        >
          Download Pdf <FaDownload />
        </button>
      </div>

      <div className="mx-auto bg-white shadow-lg rounded-lg p-6 w-full">
        <Header />
        <PolicyInfo data={data} />
        <Benefits />
        <Premium premium={data.premium} />
        <Assistance />
        <Authoriaztion id={data._id} />
      </div>
    </div>
  );
}

// Component
function Header() {
  return (
    <header className="bg-red-400">
      <img
        alt="bgic logo"
        src="/src/assets/headerimg.jpg"
        className="h-full w-full"
      />
    </header>
  );
}

function PolicyInfo({ data }) {
  return (
    <section className="mt-4">
      {/* heading */}
      <div className="text-center mb-2">
        <h2 className="text-[#2d455f] font-bold text-xl mb-2">
          TRAVEL HEALTH INSURANCE CERTIFICATE
        </h2>
        <h3 className="text-lg">{data.plan}</h3>
      </div>

      {/* form */}
      <div className="mt-4">
        <div className="flex justify-between">
          <p>
            <b>POLICY NUMBER:</b> {data.policyNumber}
          </p>
          <p>
            <b>ISSUING DATE:</b> {moment(data.issuingDate).format("DD/MM/YYYY")}
          </p>
        </div>
        {/* form table*/}
        <div className="grid grid-cols-8 gap-1 my-2">
          <div className="bg-[#d3d3d3] px-1 col-span-2">DESTINATION</div>
          <div className="bg-[#d3d3d3] px-1">FROM</div>
          <div className="bg-[#d3d3d3] px-1">TO</div>
          <div className="bg-[#d3d3d3] px-1 col-span-2">
            COUNTRY OF RESIDENCE
          </div>
          <div className="bg-[#d3d3d3] px-1 col-span-2">TELEPHONE NUMBER</div>
          <div className="bg-[#d3d3d3] px-1 col-span-2 font-bold">
            {formatCountryList(data.destinationCountries)}
          </div>
          <div className="bg-[#d3d3d3] px-1 font-bold">
            {moment(data.travelStartDate).format("DD/MM/YYYY")}
          </div>
          <div className="bg-[#d3d3d3] px-1 font-bold">
            {moment(data.travelEndDate).format("DD/MM/YYYY")}
          </div>
          <div className="bg-[#d3d3d3] px-1 col-span-2 font-bold">
            {data.countryOfResidence}
          </div>
          <div className="bg-[#d3d3d3] px-1 col-span-2 font-bold">
            {data.telephone}
          </div>
          <div className="bg-[#d3d3d3] px-1 col-span-2">FULL NAME</div>
          <div className="bg-[#d3d3d3] px-1 col-span-2">DATE OF BIRTH</div>
          <div className="bg-[#d3d3d3] px-1 col-span-2">PASSPORT NUMBER</div>
          <div className=" col-span-2"></div>
          <div className="bg-[#d3d3d3] px-1 col-span-2 font-bold">
            {data.insuredPerson.fullName}
          </div>
          <div className="bg-[#d3d3d3] px-1 col-span-2 font-bold">
            {moment(data.insuredPerson.dateOfBirth).format("DD/MM/YYYY")}
          </div>
          <div className="bg-[#d3d3d3] px-1 col-span-2 font-bold">
            {data.insuredPerson.passportNumber}
          </div>
        </div>
        {/* info */}
        <div>
          <p className=" text-[#696969] italic">
            Contrary to any stipulations stated in the General Conditions, the
            Plan subscribed to, under this Letter of Confirmation, covers
            exclusively the below mentioned Benefits, Limitations & Excesses
            shown in the table hereafter.
          </p>
          <p className=" text-[#696969] italic">
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
        <table className="w-full">
          <thead className="bg-[#d3d3d3] w-full text-left">
            <tr className="border-1 border-[#929292]">
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
                } py-2 border-1 border-[#929292]`}
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

function Premium({ premium }) {
  return (
    <section>
      {/* Premium */}
      <h2 className="text-lg font-bold my-2">
        Premium (including VAT) : BDT {premium}
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
        <h2 className="text-xl font-bold text-[#2c455a]">
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
        <div className="text-sm font-semibold">
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
          <table className="my-4 w-full text-center border-1 border-gray-500 text-xl">
            <tbody>
              <tr className="bg-[#c0e3a9]">
                <td className="border-1 border-gray-500 py-1" colSpan={2}>
                  Available 24 Hrs. / 7 days
                </td>
              </tr>
              <tr>
                <td className="border-1 w-1/2 border-gray-500 py-1">Country</td>
                <td className="border-1 w-1/2 border-gray-500">
                  Contact Numbers
                </td>
              </tr>
              <tr>
                <td className="border-1 w-1/2 border-gray-500 py-1">
                  USA / Canada
                </td>
                <td className="border-1 w-1/2 border-gray-500">
                  +1 514 448 4417
                </td>
              </tr>
              <tr>
                <td className="border-1 w-1/2 border-gray-500 py-1">
                  France / Europe
                </td>
                <td className="border-1 w-1/2 border-gray-500">
                  +33 9 75 18 52 99
                </td>
              </tr>
              <tr>
                <td className="border-1 w-1/2 border-gray-500 py-1">
                  International
                </td>
                <td className="border-1 w-1/2 border-gray-500">
                  +961 9 211 662
                </td>
              </tr>
              <tr className="bg-[#059255]">
                <td
                  className="border-1 w-1/2 border-gray-500 py-1 text-white"
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

function Authoriaztion({ id }) {
  // Construct full URL for this page for QR code
  // You might want to change the base URL for production
  const pageUrl = `${window.location.origin}/omp/${id}`;

  return (
    <section className="my-6 flex justify-between items-start">
      {/* QR */}
      <div>
        <p className="font-semibold">Confirmation Code</p>
        <QRCodeSVG value={pageUrl} size={180} className="border-2 p-3" />
        <p className="text-gray-500 italic">
          For official use, scan the above code to validate this confirmation
          letter.
        </p>
      </div>

      {/* Signature */}
      <div className="flex flex-col justify-center items-end font-semibold">
        <p>AUTHORIZED SIGNATORY AND STAMP</p>
        <img src="/src/assets/signature.jpg" alt="signature" className="w-44" />
      </div>
    </section>
  );
}

// Utility
function formatCountryList(countries) {
  if (!countries || countries.length === 0) return "";
  if (countries.length === 1) return countries[0];
  return (
    countries.slice(0, -1).join(", ") +
    " and " +
    countries[countries.length - 1]
  );
}
