import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import headerImage from "../../assets/pdfheaderimg2.jpg";
import moment from "moment";
import {
  convertAmountToWords,
  formatNumberToComma,
} from "../../utility/utilityFunctions";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingTop: 90,
    paddingBottom: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },

  // Header Image
  header: {
    position: "absolute",
    top: 25,
    left: 50,
    right: 50,
  },
  headerImage: {
    width: "100%",
    height: "auto",
  },

  // Contact Text Under Header
  headerText: {
    textAlign: "center",
    fontSize: 9,
    marginBottom: 10,
    marginTop: 8,
    lineHeight: 1.4,
  },

  // Content
  content: {
    padding: 2,
  },

  section2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 16,
  },
  section2_leftBlock: {
    width: "60%",
  },
  section2_rightBlock: {
    width: "35%",
    alignItems: "flex-end",
  },
  labelValue: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: "32%",
  },
  value: {
    width: "50%",
  },

  section3: {
    width: "100%",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  rowLabel: {
    marginRight: 20,
    paddingBottom: 2,
  },
  rowContent: {
    borderBottom: 0.5,
    paddingBottom: 2,
    flexGrow: 1,
  },
  boldText: {
    fontWeight: "bold",
  },

  table: {
    width: "auto",
    display: "table",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    borderStyle: "solid",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  tableCell1: {
    width: "43%",
  },
  tableCell2: {
    width: "14%",
    textAlign: "center",
  },
  tableCell3: {
    width: "43%",
    textAlign: "right",
  },

  qrSection: {
    width: "50%",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  qrImage: {
    width: 120,
    height: 120,
  },

  // Footer
  footer: {
    // position: "absolute",
    // bottom: 100,
    // left: 30,
    // right: 30,
    // paddingVertical: 8,
    // paddingHorizontal: 20,
    marginTop: 50,
    justifyContent: "space-between",
    textAlign: "center",
    fontSize: 10,
    width: "100%",
  },
  shadedBox: {
    backgroundColor: "lightgray",
    padding: 5,
    marginVertical: 3,
  },
  noteText: {
    color: "gray",
    textAlign: "left",
    fontSize: 9,
  },
});

const MRPdf = ({ qrImage, data }) => (
  <Document
    title={`Money Receipt ${data.mrNo}`}
    author="Bangladesh General Insurance Company PLC."
  >
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header} fixed>
        <Image style={styles.headerImage} source={headerImage} />
      </View>

      {/* Contact Info + Title */}
      <View style={styles.headerText}>
        <Text>Head Office: 42, Dilkusha C/A, Motijheel, Dhaka</Text>
        <Text>
          Phone: 02223383056-8, 02223351090-1 &nbsp;&nbsp; Fax: 02223384212
        </Text>
        <Text>
          Email: info@bgicinsure.com &nbsp;&nbsp; Web: www.bgicinsure.com
        </Text>
        <Text style={{ marginTop: 10, textAlign: "left" }}>
          BIN: 000001322-0202
        </Text>
        <Text style={{ fontSize: 12, marginTop: 8 }}>MONEY RECEIPT</Text>
        <Text style={{ marginTop: 3 }}>MUSHAK: 6.3</Text>
      </View>

      {/* Body Content */}
      <View style={styles.content}>
        {/* Section 2 - Header Details */}
        <View style={styles.section2}>
          <View style={styles.section2_leftBlock}>
            <View style={styles.labelValue}>
              <Text style={styles.label}>Issuing Office</Text>
              <Text style={styles.value}>: {data.mrOffice}</Text>
            </View>
            <View style={styles.labelValue}>
              <Text style={styles.label}>Money Receipt No</Text>
              <Text style={styles.value}>: {data.mrNo}</Text>
            </View>
            <View style={styles.labelValue}>
              <Text style={styles.label}>Class of Insurance</Text>
              <Text style={styles.value}>: {data.mrClass}</Text>
            </View>
          </View>
          <View style={styles.section2_rightBlock}>
            <Text>Date: {moment(data.mrDate).format("DD-MM-YYYY")}</Text>
          </View>
        </View>

        {/* Section 3 - Payment Info */}
        <View style={styles.section3}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, styles.boldText]}>
              Received with thanks from
            </Text>
            <Text
              style={{
                ...styles.rowContent,
                borderBottom: 0,
                width: "100%",
                marginLeft: 30,
              }}
            >
              {data.receivedFrom}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>The sum of</Text>
            <Text style={styles.rowContent}>
              Tk. {formatNumberToComma(data.total)} (
              {convertAmountToWords(data.total)} taka)
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Mode of Payment</Text>
            <Text style={[styles.rowContent, { width: "80%" }]}>
              {data.mop}; {data.chequeNo}
            </Text>
            <Text style={{ marginLeft: 8, marginRight: 10 }}>Dated</Text>
            <Text style={{ borderBottom: 0.5, paddingBottom: 2, width: "15%" }}>
              {moment(data.chequeDate).format("DD-MM-YYYY")}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Drawn on</Text>
            <Text style={styles.rowContent}>{data.bank}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Issued against</Text>
            <Text style={styles.rowContent}>{data.policyNo}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          {/* Premium */}
          <View style={{ width: "50%" }}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableCell1]}>
                  Premium
                </Text>
                <Text style={[styles.tableCell, styles.tableCell2]}>BDT</Text>
                <Text style={[styles.tableCell, styles.tableCell3]}>
                  {formatNumberToComma(data.premium)}
                </Text>
              </View>
              {data.mrClassCode === "MC" && (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCell1]}>
                    Stamp
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCell2]}>BDT</Text>
                  <Text style={[styles.tableCell, styles.tableCell3]}>
                    {formatNumberToComma(data.stamp)}
                  </Text>
                </View>
              )}
              {data.coins === "Co-Ins" && (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCell1]}>
                    CoIns(Net)
                  </Text>
                  <Text style={[styles.tableCell, styles.tableCell2]}>BDT</Text>
                  <Text style={[styles.tableCell, styles.tableCell3]}>
                    {formatNumberToComma(data.coinsnet)}
                  </Text>
                </View>
              )}
              {data.mrClassCode === "MISC/OMP" && (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.tableCell1]}>VAT</Text>
                  <Text style={[styles.tableCell, styles.tableCell2]}>BDT</Text>
                  <Text style={[styles.tableCell, styles.tableCell3]}>
                    {formatNumberToComma(data.vat)}
                  </Text>
                </View>
              )}

              <View
                style={{ ...styles.tableRow, backgroundColor: "lightgray" }}
              >
                <Text style={[styles.tableCell, styles.tableCell1]}>Total</Text>
                <Text style={[styles.tableCell, styles.tableCell2]}>BDT</Text>
                <Text style={[styles.tableCell, styles.tableCell3]}>
                  {formatNumberToComma(data.total)}
                </Text>
              </View>
            </View>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <View>
              <Image style={styles.qrImage} source={{ uri: qrImage }} />
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.boldText}>
          This RECEIPT is computer generated, authorized signature is not
          required.
        </Text>
        <Text style={styles.shadedBox}>
          Receipt valid subject to encashment of cheque/P.O./D.D.
        </Text>
        <Text style={styles.noteText}>
          * Note: If have any complain about Insurance, call 16130.
        </Text>
      </View>
    </Page>
  </Document>
);

export default MRPdf;
