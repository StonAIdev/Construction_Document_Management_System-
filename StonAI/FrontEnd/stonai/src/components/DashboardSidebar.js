import { useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  IconButton,
} from "@material-ui/core";

import NavItem from "./NavItem";
import NavItemMails from "./NavItemMails";
import ButtonUnstyled from "../Reusable Components/Buttons/ButtonStyled";

import { useState } from "react";

import "monday-ui-react-core/dist/main.css";
import "./DashboardLayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Logo from "../components/Assets/LogoStonai.png";
import ConfirmDialog from "./ConfirmDialogLogout";
const user = {
  avatar: "/static/images/avatars/avatar_12.png",
  jobTitle: "Developer",
  name: "Saad",
};

const DashboardSidebar = ({
  onMobileClose,
  openMobile,
  setUser,
  user,
  userInfo,
  setUserInfo,
  project,
  setProject,
  socket,
  extractedFeilds,
  setExtractedFeilds,
  docUrl,
  setDocUrl,
  showViewer,
  setShowViewer,
  tabValue,
  setTabValue,
  permisions,
  items,
  department,
  setDepartment,
}) => {
  const location = useLocation();

  const [dynamicRoutes, setDynamicRoutes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Handlers to open and close the popover
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const filterItems = () => {};

  useEffect(() => {
    filterItems();

    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [userInfo]);

  // Inside your component
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClickLogoutButton = () => {
    setConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    // Your logout logic here
    setUser(null);
    setProject(null);
    setDepartment(null);
    setUserInfo({
      enterprise_name: "",
      user_id: null,
      enterprise_id: null,
      projects: [],
    });
    setExtractedFeilds({});
    setDocUrl(null);
    setShowViewer(false);
    setTabValue("one");
    const reason = "User logged out";
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
    localStorage.clear();
    window.location.reload(false);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // ****************************************************************************
      }}
    >
      <Box
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <img
          className="logoStyle"
          src={Logo}
          alt="StonAI"
          style={{ width: "100px" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#F8F9FD",
          p: 1,
        }}
      >
        <Avatar
          component={RouterLink}
          src={userInfo.profile_pic}
          sx={{
            cursor: "pointer",
            width: 64,
            height: 64,
            marginBottom: "10px",
          }}
          to="/app/account"
        />
        <Typography
          color="textPrimary"
          variant="h6"
          sx={{ textAlign: "center" }}
        >
          {user.username}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {userInfo.enterprise_name}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {project?.project_name}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {department?.department_name}
        </Typography>

        {/* <Typography color="textSecondary" variant="body2">
          Construction
        </Typography> */}
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) =>
            item.title === "Mails" ? (
              <NavItemMails
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            ) : (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            )
          )}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          display: "flex",
          marginTop: "auto",
          marginBottom: "10px",
        }}
      >
        <Divider />
        <IconButton>
          <ButtonUnstyled
            color="grey"
            border="NONE"
            paddingInline="0.5rem"
            paddingBlock=".1rem"
            borderRadius="8px"
            size="1rem"
            width="fit-content"
            onClick={handleClickLogoutButton}
          >
            <FontAwesomeIcon
              icon={faSignOutAlt}
              style={{ color: "#", marginRight: "8px" }}
            />
            Logout
          </ButtonUnstyled>
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256,
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              height: "100%",
              paddingTop: "1rem",
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <ConfirmDialog
        open={confirmOpen}
        handleClose={handleCloseConfirm}
        handleConfirm={handleConfirmLogout}
      />
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default DashboardSidebar;
