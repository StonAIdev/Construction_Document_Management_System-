import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import Checkbox from "@mui/material/Checkbox";

import Autocomplete from "@mui/material/Autocomplete";

import InputLabel from "@mui/material/InputLabel";
import {
  Divider,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  Tabs,
  Tab,
  FormControlLabel,
  AccordionDetails,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { url } from "../url";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSnackbar } from "notistack";
import {
  docRestrictionsEa,
  viewRestrictionsEa,
  actionRestrictionsEa,
  docRestrictionsPm,
  viewRestrictionsPm,
  actionRestrictionsPm,
  docRestrictionsDc,
  viewRestrictionsDc,
  actionRestrictionsDc,
  docRestrictionsHod,
  viewRestrictionsHod,
  actionRestrictionsHod,
  docRestrictionsE,
  viewRestrictionsE,
  actionRestrictionsE,
  rowForDb,
} from "../defaultPermissionsData";

const userRoles = [
  {
    label: "Enterprise Admin",
    value: "enterpriseAdmin",
  },
  {
    label: "Project Manager",
    value: "projectManager",
  },
  {
    label: "Document Controller",
    value: "documentController",
  },
  {
    label: "Head of Department",
    value: "hod",
  },
  {
    label: "Employee",
    value: "employee",
  },
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const AddUserToCurrentProject = ({ user, userInfo, permisions, project }) => {
  const [enterpiseUsers, setEnterpiseUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  var key12;

  const [docRestriction, setDocRestriction] = useState(docRestrictionsEa);
  const [viewRestriction, setViewRestriction] = useState(viewRestrictionsEa);
  const [actionRestriction, setActionRestriction] =
    useState(actionRestrictionsEa);
  const [userRole, setUserRole] = useState("");

  const [SpecDoc, setSpecificDoc] = useState({
    boxes: docRestrictionsEa.Contract.other,
    keys: "Contract",
  });
  const [SpecDocView, setSpecificDocView] = useState({
    boxes: viewRestrictionsEa.pageWorkSpace.other,
    keys: "pageDashboard",
  });
  const [SpecDocAction, setSpecificDocAction] = useState({
    boxes: actionRestrictionsEa.users.other,
    keys: "users",
  });

  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
    if (event.target.value === "enterpriseAdmin") {
      setDocRestriction(docRestrictionsEa);
      setViewRestriction(viewRestrictionsEa);
      setActionRestriction(actionRestrictionsEa);
    } else if (event.target.value === "projectManager") {
      setDocRestriction(docRestrictionsPm);
      setViewRestriction(viewRestrictionsPm);
      setActionRestriction(actionRestrictionsPm);
    } else if (event.target.value === "documentController") {
      setDocRestriction(docRestrictionsDc);
      setViewRestriction(viewRestrictionsDc);
      setActionRestriction(actionRestrictionsDc);
    } else if (event.target.value === "hod") {
      setDocRestriction(docRestrictionsHod);
      setViewRestriction(viewRestrictionsHod);
      setActionRestriction(actionRestrictionsHod);
    } else if (event.target.value === "employee") {
      setDocRestriction(docRestrictionsE);
      setViewRestriction(viewRestrictionsE);
      setActionRestriction(actionRestrictionsE);
    }
  };

  const myHandleChangeCheckBox = (event, key, key2, restrictionType) => {
    if (restrictionType === "docRestriction") {
      let specificDoc2 = docRestriction[key].other;
      let specdoc1 = {};
      specdoc1.boxes = specificDoc2;
      specdoc1.keys = key;

      setSpecificDoc({
        ...SpecDoc,
        boxes: {
          ...SpecDoc.boxes,
          [key2]: { ...SpecDoc.boxes[key2], value: event.target.checked },
        },
      });
      setDocRestriction({
        ...docRestriction,
        [key]: {
          ...docRestriction[key],
          other: {
            ...docRestriction[key].other,
            [key2]: {
              ...docRestriction[key].other[key2],
              value: event.target.checked,
            },
          },
        },
      });
    } else if (restrictionType === "viewRestriction") {
      let specificDoc2 = viewRestriction[key].other;
      let specdoc1 = {};
      specdoc1.boxes = specificDoc2;
      specdoc1.keys = key;

      setSpecificDocView({
        ...SpecDocView,
        boxes: {
          ...SpecDocView.boxes,
          [key2]: { ...SpecDocView.boxes[key2], value: event.target.checked },
        },
      });
      setViewRestriction({
        ...viewRestriction,
        [key]: {
          ...viewRestriction[key],
          other: {
            ...viewRestriction[key].other,
            [key2]: {
              ...viewRestriction[key].other[key2],
              value: event.target.checked,
            },
          },
        },
      });
    } else if (restrictionType === "actionRestriction") {
      let specificDoc2 = actionRestriction[key].other;
      // handleTabDetailsAction(specificDoc2, key);
      let specdoc1 = {};
      specdoc1.boxes = specificDoc2;
      specdoc1.keys = key;
      setSpecificDocAction({
        ...SpecDocAction,
        boxes: {
          ...SpecDocAction.boxes,
          [key2]: { ...SpecDocAction.boxes[key2], value: event.target.checked },
        },
      });
      setActionRestriction({
        ...actionRestriction,
        [key]: {
          ...actionRestriction[key],
          other: {
            ...actionRestriction[key].other,
            [key2]: {
              ...actionRestriction[key].other[key2],
              value: event.target.checked,
            },
          },
        },
      });
    }
  };

  function convertDataToRecordForDb(
    docRestriction,
    viewRestriction,
    actionRestriction
  ) {
    var rowForDb = {};
    try {
      rowForDb = {
        canViewContract: docRestriction.Contract.other.canView.value,
        canUpdateExtractedFeildsContract:
          docRestriction.Contract.other.canUpdateExtractedFeilds.value,
        canUpdateAliasesContract:
          docRestriction.Contract.other.canUpdateAliases.value,
        canDeleteDocumentContract:
          docRestriction.Contract.other.canDeleteDocument.value,
        canDownloadDocumentContract:
          docRestriction.Contract.other.canDownloadDocument.value,
        canShareDocumentThoughEmailContract:
          docRestriction.Contract.other.canShareDocumentThoughEmail.value,
        canShareDocumentThoughStonAiContract:
          docRestriction.Contract.other.canShareDocumentThoughStonAi.value,
        canExportDocumentInfoAsExcelFileContract:
          docRestriction.Contract.other.canExportDocumentInfoAsExcelFile.value,
        canExportExtractedDocumentFieldsAsExcelFileContract:
          docRestriction.Contract.other
            .canExportExtractedDocumentFieldsAsExcelFile.value,
        canViewresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other.canView.value,
        canUpdateExtractedFeildsresponsibilityMatrix:
          docRestriction.Contract.other.canUpdateExtractedFeilds.value,
        canUpdateAliasesresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other.canUpdateAliases.value,
        canDeleteDocumentresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other.canDeleteDocument.value,
        canDownloadDocumentresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other.canDownloadDocument.value,
        canShareDocumentThoughEmailresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other.canShareDocumentThoughEmail
            .value,
        canShareDocumentThoughStonAiresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other.canShareDocumentThoughStonAi
            .value,
        canExportDocumentInfoAsExcelFileresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other
            .canExportDocumentInfoAsExcelFile.value,
        canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix:
          docRestriction.responsibilityMatrix.other
            .canExportExtractedDocumentFieldsAsExcelFile.value,
        canViewmaterialSubmittal:
          docRestriction.materialSubmittal.other.canView.value,
        canUpdateExtractedFeildsmaterialSubmittal:
          docRestriction.materialSubmittal.other.canUpdateExtractedFeilds.value,
        canUpdateAliasesmaterialSubmittal:
          docRestriction.materialSubmittal.other.canUpdateAliases.value,
        canDeleteDocumentmaterialSubmittal:
          docRestriction.materialSubmittal.other.canDeleteDocument.value,
        canDownloadDocumentmaterialSubmittal:
          docRestriction.materialSubmittal.other.canDownloadDocument.value,
        canShareDocumentThoughEmailmaterialSubmittal:
          docRestriction.materialSubmittal.other.canShareDocumentThoughEmail
            .value,
        canShareDocumentThoughStonAimaterialSubmittal:
          docRestriction.materialSubmittal.other.canShareDocumentThoughStonAi
            .value,
        canExportDocumentInfoAsExcelFilematerialSubmittal:
          docRestriction.materialSubmittal.other
            .canExportDocumentInfoAsExcelFile.value,
        canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal:
          docRestriction.materialSubmittal.other
            .canExportExtractedDocumentFieldsAsExcelFile.value,
        canViewshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canView.value,
        canUpdateExtractedFeildsshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canUpdateExtractedFeilds
            .value,
        canUpdateAliasesshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canUpdateAliases.value,
        canDeleteDocumentshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canDeleteDocument.value,
        canDownloadDocumentshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canDownloadDocument.value,
        canShareDocumentThoughEmailshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canShareDocumentThoughEmail
            .value,
        canShareDocumentThoughStonAishopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other.canShareDocumentThoughStonAi
            .value,
        canExportDocumentInfoAsExcelFileshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other
            .canExportDocumentInfoAsExcelFile.value,
        canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal:
          docRestriction.shopDrawingSubmittal.other
            .canExportExtractedDocumentFieldsAsExcelFile.value,
        canViewletter: docRestriction.letter.other.canView.value,
        canUpdateExtractedFeildsletter:
          docRestriction.letter.other.canUpdateExtractedFeilds.value,
        canUpdateAliasesletter:
          docRestriction.letter.other.canUpdateAliases.value,
        canDeleteDocumentletter:
          docRestriction.letter.other.canDeleteDocument.value,
        canDownloadDocumentletter:
          docRestriction.letter.other.canDownloadDocument.value,
        canShareDocumentThoughEmailletter:
          docRestriction.letter.other.canShareDocumentThoughEmail.value,
        canShareDocumentThoughStonAiletter:
          docRestriction.letter.other.canShareDocumentThoughStonAi.value,
        canExportDocumentInfoAsExcelFileletter:
          docRestriction.letter.other.canExportDocumentInfoAsExcelFile.value,
        canExportExtractedDocumentFieldsAsExcelFileletter:
          docRestriction.letter.other
            .canExportExtractedDocumentFieldsAsExcelFile.value,
        canViewminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canView.value,
        canUpdateExtractedFeildsminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canUpdateExtractedFeilds.value,
        canUpdateAliasesminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canUpdateAliases.value,
        canDeleteDocumentminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canDeleteDocument.value,
        canDownloadDocumentminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canDownloadDocument.value,
        canShareDocumentThoughEmailminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canShareDocumentThoughEmail
            .value,
        canShareDocumentThoughStonAiminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canShareDocumentThoughStonAi
            .value,
        canExportDocumentInfoAsExcelFileminutesOfmeeting:
          docRestriction.minutesOfmeeting.other.canExportDocumentInfoAsExcelFile
            .value,
        canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting:
          docRestriction.minutesOfmeeting.other
            .canExportExtractedDocumentFieldsAsExcelFile.value,
        canViewpageDashboard: viewRestriction.pageDashboard.other.canView.value,
        canViewFilterspageDashboard:
          viewRestriction.pageDashboard.other.canViewFilters.value,
        canViewEnterpriseStatisticspageDashboard:
          viewRestriction.pageDashboard.other.canViewEnterpriseStatistics.value,
        canViewProjectStatisticspageDashboard:
          viewRestriction.pageDashboard.other.canViewProjectStatistics.value,
        canViewDepartmentStatisticspageDashboard:
          viewRestriction.pageDashboard.other.canViewDepartmentStatistics.value,
        canViewUserStatisticspageDashboard:
          viewRestriction.pageDashboard.other.canViewUserStatistics.value,
        canViewOrganisationalChartpageDashboard:
          viewRestriction.pageDashboard.other.canViewOrganisationalChart.value,
        canViewpageWorkSpace: viewRestriction.pageWorkSpace.other.canView.value,
        canViewMyTaskpageWorkSpace:
          viewRestriction.pageWorkSpace.other.canViewMyTask.value,
        canViewAssingedTaskpageWorkSpace:
          viewRestriction.pageWorkSpace.other.canViewAssingedTask.value,
        canFilterTaskpageWorkSpace:
          viewRestriction.pageWorkSpace.other.canFilterTask.value,
        canViewpageAISearch: viewRestriction.pageAISearch.other.canView.value,
        canViewpageMail: viewRestriction.pageMail.other.canView.value,
        canViewpageFolder: viewRestriction.pageFolder.other.canView.value,
        canViewFilterspageFolder:
          viewRestriction.pageFolder.other.canViewFilters.value,
        canViewDocViewerpageFolder:
          viewRestriction.pageFolder.other.canViewDocViewer.value,
        canViewpageAccount: viewRestriction.pageAccount.other.canView.value,
        canViewpageSetting: viewRestriction.pageSetting.other.canView.value,
        canViewpageAdmin: viewRestriction.pageAdmin.other.canView.value,
        canViewUserspageAdmin:
          viewRestriction.pageAdmin.other.canViewUsers.value,
        canViewProjectspageAdmin:
          viewRestriction.pageAdmin.other.canViewProjects.value,
        canViewDepartmentspageAdmin:
          viewRestriction.pageAdmin.other.canViewDepartments.value,
        canViewusers: actionRestriction.users.other.canView.value,
        canCreateUsersusers: actionRestriction.users.other.canCreateUsers.value,
        canDeleteUsersusers: actionRestriction.users.other.canDeleteUsers.value,
        canUpdateUsersDetailsusers:
          actionRestriction.users.other.canUpdateUsersDetails.value,
        canAddUsersToProjectusers:
          actionRestriction.users.other.canAddUsersToProject.value,
        canViewprojects: actionRestriction.projects.other.canView.value,
        canCreateProjectsprojects:
          actionRestriction.projects.other.canCreateProjects.value,
        canDeleteProjectsprojects:
          actionRestriction.projects.other.canDeleteProjects.value,
        canUpdateProjectsDetailsprojects:
          actionRestriction.projects.other.canUpdateProjectsDetails.value,
        canViewdepartments: actionRestriction.departments.other.canView.value,
        canCreateDepartmentsdepartments:
          actionRestriction.departments.other.canCreateDepartments.value,
        canDeleteDepartmentsdepartments:
          actionRestriction.departments.other.canDeleteDepartments.value,
        canUpdateDepartmentsdepartments:
          actionRestriction.departments.other.canUpdateDepartments.value,
        canViewworkSpace: actionRestriction.workSpace.other.canView.value,
        canCreateTaskworkSpace:
          actionRestriction.workSpace.other.canCreateTask.value,
        canEditTaskworkSpace:
          actionRestriction.workSpace.other.canEditTask.value,
        canDeleteTaskworkSpace:
          actionRestriction.workSpace.other.canDeleteTask.value,
        NotifyTaskThroughEmailworkSpace:
          actionRestriction.workSpace.other.NotifyTaskThroughEmail.value,
        NotifyTaskThroughStonAiworkSpace:
          actionRestriction.workSpace.other.NotifyTaskThroughStonAi.value,
        canAssignTasktoAnyoneInEnterpriseworkSpace:
          actionRestriction.workSpace.other.canAssignTasktoAnyoneInEnterprise
            .value,
        canAssingTasktoAnyoneInProjectworkSpace:
          actionRestriction.workSpace.other.canAssingTasktoAnyoneInProject
            .value,
        canAssingTasktoAnyoneIndepartmentworkSpace:
          actionRestriction.workSpace.other.canAssingTasktoAnyoneIndepartment
            .value,
        canViewdocument: actionRestriction.document.other.canView.value,
        canUplaodDocumentsdocument:
          actionRestriction.document.other.canUplaodDocuments.value,
        canBulkUploadDocumentsdocument:
          actionRestriction.document.other.canBulkUploadDocuments.value,
        canApplyForDocExtractiondocument:
          actionRestriction.document.other.canApplyForDocExtraction.value,
        canApplyDocClassificationsdocument:
          actionRestriction.document.other.canApplyDocClassifications.value,
      };
    } catch (error) {
      console.log("error", error);
    }

    return rowForDb;
  }

  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;

  const handleTabDetails = (specDoc, key) => {
    let specdoc1 = {};
    specdoc1.boxes = specDoc;
    specdoc1.keys = key;
    setSpecificDoc(specdoc1);
  };

  const handleTabDetailsView = (specDoc, key) => {
    let specdoc1 = {};
    specdoc1.boxes = specDoc;
    specdoc1.keys = key;
    setSpecificDocView(specdoc1);
  };

  const handleTabDetailsAction = (specDoc, key) => {
    let specdoc1 = {};
    specdoc1.boxes = specDoc;
    specdoc1.keys = key;
    setSpecificDocAction(specdoc1);
  };

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const getEnterpriseUsers = async () => {
    var res1 = [];
    var res2 = [];
    res1 = await axios.post(
      url + "/AddUsersToProject/getEnterpriseUsers",
      {
        enterprise_id: userInfo.enterprise_id,
      },
      {
        headers: { token: user.token },
      }
    );

    res2 = await axios.post(
      url + "/AddUsersToProject/getProjects",
      {
        project_id: project.project_id,
      },
      {
        headers: { token: user.token },
      }
    );

    const newArr = [];

    res1.data.forEach((element1, i) => {
      res2.data.forEach((element2) => {
        if (
          element2.project_id == project.project_id &&
          element2.user_id == element1.user_id
        ) {
          res1.data.splice(i, 1);
        }
      });
    });
    setEnterpiseUsers(res1.data);
  };

  const handleSubmit = async () => {
    const filteredValues = selectedUsers.map(
      ({ username, enterprise_id, ...keepAttrs }) => keepAttrs
    );

    var convertArrays = filteredValues.map(Object.values);
    convertArrays.forEach((element) => {
      element.push(project.project_id);
    });
    try {
      const rowForDb = convertDataToRecordForDb(
        docRestriction,
        viewRestriction,
        actionRestriction
      );
      var res = await axios.post(
        url + "/AddUsersToProject/addUsersToProject",
        {
          users_to_add: convertArrays,
          permissions: rowForDb,
          user_role: userRole,
          project_id: project.project_id,
          user_id: user.user_id,
        },
        {
          headers: { token: user.token },
        }
      );

      handleClickVariant("success", "User added sucessfully");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        getEnterpriseUsers();
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setEnterpiseUsers([]);
    }
  }, [open]);

  // useEffect(() => {
  //   getEnterpriseUsers();
  // }, [project]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [valueView, setValueView] = React.useState(0);

  const handleChangeView = (event, newValue) => {
    setValueView(newValue);
  };

  const [valueAction, setValueAction] = React.useState(0);

  const handleChangeAction = (event, newValue) => {
    setValueAction(newValue);
  };
  //These are the permision check boxes
  const acordians = (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ backgroundColor: "var(--green)" }}
        >
          <Typography style={{ fontWeight: "bolder", color: "white" }}>
            Document Restrictions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
              >
                {Object.keys(docRestriction).map((key, index) => {
                  const specificDoc2 = docRestriction[key].other;
                  key12 = key;

                  return (
                    <Tab
                      value={index}
                      label={docRestriction[key].name}
                      key={index}
                      onClick={() => {
                        handleTabDetails(specificDoc2, key);
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>

            <div style={{ padding: 10, margin: 10 }}>
              <Grid container>
                {SpecDoc?.boxes &&
                  Object.keys(SpecDoc.boxes).map((key2, index2) => {
                    return (
                      <Grid item md={4} xs={4} sm={4} lg={4}>
                        <FormControlLabel
                          sx={{ fontSize: "1px" }}
                          control={
                            <Checkbox
                              name={key2}
                              checked={SpecDoc.boxes[key2].value}
                              onChange={(e) =>
                                myHandleChangeCheckBox(
                                  e,
                                  SpecDoc.keys,
                                  key2,
                                  "docRestriction"
                                )
                              }
                              color="primary"
                            />
                          }
                          label={
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {SpecDoc.boxes[key2].name}
                            </Typography>
                          }
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </div>

            <div></div>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ backgroundColor: "var(--green)" }}
        >
          <Typography style={{ fontWeight: "bolder", color: "white" }}>
            View Restrictions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueView}
                onChange={handleChangeView}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
              >
                {Object.keys(viewRestriction).map((key, index) => {
                  const specificDoc2 = viewRestriction[key].other;
                  key12 = key;

                  return (
                    <Tab
                      value={index}
                      label={viewRestriction[key].name}
                      key={index}
                      onClick={() => {
                        handleTabDetailsView(specificDoc2, key);
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>

            <div style={{ padding: 10, margin: 10 }}>
              <Grid container>
                {SpecDocView?.boxes &&
                  Object.keys(SpecDocView.boxes).map((key2, index2) => {
                    return (
                      <Grid item md={4} xs={4} sm={4} lg={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={key2}
                              checked={SpecDocView.boxes[key2].value}
                              onChange={(e) =>
                                myHandleChangeCheckBox(
                                  e,
                                  SpecDocView.keys,
                                  key2,
                                  "viewRestriction"
                                )
                              }
                              color="primary"
                            />
                          }
                          label={
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {SpecDocView.boxes[key2].name}
                            </Typography>
                          }
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </div>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ backgroundColor: "var(--green)" }}
        >
          <Typography style={{ fontWeight: "bolder", color: "white" }}>
            Action Restrictions
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={valueAction}
                onChange={handleChangeAction}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                aria-label="scrollable force tabs example"
              >
                {" "}
                {Object.keys(actionRestriction).map((key, index) => {
                  const specificDoc2 = actionRestriction[key].other;
                  key12 = key;

                  return (
                    <Tab
                      label={actionRestriction[key].name}
                      key={index}
                      onClick={() => {
                        handleTabDetailsAction(specificDoc2, key);
                      }}
                    />
                  );
                })}
              </Tabs>
            </Box>

            <div style={{ padding: 10, margin: 10 }}>
              <Grid container>
                {SpecDocAction?.boxes &&
                  Object.keys(SpecDocAction.boxes).map((key2, index2) => {
                    return (
                      <Grid item md={4} xs={4} sm={4} lg={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={key2}
                              checked={SpecDocAction.boxes[key2].value}
                              onChange={(e) =>
                                myHandleChangeCheckBox(
                                  e,
                                  SpecDocAction.keys,
                                  key2,
                                  "actionRestriction"
                                )
                              }
                              color="primary"
                            />
                          }
                          label={
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: "bold" }}
                            >
                              {SpecDocAction.boxes[key2].name}
                            </Typography>
                          }
                        />
                      </Grid>
                    );
                  })}
              </Grid>
            </div>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
  var view;
  if (userRole !== "") {
    view = acordians;
  } else {
    view = <></>;
  }

  const [tabValue, setTabValue] = React.useState("1");

  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Helmet>
        <title>Add User to Project | StonAi</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="sm" className="CreateUserCantainer">
          <Grid container spacing={1}>
            <Grid item xs={11}>
              <Typography
                color="textPrimary"
                variant="h2"
                style={{ color: "var(--darkblue)", fontWeight: "bold" }}
              >
                Add User to Project
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton component={Link} to="/app/adminDashboard">
                <ArrowBackIcon></ArrowBackIcon>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider fullWidth sx={{ backgroundColor: "black" }}></Divider>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 20 }} color="text.secondary">
                    Add users of your enterprise to your current project
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="tags-standard"
                    onChange={(e, option) => {
                      setSelectedUsers(option);
                    }}
                    open={open}
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    options={enterpiseUsers}
                    loading={loading}
                    getOptionLabel={(option) => option.username}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          // style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.username}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Users"
                        placeholder="Users"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={12} sx={{ marginTop: 5 }}>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label" size="small">
                      Role
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={userRole}
                      label="Document Category"
                      onChange={handleRoleChange}
                    >
                      {userRoles.map((role, i) => {
                        return (
                          <MenuItem value={role.value} key={i}>
                            {role.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  {view}
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ py: 2 }}>
                    <Button
                      color="primary"
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={
                        selectedUsers && selectedUsers.length > 0 ? false : true
                      }
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AddUserToCurrentProject;
