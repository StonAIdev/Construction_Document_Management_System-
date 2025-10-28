import React, { useState, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TasksCommentList from "./Comments/TasksCommentList";
import { PostTasksComment } from "./Comments/PostTasksComment";
import { styled, useTheme } from "@mui/material/styles";
import axios from "axios";

import { url } from "../../url";

const drawerWidth = 600;

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

const DrawerComponent = ({
  setOpenDrawerComment,
  openDrawerComment,
  user,
  userInfo,
  commentTaskId,
  setCommentTaskId,
  commentTaskName,
  commentAssignedTasks,
  socket,
  handleClickVariant,
  department,
  project
}) => {
  const theme = useTheme();

  const [commentsList, setComments_list] = useState([]);

  const [loading, setLoading] = useState(true);

  const handleDrawerCommentClose = () => {
    console.log("called");
    setComments_list([]);
    setLoading(true);
    setCommentTaskId(0);

    if (openDrawerComment === true) {
      setOpenDrawerComment(false);
    } else {
      setOpenDrawerComment(true);
    }
  };


  const addNotifications = async (task_id, taskName, assignedTasks) => {
    var message = "";
    message = `${user.username} has commented on task "${taskName}"`;
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
  const Notify = async () => {
    console.log("notify", commentTaskId, commentTaskName, commentAssignedTasks);
    const res = await addNotifications(commentTaskId, commentTaskName, commentAssignedTasks);
    socket.emit("sendNotification", {
      sender: user,
      receivers: commentAssignedTasks,
    });
  };

  const getComments = async () => {
    try {
      var res = await axios.post(
        url + "/Comment/get",
        {
          task_id: commentTaskId,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("Getting Comments", res.data);
      setComments_list(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getComments();
  }, [openDrawerComment]);
  useEffect(() => { }, []);
  return (
    <Drawer
      className=""
      sx={{
        overflowY: "hidden",
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={openDrawerComment}
    >
      <div
        className="p-3 DrawerFlex docextractionDrawer"
        style={{ height: "100%", flexDirection: "column" }}
      >
        {!loading ? (
          <>
            <div className="">
              <DrawerHeader>
                <IconButton onClick={handleDrawerCommentClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>
            </div>

            <TasksCommentList user={user} comments={commentsList} />
            <PostTasksComment
              userInfo={userInfo}
              user={user}
              comments={commentsList}
              setComments_list={setComments_list}
              commentTaskId={commentTaskId}
              Notify={Notify}
              department={department}
              project={project}
            />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </div>
    </Drawer>
  );
};

export default DrawerComponent;
