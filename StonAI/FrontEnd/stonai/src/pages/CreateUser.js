import {
  Box,
  Grid,
  Container,
  Button,
  TextField,
  Typography,
  Divider,
  Tabs,
  FormGroup,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { url } from "../url";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import InputAdornment from "@mui/material/InputAdornment";
import generatePassword from "password-generator";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControlLabel from "@mui/material/FormControlLabel";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

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
  convertDataToRecordForDb,
  rowForDb,
} from "../defaultPermissionsData";
import "../components/admin/Admin.css";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useSnackbar } from "notistack";
import AddUserToCurrentProject from "./AddUserToCurrentProject";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
//import 'react-phone-input-2/lib/style.css'
import "react-phone-input-2/lib/material.css";
//import 'react-phone-input-2/lib/bootstrap.css'
import PhoneInput from "react-phone-input-2";

import AddUserStepper from "./AddUserStepper";
import { AlignCenter } from "react-feather";

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
const props = {
  values: {
    tab_office: true,
    d_office: true,
    office_disabled: false,
  },
};
const disabledPermissions = {
  aup_office_disabled: false,
};
const steps = ["Add User Details", "Add User Permissions"];

const CreateUser = ({ user, userInfo, setUserInfo, project, permisions }) => {
  console.log("userrrr", user);
  var key12;
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [valueForDb, setValueForDb] = useState("");
  const [phone, setPhone] = useState("");

  ////// Stepper States
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  ///// Stepper Functions
  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };
  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };
  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const totalSteps = () => {
    return steps.length;
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  console.log("user", user);
  const [docRestriction, setDocRestriction] = useState(docRestrictionsEa);
  const [viewRestriction, setViewRestriction] = useState(viewRestrictionsEa);
  const [actionRestriction, setActionRestriction] =
    useState(actionRestrictionsEa);
  const [showPassword, setShowPassword] = useState(false);
  const [user_password, setUser_password] = useState("");
  const [userRole, setUserRole] = useState("");
  console.log("docRestrictionsEa", docRestrictionsEa);

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

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
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handelegeneratePassword = () => {
    setUser_password(generatePassword());
  };
  const handleChangePassword = (event) => {
    setUser_password(event.target.value);
  };

  const myHandleChangeCheckBox = (event, key, key2, restrictionType) => {
    console.log("sadasdas", event.target.checked, key, key2, restrictionType);
    if (restrictionType === "docRestriction") {
      let specificDoc2 = docRestriction[key].other;
      let specdoc1 = {};
      specdoc1.boxes = specificDoc2;
      specdoc1.keys = key;
      // [specDoc].map((s) => console.log("pdkaspda", s));
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
      // [specDoc].map((s) => console.log("pdkaspda", s));
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
      // [specDoc].map((s) => console.log("pdkaspda", s));
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
    console.log("event.target.checked", event.target.checked);
    console.log("key2", key2);
    console.log("docRestriction", docRestriction);
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

  useEffect(() => {
    console.log("docRestriction", docRestriction);
  }, [docRestriction]);

  const handleTabDetails = (specDoc, key) => {
    let specdoc1 = {};
    specdoc1.boxes = specDoc;
    specdoc1.keys = key;
    // [specDoc].map((s) => console.log("pdkaspda", s));
    setSpecificDoc(specdoc1);
    console.log("dasdas", specdoc1);
  };

  const handleTabDetailsView = (specDoc, key) => {
    let specdoc1 = {};
    specdoc1.boxes = specDoc;
    specdoc1.keys = key;
    // [specDoc].map((s) => console.log("pdkaspda", s));
    setSpecificDocView(specdoc1);
    console.log("dasdas", specdoc1);
  };

  const handleTabDetailsAction = (specDoc, key) => {
    let specdoc1 = {};
    specdoc1.boxes = specDoc;
    specdoc1.keys = key;
    // [specDoc].map((s) => console.log("pdkaspda", s));
    setSpecificDocAction(specdoc1);
    console.log("dasdas", specdoc1);
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
                  console.log("key", key);
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
                      <Grid item md={4} xs={4} sm={4} lg={4} key={index2}>
                        <FormControlLabel
                          sx={{ fontSize: "1px" }}
                          control={
                            <Checkbox
                              name={key2}
                              checked={SpecDoc.boxes[key2].value}
                              disabled={
                                !props.values.tab_office ||
                                props.values.office_disabled ||
                                disabledPermissions.aup_office_disabled
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
                  console.log("key", key);
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
                      <Grid item md={4} xs={4} sm={4} lg={4} key={index2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={key2}
                              checked={SpecDocView.boxes[key2].value}
                              disabled={
                                !props.values.tab_office ||
                                props.values.office_disabled ||
                                disabledPermissions.aup_office_disabled
                              }
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
                  console.log("key", key);
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
                      <Grid item md={4} xs={4} sm={4} lg={4} key={index2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={key2}
                              checked={SpecDocAction.boxes[key2].value}
                              disabled={
                                !props.values.tab_office ||
                                props.values.office_disabled ||
                                disabledPermissions.aup_office_disabled
                              }
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
  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res1 = await axios.post(
          url + "/Department/getProjectDepartmentsWhileCreatingUser",
          {
            project_id: project.project_id,
          },
          {
            headers: { token: user.token },
          }
        );
        console.log("deppp", res1);
        setOptions([...res1.data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const [tabValue, setTabValue] = React.useState(
    permisions.cancreateusersusers ? "1" : "2"
  );

  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  const NewUserValidationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(4, "Length should be greater than 3")
      .required("Required"),
    lastName: Yup.string()
      .min(4, "Length should be greater than 3")
      .required("Required"),
    email_address: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string()
      .matches(
        "^[a-z]{4,}$",
        "Username should be in small letters and length greater than 3"
      )
      // .min(4, 'Length should be greater than 3')
      // .matches("^[a-z]$", 'Username should be in small letters')
      .required("Required"),
  });

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChangeTabs}
              aria-label="lab API tabs example"
              centered
              TabIndicatorProps={{
                style: { background: "var(--green)", color: "var(--green)" },
              }}
            >
              {permisions.cancreateusersusers ? (
                <Tab
                  label={
                    <span style={{ color: "var(--green)" }}>Add New User</span>
                  }
                  value="1"
                />
              ) : null}

              {permisions.canadduserstoprojectusers ? (
                <Tab
                  label={
                    <span style={{ color: "var(--green)" }}>
                      Add User To Current Project
                    </span>
                  }
                  value="2"
                />
              ) : null}
            </TabList>
          </Box>
          <TabPanel value="1">
            <Container
              maxWidth="md"
              className="CreateUserCantainer"
              sx={{ padding: 1 }}
            >
              <Formik
                initialValues={{
                  username: "",
                  email_address: "",
                  user_role: "",
                  firstName: "",
                  lastName: "",
                  phone: "",
                  sendEmail: true,
                  creator: userInfo.username,
                }}
                validationSchema={NewUserValidationSchema}
                onSubmit={async (values, { resetForm }) => {
                  try {
                    const rowForDb = convertDataToRecordForDb(
                      docRestriction,
                      viewRestriction,
                      actionRestriction
                    );
                    values.user_password = generatePassword(); //user_password chnged

                    const res = await axios.post(
                      `${url}/AwsEmail/sendTestEmail`,
                      {
                        email: values.email_address,
                        password: values.user_password,
                        username: values.username,
                      },
                      {
                        headers: {
                          token: user.token,
                        },
                      }
                    );
                    if (res.data === "created") {
                      values.department_id = valueForDb.department_id;
                      values.user_role = userRole;
                      values.permissions = rowForDb;
                      values.project_id = project.project_id;
                      values.enterprise_id = userInfo.enterprise_id;
                      values.phone = phone;
                      console.log("rowFOrDBUSerCreate", values.user_password);

                      console.log("dbtoken", user.token);
                      const response = await axios.post(
                        url + "/RolePermissions/addPermissions",
                        { values },
                        {
                          headers: { token: user.token },
                        }
                      );
                      console.log("res===>", response);
                      handleClickVariant("success", "User added sucessfully");
                      resetForm();
                      setPhone("");

                      handleComplete();
                      handleReset();
                    } else if (res.data === "error") {
                      alert("Invalid Email Entered");
                    } else if (res.data === "User already exists!") {
                      window.alert("User already exists!");
                    } else if (
                      res.data ===
                      "Email already registered. Use a new email for account creation."
                    ) {
                      window.alert(
                        "Email already registered. Use a new email for account creation."
                      );
                    }
                  } catch (error) {
                    if (
                      error.message == "Request failed with status code 401"
                    ) {
                      window.alert("User already exist!");
                    } else if (
                      error.message == "Request failed with status code 402"
                    ) {
                      window.alert(
                        "Email already used registered please register with another email!"
                      );
                    } else console.log(error);
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={2}>
                        <Grid container item xs={11}>
                          {" "}
                          <Typography
                            color="textPrimary"
                            variant="h2"
                            style={{
                              color: "var(--darkblue)",
                              fontWeight: "bold",
                            }}
                          >
                            Add New User
                          </Typography>
                        </Grid>

                        <Grid item xs={1}>
                          <IconButton component={Link} to="/app/adminDashboard">
                            <ArrowBackIcon></ArrowBackIcon>
                          </IconButton>
                        </Grid>
                        <Grid xs={12} sx={{ marginTop: 5 }}>
                          <AddUserStepper
                            activeStep={activeStep}
                            completed={completed}
                            setActiveStep={setActiveStep}
                            setCompleted={setCompleted}
                            steps={steps}
                          />
                        </Grid>

                        {activeStep === 0 ? (
                          <>
                            <Grid
                              container
                              item
                              xs={12}
                              columnSpacing={2}
                              className=""
                            >
                              <Grid item xs={12} md={6}>
                                <TextField
                                  error={Boolean(
                                    touched.firstName && errors.firstName
                                  )}
                                  required
                                  id="firstName"
                                  fullWidth
                                  helperText={
                                    touched.firstName && errors.firstName
                                  }
                                  label="First Name"
                                  margin="normal"
                                  name="firstName"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.firstName}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  error={Boolean(
                                    touched.lastName && errors.lastName
                                  )}
                                  required
                                  id="lastName"
                                  fullWidth
                                  helperText={
                                    touched.lastName && errors.lastName
                                  }
                                  label="Last Name"
                                  margin="normal"
                                  name="lastName"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.lastName}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  error={Boolean(
                                    touched.username && errors.username
                                  )}
                                  required
                                  id="username"
                                  fullWidth
                                  helperText={
                                    touched.username && errors.username
                                  }
                                  label="Username"
                                  margin="normal"
                                  name="username"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.username}
                                />
                              </Grid>

                              <Grid item xs={12} md={6}>
                                <TextField
                                  error={Boolean(
                                    touched.email_address &&
                                      errors.email_address
                                  )}
                                  required
                                  id="email_address"
                                  fullWidth
                                  helperText={
                                    touched.email_address &&
                                    errors.email_address
                                  }
                                  label="Email"
                                  margin="normal"
                                  name="email_address"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.email_address}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ m: 0, marginTop: "1em" }}
                              >
                                <PhoneInput
                                  inputProps={{
                                    name: "phone input",
                                    required: true,
                                    //autoFocus: true
                                  }}
                                  //disableSearchIcon={false}
                                  country={"us"}
                                  inputStyle={{ height: "55px", width: "100%" }}
                                  containerStyle={{ height: "55px" }}
                                  countryCodeEditable={false}
                                  //buttonStyle={{}}
                                  // dropdownStyle={{height:'80px'}}
                                  // disableDropdown={false}
                                  // enableSearch={true}
                                  placeholder="Enter phone number"
                                  value={phone}
                                  onChange={setPhone}
                                />
                              </Grid>

                              {/* <Grid item xs={12} md={6} columnSpacing={1}>
                                <FormControl
                                  sx={{ m: 0, marginTop: "1em" }}
                                  variant="outlined"
                                >
                                  <InputLabel htmlFor="outlined-adornment-password">
                                    Password
                                  </InputLabel>
                                  <OutlinedInput
                                    required={true}
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
                                    value={user_password}
                                    onChange={handleChangePassword}
                                    endAdornment={
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end"
                                        >
                                          {showPassword ? (
                                            <VisibilityOff />
                                          ) : (
                                            <Visibility />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    }
                                    label="Password"
                                  />
                                </FormControl>
                              </Grid> */}
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ m: 0, marginTop: "1em" }}
                              >
                                <Autocomplete
                                  id="autocomplete"
                                  open={open}
                                  size="large"
                                  fullWidth
                                  onOpen={() => {
                                    setOpen(true);
                                  }}
                                  onClose={() => {
                                    setOpen(false);
                                  }}
                                  // value={valueForDb ? valueForDb : null}
                                  isOptionEqualToValue={(option, value) =>
                                    option.username === value.department_name
                                  }
                                  getOptionLabel={(option) =>
                                    option.department_name
                                  }
                                  options={options}
                                  loading={loading}
                                  onChange={(e, option) => {
                                    console.log("option", option);
                                    if (option) {
                                      setValueForDb(option);
                                    } else {
                                      setValueForDb("");
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Department"
                                      required
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <React.Fragment>
                                            {loading ? (
                                              <CircularProgress
                                                color="inherit"
                                                size={20}
                                              />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                          </React.Fragment>
                                        ),
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                              {/* <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{ marginTop: "0.7em" }}
                                className="d-flex align-items-center"
                              >
                                <Button
                                  sx={{
                                    height: "45px",
                                    paddingInline: "5px !important",
                                    backgroundColor: "var(--darkblue)",
                                  }}
                                  onClick={handelegeneratePassword}
                                  variant="contained"
                                >
                                  Generate Password
                                </Button>
                              </Grid> */}
                            </Grid>
                            <Grid item xs={9}>
                              <Box
                                sx={{
                                  alignItems: "center",
                                  display: "flex",
                                  ml: -1,
                                }}
                              >
                                <Checkbox
                                  checked={values.sendEmail}
                                  name="sendEmail"
                                  onChange={handleChange}
                                />
                                <Typography
                                  color="textSecondary"
                                  variant="body1"
                                >
                                  Send the new user as email about their
                                  account.{" "}
                                </Typography>
                              </Box>
                            </Grid>
                            <Grid item xs={3} sx={{ textAlign: "right" }}>
                              {" "}
                              {/* {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: "inline-block",
                                      color: "green",
                                    }}
                                  >
                                    Step {activeStep + 1} already completed
                                  </Typography>
                                ) : (
                                  <Button
                                    endIcon={<SendIcon />}
                                    onClick={handleComplete}
                                    variant="contained"
                                    sx={{
                                      color: "white",
                                      backgroundColor: "var(--blue)",
                                    }}
                                  >
                                    Next
                                  </Button>
                                ))} */}
                              <Button
                                endIcon={<SendIcon />}
                                onClick={handleComplete}
                                variant="contained"
                                sx={{
                                  color: "white",
                                  backgroundColor: "var(--blue)",
                                }}
                                disabled={
                                  values?.firstName?.length === 0 ||
                                  values?.lastName?.length === 0 ||
                                  values?.username?.length === 0 ||
                                  values?.email_address?.length === 0 ||
                                  valueForDb?.length === 0 ||
                                  phone?.length <= 10
                                    ? // ||
                                      // user_password?.length === 0
                                      true
                                    : false
                                }
                              >
                                Next
                              </Button>
                            </Grid>
                          </>
                        ) : null}

                        {activeStep === 1 ? (
                          <>
                            <Grid item xs={12} md={6}>
                              <FormControl>
                                <InputLabel
                                  id="demo-simple-select-label"
                                  size="small"
                                >
                                  Role
                                </InputLabel>
                                <Select
                                  labelId="demo-simple-select-label"
                                  id="role"
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
                                  disabled={isSubmitting}
                                  fullWidth
                                  size="large"
                                  type="submit"
                                  onClick={handleSubmit}
                                  variant="contained"
                                  style={{ backgroundColor: "var(--darkblue)" }}
                                >
                                  Add
                                </Button>
                              </Box>
                            </Grid>
                          </>
                        ) : null}
                      </Grid>
                    </Box>
                  </form>
                )}
              </Formik>
            </Container>
          </TabPanel>
          <TabPanel value="2">
            {permisions.canadduserstoprojectusers ? (
              <AddUserToCurrentProject
                user={user}
                userInfo={userInfo}
                project={project}
                permisions={permisions}
              />
            ) : null}
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};
export default CreateUser;
