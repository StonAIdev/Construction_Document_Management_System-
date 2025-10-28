import React, { useState, useMemo, useEffect } from 'react';

import * as Yup from 'yup';

import { Formik } from 'formik';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import {
  MenuItem,
  OutlinedInput,
  FormControl,
  Stack,
  Box,
  Select,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  InputLabel,
  CircularProgress,
  Divider
} from '@mui/material';

import countryList from 'react-select-country-list';
import TransferList from '../../../components/TransferList';

export default function CreateEnterpriseStepThree({ setUser, user, userInfo, setUserInfo }) {
  const [left, setLeft] = React.useState([
    {
      department_name: 'Procurement',
      resposibility: 'Acquiring goods, services, or works from an external source'
    },
    {
      department_name: 'Engineering',
      resposibility: 'Oversee Engineering Processes'
    },
    {
      department_name: 'Construction',
      resposibility: 'Oversee Construction Processes'
    }
  ]);
  const [right, setRight] = React.useState([]);
  const labelLeft = 'Removed';
  const labelRight = 'Added';
  const countries = useMemo(() => countryList().getData(), []);
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState('');
  const [openProjectType, setOpenProjectType] = useState(false);
  const [openContractScope, setOpenContractScope] = useState(false);
  const [openWorkScope, setOpenWorkScope] = useState(false);
  const [open, setOpen] = useState(false);
  const [projectType, setprojectType] = useState('');
  const [contractScope, setcontractScope] = useState('');
  const [workScope, setworkScope] = useState('');
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [specifyProjectType, setSpecifyProjectType] = useState(false);

  const [openAuto, setOpenAuto] = useState(false);

  const [options, setOptions] = useState([]);
  const [valueForDb, setValueForDb] = useState({});
  const loading = openAuto && options.length === 0;

  const changeStartDateHandler = (newValue) => {
    setStartDate(newValue);
  };

  const changeEndDateHandler = (newValue) => {
    setEndDate(newValue);
  };
  const projectTypeList = [
    'residential',
    'commercial',
    'mixed use',
    'healthcare',
    'shopping mall',
    'outlet',
    'industrial',
    'warehouse',
    'infrastructure-Roads',
    'infrastructure-Tunnel',
    'infrastructure-Bridge',
    'infrastructure-mixed',
    'Conference'
  ];
  const contractScopeList = [
    'Design, build, operate',
    'Supervising Consultant',
    'Design Consultant',
    'Main Contractor',
    'Subcontractor',
    'Supplier',
    'Other'
  ];
  const workScopeList = [
    'Architectural',
    'Civil',
    'Electrical- High voltage (HV)',
    'Electrical- Low Voltage (LV)',
    'Electrical- low voltage (ELV)',
    'Electrical- Fire Alarm ',
    'Electrical- CCTV',
    'Electrical- BMS',
    'Environmental',
    'Geotechnical',
    'Health and Safety',
    'HVAC',
    'Hydraulics',
    'Internal Fit out',
    'Landscape (softscape and hardscape)',
    'Mechanical',
    'Mechanical- HVAC',
    'Mechanical- Plumbing',
    'Mechanical Chilled Water',
    'Mechanical solar Energy',
    'Mechanical-BMS',
    'Mechanical- Fire Fighting',
    'Structure',
    'Core and Shell',
    'Vertical Transportation',
    'Other'
  ];
  const changeProjectTypeHandler = (event) => {
    setprojectType(event.target.value);
  };
  const changeContractScopeHandler = (event) => {
    setcontractScope(event.target.value);
  };
  const changeworkScopeHandler = (event) => {
    setworkScope(event.target.value);
  };
  const changeCountryHandler = (event) => {
    setCountry(event.target.value);
  };
  // open close for country
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  // open close for country
  const handleCloseProjectType = () => {
    setOpenProjectType(false);
  };
  const handleOpenProjectType = () => {
    setOpenProjectType(true);
  };

  // open close for country
  const handleCloseContractScope = () => {
    setOpenContractScope(false);
  };
  const handleOpenContractScope = () => {
    setOpenContractScope(true);
  };

  // open close for country
  const handleCloseWorkScope = () => {
    setOpenWorkScope(false);
  };
  const handleOpenWorkScope = () => {
    setOpenWorkScope(true);
  };

  let specifyPrjectT;

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container
        maxWidth="md"
        style={{
          background: 'white',
          borderRadius: '15px',
          paddingBlock: '15px',
          boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
        }}
      >
        <Grid className="" container item xs={12} columnSpacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 20 }} color="text.secondary">
              Create Subs
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider fullWidth sx={{ backgroundColor: 'grey' }} />
          </Grid>
          <Grid item xs={12}>
            <Formik
              initialValues={{
                project_name: '',
                enterprise_id: '',
                plot_number: '',
                sector_number: '',
                area: '',
                city: '',
                county: '',
                specifyContractScope: '',
                specifyWorkScope: '',
                country: '',
                project_type: '',
                contract_scope: '',
                work_scope: '',
                start_date: '',
                end_date: '',
                user_id: '',
                departments: [],
                project_admin: ''
              }}
              onSubmit={async (values) => {
                try {
                  values.project_admin = valueForDb.user_id;
                  values.country = country;
                  values.project_type = projectType;
                  if (contractScope === 'Other') {
                    values.contract_scope = values.specifyContractScope;
                  } else {
                    values.contract_scope = contractScope;
                  }
                  if (workScope === 'Other') {
                    values.work_scope = values.specifyWorkScope;
                  } else {
                    values.work_scope = workScope;
                  }
                  values.start_date = startDate;
                  values.end_date = endDate;
                  values.enterprise_id = userInfo.enterprise_id;
                  values.user_id = userInfo.user_id;
                  values.departments = right;
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
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} />
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.project_name && errors.project_name)}
                        fullWidth
                        helperText={touched.project_name && errors.project_name}
                        label="Project Name"
                        margin="normal"
                        name="project_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.project_name}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    {/* <Grid item xs={12} >
                                                <Divider></Divider>
                                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                                    Where is the project located?
                                                </Typography>
                                            </Grid> */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.plot_number && errors.plot_number)}
                        fullWidth
                        helperText={touched.plot_number && errors.plot_number}
                        label="Plot Number"
                        margin="normal"
                        name="plot_number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.plot_number}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.sector_number && errors.sector_number)}
                        fullWidth
                        helperText={touched.sector_number && errors.sector_number}
                        label="Sector Number"
                        margin="normal"
                        name="sector_number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.sector_number}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.area && errors.area)}
                        fullWidth
                        helperText={touched.area && errors.area}
                        label="Area"
                        margin="normal"
                        name="area"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.area}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.city && errors.city)}
                        fullWidth
                        helperText={touched.city && errors.city}
                        label="City/Suburb"
                        margin="normal"
                        name="city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="city"
                        value={values.city}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.county && errors.county)}
                        fullWidth
                        helperText={touched.county && errors.county}
                        label="County/State"
                        margin="normal"
                        name="county"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="county"
                        value={values.county}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box>
                        <FormControl fullWidth size="small" margin="normal">
                          <InputLabel id="demo-controlled-open-select-label-country">
                            Country
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label-country"
                            id="demo-controlled-open-select-country"
                            open={open}
                            onClose={handleClose}
                            onOpen={handleOpen}
                            value={country}
                            onChange={changeCountryHandler}
                            input={
                              <OutlinedInput
                                id="demo-controlled-open-select-label-country"
                                label="Country"
                              />
                            }
                          >
                            {countries.map((item) => (
                              <MenuItem key={item.value} value={item.label}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6} sx={{ marginTop: 2 }}>
                      <Autocomplete
                        id="asynchronous-demo"
                        open={openAuto}
                        size="small"
                        fullWidth
                        onOpen={() => {
                          setOpenAuto(true);
                        }}
                        onClose={() => {
                          setOpenAuto(false);
                        }}
                        isOptionEqualToValue={(option, value) => option.username === value.username}
                        getOptionLabel={(option) => option.username}
                        options={options}
                        loading={loading}
                        onChange={(e, option) => {
                          console.log('option', option);
                          setValueForDb(option);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Choose Project Admin"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 18, marginBottom: '0px' }} color="text.secondary">
                        Project details:
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box>
                        <FormControl fullWidth size="small" margin="normal">
                          <InputLabel id="demo-controlled-open-select-label">
                            Type of Project
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openProjectType}
                            onClose={handleCloseProjectType}
                            onOpen={handleOpenProjectType}
                            value={projectType}
                            onChange={changeProjectTypeHandler}
                            input={
                              <OutlinedInput
                                id="demo-controlled-open-select-label"
                                label="Type of Project"
                              />
                            }
                          >
                            {projectTypeList.map((item) => (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Box>
                        <FormControl fullWidth size="small" margin="normal">
                          <InputLabel id="demo-controlled-open-select-label">
                            Scope of Contract
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openContractScope}
                            onClose={handleCloseContractScope}
                            onOpen={handleOpenContractScope}
                            value={contractScope}
                            onChange={changeContractScopeHandler}
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

                    {contractScope === 'Other' && (
                      <Grid item xs={12} md={4}>
                        <TextField
                          error={Boolean(
                            touched.specifyContractScope && errors.specifyContractScope
                          )}
                          fullWidth
                          helperText={touched.specifyContractScope && errors.specifyContractScope}
                          label="Specify Scope of Contract"
                          margin="normal"
                          name="specifyContractScope"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="specifyContractScope"
                          value={values.specifyContractScope}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={4}>
                      <Box>
                        <FormControl fullWidth size="small" margin="normal">
                          <InputLabel id="demo-controlled-open-select-label">
                            Scope of Work
                          </InputLabel>
                          <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openWorkScope}
                            onClose={handleCloseWorkScope}
                            onOpen={handleOpenWorkScope}
                            value={workScope}
                            onChange={changeworkScopeHandler}
                            input={
                              <OutlinedInput
                                id="demo-controlled-open-select-label"
                                label="Scope of Work"
                              />
                            }
                          >
                            {workScopeList.map((item) => (
                              <MenuItem key={item} value={item}>
                                {item}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      {workScope === 'Other' && (
                        <TextField
                          error={Boolean(touched.specifyWorkScope && errors.specifyWorkScope)}
                          fullWidth
                          helperText={touched.specifyWorkScope && errors.specifyWorkScope}
                          label="Specify Scope of Work"
                          margin="normal"
                          name="specifyWorkScope"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="specifyWorkScope"
                          value={values.specifyWorkScope}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      className="d-flex w-100 pt-0 pb-2"
                      style={{ columnGap: '8px' }}
                    >
                      <Grid item xs={12} md={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} className="">
                          <Stack spacing={2} className="CreateuserDate">
                            <DesktopDatePicker
                              className=""
                              fullWidth
                              size="small"
                              label="Project start date"
                              inputFormat="MM/dd/yyyy"
                              value={startDate}
                              onChange={changeStartDateHandler}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} className="">
                          <Stack spacing={2} className="CreateuserDate">
                            <DesktopDatePicker
                              className=""
                              fullWidth
                              size="small"
                              label="Project end date"
                              inputFormat="MM/dd/yyyy"
                              value={endDate}
                              onChange={changeEndDateHandler}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </Stack>
                        </LocalizationProvider>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} className="">
                      <Divider />
                      <Typography
                        sx={{ fontSize: 18, marginTop: 1, marginBottom: 2 }}
                        color="text.secondary"
                      >
                        Add default departments:
                      </Typography>
                      <TransferList
                        left={left}
                        setLeft={setLeft}
                        right={right}
                        setRight={setRight}
                        labelLeft={labelLeft}
                        labelRight={labelRight}
                      />
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
                          style={{ backgroundColor: 'var(--darkblue)' }}
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
  );
}
