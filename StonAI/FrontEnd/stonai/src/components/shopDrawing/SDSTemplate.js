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
  section: {
    margin: 10,
    padding: 10,
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
});

const SDSTemplate = ({ values }) => (
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
        <View style={styles.row}>
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.baseText}>Project:</Text>
              <Text style={styles.baseText}>{values?.projectName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.baseText}>Location:</Text>
              <Text style={styles.baseText}>{values?.location}</Text>
            </View>
          </View>
          <View style={styles.section}></View>
        </View>
        <View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>SHOP DRAWING SUBMITTAL:</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>SDS Reference</Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={styles.baseText}>{values?.SUBMITTAL_NO}</Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Date:</Text>
          </View>
          {values?.Date ? (
            <View style={{ width: "20%" }}>
              <Text style={styles.baseText}>{values?.Date.toString()}</Text>
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>SDS Title</Text>
          </View>
          <View style={{ width: "80%" }}>
            <Text style={styles.baseText}>{values?.SUBMITTAL_TITLE}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>discipline</Text>
          </View>
          <View style={{ width: "50%", flexDirection: "row" }}>
            <Text style={styles.baseText}>{values?.Discipline}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", backgroundColor: "#d6d4d1" }}>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>Drawing Number</Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={styles.baseText}>Description</Text>
          </View>
          <View style={{ width: "10%" }}>
            <Text style={styles.baseText}>Status</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>Remarks</Text>
          </View>
        </View>
        <View>
          {values?.drawing_list.length > 0 ? (
            values?.drawing_list.map((item) => {
              return (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "20%" }}>
                      <Text style={styles.baseText}>{item.drawing_number}</Text>
                    </View>
                    <View style={{ width: "50%" }}>
                      <Text style={styles.baseText}>{item.discription}</Text>
                    </View>
                    <View style={{ width: "10%" }}>
                      <Text style={styles.baseText}>{item.status}</Text>
                    </View>
                    <View style={{ width: "20%" }}>
                      <Text style={styles.baseText}>{item.remarks}</Text>
                    </View>
                  </View>
                </>
              );
            })
          ) : (
            <>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "20%" }}>
                  <Text style={styles.baseText}></Text>
                </View>
                <View style={{ width: "50%" }}>
                  <Text style={styles.baseText}></Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text style={styles.baseText}></Text>
                </View>
                <View style={{ width: "20%" }}>
                  <Text style={styles.baseText}></Text>
                </View>
              </View>
            </>
          )}
        </View>
        <View>
          <View style={styles.center}>
            <Text style={styles.baseText}>
              Authorized Sub Contractor Representative
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>Name/Position</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>
              {values?.sub_contractor_name}/ {values?.sub_contractor_position}
            </Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Signature</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>
              {values?.sub_contractor_signature}
            </Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Date</Text>
          </View>
          {values?.sub_contractor_date ? (
            <View style={{ width: "20%" }}>
              <Text style={styles.baseText}>
                {values?.sub_contractor_date.toString()}
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          <View style={styles.center}>
            <Text style={styles.baseText}>HDP Comments:</Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.baseText}>{values?.consultant_comments}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>Name/Position</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>
              {values?.contractor_name}/{values?.contractor_position}
            </Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Signature</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>{values?.contractor_signature}</Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Date</Text>
          </View>
          {values?.contractor_date ? (
            <View style={{ width: "20%" }}>
              <Text style={styles.baseText}>
                {values?.contractor_date.toString()}
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          <View style={styles.center}>
            <Text style={styles.baseText}>VAMED Comments</Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.baseText}>{values?.contractor_comments}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>Status</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>{values?.Status}</Text>
          </View>
          {/* <View style={{width:'20%'}}>

                    <Text style={styles.baseText}>B-Approved as noted</Text>
                    </View>                    
                    <View style={{width:'20%'}}>
                    <Text style={styles.baseText}>C-Revise & resubmit</Text>
                    </View>                   
                     <View style={{width:'20%'}}>
                    <Text style={styles.baseText}>D-Rejected</Text>
                    </View> */}
        </View>
        <View>
          <View style={styles.center}>
            <Text style={styles.baseText}>
              *The checking and approval by the Main Contractor/Engineer shall
              not relieve the Subcontractor from his obligations in accordance
              with the sub-contract agreement and documents.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
            <Text style={styles.baseText}>Name/Position</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>
              {values?.contractor_name}/{values?.contractor_position}
            </Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Signature</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={styles.baseText}>{values?.contractor_signature}</Text>
          </View>
          <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
            <Text style={styles.baseText}>Date</Text>
          </View>
          {values?.contractor_date ? (
            <View style={{ width: "20%" }}>
              <Text style={styles.baseText}>
                {values?.contractor_date.toString()}
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          <View style={styles.center}>
            <Text style={styles.baseText}>Document Control</Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.baseText}>{values?.doc_ctrl_comments}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
export default SDSTemplate;
