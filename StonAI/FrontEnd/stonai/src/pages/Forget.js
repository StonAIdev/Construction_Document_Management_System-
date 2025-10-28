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
import { url, FrontEndUrl } from "../url";
import logo from "../components/Assets/LogoStonai.png";
import Heading1 from "../Reusable Components/Headings/Heading1";
import IconButton from "@mui/material/IconButton";
import ReCAPTCHA from "react-google-recaptcha";

let showcapcha = true;

const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword((show) => !show);
    };

    const [capchaCallback, setcapchaCallback] = useState("not fired");
    const [capchavalue, setCapchavalue] = useState("");
    const [capchaLoad, setCapchaLoad] = useState(false);
    const [capchaexpired, setCapchaexpired] = useState(false);
    //Need to make this false when making it live
    const [enablebutton, setenablebutton] = useState(true);

    const _reCaptchaRef = createRef();

    const SITE_KEY = "6LeFUakeAAAAAMbZryLWsXbbcoyRGORIR-A0b3Eg";



    useEffect(() => {
        // setTimeout(() => {
        setCapchaLoad(true);
        // }, DELAY);
    }, []);

    const asyncScriptOnLoad = () => {
        setcapchaCallback("called!");
        console.log("scriptLoad - reCaptcha Ref-", _reCaptchaRef.current);
    };

    return (
        <>
            <Helmet>
                <title>Forget | StonAi</title>
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
                                Forgot your password?
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
                                Please enter your username. You will receive a link to create a new password via email registered to your username.
                            </Heading1>
                        </Box>
                    </Container>
                    <Container maxWidth="sm" className=" logincontainer mx-0 loginwhite">
                        <Formik
                            initialValues={{
                                username: "",
                            }}
                            // validationSchema={Yup.object().shape({
                            //     username: Yup.string().required("username is required"),

                            // })}
                            onSubmit={async (values) => {
                                try {
                                    console.log("values", values);
                                    const response = await axios.post(
                                        url + "/AwsEmail/sendForgetMail",
                                        { username: values.username, link: `${FrontEndUrl}/reset?user=${values.username}` }
                                    );
                                    if (response.data === "created") {
                                        setErrorMessage(false);
                                        navigate("/login", { replace: true });


                                    }
                                    else {
                                        setErrorMessage(true);
                                    }

                                } catch (error) {
                                    setErrorMessage(true);
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
                                        error={Boolean(touched.username && errors.username)}
                                        fullWidth
                                        helperText={touched.username && errors.username}
                                        label="Username"
                                        margin="normal"
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type="username"
                                        value={values.username}
                                        variant="outlined"
                                        className="logintextbox"
                                    />


                                    {errorMessage ? (
                                        <Alert severity="error">No such username exists in the system</Alert>
                                    ) : null}



                                    <Box sx={{ py: 2 }}>
                                        <Button
                                            color="primary"
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
                                            Send Email
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
