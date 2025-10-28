import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/NotificationsOutlined";
import FormControl from "@mui/material/FormControl";
import { Select, MenuItem, Menu } from "@mui/material";
import axios from "axios";
import { url } from "../url";
import NotificationCard from "../components/NotificationCard/NotificationCard";
import NotificationSkel from "../components/NotificationCard/NotificationSkel";
import EngineeringIcon from "@mui/icons-material/Engineering";

import { convertRawTextToHighlight } from "./ConvertToHighlights";

var startFrom = 0;
var endOfNotifications = 0;

const DashboardNavbar = ({
  onMobileNavOpen,
  userInfo,
  project,
  setProject,
  socket,
  user,
  extractedFeilds,
  setExtractedFeilds,
  docUrl,
  setDocUrl,
  showViewer,
  setShowViewer,
  tabValue,
  setTabValue,
  ...rest
}) => {
  const listInnerRef = useRef();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationList, setNotificationList] = useState([]);
  const [unRead, setUnread] = useState(0);
  const [open, setOpen] = useState();
  const [isLoading, setisloading] = useState(true);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const openNoti = Boolean(anchorElNoti);
  const [reciever, setReciever] = useState("");
  const handleNotification = () => {
    socket.emit("sendNotification", {
      senderName: user,
      receiverName: reciever,
    });
  };
  const getNoOfUnreadNoti = async () => {
    try {
      const response = await axios.post(
        url + "/Notification/getNoOfUnseenNoti",
        { user },
        { headers: { token: user.token } }
      );
      setUnread(response.data.number_of_notifications);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  useEffect(async () => {
    socket.on("getNotification", async (data) => {
      startFrom = 0;

      setNotifications((prev) => [...prev, data.sender.user_id]);
      const res = await getNotifications();
      setNotificationList(res);
      getNoOfUnreadNoti();
    });
    getNoOfUnreadNoti();
    if (notificationList?.length > 0) {
      setisloading(false);
    } else if (!endOfNotifications) {
      const res = await getNotifications();
      setNotificationList(res);
    }
  }, [socket, notificationList]);
  useEffect(() => {
    console.log("undread", unRead);
  }, [unRead]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const getNotifications = async () => {
    try {
      const response = await axios.post(
        url + "/Notification/getNotifications",
        { user },
        { headers: { token: user.token } }
      );
      if (response.data.length === 0) {
        endOfNotifications = 1;
      }
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const getNextNotifications = async () => {
    try {
      const response = await axios.post(
        url + "/Notification/getNextNotifications",
        {
          user: user,
          startFrom: startFrom,
        },
        { headers: { token: user.token } }
      );
      if (response.data.length === 0) {
        endOfNotifications = 1;
      }
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const eraseNoti = async () => {
    try {
      const response = await axios.post(
        url + "/Notification/eraseNoti",
        { user },
        {
          headers: { token: user.token },
        }
      );

      setUnread(response.data.number_of_notifications);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const updateNotificationStatus = async (notification_id) => {
    try {
      const res = await axios.post(
        url + "/Notification/updateNotificationStatus",
        {
          user: user,
          notificationID: notification_id,
        },
        { headers: { token: user.token } }
      );
      if (res) {
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const handleNotificationClick = async (value) => {
    updateNotificationStatus(value.notification_id);
    if (value?.type === "Doc") {
      handleClickPreviewDoc(value);
      navigate("/app/folder");
    } else if (value?.type === "Task") {
      navigate("/app/workspace");
    }
    setAnchorElNoti(null);
    startFrom = 0;
    const res = await getNotifications();
    setNotificationList(res);
    endOfNotifications = false;
  };
  const openNotificationBar = async (event) => {
    setAnchorElNoti(event.currentTarget);
    const res2 = await eraseNoti();
  };
  const handleCloseNoti = () => {
    setAnchorElNoti(null);
  };

  const onScroll = async () => {
    if (!endOfNotifications) {
      if (listInnerRef.current) {
        var { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
        scrollTop = parseInt(scrollTop);
        scrollHeight = parseInt(scrollHeight);
        clientHeight = parseInt(clientHeight);
        if (scrollTop + clientHeight === scrollHeight) {
          if (isLoading === false) {
            setisloading(true);
            startFrom = startFrom + 10;
            const res = await getNextNotifications();
            if (res.length > 0) {
              res.forEach((item) => {
                notificationList.push(item);
              });
              setNotificationList(notificationList);
            }

            setisloading(false);
          }
        }
      }
    }
  };

  const getfilesurl = async (element, document_id) => {
    const response = await axios(
      "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
        document_id
    );
    return response.data.uploadURL;
  };
  const HandleExtractedFeilds = async (value) => {
    try {
      const response = await axios.post(
        url + "/Document/getExtractedFeilds",
        value,
        {
          headers: { token: user.token },
        }
      );

      console.log(
        "convert",
        await convertRawTextToHighlight(
          response?.data?._source?.unMapped_field?.Raw_Text
        )
      );
      setExtractedFeilds(response.data._source);
      return response.data._source;
    } catch (error) {
      console.log("error1222", error.response);
      return error.response;
    }
  };
  const handleClickPreviewDoc = async (value) => {
    const res = await HandleExtractedFeilds(value);

    const urls = await getfilesurl(res, value.document_id);

    setDocUrl(urls);
    setShowViewer(true);
    setTabValue("three");
  };

  const changeProjectHandler = (event) => {
    userInfo.projects.forEach((item) => {
      if (item.project_id === event.target.value) {
        setProject(item);
        window.location.reload();
      }
    });
  };

  var view = (
    <>
      <MenuItem>
        <NotificationSkel />
      </MenuItem>
    </>
  );

  if (!isLoading) {
    view = (
      <>
        {" "}
        {notificationList.map((item) => {
          return (
            <MenuItem onClick={() => handleNotificationClick(item)}>
              <NotificationCard key={item.notification_id} item={item} />
            </MenuItem>
          );
        })}
      </>
    );
  } else {
    if (notificationList?.length > 0) {
      view = (
        <>
          {" "}
          {notificationList.map((item) => {
            return (
              <MenuItem onClick={() => handleNotificationClick(item)}>
                <NotificationCard key={item.notification_id} item={item} />
              </MenuItem>
            );
          })}
          <MenuItem className="flex-column d-flex">
            <NotificationSkel />
          </MenuItem>
          <MenuItem className="flex-column d-flex">
            <NotificationSkel />
          </MenuItem>
        </>
      );
    } else {
      view = <div style={{ width: "300px" }}></div>;
    }
  }

  return (
    <AppBar
      elevation={0}
      {...rest}
      className="navbar-light bg-light NavStyle NavSize d-flex justify-content-center"
      style={{}}
    >
      <Toolbar>
        <Box>
          <FormControl
            fullWidth
            size="small"
            margin="small"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="Center-P pr-1">
              <EngineeringIcon
                style={{ fill: "var(--orange)", fontSize: "2em" }}
              />
            </div>
            <Select
              sx={{ width: 200, bgcolor: "White", height: "40px" }}
              id="demo-simple-select"
              open={open}
              className="ProjectSelect"
              onClose={handleClose}
              onOpen={handleOpen}
              value={project.project_id}
              onChange={changeProjectHandler}
              size="small"
            >
              {userInfo.projects.map((item) => (
                <MenuItem key={item.project_id} value={item.project_id}>
                  {item.project_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1, marginLeft: "auto !important" }} />

        <IconButton
          onClick={openNotificationBar}
          style={{ color: "var(--blue)" }}
        >
          <Badge badgeContent={unRead} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={anchorElNoti}
          open={openNoti}
          onClose={handleCloseNoti}
          // onClick={handleCloseNoti}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "hidden",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              maxHeight: "30em",
              mt: 1.5,

              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box
            sx={{
              color: "var(--blue)",
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h5 style={{ margin: "8px" }}>Notifications</h5>
            {/* <a style={{ marginBottom: "-3px", cursor: "pointer" }}>See all</a> */}
          </Box>
          <div
            onScroll={onScroll}
            ref={listInnerRef}
            style={{
              height: "25em",
              overflowY: "auto",
            }}
          >
            {view}
          </div>
        </Menu>

        <Hidden lgUp>
          <IconButton
            onClick={onMobileNavOpen}
            style={{ color: "var(--blue)" }}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  onMobileNavOpen: PropTypes.func,
};

export default DashboardNavbar;
