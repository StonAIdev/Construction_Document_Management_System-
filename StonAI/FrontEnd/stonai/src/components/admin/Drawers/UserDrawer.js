import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconButton,
  Drawer,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container,
  Accordion,
  AccordionSummary,
  Checkbox,
  Tabs,
  FormControlLabel,
  Tab,
  AccordionDetails,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ChevronRight";
import { url } from "../../../url";

import {
  docRestrictionsEa,
  viewRestrictionsEa,
  actionRestrictionsEa,
  convertDataToRecordForDb,
  permissionsObjectOfNonSubsForFalseView,
  permissionsObjectOfSubsForFalseView,
} from "../../../defaultPermissionsData";
import { useSnackbar } from "notistack";

const drawerWidth = 600;

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

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

const UserDrawer = ({
  open,
  setOpen,
  refresh,
  setRefresh,
  user_role,
  user,
  permisions,
  user_id,
  project,
  defaultPermisions,
  department,
}) => {
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { enqueueSnackbar } = useSnackbar();

  const [docRestriction, setDocRestriction] = useState(docRestrictionsEa);
  const [viewRestriction, setViewRestriction] = useState(viewRestrictionsEa);
  const [actionRestriction, setActionRestriction] =
    useState(actionRestrictionsEa);

  const [userRole, setUserRole] = useState(user_role);

  useEffect(() => {
    setDefaultPermissionsToStates(user_role);
  }, [open]);

  function setDefaultPermissionsToStates(role) {
    if (role === "enterpriseAdmin") {
      setDocRestriction(defaultPermisions.current.docRestrictionsEa);
      setViewRestriction(defaultPermisions.current.viewRestrictionsEa);
      setActionRestriction(defaultPermisions.current.actionRestrictionsEa);
      setSpecificDoc({
        boxes: defaultPermisions.current.docRestrictionsEa.Contract.other,
        keys: "Contract",
      });
      setSpecificDocView({
        boxes: defaultPermisions.current.viewRestrictionsEa.pageWorkSpace.other,
        keys: "pageWorkSpace",
      });
      setSpecificDocAction({
        boxes: defaultPermisions.current.actionRestrictionsEa.users.other,
        keys: "users",
      });
    } else if (role === "projectManager") {
      setDocRestriction(defaultPermisions.current.docRestrictionsPm);
      setViewRestriction(defaultPermisions.current.viewRestrictionsPm);
      setActionRestriction(defaultPermisions.current.actionRestrictionsPm);
      setSpecificDoc({
        boxes: defaultPermisions.current.docRestrictionsPm.Contract.other,
        keys: "Contract",
      });
      setSpecificDocView({
        boxes: defaultPermisions.current.viewRestrictionsPm.pageWorkSpace.other,
        keys: "pageWorkSpace",
      });
      setSpecificDocAction({
        boxes: defaultPermisions.current.actionRestrictionsPm.users.other,
        keys: "users",
      });
    } else if (role === "documentController") {
      setDocRestriction(defaultPermisions.current.docRestrictionsDc);
      setViewRestriction(defaultPermisions.current.viewRestrictionsDc);
      setActionRestriction(defaultPermisions.current.actionRestrictionsDc);
      setSpecificDoc({
        boxes: defaultPermisions.current.docRestrictionsDc.Contract.other,
        keys: "Contract",
      });
      setSpecificDocView({
        boxes: defaultPermisions.current.viewRestrictionsDc.pageWorkSpace.other,
        keys: "pageWorkSpace",
      });
      setSpecificDocAction({
        boxes: defaultPermisions.current.actionRestrictionsDc.users.other,
        keys: "users",
      });
    } else if (role === "hod") {
      setDocRestriction(defaultPermisions.current.docRestrictionsHod);
      setViewRestriction(defaultPermisions.current.viewRestrictionsHod);
      setActionRestriction(defaultPermisions.current.actionRestrictionsHod);
      setSpecificDoc({
        boxes: defaultPermisions.current.docRestrictionsHod.Contract.other,
        keys: "Contract",
      });
      setSpecificDocView({
        boxes:
          defaultPermisions.current.viewRestrictionsHod.pageWorkSpace.other,
        keys: "pageWorkSpace",
      });
      setSpecificDocAction({
        boxes: defaultPermisions.current.actionRestrictionsHod.users.other,
        keys: "users",
      });
    } else if (role === "employee") {
      setDocRestriction(defaultPermisions.current.docRestrictionsE);
      setViewRestriction(defaultPermisions.current.viewRestrictionsE);
      setActionRestriction(defaultPermisions.current.actionRestrictionsE);
      setSpecificDoc({
        boxes: defaultPermisions.current.docRestrictionsE.Contract.other,
        keys: "Contract",
      });
      setSpecificDocView({
        boxes: defaultPermisions.current.viewRestrictionsE.pageWorkSpace.other,
        keys: "pageWorkSpace",
      });
      setSpecificDocAction({
        boxes: defaultPermisions.current.actionRestrictionsE.users.other,
        keys: "users",
      });
    }
  }
  function checkIfNonSubmittal(docType) {
    if (docType === "Contract") {
      return true;
    } else if (docType === "responsibilityMatrix") {
      return true;
    } else if (docType === "tender") {
      return true;
    } else if (docType === "bucket") {
      return true;
    } else if (docType === "minutesOfmeeting") {
      return true;
    } else if (docType === "boq") {
      return true;
    } else {
      return false;
    }
  }
  const myHandleChangeCheckBox = (event, key, key2, restrictionType) => {
    if (restrictionType === "docRestriction") {
      let specificDoc2 = docRestriction[key].other;
      let specdoc1 = {};
      specdoc1.boxes = specificDoc2;
      specdoc1.keys = key;
      if (event.target.checked === false && key2 === "canView") {
        if (checkIfNonSubmittal(key)) {
          setSpecificDoc({
            ...SpecDoc,
            boxes: permissionsObjectOfNonSubsForFalseView,
          });
        } else {
          setSpecificDoc({
            ...SpecDoc,
            boxes: permissionsObjectOfSubsForFalseView,
          });
        }
      } else {
        setSpecificDoc({
          ...SpecDoc,
          boxes: {
            ...SpecDoc.boxes,
            [key2]: { ...SpecDoc.boxes[key2], value: event.target.checked },
          },
        });
      }

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
    const disabledPermissions = {
      aup_office_disabled: false,
    };
  };

  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
    setValueAction(0);
    setValue(0);
    setValueView(0);
    setDefaultPermissionsToStates(event.target.value);
  };

  const [SpecDoc, setSpecificDoc] = useState({
    boxes: docRestrictionsEa.Contract.other,
    keys: "Contract",
  });
  const [SpecDocView, setSpecificDocView] = useState({
    boxes: viewRestrictionsEa.pageWorkSpace.other,
    keys: "pageWorkSpace",
  });
  const [SpecDocAction, setSpecificDocAction] = useState({
    boxes: actionRestrictionsEa.users.other,
    keys: "users",
  });

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

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
  var key12;

  const acordians = (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ backgroundColor: "var(--darkblue)" }}
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
                              disabled={
                                !(
                                  SpecDoc.boxes.canView.value ||
                                  key2 === "canView"
                                )
                              }
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
          style={{ backgroundColor: "var(--darkblue)" }}
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
          style={{ backgroundColor: "var(--darkblue)" }}
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

  const handleSubmit = async () => {
    try {
      const rowForDb = convertDataToRecordForDb(
        docRestriction,
        viewRestriction,
        actionRestriction
      );

      const response = await axios.post(
        url + "/userInfo/updateUserPermissions",
        {
          permissions: rowForDb,
          user_role: userRole,
          permission_id: permisions.permissions_id,
          user_id: user_id,
          project_id: project.project_id,
          department_id: department.department_id,
        },
        {
          headers: { token: user.token },
        }
      );
      setRefresh(!refresh);
      handleClickVariant("success", "User updated sucessfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Typography variant="h3" align="center">
        Edit User
      </Typography>
      <Divider />
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          marginTop: 10,
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                  // disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  onClick={handleSubmit}
                  variant="contained"
                  style={{
                    backgroundColor: "var(--darkblue)",
                    fontWeight: "bold",
                  }}
                >
                  UPDATE USER
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Drawer>
  );
};

export default UserDrawer;
