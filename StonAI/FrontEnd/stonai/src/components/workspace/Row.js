import React from "react";
import axios from "axios";
import { url } from "../../url";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Chat,
  Edit,
  DeleteForever,
  Done,
} from "@mui/icons-material";
import {
  TextField,
  Menu,
  Skeleton,
  Collapse,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Box,
  IconButton,
  TableCell,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import ToolTip from "@mui/material/Tooltip";

import {
  faTimes,
  faCheck,
  faSpinner,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarGroup from "@atlaskit/avatar-group";
import Popover from "@mui/material/Popover";
import AssignedTasks from "./AssignedTasks";

import MyTasks from "./MyTasks";
import DraftedTasks from "./DraftedTasks";
import moment from "moment";

const Row = ({
  tasksDataFromDB,
  assignedTasksDataFromDB,
  draftedTasksDataFromDB,
  handleClickVariant,
  setLoading,
  checked,
  setChecked,
  taskGroupsAssigned,
  setOpenDrawerComment,
  isLoading,
  colorChange,
  search,
  toggleDrawerUpdate,
  anchor,
  userPosition,
  user,
  row,
  title,
  setCommentTaskId,
  permisions,
  socket,
  assignedTasks,
  setCommentTaskName,
  setCommentAssignedTasks,
  project,
  setAttachments,
  department,
}) => {
  const handleTaskApproval = async (task_id) => {
    if (window.confirm("Are you sure you want to Approve this task?")) {
      try {
        var res = await axios.post(
          url + "/Tasks/updateApproveTask",
          {
            task_id: task_id,
          },
          {
            headers: { token: user.token },
          }
        );
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      // Do nothing!
      console.log("Approve canceled");
    }
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

  const handleTaskDelete = async (task_id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        var res = await axios.delete(url + "/Tasks/deleteTasks" + task_id, {
          headers: { token: user.token },
        });
        updateKPI(1000);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
      // Do nothing!
      console.log("Delete canceled");
    }
  };

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
      email_address: t.email_address,
    };
  });

  const draftedTasks = draftedTasksDataFromDB.map((t) => {
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
      email_address: t.email_address,
    };
  });

  const remDuplicates = [
    ...new Map(tasksDataFromDB.map((v) => [v.task_id, v])).values(),
  ];

  const remDuplicatesAssigned = [
    ...new Map(assignedTasksDataFromDB.map((v) => [v.task_id, v])).values(),
  ];

  const remDuplicatesDrafted = [
    ...new Map(draftedTasksDataFromDB.map((v) => [v.task_id, v])).values(),
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

  const filterUsersDrafted = (task_id) => {
    const taskAllUSersAssigned = draftedTasks
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
  console.log(
    "remDup Drafterd",
    remDuplicatesDrafted,
    row,
    draftedTasksDataFromDB
  );

  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const [ChangedGroupName, setChangedGroupName] = React.useState("");

  const [colorChangeTaskGroups, setColorChangeTaskGroups] = React.useState("");

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
    setAnchorElMenu(null);

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

    setChecked(newChecked);
  };

  const handleCommentDrawerOpen = (task_id, taskName) => {
    setCommentTaskId(task_id);
    setCommentTaskName(taskName);
    const taskAllUSersAssigned = draftedTasks
      .filter((f) => f.task_id === task_id)
      .map((a) => {
        return {
          name: a.task_assigned_to,
          user_id: a.user_id,
          username: a.username,
          email_address: a.email_address,
        };
      });

    setCommentAssignedTasks(taskAllUSersAssigned);
    // Notify(task_id, taskName, assignedTasks);
    setOpenDrawerComment(true);
  };

  return (
    <React.Fragment>
      <Popover
        id="basic-menu"
        anchorEl={anchorElMenu}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Grid container sx={{ padding: 2 }}>
          <Grid item md={12} sx={{ paddingTop: 1 }}>
            <TextField
              style={{ width: "100%" }}
              id="outlined-basic"
              label="Task Group"
              variant="outlined"
              size="small"
              className="textfieldStyles "
              onChange={(e) => handleChangedGroupName(e)}
              value={ChangedGroupName}
            />
          </Grid>
          <Grid item md={12}>
            <div style={{ marginLeft: "5px" }}>
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
            <ButtonStyled
              paddingInline=".8rem"
              paddingBlock="0.3rem"
              borderRadius="8px"
              width="fit-content"
              style={{ cursor: "pointer" }}
              className="FiltersClicked m-0"
              onClick={() => handleGroupUpdate(row.group_id)}
            >
              UPDATE
            </ButtonStyled>
          </Grid>
        </Grid>
      </Popover>
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
      ) : title === "mytasks" ? (
        <MyTasks
          row={row}
          handleGroupOpen={handleGroupOpen}
          remDuplicates={remDuplicates}
          checked={checked}
          handleTaskDelete={handleTaskDelete}
          handleTaskGroupDelete={handleTaskGroupDelete}
          toggleDrawerUpdate={toggleDrawerUpdate}
          handleCommentDrawerOpen={handleCommentDrawerOpen}
          colorChange={colorChange}
          filterUsers={filterUsers}
          search={search}
          handleClick={handleClick}
          anchor={anchor}
          assignedTasks={assignedTasks}
          project={project}
          user={user}
          handleClickVariant={handleClickVariant}
          setAttachments={setAttachments}
        />
      ) : title === "assigned" ? (
        <>
          <AssignedTasks
            row={row}
            handleGroupOpen={handleGroupOpen}
            remDuplicatesAssigned={remDuplicatesAssigned}
            checked={checked}
            handleTaskDelete={handleTaskDelete}
            handleTaskGroupDelete={handleTaskGroupDelete}
            toggleDrawerUpdate={toggleDrawerUpdate}
            handleCommentDrawerOpen={handleCommentDrawerOpen}
            colorChange={colorChange}
            filterUsers={filterUsers}
            search={search}
            handleClick={handleClick}
            anchor={anchor}
            tasksAssigned={tasksAssigned}
            permisions={permisions}
            assignedTasks={assignedTasks}
            project={project}
            user={user}
            handleClickVariant={handleClickVariant}
            setAttachments={setAttachments}
          />
        </>
      ) : (
        <DraftedTasks
          row={row}
          handleGroupOpen={handleGroupOpen}
          remDuplicatesDrafted={remDuplicatesDrafted}
          checked={checked}
          handleTaskDelete={handleTaskDelete}
          handleTaskGroupDelete={handleTaskGroupDelete}
          toggleDrawerUpdate={toggleDrawerUpdate}
          handleCommentDrawerOpen={handleCommentDrawerOpen}
          colorChange={colorChange}
          filterUsers={filterUsers}
          search={search}
          handleClick={handleClick}
          anchor={anchor}
          tasksAssigned={draftedTasks}
          userPosition={userPosition}
          handleTaskApproval={handleTaskApproval}
          filterUsersDrafted={filterUsersDrafted}
          assignedTasks={assignedTasks}
          permisions={permisions}
          project={project}
          user={user}
          handleClickVariant={handleClickVariant}
          setAttachments={setAttachments}
        />
      )}
    </React.Fragment>
  );
};

export default Row;
