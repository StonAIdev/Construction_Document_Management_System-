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
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

import { styled, useTheme } from "@mui/material/styles";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import { Formik } from "formik";
import countryList from "react-select-country-list";
import { useSnackbar } from "notistack";
import { url } from '../../../url';

const drawerWidth = 400;

const projectTypeList = [
    "residential",
    "commercial",
    "mixed use",
    "healthcare",
    "shopping mall",
    "outlet",
    "industrial",
    "warehouse",
    "infrastructure-Roads",
    "infrastructure-Tunnel",
    "infrastructure-Bridge",
    "infrastructure-mixed",
    "Conference",
];
const contractScopeList = [
    "Design, build, operate",
    "Supervising Consultant",
    "Design Consultant",
    "Main Contractor",
    "Subcontractor",
    "Supplier",
    "Other",
];
const workScopeList = [
    "Architectural",
    "Civil",
    "Electrical- High voltage (HV)",
    "Electrical- Low Voltage (LV)",
    "Electrical- low voltage (ELV)",
    "Electrical- Fire Alarm ",
    "Electrical- CCTV",
    "Electrical- BMS",
    "Environmental",
    "Geotechnical",
    "Health and Safety",
    "HVAC",
    "Hydraulics",
    "Internal Fit out",
    "Landscape (softscape and hardscape)",
    "Mechanical",
    "Mechanical- HVAC",
    "Mechanical- Plumbing",
    "Mechanical Chilled Water",
    "Mechanical solar Energy",
    "Mechanical-BMS",
    "Mechanical- Fire Fighting",
    "Structure",
    "Core and Shell",
    "Vertical Transportation",
    "Other",
];

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

const ProjectDrawer = ({
    openDrawer,
    setOpenDrawer,
    refresh,
    setRefresh,
    proj,
    setLoading

}) => {
    console.log("proj", proj);
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
    const labelLeft = "Removed";
    const labelRight = "Added";
    const countries = useMemo(() => countryList().getData(), []);
    const [county, setCounty] = useState("");
    const [country, setCountry] = useState(proj.country);
    const [openProjectType, setOpenProjectType] = useState(false);
    const [openContractScope, setOpenContractScope] = useState(false);
    const [openWorkScope, setOpenWorkScope] = useState(false);
    const [open, setOpen] = useState(false);
    const [projectType, setprojectType] = useState(proj.project_type);
    const [contractScope, setcontractScope] = useState(proj.contract_scope);
    const [workScope, setworkScope] = useState(proj.work_scope);
    const [startDate, setStartDate] = React.useState(proj.start_date);
    const [endDate, setEndDate] = React.useState(proj.end_date);
    const [specifyProjectType, setSpecifyProjectType] = useState(false);
    const [openAuto, setOpenAuto] = useState(false);

    const [options, setOptions] = useState([]);
    const [valueForDb, setValueForDb] = useState({ user_id: proj.user_id, username: proj.username });
    const loading = openAuto && options.length === 0;

    console.log("valueForDb", valueForDb)
    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const res1 = await axios.get(
                `${url}/AdminAppProject/getAllEnterpriseUsers?enterprise_id=${proj.enterprise_id}`


            );
            console.log("project dasd", res1);

            if (active) {
                setOptions([...res1.data]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);
    useEffect(() => {
        if (!openAuto) {
            setOptions([]);
        }
    }, [openAuto]);
    const { enqueueSnackbar } = useSnackbar();
    const handleClickVariant = (variant, title) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(title, { variant });
    };
    const changeStartDateHandler = (newValue) => {
        setStartDate(newValue);
    };

    const changeEndDateHandler = (newValue) => {
        setEndDate(newValue);
    };
    const handleDrawerOpen = () => {
        console.log("callled");
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    // open close for country
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    // open close for country
    const handleCloseProjectType = () => {
        setOpenProjectType(false);
    };
    const handleOpenProjectType = () => {
        setOpenProjectType(true);
    };

    // open close for country
    const handleCloseContractScope = () => {
        setOpenContractScope(false);
    };
    const handleOpenContractScope = () => {
        setOpenContractScope(true);
    };

    // open close for country
    const handleCloseWorkScope = () => {
        setOpenWorkScope(false);
    };
    const handleOpenWorkScope = () => {
        setOpenWorkScope(true);
    };
    const changeProjectTypeHandler = (event) => {
        setprojectType(event.target.value);
    };
    const changeContractScopeHandler = (event) => {
        setcontractScope(event.target.value);
    };
    const changeworkScopeHandler = (event) => {
        setworkScope(event.target.value);
    };
    const changeCountryHandler = (event) => {
        setCountry(event.target.value);
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
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Typography sx={{ fontSize: 24 }} color="text.primary">
                                Edit Project
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider fullWidth sx={{ backgroundColor: "black" }}></Divider>
                        </Grid>
                        <Grid item xs={12}>
                            <Formik
                                initialValues={proj}
                                onSubmit={async (values) => {
                                    try {
                                        console.log("proj Values", proj, values)
                                        values.project_admin = valueForDb.user_id;

                                        values.country = country;
                                        values.project_type = projectType;
                                        if (contractScope == "Other") {
                                            values.contract_scope = values.specifyContractScope;
                                        } else {
                                            values.contract_scope = contractScope;
                                        }
                                        if (workScope == "Other") {
                                            values.work_scope = values.specifyWorkScope;
                                        } else {
                                            values.work_scope = workScope;
                                        }
                                        values.start_date = startDate;
                                        values.end_date = endDate;
                                        values.departments = right;

                                        console.log("submit value", values)
                                        const response = await axios.post(
                                            url + "/AdminAppProject/updateProject",
                                            values,
                                        );
                                        console.log("response", response)
                                        // handleClickVariant(
                                        //     "success",
                                        //     "Project updated sucessfully"
                                        // );
                                        setLoading(false)
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
                                        {console.log("values", values)}
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}></Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={Boolean(
                                                        touched.project_name && errors.project_name
                                                    )}
                                                    fullWidth
                                                    helperText={
                                                        touched.project_name && errors.project_name
                                                    }
                                                    label="Project Name"
                                                    margin="normal"
                                                    name="project_name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.project_name}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Grid>
                                            {/* <Grid item xs={12} >
                                                <Divider></Divider>
                                                <Typography sx={{ fontSize: 20 }} color="text.secondary">
                                                    Where is the project located?
                                                </Typography>
                                            </Grid> */}
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={Boolean(
                                                        touched.plot_number && errors.plot_number
                                                    )}
                                                    fullWidth
                                                    helperText={touched.plot_number && errors.plot_number}
                                                    label="Plot Number"
                                                    margin="normal"
                                                    name="plot_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.plot_number}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                                <TextField
                                                    error={Boolean(
                                                        touched.sector_number && errors.sector_number
                                                    )}
                                                    fullWidth
                                                    helperText={
                                                        touched.sector_number && errors.sector_number
                                                    }
                                                    label="Sector Number"
                                                    margin="normal"
                                                    name="sector_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.sector_number}
                                                    variant="outlined"
                                                    size="small"
                                                />
                                                <TextField
                                                    error={Boolean(touched.area && errors.area)}
                                                    fullWidth
                                                    helperText={touched.area && errors.area}
                                                    label="Area"
                                                    margin="normal"
                                                    name="area"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.area}
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
                                                    <FormControl fullWidth size="small" margin="normal">
                                                        <InputLabel id="demo-controlled-open-select-label-country">
                                                            Country
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label-country"
                                                            id="demo-controlled-open-select-country"
                                                            open={open}
                                                            onClose={handleClose}
                                                            onOpen={handleOpen}
                                                            value={country}
                                                            onChange={changeCountryHandler}
                                                            input={
                                                                <OutlinedInput
                                                                    id="demo-controlled-open-select-label-country"
                                                                    label="Country"
                                                                />
                                                            }
                                                        >
                                                            {countries.map((item) => (
                                                                <MenuItem key={item.value} value={item.label}>
                                                                    {item.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                <Autocomplete
                                                    id="asynchronous-demo"
                                                    open={openAuto}
                                                    size="small"
                                                    fullWidth
                                                    sx={{ paddingTop: 1 }}
                                                    onOpen={() => {
                                                        setOpenAuto(true);
                                                    }}
                                                    onClose={() => {
                                                        setOpenAuto(false);
                                                    }}
                                                    isOptionEqualToValue={(option, value) =>
                                                        option.username === value.username
                                                    }
                                                    value={valueForDb}
                                                    getOptionLabel={(option) => option.username}
                                                    options={options}
                                                    loading={loading}
                                                    onChange={(e, option) => {
                                                        console.log("option", option);
                                                        setValueForDb(option);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Choose Project Admin"
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
                                                <Typography
                                                    sx={{ fontSize: 20, marginBottom: "0px" }}
                                                    color="text.secondary"
                                                >
                                                    Project details:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box>
                                                    <FormControl fullWidth size="small" margin="normal">
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Type of Project
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openProjectType}
                                                            onClose={handleCloseProjectType}
                                                            onOpen={handleOpenProjectType}
                                                            value={projectType}
                                                            onChange={changeProjectTypeHandler}
                                                            input={
                                                                <OutlinedInput
                                                                    id="demo-controlled-open-select-label"
                                                                    label="Type of Project"
                                                                />
                                                            }
                                                        >
                                                            {projectTypeList.map((item) => (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Box>
                                                    <FormControl fullWidth size="small" margin="normal">
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Scope of Contract
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openContractScope}
                                                            onClose={handleCloseContractScope}
                                                            onOpen={handleOpenContractScope}
                                                            value={contractScope}
                                                            onChange={changeContractScopeHandler}
                                                            input={
                                                                <OutlinedInput
                                                                    id="demo-controlled-open-select-label"
                                                                    label="Scope of Contract"
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
                                                {contractScope == "Other" && (
                                                    <TextField
                                                        error={Boolean(
                                                            touched.specifyContractScope &&
                                                            errors.specifyContractScope
                                                        )}
                                                        fullWidth
                                                        helperText={
                                                            touched.specifyContractScope &&
                                                            errors.specifyContractScope
                                                        }
                                                        label="Specify Scope of Contract"
                                                        margin="normal"
                                                        name="specifyContractScope"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="specifyContractScope"
                                                        value={values.specifyContractScope}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                                <Box>
                                                    <FormControl fullWidth size="small" margin="normal">
                                                        <InputLabel id="demo-controlled-open-select-label">
                                                            Scope of Work
                                                        </InputLabel>
                                                        <Select
                                                            labelId="demo-controlled-open-select-label"
                                                            id="demo-controlled-open-select"
                                                            open={openWorkScope}
                                                            onClose={handleCloseWorkScope}
                                                            onOpen={handleOpenWorkScope}
                                                            value={workScope}
                                                            onChange={changeworkScopeHandler}
                                                            input={
                                                                <OutlinedInput
                                                                    id="demo-controlled-open-select-label"
                                                                    label="Scope of Work"
                                                                />
                                                            }
                                                        >
                                                            {workScopeList.map((item) => (
                                                                <MenuItem key={item} value={item}>
                                                                    {item}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                                {workScope == "Other" && (
                                                    <TextField
                                                        error={Boolean(
                                                            touched.specifyWorkScope &&
                                                            errors.specifyWorkScope
                                                        )}
                                                        fullWidth
                                                        helperText={
                                                            touched.specifyWorkScope &&
                                                            errors.specifyWorkScope
                                                        }
                                                        label="Specify Scope of Work"
                                                        margin="normal"
                                                        name="specifyWorkScope"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        type="specifyWorkScope"
                                                        value={values.specifyWorkScope}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <Stack spacing={2}>
                                                        <DesktopDatePicker
                                                            className="DateTimeHeight"
                                                            fullWidth
                                                            label="Project start date"
                                                            inputFormat="MM/dd/yyyy"
                                                            value={startDate}
                                                            onChange={changeStartDateHandler}
                                                            renderInput={(params) => (
                                                                <TextField {...params} />
                                                            )}
                                                        />
                                                        <DesktopDatePicker
                                                            className="DateTimeHeight"
                                                            fullWidth
                                                            label="Project end date"
                                                            inputFormat="MM/dd/yyyy"
                                                            value={endDate}
                                                            onChange={changeEndDateHandler}
                                                            renderInput={(params) => (
                                                                <TextField {...params} />
                                                            )}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
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
    );
};

export default ProjectDrawer;
