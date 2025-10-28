import React from "react";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import {
  faBars,
  faBuilding,
  faComments,
  faFileAlt,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "@mui/material/Checkbox";
import TableCardChips from "./TableCardChips";

function TableCard({ row }) {
  return (
    <div className=" TableCard">
      <div className="d-flex align-items-center w-100 justify-content-between">
        <div className="d-flex flex-column" style={{ rowGap: "5px" }}>
          <Heading1
            color="grey"
            paddingBlock=""
            size="1.08rem"
            weight="520"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ color: "var(--green)", marginRight: "8px" }}
            />
            {row?.name}
          </Heading1>

          <Heading1
            color="grey"
            paddingBlock=""
            size="1.08rem"
            weight="520"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "var(--blue)", marginRight: "8px" }}
            />
            Heading
          </Heading1>

          <Heading1
            color="grey"
            paddingBlock=""
            size="1.08rem"
            weight="520"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faFont}
              style={{ color: "var(--orange)", marginRight: "8px" }}
            />
            Answer Details Answer Details Answer Details Answer Details Answer
            Details
          </Heading1>
        </div>
        <div>
          <Checkbox className="p-0" style={{ float: "right" }} />
        </div>
      </div>

      <div
        className="d-flex flex-wrap w-100"
        style={{ columnGap: "10px", rowGap: "10px", marginTop: ".5em" }}
      >
        <TableCardChips />
        <TableCardChips />
        <TableCardChips />
      </div>
    </div>
  );
}

export default TableCard;
