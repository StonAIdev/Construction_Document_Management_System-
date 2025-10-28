import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import Stack from "@mui/material/Stack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Sorting from "./Sorting";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Formik, Field, Form } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Container,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import TagsFilter from "./TagsFilter";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function All({
  resetForm,
  user,
  filters,
  setFilters,
  contractor,
  check,
  saveClicked,
  setSaveClicked,
  setSaveToggle,
  clearAllHandler,
  project,
}) {
  const [ext, setExt] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const allStatus = [
    "A-Approved",
    "B-Approved as noted",
    "C-Revise & resubmit",
    "D-Rejected",
  ];
  const allDiscipline = [
    "Administration",
    "Architectural",
    "Civil",
    "Commercial",
    "Electrical",
    "Environmental",
    "Fire",
    "Geotechnical",
    "Health and Safety",
    "HVAC",
    "Hydraulics",
    "Internal Fit out",
    "Landscape",
    "Mechanical",
    "Project Management",
    "Structural",
    "Sustainability",
    "Traffic",
    "Vertical Transportation",
  ];
  const allExt = ["pdf", "jpeg", "png", "json", "docx", "zip"];

  const handleExtChange = (event) => {
    setExt(event.target.value);
  };

  const changeStartDateHandler = (newValue) => {
    setStartDate(newValue);
  };
  const changeEndDateHandler = (newValue) => {
    setEndDate(newValue);
  };

  const OnclickClearAllButton = () => {
    clearAllHandler();
    resetForm();
    console.log("Reset");
  };
  return (
    <Formik
      initialValues={{
        keword_search: "",
        revision_number: "",
        start_date: "",
        document_name: "",
        end_date: "",
        document_extension: "",
        MAIN_CONTRACTOR: "",
        CONSULTANT: "",
        SUBCONTRACTOR: "",
        DISCIPLINE: "",
        STATUS: "",
        Tags: [],
        Sorting: [],
      }}
      onSubmit={async (values) => {
        values.document_extension = ext;
        values.document_category = "All";
        values.contractor = contractor;
        // alert(JSON.stringify(values, null, 2));
        setFilters(values);
        setSaveToggle(Math.random());
        setSaveClicked(true);
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
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className="mt-2">
            <div
              className=" d-flex align-items-center"
              style={{ marginBottom: "10px" }}
            >
              <div style={{ marginBottom: "-20px" }}>
                <CardHeader title="All" className="py-0 submittalTitle" />

                <CardHeader subheader="Search" className="py-0" />
              </div>
            </div>

            {/* ***************************** NEW ***************************** */}
            {/* **************************  Filters  ************************** */}

            <div
              className="d-flex w-100 flex-wrap align-items-start ml-2 py-0 pt-2"
              style={{ gap: "0.5em" }}
            >
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: "0.2s",
                }}
              >
                <Box className="filterWidth">
                  <TextField
                    error={Boolean(touched.REVISION && errors.REVISION)}
                    fullWidth
                    helperText={touched.REVISION && errors.REVISION}
                    id="outlined-number"
                    label="Revision"
                    margin="normal"
                    name="REVISION"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.REVISION}
                    size="small"
                    className="textfieldMargin"
                  />
                </Box>
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".3s",
                }}
              >
                <Box className="filterWidth">
                  <TextField
                    error={Boolean(
                      touched.SUBCONTRACTOR && errors.SUBCONTRACTOR
                    )}
                    fullWidth
                    helperText={touched.SUBCONTRACTOR && errors.SUBCONTRACTOR}
                    label="SUBCONTRACTOR"
                    margin="normal"
                    name="SUBCONTRACTOR"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.SUBCONTRACTOR}
                    variant="outlined"
                    size="small"
                    className="textfieldMargin"
                  />
                </Box>
              </div>

              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: "0.5s",
                }}
              >
                <Box className="filterWidth">
                  <TextField
                    error={Boolean(
                      touched.document_name && errors.document_name
                    )}
                    fullWidth
                    helperText={touched.document_name && errors.document_name}
                    label="Document Name"
                    margin="normal"
                    name="document_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.document_name}
                    variant="outlined"
                    size="small"
                    className="textfieldMargin"
                  />
                </Box>
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".1s",
                }}
              >
                <Box className="filterWidth">
                  <FormControl
                    className=" w-100 textfieldMargin"
                    style={{ marginBottom: "-.5em" }}
                  >
                    <InputLabel id="demo-simple-select-label" size="small">
                      Status
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Status"
                      name="STATUS"
                      value={values.Status}
                      onChange={handleChange}
                      size="small"
                    >
                      {allStatus.map((s) => {
                        return <MenuItem value={s}>{s}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </div>

              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".2s",
                }}
              >
                <Box className="filterWidth">
                  <FormControl
                    className="w-100 textfieldMargin"
                    style={{ marginBottom: "-.5em" }}
                  >
                    <InputLabel id="demo-simple-select-label" size="small">
                      Discipline
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Discipline"
                      value={values.DISCIPLINE}
                      name="DISCIPLINE"
                      onChange={handleChange}
                      size="small"
                    >
                      {allDiscipline.map((s, i) => {
                        return (
                          <MenuItem key={i} value={s}>
                            {s}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Box>
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".5s",
                }}
              >
                <Box className="filterWidth">
                  <TextField
                    error={Boolean(touched.Comments_Box && errors.Comments_Box)}
                    fullWidth
                    helperText={touched.Comments_Box && errors.Comments_Box}
                    label="Search by comments"
                    margin="normal"
                    name="Comments_Box"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.Comments_Box}
                    variant="outlined"
                    size="small"
                    className="textfieldMargin m-0"
                  />
                </Box>
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".5s",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box className="filterWidth">
                    <DesktopDatePicker
                      className="textfieldMargin"
                      label="Start Date"
                      inputFormat="dd/MM/yyyy"
                      name="start_date"
                      value={values.start_date}
                      onChange={(val) => setFieldValue("start_date", val)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Box>
                </LocalizationProvider>
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".5s",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Box className="filterWidth">
                    <DesktopDatePicker
                      className="textfieldMargin"
                      label="End Date"
                      inputFormat="dd/MM/yyyy"
                      name="end_date"
                      value={values.end_date}
                      onChange={(val) => setFieldValue("end_date", val)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Box>
                </LocalizationProvider>
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".5s",
                }}
              >
                <TagsFilter
                  project={project}
                  user={user}
                  value={values}
                  setFieldValue={setFieldValue}
                />
              </div>
              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".8s",
                }}
              >
                <Sorting
                  project={project}
                  user={user}
                  value={values}
                  setFieldValue={setFieldValue}
                />
              </div>
            </div>
            {/* ****************************************************************** */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
              }}
            >
              {saveClicked && (
                <Grid item md={4} sm={6} xs={12}>
                  <Button variant="text" onClick={OnclickClearAllButton}>
                    Clear All
                  </Button>
                </Grid>
              )}
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                Search
              </Button>
            </Box>
          </Card>
        </form>
      )}
    </Formik>
  );
}
