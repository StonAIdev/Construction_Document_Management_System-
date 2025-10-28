import React, { useState, useMemo, useEffect } from 'react';

import * as Yup from 'yup';

import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

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

export default function CreateEnterpriseStepThree({ newProject, projectData }) {
  console.log('new project id', newProject);
  const [openAuto, setOpenAuto] = useState(false);
  const [options, setOptions] = useState([]);
  const [valueForDb, setValueForDb] = useState({});
  const loading = openAuto && options.length === 0;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      try {
        const res1 = await axios.get(
          `${url}/AdminAppProject/projectDepartments?project_id=${newProject}`
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

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };
  const handleSubmit = async () => {
    try {
      const res1 = await axios.post(`${url}/AdminAppProject/addProjectAdminToDep`, {
        department_id: valueForDb.department_id,
        project_id: newProject,
        user_id: projectData.current.project_admin
      });
      handleClickVariant('success', 'Project Created Success');
      console.log('project dasd', res1);
    } catch (error) {
      console.log(error);
    }
  };
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
        <Grid className="" container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={{ fontSize: 20 }} color="text.secondary">
              Choose Project Admin Department
            </Typography>
          </Grid>

          <Grid item xs={12}>
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
              isOptionEqualToValue={(option, value) =>
                option.department_name === value.department_name
              }
              getOptionLabel={(option) => option.department_name}
              options={options}
              loading={loading}
              onChange={(e, option) => {
                console.log('option', option);
                setValueForDb(option);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Departments"
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
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={!(valueForDb && Object.keys(valueForDb).length > 0)}
                fullWidth
                size="large"
                type="submit"
                onClick={handleSubmit}
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
