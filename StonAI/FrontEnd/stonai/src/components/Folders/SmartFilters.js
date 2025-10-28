// import React, { useEffect, useState } from "react";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import IconButton from "@mui/material/IconButton";
// import axios from "axios";
// import { Formik, Field, Form } from "formik";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CardHeader,
//   Checkbox,
//   Divider,
//   FormControlLabel,
//   Grid,
//   Typography,
//   Container,
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Select,
// } from "@material-ui/core";
// import MaterialSubmittal from "./Filters/MaterialSubmittal";
// import ShopDrawingSubmittal from "./Filters/ShopDrawingSubmittal";
// import SiteInstruction from "./Filters/SiteInstruction";
// import TechnicalSubmittal from "./Filters/TechnicalSubmittal";
// import MethodStatementSubmittal from "./Filters/MethodStatementSubmittal";
// import NonConformanceReport from "./Filters/NonConformanceReport";
// import PrequalificationSubmittal from "./Filters/PrequalificationSubmittal";
// import RequestInformation from "./Filters/RequestInformation";
// import WorkInspectionRequest from "./Filters/WorkInspectionRequest";
// import MeterialInspectionRequest from "./Filters/MeterialInspectionRequest";
// import ArchitecturalInspectionRequest from "./Filters/ArchitecturalInspectionRequest";
// import All from "./Filters/All";

// export default function SmartFilters({
//   user,
//   check,
//   filters,
//   setFilters,
//   saveClicked,
//   setSaveClicked,
//   setSaveToggle,
//   isChildren,
//   clearAllExceptCategoryHandler,
//   clearAllHandler,
//   category,
//   setCategory,
//   contractor,
//   setContractor,
//   project,
//   department,
// }) {
//   const [resetHeuristicKey, setResetHeuristicKey] = useState(false);
//   const [isAdvanceFiltersOpen, setIsAdvanceFiltersOpen] = useState(false);
//   const resetForm = () => setResetHeuristicKey(!resetHeuristicKey);
//   var categories = [
//     {
//       label: "Shop Drawing Submittals",
//       value: "Shop Drawing Submittals",
//     },
//     {
//       label: "Material Submittals",
//       value: "Material Submittals",
//     },
//     {
//       label: "Site Instruction",
//       value: "Site Instruction",
//     },
//     {
//       label: "Technical Submittal",
//       value: "Technical Submittal",
//     },
//     {
//       label: "Method Statement Submittal",
//       value: "Method Statement Submittal",
//     },
//     {
//       label: "Non Conformance Report",
//       value: "Non Conformance Report",
//     },
//     {
//       label: "Prequalification Submittal",
//       value: "Prequalification Submittal",
//     },
//     {
//       label: "Request for Information",
//       value: "Request for Information",
//     },
//     {
//       label: "Work Inspection Request",
//       value: "Work Inspection Request",
//     },
//     {
//       label: "Meterial Inspection Request",
//       value: "Meterial Inspection Request",
//     },
//     {
//       label: "Architectural Inspection Request",
//       value: "Architectural Inspection Request",
//     },
//     {
//       label: "ALL",
//       value: "ALL",
//     },
//   ];
//   var contractors = [
//     {
//       label: "VAMED",
//       value: "VAMED",
//     },
//     {
//       label: "UNIC",
//       value: "UNIC",
//     },
//     {
//       label: "ALL",
//       value: "ALL",
//     },
//   ];

//   const openAdvanceFilters = () => {
//     if (isAdvanceFiltersOpen) {
//       setIsAdvanceFiltersOpen(false);
//     } else {
//       setIsAdvanceFiltersOpen(true);
//     }
//   };
//   const handleCategoryChange = (event) => {
//     setCategory(event.target.value);
//     clearAllExceptCategoryHandler();
//   };
//   const handleContractorChange = (event) => {
//     setContractor(event.target.value);
//     clearAllExceptCategoryHandler();
//   };
//   const clearContractorHandler = () => {
//     setContractor(null);
//     clearAllHandler();
//   };
//   const contractorSaveButton = () => {
//     const val = {
//       contractor: contractor,
//       category: category,
//     };
//     setFilters(val);
//     setSaveToggle(Math.random());
//     setSaveClicked(true);
//   };
//   const likce = () => {
//     //console.log("cliked");
//   };
//   var saveButton;
//   if (!category && contractor) {
//     saveButton = (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "flex-end",
//           p: 2,
//         }}
//       >
//         {saveClicked && (
//           <Grid item md={4} sm={6} xs={12}>
//             <Button variant="text" onClick={clearContractorHandler}>
//               Clear All
//             </Button>
//           </Grid>
//         )}
//         <Button
//           color="primary"
//           variant="contained"
//           onClick={contractorSaveButton}
//         >
//           Search
//         </Button>
//       </Box>
//     );
//   }
//   var view;
//   if (category === "Shop Drawing Submittals") {
//     view = (
//       <ShopDrawingSubmittal
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveClicked={setSaveClicked}
//         setSaveToggle={setSaveToggle}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Material Submittals") {
//     view = (
//       <MaterialSubmittal
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Site Instruction") {
//     view = (
//       <SiteInstruction
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Technical Submittal") {
//     view = (
//       <TechnicalSubmittal
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Method Statement Submittal") {
//     view = (
//       <MethodStatementSubmittal
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Non Conformance Report") {
//     view = (
//       <NonConformanceReport
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Prequalification Submittal") {
//     view = (
//       <PrequalificationSubmittal
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Request for Information") {
//     view = (
//       <RequestInformation
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Work Inspection Request") {
//     view = (
//       <WorkInspectionRequest
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Meterial Inspection Request") {
//     view = (
//       <MeterialInspectionRequest
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "Architectural Inspection Request") {
//     view = (
//       <ArchitecturalInspectionRequest
//         openAdvanceFilters={openAdvanceFilters}
//         isAdvanceFiltersOpen={isAdvanceFiltersOpen}
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   } else if (category === "ALL") {
//     view = (
//       <All
//         key={resetHeuristicKey}
//         resetForm={resetForm}
//         filters={filters}
//         setFilters={setFilters}
//         contractor={contractor}
//         saveClicked={saveClicked}
//         setSaveToggle={setSaveToggle}
//         setSaveClicked={setSaveClicked}
//         clearAllHandler={clearAllHandler}
//         project={project}
//         user={user}
//       />
//     );
//   }
//   return (
//     <Card>
//       <Divider />

//       {!isChildren && (
//         <CardContent>
//           <Grid container spacing={6} wrap="wrap">
//             {/* <Grid
//               item
//               md={4}
//               sm={6}
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//               xs={12}
//             >
//               <FormControl>
//                 <InputLabel id="demo-simple-select-label" size="small">
//                   Contractor
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   value={contractor}
//                   label="Contractor"
//                   onChange={handleContractorChange}
//                   size="small"
//                 >
//                   {contractors.map((contractor, i) => {
//                     return (
//                       <MenuItem value={contractor.value} key={i}>
//                         {contractor.label}
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </FormControl>
//             </Grid> */}
//             <Grid
//               item
//               md={4}
//               sm={6}
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//               xs={12}
//             >
//               <FormControl>
//                 <InputLabel id="demo-simple-select-label" size="small">
//                   Document category
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   value={category}
//                   label="Document Category"
//                   onChange={handleCategoryChange}
//                   size="small"
//                 >
//                   {categories.map((category, i) => {
//                     return (
//                       <MenuItem value={category.value} key={i}>
//                         {category.label}
//                       </MenuItem>
//                     );
//                   })}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid
//               item
//               md={4}
//               sm={6}
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//               xs={12}
//             >
//               {saveButton}
//             </Grid>
//           </Grid>
//         </CardContent>
//       )}

//       {view}
//     </Card>
//   );
// }
