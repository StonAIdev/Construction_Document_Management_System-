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

import { Box, Container, Grid, TextField, Typography } from "@material-ui/core";
import FacebookIcon from "../icons/Facebook";
import GoogleIcon from "../icons/Google";
import { url } from "../url";
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
  const [enablebutton, setenablebutton] = useState(false);

  const _reCaptchaRef = createRef();

  const SITE_KEY = "6LeFUakeAAAAAMbZryLWsXbbcoyRGORIR-A0b3Eg";

  const handleCAPCHA = (value) => {
    console.log("Captcha value:", value);
    setCapchavalue({ value });

    setenablebutton(true);
    // if value is null recaptcha expired
    if (value === null) {
      setCapchaexpired(true);
    }
  };

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
        <title>Login | StonAi</title>
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
                Welcome to StonAI
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
                Sign-in to access your project platform and start utilization
                faster.
              </Heading1>
            </Box>
          </Container>
          <Container maxWidth="sm" className=" logincontainer mx-0 loginwhite">
            <Formik
              initialValues={{
                username: "",
                user_password: "",
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string().required("Email is required"),
                user_password: Yup.string()
                  .max(255)
                  .required("Password is required"),
              })}
              onSubmit={async (values) => {
                try {
                  console.log("values", values);
                  const response = await axios.post(
                    url + "/Auth/login",
                    values
                  );
                  console.log("token", response.data.user_id);
                  const user = {
                    token: response.data.jwtToken,
                    username: values.username,
                    user_id: response.data.user_id,
                  };
                  console.log("usersss", user);
                  showcapcha = true;

                  setUser(user);
                  navigate("/app/folder", { replace: true });
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
                    type="email"
                    value={values.username}
                    variant="outlined"
                    className="logintextbox"
                  />

                  <TextField
                    error={Boolean(
                      touched.user_password && errors.user_password
                    )}
                    fullWidth
                    helperText={touched.user_password && errors.user_password}
                    label="Password"
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

                  {errorMessage ? (
                    <Alert severity="error">Invalid username or password</Alert>
                  ) : null}

                  <Box
                    sx={{
                      marginRight: "auto",
                      marginTop: "-10px",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <p className=" m-0">Keep me loggedin</p>
                      <Checkbox />
                    </div>
                    <RouterLink to="/forget">Forgot Password</RouterLink>
                  </Box>

                  <Box sx={{ py: 2 }}>
                    {enablebutton === false ? (
                      <Button
                        color="primary"
                        // disabled={false}
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
                        Sign in
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        size="large"
                        // disabled
                        sx={{
                          borderRadius: "50px",
                          paddingInline: "50px",
                          marginBottom: "30px",
                        }}
                      >
                        Sign in
                      </Button>
                    )}
                  </Box>

                  {/* {capchaLoad ? (
                    <ReCAPTCHA
                      // sitekey="6LeFUakeAAAAAMbZryLWsXbbcoyRGORIR-A0b3Eg"
                      ref={_reCaptchaRef}
                      sitekey={SITE_KEY}
                      onChange={handleCAPCHA}
                      asyncScriptOnLoad={asyncScriptOnLoad}
                    />
                  ) : null} */}
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
