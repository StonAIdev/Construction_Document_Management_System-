import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import { Button, ListItem, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import { Inbox, Send, Trash2, Mail } from "react-feather";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const NavItemMail = ({ icon: Icon, title, ...rest }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const location = useLocation();

  // const active = href
  //   ? !!matchPath(
  //       {
  //         path: href,
  //         end: false,
  //       },
  //       location.pathname
  //     )
  //   : false;

  return (
    <div>
      <ListItem
        disableGutters
        sx={{
          display: "flex",
          py: 0,
        }}
        {...rest}
      >
        <Button
          sx={{
            color: "text.secondary",
            fontWeight: "medium",
            justifyContent: "flex-start",
            letterSpacing: 0,
            py: 1.25,
            textTransform: "none",
            width: "100%",
            // ...(active && {
            //   color: "primary.main",
            // }),
            "& svg": {
              mr: 1,
            },
          }}
          id="demo-customized-button"
          aria-controls="demo-customized-menu"
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          disableElevation
          onClick={handleClick}
        >
          {Icon && <Icon size="20" />}
          <span>{title}</span>
        </Button>
      </ListItem>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ textAlign: "right" }}
      >
        <MenuItem
          onClick={handleClose}
          to={"/app/mails/inbox"}
          component={RouterLink}
        >
          <Inbox />
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            Inbox
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={RouterLink}
          to={"/app/mails/sent"}
          disableRipple
        >
          <Send />
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            Sent
          </Typography>{" "}
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={RouterLink}
          to={"/app/mails/junk"}
          disableRipple
        >
          <Trash2 />
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            Junk
          </Typography>{" "}
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleClose}
          component={RouterLink}
          to={"/app/mails/create"}
          disableRipple
        >
          <Mail />
          <Typography variant="subtitle1" sx={{ ml: 2 }}>
            Compose
          </Typography>
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

NavItemMail.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItemMail;
