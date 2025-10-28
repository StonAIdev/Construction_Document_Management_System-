import React, { useState } from "react";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import Heading1 from "../Reusable Components/Headings/Heading1";
import "./EmailError.css";
import Errorimg from "./error.png";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { AccountPicker } from "./AccountPicker";

import { useMsal } from "@azure/msal-react";

const EmailError = ({ userInfo, account }) => {
  const navigate = useNavigate();

  const { instance } = useMsal();
  const [anchorEl, setAnchorEl] = useState(null);
  const [accountSelectorOpen, setOpen] = useState(false);

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
    <div className="ErrorContainer">
      <div className="ErrorColumns container">
        <div className="d-flex w-100">
          <div
            className=" w-50 d-flex flex-column align-items-center justify-content-center"
            style={{ marginTop: "-60px" }}
          >
            <Heading1
              paddingInline=""
              paddingBlock=""
              width=""
              size="30px"
              weight="500"
              marginBottom=""
              JFcontent="start"
              align="left"
              display="inline"
            >
              You have Logged in from account{" "}
              <strong> {account?.username} </strong>while your registered
              account is <strong>{userInfo?.email_address}</strong>
              <br></br>
              <br></br>
              <Heading1
                paddingInline=""
                paddingBlock=""
                width=""
                size="24px"
                weight="400"
                marginTop="20px"
                marginBottom="20px"
                JFcontent="start"
                align="left"
              >
                Please logout by clicking the button below
              </Heading1>
            </Heading1>

            <div
              className="w-100 d-flex flex-column px-3"
              style={{ gap: "10px" }}
            >
              {/* <ButtonStyled
                className="buttonError1"
                onClick={() => handleAccountSelection()}
              >
                Login with the registered account
              </ButtonStyled> */}

              <ButtonStyled
                className="buttonError3"
                onClick={() => handleLogout("redirect")}
                key="logoutRedirect"
              >
                Logout
              </ButtonStyled>
              <AccountPicker open={accountSelectorOpen} onClose={handleClose} />
            </div>
          </div>
          <div className=" w-50 errorimg">
            <img src={Errorimg} alt="Error" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailError;
