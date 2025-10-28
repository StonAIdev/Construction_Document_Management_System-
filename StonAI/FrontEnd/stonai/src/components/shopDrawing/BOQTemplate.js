import {
    PDFDownloadLink,
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from "@react-pdf/renderer";
const styles = StyleSheet.create({
    
    page: {
            flexDirection: "row",
            backgroundColor: "#FFFFFF"
    },
    section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
    },
    row: {
            flexDirection: "row",
            justifyContent: "space-between"
    },
    headin: {
            flexDirection: "row",
            justifyContent: "space-between"
    },
    center: {
            alignItems: "center",
            backgroundColor: "#d6d4d1"
    },
    title: {
            fontSize: 14,
            fontWeight: "bold",
            marginBottom: "5px"
    },
    baseText: {
            fontSize: 8,
            fontWeight: "light",
            marginVertical: "5px",
            marginLeft: "4px"
    },
});
const BOQTemplate = ({ values }) => (
    <Document>
            <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                            <View style={styles.row}>
                                    <Text style={styles.baseText}>{values?.main_contractor}</Text>
                                    <Text style={styles.baseText}>{values?.client}</Text>
                                    <Text style={styles.baseText}>{values?.consultant}</Text>
                                    <Text style={styles.baseText}>{values?.subcontractor}</Text>
                            </View>
                            <View style={styles.row}>
                                    <Text style={styles.baseText}>Main Contractor</Text>
                                    <Text style={styles.baseText}>Client</Text>
                                    <Text style={styles.baseText}>Consultant</Text>
                                    <Text style={styles.baseText}>Subcontractor</Text>
                            </View>
                            <View style={styles.row}>
                                    <View style={styles.section}>

                                            <View style={styles.row}>
                                                    <Text style={styles.baseText}>Project:</Text>
                                                    <Text style={styles.baseText}>{values?.project}</Text>
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
                                            <Text style={styles.title}>BOQ SUBMITTAL:</Text>
                                    </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                    <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
                                            <Text style={styles.baseText}>SDS Reference</Text>
                                    </View>
                                    <View style={{ width: "50%" }}>
                                            <Text style={styles.baseText}>VEE-RIH-SDS-0001-Acronym-R0</Text>
                                    </View>
                                    <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
                                            <Text style={styles.baseText}>Date:</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                            <Text style={styles.baseText}>{values?.date.toString()}</Text>
                                    </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                    <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
                                            <Text style={styles.baseText}>SDS Title</Text>
                                    </View>
                                    <View style={{ width: "80%" }}>
                                            <Text style={styles.baseText}>{values?.sds_title}</Text>
                                    </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                    <View style={{ backgroundColor: "#d6d4d1", width: "20%" }}>
                                            <Text style={styles.baseText}>discipline</Text>
                                    </View>
                                    <View style={{ width: "50%", flexDirection: "row" }}>
                                            <Text style={styles.baseText}>Civil</Text>
                                            <Text style={styles.baseText}>Arch</Text>
                                            <Text style={styles.baseText}>Mech</Text>
                                            <Text style={styles.baseText}>Elec</Text>
                                            <Text style={styles.baseText}>MEQ</Text>
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
                                    <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.baseText}>userfills</Text>
                                    </View>
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
                                                    {values?.sub_contractor_name_and_position}
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
                                    <View style={{ width: "20%" }}>
                                            <Text style={styles.baseText}>
                                                    {values?.sub_contractor_date.toString()}
                                            </Text>
                                    </View>
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
                                                    {values?.contractor_name_and_position}
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
                                    <View style={{ width: "20%" }}>
                                            <Text style={styles.baseText}>
                                                    {values?.contractor_date.toString()}
                                            </Text>
                                    </View>
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
                                            <Text style={styles.baseText}>{values?.status}</Text>
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
                                                    {values?.contractor_name_and_position}
                                            </Text>
                                    </View>
                                    <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
                                            <Text style={styles.baseText}>Signature</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                            <Text style={styles.baseText}>
                                                    {values?.contractor_name_and_position}
                                            </Text>
                                    </View>
                                    <View style={{ backgroundColor: "#d6d4d1", width: "10%" }}>
                                            <Text style={styles.baseText}>Date</Text>
                                    </View>
                                    <View style={{ width: "20%" }}>
                                            <Text style={styles.baseText}>
                                                    {values?.contractor_date.toString()}
                                            </Text>
                                    </View>
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
export default BOQTemplate;
