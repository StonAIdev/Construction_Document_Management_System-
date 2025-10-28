import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Stack from "@mui/material/Stack";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Sorting from "./Sorting";
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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function MaterialSubmittal({
  openAdvanceFilters,
  isAdvanceFiltersOpen,
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
  const [status, setStatus] = useState("");
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
    "Vertical Transportation"
  ]
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };
  const handleDisciplineChange = (event) => {
    setDiscipline(event.target.value);
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
        SUBMITTAL_TITLE: "",
        SUBMITTAL_NO: "",
        start_date: "",
        end_date: "",
        DISCIPLINE: "",
        locationOfUse: "",
        projectName: "",
        Location: "",
        MAIN_CONTRACTOR: "",
        client: "",
        CONSULTANT: "",
        SUBCONTRACTOR: "",
        Status: "",
        start_date: "",
        end_date: "",
        Tags: [],
        Sorting: [],
      }}
      onSubmit={async (values) => {
        values.document_category = "Material Submittals";
        values.contractor = contractor;
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
        setFieldValue
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className="mt-2">
            <div className=" d-flex align-items-center" style={{ marginBottom: "10px" }}>
              <div style={{ marginBottom: "-20px" }}>
                <CardHeader
                  title="Material Submittal"
                  className="py-0 submittalTitle"
                />

                <CardHeader
                  subheader="Search"
                  className="py-0"
                />
              </div>

              <div
                className="fadein d-flex align-items-center"
                style={{
                  marginRight: "10px",
                  animationDelay: ".6s",
                }}
              >
                {/* {isAdvanceFiltersOpen && (<><MenuIcon sx={{fontSize:"10px"}}/> </>)} */}


                <Button onClick={openAdvanceFilters}>
                  {isAdvanceFiltersOpen === true ? <CloseIcon sx={{ fontSize: "20px", marginRight: "5px" }} /> :
                    <MenuIcon sx={{ fontSize: "20px", marginRight: "5px" }} />}
                  Advance filters</Button>
              </div>

              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".8s",
                }}
              >
                <Sorting project={project} user={user} value={values} setFieldValue={setFieldValue} />
              </div>
            </div>

            {/* ********** NEW ********** */}
            {/* *********  Filters  ********* */}
            <div
              className="d-flex w-100 flex-wrap align-items-center justify-content-start py-0"
              style={{ gap: "0.5em", marginInline: "10px" }}
            >
              {/* -------------------------- Row # 1 -------------------------- */}

              <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: "0.1s",
                }}
              >
                <Box className="filterWidth">
                  <TextField
                    error={Boolean(
                      touched.SUBMITTAL_TITLE && errors.SUBMITTAL_TITLE
                    )}
                    fullWidth
                    helperText={
                      touched.SUBMITTAL_TITLE && errors.SUBMITTAL_TITLE
                    }
                    label="Submittal Title"
                    margin="normal"
                    name="SUBMITTAL_TITLE"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.SUBMITTAL_TITLE}
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
                  animationDelay: "0.2s",
                }}
              >
                <Box className="filterWidth">
                  <TextField
                    error={Boolean(touched.SUBMITTAL_NO && errors.SUBMITTAL_NO)}
                    fullWidth
                    helperText={touched.SUBMITTAL_NO && errors.SUBMITTAL_NO}
                    label="Submittal No."
                    margin="normal"
                    name="SUBMITTAL_NO"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.SUBMITTAL_NO}
                    variant="outlined"
                    size="small"
                    className="textfieldMargin"
                  />
                </Box>
              </div>
              {isAdvanceFiltersOpen && <>
                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.4s",
                  }}
                >
                  <Box className="filterWidth">
                    <FormControl className="textfieldMargin">
                      <InputLabel id="demo-simple-select-label" size="small">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status"
                        name="Status"
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
                    animationDelay: "0.48s",
                  }}
                >
                  <Box className="filterWidth">
                    <FormControl className="textfieldMargin">
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
                        {allDiscipline.map((s) => {
                          return <MenuItem value={s}>{s}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </div>

                {/* -------------------------- Row # 2 -------------------------- */}
                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.4s",
                  }}
                >
                  <Box className="filterWidth">
                    <TextField
                      error={Boolean(touched.Location && errors.Location)}
                      fullWidth
                      helperText={touched.Location && errors.Location}
                      label="Location"
                      margin="normal"
                      name="Location"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.Location}
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
                    animationDelay: "0.4s",
                  }}
                >
                  <Box className="filterWidth">
                    <TextField
                      error={Boolean(
                        touched.locationOfUse && errors.locationOfUse
                      )}
                      fullWidth
                      helperText={touched.locationOfUse && errors.locationOfUse}
                      label="location of Use"
                      margin="normal"
                      name="locationOfUse"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.locationOfUse}
                      variant="outlined"
                      size="small"
                      className="textfieldMargin"
                    />
                  </Box>
                </div>

                {/* <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.4s",
                  }}>
                  <Box style={{ width: "13em" }} className="filterWidth">
                    <LocalizationProvider dateAdapter={AdapterDateFns} className='textfieldMargin'>
                      <DesktopDatePicker
                        fullWidth
                        label="Start Date"
                        inputFormat="MM/dd/yyyy"
                        value={startDate}
                        onChange={changeStartDateHandler}
                        renderInput={(params) => <TextField size="small"{...params} />}
                      />
                    </LocalizationProvider>
                  </Box>
                </div> */}

                {/* <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.4s",
                  }}>
                  <Box style={{ width: "13em" }} className="filterWidth">
                    <LocalizationProvider dateAdapter={AdapterDateFns} className='textfieldMargin'>
                      <DesktopDatePicker
                        fullWidth
                        label="End Date"
                        inputFormat="MM/dd/yyyy"
                        value={endDate}
                        onChange={changeEndDateHandler}
                        renderInput={(params) => <TextField size="small"{...params} />}
                      />
                    </LocalizationProvider>
                  </Box>
                </div> */}

                {/* -------------------------- Row # 3 -------------------------- */}







                {/* -------------------------- Row # 4 -------------------------- */}

                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.4s",
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
                      className="textfieldMargin"
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
                        onChange={(val) => setFieldValue('start_date', val)}
                        renderInput={(params) => <TextField {...params} size="small" />}

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
                        onChange={(val) => setFieldValue('end_date', val)}
                        renderInput={(params) => <TextField {...params} size="small" />}

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
                  <TagsFilter project={project} user={user} value={values} setFieldValue={setFieldValue} />
                </div>
                {/* <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: ".5s",
                  }}
                >
                  <Sorting project={project} user={user} value={values} setFieldValue={setFieldValue} />
                </div> */}
              </>}
              {/* <div
                className="fadein"
                style={{
                  marginRight: "10px",
                  animationDelay: ".4s",
                }}
              >
                <Button onClick={openAdvanceFilters}>Advance filters</Button>
              </div> */}
            </div>
            {/* ************************ */}

            <Divider />
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
