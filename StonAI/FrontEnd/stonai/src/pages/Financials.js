// import React, { useEffect, useRef, useState } from "react";
// import {
//     Box,
//     Container,
//     Grid,
//     IconButton,
//     Typography,
//   } from "@material-ui/core";
// import { Tabs, Tab ,} from "@mui/material";

// import ProjectOverview from "../components/Financials/ProjectOverview";
// import ChangeOrders from "../components/Financials/ChangeOrders";
// import PaymentApplication from "../components/Financials/PaymentApplication";
// import BackCharges from "../components/Financials/BackCharges";
// import Claims from "../components/Financials/Claims";

// const Financials = () => {
//     const [tabValue,setTabValue]=useState("one");
//     const handleTabChange = (event, newValue) => {
//         console.log("tab", newValue);
//         setTabValue(newValue);
//       };
//       const renderSwitch = (tabValue) => {
//         switch (tabValue) {
//           case "two":
//             return (
//               <Grid container className="">
//                 <Grid item lg={12} md={12} xl={12} xs={12} className="=' w-100 ">
//                 <ChangeOrders/>
//                 </Grid>
//               </Grid>
//             );
//           case "three":
//             return (
//                 <PaymentApplication/>
//             );
//           case "four":
//             return (
//                 <BackCharges/>
//             );
//           case "five":
//             return (
//                 <Claims/>
//             );
//           default:
//             return (
//               <Grid container>
//                 <Grid item lg={12} md={12} xl={12} xs={12}>
//                     <ProjectOverview/>
//                 </Grid>
//               </Grid>
//             );
//         }
//       };
//   return(
//     <>
//      <Box
//         sx={{
//           backgroundColor: "background.default",
//           minHeight: "100%",
//           py: 3,
//           marginBottom: "3rem",
//         }}
//       >
//         <Grid container direction="column" rowSpacing={2}>
//           <Grid container item>
//             <Grid item md={12}>
//               <Tabs
//                value={tabValue}
//                onChange={handleTabChange}
//                 textColor="primary"
//                 indicatorColor="primary"
//                 aria-label="secondary tabs example"
//               >
//                 <Tab value="one" label="Project Overview" />
//                 <Tab value="two" label="Change Orders" />
//                 <Tab value="three" label="Payment Applications" />
//                 <Tab value="four" label="Back Charges" />
//                 <Tab value="five" label="Claims" />
//               </Tabs>

//             </Grid>
//             <Grid
//               item
//               md={12}
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 paddingRight: "50px",
//               }}
//             >

//             </Grid>
//           </Grid>
//           <Grid item>
//             {tabValue === "five"?
//               renderSwitch(tabValue)
//               :
//               <Container className="" maxWidth={false}>
//                 {renderSwitch(tabValue)}
//               </Container>}
//           </Grid>
//         </Grid>
//       </Box>
//     </>
//   )

// };

// export default Financials;
