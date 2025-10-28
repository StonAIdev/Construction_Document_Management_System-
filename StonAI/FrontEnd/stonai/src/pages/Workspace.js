import { Helmet } from "react-helmet";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../url";
import "monday-ui-react-core/dist/main.css";
import "../components/workspace/Workspace.css";
import Heading1 from "../Reusable Components/Headings/Heading1";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Button,
  Tabs,
  Tab,
  TableContainer,
  TableBody,
  Stack,
  InputLabel,
  Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import TextField from "@mui/material/TextField";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import FormControl from "@mui/material/FormControl";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbar } from "notistack";
import { getToken } from "../utils/GetToken";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";
import FiltersComponent from "../components/workspace/FiltersComponent";
import Row from "../components/workspace/Row";
import DrawerComponent from "../components/workspace/DrawerCommentsComponent";
import "../components/workspace/Attachments/UploadCard.css";
import UploadCard from "../components/workspace/Attachments/UploadCard";
import moment from "moment";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

var taskGroups = [];
var taskGroupsAssigned = [];
var taskGroupsDrafted = [];
const filter = createFilterOptions();
var start = 0;
var end = 0;
export default function Workspace({
  permisions,
  user,
  userInfo,
  project,
  pca,
  socket,
  setSocket,
  department,
  userPosition,
}) {
  // ============================================================================
  const [tabValue, setTabValue] = useState("one");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [FiltersClicked, setFiltersClicked] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskNameFilter, setTaskNameFilter] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [status, setStatus] = useState({ label: "" });
  const [statusReal, setStatusReal] = useState({ label: "" });
  const [startdate, setstartdate] = useState(null);
  const [deadline, setdeadline] = useState(null);
  const [value, setValue] = useState([]);
  let [colorChange, setcolorChange] = useState("#ff6347");
  const [taskType, setTaskType] = useState("");
  const [deadlineValidation, setDeadlineValidation] = useState(false);
  const [startDateValidation, setStartDateValidation] = useState(false);
  const [projectUsers, setProjectUsers] = useState([]);
  const [checked, setChecked] = React.useState([-1]);
  const [tasksDataFromDB, setTasksDataFromDB] = useState([]);
  const [assignedTasksDataFromDB, setAssignedTasksDataFromDB] = useState([]);
  const [taskId, setTaskId] = useState();
  var [isLoading, setLoading] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [assignedGroups, setAssignedGroups] = useState([]);

  const [filterButton, setFilterButton] = useState(false);
  const [startdateFilter, setstartdateFilter] = useState(null);
  const [deadlineFilter, setdeadlineFilter] = useState(null);
  const [valueFilter, setValueFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearchFilter] = useState("");
  const [startDateValidationFilter, setStartDateValidationFilter] =
    useState(false);
  const [deadlineValidationFilter, setDeadlineValidationFilter] =
    useState(false);
  const [assignedTasksFilter, setAssignedTasksFilter] = useState([]);

  const [token, setToken] = useState(null);

  const [openDrawerComment, setOpenDrawerComment] = React.useState(false);

  const [commentTaskId, setCommentTaskId] = useState(0);
  const [commentTaskName, setCommentTaskName] = useState("");
  const [commentAssignedTasks, setCommentAssignedTasks] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isFromEmail, setIsFromEmail] = useState(false);

  const handleToken = async () => {
    const token = await getToken();
    setToken(token);
    return token;
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

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
      const tok = await handleToken();

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
          Authorization: `Bearer ${tok}`,
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
          alert("Emails problem not signed in click on ok to sign user");
        });
    } else if (token) {
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

      await axios(config)
        .then(function (response) {
          handleClickVariant(
            "success",
            "Notification successfully sent by email"
          );
        })
        .catch(function (error) {
          alert("Emails problem not signed in click on ok to sign user");
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
    // setOpenDrawer(false)
    // setState({ ...state, [anchor]: openDrawer });
    if (taskType === "My Tasks") {
      try {
        res = await axios.post(
          url + "/Tasks/createTasks",
          {
            user_id: userInfo.user_id,
            project_id: project.project_id,
            task_name: taskName,
            task_status: "In Process",
            task_deadline: deadline,
            group_name: value.group_name,
            group_color: colorChange,
            task_details: taskDetails,
            task_startdate: startdate,
            group_id: value.group_id,
            department_id: department.department_id,
            action: status.label,
          },
          {
            headers: { token: user.token },
          }
        );
        updateKPI(1000);

        handleClickVariant("success", "Tasks created Sucessfully");
        setTaskName("");
        setStatus({ label: "" });
        setStatusReal({ label: "" });
        setstartdate(null);
        setTaskDetails("");
        setdeadline(null);
        setTaskId("");
        setAssignedTasks([]);
        setAssignedGroups([]);
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
            task_status: "In Process",
            task_assigned_to: assignedTasks,
            department_id: department.department_id,
            task_deadline: deadline,
            group_name: value.group_name,
            group_color: colorChange,
            task_details: taskDetails,
            task_startdate: startdate,
            group_id: value.group_id,
            action: status.label,
            group_users: assignedGroups,
          },
          {
            headers: { token: user.token },
          }
        );
        updateKPI(1000);

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
        setStatus({ label: "" });
        setStatusReal({ label: "" });
        setstartdate(null);
        setTaskDetails("");
        setdeadline(null);
        setTaskId("");
        setAssignedTasks([]);
        setAssignedGroups([]);
        setValue([]);
        setState({ ...state, [anchor]: openDrawer });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    end = window.performance.now();
  };

  const updateKPI = async (totalTime) => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");
    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          searchType: "Tasks",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: totalTime,
        },
        { headers: { token: user.token } }
      );
    } catch (error) {
      console.log(error.response);
      return error.response;
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
          task_status: statusReal?.label,
          task_deadline: deadline,
          task_assigned_to: assignedTasks,
          task_details: taskDetails,
          task_startdate: startdate,
          taskId: taskId,
          tabValue: tabValue,
          department_id: department.department_id,
          action: status?.label,
        },
        {
          headers: { token: user.token },
        }
      );

      updateKPI(1000);

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

  const [draftedTasksDataFromDB, setDraftedTasksDataFromDB] = useState([]);

  const getUserDraftedTasks = async (title) => {
    if (title === "nofilter") {
      try {
        var res = await axios.post(
          url + "/Tasks/getDraftedTasks",
          {
            user_id: userInfo.user_id,
            project_id: project.project_id,
            department_id: department.department_id,
            userPosition: userPosition,
          },
          {
            headers: { token: user.token },
          }
        );

        setDraftedTasksDataFromDB(res.data.rows);
        setLoading(true);
      } catch (e) {
        console.log(e);
      }
    } else if (title === "filter") {
      const filteredUserIds = assignedTasksFilter.map((a) => a.user_id);
      try {
        var res2 = await axios.post(
          url + "/Tasks/getDraftedTasksFilter",
          {
            user_id: userInfo.user_id,
            project_id: project.project_id,
            group_name: valueFilter?.group_name,
            task_name: taskNameFilter,
            assigned_task_userid: filteredUserIds,
            department_id: department.department_id,
            userPosition: userPosition,
            status: statusFilter?.label,
            start_date: startdateFilter,
            deadline: deadlineFilter,
          },
          {
            headers: { token: user.token },
          }
        );
        setDraftedTasksDataFromDB(res2.data.rows);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleAttachmentDisplay = (attachment) => {};
  useEffect(() => {
    getUsers();

    getUserTasks("nofilter");
    if (permisions?.canviewassingedtaskpageworkspace) {
      getUserAssignedTasks("nofilter");
    }
    getUserDraftedTasks("nofilter");
  }, [project, user, isLoading, filterButton, token]);

  const handleTabChange = (event, newValue) => {
    handleFilterClear();
    setTabValue(newValue);
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
    start = window.performance.now();
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
    setAttachments([]);
    setTaskName("");
    setStatus({ label: "" });
    setStatusReal({ label: "" });
    setstartdate(null);
    setTaskDetails("");
    setdeadline(null);
    setTaskId("");
    setAssignedTasks([]);
    setAssignedGroups([]);
    setStartDateValidation(false);
    setDeadlineValidation(false);
    setValue([]);

    setState({ ...state, [anchor]: open });
  };

  const convertUrlTOBlob = async (url, name, type) => {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: type,
    };
    let file = new File([data], name, metadata);
    return file;
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
      tasksAssigned,
      statusReal,
      isFromEmail,
      group_id
    ) =>
    async (event) => {
      setTaskType(type);
      setTaskName(name);
      setStatus({ label: status });
      setstartdate(startdate);
      setTaskDetails(description);
      setdeadline(deadline);
      setTaskId(task_id);
      setStatusReal({ label: statusReal });
      setIsFromEmail(isFromEmail);

      if (title === "Edit Task" && current === "assignedtask") {
        getGroupMembers(group_id);
      }

      if (current === "assignedtask") {
        const attachments = await axios.post(
          url + "/Tasks/getTaskAttachments",
          {
            task_id: task_id,
            project_id: project.project_id,
          },
          {
            headers: { token: user.token },
          }
        );

        const filesConverted = [];
        let count = 0;
        for (let i = 0; i < attachments.data.length; i++) {
          const response = await axios(
            "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
              task_id +
              "task"
          );

          var request = new XMLHttpRequest();
          request.open("GET", response.data.uploadUrl, true);
          request.responseType = "blob";
          request.onload = function () {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload = function (e) {
              // console.log('filesConvertedDataurl:', e.target.result);
              filesConverted.push({
                contentBytes: e.target.result,
                name: attachments.data[i].name,
                type: attachments.data[i].type,
                size: attachments.data[i].size,
              });
              if (count === attachments.data.length) {
                console.log(
                  "filesConverted",
                  filesConverted,
                  count,
                  attachments.data.length
                );
                if (filesConverted.length === attachments.data.length) {
                  setAttachments(filesConverted);
                }
              }
            };
          };
          request.send();
          // const res = await convertUrlTOBlob(response.data.uploadUrl, attachments.data[i].name, attachments.data[i].type);
        }
      }

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
  const getGroupMembers = async (group_id) => {
    try {
      var res = await axios.post(
        url + "/Tasks/getAssignedTasksGroupAssigne",
        {
          group_id: group_id,
        },
        {
          headers: { token: user.token },
        }
      );
      setAssignedGroups(res.data);
    } catch (e) {
      console.log(e);
    }
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
            JFcontent="left"
          >
            {DrawerTitle}
          </Heading1>
          {/* 
          <Heading1
            color="black"
            paddingBlock=".4rem"
            size="3vh"
            weight="500"
            marginBotto1m="0px"
            JFcontent="left"
          >
            Details
          </Heading1> */}
          {isFromEmail ? (
            <Typography variant="caption">
              {" "}
              Note: This task is created from email
            </Typography>
          ) : null}
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
                  } else if (newValue && typeof newValue === "object") {
                    setValue(newValue);
                    getGroupMembers(newValue.group_id);
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
              <>
                <div className="d-flex align-items-center justify-content-start mb-3 ml-2">
                  {value && Object.keys(value).length === 1 ? (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ width: "100%", marginTop: 2 }}
                    >
                      <Stack direction="row" sx={{ width: "40%" }} spacing={2}>
                        <InputLabel htmlFor="groupColor">
                          Group Color
                        </InputLabel>
                        <input
                          type="color"
                          id="groupColor"
                          name="groupColor"
                          value={colorChange}
                          onChange={(e) => {
                            handleColorChange(e.target.value);
                          }}
                        />
                      </Stack>
                      {taskType === "Assigned Task" ? (
                        <Stack sx={{ width: "60%" }}>
                          <Autocomplete
                            onChange={(e, option) => {
                              handleSelectedAssignedGroups(e, option);
                            }}
                            multiple
                            size="small"
                            style={{
                              width: "100%",
                              marginBottom: "2vh",
                            }}
                            id="tags-outlined"
                            options={projectUsers}
                            getOptionLabel={(option) => option.username}
                            isOptionEqualToValue={(option, value) =>
                              value.user_id === option.user_id
                            }
                            value={assignedGroups}
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
                                label="Group Users"
                                placeholder="Users"
                              />
                            )}
                          />
                        </Stack>
                      ) : null}
                    </Stack>
                  ) : null}
                </div>
              </>
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
              style={{
                marginRight: "3px",
                marginBottom: "2vh",
                width: "100%",
              }}
              size="small"
              options={ActionList}
              value={status}
              onChange={(e, option) => {
                handlestatus(e, option);
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                value.label === option.label
              }
              renderInput={(params) => (
                <TextField {...params} label="Action required" />
              )}
            />
            {DrawerTitle !== "Add Task" ? (
              <Autocomplete
                disablePortal
                id="statusFilter"
                style={{
                  marginRight: "3px",
                  marginBottom: "2vh",
                  width: "100%",
                }}
                size="small"
                options={StatusList}
                value={statusReal}
                onChange={(e, option) => {
                  handlestatusReal(e, option);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  value.label === option.label
                }
                renderInput={(params) => (
                  <TextField {...params} label="Status" />
                )}
              />
            ) : null}
          </div>

          {taskType === "Assigned Task" ? (
            <Autocomplete
              onChange={(e, option) => {
                handleSelectedAssignedTasks(e, option);
              }}
              multiple
              size="small"
              style={{
                width: "100%",
                marginBottom: "2vh",
              }}
              id="tags-outlined"
              options={assignedGroups}
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
          <div></div>
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

          <Grid container spacing={1}>
            {attachments &&
              attachments.length > 0 &&
              attachments.map((a, index) => (
                <Grid item xs={6}>
                  <UploadCard
                    key={index}
                    name={a.name}
                    size={a.size}
                    type={a.type}
                    bytes={a.contentBytes}
                    project={project}
                    user={user}
                    file={a}
                    userInfo={userInfo}
                  />
                </Grid>
              ))}
          </Grid>

          <div className="d-flex align-items-end justify-content-end w-100 m-0">
            {DrawerTitle === "Add Task" ? (
              taskType === "Assigned Task" ? (
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
                    paddingBlock: "4px",
                    paddingInline: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  disabled={
                    !taskName ||
                    !startdate ||
                    !deadline ||
                    !taskDetails ||
                    !value ||
                    deadlineValidation ||
                    startDateValidation ||
                    (assignedTasks && assignedTasks.length === 0) ||
                    (status && Object.keys(status).length === 0)
                      ? true
                      : false
                  }
                  endIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                >
                  ADD task
                </Button>
              ) : (
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
                    paddingBlock: "4px",
                    paddingInline: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  disabled={
                    !taskName ||
                    !startdate ||
                    !deadline ||
                    !taskDetails ||
                    !value ||
                    deadlineValidation ||
                    startDateValidation ||
                    (status && Object.keys(status).length === 0)
                      ? true
                      : false
                  }
                  endIcon={<FontAwesomeIcon icon={faPlusCircle} />}
                >
                  ADD task
                </Button>
              )
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

  const handlestatusReal = (e, option) => {
    setStatusReal(option);
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
    setCommentTaskId(0);
    setOpenDrawerComment(false);
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
    setAssignedTasks(option);
  };

  const handleSelectedAssignedGroups = (e, option) => {
    setAssignedGroups(option);
  };

  const handleSelectedAssignedTasksFilter = (e, option) => {
    setAssignedTasksFilter(option);
  };

  const handleColorChange = (color) => {
    setcolorChange(color);
  };

  // ============================== MUI Table ==============================
  // -----------------------------------------------------------------------

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

    taskGroupsDrafted = [
      ...new Map(
        draftedTasksDataFromDB.map((item) => [item["group_name"], item])
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
                    <Row
                      socket={socket}
                      key={i}
                      row={row}
                      title="mytasks"
                      tasksDataFromDB={tasksDataFromDB}
                      assignedTasksDataFromDB={assignedTasksDataFromDB}
                      draftedTasksDataFromDB={draftedTasksDataFromDB}
                      handleClickVariant={handleClickVariant}
                      setLoading={setLoading}
                      checked={checked}
                      setChecked={setChecked}
                      taskGroupsAssigned={taskGroupsAssigned}
                      setOpenDrawerComment={setOpenDrawerComment}
                      isLoading={isLoading}
                      colorChange={colorChange}
                      search={search}
                      toggleDrawerUpdate={toggleDrawerUpdate}
                      anchor={anchor}
                      userPosition={userPosition}
                      user={user}
                      setCommentTaskId={setCommentTaskId}
                      assignedTasks={assignedTasks}
                      setCommentTaskName={setCommentTaskName}
                      setCommentAssignedTasks={setCommentAssignedTasks}
                      project={project}
                      setAttachments={setAttachments}
                      department={department}
                    />
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
                <TableBody>
                  {taskGroupsAssigned.map((row, i) => (
                    <Row
                      key={i}
                      socket={socket}
                      row={row}
                      title="assigned"
                      tasksDataFromDB={tasksDataFromDB}
                      assignedTasksDataFromDB={assignedTasksDataFromDB}
                      draftedTasksDataFromDB={draftedTasksDataFromDB}
                      handleClickVariant={handleClickVariant}
                      setLoading={setLoading}
                      checked={checked}
                      setChecked={setChecked}
                      taskGroupsAssigned={taskGroupsAssigned}
                      setOpenDrawerComment={setOpenDrawerComment}
                      isLoading={isLoading}
                      colorChange={colorChange}
                      search={search}
                      toggleDrawerUpdate={toggleDrawerUpdate}
                      anchor={anchor}
                      userPosition={userPosition}
                      user={user}
                      setCommentTaskId={setCommentTaskId}
                      permisions={permisions}
                      assignedTasks={assignedTasks}
                      setCommentTaskName={setCommentTaskName}
                      setCommentAssignedTasks={setCommentAssignedTasks}
                      department={department}
                      project={project}
                      setAttachments={setAttachments}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );

      case "three":
        return (
          <div className="mytasks">
            {/* //============================================================================== */}
            {/* ----------------------------------- MUI Assigned Task Table ----------------------------------- */}
            {/* ================================================================================ */}

            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableBody>
                  {taskGroupsDrafted.map((row, i) => (
                    <Row
                      socket={socket}
                      key={i}
                      row={row}
                      title="drafted"
                      tasksDataFromDB={tasksDataFromDB}
                      assignedTasksDataFromDB={assignedTasksDataFromDB}
                      draftedTasksDataFromDB={draftedTasksDataFromDB}
                      handleClickVariant={handleClickVariant}
                      setLoading={setLoading}
                      checked={checked}
                      setChecked={setChecked}
                      taskGroupsAssigned={taskGroupsAssigned}
                      setOpenDrawerComment={setOpenDrawerComment}
                      isLoading={isLoading}
                      colorChange={colorChange}
                      search={search}
                      toggleDrawerUpdate={toggleDrawerUpdate}
                      anchor={anchor}
                      userPosition={userPosition}
                      user={user}
                      setCommentTaskId={setCommentTaskId}
                      assignedTasks={assignedTasks}
                      setCommentTaskName={setCommentTaskName}
                      setCommentAssignedTasks={setCommentAssignedTasks}
                      permisions={permisions}
                      project={project}
                      setAttachments={setAttachments}
                      department={department}
                    />
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
        <Helmet>
          <title>WorkSpace | StonAi</title>
        </Helmet>

        <Box
          sx={{
            backgroundColor: "background.default",
            minHeight: "100%",
            py: 3,
            marginBottom: "3rem",
          }}
        >
          <Grid container direction="column" rowSpacing={2}>
            <Grid container item>
              <Grid item md={6}>
                <DrawerComponent
                  openDrawerComment={openDrawerComment}
                  setOpenDrawerComment={setOpenDrawerComment}
                  user={user}
                  userInfo={userInfo}
                  commentTaskId={commentTaskId}
                  setCommentTaskId={setCommentTaskId}
                  commentTaskName={commentTaskName}
                  commentAssignedTasks={commentAssignedTasks}
                  socket={socket}
                  handleClickVariant={handleClickVariant}
                  department={department}
                  project={project}
                />

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  textColor="primary"
                  indicatorColor="primary"
                  aria-label="secondary tabs example"
                >
                  <Tab value="one" label="My Workspace" />
                  {permisions.canviewassingedtaskpageworkspace ? (
                    <Tab value="two" label="Project Workspace" />
                  ) : null}
                  <Tab value="three" label="Drafted Tasks" />
                </Tabs>
              </Grid>
              <Grid
                item
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: "30px",
                }}
              ></Grid>
            </Grid>

            <Grid item>
              {/* ************************************** FILTER ************************************** */}

              <FiltersComponent
                FiltersClicked={FiltersClicked}
                toggleDrawer={toggleDrawer}
                anchor={anchor}
                tabValue={tabValue}
                toggleDrawerClose={toggleDrawerClose}
                state={state}
                list={list}
                search={search}
                setSearchFilter={setSearchFilter}
                setValueFilter={setValueFilter}
                setFiltersClicked={setFiltersClicked}
                valueFilter={valueFilter}
                filter={filter}
                taskGroupsAssigned={taskGroupsAssigned}
                taskGroups={taskGroups}
                StatusList={StatusList}
                statusFilter={statusFilter}
                handlestatusFilter={handlestatusFilter}
                handleSelectedAssignedTasksFilter={
                  handleSelectedAssignedTasksFilter
                }
                permisions={permisions}
                projectUsers={projectUsers}
                assignedTasksFilter={assignedTasksFilter}
                setStartDateValidationFilter={setStartDateValidationFilter}
                setDeadlineValidationFilter={setDeadlineValidationFilter}
                setstartdateFilter={setstartdateFilter}
                startDateValidationFilter={startDateValidationFilter}
                deadlineFilter={deadlineFilter}
                startdateFilter={startdateFilter}
                setdeadlineFilter={setdeadlineFilter}
                deadlineValidationFilter={deadlineValidationFilter}
                getUserTasks={getUserTasks}
                getUserAssignedTasks={getUserAssignedTasks}
                handleFilterClear={handleFilterClear}
                handleTaskNameFilter={handleTaskNameFilter}
                taskNameFilter={taskNameFilter}
              />
              <Container maxWidth={false}>{renderSwitch(tabValue)}</Container>
            </Grid>
          </Grid>
        </Box>
      </>
    </div>
  );
}

const ActionList = [
  { label: "For Construction" },
  { label: "For Handover" },
  { label: "For Review" },
  { label: "For Information" },
  { label: "For Tender" },
  { label: "For Action" },
];

const StatusList = [
  { label: "In Process" },
  { label: "Completed" },
  { label: "Delayed" },
  { label: "Canceled" },
];
