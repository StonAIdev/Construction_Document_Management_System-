import {
  Box,
  Grid,
  Container,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import { Formik } from "formik";
import * as React from "react";
import { useTheme } from "@mui/material/styles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, department, theme) {
  return {
    fontWeight:
      department.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const AddUser = ({ handleClose, project }) => {
  const theme = useTheme();

  return (
    <>
      <Container sx={style}>
        <Formik
          initialValues={{
            user: "",
            department: "",
          }}
          onSubmit={async (values) => {
            try {
              handleClose();
            } catch (error) {
              console.log(error);
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
                <Grid container spacing={2}>
                  <Grid container item xs={12}>
                    <Typography color="textPrimary" variant="h1">
                      {project}
                    </Typography>
                  </Grid>
                  <Grid container item xs={12}>
                    <Typography color="textPrimary" variant="h2">
                      Add User
                    </Typography>
                  </Grid>
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.user && errors.user)}
                        required
                        id="outlined-required"
                        fullWidth
                        helperText={touched.user && errors.user}
                        label="Task Name"
                        margin="normal"
                        name="task_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.user}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.department && errors.department)}
                        required
                        id="outlined-required"
                        fullWidth
                        helperText={touched.department && errors.department}
                        label="Task Stutus"
                        margin="normal"
                        name="department"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.department}
                      />
                    </Grid>
                    <Grid item xs={12}></Grid>
                  </Grid>
                  <Grid item xs={12}>
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
                        Add
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </Container>
    </>
  );
};
export default AddUser;
