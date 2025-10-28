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
import axios from 'axios';

import countryList from 'react-select-country-list';
import TransferList from '../../../components/TransferList';
import { url } from '../../../url';

export default function CreateEnterpriseStepThree({
  projectData,
  enterpriseData,
  handleNext,
  setNewProject
}) {
  console.log('projectData', projectData);
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

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      try {
        const res1 = await axios.get(
          `${url}/AdminAppProject/getAllEnterpriseUsers?enterprise_id=${projectData.current.enterprise_id}`
        );
        console.log('project dasd', res1);
        if (active) {
          setOptions([...res1.data]);
        }
      } catch (error) {
        console.log(error);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    if (!openAuto) {
      setOptions([]);
    }
  }, [openAuto]);

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
              Create Project Entities
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider fullWidth sx={{ backgroundColor: 'grey' }} />
          </Grid>
          <Grid item xs={12}>
            <Formik
              initialValues={projectData.current}
              onSubmit={async (values) => {
                try {
                  console.log('{projectData.current', projectData, valueForDb);
                  projectData.current.project_admin = valueForDb.user_id;
                  projectData.current.departments = right;
                  console.log('{projectData.current', projectData, valueForDb);
                  const response = await axios.post(
                    `${url}/AdminAppProject/createEnterpriseProject`,
                    projectData.current
                  );

                  console.log('New Id project', response);
                  setNewProject(response.data);

                  handleNext();
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
                    <Grid item xs={12} md={12} sx={{ marginTop: 2 }}>
                      <Autocomplete
                        id="asynchronous-demo"
                        open={openAuto}
                        size="large"
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
                          disabled={
                            !(
                              valueForDb &&
                              Object.keys(valueForDb).length > 0 &&
                              right &&
                              right.length > 0
                            )
                          }
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
  );
}
