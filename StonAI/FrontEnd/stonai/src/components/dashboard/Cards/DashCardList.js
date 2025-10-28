import React, { useState } from "react";
import DashboardCard from "./DashboardCard";
import UploadDocument from "./Assets/UploadDocument.png";
import UploadContract from "./Assets/UploadContract.png";
import TotalProjects from "./Assets/TotalProjects.png";
import CompletedProjects from "./Assets/CompletedProjects.png";
import PendingTasks from "./Assets/PendingTasks.png";
import TotalUsers from "./Assets/TotalUsers.png";
import TotalDep from "./Assets/TotalDep.png";
import Delayed from "./Assets/Delayed.png";
import HODcard from "./HODcard";

function DashCardList({
  totalDeps,
  totalProjects,
  totalUsers,
  totalPendingTasks,
  totalDocuments,
  totalContracts,
  userPosition,
  hodMoneySaved,
  hodTimeSaved,
}) {
  let fadeDelay = 0;

  const CardData = [
    {
      id: 1,
      folderName: "Uploaded Documents",
      image: UploadDocument,
      number: totalDocuments,
      sidebarColor: "var(--blue)",
    },
    // {
    //   id: 2,
    //   folderName: "Uploaded Contracts",
    //   image: UploadContract,
    //   number: totalContracts,
    //   sidebarColor: "var(--blue)",
    // },
    {
      id: 3,
      folderName: "Total Projects",
      image: TotalProjects,
      number: totalProjects,
      sidebarColor: "var(--blue)",
    },
    // {
    //   id: 4,
    //   folderName: "Completed Projects",
    //   image: CompletedProjects,
    //   number: 0,
    //   sidebarColor: "var(--green)",
    // },
    {
      id: 5,
      folderName: "Pending Tasks",
      image: PendingTasks,
      number: totalPendingTasks,
      sidebarColor: "var(--orange)",
    },
    {
      id: 6,
      folderName: "Total Users",
      image: TotalUsers,
      number: totalUsers,
      sidebarColor: "var(--blue)",
    },
    {
      id: 7,
      folderName: "Total Departments",
      image: TotalDep,
      number: totalDeps,
      sidebarColor: "var(--blue)",
    },
  ];

  const HODCardData = [
    {
      id: 1,
      folderName: "Time Saved (Employee)",
      image: UploadContract,
      number: hodTimeSaved ? hodTimeSaved?.toFixed(2) : "0.00",
      unit: "min",
    },
    {
      id: 2,
      folderName: "Money Saved (processing)",
      image: TotalProjects,
      number: hodMoneySaved ? hodMoneySaved?.toFixed(2) : "0.00",
      unit: "Dhs",
    },
  ];

  CardData.forEach((element) => {
    element["fadeDelay"] = fadeDelay;
    fadeDelay = fadeDelay + 0.08;
  });

  HODCardData.forEach((element) => {
    element["fadeDelay"] = fadeDelay;
    fadeDelay = fadeDelay + 0.08;
  });

  return (
    <div className="d-flex flex-wrap cardalign">
      {CardData.map((data) => {
        return (
          <DashboardCard
            id={data.id}
            folderName={data.folderName}
            image={data.image}
            number={data.number}
            sidebarColor={data.sidebarColor}
            fadeDelay={data.fadeDelay}
          />
        );
      })}
      {/* 
      {userPosition === "Head of Department"
        ? HODCardData.map((data) => {
            return (
              <HODcard
                id={data.id}
                folderName={data.folderName}
                image={data.image}
                number={data.number}
                unit={data.unit}
                fadeDelay={data.fadeDelay}
              />
            );
          })
        : null} */}

      {HODCardData.map((data) => {
        return (
          <HODcard
            id={data.id}
            folderName={data.folderName}
            image={data.image}
            number={data.number}
            unit={data.unit}
            fadeDelay={data.fadeDelay}
          />
        );
      })}
    </div>
  );
}

export default DashCardList;
