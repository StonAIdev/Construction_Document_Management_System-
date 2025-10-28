import React from "react";
import {
  PDFDownloadLink,
  Page,
  Text,
  Image,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },

  view: {
    border: "1px solid black",
    margin: "1px",
  },
  section: {
    // margin: 10,
    padding: 10,
    paddingBottom: "5px",
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageAndTextRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageAndTextCol1: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "30px",
    maxWidth: 130,
    alignItems: "center",
  },
  imageAndTextCol2: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "30px",
    maxWidth: 100,
    alignItems: "center",
  },
  imageAndTextCol3: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "30px",
    maxWidth: 80,
    alignItems: "center",
  },
  imageAndTextCol4: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "30px",
    maxWidth: 70,
    alignItems: "center",
  },
  imageAndTextCol5: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "30px",
    maxWidth: 64,
    alignItems: "center",
  },
  imageAndTextCol6: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: "30px",
    maxWidth: 60,
    alignItems: "center",
  },
  headin: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
    backgroundColor: "#d6d4d1",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: "5px",
  },
  baseText: {
    fontSize: 8,
    fontWeight: "light",
    marginVertical: "5px",
    marginLeft: "4px",
  },
  baseText1: {
    fontSize: 16,
    marginVertical: "5px",
    fontWeight: "light",
  },
  baseText2: {
    fontSize: 14,
    fontWeight: "light",
    marginVertical: "5px",
  },
  baseText3: {
    fontSize: 12,
    fontWeight: "light",
    marginVertical: "5px",
  },
  baseText4: {
    fontSize: 10,
    fontWeight: "light",
    marginVertical: "5px",
  },
  baseText5: {
    fontSize: 9,
    fontWeight: "light",
    marginVertical: "5px",
  },
  baseText6: {
    fontSize: 8,
    fontWeight: "light",
    marginVertical: "5px",
  },
  tinyLogoLength1: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  tinyLogoLength2: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  tinyLogoLength3: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  tinyLogoLength4: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  tinyLogoLength5: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  tinyLogoLength6: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  sectionmargin: {
    marginTop: "8px",
  },
});

const MethodStatementTemplate = ({ values }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.imageAndTextRow}>
          {values?.uploadHeaderLogo.length == 1 ? (
            <>
              <View style={styles.imageAndTextCol1}>
                <Image
                  style={styles.tinyLogoLength1}
                  source={{ uri: values?.uploadHeaderLogo[0].blob }}
                />
                <Text style={styles.baseText1}>
                  {values?.uploadHeaderLogo[0].header}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
          {values?.uploadHeaderLogo.length == 2 ? (
            <>
              <View style={styles.imageAndTextCol2}>
                <Image
                  style={styles.tinyLogoLength2}
                  source={{ uri: values?.uploadHeaderLogo[0].blob }}
                />
                <Text style={styles.baseText2}>
                  {values?.uploadHeaderLogo[0].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol2}>
                <Image
                  style={styles.tinyLogoLength2}
                  source={{ uri: values?.uploadHeaderLogo[1].blob }}
                />
                <Text style={styles.baseText2}>
                  {values?.uploadHeaderLogo[1].header}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
          {values?.uploadHeaderLogo.length == 3 ? (
            <>
              <View style={styles.imageAndTextCol3}>
                <Image
                  style={styles.tinyLogoLength3}
                  source={{ uri: values?.uploadHeaderLogo[0].blob }}
                />
                <Text style={styles.baseText3}>
                  {values?.uploadHeaderLogo[0].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol3}>
                <Image
                  style={styles.tinyLogoLength3}
                  source={{ uri: values?.uploadHeaderLogo[1].blob }}
                />
                <Text style={styles.baseText3}>
                  {values?.uploadHeaderLogo[1].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol3}>
                <Image
                  style={styles.tinyLogoLength3}
                  source={{ uri: values?.uploadHeaderLogo[2].blob }}
                />
                <Text style={styles.baseText3}>
                  {values?.uploadHeaderLogo[2].header}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
          {values?.uploadHeaderLogo.length == 4 ? (
            <>
              <View style={styles.imageAndTextCol4}>
                <Image
                  style={styles.tinyLogoLength4}
                  source={{ uri: values?.uploadHeaderLogo[0].blob }}
                />
                <Text style={styles.baseText4}>
                  {values?.uploadHeaderLogo[0].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol4}>
                <Image
                  style={styles.tinyLogoLength4}
                  source={{ uri: values?.uploadHeaderLogo[1].blob }}
                />
                <Text style={styles.baseText4}>
                  {values?.uploadHeaderLogo[1].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol4}>
                <Image
                  style={styles.tinyLogoLength4}
                  source={{ uri: values?.uploadHeaderLogo[2].blob }}
                />
                <Text style={styles.baseText4}>
                  {values?.uploadHeaderLogo[2].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol4}>
                <Image
                  style={styles.tinyLogoLength4}
                  source={{ uri: values?.uploadHeaderLogo[3].blob }}
                />
                <Text style={styles.baseText4}>
                  {values?.uploadHeaderLogo[3].header}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
          {values?.uploadHeaderLogo.length == 5 ? (
            <>
              <View style={styles.imageAndTextCol5}>
                <Image
                  style={styles.tinyLogoLength5}
                  source={{ uri: values?.uploadHeaderLogo[0].blob }}
                />
                <Text style={styles.baseText5}>
                  {values?.uploadHeaderLogo[0].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol5}>
                <Image
                  style={styles.tinyLogoLength5}
                  source={{ uri: values?.uploadHeaderLogo[1].blob }}
                />
                <Text style={styles.baseText5}>
                  {values?.uploadHeaderLogo[1].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol5}>
                <Image
                  style={styles.tinyLogoLength5}
                  source={{ uri: values?.uploadHeaderLogo[2].blob }}
                />
                <Text style={styles.baseText5}>
                  {values?.uploadHeaderLogo[2].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol5}>
                <Image
                  style={styles.tinyLogoLength5}
                  source={{ uri: values?.uploadHeaderLogo[3].blob }}
                />
                <Text style={styles.baseText5}>
                  {values?.uploadHeaderLogo[3].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol5}>
                <Image
                  style={styles.tinyLogoLength5}
                  source={{ uri: values?.uploadHeaderLogo[4].blob }}
                />
                <Text style={styles.baseText5}>
                  {values?.uploadHeaderLogo[4].header}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
          {values?.uploadHeaderLogo.length == 6 ? (
            <>
              <View style={styles.imageAndTextCol6}>
                <Image
                  style={styles.tinyLogoLength6}
                  source={{ uri: values?.uploadHeaderLogo[0].blob }}
                />
                <Text style={styles.baseText6}>
                  {values?.uploadHeaderLogo[0].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol6}>
                <Image
                  style={styles.tinyLogoLength6}
                  source={{ uri: values?.uploadHeaderLogo[1].blob }}
                />
                <Text style={styles.baseText6}>
                  {values?.uploadHeaderLogo[1].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol6}>
                <Image
                  style={styles.tinyLogoLength6}
                  source={{ uri: values?.uploadHeaderLogo[2].blob }}
                />
                <Text style={styles.baseText6}>
                  {values?.uploadHeaderLogo[2].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol6}>
                <Image
                  style={styles.tinyLogoLength6}
                  source={{ uri: values?.uploadHeaderLogo[3].blob }}
                />
                <Text style={styles.baseText6}>
                  {values?.uploadHeaderLogo[3].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol6}>
                <Image
                  style={styles.tinyLogoLength6}
                  source={{ uri: values?.uploadHeaderLogo[4].blob }}
                />
                <Text style={styles.baseText6}>
                  {values?.uploadHeaderLogo[4].header}
                </Text>
              </View>
              <View style={styles.imageAndTextCol6}>
                <Image
                  style={styles.tinyLogoLength6}
                  source={{ uri: values?.uploadHeaderLogo[5].blob }}
                />
                <Text style={styles.baseText6}>
                  {values?.uploadHeaderLogo[5].header}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>

        <View style={[styles.section, { marginTop: "-10px" }]}>
          <View style={styles.view}>
            <View style={{ alignItems: "center", margin: "5px" }}>
              <Text style={[styles.title, { marginBottom: "0px" }]}>
                METHOD STATEMENT SUBMITTAL
              </Text>
            </View>

            <View style={{ width: "100%" }}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: "13px", marginBlock: "0px" }}>
                  Project:{values?.project}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.view}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Submittal Title</Text>
              </View>
              <View style={[styles.view, { width: "45%" }]}>
                <Text style={styles.baseText}>{values?.SUBMITTAL_TITLE}</Text>
              </View>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "17%" },
                ]}
              >
                <Text style={styles.baseText}>Date:</Text>
              </View>
              <View style={[styles.view, { width: "17%" }]}>
                <Text style={styles.baseText}>{values?.Date}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Submittal Number</Text>
              </View>
              <View style={[styles.view, { width: "45%" }]}>
                <Text style={styles.baseText}>{values?.SUBMITTAL_NO}</Text>
              </View>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "17%" },
                ]}
              >
                <Text style={styles.baseText}>Revision:</Text>
              </View>
              <View style={[styles.view, { width: "17%" }]}>
                <Text style={styles.baseText}>1</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Discipline</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}>discipline</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Enclosure Risk Assessment</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}>Risk Assessment</Text>
              </View>
            </View>
          </View>

          <View wrap={false} style={[styles.view, styles.sectionmargin]}>
            <View style={{ flexDirection: "row", backgroundColor: "#ffff" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Doc. Reference</Text>
              </View>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "45%" },
                ]}
              >
                <Text style={styles.baseText}>Description</Text>
              </View>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "17%" },
                ]}
              >
                <Text style={styles.baseText}>Soft Copies</Text>
              </View>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "17%" },
                ]}
              >
                <Text style={styles.baseText}>Hard Copies</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
                            <View style={[styles.view, { width: "20%" }]}>
                                <Text style={styles.baseText}>{values?.ref}</Text>
                            </View>
                            <View style={[styles.view, { width: "45%" }]}>
                                <Text style={styles.baseText}>{values?.description}</Text>
                            </View>
                            <View style={[styles.view, { width: "17%" }]}>
                                <Text style={styles.baseText}>{values?.soft_copies}</Text>
                            </View>
                            <View style={[styles.view, { width: "17%" }]}>
                                <Text style={styles.baseText}>{values?.hard_copies}</Text>
                            </View>
                        </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Remarks</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                                <Text style={styles.baseText}>{values?.remarks}</Text>
                            </View>
            </View>
          </View>

          <View wrap={false} style={[styles.view, styles.sectionmargin]}>
            <View>
              <View style={[styles.center, styles.view]}>
                <Text style={styles.baseText}>Client</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Name</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>

              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Position</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Signature</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>

              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Date</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Comments</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>
          </View>

          <View wrap={false} style={[styles.view, styles.sectionmargin]}>
            <View>
              <View style={[styles.center, styles.view]}>
                <Text style={styles.baseText}>Contractor</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Name</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>

              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Position</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Signature</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>

              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Date</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Comments</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>
          </View>

          <View wrap={false} style={[styles.view, styles.sectionmargin]}>
            <View>
              <View style={[styles.center, styles.view]}>
                <Text style={styles.baseText}>Sub Contractor</Text>
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Name</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>

              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Position</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Signature</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>

              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Date</Text>
              </View>
              <View style={[styles.view, { width: "30%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Comments</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}> </Text>
              </View>
            </View>
          </View>

          <View
            wrap={false}
            style={[
              styles.view,
              styles.sectionmargin,
              { flexDirection: "column" },
            ]}
          >


            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Document Control</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}>{values?.doc_ctrl_comments}</Text>
              </View>
            </View>
          </View>

          <View
            wrap={false}
            style={[
              styles.view,
              styles.sectionmargin,
              { flexDirection: "row", width: "100%" },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={[
                  styles.view,
                  { backgroundColor: "#d6d4d1", width: "20%" },
                ]}
              >
                <Text style={styles.baseText}>Status</Text>
              </View>
              <View style={[styles.view, { width: "80%" }]}>
                <Text style={styles.baseText}>  </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
export default MethodStatementTemplate;
