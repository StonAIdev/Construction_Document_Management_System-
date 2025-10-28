import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik } from "formik";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";
import FacebookIcon from "../icons/Facebook";
import GoogleIcon from "../icons/Google";
import { url } from "../url";
const Login = ({ setUser }) => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Login | StonAi</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              username: "Saad@gmail.com",
              user_password: "saad123",
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string()

                .required("Email is required"),
              user_password: Yup.string()
                .max(255)
                .required("Password is required"),
            })}
            onSubmit={async (values) => {
              try {
                // console.log("values", values);
                const response = await axios.post(url + "/Auth/login", values);
                // console.log("token", response.data.user_id);
                const user = {
                  token: response.data.jwtToken,
                  username: values.username,
                  user_id: response.data.user_id,
                };
                // console.log("usersss", user);
                setUser(user);
                navigate("/app/dashboard", { replace: true });
              } catch (error) {
                // console.log(error.response);
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
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
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
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<FacebookIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Facebook
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Button
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={handleSubmit}
                      size="large"
                      variant="contained"
                    >
                      Login with Google
                    </Button>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    pb: 1,
                    pt: 3,
                  }}
                >
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="body1"
                  >
                    or login with email address
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.username && errors.username)}
                  fullWidth
                  helperText={touched.username && errors.username}
                  label="Email Address"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.username}
                  variant="outlined"
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
                />
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
                    Sign in now
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Don&apos;t have an account?{" "}
                  <Link component={RouterLink} to="/register" variant="h6">
                    Sign up
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
