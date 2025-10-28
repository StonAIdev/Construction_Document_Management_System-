import React from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import "./AdminCard.css";
import { useNavigate } from "react-router-dom";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ApartmentIcon from "@mui/icons-material/Apartment";
import GroupIcon from "@mui/icons-material/Group";

function AdminCard(props) {
  const {
    id,
    image,
    folderName,
    number,
    sidebarColor,
    fadeDelay,
    handleSelectedTab,
    pageUrl,
    selectedTab,
  } = props;
  const navigate = useNavigate();

  return (
    <div
      className={`${
        selectedTab === id ? "DashcardAdmin selectedCard" : "DashcardAdmin"
      }`}
      style={{
        animationDelay: fadeDelay + "s",
        width: "230px",
        height: "130px",
      }}
    >
      <div
        className="d-flex flex-column w-100"
        style={{ height: "100%" }}
        onClick={() => handleSelectedTab(id)}
      >
        <Heading1
          color="var(--blue)"
          size="20px"
          weight="500"
          marginBottom=""
          JFcontent="left"
        >
          {folderName}
        </Heading1>

        <div
          className="d-flex justify-content-between "
          style={{ height: "100%" }}
        >
          <Heading1
            color="var(--blue)"
            size="28px"
            weight="400"
            marginBottom=""
            JFcontent="Start"
          >
            {number}
          </Heading1>

          <div className=" dashCardimgContainer">
            {folderName === "Projects" ? (
              <FormatListBulletedIcon className="dashCardimg" />
            ) : null}
            {folderName === "Departments" ? (
              <ApartmentIcon className="dashCardimg" />
            ) : null}
            {folderName === "Users" ? (
              <GroupIcon className="dashCardimg" />
            ) : null}
            {folderName === "Subcontractor" ? (
              <GroupIcon className="dashCardimg" />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCard;
