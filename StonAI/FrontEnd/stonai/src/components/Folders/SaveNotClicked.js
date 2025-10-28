// import React, { useState, useEffect, useRef } from "react";
// import List from "@mui/material/List";
// import {
//   Box,
//   Container,
//   Grid,
//   IconButton,
//   Button,
//   Modal,
//   TextField,
//   Stack,
//   Typography,
//   Divider,
// } from "@material-ui/core";
// import { styled } from "@mui/material/styles";
// import ListItemFolders from "./ListItemFolders";
// import DocumentList from "./DocumentList/DocumentList";
// import Children from "./Childrens";
// import InAndOut from "./InAndOut";
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
// import ArrowBack from "@mui/icons-material/ArrowBack";
// import AddIcon from "@mui/icons-material/Add";
// import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
// import { useSnackbar } from "notistack";
// import "./Folder.css";
// import { url } from "../../url";
// import axios from "axios";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 300,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 2,
// };
// export default function SaveNotClicked({
//   project,
//   handleClickPreviewDoc,
//   filters,
//   setFilters,
//   user,
//   saveClicked,
//   clearAllHandler,
//   saveToggle,
//   children,
//   category,
//   setCategory,
//   contractor,
//   setContractor,
//   setChildren,
//   isChildren,
//   setIsChildren,
//   tree,
//   handleSelectComponentMain,
//   handleSelectComponentChildren,
//   currentComp,
//   setCurrentComp,
//   check,
//   socket,
//   users,
//   pca,
//   isFilterSearch,
//   update,
//   remove,
//   share,
//   move,
//   download,
//   exportFile,
//   userInfo,
//   backHistory,
//   getBucketFolders,
//   handleSelectComponentInAndOutChildren,
//   department,
//   allowedDuration,
//   mainclicked,
//   setmainclicked,
//   treeHeight,
//   settreeHeight,
// }) {
//   console.log(tree, "bhai tuny end main bhagna hai");
//   //console.log("backHistory123", children)

//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const [newFolder, setNewFolder] = useState("");
//   const [dynamicChild, setDynamicChild] = useState([]);
//   const { enqueueSnackbar } = useSnackbar();

//   const handleClickVariant = (variant, title) => {
//     // variant could be success, error, warning, info, or default
//     enqueueSnackbar(title, { variant });
//   };

//   useEffect(() => {
//     setDynamicChild(children);
//     console.log("main clicked", mainclicked);
//     console.log("bahi tuny bhagna hai ab click ho", children);

//     // console.log("updated tree effect", tree);
//     // console.log("children tree", children);
//     // console.log("type of children", typeof children);
//     // console.log(currentComp, "current component");
//     // //console.log("updated child effect", children)
//     // if (typeof children !== "undefined") {
//     // } else {
//     //   setDynamicChild();
//     // }
//   }, [children]);

//   console.log("dynamic child", dynamicChild);
//   // const bucketObj = {
//   //   name: "Bucket",
//   //   children: [],
//   // };

//   const handleCreateNewFolder = async () => {
//     try {
//       const res = await axios.post(
//         url + "/folder/createNewDynamicFolder",
//         {
//           foldername: newFolder,
//           project_id: project.project_id,
//           username: userInfo.username,
//           user_id: user.user_id,
//           component: currentComp,
//         },
//         {
//           headers: { token: user.token },
//         }
//       );

//       // tree.forEach((t) => {
//       //   console.log(t, "t?");
//       //   console.log(currentComp, "current comp?");
//       //   if (currentComp === "Submittals") {
//       //     if (t.name === "Submittals") {
//       //       t.children.push({
//       //         name: newFolder,
//       //         update: false,
//       //         share: true,
//       //         delete: true,
//       //         move: true,
//       //       });
//       //     }
//       //   } else if (currentComp === "Intelligent Search") {
//       //     if (t.name === "Intelligent Search") {
//       //       t.children.push({
//       //         name: newFolder,
//       //         update: false,
//       //         share: true,
//       //         delete: true,
//       //         move: true,
//       //       });
//       //     }
//       //   } else if (currentComp === "Bucket") {
//       //     if (t.name === "Bucket") {
//       //       t.children.push({
//       //         name: newFolder,
//       //         update: false,
//       //         share: true,
//       //         delete: true,
//       //         move: true,
//       //       });
//       //     }
//       //   } else {
//       //     // t.push({
//       //     // name: newFolder,
//       //     // update: false,
//       //     // share: true,
//       //     // delete: true,
//       //     // move: true,
//       //     // });
//       //   }
//       // });
//       // if (currentComp === "root") {
//       //   tree.push({
//       //     name: newFolder,
//       //     update: false,
//       //     share: true,
//       //     delete: true,
//       //     move: true,
//       //   });
//       // }
//       //console.log("newFodler", tree);

//       handleClickVariant("success", "Folder created successfully");
//       setOpen(false);
//     } catch (error) {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the
//         // browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log("Error", error.message);
//       }
//       console.log(error.config);
//     }
//   };

//   // const handleCreateNewFolderRoot = async () => {
//   //   try {
//   //     const res = await axios.post(
//   //       url + "/root_folder/createNewFolderRoot",
//   //       {
//   //         foldername: newFolder,
//   //         project_id: project.project_id,
//   //         username: userInfo.username,
//   //         user_id: user.user_id,
//   //         component: currentComp,
//   //       },
//   //       {
//   //         headers: { token: user.token },
//   //       }
//   //     );

//   //     tree.forEach((t) => {
//   //       // if (t.name === "Bucket")
//   //       //  {
//   //       t.children.push({
//   //         name: newFolder,
//   //         update: false,
//   //         share: true,
//   //         delete: true,
//   //         move: true,
//   //       });
//   //       // }
//   //     });
//   //     //console.log("newFodler", tree);

//   //     handleClickVariant("success", "Folder created successfully");
//   //     setOpen(false);
//   //   } catch (error) {
//   //     alert(
//   //       "The folder with this name already exist. Please Create a folder with unique name"
//   //     );
//   //     console.log(error);
//   //   }
//   // };
//   // const getBucketFolders = async () => {
//   //   try {
//   //     const res = await axios.post(
//   //       url + "/folder/getNewFolders",

//   //       {
//   //         project_id: project.project_id,
//   //         component: currentComp,
//   //       },
//   //       {
//   //         headers: { token: user.token },
//   //       }
//   //     );
//   //     //console.log("new folder", res.data);

//   //     res.data.forEach((element) => {
//   //       bucketObj.children.push({
//   //         name: element.name,
//   //         update: false,
//   //         share: true,
//   //         delete: true,
//   //         move: true,
//   //       });
//   //     });
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };
//   // const asyncApis = async () => {
//   //   getBucketFolders();
//   // };

//   // useEffect(() => {
//   //   asyncApis();
//   // }, []);
//   const handleDeleteBucket = async (name) => {
//     //console.log("called", name)

//     if (window.confirm("Are you sure do you want to delete this folder")) {
//       //console.log("deleted tree", tree);

//       const res = await axios.post(
//         url + "/folder/deleteFolder",
//         {
//           component: currentComp,
//           name: name,
//           project_id: project.project_id,
//         },
//         {
//           headers: { token: user.token },
//         }
//       );

//       console.log("updated res", tree);

//       // const pushDefault = {};
//       // res.data.push(pushDefault);

//       // setDynamicChild(res.data);
//     } else {
//     }
//   };

//   const handleUpdateBucket = async (name, updatedName, component) => {
//     //console.log("called", name)

//     //console.log("tree to update", tree);

//     const res = await axios.post(
//       url + "/folder/updateFolder",
//       {
//         name: name,
//         project_id: project.project_id,

//         updatedName: updatedName,
//         component: component,
//       },
//       {
//         headers: { token: user.token },
//       }
//     );

//     console.log("updated res", tree);
//     // const pushDefault = {
//     //   name: "Bucket",
//     //   update: false,
//     //   share: true,
//     //   delete: true,
//     //   move: true,
//     // };
//     // res.data.push(pushDefault);

//     // setDynamicChild(res.data);
//   };

//   const isSubmittalDoc = (document_category) => {
//     //console.log("document_category", document_category)
//     return submittalList.includes(document_category);
//   };

//   var dynamicDepEng = true;
//   var dynamicDepCons = true;
//   var dynamicDepQC = true;
//   var dynamicDep = true;

//   const handleDepEng = (t) => {
//     //console.log("hereeee", dynamicDepEng)

//     if (
//       (t.name === "Prequalification Submittal" ||
//         t.name === "Technical Submittal" ||
//         t.name === "Shop Drawing Submittals" ||
//         t.name === "Material Submittals" ||
//         t.name === "Method Statement Submittal" ||
//         t.name === "Request for Information") &&
//       dynamicDepEng
//     ) {
//       //console.log("hereeee", dynamicDepEng)
//       dynamicDepEng = false;
//       return true;
//     }
//     if (
//       (t.name === "Meterial Inspection Request" ||
//         t.name === "Work Inspection Request" ||
//         t.name === "Architectural Inspection Request") &&
//       dynamicDepCons
//     ) {
//       //console.log("hereeee", dynamicDepCons)
//       dynamicDepCons = false;
//       return true;
//     }
//     if (
//       (t.name === "Non Conformance Report" || t.name === "Site Instruction") &&
//       dynamicDepQC
//     ) {
//       //console.log("hereeee", dynamicDepQC)
//       dynamicDepQC = false;
//       return true;
//     }
//     if (!submittalList.includes(t.name) && dynamicDep) {
//       dynamicDep = false;
//       console.log("schachcdcjdakckdjckdjckd");
//       return true;
//     } else {
//       return false;
//     }
//   };

//   // const handleDepCons = (t) => {
//   //   console.log("hereeee", dynamicDepCons)

//   //   else {
//   //     return false
//   //   }
//   // }

//   // const handleDepQC = (t) => {
//   //   console.log("hereeee", dynamicDepQC)

//   //   else {
//   //     return false
//   //   }
//   // }
//   // if (isChildren) {
//   //   debugger;
//   // }
//   return (
//     <>
//       {children?.length === 0 && !isChildren && mainclicked === false ? (
//         <Grid container spacing={2}>
//           <div style={{ width: "100%", textAlign: "right" }}>
//             <Button
//               style={{ marginTop: "2rem" }}
//               variant="contained"
//               startIcon={<AddIcon />}
//               onClick={handleOpen}
//             >
//               Add New Folder
//             </Button>
//             <Modal
//               open={open}
//               onClose={handleClose}
//               aria-labelledby="modal-modal-title"
//               aria-describedby="modal-modal-description"
//             >
//               <Box sx={style}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <div style={{ padding: 0 }}>
//                     <TextField
//                       id="standard-basic"
//                       label="Folder name"
//                       variant="standard"
//                       sx={{ width: "100%" }}
//                       onChange={(event) => setNewFolder(event.target.value)}
//                     />
//                   </div>
//                   <div style={{ marginTop: "20px" }}>
//                     <Button
//                       variant="contained"
//                       endIcon={<CreateNewFolderIcon />}
//                       size="small"
//                       disabled={newFolder.length === 0 ? true : false}
//                       onClick={handleCreateNewFolder}
//                     >
//                       Create
//                     </Button>
//                   </div>
//                 </div>
//               </Box>
//             </Modal>
//           </div>
//           {tree.map((t, i) => {
//             return (
//               <Grid item md={3} xs={6} lg={3} key={i}>
//                 <ListItemFolders
//                   key={i}
//                   name={t.name}
//                   children={t.children}
//                   handleSelectComponent={handleSelectComponentMain}
//                   update={t.update}
//                   remove={t.delete}
//                   handleDeleteBucket={handleDeleteBucket}
//                   handleUpdateBucket={handleUpdateBucket}
//                   treeHeight={treeHeight}
//                   settreeHeight={settreeHeight}
//                 />
//               </Grid>
//             );
//           })}
//         </Grid>
//       ) : !isChildren && mainclicked === true ? (
//         <>
//           <div>
//             <Modal
//               open={open}
//               onClose={handleClose}
//               aria-labelledby="modal-modal-title"
//               aria-describedby="modal-modal-description"
//             >
//               <Box sx={style}>
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     flexDirection: "column",
//                   }}
//                 >
//                   <div style={{ padding: 0 }}>
//                     <TextField
//                       id="standard-basic"
//                       label="Folder name"
//                       variant="standard"
//                       sx={{ width: "100%" }}
//                       onChange={(event) => setNewFolder(event.target.value)}
//                     />
//                   </div>
//                   <div style={{ marginTop: "20px" }}>
//                     <Button
//                       variant="contained"
//                       endIcon={<CreateNewFolderIcon />}
//                       size="small"
//                       disabled={newFolder.length === 0 ? true : false}
//                       onClick={handleCreateNewFolder}
//                     >
//                       Create
//                     </Button>
//                   </div>
//                 </div>
//               </Box>
//             </Modal>
//           </div>
//           <Grid container spacing={2}>
//             {isSubmittalDoc(currentComp) ? (
//               <div className="keyparent">
//                 <div className="KeySection">
//                   <div className="keyback">KEY</div>
//                   <div className="d-flex flex-column w-100">
//                     <Grid className="KeyIndecation_card">
//                       <Grid item>
//                         <Divider
//                           orientation="vertical"
//                           sx={{
//                             backgroundColor: "var(--blue) !important",
//                             width: "3px ",
//                             height: "40px",
//                             borderRadius: 50,
//                             marginBlock: "auto !important",
//                             border: "2px solid ",
//                           }}
//                         />
//                       </Grid>
//                       <Grid item className="key-card-text">
//                         Engineering Department
//                       </Grid>
//                     </Grid>

//                     <Grid className="KeyIndecation_card">
//                       <Grid item>
//                         <Divider
//                           orientation="vertical"
//                           sx={{
//                             backgroundColor: "var(--green) !important",
//                             width: "3px ",
//                             height: "40px",
//                             borderRadius: 50,
//                             marginBlock: "auto !important",
//                             border: "2px solid ",
//                           }}
//                         />
//                       </Grid>
//                       <Grid item className="key-card-text">
//                         Construction Department
//                       </Grid>
//                     </Grid>

//                     <Grid className="KeyIndecation_card">
//                       <Grid item>
//                         <Divider
//                           orientation="vertical"
//                           sx={{
//                             backgroundColor: "var(--warningRed) !important",
//                             width: "3px ",
//                             height: "40px",
//                             borderRadius: 50,
//                             marginBlock: "auto !important",
//                             border: "2px solid ",
//                           }}
//                         />
//                       </Grid>
//                       <Grid item className="key-card-text">
//                         Quality Control Department
//                       </Grid>
//                     </Grid>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <></>
//             )}

//             <Box sx={{ width: "100%", mt: 2, ml: 2 }}>
//               <div style={{ width: "100%", marginBottom: 15 }}>
//                 <Button
//                   color="primary"
//                   variant="contained"
//                   size="small"
//                   startIcon={<ArrowBack />}
//                   onClick={() => {
//                     setCurrentComp("root");
//                     setChildren([]);
//                     setmainclicked(false);
//                   }}
//                 >
//                   <Typography variant="button">Go Back</Typography>
//                 </Button>
//               </div>

//               {/* {currentComp === "Bucket" ? ( */}
//               <div style={{ width: "100%", textAlign: "right" }}>
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={handleOpen}
//                 >
//                   Add New Folder
//                 </Button>
//               </div>
//               {/* ) : null} */}
//             </Box>

//             {console.log(children)}
//             {console.log(
//               "****************************************************"
//             )}

//             <Grid container spacing={2}>
//               {dynamicChild.map((t, i) => {
//                 return (
//                   <>
//                     {/* {(t.name === "Prequalification Submittal" || t.name === "Technical Submittal" ||
//                       t.name === "Shop Drawing Submittals" || t.name === "Material Submittals" ||
//                       t.name === "Method Statement Submittal" || t.name === "Request for Information") ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Engineering Department </Grid> : null}
//  */}

//                     {handleDepEng(t) ? (
//                       <Grid
//                         className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading"
//                         xs={12}
//                       >
//                         {t.department}{" "}
//                       </Grid>
//                     ) : null}

//                     {/* {(t.name === "Meterial Inspection Request" || t.name === "Work Inspection Reques" || t.name === "Architectural Inspection Request") ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Construction Department</Grid> : null}

//                     {(t.name === "Non Conformance Report" || t.name === "Site Instruction") ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Quality Control Department</Grid> : null} */}

//                     <Grid item md={3} xs={6} lg={3} key={i}>
//                       <Children
//                         name={t.name}
//                         key={i}
//                         update={t.update}
//                         download={t.download}
//                         exportFile={t.exportFile}
//                         share={t.share}
//                         remove={t.delete}
//                         move={t.move}
//                         project={project}
//                         user={user}
//                         handleSelectComponent={handleSelectComponentChildren}
//                         tree={tree}
//                         handleDeleteBucket={handleDeleteBucket}
//                         handleUpdateBucket={handleUpdateBucket}
//                         currentComp={currentComp}
//                         isSubmittalDoc={isSubmittalDoc}
//                         // project={project}
//                         handleClickPreviewDoc={handleClickPreviewDoc}
//                         filters={filters}
//                         setFilters={setFilters}
//                         // user={user}
//                         saveClicked={saveClicked}
//                         clearAllHandler={clearAllHandler}
//                         saveToggle={saveToggle}
//                         children={t.children}
//                         category={category}
//                         setCategory={setCategory}
//                         contractor={contractor}
//                         setContractor={setContractor}
//                         setChildren={setChildren}
//                         isChildren={isChildren}
//                         setIsChildren={setIsChildren}
//                         // tree={tree}
//                         handleSelectComponentMain={handleSelectComponentMain}
//                         handleSelectComponentChildren={
//                           handleSelectComponentChildren
//                         }
//                         //  currentComp={currentComp}
//                         setCurrentComp={setCurrentComp}
//                         check={check}
//                         socket={socket}
//                         users={users}
//                         pca={pca}
//                         isFilterSearch={isFilterSearch}
//                         // update={update}
//                         // download={download}
//                         // exportFile={exportFile}
//                         // remove={remove}
//                         // share={share}
//                         // move={move}
//                         backHistory={backHistory}
//                         department={department}
//                         allowedDuration={allowedDuration}
//                       />
//                     </Grid>

//                     {/* {handleDepCons(t) ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Construction Department</Grid> : null}

//                     {handleDepQC(t) ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Quality Control Department</Grid> : null} */}
//                   </>
//                 );
//               })}
//               <DocumentList
//                 project={project}
//                 handleClickPreviewDoc={handleClickPreviewDoc}
//                 filters={filters}
//                 setFilters={setFilters}
//                 user={user}
//                 saveClicked={saveClicked}
//                 clearAllHandler={clearAllHandler}
//                 saveToggle={saveToggle}
//                 children={children}
//                 category={category}
//                 setCategory={setCategory}
//                 contractor={contractor}
//                 setContractor={setContractor}
//                 setChildren={setChildren}
//                 isChildren={isChildren}
//                 setIsChildren={setIsChildren}
//                 tree={tree}
//                 handleSelectComponentMain={handleSelectComponentMain}
//                 handleSelectComponentChildren={handleSelectComponentChildren}
//                 currentComp={currentComp}
//                 setCurrentComp={setCurrentComp}
//                 check={check}
//                 socket={socket}
//                 users={users}
//                 pca={pca}
//                 isFilterSearch={isFilterSearch}
//                 update={update}
//                 download={download}
//                 exportFile={exportFile}
//                 remove={remove}
//                 share={share}
//                 move={move}
//                 backHistory={backHistory}
//                 department={department}
//                 allowedDuration={allowedDuration}
//               />
//             </Grid>
//           </Grid>
//         </>
//       ) : (
//         <>
//           {isSubmittalDoc(currentComp) ? (
//             <>
//               <div style={{ width: "100%", marginBottom: 10 }}>
//                 <Button
//                   color="primary"
//                   variant="contained"
//                   size="small"
//                   startIcon={<ArrowBack />}
//                   onClick={() => {
//                     //console.log("backHistory.current", children);
//                     setCurrentComp("Submittals");
//                     setChildren(backHistory.current.children);
//                     setIsChildren(false);
//                   }}
//                 >
//                   <Typography variant="button">Go Back</Typography>
//                 </Button>
//               </div>
//               <Grid container spacing={2}>
//                 <Grid item md={3} xs={6} lg={3}>
//                   <InAndOut
//                     name="IN"
//                     project={project}
//                     user={user}
//                     handleSelectComponent={
//                       handleSelectComponentInAndOutChildren
//                     }
//                     tree={tree}
//                     handleDeleteBucket={handleDeleteBucket}
//                     handleUpdateBucket={handleUpdateBucket}
//                     currentComp={currentComp}
//                     isSubmittalDoc={isSubmittalDoc}
//                   />
//                 </Grid>
//                 <Grid item md={3} xs={6} lg={3}>
//                   <InAndOut
//                     name="OUT"
//                     project={project}
//                     user={user}
//                     handleSelectComponent={
//                       handleSelectComponentInAndOutChildren
//                     }
//                     tree={tree}
//                     handleDeleteBucket={handleDeleteBucket}
//                     handleUpdateBucket={handleUpdateBucket}
//                     currentComp={currentComp}
//                     isSubmittalDoc={isSubmittalDoc}
//                   />
//                 </Grid>
//               </Grid>
//             </>
//           ) : (
//             <Grid container spacing={2}>
//               {dynamicChild?.map((t, i) => {
//                 return (
//                   <>
//                     {/* {(t.name === "Prequalification Submittal" || t.name === "Technical Submittal" ||
//                     t.name === "Shop Drawing Submittals" || t.name === "Material Submittals" ||
//                     t.name === "Method Statement Submittal" || t.name === "Request for Information") ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Engineering Department </Grid> : null}
// */}

//                     {handleDepEng(t) ? (
//                       <Grid
//                         className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading"
//                         xs={12}
//                       >
//                         {t.department}{" "}
//                       </Grid>
//                     ) : null}

//                     {/* {(t.name === "Meterial Inspection Request" || t.name === "Work Inspection Reques" || t.name === "Architectural Inspection Request") ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Construction Department</Grid> : null}

//                   {(t.name === "Non Conformance Report" || t.name === "Site Instruction") ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Quality Control Department</Grid> : null} */}

//                     <Grid item md={3} xs={6} lg={3} key={i}>
//                       <Children
//                         name={t.name}
//                         key={i}
//                         update={t.update}
//                         download={t.download}
//                         exportFile={t.exportFile}
//                         share={t.share}
//                         remove={t.delete}
//                         move={t.move}
//                         project={project}
//                         user={user}
//                         handleSelectComponent={handleSelectComponentChildren}
//                         tree={tree}
//                         handleDeleteBucket={handleDeleteBucket}
//                         handleUpdateBucket={handleUpdateBucket}
//                         currentComp={currentComp}
//                         isSubmittalDoc={isSubmittalDoc}
//                         // project={project}
//                         handleClickPreviewDoc={handleClickPreviewDoc}
//                         filters={filters}
//                         setFilters={setFilters}
//                         // user={user}
//                         saveClicked={saveClicked}
//                         clearAllHandler={clearAllHandler}
//                         saveToggle={saveToggle}
//                         children={children}
//                         category={category}
//                         setCategory={setCategory}
//                         contractor={contractor}
//                         setContractor={setContractor}
//                         setChildren={setChildren}
//                         isChildren={isChildren}
//                         setIsChildren={setIsChildren}
//                         // tree={tree}
//                         handleSelectComponentMain={handleSelectComponentMain}
//                         handleSelectComponentChildren={
//                           handleSelectComponentChildren
//                         }
//                         //  currentComp={currentComp}
//                         setCurrentComp={setCurrentComp}
//                         check={check}
//                         socket={socket}
//                         users={users}
//                         pca={pca}
//                         isFilterSearch={isFilterSearch}
//                         // update={update}
//                         // download={download}
//                         // exportFile={exportFile}
//                         // remove={remove}
//                         // share={share}
//                         // move={move}
//                         backHistory={backHistory}
//                         department={department}
//                         allowedDuration={allowedDuration}
//                       />
//                     </Grid>

//                     {/* {handleDepCons(t) ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Construction Department</Grid> : null}

//                   {handleDepQC(t) ? <Grid className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading" xs={12}>Quality Control Department</Grid> : null} */}
//                   </>
//                 );
//               })}
//               <DocumentList
//                 project={project}
//                 handleClickPreviewDoc={handleClickPreviewDoc}
//                 filters={filters}
//                 setFilters={setFilters}
//                 user={user}
//                 saveClicked={saveClicked}
//                 clearAllHandler={clearAllHandler}
//                 saveToggle={saveToggle}
//                 children={children}
//                 category={category}
//                 setCategory={setCategory}
//                 contractor={contractor}
//                 setContractor={setContractor}
//                 setChildren={setChildren}
//                 isChildren={isChildren}
//                 setIsChildren={setIsChildren}
//                 tree={tree}
//                 handleSelectComponentMain={handleSelectComponentMain}
//                 handleSelectComponentChildren={handleSelectComponentChildren}
//                 currentComp={currentComp}
//                 setCurrentComp={setCurrentComp}
//                 check={check}
//                 socket={socket}
//                 users={users}
//                 pca={pca}
//                 isFilterSearch={isFilterSearch}
//                 update={update}
//                 download={download}
//                 exportFile={exportFile}
//                 remove={remove}
//                 share={share}
//                 move={move}
//                 backHistory={backHistory}
//                 department={department}
//                 allowedDuration={allowedDuration}
//               />
//             </Grid>
//           )}
//         </>
//       )}
//     </>
//   );
// }

// const submittalList = [
//   "Material Submittals",
//   "Shop Drawing Submittals",
//   "Submittals",
//   "Site Instruction",
//   "Technical Submittal",
//   "Method Statement Submittal",
//   "Non Conformance Report",
//   "Prequalification Submittal",
//   "Request for Information",
//   "Work Inspection Request",
//   "Meterial Inspection Request",
//   "Architectural Inspection Request",
// ];
