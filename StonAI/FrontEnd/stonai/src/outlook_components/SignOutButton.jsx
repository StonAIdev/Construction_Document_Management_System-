import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { AccountPicker } from "./AccountPicker";
import { useNavigate } from "react-router-dom";
import { url } from "../url";

export const SignOutButton = ({ title }) => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [accountSelectorOpen, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = (logoutType) => {
    setAnchorEl(null);

    if (logoutType === "popup") {
      instance.logoutPopup();
      navigate("/app/dashboard");
    } else if (logoutType === "redirect") {
      instance.logoutRedirect();
      navigate("/app/dashboard");
    }
  };

  const handleAccountSelection = () => {
    setAnchorEl(null);
    setOpen(true);
    // navigate("/app/dashboard/mails/inbox");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {title === "invalidAccount" ? (
          <MenuItem
            onClick={() => handleAccountSelection()}
            key="switchAccount"
          >
            Switch Account
          </MenuItem>
        ) : null}

        <MenuItem onClick={() => handleLogout("popup")} key="logoutPopup">
          Logout using Popup
        </MenuItem>

        <MenuItem onClick={() => handleLogout("redirect")} key="logoutRedirect">
          Logout using Redirect
        </MenuItem>
      </Menu>
      <AccountPicker open={accountSelectorOpen} onClose={handleClose} />
    </div>
  );
};
