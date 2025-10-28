import React, { useState } from "react";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import Heading1 from "../Reusable Components/Headings/Heading1";
import "./EmailError.css";
import Errorimg from "./error.png";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { AccountPicker } from "./AccountPicker";

import { useMsal } from "@azure/msal-react";

const EmailError = () => {
  return (
    <div className="ErrorContainer">
      <div className="ErrorColumns container">
        <div className="d-flex w-100">
          <div
            className=" w-100 d-flex flex-row align-items-center justify-content-center"
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
              Something went wrong please try to login outlook account again.
            </Heading1>
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
