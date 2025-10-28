import { Box, Container, Grid, IconButton } from "@material-ui/core";
import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { url } from "../../url";

import MenuIcon from "@mui/icons-material/Menu";

import CoverPageTab from "./CoverPageTabFolder/CoverPageTab";
import RecentDocTab from "./RecentDocTabFolder/RecentDocTab";

import PDFView from "./Viewer/PDFView";
import Aliases from "../Folders/Aliases/Aliases";

import { convertRawTextToHighlight } from "./../ConvertToHighlights";
import { Tabs, Tab } from "@mui/material";

import { getAllowedDelayedForProject } from "./DocumentList/DelayedDays";
import SaveNotClickeddynamic from "./SaveNotClickeddynamic";
import { TreeContext } from "../../context/TreeContext";

const tree = [];

const subObj = {
  name: "Submittals",
  update: false,
  share: true,
  delete: true,
  download: true,
  exportFile: true,
  move: true,
  children: [],
};
const inteligentSearchObj = {
  name: "Intelligent Search",
  update: false,
  share: true,
  delete: true,
  download: true,
  exportFile: true,
  move: true,
  children: [],
};

const dynamicTree = (permision) => {
  // ------------------ Engineering Department ------------------------

  if (permision.canviewshopdrawingsubmittal) {
    subObj.children.push({
      name: "Shop Drawing Submittals",
      update: permision.canupdateextractedfeildsshopdrawingsubmittal,
      share: permision.cansharedocumentthoughemailshopdrawingsubmittal,
      delete: permision.candeletedocumentshopdrawingsubmittal,
      download: permision.candownloaddocumentshopdrawingsubmittal,
      exportFile:
        permision.canexportdocumentinfoasexcelfileshopdrawingsubmittal,
      department: "Engineering Department",
      children: [],
    });
  }
  if (permision.canviewmaterialsubmittal) {
    subObj.children.push({
      name: "Material Submittals",
      update: permision.canupdateextractedfeildsmaterialsubmittal,
      share: permision.cansharedocumentthoughemailmaterialsubmittal,
      delete: permision.candeletedocumentmaterialsubmittal,
      download: permision.candownloaddocumentmaterialsubmittal,
      exportFile: permision.canexportdocumentinfoasexcelfilematerialsubmittal,
      department: "Engineering Department",
      children: [],
    });
  }
  if (permision.canviewprequalificationsubmittal) {
    subObj.children.push({
      name: "Prequalification Submittal",
      update: permision.canupdateextractedfeildsprequalificationsubmittal,
      share: permision.cansharedocumentthoughemailprequalificationsubmittal,
      delete: permision.candeletedocumentprequalificationsubmittal,
      download: permision.candownloaddocumentprequalificationsubmittal,
      exportFile:
        permision.canexportdocumentinfoasexcelfileprequalificationsubmittal,
      department: "Engineering Department",
      children: [],
    });
  }
  if (permision.canviewtechnicalsubmittal) {
    subObj.children.push({
      name: "Technical Submittal",
      update: permision.canupdateextractedfeildstechnicalsubmittal,
      share: permision.cansharedocumentthoughemailtechnicalsubmittal,
      delete: permision.candeletedocumenttechnicalsubmittal,
      download: permision.candownloaddocumenttechnicalsubmittal,
      exportFile: permision.canexportdocumentinfoasexcelfiletechnicalsubmittal,
      department: "Engineering Department",
      children: [],
    });
  }
  if (permision.canviewmethodstatementsubmittal) {
    subObj.children.push({
      name: "Method Statement Submittal",
      update: permision.canupdateextractedfeildsmethodstatementsubmittal,
      share: permision.cansharedocumentthoughemailmethodstatementsubmittal,
      delete: permision.candeletedocumentmethodstatementsubmittal,
      download: permision.candownloaddocumentmethodstatementsubmittal,
      exportFile:
        permision.canexportdocumentinfoasexcelfilemethodstatementsubmittal,
      department: "Engineering Department",
      children: [],
    });
  }
  if (permision.canviewrequestforinformation) {
    subObj.children.push({
      name: "Request for Information",
      update: permision.canupdateextractedfeildsrequestforinformation,
      share: permision.cansharedocumentthoughemailrequestforinformation,
      delete: permision.candeletedocumentrequestforinformation,
      download: permision.candownloaddocumentrequestforinformation,
      exportFile:
        permision.canexportdocumentinfoasexcelfilerequestforinformation,
      department: "Engineering Department",
      children: [],
    });
  }
  if (permision.canviewmaterialinspectionrequest) {
    subObj.children.push({
      name: "Meterial Inspection Request",
      update: permision.canupdateextractedfeildsmaterialinspectionrequest,
      share: permision.cansharedocumentthoughemailmaterialinspectionrequest,
      delete: permision.candeletedocumentmaterialinspectionrequest,
      download: permision.candownloaddocumentmaterialinspectionrequest,
      exportFile:
        permision.canexportdocumentinfoasexcelfilematerialinspectionrequest,
      department: "Construction Department",
      children: [],
    });
  }
  if (permision.canviewworkinspectionrequest) {
    subObj.children.push({
      name: "Work Inspection Request",
      update: permision.canupdateextractedfeildsworkinspectionrequest,
      share: permision.cansharedocumentthoughemailworkinspectionrequest,
      delete: permision.candeletedocumentworkinspectionrequest,
      download: permision.candownloaddocumentworkinspectionrequest,
      exportFile:
        permision.canexportdocumentinfoasexcelfileworkinspectionrequest,
      department: "Construction Department",
      children: [],
    });
  }
  if (permision.canviewarchitecturalinspectionrequest) {
    subObj.children.push({
      name: "Architectural Inspection Request",
      update: permision.canupdateextractedfeildsarchitecturalinspectionrequest,
      share:
        permision.cansharedocumentthoughemailarchitecturalinspectionrequest,
      delete: permision.candeletedocumentarchitecturalinspectionrequest,
      download: permision.candownloaddocumentarchitecturalinspectionrequest,
      exportFile:
        permision.canexportdocumentinfoasexcelfilearchitecturalinspectionrequest,
      department: "Construction Department",
      children: [],
    });
  }
  if (permision.canviewnonconformancereport) {
    subObj.children.push({
      name: "Non Conformance Report",
      update: permision.canupdateextractedfeildsnonconformancereport,
      share: permision.cansharedocumentthoughemailnonconformancereport,
      delete: permision.candeletedocumentnonconformancereport,
      download: permision.candownloaddocumentnonconformancereport,
      exportFile:
        permision.canexportdocumentinfoasexcelfilenonconformancereport,
      department: "Quality Control Department",
      children: [],
    });
  }
  if (permision.canviewsiteinstruction) {
    subObj.children.push({
      name: "Site Instruction",
      update: permision.canupdateextractedfeildssiteinstruction,
      share: permision.cansharedocumentthoughemailsiteinstruction,
      delete: permision.candeletedocumentsiteinstruction,
      download: permision.candownloaddocumentsiteinstruction,
      exportFile: permision.canexportdocumentinfoasexcelfilesiteinstruction,
      department: "Quality Control Department",
      children: [],
    });
  }

  tree.push(subObj);

  if (permision.canviewresponsibilitymatrix) {
    inteligentSearchObj.children.push({
      name: "Responsibility Matrix",
      update: permision.canupdatealiasesresponsibilitymatrix,
      share: permision.cansharedocumentthoughemailresponsibilitymatrix,
      delete: permision.candeletedocumentresponsibilitymatrix,
      download: permision.candownloaddocumentresponsibilitymatrix,
      exportFile: true,
      children: [],
    });
  }
  if (permision.canviewtender) {
    inteligentSearchObj.children.push({
      name: "Tender Addendums",
      update: permision.canupdateextractedfeildstender,
      share: permision.cansharedocumentthoughemailtender,
      delete: permision.candeletedocumenttender,
      download: permision.candownloaddocumenttender,
      exportFile: true,
      children: [],
    });
  }
  if (permision.canviewcontract) {
    inteligentSearchObj.children.push(
      {
        name: "Text Contract",
        update: true,
        share: permision.cansharedocumentthoughemailcontract,
        delete: permision.candeletedocumentcontract,
        download: permision.candownloaddocumentcontract,
        exportFile: true,
        children: [],
      },

      {
        name: "Scanned Contract",
        update: true,
        share: permision.cansharedocumentthoughemailcontract,
        delete: permision.candeletedocumentcontract,
        download: permision.candownloaddocumentcontract,
        exportFile: true,
        children: [],
      }
    );
  }

  if (permision.canviewboq) {
    inteligentSearchObj.children.push({
      name: "BOQ",
      update: permision.canupdateextractedfeildsboq,
      share: permision.cansharedocumentthoughemailboq,
      delete: permision.candeletedocumentboq,
      download: permision.candownloaddocumentboq,
      exportFile: true,
      children: [],
    });
  }
  if (permision.canviewminutesofmeeting) {
    inteligentSearchObj.children.push({
      name: "MOM",
      update: permision.canupdateextractedfeildsminutesofmeeting,
      share: permision.cansharedocumentthoughemailminutesofmeeting,
      delete: permision.candeletedocumentminutesofmeeting,
      download: permision.candownloaddocumentminutesofmeeting,
      exportFile: true,
      children: [],
    });
  }

  inteligentSearchObj.children.push({
    name: "Other",
    update: true,
    share: true,
    delete: true,
    download: true,
    exportFile: true,
    children: [],
  });

  tree.push(inteligentSearchObj);
};

export default function Folders({
  handleClickNotify,
  socket,
  user,
  userInfo,
  project,
  currentComp,
  setCurrentComp,
  check,
  setCheck,
  pca,
  extractedFeilds,
  setExtractedFeilds,
  docUrl,
  setDocUrl,
  showViewer,
  setShowViewer,
  tabValue,
  setTabValue,
  userPosition,
  permisions,
  category,
  setCategory,
  department,
}) {
  const backHistory = useRef({
    currentComp: "",
    children: [],
  });
  const navHistory = useRef([]);

  const [contractor, setContractor] = useState("");
  const [children, setChildren] = React.useState([]);
  const [mainclicked, setmainclicked] = useState(false);
  // const [currentComp, setCurrentComp] = React.useState("");
  const [isChildren, setIsChildren] = React.useState(false);
  const [saveClicked, setSaveClicked] = React.useState(false);
  const [filters, setFilters] = React.useState();
  const [saveToggle, setSaveToggle] = React.useState(true);
  const [allowedDuration, setAllowedDuration] = React.useState({
    architectural_inspection_request: null,
    material_submittal: null,
    meterial_inspection_request: null,
    method_statement_submittal: null,
    non_conformance_report: null,
    prequalification_submittal: null,
    request_for_information: null,
    shop_drawing_submital: null,
    site_instruction: null,
    technical_submittal: null,
    work_inspection_request: null,
  });
  const [sharePerm, setSharePerm] = useState();
  const [deletePerm, setDeletePerm] = useState();
  const [movePerm, setMovePerm] = useState();
  const [updatePerm, setUpdatePerm] = useState();
  const [downloadPerm, setDownloadPerm] = useState();
  const [exportPerm, setExportPerm] = useState();
  const [treeHeight, settreeHeight] = useState(0);
  const [treedynamic, settreeDynamic] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  // const [check, setCheck] = useState(false);
  const { treeContext, setTreeContext } = useContext(TreeContext);
  const [open, setOpen] = React.useState(true);
  const tableRef = useRef();
  useEffect(() => {
    getUserRole();
    settreeDynamic(tree);
  }, [treeHeight, backHistory, children]);
  useEffect(() => {
    users.splice(
      users.findIndex((e) => e === user.username),
      1
    );
  }, [extractedFeilds, docUrl, check]);

  const getUserRole = async () => {
    try {
      const response = await axios.post(
        url + "/Userinfo/getUserRole",
        { userInfo },
        {
          headers: { token: user.token },
        }
      );
      if (
        response.data[0].user_role === "enterpriseAdmin" ||
        response.data[0].user_role === "projectAdmin"
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const getDynamicTree = async () => {
    try {
      const res = await axios.post(
        url + "/folder/dynamictree",
        {
          project_id: project.project_id,
          component: currentComp,
        },
        {
          headers: { token: user.token },
        }
      );

      res.data.forEach((element) => {
        tree.push(element);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getSubmittalFolders = async () => {
    try {
      const responseData = await axios.post(
        url + "/folder/getNewSubmittalFolders",

        {
          project_id: project.project_id,
          component: currentComp,
        },
        {
          headers: { token: user.token },
        }
      );

      const pushNodesToObj = (nodes, parentObj, type) => {
        nodes.forEach((node) => {
          if (!node.processed) {
            if (type === "submittals") {
              parentObj.children.push(node);
            } else if (type === "intelligentSearch") {
              parentObj.children.push(node);
            } else if (type === "bucket") {
              parentObj.children.push(node);
            }
            node.processed = true;
          }
        });
      };

      pushNodesToObj(responseData.data.submittaldynamic, subObj, "submittals");
      pushNodesToObj(
        responseData.data.intelligentdynamic,
        inteligentSearchObj,
        "intelligentSearch"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const asyncApis = async () => {
    setAllowedDuration(
      await getAllowedDelayedForProject(project.project_id, user)
    );

    dynamicTree(permisions);
    await getDynamicTree();
    await getSubmittalFolders();
  };

  useEffect(() => {
    if (tree.length <= 0) {
      asyncApis();

      // setTreeContext(tree);
    }
  }, [tree]);

  const users = [
    { user_id: 4, username: "Saad@gmail.com" },
    { user_id: 5, username: "Waqar@gmail.com" },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const HandleExtractedFeilds = async (value) => {
    try {
      const response = await axios.post(
        url + "/Document/getExtractedFeilds",
        value,
        {
          headers: { token: user.token },
        }
      );
      const temp = response.data._source;
      const objj = { ...temp, document_id: value.document_id };
      if (objj.unMapped_field) {
        var convertedRawTextHighlight = await convertRawTextToHighlight(
          objj?.unMapped_field?.Raw_Text,

          objj?.page_height,

          objj?.page_width
        );

        objj.unMapped_field.Raw_Text = convertedRawTextHighlight;
      } else {
        // objj.unMapped_field.Raw_Text = {};
        console.log("obj is undefined");
      }
      setExtractedFeilds(objj);
      console.log("is updating?", objj);
    } catch (error) {
      console.log("Error in Extracted Feilds", error.response);
      return error.response;
    }
  };
  const handleClickPreviewDoc = (value) => {
    HandleExtractedFeilds(value);
    setDocUrl(value?.urls);
    setShowViewer(true);
    setTabValue("three");
  };

  const handleSelectComponentMain = (
    name,
    children,
    update,
    download,
    exportFile,
    share,
    remove,
    move
  ) => {
    backHistory.current = {
      currentComp: name,
      children: children,
    };
    settreeHeight((prev) => prev + 1);
    navHistory.current.push({
      currentComp: name,
      children: children,
      height: treeHeight + 1,
    });

    setCurrentComp(name);
    setmainclicked(true);
    setChildren(children);

    setCategory(name);
    setUpdatePerm(update);
    setDownloadPerm(download);
    setExportPerm(exportFile);
    setSharePerm(share);
    setDeletePerm(remove);
    setMovePerm(move);
  };
  const handleSelectComponentChildren = (
    name,
    children,
    update,
    download,
    exportFile,
    share,
    remove,
    move
  ) => {
    backHistory.current = {
      currentComp: name,
      children: children,
    };
    settreeHeight((prev) => prev + 1);
    navHistory.current.push({
      currentComp: name,
      children: children,
      height: treeHeight + 1,
    });

    setCurrentComp(name);
    setChildren(children);
    setUpdatePerm(update);
    setDownloadPerm(download);
    setExportPerm(exportFile);
    setSharePerm(share);
    setDeletePerm(remove);
    setMovePerm(move);

    setIsChildren(true);
    setCategory(name);

    // clearAllExceptCategoryHandler();
  };
  const handleSelectComponentChildren1 = (
    name,
    children,
    update,
    download,
    exportFile,
    share,
    remove,
    move
  ) => {
    backHistory.current = {
      currentComp: name,
      children: children,
    };
    navHistory.current.push({
      currentComp: name,
      children: children,
    });

    setCurrentComp(name);
    setChildren(children);
    setUpdatePerm(update);
    setDownloadPerm(download);
    setExportPerm(exportFile);
    setSharePerm(share);
    setDeletePerm(remove);
    setMovePerm(move);
    settreeHeight((prev) => prev + 1);

    setIsChildren(true);
    setCategory(name);
  };
  const handleSelectComponentInAndOutChildren = (
    name,
    update,
    download,
    exportFile,
    share,
    remove,
    move
  ) => {
    backHistory.current = {
      currentComp: name,
      children: children,
    };
    settreeHeight((prev) => prev + 1);
    navHistory.current.push({
      currentComp: name,
      children: children,
      height: treeHeight,
    });
    setCurrentComp(name);
    setChildren(children);
    setUpdatePerm(update);
    setDownloadPerm(download);
    setExportPerm(exportFile);
    setSharePerm(share);
    setDeletePerm(remove);
    setMovePerm(move);

    setIsChildren(true);
    clearAllExceptCategoryHandler();
  };
  const clearAllExceptCategoryHandler = () => {
    setSaveClicked(false);
  };
  const clearAllHandler = () => {
    if (!isChildren) {
      setCategory(null);
    }

    setSaveClicked(false);
  };

  var viewOnSaveClick;

  viewOnSaveClick = (
    <SaveNotClickeddynamic
      project={project}
      handleSelectComponentInAndOutChildren={
        handleSelectComponentInAndOutChildren
      }
      handleClickPreviewDoc={handleClickPreviewDoc}
      filters={filters}
      setFilters={setFilters}
      user={user}
      saveClicked={saveClicked}
      clearAllHandler={clearAllHandler}
      saveToggle={saveToggle}
      children={children}
      category={category}
      setCategory={setCategory}
      contractor={contractor}
      setContractor={setContractor}
      setChildren={setChildren}
      isChildren={isChildren}
      setIsChildren={setIsChildren}
      tree={tree}
      handleSelectComponentMain={handleSelectComponentMain}
      handleSelectComponentChildren={handleSelectComponentChildren}
      handleSelectComponentChildren1={handleSelectComponentChildren1}
      currentComp={currentComp}
      setCurrentComp={setCurrentComp}
      check={check}
      socket={socket}
      users={users}
      pca={pca}
      isFilterSearch={false}
      update={updatePerm}
      remove={deletePerm}
      share={sharePerm}
      move={movePerm}
      download={downloadPerm}
      exportFile={exportPerm}
      userInfo={userInfo}
      backHistory={backHistory}
      navHistory={navHistory}
      department={department}
      allowedDuration={allowedDuration}
      mainclicked={mainclicked}
      setmainclicked={setmainclicked}
      treeHeight={treeHeight}
      settreeHeight={settreeHeight}
      asyncApis={asyncApis}
      isAdmin={isAdmin}
    />
  );

  const renderSwitch = (param) => {
    switch (param) {
      case "one":
        return (
          <Grid container className="">
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
              className="=' w-100 "
            ></Grid>

            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              {viewOnSaveClick}
            </Grid>
          </Grid>
        );
      case "two":
        return (
          <RecentDocTab
            user={user}
            project={project}
            users={users}
            pca={pca}
            socket={socket}
            handleClickPreviewDoc={handleClickPreviewDoc}
            userPosition={userPosition}
            check={check}
          ></RecentDocTab>
        );
      case "three":
        return (
          <PDFView
            user={user}
            userInfo={userInfo}
            project={project}
            docUrl={docUrl}
            extractedFeilds={extractedFeilds}
            setExtractedFeilds={setExtractedFeilds}
            handleDrawerClose={handleDrawerClose}
            open={open}
            update={updatePerm}
            permisions={permisions}
          ></PDFView>
        );
      case "four":
        return (
          <Aliases
            user={user}
            userInfo={userInfo}
            project={project}
            permisions={permisions}
          ></Aliases>
        );
      case "five":
        return (
          <CoverPageTab
            user={user}
            project={project}
            users={users}
            pca={pca}
            socket={socket}
            handleClickPreviewDoc={handleClickPreviewDoc}
            userPosition={userPosition}
            check={check}
          ></CoverPageTab>
        );
      default:
        return (
          <Grid container>
            <Grid item lg={12} md={12} xl={12} xs={12}></Grid>

            <Grid item lg sm xl xs></Grid>
            <Grid item lg sm xl xs></Grid>

            <Grid item xs={12} md={12} sx={{ mt: 2 }}>
              {viewOnSaveClick}
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
          marginBottom: "3rem",
        }}
      >
        <Grid container direction="column" rowSpacing={2}>
          <Grid container item>
            <Grid item md={12}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="secondary tabs example"
              >
                <Tab value="one" label="Project Documents" />
                <Tab value="two" label="Upload Status" />
                <Tab value="three" label="Document View" />

                <Tab value="five" label="Issued Submittals" />
              </Tabs>
            </Grid>
            <Grid
              item
              md={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "50px",
              }}
            >
              {tabValue == "three" && (
                <div
                  className="w-100 d-flex flex-row justify-content-end"
                  style={{ marginBottom: "-20px" }}
                >
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerOpen}
                    sx={{
                      ...(open && {
                        display: "none",
                      }),
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid item>
            {tabValue === "three" ? (
              renderSwitch(tabValue)
            ) : (
              <Container className="" maxWidth={false}>
                {renderSwitch(tabValue)}
              </Container>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
