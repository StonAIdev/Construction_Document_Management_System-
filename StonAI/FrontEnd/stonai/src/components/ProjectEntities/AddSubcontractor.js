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
import { useSnackbar } from "notistack";
import { styled } from '@mui/material/styles';

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
import FacebookIcon from "../../icons/Facebook";
import GoogleIcon from "../../icons/Google";
import { url } from "../../url";
import countryList from "react-select-country-list";
import TransferList from "../TransferList";
import { Link } from "react-router-dom";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;



const Input = styled('input')({
  display: 'none',
});
const AddSubcontractor = ({ user, userInfo, project }) => {

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const [scope, setScope] = useState("");
  const [contractType, setContractType] = useState("");

  const changeScope = (event) => {
    console.log("scoprValue", event.target.value);
    setScope(event.target.value);
  };

  const changeContractType = (event) => {
    setContractType(event.target.value);
  };

  const [selectedFile, setSelectedFile] = useState();


  const changeHandler = (event) => {

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function () {
      console.log("file", reader.result);
      setSelectedFile(reader.result);

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

  };

  return (
    <>
      <Helmet>
        <title>Add Subcontractors | StonAi</title>
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
                Add Subcontractors
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton component={Link} to="/app/projectEntities">
                <ArrowBackIcon></ArrowBackIcon>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider fullWidth sx={{ backgroundColor: "black" }}></Divider>
            </Grid>
            <Grid item xs={12}>
              <Formik
                initialValues={{
                  name: "",
                  country: "",
                  city: "",
                  location: "",
                  manager_name: "",
                  manager_email_address: "",
                  scope: "",
                  contract_type: "",
                  project_id: project.project_id,
                  logo: "",
                }}
                onSubmit={async (values) => {
                  console.log("subcotractor values", values);

                  try {
                    values.project_id = project.project_id;
                    values.scope = scope;
                    values.user_id = user.username;
                    values.contract_type = contractType;
                    values.logo = selectedFile;

                    const response = await axios.post(
                      url + "/Project/addSubcontractor",
                      values,
                      { headers: { token: user.token } }
                    );

                    handleClickVariant(
                      "success",
                      "Subcontractor created successfully"
                    );
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
                  isSubmitting,
                  touched,
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <Typography
                          sx={{ fontSize: 20 }}
                          color="text.secondary"
                        >
                          Create Subcontractors for {project.project_name}
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
                          label="Legal name of entity"
                          margin="normal"
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                          variant="outlined"
                          size="small"
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          required
                          label="Country"
                          margin="normal"
                          name="country"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.country}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          required
                          label="City"
                          margin="normal"
                          name="city"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.city}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          label="Office location"
                          margin="normal"
                          name="location"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.location}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          required
                          label="Project Manager Name"
                          margin="normal"
                          name="manager_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.manager_name}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          label="Project Manager Email Address"
                          margin="normal"
                          name="manager_email_address"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.manager_email_address}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Box>
                          <FormControl fullWidth size="small" margin="normal">
                            <InputLabel id="demo-controlled-open-select-label">
                              Scope of Contract
                            </InputLabel>
                            <Select
                              labelId="demo-controlled-open-select-label"
                              id="demo-controlled-open-select"
                              value={scope}
                              onChange={changeScope}
                              input={
                                <OutlinedInput
                                  id="demo-controlled-open-select-label"
                                  label="Scope of Contract"
                                />
                              }
                            >
                              {contractScopeList.map((item) => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Box>
                          <FormControl fullWidth size="small" margin="normal">
                            <InputLabel id="demo-controlled-open-select-label">
                              Contract Type
                            </InputLabel>
                            <Select
                              labelId="demo-controlled-open-select-label"
                              id="demo-controlled-open-select"
                              name="contract_type"
                              value={contractType}
                              onChange={changeContractType}
                              input={
                                <OutlinedInput
                                  id="demo-controlled-open-select-label"
                                  label="Scope of Contract"
                                />
                              }
                            >
                              {contractTypeList.map((item) => (
                                <MenuItem key={item} value={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>

                      <Grid item xs={6} md={6} sx={{ marginTop: 2 }}>
                        <label htmlFor="contained-button-file">
                          <Input accept="image/*" id="contained-button-file" type="file" onChange={changeHandler} />
                          <Button variant="contained" component="span">
                            Upload Logo
                          </Button>
                        </label>
                      </Grid>
                      <Grid item xs={6} md={6} >
                        {selectedFile && Object.keys(selectedFile).length > 0 ?
                          <img alt="logo" src={selectedFile} width={100} height={100} />
                          : null}
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ py: 2 }}>
                          <Button
                            color="primary"
                            fullWidth
                            size="large"
                            type="submit"
                            disabled={
                              values.name.length === 0 ||
                                values.country.length === 0 ||
                                values.city.length === 0 ||
                                values.manager_name.length === 0 ||
                                scope.length === 0 ||
                                contractType.length === 0
                                ? true
                                : false
                            }
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
  )
}

export default AddSubcontractor



const contractScopeList = [
  "Design, build, operate",
  "Supervising Consultant",
  "Design Consultant",
  "Main Contractor",
  "Subcontractor",
  "Supplier",
  "Other",
];

const contractTypeList = [
  "supply",
  "supply and install",
  "install",
  "test",
  "validate",
  "supervise",
  "consultant",
];