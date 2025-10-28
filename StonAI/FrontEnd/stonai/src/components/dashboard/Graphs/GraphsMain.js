import { Grid } from "@mui/material";
import React from "react";
import "../Dashboard.css";

import ShopDrawingGraph from "./ShopDrawingGraph";
import MyTasksGraph from "./MyTasksGraph";
import TimeSavedGraph from "./TimeSavedGraph";
import MoneySavedGraph from "./MoneySavedGraph";
import MaterialGraph from "./MaterialGraph";
import AssignedTasksGraph from "./AssignedTasksGraph";
import InspectionRequestGraph from "./InspectionRequestGraph";
import SiteInstructionGraph from "./SiteInstructionGraph";
import WorkClearanceGraph from "./WorkClearanceGraph";
import NonConformanceReportGraph from "./NonConformanceReportGraph";
import MethodForStatementGraph from "./MethodForStatementGraph";
import PrequalificationGraph from "./PrequalificationGraph";
import TechnicalGraph from "./TechnicalGraph";
import RequestForInformation from "./RequestForInformation";

import ArchitecturalInspectionRequest from "./ArchitecturalInspectionRequest";

function GraphsMain({
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
  setMyTasksStats,
  setAssignedTasksStats,
  setShopdrawingStatusCount,
  setMaterialStatusCount,
  department,
  hodTasks,
  setHODTasks,
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
  arch,
  setArch,
}) {
  return (
    <div>
      <Grid container xs={12} className="GridGap">
        {/* {department.department_name === "Engineering" ? ( */}
        <>
          {permisions?.canviewshopdrawingsubmittal ? (
            <Grid item xs={12} md={5.85} className="GraphContainer ">
              <ShopDrawingGraph
                shopdrawingStatusCount={shopdrawingStatusCount}
                project={project}
                user={user}
                setShopdrawingStatusCount={setShopdrawingStatusCount}
              />
            </Grid>
          ) : null}

          {permisions?.canviewmaterialsubmittal ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <MaterialGraph
                MaterialStatusCount={MaterialStatusCount}
                project={project}
                user={user}
                setMaterialStatusCount={setMaterialStatusCount}
              />
            </Grid>
          ) : null}

          {permisions?.canviewmethodstatementsubmittal ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <MethodForStatementGraph
                MaterialStatusCount={MethodStatementCount}
                project={project}
                user={user}
                setMaterialStatusCount={setMethodStatementCount}
              />
            </Grid>
          ) : null}

          {permisions?.canviewprequalificationsubmittal ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <PrequalificationGraph
                MaterialStatusCount={preCount}
                project={project}
                user={user}
                setMaterialStatusCount={setPreCount}
              />
            </Grid>
          ) : null}

          {permisions?.canviewtechnicalsubmittal ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <TechnicalGraph
                MaterialStatusCount={technical}
                project={project}
                user={user}
                setMaterialStatusCount={setTechinal}
              />
            </Grid>
          ) : null}

          {permisions?.canviewrequestforinformation ? (
            <Grid item xs={12} md={5.85} className="GraphContainer ">
              <RequestForInformation
                MaterialStatusCount={infoReq}
                project={project}
                user={user}
                setMaterialStatusCount={setInfoReq}
              />
            </Grid>
          ) : null}

          {permisions?.canviewsiteinstruction ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <SiteInstructionGraph
                shopdrawingStatusCount={siteInstruction}
                project={project}
                user={user}
                setShopdrawingStatusCount={setSiteInstruction}
              />
            </Grid>
          ) : null}
          {permisions?.canviewworkinspectionrequest ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <WorkClearanceGraph
                shopdrawingStatusCount={workClearance}
                project={project}
                user={user}
                setShopdrawingStatusCount={setworkClearance}
              />
            </Grid>
          ) : null}

          {permisions?.canviewnonconformancereport ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <NonConformanceReportGraph
                shopdrawingStatusCount={nonConformanceReport}
                project={project}
                user={user}
                setShopdrawingStatusCount={setNonConformanceReport}
              />
            </Grid>
          ) : null}

          {permisions?.canviewarchitecturalinspectionrequest ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <ArchitecturalInspectionRequest
                shopdrawingStatusCount={arch}
                project={project}
                user={user}
                setShopdrawingStatusCount={setArch}
              />
            </Grid>
          ) : null}
          {permisions?.canviewmaterialinspectionrequest ? (
            <Grid item xs={12} md={5.85} className="GraphContainer">
              <InspectionRequestGraph
                shopdrawingStatusCount={inspectionCount}
                project={project}
                user={user}
                setShopdrawingStatusCount={setInspectionAccount}
              />
            </Grid>
          ) : null}
        </>
        {/* ) : null} */}

        {/* {department.department_name === "Construction" ? (
          <>
            {permisions?.canviewsiteinstruction ? (
              <Grid item xs={12} md={5.85} className="GraphContainer ">
           
                <ShopDrawingGraph
                  shopdrawingStatusCount={shopdrawingStatusCount}
                  project={project}
                  user={user}
                  setShopdrawingStatusCount={setShopdrawingStatusCount}
                />
              </Grid>
            ) : null}
            {permisions?.canviewworkinspectionrequest ? (
              <Grid item xs={12} md={5.85} className="GraphContainer ">
               
                <MaterialGraph
                  MaterialStatusCount={MaterialStatusCount}
                  project={project}
                  user={user}
                  setMaterialStatusCount={setMaterialStatusCount}
                />
              </Grid>
            ) : null}

            {permisions?.canviewnonconformancereport ? (
              <Grid item xs={12} md={5.85} className="GraphContainer ">
              
                <MethodForStatementGraph
                  MaterialStatusCount={MethodStatementCount}
                  project={project}
                  user={user}
                  setMaterialStatusCount={setMethodStatementCount}
                />
              </Grid>
            ) : null}

            {permisions?.canviewarchitecturalinspectionrequest ? (
              <Grid item xs={12} md={5.85} className="GraphContainer ">
              
                <PrequalificationGraph
                  MaterialStatusCount={preCount}
                  project={project}
                  user={user}
                  setMaterialStatusCount={setPreCount}
                />
              </Grid>
            ) : null}

            {permisions?.canviewmaterialinspectionrequest ? (
              <Grid item xs={12} md={5.85} className="GraphContainer ">
             
                <TechnicalGraph
                  MaterialStatusCount={technical}
                  project={project}
                  user={user}
                  setMaterialStatusCount={setTechinal}
                />
              </Grid>
            ) : null}
          </>
        ) : null} */}

        <Grid item xs={12} md={5.85} className="GraphContainer">
          <MyTasksGraph
            mytaskStats={mytaskStats}
            project={project}
            user={user}
            setMyTasksStats={setMyTasksStats}
          />
        </Grid>
        {permisions?.canviewassingedtaskpageworkspace ? (
          <Grid item xs={12} md={5.85} className="GraphContainer">
            <AssignedTasksGraph
              assignedTaskStats={assignedTaskStats}
              project={project}
              user={user}
              setAssignedTasksStats={setAssignedTasksStats}
            />
          </Grid>
        ) : null}

        <Grid item xs={11.8} className="GraphContainer">
          <TimeSavedGraph
            project={project}
            user={user}
            timeSaved={timeSaved}
            setTimeSaved={setTimeSaved}
            department={department}
            userPosition={userPosition}
          />
        </Grid>
        <Grid item xs={11.8} className="GraphContainer">
          <MoneySavedGraph
            project={project}
            user={user}
            moneySaved={moneySaved}
            setMoneySaved={setMoneySaved}
            department={department}
            userPosition={userPosition}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default GraphsMain;
