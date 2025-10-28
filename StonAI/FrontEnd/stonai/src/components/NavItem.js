import React, { useState } from "react";
import { Button, ListItem, Popover, Typography } from "@mui/material";
import {
  NavLink as RouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";

const NavItem = ({ href, icon: Icon, title, ...rest }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const active = href
    ? !!matchPath(
        {
          path: href,
          end: false,
        },
        location.pathname
      )
    : false;

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setIsPopoverOpen(false);
  };

  return (
    <ListItem
      disableGutters
      sx={{ display: "flex", py: 0 }}
      onMouseEnter={
        title === "Intelligent Search" ? handlePopoverOpen : handlePopoverClose
      }
      // onMouseLeave={
      //   handlePopoverClose

      //   // title === "Intelligent Search" ? handlePopoverClose : null
      // }
    >
      <div
        // onMouseEnter={title === "Intelligent Search" ? handlePopoverOpen : null}
        onMouseLeave={
          title === "Intelligent Search" ? handlePopoverClose : null
        }
      >
        <Button
          component={RouterLink}
          sx={{
            color: "text.secondary",
            fontWeight: "medium",
            justifyContent: "flex-start",
            letterSpacing: 0,
            py: 1.25,
            textTransform: "none",
            width: "100%",
            ...(active && {
              color: "primary.main",
            }),
            "& svg": {
              mr: 1,
            },
          }}
          to={href}
        >
          {Icon && <Icon size="20" />}
          <span>{title}</span>
        </Button>
      </div>

      <Popover
        sx={{}}
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        style={{ pointerEvents: "none" }}
      >
        <Typography
          sx={{
            p: 1,
            backgroundColor: "#f5f5f5",
            color: "#6B778C",
            fontWeight: "400",
            fontSize: "14px",
            boxShadow: "0  4px  6px rgba(0,  0,  0,  0.1)",
            borderRadius: "4px",
          }}
        >
          Search inside Contractual Documents
        </Typography>
      </Popover>
    </ListItem>
  );
};

NavItem.propTypes = {
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string,
};

export default NavItem;
