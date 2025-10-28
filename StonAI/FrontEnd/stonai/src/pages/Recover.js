import React, { useState, useRef, createRef, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik } from "formik";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";

import "../components/Login.css";

import {
    Box,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from "@material-ui/core";
import FacebookIcon from "../icons/Facebook";
import GoogleIcon from "../icons/Google";
import { url } from "../url";
import logo from "../components/Assets/LogoStonai.png";
import Heading1 from "../Reusable Components/Headings/Heading1";
import IconButton from "@mui/material/IconButton";


const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };
    return (
        <>
            <Helmet>
                <title>Reset | StonAi</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "var(--blue)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    className=" container p-0"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        // background: "white",
                        // backgroundImage: "url(https://img.freepik.com/free-vector/isometric-construction-horizontal-banner-with-slider-button-text-images-crane-with-half-constructed-building_1284-56246.jpg?t=st=1646034025~exp=1646034625~hmac=bf1f222504e3593d81a224c1adde39ecd25a5b612b6e46970ada8315b0fb8468&w=1060)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        gap: "0px",
                        borderRadius: "10px",
                        // boxShadow: " rgba(0, 0, 0, 0.35) 0px 5px 15px"
                    }}
                >
                    <Container maxWidth="" className=" mx-0 loginleft  pr-2 pl-4">
                        <Box>
                            <Heading1
                                color="white"
                                paddingBlock=""
                                size="45px"
                                weight="500"
                                marginBottom=""
                                JFcontent="start"
                                align="left"
                                width="100%"
                                className="logintextshadow"
                            >
                                Reset your password
                            </Heading1>

                            <Heading1
                                color="white"
                                size="18px"
                                weight="500"
                                align="left"
                                width="80%"
                                JFcontent="start"
                                className="logintextshadow"
                            >
                                Please enter and confirm your new password
                            </Heading1>
                        </Box>
                    </Container>
                    <Container maxWidth="sm" className=" logincontainer mx-0 loginwhite">
                        <Formik
                            initialValues={{
                                username: "",
                                user_password: "",
                                confirm_password: "",
                            }}
                            validationSchema={Yup.object().shape({
                                user_password: Yup.string()
                                    .max(255)
                                    .required("Password is required"),
                                confirm_password: Yup.string()
                                    .max(255)
                                    .required("Password is required")

                            })}
                            onSubmit={async (values) => {
                                console.log("values", values)
                                const queryString = window.location.search;
                                const urlParams = new URLSearchParams(queryString);
                                const username = urlParams.get('user')
                                console.log("username db", username)
                                values.username = username;
                                if (values.user_password === values.confirm_password) {
                                    setErrorMessage(false);

                                    try {
                                        console.log("values", values);
                                        const response = await axios.post(
                                            url + "/Auth/resetPassword",
                                            values
                                        );

                                        navigate("/login", { replace: true });
                                    } catch (error) {
                                        console.log(error.response);
                                        return error.response;
                                    }
                                }
                                else {
                                    setErrorMessage(true);

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
                                values,
                            }) => (
                                <form
                                    onSubmit={handleSubmit}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "65%",
                                    }}
                                >
                                    <img src={logo} alt="StonAI" className="Loginlogo" />
                                    {/* <Box 
                  sx={{ 
                    mb: 3,
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",                
                   }}>
                    <Typography color="textPrimary" variant="h2">
                      Sign in
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      Sign in on the internal platform
                    </Typography>
                  </Box> */}

                                    <TextField
                                        error={Boolean(
                                            touched.user_password && errors.user_password
                                        )}
                                        fullWidth
                                        helperText={touched.user_password && errors.user_password}
                                        label="New Password"
                                        margin="normal"
                                        name="user_password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        value={values.user_password}
                                        variant="outlined"
                                        className="logintextbox"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword} edge="end">
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        error={Boolean(
                                            touched.user_password && errors.user_password
                                        )}
                                        fullWidth
                                        helperText={touched.user_password && errors.user_password}
                                        label="Confirm Password"
                                        margin="normal"
                                        name="confirm_password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        value={values.confirm_password}
                                        variant="outlined"
                                        className="logintextbox"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPassword} edge="end">
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />


                                    {errorMessage ? (
                                        <Alert severity="error">Passwords Didn't match</Alert>
                                    ) : null}



                                    <Box sx={{ py: 2 }}>
                                        <Button
                                            color="primary"
                                            disabled={false}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            onClick={handleSubmit}
                                            variant="contained"
                                            sx={{
                                                borderRadius: "50px",
                                                paddingInline: "50px",
                                                marginBottom: "30px",
                                            }}
                                        >
                                            Change Password
                                        </Button>

                                    </Box>

                                </form>
                            )}
                        </Formik>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default Login;
