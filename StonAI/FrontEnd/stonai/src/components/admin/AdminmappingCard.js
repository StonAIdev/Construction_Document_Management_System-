import React, { useState, useEffect } from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import { IconButton } from "@material-ui/core";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import "./Admin.css";

function AdminmappingCard() {
  return (
    <div className="SearchResultCard">
      <div className="seaarchresultDivision">
        <img
          className="SRImage"
          src="https://image.freepik.com/free-vector/businessman-profile-cartoon_18591-58479.jpg"
          alt=""
        />
      </div>
      <div className="seaarchresultDivision" style={{ width: "45%" }}>
        Department Name
        <Heading1 color="grey" weight="700" JFcontent="left" paddingBlock="5px">
          {" "}
          StonAI
        </Heading1>
      </div>
      <div className="seaarchresultDivision" style={{ width: "45%" }}>
        Users
        <Heading1 color="grey" weight="700" JFcontent="left" paddingBlock="5px">
          {" "}
          AI
        </Heading1>
      </div>
      <div className="seaarchresultDivision" style={{ width: "8%" }}>
        <Heading1 color="grey" weight="700" JFcontent="left">
          <IconButton>
            {" "}
            <EditIcon style={{ color: "var(--green)" }} />
          </IconButton>
          <IconButton>
            <DeleteForeverIcon style={{ color: "var(--warningRed)" }} />
          </IconButton>
        </Heading1>
      </div>
    </div>
  );
}

export default AdminmappingCard;
