import React, { useState, useEffect, useMemo } from "react";
import {
    IconButton,
    Drawer,
    Typography,
    theme,
    Divider,
    Box,
    Container,
    TextField,
    Grid,
    Button,
    MenuItem,
    Stack,
    Select,
    FormControl,
    InputLabel,
    OutlinedInput,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { url } from "../../url";

import { styled, useTheme } from "@mui/material/styles";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import { Formik } from "formik";
import countryList from "react-select-country-list";
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

const SubcontractorDrawer = ({
    openDrawer,
    setOpenDrawer,
    refresh,
    setRefresh,
    proj,
    userInfo,
    user,
    subContractor,
    sub_id,
    setLoading
}) => {

    const theme = useTheme();

    const [left, setLeft] = React.useState([
        {
            department_name: "Procurement",
            resposibility:
                "Acquiring goods, services, or works from an external source",
        },
        {
            department_name: "Engineering",
            resposibility: "Oversee Engineering Processes",
        },
    ]);
    const [right, setRight] = React.useState([]);

    const [contractScope, setcontractScope] = useState(subContractor.scope)
    const [contractType, setcontractType] = useState(subContractor.contract_type)
    const [name, setName] = useState(subContractor.name)
    const [city, setCity] = useState(subContractor.city)
    const [country, setCountry] = useState(subContractor.country)
    const [location, setLocation] = useState(subContractor.location)
    const [managerName, setManagerName] = useState(subContractor.manager_name)
    const [managerEmail, setManagerEmail] = useState(subContractor.manager_email_address)

    const [openscopeofContract, setopenscopeofContract] = useState(false)
    const [opencontracttype, setopencontracttype] = useState(false)
    const { enqueueSnackbar } = useSnackbar();



    const handleClickVariant = (variant, title) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(title, { variant });
    };

    const contractScopeList = [
        "Design, build, operate",
        "Supervising Consultant",
        "Design Consultant",
        "Main Contractor",
        "Subcontractor",
        "Supplier",
        "Other",
    ];

    const contractTypeList = [
        "supply",
        "supply and install",
        "install",
        "test",
        "validate",
        "supervise",
        "consultant",
    ];

    const handleDrawerOpen = () => {
        console.log("callled");
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    // open close for scope of contract
    const handleCloseContractScope = () => {
        setopenscopeofContract(false);
    };
    const handleOpenContractScope = () => {
        setopenscopeofContract(true);
    };

    // open close for type of contract
    const handleCloseContractType = () => {
        setopencontracttype(false);
    };
    const handleOpenContractType = () => {
        setopencontracttype(true);
    };

    const changecontractScopeHandler = (event) => {
        setcontractScope(event.target.value);
    };

    const changecontracttypeHandler = (event) => {
        setcontractType(event.target.value);
    };

    const handleChangeName = (event) => {
        setName(event.target.value)
    }
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
            open={openDrawer}
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
                }}
            >
                <Container maxWidth="md">
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: 24 }} color="text.primary">
                                Edit Subcontractor
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider fullWidth sx={{ backgroundColor: "black" }}></Divider>
                        </Grid>
                        <Grid item xs={12}>
                            <Formik
                                initialValues={{
                                    name: "",
                                    scope: "",
                                    contract_type: "",
                                    sub_id: "",
                                    country: "",
                                    city: "",
                                    location: "",
                                    manager_name: "",
                                    manager_email_address: "",


                                }}
                                onSubmit={async (values) => {
                                    try {

                                        values.name = name;
                                        values.scope = contractScope;
                                        values.contract_type = contractType;
                                        values.location = location;
                                        values.manager_name = managerName;
                                        values.manager_email_address = managerEmail;
                                        values.city = city;
                                        values.country = country;


                                        values.sub_id = sub_id;

                                        const res = await axios.post(
                                            url + "/Project/updateSubcontractor",
                                            {
                                                values: values
                                            }
                                            ,
                                            {
                                                headers: { token: user.token },
                                            }
                                        );
                                        handleClickVariant('success', 'Subcontractor updated successfully')
                                        setLoading(true);
                                    }

                                    catch (error) {
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
                                        <Grid container spacing={0}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={Boolean(
                                                        touched.Subcontractor && errors.Subcontractor
                                                    )}
                                                    fullWidth
                                                    helperText={
                                                        touched.Subcontractor && errors.Subcontractor
                                                    }
                                                    label="Subcontractor Name"
                                                    margin="normal"
                                                    //name="Subcontractor_name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChangeName}
                                                    value={name}
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
                                                    required
                                                    label="Country"
                                                    margin="normal"
                                                    name="country"
                                                    onBlur={handleBlur}
                                                    onChange={(event) => { setCountry(event.target.value) }}
                                                    value={country}
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
                                                    onChange={(event) => { setCity(event.target.value) }}

                                                    required
                                                    label="City"
                                                    margin="normal"
                                                    name="city"
                                                    onBlur={handleBlur}
                                                    value={city}
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
                                                    label="Office location"
                                                    margin="normal"
                                                    name="location"
                                                    onBlur={handleBlur}
                                                    onChange={(event) => { setLocation(event.target.value) }}
                                                    value={location}
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
                                                    required
                                                    label="Project Manager Name"
                                                    margin="normal"
                                                    name="manager_name"
                                                    onBlur={handleBlur}
                                                    onChange={(event) => { setManagerName(event.target.value) }}
                                                    value={managerName}
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
                                                    label="Project Manager Email Address"
                                                    margin="normal"
                                                    name="manager_email_address"
                                                    onBlur={handleBlur}
                                                    onChange={(event) => { setManagerEmail(event.target.value) }}
                                                    value={managerEmail}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box>
                                                    <FormControl fullWidth size="small" margin="normal">
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Scope of Contract
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openscopeofContract}
                                                            onClose={handleCloseContractScope}
                                                            onOpen={handleOpenContractScope}
                                                            value={contractScope}
                                                            onChange={changecontractScopeHandler}
                                                            input={
                                                                <OutlinedInput
                                                                    id="demo-controlled-open-select-label"
                                                                    label="Scope of Work"
                                                                />
                                                            }
                                                        >
                                                            {contractScopeList.map((item) => (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                {contractScope === "Other" && (
                                                    <TextField
                                                        error={Boolean(
                                                            touched.specifycontractScope &&
                                                            errors.specifycontractScope
                                                        )}
                                                        fullWidth
                                                        helperText={
                                                            touched.specifycontractScope &&
                                                            errors.specifycontractScope
                                                        }
                                                        label="Specify Scope of Contract"
                                                        margin="normal"
                                                        name="specifycontractScope"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="specifycontractScope"
                                                        value={values.specifycontractScope}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Box>
                                                    <FormControl fullWidth size="small" margin="normal">
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Type of Contract
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={opencontracttype}
                                                            onClose={handleCloseContractType}
                                                            onOpen={handleOpenContractType}
                                                            value={contractType}
                                                            onChange={changecontracttypeHandler}
                                                            input={
                                                                <OutlinedInput
                                                                    id="demo-controlled-open-select-label"
                                                                    label="Scope of Work"
                                                                />
                                                            }
                                                        >
                                                            {contractTypeList.map((item) => (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                {contractScope === "Other" && (
                                                    <TextField
                                                        error={Boolean(
                                                            touched.specifycontracttype &&
                                                            errors.specifycontracttype
                                                        )}
                                                        fullWidth
                                                        helperText={
                                                            touched.specifycontracttype &&
                                                            errors.specifycontracttype
                                                        }
                                                        label="Specify Type of Contract"
                                                        margin="normal"
                                                        name="specifycontracttype"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="specifycontracttype"
                                                        value={values.specifycontracttype}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
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
            <Divider />
        </Drawer>
    )
}

export default SubcontractorDrawer