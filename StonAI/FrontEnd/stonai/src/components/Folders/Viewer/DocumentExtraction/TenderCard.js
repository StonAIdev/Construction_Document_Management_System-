import React from "react";
import "./TenderCard.css";
import {
  faAlignLeft,
  faBars,
  faBuilding,
  faComments,
  faFileAlt,
  faFont,
  faHashtag,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Heading1 from "../../../../Reusable Components/Headings/Heading1";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { Checkbox } from "@mui/material";

function TenderCard({ data }) {
  return (
    <div className="tenderCardContainer">
      <div className="tenderCardTextarea">
        <div className="d-flex">
          <FontAwesomeIcon
            icon={faHashtag}
            style={{
              float: "left",
              color: "var(--warningRed)",
              marginRight: "10px",
              marginTop: "1px",
            }}
          />
          <div>
            <Heading1
              size="1.1em"
              weight="400"
              JFcontent="left"
              width="fit-content"
              display="inline"
              style={{ float: "left" }}
            >
              <Heading1
                size="1.2em"
                weight="600"
                JFcontent="left"
                width="fit-content"
                style={{ float: "left", margin: "-3px", marginRight: "10px" }}
              >
                {data["Question"]}
              </Heading1>
            </Heading1>
          </div>
        </div>

        <div className="d-flex">
          <FontAwesomeIcon
            icon={faQuestionCircle}
            style={{
              float: "left",
              color: "var(--blue)",
              marginRight: "10px",
              marginTop: "1px",
            }}
          />
          <div>
            <Heading1
              size="1.1em"
              weight="400"
              JFcontent="left"
              width="fit-content"
              display="inline"
              style={{ float: "left" }}
            >
              <Heading1
                size="1.2em"
                weight="600"
                JFcontent="left"
                width="fit-content"
                style={{ float: "left", margin: "-3px", marginRight: "10px" }}
              >
                {data["RFI QUESTION BY BIDDER"]}
              </Heading1>
            </Heading1>
          </div>
        </div>

        <div className="d-flex">
          <FontAwesomeIcon
            icon={faAlignLeft}
            style={{
              float: "left",
              color: "var(--green)",
              marginRight: "10px",
              marginTop: "1px",
            }}
          />
          <div>
            <Heading1
              size="1.1em"
              weight="400"
              JFcontent="left"
              width="fit-content"
              display="inline"
              marginBottom="8px"
              style={{ float: "left" }}
            >
              <Heading1
                size="1.2em"
                weight="600"
                JFcontent="left"
                width="fit-content"
                style={{ float: "left", margin: "-3px", marginRight: "10px" }}
              >
                {data["ANSWER BY VAMED"]}
              </Heading1>
            </Heading1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenderCard;
