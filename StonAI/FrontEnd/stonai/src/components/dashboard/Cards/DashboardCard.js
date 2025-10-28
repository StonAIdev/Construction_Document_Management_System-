import React from "react";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import "./DashCard.css";

function DashboardCard(props) {
  const { image, folderName, number, sidebarColor, fadeDelay } = props;
  return (
    <div className="Dashcard grow" style={{ animationDelay: fadeDelay + "s" }}>
      <div className="d-flex flex-column w-100" style={{ height: "80%" }}>
        <Heading1
          color="var(--blue)"
          size="1.2em"
          weight="400"
          marginBottom=""
          JFcontent="left"
        >
          {folderName}
        </Heading1>

        <div
          className="d-flex justify-content-between"
          style={{ height: "100%" }}
        >
          <Heading1
            color="var(--blue)"
            size="1.9-em"
            weight="500"
            marginBottom=""
            JFcontent="Start"
          >
            {number}
          </Heading1>

          <img className="dashCardimg" src={image} />
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
