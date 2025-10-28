import React, { useEffect, useState } from "react";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import CssBaseline from "@mui/material/CssBaseline";

import IconButton from "@mui/material/IconButton";

import Highlighter from "./Highlighter";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ShopDrawingSubmitals from "./DocumentExtraction/ShopDrawingSubmitals";

import Contracts from "./DocumentExtraction/Contracts";
import Heading1 from "../../../Reusable Components/Headings/Heading1";

import axios from "axios";
import { url } from "../../../url";

const drawerWidth = 600;
var PDF_DOC_SCALE = 1;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

// const handlePDFZoomIn = () => {
//   PDF_DOC_SCALE += 0.25;
//   if (PDF_DOC_SCALE > 10) PDF_DOC_SCALE = 10;

//   this.setState((prevState) => ({
//     ...prevState,
//     zoomLevel: PDF_DOC_SCALE,
//   }));
// };
// const handlePDFZoomOut = () => {
//   PDF_DOC_SCALE -= 0.25;
//   if (PDF_DOC_SCALE == 0) PDF_DOC_SCALE = 0.25;

//   this.setState((prevState) => ({
//     ...prevState,
//     zoomLevel: PDF_DOC_SCALE,
//   }));
// };
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const PDFView = ({
  docUrl,
  extractedFeilds,
  setExtractedFeilds,
  handleDrawerClose,
  open,
  user,
  userInfo,
  project,
  update,
}) => {
  const theme = useTheme();

  const tellESDocIsRead = async (extractedFeilds) => {
    try {
      const response = await axios.post(
        url + "/folder/readDocument",
        { document_id: extractedFeilds?.document_id },
        {
          headers: { token: user.token },
        }
      );
      return response.data[0];
    } catch (error) {
      console.log("Error", error);
    }
  };
  const readDocument = (extractedFeilds) => {
    tellESDocIsRead(extractedFeilds);
  };
  useEffect(() => {
    console.log("extractedFeilds", extractedFeilds);

    readDocument(extractedFeilds);
  }, [extractedFeilds]);

  console.log("typee", extractedFeilds?.document_category);
  const DocSwitchView = (update) => {
    if (
      extractedFeilds?.document_category === "Text Contract" ||
      extractedFeilds?.document_category === "Scanned Contract"
    ) {
      return (
        <Contracts
          extractedFeilds={extractedFeilds}
          user={user}
          userInfo={userInfo}
          update={update}
          project={project}
        />
      );
    } else
      return (
        <ShopDrawingSubmitals
          extractedFeilds={extractedFeilds}
          setExtractedFeilds={setExtractedFeilds}
          user={user}
          userInfo={userInfo}
          project={project}
          update={update}
        />
      );
    // if (extractedFeilds?.document_category === "shop_drawing_submittal") {
    //   return (
    // <ShopDrawingSubmitals
    //   extractedFeilds={extractedFeilds}
    //   setExtractedFeilds={setExtractedFeilds}
    //   user={user}
    //   userInfo={userInfo}
    //   project={project}
    //   update={update}
    // />
    //   );
    // } else if (extractedFeilds?.document_category === "material_submittal") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (extractedFeilds?.document_category === "Site Instruction") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (extractedFeilds?.document_category === "Technical Submittal") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Method Statement Submittal"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Non Conformance Report"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Prequalification Submittal"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Request for Information"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Work Inspection Request"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Meterial Inspection Request"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Architectural Inspection Request"
    // ) {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (
    //   extractedFeilds?.document_category === "Text Contract" ||
    //   extractedFeilds?.document_category === "Scanned Contract"
    // ) {
    //   return (
    //     <Contracts
    //       extractedFeilds={extractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       update={update}
    //       project={project}
    //     />
    //   );
    // } else if (extractedFeilds?.document_category === "responsibility_matrix") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (extractedFeilds?.document_category === "tender_addendums") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (extractedFeilds?.document_category === "BOQ") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else if (extractedFeilds?.document_category === "MOM") {
    //   return (
    //     <ShopDrawingSubmitals
    //       extractedFeilds={extractedFeilds}
    //       setExtractedFeilds={setExtractedFeilds}
    //       user={user}
    //       userInfo={userInfo}
    //       project={project}
    //       update={update}
    //     />
    //   );
    // } else {
    //   return <OtherDocs />;
    // }
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Main open={open} sx={{ zIndex: "2" }}>
          {typeof extractedFeilds?.unMapped_field?.Raw_Text !== "undefined" ? (
            <Highlighter
              docUrl={docUrl}
              highlights={extractedFeilds?.unMapped_field?.Raw_Text}
              isAiSearch={false}
            />
          ) : (
            // <PdfLoader url={docUrl} beforeLoad={<Spinner />}>
            //   {(pdfDocument) => <PdfHighlighter pdfDocument={pdfDocument} />}
            // </PdfLoader>

            // </div>
            <iframe
              title="document display"
              src={docUrl}
              width="100%"
              style={{ height: "80vh" }}
            ></iframe>
          )}
          {/* <iframe title="document display" src={docUrl} width="100%" style={{ height: "80vh" }}></iframe> */}
        </Main>
        <Drawer
          className=""
          sx={{
            width: { md: 420, lg: 425, xl: 600 },
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: { md: 420, lg: 450, xl: 600 },
              boxShadow: "-3px 0px 15px 0px rgb(0 0 0 / 31%)",
            },
          }}
          variant="persistent"
          hideBackdrop="True"
          anchor="right"
          open={open}
        >
          <div className="p-3 DrawerFlex docextractionDrawer">
            <div className="w-100 mr-3">
              <DrawerHeader
                className="d-flex justify-content-center"
                style={{ marginBottom: "-10px" }}
              >
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>

                {extractedFeilds?.document_category ===
                "responsibility_matrix" ? (
                  <Heading1
                    color="var(--darkblue)"
                    paddingBlock=".4rem"
                    size="4vh"
                    weight="500"
                    JFcontent="left"
                    className="m-0"
                  >
                    Responsibility Matrix
                  </Heading1>
                ) : extractedFeilds?.document_category ===
                  "tender_addendums" ? (
                  <Heading1
                    color="var(--darkblue)"
                    paddingBlock=".4rem"
                    size="4vh"
                    weight="500"
                    JFcontent="left"
                    className="m-0"
                  >
                    Tender Addendums
                  </Heading1>
                ) : extractedFeilds?.document_category === "BOQ" ? (
                  <Heading1
                    color="var(--darkblue)"
                    paddingBlock=".4rem"
                    size="4vh"
                    weight="500"
                    JFcontent="left"
                    className="m-0"
                  >
                    BOQ Extraction
                  </Heading1>
                ) : extractedFeilds?.document_category === "MOM" ? (
                  <Heading1
                    color="var(--darkblue)"
                    paddingBlock=".4rem"
                    size="4vh"
                    weight="500"
                    JFcontent="left"
                    className="m-0"
                  >
                    MOM Extraction
                  </Heading1>
                ) : extractedFeilds?.document_category === "Text Contract" ||
                  extractedFeilds?.document_category === "Scanned Contract" ? (
                  <Heading1
                    color="var(--darkblue)"
                    paddingBlock=".4rem"
                    size="4vh"
                    weight="500"
                    JFcontent="left"
                    className="m-0"
                  >
                    Contract Extraction
                  </Heading1>
                ) : extractedFeilds?.document_category ===
                    "shop_drawing_submittal" ||
                  extractedFeilds?.document_category === "material_submittal" ||
                  extractedFeilds?.document_category === "Site Instruction" ||
                  extractedFeilds?.document_category ===
                    "Technical Submittal" ||
                  extractedFeilds?.document_category ===
                    "Method Statement Submittal" ||
                  extractedFeilds?.document_category ===
                    "Non Conformance Report" ||
                  extractedFeilds?.document_category ===
                    "Prequalification Submittal" ||
                  extractedFeilds?.document_category ===
                    "Request for Information" ||
                  extractedFeilds?.document_category ===
                    "Work Inspection Request" ||
                  extractedFeilds?.document_category ===
                    "Meterial Inspection Request" ||
                  extractedFeilds?.document_category ===
                    "Architectural Inspection Request" ||
                  extractedFeilds?.document_category !== null ||
                  extractedFeilds?.document_category !== undefined ? (
                  <Heading1
                    color="var(--darkblue)"
                    paddingBlock=".4rem"
                    size="22px"
                    weight="500"
                    JFcontent="left"
                    className="m-0"
                  >
                    Document Extraction
                  </Heading1>
                ) : null}
              </DrawerHeader>

              <div style={{ paddingInline: "5px" }}>
                {extractedFeilds?.document_category ===
                  "shop_drawing_submittal" ||
                extractedFeilds?.document_category === "material_submittal" ||
                extractedFeilds?.document_category === "Site Instruction" ||
                extractedFeilds?.document_category === "Technical Submittal" ||
                extractedFeilds?.document_category ===
                  "Method Statement Submittal" ||
                extractedFeilds?.document_category ===
                  "Non Conformance Report" ||
                extractedFeilds?.document_category ===
                  "Prequalification Submittal" ||
                extractedFeilds?.document_category ===
                  "Request for Information" ||
                extractedFeilds?.document_category ===
                  "Work Inspection Request" ||
                extractedFeilds?.document_category ===
                  "Meterial Inspection Request" ||
                extractedFeilds?.document_category ===
                  "Architectural Inspection Request" ||
                extractedFeilds !== null ||
                extractedFeilds !== undefined
                  ? DocSwitchView(update)
                  : console.log("")}
              </div>
            </div>

            <div className="sideline"></div>
          </div>
        </Drawer>
      </Box>
    </>
  );
};
export default PDFView;
