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
} from "@material-ui/core";
import { Search, Workspaces } from "@material-ui/icons";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Mail,
  Send,
  File,
  Lock as LockIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Folder,
} from "react-feather";
import NavItem from "./NavItem";
import NavItemMails from "./NavItemMails";

import axios from "axios";
import { url } from "../url";
import { useState } from "react";
import { Button } from "monday-ui-react-core";
import "monday-ui-react-core/dist/main.css";

const user = {
  avatar: "/static/images/avatars/avatar_12.png",
  jobTitle: "Developer",
  name: "Saad",
};

const items = [
  {
    href: "/app/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/app/workspace",
    icon: Workspaces,
    title: "Workspace",
  },
  {
    href: "/app/search",
    icon: Search,
    title: "Search",
  },
  {
    href: "/app/mails",
    icon: Mail,
    title: "Mails",
  },
  {
    href: "/app/folder",
    icon: Folder,
    title: "Folders",
  },
  {
    href: "/app/documents",
    icon: Folder,
    title: "Documents",
  },
  {
    href: "/app/documentsActions",
    icon: Folder,
    title: "Document Actions",
  },
  {
    href: "/app/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/app/settings",
    icon: SettingsIcon,
    title: "Settings",
  },
  {
    href: "/app/adminDashboard",
    icon: AdminPanelSettingsIcon,
    title: "Admin",
  },
  {
    href: "/login",
    icon: LockIcon,
    title: "Login",
  },
  {
    href: "/404",
    icon: AlertCircleIcon,
    title: "Error",
  },
];

const DashboardUpload = ({
  onMobileClose,
  openMobile,
  setUser,
  user,
  userInfo,
  setUserInfo,
  project,
  setProject,
}) => {
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, userInfo]);

  const clickLogoutButtonHandler = () => {
    setUser(null);
    setProject(null);
    setUserInfo({
      enterprise_name: "",
      user_id: null,
      enterprise_id: null,
      projects: [],
    });
    localStorage.clear();
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Avatar
          component={RouterLink}
          src={user.avatar}
          sx={{
            cursor: "pointer",
            width: 64,
            height: 64,
          }}
          to="/app/account"
        />
        <Typography color="textPrimary" variant="h5">
          {user.username}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {userInfo.enterprise_name}
        </Typography>

        <Typography color="textSecondary" variant="body2">
          {project?.project_name}
        </Typography>
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
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          color="primary"
          variant="contained"
          onClick={clickLogoutButtonHandler}
        >
          Logout
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
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
              top: 64,
              height: "calc(100% - 64px)",
            },
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

export default DashboardSidebar;
