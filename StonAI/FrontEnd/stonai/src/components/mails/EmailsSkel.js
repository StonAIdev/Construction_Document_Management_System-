import { milliseconds } from "date-fns";
import React, { useState } from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import "./EmailSkel.css";
import { Skeleton } from "@mui/material";
function EmailsSkel() {
  return (
    <div className="d-flex flex-column">
      <div className="SkelContainer">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="p-1">
          <div>
            <Skeleton animation="wave" height={10} width="40%" />
          </div>
          <div style={{ width: 200 }}>
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          </div>
        </div>
      </div>
      <div className="">
        <hr className="SkelDivider" />
      </div>
    </div>
  );
}

export default EmailsSkel;
