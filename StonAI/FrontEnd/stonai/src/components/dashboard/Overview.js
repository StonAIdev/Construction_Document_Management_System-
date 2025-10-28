import { Grid } from "@mui/material";
import React, { useState } from "react";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import DashCardList from "./Cards/DashCardList";
import Invitecard from "./Cards/Invitecard";
import "./Dashboard.css";
import GraphsMain from "./Graphs/GraphsMain";

function Overview({
  timeSaved,
  setTimeSaved,
  moneySaved,
  setMoneySaved,
  userPosition,
  assignedTaskStats,
  mytaskStats,
  shopdrawingStatusCount,
  MaterialStatusCount,
  project,
  user,
  setAssignedTasksStats,
  setMyTasksStats,
  setShopdrawingStatusCount,
  setMaterialStatusCount,
  department,
  hodTasks,
  setHODTasks,
  totalDeps,
  totalProjects,
  totalUsers,
  totalPendingTasks,
  totalDocuments,
  totalContracts,
  hodMoneySaved,
  hodTimeSaved,
  inspectionCount,
  setInspectionAccount,
  setSiteInstruction,
  siteInstruction,
  workClearance,
  setworkClearance,
  setNonConformanceReport,
  nonConformanceReport,
  permisions,
  MethodStatementCount,
  setMethodStatementCount,
  setPreCount,
  preCount,
  technical,
  setTechinal,
  infoReq,
  setInfoReq,
  setArch,
  arch

}) {
  return (
    <div>
      <div className="dashCardsMain">
        <div className="DashCardsContainerLeft">
          <DashCardList
            totalDeps={totalDeps}
            totalProjects={totalProjects}
            totalUsers={totalUsers}
            totalPendingTasks={totalPendingTasks}
            totalDocuments={totalDocuments}
            totalContracts={totalContracts}
            userPosition={userPosition}
            hodMoneySaved={hodMoneySaved}
            hodTimeSaved={hodTimeSaved}
            permisions={permisions}

          />
        </div>
        {/* <div className="DashCardsContainerRight">
          <Invitecard />
        </div> */}
      </div>

      <div className="dashGraphsMain">
        <GraphsMain
          project={project}
          user={user}
          timeSaved={timeSaved}
          setTimeSaved={setTimeSaved}
          moneySaved={moneySaved}
          setMoneySaved={setMoneySaved}
          userPosition={userPosition}
          shopdrawingStatusCount={shopdrawingStatusCount}
          assignedTaskStats={assignedTaskStats}
          mytaskStats={mytaskStats}
          MaterialStatusCount={MaterialStatusCount}
          setAssignedTasksStats={setAssignedTasksStats}
          setMyTasksStats={setMyTasksStats}
          setShopdrawingStatusCount={setShopdrawingStatusCount}
          setMaterialStatusCount={setMaterialStatusCount}
          department={department}
          hodTasks={hodTasks}
          setHODTasks={setHODTasks}
          inspectionCount={inspectionCount}
          setInspectionAccount={setInspectionAccount}
          setSiteInstruction={setSiteInstruction}
          siteInstruction={siteInstruction}
          workClearance={workClearance}
          setworkClearance={setworkClearance}
          setNonConformanceReport={setNonConformanceReport}
          nonConformanceReport={nonConformanceReport}
          permisions={permisions}
          MethodStatementCount={MethodStatementCount}
          setMethodStatementCount={setMethodStatementCount}
          setPreCount={setPreCount}
          preCount={preCount}
          technical={technical}
          setTechinal={setTechinal}
          infoReq={infoReq}
          setInfoReq={setInfoReq}
          arch={arch}
          setArch={setArch}

        />
      </div>
    </div>
  );
}

export default Overview;
