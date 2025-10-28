import { Link as RouterLink, useNavigate } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik } from "formik";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Alert from "@mui/material/Alert";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import { Divider } from "@mui/material";
import FacebookIcon from "../icons/Facebook";
import GoogleIcon from "../icons/Google";
import { url } from "../url";
import countryList from "react-select-country-list";
import TransferList from "../components/TransferList";
import { Link } from "react-router-dom";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CreateDepartment = ({
  setUser,
  user,
  userInfo,
  setUserInfo,
  project,
  setProject,
}) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [valueForDb, setValueForDb] = useState({});
  const [selectionError, setSelectionError] = useState(true);
  const [selectionErrorMsg, setSelectionErrorMsg] = useState(false);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const res1 = await axios.post(
        url + "/userInfo/getProjectUsers",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log(res1);

      if (active) {
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

  const ValidationSchema = Yup.object().shape({
    department_name: Yup.string()
      .required('Required'),
    resposibility: Yup.string()
      .required('Required'),
  });

  return (
    <>
      <Helmet>
        <title>Create Department | StonAi</title>
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
                Create Department
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
              <Formik
                initialValues={{
                  department_name: "",
                  resposibility: "",
                  project_id: "",
                  project_users: {},
                  created_by: "",
                }}
                validationSchema={ValidationSchema}
                onSubmit={async (values) => {
                  try {
                    console.log(valueForDb);
                    values.project_id = project.project_id;
                    values.project_users = valueForDb;
                    values.created_by = user.username;

                    const response = await axios.post(
                      url + "/Department/registerDepartment",
                      values,
                      { headers: { token: user.token } }
                    );

                    navigate("/app/adminDashboard", { replace: true });
                  } catch (error) {
                    console.log(error.response);
                    return error.response;
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  setFieldValue,
                  isSubmitting,
                  touched,
                  values,
                  isValid
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography
                          sx={{ fontSize: 20 }}
                          color="text.secondary"
                        >
                          Create department for {project.project_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.department_name && errors.department_name
                          )}
                          fullWidth
                          helperText={
                            touched.department_name && errors.department_name
                          }
                          required
                          label="Department Name"
                          margin="normal"
                          name="department_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.department_name}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          required
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          label="Resposibility"
                          margin="normal"
                          name="resposibility"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.resposibility}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ marginTop: 2 }}>
                        <Autocomplete
                          id="asynchronous-demo"
                          // name="project_users"
                          open={open}
                          size="small"
                          fullWidth
                          onOpen={() => {
                            setOpen(true);
                          }}
                          onClose={() => {
                            setOpen(false);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.username === value.username
                          }
                          getOptionLabel={(option) => option.username}
                          options={options}
                          loading={loading}
                          onChange={(e, option) => {
                            console.log("option", option);
                            setValueForDb(option);
                            setSelectionError(option !== null ? false : true);
                            setSelectionErrorMsg(option !== null ? false : true);
                            console.log("errors===>", errors)
                            console.log("isSubmitting===>", isValid, selectionError)
                          }

                          }
                          renderInput={(params) => (
                            <TextField
                              required
                              error={selectionErrorMsg}
                              helperText={selectionErrorMsg ? "Required" : ""}
                              {...params}
                              label="Choose Head of Department"
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
                      <Grid item xs={12}>
                        <Box sx={{ py: 2 }}>
                          <Button
                            color="primary"
                            disabled={
                              isValid === true &&
                                (selectionError !== true)
                                ? false : true}
                            fullWidth
                            size="large"
                            type="submit"
                            onClick={handleSubmit}
                            variant="contained"
                          >
                            Create
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default CreateDepartment;
