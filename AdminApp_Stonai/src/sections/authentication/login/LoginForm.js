import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';

import axios from 'axios';
// component
import Iconify from '../../../components/Iconify';
import { url } from '../../../url';
// ----------------------------------------------------------------------

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [checkLoginValid, setcheckLoginValid] = useState(true);
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        const res = await axios.post(`${url}/AdminAppProject/login`, {
          username: values.username,
          password: values.password
        });
        console.log('token recevied', res);

        if (res.data.status === 'ok') {
          setcheckLoginValid(true);
          const user = {
            token: res.data.user
          };
          setUser(user);
          navigate('/dashboard/enterprise', { replace: true });
        } else {
          setcheckLoginValid(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="username"
            label="Username"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {checkLoginValid ? null : (
            <Alert severity="error">Invalid Credentials, Please try again</Alert>
          )}
        </Stack>

        {/* <FormControlLabel
          control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
          label="Remember me"
        />

        <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
          Forgot password?
        </Link> */}

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
