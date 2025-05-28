import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";

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
    padding: 10,
  },

  // content
  content: {
    padding: 2,
    // flexGrow: 1,
  },
});

// Define your PDF document
const MyDocument = () => (
  <Document
    title="omp-document"
    author="Bangladesh General Insurance Company PLC."
  >
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header} fixed>
        <Image style={styles.headerImage} source={"src/assets/headerimg.jpg"} />
        <Text style={styles.headerText}>
          TRAVEL HEALTH INSURANCE CERTIFICATE
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Policy Info */}
        <View style={{ fontSize: 10, paddingTop: 5 }}>
          <Text style={{ textAlign: "center", marginBottom: 13 }}>
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
              BGIC/DZO/MISC/OMP-1250/05/2025
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>ISSUING DATE:</Text>{" "}
              19/05/2025
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
                  Poland, Turkey and Saudi Arabia
                </Text>
              </View>
              <View style={cellStyle("11%")}>
                <Text style={{ fontWeight: "bold" }}>10/07/2025</Text>
              </View>
              <View style={cellStyle("11%")}>
                <Text style={{ fontWeight: "bold" }}>06/08/2025</Text>
              </View>
              <View style={cellStyle("25%")}>
                <Text style={{ fontWeight: "bold" }}>Bangladesh</Text>
              </View>
              <View style={cellStyle("21%")}>
                <Text style={{ fontWeight: "bold" }}>+880 1671558822</Text>
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
                <Text style={{ fontWeight: "bold" }}>AMAYRA TARANNUM</Text>
              </View>
              <View style={cellStyle("22%")}>
                <Text style={{ fontWeight: "bold" }}>10/07/2025</Text>
              </View>
              <View style={cellStyle("25%")}>
                <Text style={{ fontWeight: "bold" }}>A08753703</Text>
              </View>
              {/* <View style={cellStyle("21%")}>
                <Text style={{ fontWeight: "bold" }}>+880 1671558822</Text>
              </View> */}
            </View>
          </View>
        </View>
      </View>

      {/* Footer with page number */}
      <View style={styles.footer} fixed>
        <Text
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      </View>
    </Page>
  </Document>
);

// Component to render download link
export default function OMPPdf() {
  return (
    <div>
      <PDFViewer width="100%" height="600" showToolbar>
        <MyDocument />
      </PDFViewer>

      <PDFDownloadLink
        document={<MyDocument />}
        fileName="omp-document.pdf"
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          textDecoration: "none",
          borderRadius: 4,
          display: "inline-block",
        }}
      >
        {({ loading }) => (loading ? "Loading..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
}

const cellStyle = (width) => ({
  width,
  backgroundColor: "lightgray",
  paddingHorizontal: 3,
  paddingVertical: 4,
  border: "0.5px solid white",
});
