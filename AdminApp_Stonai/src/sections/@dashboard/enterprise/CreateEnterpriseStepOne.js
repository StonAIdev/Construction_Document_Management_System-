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

export default function CreateEnterpriseStepOne({ enterpriseData, handleNext, setnewEnterprise }) {
  let kk;
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
                try {
                  enterpriseData.current = values;
                  const response = await axios.post(`${url}/AdminAppProject/createEnterprise`, {
                    name: values.enterprise_name,
                    country: values.enterprise_country,
                    city: values.enterprise_city,
                    contact: values.contact_number
                  });
                  if (response.data === 'Enterprise already exist!') {
                    alert('Enterprise with this name already exist!, Please try some other name');
                  } else {
                    console.log('edata', response.data);

                    setnewEnterprise(response.data);
                    handleNext();
                  }
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
                        Create Enterprise
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.enterprise_name && errors.enterprise_name)}
                        fullWidth
                        helperText={touched.enterprise_name && errors.enterprise_name}
                        label="Enterpise Name"
                        margin="normal"
                        name="enterprise_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.enterprise_name}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.enterprise_country && errors.enterprise_country)}
                        fullWidth
                        helperText={touched.enterprise_country && errors.enterprise_country}
                        label="Country"
                        margin="normal"
                        name="enterprise_country"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.enterprise_country}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.enterprise_city && errors.enterprise_city)}
                        fullWidth
                        helperText={touched.enterprise_city && errors.enterprise_city}
                        label="City"
                        margin="normal"
                        name="enterprise_city"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.enterprise_city}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.contact_number && errors.contact_number)}
                        fullWidth
                        helperText={touched.contact_number && errors.contact_number}
                        label="Contact number"
                        margin="normal"
                        name="contact_number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.contact_number}
                        variant="outlined"
                        size="small"
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
                          disabled={
                            !(
                              values &&
                              values.enterprise_name &&
                              values.enterprise_country &&
                              values.enterprise_city &&
                              values.contact_number
                            )
                          }
                          startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                          Create New Enterprise
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
