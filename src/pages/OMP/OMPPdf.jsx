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
        <View style={{ fontSize: 11, paddingTop: 5 }}>
          <Text style={{ textAlign: "center" }}>
            Plan B : Zone 2 Worldwide Excluding USA, CANADA
          </Text>

          {/* POLICY NUMBER */}
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 15,
              paddingBottom: 5,
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
          <View
            style={{
              paddingTop: 15,
              flex: 1,
              flexDirection: "row",
              gap: 5, // Optional for spacing
            }}
          >
            <View style={{ width: "20%", backgroundColor: "gray", padding: 5 }}>
              <Text>DESTINATION</Text>
            </View>
            <View style={{ width: "15%", backgroundColor: "gray", padding: 5 }}>
              <Text>FROM</Text>
            </View>
            <View
              style={{ width: "15%", backgroundColor: "lightgray", padding: 5 }}
            >
              <Text>TO</Text>
            </View>
            <View
              style={{ width: "25%", backgroundColor: "lightgray", padding: 5 }}
            >
              <Text>COUNTRY OF RESIDENCE</Text>
            </View>
            <View
              style={{ width: "25%", backgroundColor: "lightgray", padding: 5 }}
            >
              <Text>TELEPHONE NUMBER</Text>
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
