import {
  faBars,
  faBuilding,
  faComments,
  faFileAlt,
  faFont,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "@mui/material/Checkbox";
import React from "react";
import Heading1 from "../../../Reusable Components/Headings/Heading1";

function ParagraphAnsDetails({ para, selectedRows }) {
  return (
    <div className="AnsDetailscard">
      <div className="d-flex align-items-center w-100 justify-content-between">
        <div className="d-flex flex-column" style={{ rowGap: "5px" }}>
          <Heading1
            color="grey"
            paddingBlock=""
            size="1rem"
            weight="500"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ color: "var(--green)", marginRight: "8px" }}
            />
            {para?.name}
          </Heading1>

          <Heading1
            color="grey"
            paddingBlock=""
            size="1rem"
            weight="500"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faBars}
              style={{ color: "var(--blue)", marginRight: "8px" }}
            />
            {para?.Heading}
          </Heading1>

          <Heading1
            color="grey"
            paddingBlock=""
            size="1rem"
            weight="400"
            JFcontent="left"
            marginBottom="0px"
          >
            <FontAwesomeIcon
              icon={faFont}
              style={{ color: "var(--orange)", marginRight: "8px" }}
            />
            {para?.Text}
          </Heading1>
        </div>
        <div>
          <Checkbox
            className="p-0"
            onClick={() => {
              var preAdded = false;
              for (var i = 0; i < selectedRows.length; i++) {
                if (selectedRows[i]?.Text === para.Text) {
                  selectedRows.splice(i, 1);
                  preAdded = true;
                  break;
                }
              }
              if (!preAdded) selectedRows.push(para);
              console.log("ADDED TO LIST", selectedRows);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ParagraphAnsDetails;
