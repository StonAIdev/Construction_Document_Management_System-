/* eslint-disable react/prop-types */
import React, { useState, useMemo, useEffect } from 'react';

import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  IconButton,
  CircularProgress,
  Divider
} from '@mui/material';

import axios from 'axios';
import Iconify from '../../../components/Iconify';

import { url } from '../../../url';

export default function CreateEnterpriseStepOne({ enterpriseData, handleNext }) {
  let kk;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [valueForDb, setValueForDb] = useState({});
  const loading = open && options.length === 0;

  console.log('edata', enterpriseData, valueForDb);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const res1 = await axios.get(`${url}/AdminAppProject/getAllEnterprise`);
      console.log('enterprises', res1);
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
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth="sm" className="CreateUserCantainer">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Formik
              initialValues={enterpriseData.current}
              onSubmit={async (values) => {
                console.log('edataEnterprise', enterpriseData, valueForDb);

                try {
                  enterpriseData.current = valueForDb;
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
                    <Grid item xs={12}>
                      <Typography sx={{ fontSize: 20 }} color="text.secondary">
                        Choose Enterprise
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        id="asynchronous-demo"
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
                          option.enterprise_name === value.enterprise_name
                        }
                        getOptionLabel={(option) => option.enterprise_name}
                        options={options}
                        loading={loading}
                        onChange={(e, option) => {
                          console.log('option', option);
                          setValueForDb(option);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Enterprise"
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
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={!(valueForDb && Object.keys(valueForDb).length > 0)}
                          endIcon={<Iconify icon="ic:baseline-navigate-next" />}
                        >
                          Move To Next Step
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
