import React, { useState, useEffect } from "react";

import { url } from "../../../url";
import axios from "axios";
import { Formik } from "formik";

import {
  IconButton,
  Drawer,
  Typography,
  Divider,
  Box,
  Grid,
  TextField,
  Container,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useSnackbar } from "notistack";

const drawerWidth = 400;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const DepartmentDrawer = ({
  open,
  setOpen,
  user,
  name,
  resp,
  dep_id,
  setRefresh,
  refresh,
  project,
  head_of_department,
}) => {
  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [openDep, setOpenDep] = useState(false);
  const [options, setOptions] = useState([]);
  const [valueForDb, setValueForDb] = useState({});
  const loading = openDep && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      const res1 = await axios.post(
        url + "/userInfo/getProjectUsers",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );

      if (active) {
        setOptions([...res1.data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    if (!openDep) {
      setOptions([]);
    }
  }, [openDep]);
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        },
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="sm">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 24 }} color="text.primary">
                Edit Department
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider fullWidth sx={{ backgroundColor: "black" }}></Divider>
            </Grid>
            <Grid item xs={12}>
              <Formik
                initialValues={{
                  department_name: name,
                  resposibility: resp,
                  department_id: dep_id,
                  hod: valueForDb.user_id,
                }}
                onSubmit={async (values) => {
                  try {
                    values.hod = valueForDb.user_id;
                    const response = await axios.post(
                      url + "/Department/updateDepartment",
                      values,
                      { headers: { token: user.token } }
                    );

                    handleClickVariant(
                      "success",
                      "Department updated sucessfully"
                    );
                    setRefresh(!refresh);
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
                  values,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.department_name && errors.department_name
                          )}
                          fullWidth
                          helperText={
                            touched.department_name && errors.department_name
                          }
                          label="Department Name"
                          margin="normal"
                          name="department_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.department_name}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.resposibility && errors.resposibility
                          )}
                          fullWidth
                          helperText={
                            touched.resposibility && errors.resposibility
                          }
                          label="Description"
                          margin="normal"
                          name="resposibility"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.resposibility}
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          id="asynchronous-demo"
                          open={openDep}
                          size="small"
                          sx={{ paddingTop: 1 }}
                          fullWidth
                          onOpen={() => {
                            setOpenDep(true);
                          }}
                          onClose={() => {
                            setOpenDep(false);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.username === value.username
                          }
                          getOptionLabel={(option) => option.username}
                          options={options}
                          loading={loading}
                          onChange={(e, option) => {
                            setValueForDb(option);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Choose Head of Department"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <React.Fragment>
                                    {loading ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </React.Fragment>
                                ),
                              }}
                            />
                          )}
                        />
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
                            Edit
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
    </Drawer>
  );
};

export default DepartmentDrawer;
