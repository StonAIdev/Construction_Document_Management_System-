import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../url";
import "monday-ui-react-core/dist/main.css";
import "../components/workspace/Workspace.css";
import Heading1 from "../Reusable Components/Headings/Heading1";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import { Tooltip } from "@mui/material";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import FormControl from "@mui/material/FormControl";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
import Menu from "@mui/material/Menu";
import Chip from "@mui/material/Chip";
import { getToken } from "../utils/GetToken";
import AvatarGroup from "@atlaskit/avatar-group";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faTimes,
  faCheck,
  faSpinner,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

import { loginRequest } from "../authConfig";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
var taskAllUSers = [];
var taskAllUSersAssigned = [];
var taskGroups = [];
var taskGroupsAssigned = [];
const filter = createFilterOptions();

export default function Workspace({
  user,
  userInfo,
  project,
  pca,
  socket,
  department,
  tabValue,
}) {
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

  const handleToggle = (value) => () => {};

  const [tasksDataFromDB, setTasksDataFromDB] = useState([]);
  const [assignedTasksDataFromDB, setAssignedTasksDataFromDB] = useState([]);

  const [taskId, setTaskId] = useState();

  var [isLoading, setLoading] = useState(false);

  const [filterButton, setFilterButton] = useState(false);

  const [statusicon, setStatusicon] = useState();
  const [statusClass, setstatusClass] = useState();

  const [taskType, setTaskType] = useState("");

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

  const { enqueueSnackbar } = useSnackbar();
  const handleClick = () => {
    enqueueSnackbar("I love snacks.");
  };

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  // console.log(tas)

  const [userTasks, setuserTasks] = useState(null);
  const [tasksGroups, setTasksGroups] = useState(null);

  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignedTasksFilter, setAssignedTasksFilter] = useState([]);

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

        setAssignedTasksDataFromDB(res.data.rows);
        setLoading(true);
      } catch (e) {
        console.log(e);
      }
    } else if (title === "filter") {
      const filteredUserIds = assignedTasksFilter.map((a) => a.user_id);

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

      setProjectUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const HandleNotifyByEmail = async (title) => {
    if (!token) {
      handleToken();
    }

    if (token) {
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

      var data = {
        message: {
          subject: subject,
          body: {
            contentType: "Text",
            content: message,
          },
          toRecipients: recvArr,
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
    }
    var res = null;
    if (taskType === "My Tasks") {
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
    } else if (taskType === "Assigned Task") {
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

  useEffect(() => {
    getUsers();
    getUserAssignedTasks("nofilter");
    getUserTasks("nofilter");
  }, [project, user, isLoading, filterButton, token]);

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

    setTaskType(type);

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
      setTaskType(type);

      setTaskName(name);
      setStatus({ label: status });
      setstartdate(startdate);
      setTaskDetails(description);
      setdeadline(deadline);
      setTaskId(task_id);
      setCurrent(current);

      const arr = [];
      if (current === "assignedtask") {
        tasksAssigned.forEach((t) => {
          if (task_id === t.task_id) {
            arr.push({
              user_id: t.user_id,
              username: t.username,
              email_address: t.email_address,
            });
          }
        });
        setAssignedTasks(arr);
      }

      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setDrawerTitle(title);

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
            {taskType === "Assigned Task" ? (
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
                    if (newValue && startdate && newValue < startdate) {
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
          {taskType === "Assigned Task" ? (
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

  const handleFilter = () => {
    setFilterButton(true);
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

  const handleTaskGroup = (e, option) => {
    setTaskGroups(option);
  };

  const handleSelectedAssignedTasks = (e, option) => {
    //console.log("option", option);
    setAssignedTasks(option);
  };

  const handleSelectedAssignedTasksFilter = (e, option) => {
    setAssignedTasksFilter(option);
  };

  const handleColorChange = (color) => {
    setcolorChange(color);
  };

  const handleTaskDelete = async (task_id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        var res = await axios.delete(url + "/Tasks/deleteTasks" + task_id, {
          headers: { token: user.token },
        });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
    }
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

    const filterUsers = (task_id) => {
      const taskAllUSersAssigned = tasksAssigned
        .filter((f) => f.task_id === task_id)
        .map((a) => {
          return {
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
        //console.log("Delete canceled");
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

      setChecked(newChecked);
    };
    return (
      <React.Fragment>
        <Menu
          id="basic-menu"
          anchorEl={anchorElMenu}
          open={openMenu}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <Grid container>
            <Grid item md={12} sx={{ padding: 2 }}>
              <TextField
                style={{ width: "100%" }}
                id="outlined-basic"
                label="Task Group"
                variant="outlined"
                size="small"
                className="textfieldStyles"
                onChange={(e) => handleChangedGroupName(e)}
                value={ChangedGroupName}
              />
            </Grid>
            <Grid item md={12}>
              <div style={{ textAlign: "center" }}>
                <input
                  type="color"
                  id="groupColor"
                  name="groupColor"
                  value={colorChangeTaskGroups}
                  onChange={(e) => {
                    handleColorChangeTaskGroups(e);
                  }}
                />
              </div>
            </Grid>

            <Grid item md={12} style={{ textAlign: "right", marginTop: 10 }}>
              <Divider />
              <IconButton onClick={() => handleGroupUpdate(row.group_id)}>
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
            </Grid>
          </Grid>
        </Menu>
        {!isLoading ? (
          <>
            <div className="d-flex flex-column">
              <div className="NotificationContainer">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="p-1">
                  <div style={{ width: 200 }}>
                    <Skeleton width={600} height={30} />
                  </div>
                </div>
              </div>
              <div className="">
                <hr className="NotificationDivider" />
              </div>
            </div>
          </>
        ) : title !== "assigned" ? (
          <>
            <TableRow sx={{ "& > *": {} }} className="my-3 ">
              <TableCell
                className=" TableHeadderRow"
                style={{ cursor: "pointer" }}
              >
                {/* ============================================ cell icon */}
                <IconButton
                  aria-label="expand row"
                  size="small"
                  className="tableIcon"
                  style={{ background: row.group_color }}
                  onClick={() => handleGroupOpen(row.group_id)}
                >
                  {checked.indexOf(row.group_id) !== -1 ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>

                <Heading1
                  color="grey"
                  paddingInline="10px"
                  paddingBlock=""
                  size="1.2rem"
                  weight="700"
                  JFcontent="left"
                  marginBottom="0px"
                  style={{
                    fontWeight: !row.is_read ? "bolder" : "normal",
                  }}
                >
                  {row.group_name}
                  <Chip
                    label={
                      remDuplicates.filter((f) => f.group_id === row.group_id)
                        .length
                    }
                    color="info"
                    size="small"
                    style={{ marginLeft: "5px" }}
                  />
                </Heading1>

                <div style={{ textAlign: "right" }}>
                  <IconButton
                    onClick={(event) =>
                      handleClick(event, row.group_name, row.group_color)
                    }
                  >
                    <EditIcon style={{ color: "var(--green)" }} />
                  </IconButton>
                </div>
                <div style={{ textAlign: "right" }}>
                  <IconButton
                    onClick={() => handleTaskGroupDelete(row.group_id)}
                  >
                    <DeleteForeverIcon style={{ color: "var(--warningRed)" }} />
                  </IconButton>
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  paddingBottom: 0,
                  paddingTop: 0,
                  marginBottom: "10px",
                }}
                colSpan={6}
              >
                <Collapse
                  in={checked.indexOf(row.group_id) !== -1 ? true : false}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ margin: 1, paddingBottom: 5 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          className=""
                          style={{ borderLeft: "4px solid " + colorChange }}
                        >
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Task
                            </Heading1>
                          </td>
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Status
                            </Heading1>
                          </td>
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Description
                            </Heading1>
                          </td>

                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Deadline
                            </Heading1>
                          </td>
                          <td></td>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{ wordBreak: "break-all" }}>
                        {remDuplicates
                          .filter((data) => {
                            if (search) {
                              return data.task_name
                                .toLowerCase()
                                .includes(search.toLowerCase());
                            } else {
                              return data;
                            }
                          })
                          .map((data, i) => {
                            if (data.group_id === row.group_id) {
                              //console.log("count", row.group_task_count);
                              return (
                                <TableRow
                                  className="CellDivision2"
                                  style={{
                                    borderLeft: "4px solid " + data.group_color,
                                  }}
                                  key={i}
                                >
                                  <td
                                    style={{
                                      borderLeft:
                                        "4px solid " + data.group_color + "",
                                      borderRadius: "8px",
                                      width: "20%",
                                    }}
                                  >
                                    <Heading1
                                      className="tableCellText"
                                      color="grey"
                                    >
                                      {" "}
                                      {data.task_name}
                                    </Heading1>
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    {data.task_status === "Canceled" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--warningRed)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faTimes}
                                            style={{
                                              color: "var(--warningRed)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status === "In Process" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--blue)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faSpinner}
                                            style={{
                                              color: "var(--blue)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status === "Completed" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--green)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{
                                              color: "var(--green)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status === "Delayed" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--warningRed)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{
                                              color: "var(--warningRed)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status != "Delayed" &&
                                    data.task_status != "Completed" &&
                                    data.task_status != "Canceled" &&
                                    data.task_status != "In Process" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--orange)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip title="Nil" placement="top">
                                          <FontAwesomeIcon
                                            icon={faExclamationTriangle}
                                            style={{ marginRight: "10px" }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}
                                  </td>
                                  <td style={{ width: "30%" }}>
                                    <Heading1
                                      className="tableCellText"
                                      color="grey"
                                    >
                                      {data.task_details}
                                    </Heading1>
                                  </td>
                                  <td style={{ width: "20%" }}>
                                    <Heading1
                                      className="tableCellText"
                                      color="grey"
                                    >
                                      {data.task_deadline?.substring(0, 10)}
                                    </Heading1>
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    <IconButton
                                      onClick={toggleDrawerUpdate(
                                        anchor,
                                        true,
                                        "Edit Task",
                                        data.task_name,
                                        data.task_status,
                                        data.task_details,
                                        data.task_deadline,
                                        data.task_startdate,
                                        data.task_id,
                                        "mytask",
                                        "My Tasks"
                                      )}
                                    >
                                      <EditIcon
                                        style={{ color: "var(--green)" }}
                                      />
                                    </IconButton>

                                    <IconButton
                                      onClick={() =>
                                        handleTaskDelete(data.task_id)
                                      }
                                    >
                                      <DeleteForeverIcon
                                        style={{ color: "var(--warningRed)" }}
                                      />
                                    </IconButton>
                                  </td>
                                </TableRow>
                              );
                            }
                          })}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        ) : (
          <>
            <TableRow sx={{ "& > *": {} }} className="my-3 ">
              <TableCell
                className=" TableHeadderRow"
                style={{ cursor: "pointer" }}
              >
                {/* ============================================ cell icon */}
                <IconButton
                  aria-label="expand row"
                  size="small"
                  className="tableIcon"
                  style={{ background: row.group_color }}
                  onClick={() => handleGroupOpen(row.group_id)}
                >
                  {checked.indexOf(row.group_id) !== -1 ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
                <Heading1
                  color="grey"
                  paddingInline="10px"
                  paddingBlock=""
                  size="1.2rem"
                  weight="500"
                  JFcontent="left"
                  marginBottom="0px"
                  style={{
                    fontWeight: !row.is_read ? "bolder" : "normal",
                  }}
                >
                  {row.group_name}
                  <Chip
                    label={
                      remDuplicatesAssigned.filter(
                        (f) => f.group_id === row.group_id
                      ).length
                    }
                    color="info"
                    size="small"
                    style={{ marginLeft: "5px" }}
                  />
                </Heading1>

                {row.group_id == 183 ? null : (
                  <div style={{ textAlign: "right" }}>
                    <IconButton
                      onClick={(event) =>
                        handleClick(event, row.group_name, row.group_color)
                      }
                    >
                      <EditIcon style={{ color: "var(--green)" }} />
                    </IconButton>
                  </div>
                )}

                <div style={{ textAlign: "right" }}>
                  {row.group_id == 210 ? null : (
                    <div style={{ textAlign: "right" }}>
                      <IconButton
                        onClick={() => handleTaskGroupDelete(row.group_id)}
                      >
                        <DeleteForeverIcon
                          style={{ color: "var(--warningRed)" }}
                        />
                      </IconButton>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  paddingBottom: 0,
                  paddingTop: 0,
                  marginBottom: "10px",
                }}
                colSpan={6}
              >
                <Collapse
                  in={checked.indexOf(row.group_id) !== -1 ? true : false}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box sx={{ margin: 1, paddingBottom: 5 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow
                          className=""
                          style={{ borderLeft: "4px solid " + colorChange }}
                        >
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Task
                            </Heading1>
                          </td>
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Status
                            </Heading1>
                          </td>
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Description
                            </Heading1>
                          </td>
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Assigned To
                            </Heading1>
                          </td>
                          <td>
                            <Heading1
                              color="grey"
                              paddingInline="5px"
                              paddingBlock="5px"
                              size="1.1rem"
                              weight="500"
                              JFcontent="left"
                              marginBottom="4px"
                            >
                              Deadline
                            </Heading1>
                          </td>
                          <td></td>
                        </TableRow>
                      </TableHead>
                      <TableBody className="">
                        {remDuplicatesAssigned
                          .filter((data) => {
                            if (search) {
                              return data.task_name
                                .toLowerCase()
                                .includes(search.toLowerCase());
                            } else {
                              return data;
                            }
                          })
                          .map((data, i) => {
                            if (data.group_name === row.group_name) {
                              return (
                                <TableRow
                                  key={i}
                                  className="CellDivision2"
                                  style={{
                                    borderLeft: "4px solid " + data.group_color,
                                  }}
                                >
                                  <td
                                    style={{
                                      borderLeft:
                                        "4px solid " + data.group_color + "",
                                      borderRadius: "8px",
                                      width: "10%",
                                    }}
                                  >
                                    <Heading1
                                      className="tableCellText"
                                      color="grey"
                                    >
                                      {data.task_name}
                                    </Heading1>
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    {data.task_status === "Canceled" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--warningRed)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faTimes}
                                            style={{
                                              color: "var(--warningRed)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status === "In Process" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--blue)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faSpinner}
                                            style={{
                                              color: "var(--blue)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status === "Completed" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--green)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{
                                              color: "var(--green)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status === "Delayed" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--warningRed)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip
                                          title={data.task_status}
                                          placement="top"
                                        >
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{
                                              color: "var(--warningRed)",
                                              marginRight: "10px",
                                            }}
                                          />
                                        </Tooltip>
                                      </Heading1>
                                    ) : null}

                                    {data.task_status != "Delayed" &&
                                    data.task_status != "Completed" &&
                                    data.task_status != "Canceled" &&
                                    data.task_status != "In Process" ? (
                                      <Heading1
                                        className="taskTablecell"
                                        style={{
                                          color: "var(--orange)",
                                          fontWeight: "600",
                                        }}
                                      >
                                        <Tooltip title="Nil" placement="top">
                                          <FontAwesomeIcon
                                            icon={faExclamationTriangle}
                                            style={{ marginRight: "10px" }}
                                          />
                                        </Tooltip>{" "}
                                      </Heading1>
                                    ) : null}
                                  </td>

                                  <td style={{ width: "20%" }}>
                                    <Heading1
                                      className="tableCellText"
                                      style={{ color: "grey" }}
                                    >
                                      {data.task_details}
                                    </Heading1>
                                  </td>
                                  <td key={i} style={{ width: "10%" }}>
                                    {filterUsers(data.task_id)}
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    <Heading1
                                      className="tableCellText"
                                      color="grey"
                                    >
                                      {data.task_deadline?.substring(0, 10)}
                                    </Heading1>
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    <IconButton
                                      onClick={toggleDrawerUpdate(
                                        anchor,
                                        true,
                                        "Edit Task",
                                        data.task_name,
                                        data.task_status,
                                        data.task_details,
                                        data.task_deadline,
                                        data.task_startdate,
                                        data.task_id,
                                        "assignedtask",
                                        "Assigned Task",
                                        tasksAssigned
                                      )}
                                    >
                                      <EditIcon
                                        style={{ color: "var(--green)" }}
                                      />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        handleTaskDelete(data.task_id)
                                      }
                                    >
                                      <DeleteForeverIcon
                                        style={{ color: "var(--warningRed)" }}
                                      />
                                    </IconButton>
                                  </td>
                                </TableRow>
                              );
                            }
                          })}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        )}
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      history: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    }).isRequired,
  };

  // -----------------------------------------------------------------------
  // =======================================================================

  const renderSwitch = (param) => {
    taskGroups = [
      ...new Map(
        tasksDataFromDB.map((item) => {
          item["group_task_count"] = 0;
          return [item["group_name"], item];
        })
      ).values(),
    ];

    taskGroupsAssigned = [
      ...new Map(
        assignedTasksDataFromDB.map((item) => [item["group_name"], item])
      ).values(),
    ];

    switch (param) {
      case "one":
        return (
          <div className="mytasks">
            {/* //============================================================================== */}
            {/* ----------------------------------- MUI My Tasks Table ----------------------------------- */}
            {/* ================================================================================ */}

            <TableContainer component={Paper}>
              <Table aria-label="collapsible table" className="">
                <TableBody>
                  {taskGroups.map((row, i) => (
                    <Row key={i} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );

      case "two":
        return (
          <div className="mytasks">
            {/* //============================================================================== */}
            {/* ----------------------------------- MUI Assigned Task Table ----------------------------------- */}
            {/* ================================================================================ */}

            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                {/* <TableHead className="">
                  <TableRow>
                    <TableCell>
                      <Heading1
                        color="var(--blue)"
                        paddingInline="10px"
                        paddingBlock=""
                        size="1.5rem"
                        weight="600"
                        JFcontent="left"
                        marginBottom="0px"
                        style={{ justifyContent: "space-between" }}
                      >
                        Assigned Tasks
                        <Fab
                          color="primary"
                          aria-label="add"
                          size="small"
                          onClick={toggleDrawer(
                            anchor,
                            true,
                            "Add Task",
                            "Assigned Task"
                          )}
                        >
                          <AddIcon />
                        </Fab>
                      </Heading1>
                    </TableCell>
                  </TableRow>
                </TableHead> */}
                <TableBody>
                  {taskGroupsAssigned.map((row, i) => (
                    <Row key={i} row={row} title="assigned" />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );

      default:
        return <Grid container></Grid>;
    }
  };
  // ============================================================================

  return (
    <div>
      <>
        <Grid item>
          <Container maxWidth={false}>{renderSwitch(tabValue)}</Container>
        </Grid>
      </>
    </div>
  );
}

const StatusList = [
  { label: "In Process" },
  { label: "Completed" },
  { label: "Delayed" },
  { label: "Canceled" },
];
