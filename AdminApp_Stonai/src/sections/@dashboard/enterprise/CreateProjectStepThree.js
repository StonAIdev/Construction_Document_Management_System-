/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
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
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import generatePassword from 'password-generator';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

import Iconify from '../../../components/Iconify';
import { url } from '../../../url';

export default function CreateEnterpriseStepOne({
  enterpriseData,
  handleNext,
  userData,
  newEnterprise
}) {
  console.log('newEnterprise', newEnterprise);
  let kk;
  const [showPassword, setShowPassword] = useState(false);
  const [user_password, setUser_password] = useState('');

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handelegeneratePassword = () => {
    setUser_password(generatePassword());
  };
  const handleChangePassword = (event) => {
    setUser_password(event.target.value);
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
            <Formik
              initialValues={userData.current}
              onSubmit={async (values) => {
                try {
                  userData.current = values;

                  const response = await axios.post(`${url}/AdminAppProject/createUser`, {
                    username: values.username,
                    enterprise_id: newEnterprise,
                    email_address: values.email_address,
                    user_role: values.user_role,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    password: user_password
                  });
                  console.log('edata', response.data);
                  if (response.data == 'User already exist!') {
                    alert('User with this username already exist!, Please try some other username');
                  } else {
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
                        Create User
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.firstName && errors.firstName)}
                        fullWidth
                        helperText={touched.firstName && errors.firstName}
                        label="First Name"
                        margin="normal"
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.lastName && errors.lastName)}
                        fullWidth
                        helperText={touched.lastName && errors.lastName}
                        label="Last Name"
                        margin="normal"
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.username && errors.username)}
                        fullWidth
                        helperText={touched.username && errors.username}
                        label="Username"
                        margin="normal"
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.username}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.email_address && errors.email_address)}
                        fullWidth
                        helperText={touched.email_address && errors.email_address}
                        label="Email Address"
                        margin="normal"
                        name="email_address"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email_address}
                        variant="outlined"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        variant="outlined"
                        sx={{ width: '100%', m: 0, marginTop: '1em' }}
                      >
                        <InputLabel htmlFor="outlined-adornment-password" size="small">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={showPassword ? 'text' : 'password'}
                          value={user_password}
                          size="small"
                          sx={{ width: '100%' }}
                          onChange={handleChangePassword}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={handelegeneratePassword} variant="contained">
                        Generate Password
                      </Button>
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
                              values.username &&
                              values.email_address &&
                              values.firstName &&
                              values.lastName &&
                              user_password
                            )
                          }
                          startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                          Create Enterprise User
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
