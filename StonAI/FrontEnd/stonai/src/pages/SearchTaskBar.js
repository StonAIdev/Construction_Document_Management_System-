import { Helmet } from "react-helmet";
import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { url } from "../url";
import "monday-ui-react-core/dist/main.css";
import "../components/workspace/Workspace.css";
import Heading1 from "../Reusable Components/Headings/Heading1";
import MenuIcon from "@mui/icons-material/Menu";
import ButtonTabs from "../components/ButtonTabs/ButtonTabs";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import { Tabs, Tab, Icon, Tooltip } from "@mui/material";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Fade from "react-reveal/Fade";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Skeleton from "@mui/material/Skeleton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Menu from "@mui/material/Menu";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import MenuList from "@mui/material/MenuList";
import Badge from "@mui/material/Badge";
import Chip from "@mui/material/Chip";
import { getToken } from "../utils/GetToken";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import AvatarGroup from "@atlaskit/avatar-group";
import { RANDOM_USERS } from "./data";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlusCircle,
    faFilter,
    faTimes,
    faCheck,
    faSpinner,
    faBatteryHalf,
    faClock,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import { loginRequest } from "../authConfig";
import AssignedTasksGraph from "../components/dashboard/Graphs/AssignedTasksGraph";
import { isValid } from "date-fns";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
var taskAllUSers = [];
var taskAllUSersAssigned = [];
var taskGroups = [];
var taskGroupsAssigned = [];
const filter = createFilterOptions();

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    // borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    border: "2px solid var(--orange)",
    borderRadius: "8px !important",

    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            width: "12ch",
            "&:focus": {
                width: "20ch",
            },
        },
    },
}));

export default function SearchTaskBar({
    permisions,
    user,
    userInfo,
    project,
    pca,
    socket,
    setSocket,
    department,
    tabValue,
}) {
    console.log("daefmrsmwr", department);
    // ============================================================================
    const [openDrawer, setOpenDrawer] = useState(false);

    const [openAlert, setOpenAlert] = useState(true);

    const [FiltersClicked, setFiltersClicked] = useState(false);
    const [current, setCurrent] = useState("");

    const [taskName, setTaskName] = useState("");
    const [taskNameFilter, setTaskNameFilter] = useState("");

    const [taskDetails, setTaskDetails] = useState("");
    const [taskGroupsState, setTaskGroups] = useState(null);
    const [status, setStatus] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [startdate, setstartdate] = useState(null);
    const [deadline, setdeadline] = useState(null);
    const [startdateFilter, setstartdateFilter] = useState(null);
    const [deadlineFilter, setdeadlineFilter] = useState(null);

    const [value, setValue] = useState([]);
    const [valueFilter, setValueFilter] = useState("");

    let [colorChange, setcolorChange] = useState("#ff6347");

    const [projectUsers, setProjectUsers] = useState([]);

    const [checked, setChecked] = React.useState([-1]);

    const handleToggle = (value) => () => { };

    const [tasksDataFromDB, setTasksDataFromDB] = useState([]);
    const [assignedTasksDataFromDB, setAssignedTasksDataFromDB] = useState([]);

    const [taskId, setTaskId] = useState();

    var [isLoading, setLoading] = useState(false);

    const [filterButton, setFilterButton] = useState(false);

    const [statusicon, setStatusicon] = useState();
    const [statusClass, setstatusClass] = useState();

    const [token, setToken] = useState(null);

    const [search, setSearchFilter] = useState("");

    const [deadlineValidation, setDeadlineValidation] = useState(false);
    const [startDateValidation, setStartDateValidation] = useState(false);

    const [startDateValidationFilter, setStartDateValidationFilter] =
        useState(false);
    const [deadlineValidationFilter, setDeadlineValidationFilter] =
        useState(false);

    const handleToken = async () => {
        const token = await getToken();
        setToken(token);
    };

    console.log(
        "filteresss",
        valueFilter,
        taskNameFilter,
        statusFilter,
        startdateFilter,
        deadlineFilter
    );

    // useEffect(() => {
    //     console.log("tab value: ", tabValue)
    // }, [tabValue]);

    const { enqueueSnackbar } = useSnackbar();
    const handleClick = () => {
        enqueueSnackbar("I love snacks.");
    };

    console.log("userInfouserInfo", userInfo);
    const handleClickVariant = (variant, title) => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(title, { variant });
    };

    // console.log(tas)

    const [userTasks, setuserTasks] = useState(null);
    const [tasksGroups, setTasksGroups] = useState(null);

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [assignedTasksFilter, setAssignedTasksFilter] = useState([]);

    console.log("assssd", assignedTasks);

    const getUserTasks = async (title) => {
        if (title === "nofilter") {
            try {
                var res = await axios.post(
                    url + "/Tasks/getTasks",
                    {
                        user_id: userInfo.user_id,
                        project_id: project.project_id,
                        department_id: department.department_id,
                    },
                    {
                        headers: { token: user.token },
                    }
                );

                setTasksDataFromDB(res.data.rows);
            } catch (e) {
                console.log(e);
            }
        } else if (title === "filter") {
            const filteredUserIds = assignedTasksFilter.map((a) => a.user_id);

            try {
                var res1 = await axios.post(
                    url + "/Tasks/getTasksFilter",
                    {
                        user_id: userInfo.user_id,
                        project_id: project.project_id,
                        group_name: valueFilter?.group_name,
                        department_id: department.department_id,
                        task_name: taskNameFilter,
                        assigned_task_userid: filteredUserIds,
                        status: statusFilter?.label,
                        start_date: startdateFilter,
                        deadline: deadlineFilter,
                    },
                    {
                        headers: { token: user.token },
                    }
                );
                console.log("resss", res1);
                setTasksDataFromDB(res1.data);
                setLoading(true);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const getUserAssignedTasks = async (title) => {
        if (title === "nofilter") {
            try {
                var res = await axios.post(
                    url + "/Tasks/getAssignedTasks",
                    {
                        user_id: userInfo.user_id,
                        project_id: project.project_id,
                        department_id: department.department_id,
                    },
                    {
                        headers: { token: user.token },
                    }
                );

                console.log("SAdsadsadfdf", res.data.rows);

                setAssignedTasksDataFromDB(res.data.rows);
                setLoading(true);
            } catch (e) {
                console.log(e);
            }
        } else if (title === "filter") {
            const filteredUserIds = assignedTasksFilter.map((a) => a.user_id);
            console.log("filteredUserIds", filteredUserIds);
            try {
                var res2 = await axios.post(
                    url + "/Tasks/getAssignedTasksFilter",
                    {
                        user_id: userInfo.user_id,
                        project_id: project.project_id,
                        group_name: valueFilter?.group_name,
                        task_name: taskNameFilter,
                        assigned_task_userid: filteredUserIds,
                        department_id: department.department_id,

                        status: statusFilter?.label,
                        start_date: startdateFilter,
                        deadline: deadlineFilter,
                    },
                    {
                        headers: { token: user.token },
                    }
                );
                console.log("newqnoiqwndoinqw", res2);
                setAssignedTasksDataFromDB(res2.data.rows);
            } catch (e) {
                console.log(e);
            }
        }
    };
    const getUsers = async () => {
        try {
            var res = await axios.post(
                url + "/Tasks/getUsers",
                {
                    project_id: project.project_id,
                },
                {
                    headers: { token: user.token },
                }
            );
            console.log("projesfsdfds", res.data);
            setProjectUsers(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const HandleNotifyByEmail = async (title) => {
        if (!token) {
            handleToken();
            // alert("User not signed in click on ok to sign user");
            // await pca
            //   .loginPopup(loginRequest)
            //   .then(function (response) {
            //     // success response
            //   })
            //   .catch(function (error) {
            //     console.log(error);
            //   });
        }

        if (token) {
            console.log("adsdsds", assignedTasks);
            let recvArr = [];
            assignedTasks.map((r) => {
                if (r.email_address && r.email_address.length > 0) {
                    recvArr.push({ emailAddress: { address: r.email_address } });
                }
            });
            var message = "";
            var subject = "";
            if (title === "add") {
                subject = `${taskName} is assigned to you`;
                message = `You have been assigned a new task ${taskName} with task group ${value.group_name} with ${deadline} as deadline`;
            } else if (title === "update") {
                subject = `${taskName} is updated`;
                message = `Task ${taskName} is updated`;
            }

            // let ccArr = [];
            // cc.map((r) => {
            //   ccArr.push({ emailAddress: { address: r } });
            // });

            var data = {
                message: {
                    subject: subject,
                    body: {
                        contentType: "Text",
                        content: message,
                    },
                    toRecipients: recvArr,
                    // ccRecipients: ccArr,
                    // attachments: [],
                },
                saveToSentItems: "true",
            };

            var config = {
                method: "post",
                url: "https://graph.microsoft.com/v1.0/me/sendMail",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                data: data,
            };

            console.log("config", config);

            await axios(config)
                .then(function (response) {
                    handleClickVariant(
                        "success",
                        "Notification successfully sent by email"
                    );
                })
                .catch(function (error) {
                    alert("User not signed in click on ok to sign user");

                    pca
                        .loginPopup(loginRequest)
                        .then(function (response) {
                            // success response
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });
        }
    };
    const addNotifications = async (task_id, title) => {
        var message = "";
        if (title === "add") {
            message = `You have been assigned a new task ${taskName} with task group ${value.group_name}`;
        } else if (title === "update") {
            message = `Task ${taskName} is updated`;
        }
        try {
            const response = await axios.post(
                url + "/Notification/addNotificationsTask",
                {
                    user: user,
                    message: message,
                    receivers: assignedTasks,
                    task_id: task_id,
                },
                { headers: { token: user.token } }
            );
            handleClickVariant("success", "Notification successfully sent by StonAI");
        } catch (error) {
            console.log(error.response);
            return error.response;
        }
    };
    const Notify = async (task_id, title) => {
        const res = await addNotifications(task_id, title);
        socket.emit("sendNotification", {
            sender: user,
            receivers: assignedTasks,
        });
    };

    const handleTaskCreation = async () => {
        if (colorChange === "#ff6347" && Object.keys(value).length > 1) {
            colorChange = value.group_color;
            console.log("color", colorChange);
        }
        var res = null;
        if (tabValue === "one") {
            try {
                res = await axios.post(
                    url + "/Tasks/createTasks",
                    {
                        user_id: userInfo.user_id,
                        project_id: project.project_id,
                        task_name: taskName,
                        task_status: status.label,
                        task_deadline: deadline,
                        group_name: value.group_name,
                        group_color: colorChange,
                        task_details: taskDetails,
                        task_startdate: startdate,
                        group_id: value.group_id,
                        department_id: department.department_id,
                    },
                    {
                        headers: { token: user.token },
                    }
                );
                handleClickVariant("success", "Tasks created Sucessfully");

                // console.log("radio", radioButtonValue);

                // handleClickVariant("success", "Tasks created Sucessfully");
                // if (radioButtonValue === "By Email") {
                //   HandleNotifyByEmail("add");
                // } else if (radioButtonValue === "Both") {
                //   HandleNotifyByEmail("add");
                //   Notify(res.data, "add");
                // } else if (radioButtonValue === "By StonAI") {
                //   Notify(res.data, "add");
                // }
                setTaskName("");
                setStatus("");
                setstartdate(null);
                setTaskDetails("");
                setdeadline(null);
                setTaskId("");
                setCurrent("");
                setAssignedTasks([]);
                setValue([]);
                setStartDateValidation(false);
                setDeadlineValidation(false);
                setState({ ...state, [anchor]: openDrawer });
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        } else if (tabValue === "two") {
            try {
                res = await axios.post(
                    url + "/Tasks/createAssignedTasks",
                    {
                        user_id: userInfo.user_id,
                        project_id: project.project_id,
                        task_name: taskName,
                        task_status: status.label,
                        task_assigned_to: assignedTasks,
                        department_id: department.department_id,

                        task_deadline: deadline,
                        group_name: value.group_name,
                        group_color: colorChange,
                        task_details: taskDetails,
                        task_startdate: startdate,
                        group_id: value.group_id,
                    },
                    {
                        headers: { token: user.token },
                    }
                );

                console.log("radio", radioButtonValue);

                handleClickVariant("success", "Tasks created Sucessfully");
                if (radioButtonValue === "By Email") {
                    HandleNotifyByEmail("add");
                } else if (radioButtonValue === "Both") {
                    HandleNotifyByEmail("add");
                    Notify(res.data, "add");
                } else if (radioButtonValue === "By StonAI") {
                    Notify(res.data, "add");
                }
                setTaskName("");
                setStatus("");
                setstartdate(null);
                setTaskDetails("");
                setdeadline(null);
                setTaskId("");
                setCurrent("");
                setAssignedTasks([]);
                setValue([]);
                setState({ ...state, [anchor]: openDrawer });
                setLoading(false);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const handleTaskUpdate = async () => {
        console.log("assignedssadsa", assignedTasks);

        try {
            var res = await axios.post(
                url + "/Tasks/updateTask",
                {
                    user_id: userInfo.user_id,
                    project_id: project.project_id,
                    task_name: taskName,
                    task_status: status?.label,
                    task_deadline: deadline,
                    task_assigned_to: assignedTasks,
                    task_details: taskDetails,
                    task_startdate: startdate,
                    taskId: taskId,
                    tabValue: tabValue,
                    department_id: department.department_id,
                },
                {
                    headers: { token: user.token },
                }
            );

            handleClickVariant("success", "Task Updated Sucessfully");
            setLoading(false);
            if (radioButtonValue === "By Email") {
                HandleNotifyByEmail("update");
            } else if (radioButtonValue === "Both") {
                HandleNotifyByEmail("update");
                Notify(taskId, "update");
            } else if (radioButtonValue === "By StonAI") {
                Notify(taskId, "update");
            }
            setValue([]);
        } catch (e) {
            console.log(e);
        }
    };

    //-------------------------- Drawer -----------------------------

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const [DrawerTitle, setDrawerTitle] = useState("");
    const anchor = "right";
    const toggleDrawer = (anchor, open, title, type) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setDrawerTitle(title);

        // setTaskType(type);

        setState({ ...state, [anchor]: open });
    };

    const toggleDrawerClose = (anchor, open, title) => (event) => {
        if (
            event &&
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }
        setDrawerTitle(title);
        setTaskName("");
        setStatus("");
        setstartdate(null);
        setTaskDetails("");
        setdeadline(null);
        setTaskId("");
        setCurrent("");
        setAssignedTasks([]);
        setStartDateValidation(false);
        setDeadlineValidation(false);
        setValue([]);

        setState({ ...state, [anchor]: open });
    };

    const toggleDrawerUpdate =
        (
            anchor,
            open,
            title,
            name,
            status,
            description,
            deadline,
            startdate,
            task_id,
            current,
            type,
            tasksAssigned
        ) =>
            (event) => {

                // setTaskType(type);

                setTaskName(name);
                setStatus({ label: status });
                setstartdate(startdate);
                setTaskDetails(description);
                setdeadline(deadline);
                setTaskId(task_id);
                setCurrent(current);

                const arr = [];
                if (current === "assignedtask") {
                    console.log("callleddd", taskAllUSersAssigned);
                    tasksAssigned.forEach((t) => {
                        if (task_id === t.task_id) {
                            console.log("tasks hain", t);
                            arr.push({
                                user_id: t.user_id,
                                username: t.username,
                                email_address: t.email_address,
                            });
                        }
                    });
                    setAssignedTasks(arr);
                }
                console.log("sadsa", assignedTasks);

                if (
                    event &&
                    event.type === "keydown" &&
                    (event.key === "Tab" || event.key === "Shift")
                ) {
                    return;
                }
                setDrawerTitle(title);
                console.log("assignedssadsa", assignedTasks);

                setState({ ...state, [anchor]: open });
            };

    const [radioButtonValue, setRadioButtonValue] = React.useState("By StonAI");

    const handleRadioButtonChange = (event) => {
        setRadioButtonValue(event.target.value);
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            // onKeyDown={toggleDrawer(anchor, false)}
            className="drawerContainer"
        >
            <div className="p-3 DrawerFlex ">
                <div className="w-100 mr-3">
                    <Heading1
                        color="black"
                        paddingBlock=".4rem"
                        size="4vh"
                        weight="500"
                        marginBotto1m="2vh"
                        JFcontent="left"
                    >
                        {DrawerTitle}
                    </Heading1>
                    {DrawerTitle === "Add Task" ? (
                        <>
                            <Autocomplete
                                onChange={(event, newValue) => {
                                    if (typeof newValue === "string") {
                                        setValue({
                                            group_name: newValue,
                                        });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        setValue({
                                            group_name: newValue.inputValue,
                                        });
                                    } else {
                                        setValue(newValue);
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some(
                                        (option) => inputValue === option.group_name
                                    );
                                    if (inputValue !== "" && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            group_name: `Add "${inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="free-solo-with-text-demo"
                                options={tabValue === "two" ? taskGroupsAssigned : taskGroups}
                                size="small"
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.group_name;
                                }}
                                renderOption={(props, option) => (
                                    <li {...props}>{option.group_name}</li>
                                )}
                                sx={{ width: "100%" }}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField {...params} label="Task Groups" />
                                )}
                            />
                            <div className="d-flex align-items-center justify-content-start mb-3 ml-2">
                                {value && Object.keys(value).length === 1 ? (
                                    <>
                                        <Heading1
                                            color="black"
                                            paddingBlock="0px"
                                            size="1em"
                                            weight="400"
                                            width="fit-content"
                                            marginBotto1m="0px"
                                            JFcontent="left"
                                            className=" m-0 mr-2"
                                        >
                                            Group Color
                                        </Heading1>
                                        <input
                                            type="color"
                                            id="groupColor"
                                            name="groupColor"
                                            value={colorChange}
                                            onChange={(e) => {
                                                handleColorChange(e.target.value);
                                            }}
                                        />
                                    </>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                    <TextField
                        id="outlined-basic"
                        label="Task Name"
                        variant="outlined"
                        size="small"
                        className="textfieldStyles"
                        onChange={(e) => handleTaskName(e)}
                        value={taskName}
                    />
                    <TextField
                        id="BodyText"
                        label="Task Details"
                        multiline
                        minRows="4"
                        rows={4}
                        className="textfieldStyles"
                        value={taskDetails}
                        onChange={handleTaskDetails}
                    />

                    <div className="d-flex justify-content-between textFieldSplit">
                        <Autocomplete
                            disablePortal
                            id="statusFilter"
                            style={{ marginRight: "3px", width: "100%", marginBottom: "2vh" }}
                            size="small"
                            options={StatusList}
                            value={status}
                            onChange={(e, option) => {
                                handlestatus(e, option);
                            }}
                            renderInput={(params) => <TextField {...params} label="Status" />}
                        />
                        {tabValue === "two" ? (
                            <Autocomplete
                                onChange={(e, option) => {
                                    handleSelectedAssignedTasks(e, option);
                                }}
                                multiple
                                size="small"
                                style={{ marginLeft: "3px", width: "100%" }}
                                id="tags-outlined"
                                options={projectUsers}
                                getOptionLabel={(option) => option.username}
                                isOptionEqualToValue={(option, value) =>
                                    value.user_id === option.user_id
                                }
                                value={assignedTasks}
                                // defaultValue={projectUsers.find((v) => {
                                //   console.log("v", v);
                                //   return v;
                                // })}
                                // disableCloseOnSelect
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            // style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.username}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Assigned To"
                                        placeholder="Users"
                                    />
                                )}
                            />
                        ) : null}
                    </div>

                    <div className="d-flex justify-content-between textFieldSplit">
                        <div
                            style={{ marginRight: "3px", marginBottom: "2vh", width: "100%" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
                                <DatePicker
                                    label="Start Date"
                                    value={startdate}
                                    onChange={(newValue) => {
                                        if (newValue && deadline && newValue > deadline) {
                                            console.log("validationInside", newValue, startdate);

                                            setStartDateValidation(true);
                                        } else {
                                            setDeadlineValidation(false);
                                            setStartDateValidation(false);
                                        }
                                        setstartdate(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            error={startDateValidation}
                                            helperText={
                                                startDateValidation
                                                    ? "Start Date Should not be greater then Deadline"
                                                    : null
                                            }
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>

                        <div
                            style={{ marginLeft: "3px", marginBottom: "2vh", width: "100%" }}
                        >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Deadline"
                                    size="small"
                                    value={deadline}
                                    onChange={(newValue) => {
                                        console.log("validation", newValue, startdate);
                                        if (newValue && startdate && newValue < startdate) {
                                            console.log("validationInside", newValue, startdate);

                                            setDeadlineValidation(true);
                                        } else {
                                            setDeadlineValidation(false);
                                            setStartDateValidation(false);
                                        }
                                        setdeadline(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            size="small"
                                            error={deadlineValidation}
                                            helperText={
                                                deadlineValidation
                                                    ? "Deadline Should not be lesser then Start Date"
                                                    : null
                                            }
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    {tabValue === "two" ? (
                        <div
                            className="pl-2 w-100"
                            style={{ borderBottom: "2px solid #c0c0c07a" }}
                        >
                            <FormControl component="fieldset">
                                <FormLabel component="legend" size="small">
                                    Notify
                                </FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="gender"
                                    name="controlled-radio-buttons-group"
                                    value={radioButtonValue}
                                    onChange={handleRadioButtonChange}
                                >
                                    <FormControlLabel
                                        value="By StonAI"
                                        control={<Radio />}
                                        label="By StonAI"
                                    />

                                    <FormControlLabel
                                        value="By Email"
                                        control={<Radio />}
                                        label="By Email"
                                    />
                                    <FormControlLabel
                                        value="Both"
                                        control={<Radio />}
                                        label="Both"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Collapse in={openAlert}>
                                {radioButtonValue === "By Email" || radioButtonValue === "Both"
                                    ? assignedTasks && assignedTasks.length > 0
                                        ? assignedTasks.map((r) => {
                                            if (r.email_address === null) {
                                                return (
                                                    <Alert
                                                        severity="warning"
                                                        action={
                                                            <IconButton
                                                                aria-label="close"
                                                                color="inherit"
                                                                size="small"
                                                                onClick={() => {
                                                                    setOpenAlert(false);
                                                                }}
                                                            >
                                                                <CloseIcon fontSize="inherit" />
                                                            </IconButton>
                                                        }
                                                        sx={{ mb: 2 }}
                                                    >
                                                        Following accounts doesn't have email_address
                                                        associated with their accounts and won't get
                                                        notication by email:{" "}
                                                        <strong> {r.username + " "} </strong>
                                                    </Alert>
                                                );
                                            }
                                        })
                                        : null
                                    : null}
                            </Collapse>
                        </div>
                    ) : null}

                    <div className="d-flex align-items-end justify-content-end w-100 m-0">
                        {DrawerTitle === "Add Task" ? (
                            <Button
                                variant="outlined"
                                size="small"
                                borderRadius="8px"
                                onClick={handleTaskCreation}
                                sx={{
                                    borderRadius: "8px",
                                    color: "var(--blue)",
                                    fontWeight: "bolder",
                                    borderWidth: "2px",
                                    marginTop: 1,
                                }}
                                disabled={
                                    !taskName ||
                                        !startdate ||
                                        !deadline ||
                                        !taskDetails ||
                                        !value ||
                                        deadlineValidation ||
                                        startDateValidation
                                        ? true
                                        : false
                                }
                                endIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                            >
                                ADD
                            </Button>
                        ) : (
                            <IconButton onClick={() => handleTaskUpdate(taskId)}>
                                <ButtonStyled
                                    paddingInline=".8rem"
                                    paddingBlock="0.3rem"
                                    borderRadius="8px"
                                    width="fit-content"
                                    style={{ cursor: "pointer" }}
                                    className="FiltersClicked m-0"
                                >
                                    UPDATE
                                </ButtonStyled>
                            </IconButton>
                        )}
                    </div>
                </div>
                <div className="sideline"></div>
            </div>
        </Box>
    );
    // -------------------------- Dropdowns --------------------------
    const handlestatus = (e, option) => {
        setStatus(option);
    };

    const handlestatusFilter = (e, option) => {
        setStatusFilter(option);
    };

    const handleFilterClear = () => {
        setValueFilter("");
        setSearchFilter("");
        setAssignedTasksFilter([]);
        setTaskNameFilter("");
        setStatusFilter("");
        setstartdateFilter(null);
        setdeadlineFilter(null);
        setDeadlineValidationFilter(false);
        setStartDateValidationFilter(false);
        setFilterButton(!filterButton);
    };

    const handleTaskName = (event) => {
        setTaskName(event.target.value);
    };

    const handleTaskNameFilter = (event) => {
        setTaskNameFilter(event.target.value);
    };

    const handleTaskDetails = (event) => {
        setTaskDetails(event.target.value);
    };

    const handleSelectedAssignedTasks = (e, option) => {
        console.log("option", option);
        setAssignedTasks(option);
    };

    const handleSelectedAssignedTasksFilter = (e, option) => {
        setAssignedTasksFilter(option);
    };

    const handleColorChange = (color) => {
        setcolorChange(color);
    };

    // ============================== MUI Table ==============================
    // -----------------------------------------------------------------------

    function Row(props) {
        const tasks = tasksDataFromDB.map((t) => {
            return {
                user_id: t.user_id,
                task_id: t.task_id,
                group_name: t.group_name,
                task_name: t.task_name,
                task_status: t.task_status,
                task_discription: t.task_details,
                task_assigned_to: t.username,
                task_deadline: t.task_deadline,
                group_color: t.group_color,
                email_address: t.email_address,
            };
        });

        const tasksAssigned = assignedTasksDataFromDB.map((t) => {
            return {
                user_id: t.user_id,
                task_id: t.task_id,
                group_name: t.group_name,
                task_name: t.task_name,
                task_status: t.task_status,
                task_discription: t.task_details,
                task_assigned_to: t.username,
                task_deadline: t.task_deadline,
                group_color: t.group_color,
                username: t.username,
            };
        });

        console.log();

        const remDuplicates = [
            ...new Map(tasksDataFromDB.map((v) => [v.task_id, v])).values(),
        ];

        const remDuplicatesAssigned = [
            ...new Map(assignedTasksDataFromDB.map((v) => [v.task_id, v])).values(),
        ];

        tasks.map((a) => {
            return {
                user_id: a.user_id,
                username: a.task_assigned_to,
                task_id: a.task_id,
                email_address: a.email_address,
            };
        });

        // taskAllUSers = tasks.map((a) => {
        //   return {
        //     user_id: a.user_id,
        //     username: a.task_assigned_to,
        //     task_id: a.task_id,
        //   };
        // });
        // taskAllUSersAssigned = tasksAssigned.map((a) => {
        //   return {
        //     user_id: a.user_id,
        //     username: a.task_assigned_to,
        //     task_id: a.task_id,
        //     email_address: a.email_address,
        //     name: a.task_assigned_to,
        //   };
        // });

        const filterUsers = (task_id) => {
            const taskAllUSersAssigned = tasksAssigned
                .filter((f) => f.task_id === task_id)
                .map((a) => {
                    return {
                        // user_id: a.user_id,
                        // username: a.task_assigned_to,
                        // task_id: a.task_id,
                        // email_address: a.email_address,
                        name: a.task_assigned_to,
                    };
                });

            return (
                <AvatarGroup
                    appearance="stack"
                    data={taskAllUSersAssigned}
                    maxCount={3}
                    size="small"
                />
            );
        };

        const { row, title } = props;
        const [anchorElMenu, setAnchorElMenu] = React.useState(null);
        const [ChangedGroupName, setChangedGroupName] = React.useState("");

        const [colorChangeTaskGroups, setColorChangeTaskGroups] =
            React.useState("");

        const handleChangedGroupName = (event) => {
            setChangedGroupName(event.target.value);
        };
        const handleColorChangeTaskGroups = (event) => {
            setColorChangeTaskGroups(event.target.value);
        };
        const openMenu = Boolean(anchorElMenu);
        const handleClick = (event, name, color) => {
            setChangedGroupName(name);
            setColorChangeTaskGroups(color);
            setAnchorElMenu(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorElMenu(null);
        };

        const handleGroupUpdate = async (group_id) => {
            console.log(
                "ASDsacas",
                ChangedGroupName,
                group_id,
                colorChangeTaskGroups
            );
            try {
                var res = await axios.post(
                    url + "/Tasks/updateTaskGroup",
                    {
                        group_name: ChangedGroupName,
                        group_color: colorChangeTaskGroups,
                        group_id: group_id,
                    },
                    {
                        headers: { token: user.token },
                    }
                );
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        };

        const handleTaskGroupDelete = async (group_id) => {
            console.log("groupdel", group_id);

            if (
                window.confirm(
                    "Are you sure you want to delete this group? All the tasks associated with this task group will alse get deleted"
                )
            ) {
                try {
                    var res = await axios.delete(url + "/Tasks/groupDelete" + group_id, {
                        headers: { token: user.token },
                    });

                    handleClickVariant("success", "Task group deleted Sucessfully");
                    setLoading(false);
                } catch (e) {
                    console.log(e);
                }
            } else {
                // Do nothing!
                console.log("Delete canceled");
            }
        };

        const handleGroupOpen = (value) => {
            const currentIndex = checked.indexOf(value);
            const newChecked = [...checked];

            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }

            console.log("checkeddd", newChecked);

            setChecked(newChecked);
            // try {
            //   var res = await axios.post(
            //     url + "/Tasks/updateTaskGroupStatus",
            //     {
            //       group_id: group_id,
            //     },
            //     {
            //       headers: { token: user.token },
            //     }
            //   );
            // } catch (e) {
            //   console.log(e);
            // }
        };

        console.log("taskGroupsAssigned", taskGroupsAssigned);
    }

    // -----------------------------------------------------------------------
    // =======================================================================

    return (

        <Grid item>
            {/* ************************************** FILTER ************************************** */}
            <Fade right>
                <div
                    className={`${FiltersClicked
                        ? "filtersContainer filterHeight "
                        : "filtersContainer"
                        }`}
                >
                    <Grid container direction="column" spacing={0.5}>
                        <Grid
                            container
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                        >
                            <Grid item className="">

                                <Button
                                    variant="contained"
                                    size="small"
                                    className="AddtaskButton"
                                    onClick={toggleDrawer(
                                        anchor,
                                        true,
                                        "Add Task",
                                        "My Tasks"
                                    )}
                                    sx={{
                                        paddingBlock: "6px",
                                        borderRadius: "8px !important",
                                    }}
                                >
                                    Add Task
                                </Button>

                                <SwipeableDrawer
                                    anchor={anchor}
                                    open={state[anchor]}
                                    onClose={toggleDrawerClose(anchor, false)}
                                    onOpen={toggleDrawer(anchor, true)}
                                >
                                    {list(anchor)}
                                </SwipeableDrawer>
                            </Grid>
                            <Grid item>
                                <Search>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search"
                                        inputProps={{ "aria-label": "search" }}
                                        style={{ height: "32px" }}
                                        onChange={(e) => {
                                            console.log("searchhhh", search);
                                            setSearchFilter(e.target.value);
                                        }}
                                        value={search}
                                    />
                                </Search>
                            </Grid>

                            <Grid item>
                                <ButtonStyled
                                    paddingInline=".8rem"
                                    paddingBlock="0.3rem"
                                    borderRadius="8px"
                                    width="fit-content"
                                    style={{ cursor: "pointer" }}
                                    className={`${FiltersClicked
                                        ? "FiltersClicked mx-1"
                                        : "FiltersUnclicked mx-1"
                                        }`}
                                    onClick={(e) => {
                                        setFiltersClicked(!FiltersClicked);
                                    }}
                                >
                                    Filters
                                </ButtonStyled>
                            </Grid>
                        </Grid>

                        <Grid>
                            {FiltersClicked && (
                                <div className="FiltersDiv">
                                    <div
                                        className="fadein"
                                        style={{
                                            marginRight: "10px",
                                            animationDelay: "0.2s",
                                            width: 180,
                                        }}
                                    >
                                        <Autocomplete
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === "string") {
                                                    setValueFilter({
                                                        group_name: newValue,
                                                    });
                                                } else if (newValue && newValue.inputValue) {
                                                    // Create a new value from the user input
                                                    setValueFilter({
                                                        group_name: newValue.inputValue,
                                                    });
                                                } else {
                                                    setValueFilter(newValue);
                                                }
                                            }}
                                            value={valueFilter}
                                            filterOptions={(options, params) => {
                                                const filtered = filter(options, params);

                                                const { inputValue } = params;
                                                // Suggest the creation of a new value
                                                const isExisting = options.some(
                                                    (option) => inputValue === option.group_name
                                                );
                                                if (inputValue !== "" && !isExisting) {
                                                    filtered.push({
                                                        inputValue,
                                                        group_name: `Add "${inputValue}"`,
                                                    });
                                                }

                                                return filtered;
                                            }}
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            id="free-solo-with-text-demo"
                                            options={
                                                tabValue === "two"
                                                    ? taskGroupsAssigned
                                                    : taskGroups
                                            }
                                            size="small"
                                            getOptionLabel={(option) => {
                                                // Value selected with enter, right from the input
                                                if (typeof option === "string") {
                                                    return option;
                                                }
                                                // Add "xxx" option created dynamically
                                                if (option.inputValue) {
                                                    return option.inputValue;
                                                }
                                                // Regular option
                                                return option.group_name;
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props}>{option.group_name}</li>
                                            )}
                                            sx={{ width: "100%" }}
                                            freeSolo
                                            renderInput={(params) => (
                                                <TextField {...params} label="Task Groups" />
                                            )}
                                        />
                                    </div>
                                    <div
                                        className="fadein"
                                        style={{
                                            marginRight: "10px",
                                            animationDelay: "0.2s",
                                            width: 180,
                                        }}
                                    >
                                        <TextField
                                            id="outlined-basic"
                                            label="Task Name"
                                            variant="outlined"
                                            size="small"
                                            className="textfieldStyles"
                                            onChange={(e) => handleTaskNameFilter(e)}
                                            value={taskNameFilter}
                                        />
                                    </div>

                                    <div
                                        className="fadein"
                                        style={{
                                            marginRight: "10px",
                                            animationDelay: "0.2s",
                                            width: 150,
                                        }}
                                    >
                                        <Autocomplete
                                            disablePortal
                                            id="statusFilter"
                                            size="small"
                                            options={StatusList}
                                            value={statusFilter}
                                            onChange={(e, option) => {
                                                handlestatusFilter(e, option);
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Status" />
                                            )}
                                        />
                                    </div>
                                    {tabValue === "two" ? (
                                        <div
                                            className="fadein"
                                            style={{
                                                marginRight: "10px",
                                                animationDelay: "0.2s",
                                                width: 220,
                                            }}
                                        >
                                            <Autocomplete
                                                onChange={(e, option) => {
                                                    handleSelectedAssignedTasksFilter(e, option);
                                                }}
                                                size="small"
                                                id="tags-outlined"
                                                options={projectUsers}
                                                getOptionLabel={(option) => option?.username}
                                                isOptionEqualToValue={(option, value) =>
                                                    value.user_id === option.user_id
                                                }
                                                multiple
                                                value={assignedTasksFilter}
                                                // defaultValue={projectUsers.find((v) => {
                                                //   console.log("v", v);
                                                //   return v;
                                                // })}
                                                // disableCloseOnSelect
                                                renderOption={(props, option, { selected }) => (
                                                    <li
                                                        {...props}
                                                        style={{
                                                            paddingLeft: "0px",
                                                            wordBreak: "break-all",
                                                        }}
                                                    >
                                                        <Checkbox
                                                            icon={icon}
                                                            checkedIcon={checkedIcon}
                                                            // style={{ marginRight: 8 }}
                                                            checked={selected}
                                                        />
                                                        {option.username}
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Assigned To"
                                                        placeholder="Users"
                                                    />
                                                )}
                                            />
                                        </div>
                                    ) : null}

                                    <div
                                        className="fadein  "
                                        style={{
                                            marginRight: "10px",
                                            animationDelay: "0.4s",
                                            width: 150,
                                        }}
                                    >
                                        <Box sx={{ minWidth: 120 }}>
                                            <div>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDateFns}
                                                    className=""
                                                >
                                                    <DatePicker
                                                        label="Start Date"
                                                        size="small"
                                                        value={startdateFilter}
                                                        onChange={(newValue) => {
                                                            if (
                                                                newValue &&
                                                                deadlineFilter &&
                                                                newValue > deadlineFilter
                                                            ) {
                                                                setStartDateValidationFilter(true);
                                                            } else {
                                                                setDeadlineValidationFilter(false);
                                                                setStartDateValidationFilter(false);
                                                            }
                                                            setstartdateFilter(newValue);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                size="small"
                                                                error={startDateValidationFilter}
                                                                helperText={
                                                                    startDateValidationFilter
                                                                        ? "Start Date Should not be greater then Deadline"
                                                                        : null
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </Box>
                                    </div>

                                    <div
                                        className="fadein"
                                        style={{
                                            marginRight: "10px",
                                            animationDelay: ".6s",
                                            width: 150,
                                        }}
                                    >
                                        <div>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDateFns}
                                            >
                                                <DatePicker
                                                    label="Deadline"
                                                    size="small"
                                                    value={deadlineFilter}
                                                    onChange={(newValue) => {
                                                        if (
                                                            newValue &&
                                                            startdateFilter &&
                                                            newValue < startdateFilter
                                                        ) {
                                                            setDeadlineValidationFilter(true);
                                                        } else {
                                                            setDeadlineValidationFilter(false);
                                                            setStartDateValidationFilter(false);
                                                        }
                                                        setdeadlineFilter(newValue);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            size="small"
                                                            error={deadlineValidationFilter}
                                                            helperText={
                                                                deadlineValidationFilter
                                                                    ? "Deadline Should not be lesser then Start Date"
                                                                    : null
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </div>

                                    <div
                                        className="fadein"
                                        style={{
                                            marginRight: "10px",
                                            animationDelay: ".6s",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "left",
                                            bgcolor: "black",
                                            width: "100%",
                                            marginLeft: "10px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="info"
                                            sx={{ background: "var(--blue)" }}
                                            className="MUIButtonsize"
                                            onClick={() =>
                                                tabValue === "one"
                                                    ? getUserTasks("filter")
                                                    : getUserAssignedTasks("filter")
                                            }
                                            disabled={false}
                                            endIcon={<FontAwesomeIcon icon={faFilter} />}
                                        >
                                            APPLY
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="info"
                                            className="MUIButtonsize"
                                            sx={{ marginLeft: "5px" }}
                                            borderRadius="8px"
                                            onClick={handleFilterClear}
                                            disabled={false}
                                            endIcon={<FontAwesomeIcon icon={faTimes} />}
                                        >
                                            CLEAR
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Grid>
    );
}

const StatusList = [
    { label: "In Process" },
    { label: "Completed" },
    { label: "Delayed" },
    { label: "Canceled" },
];
