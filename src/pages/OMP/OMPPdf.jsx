import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import headerImage from "../../assets/pdfheaderimg.jpg";
import signatureImage from "../../assets/signature.jpg";
import moment from "moment";

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 30,
  },

  // header
  header: {
    position: "absolute",
    top: 35,
    left: 20,
    right: 20,
    paddingHorizontal: 20,
  },
  headerImage: {
    width: "100%",
  },
  headerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#2c455a",
    paddingTop: 15,
    fontWeight: "bold",
  },

  // footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "black",
    backgroundColor: "lightgray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  // content
  content: {
    padding: 2,
    // flexGrow: 1,
  },
});

const benefits = [
  {
    benefits:
      "Emergency Medical, Hospitalization, Pharmaceutical Expenses, and Surgical Expenses Abroad, Due to Accident / Sudden Illness",
    sumInsured: "Up to USD 50,000",
    excess: "USD 100",
  },
  {
    benefits: "Emergency Medical Expenses Due to Covid-19 Until Stabilization",
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
    benefits: "Medical referral/appointment of local medical specialist abroad",
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

// Define your PDF document
const OMPPdf = ({ qrImage, data }) => (
  <Document
    title={`OMP-Document-${data.policyNumber}`}
    author="Bangladesh General Insurance Company PLC."
  >
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header} fixed>
        <Image style={styles.headerImage} source={headerImage} />
        <Text style={styles.headerText}>
          TRAVEL HEALTH INSURANCE CERTIFICATE
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Policy Info */}
        <View style={{ fontSize: 10, marginTop: 5 }}>
          <Text style={{ textAlign: "center", marginBottom: 10 }}>
            Plan B : Zone 2 Worldwide Excluding USA, CANADA
          </Text>

          {/* POLICY NUMBER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text>
              <Text style={{ fontWeight: "bold" }}>POLICY NUMBER:</Text>{" "}
              {data.policyNumber}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>ISSUING DATE:</Text>{" "}
              {moment(data.issueDate).format("DD/MM/YYYY")}
            </Text>
          </View>

          {/* Form */}
          <View style={{ flexDirection: "column", width: "100%" }}>
            {/* Row 1 - Header */}
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={cellStyle("32%")}>
                <Text>DESTINATION</Text>
              </View>
              <View style={cellStyle("11%")}>
                <Text>FROM</Text>
              </View>
              <View style={cellStyle("11%")}>
                <Text>TO</Text>
              </View>
              <View style={cellStyle("25%")}>
                <Text>COUNTRY OF RESIDENCE</Text>
              </View>
              <View style={cellStyle("21%")}>
                <Text>TELEPHONE NUMBER</Text>
              </View>
            </View>

            {/* Row 2 - Data */}
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={cellStyle("32%")}>
                <Text style={{ fontWeight: "bold" }}>
                  {/* {formatDestinationList(data.destination)} */}
                  {data.destination}
                </Text>
              </View>
              <View style={cellStyle("11%")}>
                <Text style={{ fontWeight: "bold" }}>
                  {moment(data.travelDateFrom).format("DD/MM/YYYY")}
                </Text>
              </View>
              <View style={cellStyle("11%")}>
                <Text style={{ fontWeight: "bold" }}>
                  {moment(data.travelDateTo).format("DD/MM/YYYY")}
                </Text>
              </View>
              <View style={cellStyle("25%")}>
                <Text style={{ fontWeight: "bold" }}>
                  {" "}
                  {data.countryOfResidence}
                </Text>
              </View>
              <View style={cellStyle("21%")}>
                <Text style={{ fontWeight: "bold" }}> +88 {data.mobile}</Text>
              </View>
            </View>

            {/* Row 3 - Header */}
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={cellStyle("32%")}>
                <Text>FULL NAME</Text>
              </View>
              <View style={cellStyle("22%")}>
                <Text>DATE OF BIRTH </Text>
              </View>
              <View style={cellStyle("25%")}>
                <Text>PASSPORT NUMBER</Text>
              </View>
              {/* <View style={cellStyle("21%")}>
                <Text>PASSPORT NUMBER</Text>
              </View> */}
            </View>

            {/* Row 4 - Data */}
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={cellStyle("32%")}>
                <Text
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {data.firstName} {data.lastName}
                </Text>
              </View>
              <View style={cellStyle("22%")}>
                <Text style={{ fontWeight: "bold" }}>
                  {moment(data.dob).format("DD/MM/YYYY")}
                </Text>
              </View>
              <View style={cellStyle("25%")}>
                <Text style={{ fontWeight: "bold" }}>{data.passport}</Text>
              </View>
              {/* <View style={cellStyle("21%")}>
                <Text style={{ fontWeight: "bold" }}>+880 1671558822</Text>
              </View> */}
            </View>
          </View>
        </View>

        <View
          style={{
            fontSize: 10,
            paddingTop: 3,
            fontStyle: "italic",
            color: "gray",
          }}
        >
          <Text>
            Contrary to any stipulations stated in the General Conditions, the
            Plan subscribed to, under this Letter of Confirmation, covers
            exclusively the below mentioned Benefits, Limitations & Excesses
            shown in the table hereafter.
          </Text>
          <Text>
            The General Conditions form an integral part of this Letter of
            Confirmation.
          </Text>
        </View>
        <Text
          style={{
            fontSize: 8,
            paddingTop: 3,
            fontWeight: "bold",
          }}
        >
          For more info/modification regarding your policy, kindly do not
          hesitate to contact your authorized agent or e-mail us on
          support@siassistance.com
        </Text>

        {/* BENEFITS */}
        <View
          style={{
            marginTop: 5,
            border: "1",
            borderColor: "gray",
            borderTop: "none",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              fontSize: 11,
              fontWeight: "bold",
              backgroundColor: "lightgray",
            }}
          >
            <View style={{ width: "50%", padding: 3 }}>
              <Text>BENEFITS</Text>
            </View>
            <View style={{ width: "40%", padding: 3 }}>
              <Text>SUM INSURED</Text>
            </View>
            <View style={{ width: "10%", padding: 3 }}>
              <Text>EXCESS</Text>
            </View>
          </View>

          {benefits.map((item, index) => (
            <View
              style={{
                flexDirection: "row",
                fontSize: 8,
                backgroundColor: index % 2 == 0 ? "white" : "lightgray",
              }}
              key={index}
            >
              <View
                style={{
                  width: "50%",
                  padding: 2,
                  fontWeight: "bold",
                  justifyContent: "center",
                  borderRight: 1,
                  borderColor: "gray",
                }}
              >
                <Text>{item.benefits}</Text>
              </View>
              <View
                style={{
                  width: "40%",
                  padding: 2,
                  justifyContent: "center",
                  borderRight: 1,
                  borderColor: "gray",
                }}
              >
                <Text>{item.sumInsured}</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  padding: 2,
                  justifyContent: "center",
                }}
              >
                <Text>{item.excess}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Premium */}
        <View
          style={{
            fontSize: 8,
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              marginBottom: 5,
            }}
          >
            Premium (including VAT) : BDT{" "}
            {formaNumberToComma(Number(data.premium) + Number(data.vat))}
          </Text>
          <Text>Above sums insured are per person & per period of cover.</Text>
          <Text>
            Claim will be settled in Euro for Schengen country equivalent to
            USD.{" "}
          </Text>
          <Text>
            The Premium of the policy is not refundable/adjustable under any
            circumstances.
          </Text>
        </View>

        {/* Content End */}
      </View>

      {/* Next Page */}
      <View style={{ fontSize: 8, fontWeight: "bold", marginTop: 10 }} break>
        <Text style={{ textDecoration: "underline", marginBottom: 10 }}>
          Important Notes:
        </Text>
        <Text>
          - Coverage starts when the insured leaves the country of his residence
          and ceases in case. The insured returns to his country of residence;
          or number of days lapsed.
        </Text>
        <Text>
          - * Excess is changeable depending on the Age of the insured. Please
          refer to the deductibles table in the General Conditions document.
        </Text>
      </View>

      {/* ASSISTANCE */}
      <View style={{ fontSize: 8, marginTop: 15 }}>
        <Text style={{ marginBottom: 5, fontSize: 12, color: "#2c455a" }}>
          HOW TO REQUEST ASSISTANCE?
        </Text>
        <Text>
          The Reinsured/Cedant will insert "clear indications" in the issued
          policies advising the "Insured" to contact The Assistance Company
          seeking the Covered Benefits and Services and avoid reimbursement
          procedures.
        </Text>
        <Text>
          Since the appearance of an event that could be included in any of the
          guarantees described previously, the Beneficiary or any person acting
          in his place will necessarily contact, in the shortest possible time,
          in every case, the Alarm Centre (24 Hrs./7 days) mentioned below,
          which will be available to help any person.
        </Text>
        <Text>
          In the event of any claim Covered under this policy, the liability of
          the Assistance Company shall be conditional on the insured claiming
          indemnity or Benefit having complied with and continuing to comply
          with the terms of this Policy.
        </Text>
        <Text>
          If a Benefit Covered by the policy or assistance is needed, the
          Insured shall:
        </Text>
      </View>

      {/* Contact */}
      <View style={{ fontSize: 8, marginTop: 15 }}>
        <Text>1) Take all reasonable precautions to minimize the loss.</Text>
        <Text>
          2) As soon as possible contact Swan International Assistance to notify
          the claim stating the Benefits required:
        </Text>

        {/* Contact Table*/}
        <View
          style={{
            marginVertical: 10,
            border: "1",
            borderColor: "gray",
            fontSize: 12,
          }}
        >
          <View
            style={{
              textAlign: "center",
              padding: 5,
              borderBottom: "1",
              borderColor: "gray",
              backgroundColor: "#c0e3a9",
            }}
          >
            <Text>Available 24 Hrs. / 7 days</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              textAlign: "center",
              borderBottom: "1",
              borderColor: "gray",
              backgroundColor: "#c0e3a9",
            }}
          >
            <View
              style={{
                width: "50%",
                padding: 5,
                borderRight: "1",
                borderColor: "gray",
              }}
            >
              <Text>Country</Text>
            </View>
            <View
              style={{
                width: "50%",
                padding: 5,
              }}
            >
              <Text>Contact Numbers</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottom: "1",
              borderColor: "gray",
            }}
          >
            <View
              style={{
                width: "50%",
                padding: 5,
                borderRight: "1",
                borderColor: "gray",
              }}
            >
              <Text>USA / Canada</Text>
            </View>
            <View
              style={{
                width: "50%",
                padding: 5,
              }}
            >
              <Text>+1 514 448 4417</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottom: "1",
              borderColor: "gray",
            }}
          >
            <View
              style={{
                width: "50%",
                padding: 5,
                borderRight: "1",
                borderColor: "gray",
              }}
            >
              <Text>France / Europe</Text>
            </View>
            <View
              style={{
                width: "50%",
                padding: 5,
              }}
            >
              <Text>+33 9 75 18 52 99</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottom: "1",
              borderColor: "gray",
            }}
          >
            <View
              style={{
                width: "50%",
                padding: 5,
                borderRight: "1",
                borderColor: "gray",
              }}
            >
              <Text>International</Text>
            </View>
            <View
              style={{
                width: "50%",
                padding: 5,
              }}
            >
              <Text>+961 9 211 662</Text>
            </View>
          </View>

          <View
            style={{
              textAlign: "center",
              padding: 5,
              backgroundColor: "#059255",
              color: "white",
            }}
          >
            <Text>Email : request@swanassistance.com</Text>
          </View>
        </View>

        <Text>3) Freely provide all relevant information.</Text>
        <Text>
          4) Make "NO" admission of liability or offer promise or payment of any
          kind.
        </Text>
      </View>

      {/* AUTHORIZED */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
        }}
      >
        {/* QR */}
        <View>
          <Text style={{ fontSize: 10 }}>Confirmation Code</Text>
          <View style={{ width: 80, height: 80, border: "1" }}>
            <Image src={qrImage} />
          </View>
          <Text style={{ fontSize: 10, color: "gray", fontStyle: "italic" }}>
            For official use, scan the above code to validate this confirmation
            letter.
          </Text>
        </View>
        {/* Signature */}
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={{ fontSize: 10 }}>AUTHORIZED SIGNATORY AND STAMP</Text>
          <Image style={{ width: 80 }} source={signatureImage} />
        </View>
      </View>

      {/* Footer with page number */}
      <View style={styles.footer} fixed>
        <Text>BGIC/DZO/MISC/OMP-1250/05/2025</Text>
        <Text>Bangladesh General Insurance Company PLC.</Text>
        <Text
          style={{ fontWeight: "bold" }}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

export default OMPPdf;

const cellStyle = (width) => ({
  width,
  backgroundColor: "lightgray",
  paddingHorizontal: 3,
  paddingVertical: 4,
  border: "0.5px solid white",
});

// Utility
// function formatDestinationList(destinations) {
//   const countries = destinations.map((d) => d.country).filter(Boolean);

//   if (countries.length === 0) return "";
//   if (countries.length === 1) return countries[0];
//   if (countries.length === 2) return `${countries[0]} and ${countries[1]}`;

//   const allButLast = countries.slice(0, -1).join(", ");
//   const last = countries[countries.length - 1];
//   return `${allButLast} and ${last}`;
// }

function formaNumberToComma(num) {
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
