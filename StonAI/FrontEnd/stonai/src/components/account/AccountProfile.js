import React, { useState } from 'react'
import moment from "moment";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  IconButton,
  Menu, MenuItem
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
const AccountProfile = (props) => {
  let { ProfileEdit, setProfileEdit, setChangePassword, changePassword } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function EditProfiletoggle() {
    setProfileEdit(false);
  }

  function PasswordChangeToogle() {
    setChangePassword(false);
  }

  return (
    <>
      {ProfileEdit && changePassword && (
        <Card {...props} style={{ width: "100%" }}>
          <CardContent>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: "2em",
                width: "100%",
              }}
            >
              <Avatar
                src={props.values.image}
                sx={{
                  height: 160,
                  width: 160,
                  boxShadow: "rgba(0, 0, 0, 0.35) 1px 2px 10px",
                }}
              />

              <Box>
                <Typography color="textPrimary" gutterBottom variant="h3">
                  {props.values.firstName} {props.values.lastName}
                </Typography>

                <Typography color="textSecondary" variant="body1">
                  {props.values.email}
                </Typography>

                <Typography color="textSecondary" variant="body1">
                  {props.user.username}
                </Typography>

                <Typography color="textSecondary" variant="body1">
                  {props.values.phone}
                </Typography>

                <Typography color="textSecondary" variant="body1">
                  {props.values.state} {props.values.country}
                </Typography>
              </Box>

              <div style={{ marginLeft: "auto", alignSelf: "flex-start" }}>
                {/* <IconButton onClick={EditProfiletoggle} > */}
                <IconButton onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faPenToSquare} color="var(--blue)" />
                </IconButton>
              </div>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={EditProfiletoggle}>Profile</MenuItem>
                <MenuItem onClick={PasswordChangeToogle}>Change Password</MenuItem>
              </Menu>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AccountProfile;
