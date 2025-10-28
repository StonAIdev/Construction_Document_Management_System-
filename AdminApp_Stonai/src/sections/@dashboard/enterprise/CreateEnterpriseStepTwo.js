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
  Divider,
  InputLabel,
  OutlinedInput,
  FormControl,
  InputAdornment,
  Checkbox
} from '@mui/material';

import { VisibilityOff, Visibility } from '@mui/icons-material';
import Iconify from '../../../components/Iconify';

export default function CreateEnterpriseStepTwo({ userData, handleNext }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [valueForDb, setValueForDb] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  let kk;
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
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
            <Typography sx={{ fontSize: 20 }} color="text.secondary">
              Create User
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider fullWidth sx={{ backgroundColor: 'grey' }} />
          </Grid>
          <Grid item xs={12}>
            <Formik
              initialValues={userData.current}
              onSubmit={async (values) => {
                try {
                  userData.current = values;
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
                  <Grid container item xs={12} columnSpacing={2} className="">
                    <Grid item xs={12} md={6}>
                      <TextField
                        error={Boolean(touched.firstName && errors.firstName)}
                        required
                        id="firstName"
                        fullWidth
                        helperText={touched.firstName && errors.firstName}
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
                        error={Boolean(touched.lastName && errors.lastName)}
                        required
                        id="lastName"
                        fullWidth
                        helperText={touched.lastName && errors.lastName}
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
                        error={Boolean(touched.username && errors.username)}
                        required
                        id="username"
                        fullWidth
                        helperText={touched.username && errors.username}
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
                        error={Boolean(touched.email_address && errors.email_address)}
                        required
                        id="email_address"
                        fullWidth
                        helperText={touched.email_address && errors.email_address}
                        label="Email"
                        margin="normal"
                        name="email_address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email_address}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} columnSpacing={1}>
                      <FormControl sx={{ m: 0, marginTop: '1em' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={showPassword ? 'text' : 'password'}
                          value={userPassword}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton aria-label="toggle password visibility" edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ m: 0, marginTop: '1em' }}>
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
                        isOptionEqualToValue={(option, value) =>
                          option.username === value.department_name
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
                            label="Department"
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
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{ marginTop: '0.7em' }}
                      className="d-flex align-items-center"
                    >
                      <Button variant="contained">Generate Password</Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={9}>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        ml: -1
                      }}
                    >
                      <Checkbox
                        checked={values.sendEmail}
                        name="sendEmail"
                        onChange={handleChange}
                      />
                      <Typography color="textSecondary" variant="body1">
                        Send the new user as email about their account.{' '}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ py: 2 }}>
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={handleSubmit}
                        startIcon={<Iconify icon="eva:plus-fill" />}
                      >
                        Create New User
                      </Button>
                    </Box>
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
