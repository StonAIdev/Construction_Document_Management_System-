import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import axios from 'axios'; 
import { Formik } from 'formik';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import InputLabel from '@mui/material/InputLabel';
import { Divider } from '@mui/material';
import FacebookIcon from '../icons/Facebook';
import GoogleIcon from '../icons/Google';
import {url} from '../url'
import countryList from 'react-select-country-list'

const RegisterEnterprise = () => {
  const navigate = useNavigate();
  const countries = useMemo(() => countryList().getData(), [])
  const [county, setCounty] = useState('')
  const [success, setSuccess] = useState(false)
  const [country, setCountry] = useState('')
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const changeCountryHandler = (event) => {
        setCountry(event.target.value)
    }
  return (
    <>
      <Helmet>
        <title>Register Enterprise | StonAi</title>
      </Helmet>
      <Box
        sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
        }}
      >
        {!success && <Container maxWidth="sm">
        <Grid
                container
                spacing={1}
        >
            <Grid
                item
                xl={12}

            >
                <Typography sx={{ fontSize: 24 }} color="text.primary">
                    Register your Enterprise
                </Typography>
            </Grid>
            <Grid
                item
                xl={12}

            >
                <Divider sx={{ backgroundColor:'black'}}></Divider>
            </Grid>
            <Grid
                item
                xl={12}

            >
                
                    <Formik
                    initialValues={{
                        enterpriseName: '',
                        compRegNum: '',
                        address: '',
                        city: '',
                        county: '',
                        country: '',
                        postCode: '',
                        website: '',
                        tradingName: '',
                        orgAbbre: '',
                        givenName: '',
                        familyName: '',
                        emailAddress: '',
                        phoneNumber: '',
                        loginName: '',
                        user_password: '',
                        passwordConfirm: '',
                    }}
                    onSubmit={async(values) => {
                    try {
                        values.country = country
                        const response = await axios.post(url+'/Enterprise/mailEnterprise',values);
                        console.log("ressss",response.data.accepted);
                        if(response.data.accepted){
                            setSuccess(true)
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
                        <Grid
                            container
                            spacing= {1}
                        >
                            <Grid
                            item
                            xl={12}
                            >
                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                About your Enterprise
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                lg={12}
                            >
                                <TextField
                                error={Boolean(touched.enterpriseName && errors.enterpriseName)}
                                fullWidth
                                helperText={touched.enterpriseName && errors.enterpriseName}
                                label="Enterprise Name"
                                margin="normal"
                                name="enterpriseName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.enterpriseName}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.compRegNum && errors.compRegNum)}
                                fullWidth
                                helperText={touched.compRegNum && errors.compRegNum}
                                label="Company Registration Number"
                                margin="normal"
                                name="compRegNum"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.compRegNum}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.address && errors.address)}
                                fullWidth
                                helperText={touched.address && errors.address}
                                label="Address"
                                margin="normal"
                                name="address"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="address"
                                value={values.address}
                                variant="outlined"
                                size="small"
                                />
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
                                <Box>
                                    <FormControl fullWidth size="small">
                                       <InputLabel id="demo-controlled-open-select-label">Country</InputLabel>
                                        <Select 
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select" 
                                        open={open}
                                        onClose={handleClose}
                                        onOpen={handleOpen}
                                        value={country} 
                                        onChange={changeCountryHandler} 
                                        input={<OutlinedInput id="demo-controlled-open-select-label" label="Country" />}
                                   
                                        >
                                                {countries.map((item) => (
                                            <MenuItem
                                            key={item.value}
                                            value={item.label}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>                                   
                                </Box>
                                <TextField
                                error={Boolean(touched.postCode && errors.postCode)}
                                fullWidth
                                helperText={touched.postCode && errors.postCode}
                                label="Postcode"
                                margin="normal"
                                name="postCode"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                value={values.postCode}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.website && errors.website)}
                                fullWidth
                                helperText={touched.website && errors.website}
                                label="Website (optional)"
                                margin="normal"
                                name="website"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                value={values.website}
                                variant="outlined"
                                size="small"
                                />
                        
                            </Grid>
                            <Grid
                                item
                                xl={12}

                            >
                                <Divider></Divider>
                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                How will others recognize your organization?
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                lg={12}
                            >
                                <TextField
                                error={Boolean(touched.tradingName && errors.tradingName)}
                                fullWidth
                                helperText={touched.tradingName && errors.tradingName}
                                label="Trading Name"
                                margin="normal"
                                name="tradingName"
                                onBlur={handleBlur}
                                onChange={handleChange}

                                value={values.tradingName}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.orgAbbre && errors.orgAbbre)}
                                fullWidth
                                helperText={touched.orgAbbre && errors.orgAbbre}
                                label="Organization Abbreviation"
                                margin="normal"
                                name="orgAbbre"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.orgAbbre}
                                variant="outlined"
                                size="small"
                                />
                            </Grid>
                            <Grid
                                item
                                xl={12}

                            >
                                <Divider></Divider>
                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                Your contact details
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                lg={12}
                            >
                                <TextField
                                error={Boolean(touched.givenName && errors.givenName)}
                                fullWidth
                                helperText={touched.givenName && errors.givenName}
                                label="Your Given Name"
                                margin="normal"
                                name="givenName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.givenName}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.familyName && errors.familyName)}
                                fullWidth
                                helperText={touched.familyName && errors.familyName}
                                label="You Family Name"
                                margin="normal"
                                name="familyName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.familyName}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.emailAddress && errors.emailAddress)}
                                fullWidth
                                helperText={touched.emailAddress && errors.emailAddress}
                                label="Email Address"
                                margin="normal"
                                name="emailAddress"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.emailAddress}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                fullWidth
                                helperText={touched.phoneNumber && errors.phoneNumber}
                                label="Phone Number"
                                margin="normal"
                                name="phoneNumber"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.phoneNumber}
                                variant="outlined"
                                size="small"
                                />
                            </Grid>
                            <Grid
                                item
                                xl={12}

                            >
                                <Divider></Divider>
                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                Create a login
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                lg={12}
                            >
                                <TextField
                                error={Boolean(touched.loginName && errors.loginName)}
                                fullWidth
                                helperText={touched.loginName && errors.loginName}
                                label="Login Name"
                                margin="normal"
                                name="loginName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.loginName}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.user_password && errors.user_password)}
                                fullWidth
                                helperText={touched.user_password && errors.user_password}
                                label="Password"
                                margin="normal"
                                name="user_password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.user_password}
                                variant="outlined"
                                size="small"
                                />
                                <TextField
                                error={Boolean(touched.passwordConfirm && errors.passwordConfirm)}
                                fullWidth
                                helperText={touched.passwordConfirm && errors.passwordConfirm}
                                label="Password Confirm"
                                margin="normal"
                                name="passwordConfirm"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="password"
                                value={values.passwordConfirm}
                                variant="outlined"
                                size="small"
                                />
                            </Grid>
                            <Grid
                                item
                                xl={12}

                            >
                                <Divider></Divider>
                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                Terms Of Use
                                </Typography>
                            </Grid>
                        
                            <Grid
                                item
                                lg={12}
                            >
                                <TextareaAutosize
                                maxRows={5}
                                defaultValue="You acknowledge and agree that the current StonAi Cloud Services Terms of Use ('Terms of Use') including all incorporated agreements, specifications, and policies referenced therein will apply to Your use of the StonAi Cloud Services. Notwithstanding the prior sentence, if You have already executed an StonAi Cloud Services ordering document or agreement with StonAi and accepted the Terms of Use or other applicable terms, the version of the Terms of Use (or such other terms, if applicable) referenced in the applicable order shall apply for your use of the StonAi Cloud Services for the purposes of the projects under that order only. 'You' or 'Customer' as used in this notification refers to the organization the user receiving this notification is registered against in the StonAi Cloud Services.

                                The above will not affect any existing projects, which will continue to be governed by the terms in effect at the time the project was joined or the terms referenced in your order (as applicable)."
                                style={{ width: '100%' }}
                                />
                                <FormControlLabel control={<Checkbox  />} label="I acknowledge and agree to the above on behalf of the customer" />   

                            </Grid>
                            <Grid
                                item
                                lg={12}
                            >
                                <Box sx={{ py: 2 }}>
                                <Button
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    onClick={handleSubmit}
                                    variant="contained"
                                >
                                    Register
                                </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                    )}
                </Formik>
            </Grid>
        </Grid>
        </Container>}
        {
            success && 
            <Container  maxWidth="sm">
                <Grid
                container
                spacing={1}
                >
                    <Grid
                    item
                    xl={12}
                    >
                        <Typography sx={{ fontSize: 24 }} color="text.primary">
                            Register your Enterprise
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xl={12}

                    >
                        <Divider sx={{ backgroundColor:'black'}}></Divider>
                    </Grid>
                    <Grid
                    item
                    xl={12}
                    >
                        <Typography sx={{ fontSize: 20 }} color="text.secondary">
                        Thank you, your registration is now being processed.
                        </Typography>
                        <Typography sx={{ fontSize: 16 }} color="text.secondary">
                        Our sales team will email you shortly.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        }
      </Box>
    </>
  );
};

export default RegisterEnterprise;
