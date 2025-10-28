import React, { useState, useEffect, useContext } from "react";
import { TreeContext } from "../../context/TreeContext";
import {
  Box,
  Grid,
  Button,
  Modal,
  TextField,
  Typography,
  Divider,
} from "@material-ui/core";

import ListItemFolders from "./ListItemFolders";
import DocumentList from "./DocumentList/DocumentList";

import InAndOut from "./InAndOut";

import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { useSnackbar } from "notistack";
import "./Folder.css";
import { url } from "../../url";

import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};
export default function SaveNotClickeddynamic({
  project,
  handleClickPreviewDoc,
  filters,
  setFilters,
  user,
  saveClicked,
  clearAllHandler,
  saveToggle,
  children,
  category,
  setCategory,
  contractor,
  setContractor,
  setChildren,
  isChildren,
  setIsChildren,
  tree,
  handleSelectComponentMain,
  handleSelectComponentChildren,
  handleSelectComponentChildren1,
  currentComp,
  setCurrentComp,
  check,
  socket,
  users,
  pca,
  isFilterSearch,
  update,
  remove,
  share,
  move,
  download,
  exportFile,
  userInfo,
  backHistory,
  navHistory,
  getBucketFolders,
  handleSelectComponentInAndOutChildren,
  department,
  allowedDuration,
  mainclicked,
  setmainclicked,
  treeHeight,
  settreeHeight,
  asyncApis,
  isAdmin,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newFolder, setNewFolder] = useState("");
  const [dynamicChild, setDynamicChild] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [treedynamic, setTreedynamic] = useState(tree);
  const [sharePerm, setSharePerm] = useState(true);
  const [deletePerm, setDeletePerm] = useState(true);
  const { treeContext, setTreeContext } = useContext(TreeContext);
  // const [isHovered, setIsHovered] = useState(false);
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  useEffect(() => {
    setDynamicChild(children);

    console.log("tree before updating", treeContext);
    setTreeContext(treedynamic);
    console.log("tree after updating", treeContext);
  }, [children, treedynamic, currentComp, category]);

  useEffect(() => {}, [treeContext]);

  const findAndUpdateTree = (tree, currentComp, operation, name, newFolder) => {
    let treeUpdated = false;
    let newTree;

    if (!currentComp) {
      // Root level operation
      if (operation === "add") {
        // Add new folder at the root level
        newTree = [
          ...tree,
          {
            name: newFolder,
            update: false,
            share: true,
            delete: true,
            move: true,
            children: [],
          },
        ];
        treeUpdated = true;
      } else if (operation === "delete") {
        // Delete folder at the root level
        newTree = tree.filter((node) => node.name !== name);
        treeUpdated = true;
      } else if (operation === "update") {
        // Handle update at root level
        newTree = tree.map((node) => {
          if (node.name === name) {
            return { ...node, name: newFolder };
          }
          return node;
        });
        treeUpdated = true;
      }
      // ... other root level operations
    } else if (currentComp) {
      // Operations at levels other than root
      newTree = tree.map((node) => {
        if (node.name === currentComp) {
          if (operation === "add") {
            // Add new folder at the current component level
            const newFolderNode = {
              name: newFolder,
              update: false,
              share: true,
              delete: true,
              move: true,
              children: [],
            };
            return { ...node, children: [...node.children, newFolderNode] };
          } else if (operation === "delete") {
            // Delete folder at the current component level
            newTree = node.children.filter((child) => child.name !== name);
            return { ...node, children: newTree };
          } else if (operation === "update") {
            if (currentComp === "") {
              return { ...node, name: newFolder };
            } else {
              window.location.reload();
              return node;
            }
            // ... other operations for currentComp level
          }
        } else {
          setCurrentComp("");

          // Set the children to the children of the popped node
          setChildren([]);

          // setChildren([]);
          setmainclicked(false);
          navHistory.current.length = 0;

          settreeHeight(0);
          setCategory("");
        }

        if (node.children) {
          // Recursive call for children nodes
          const updatedChildren = findAndUpdateTree(
            node.children,
            currentComp,
            operation,
            name,
            newFolder
          );
          if (updatedChildren !== node.children) {
            return { ...node, children: updatedChildren };
          }
        }
        return node;
      });
    }

    if (newTree !== tree) {
      setTreedynamic(newTree);
      // window.location.reload();
      // setTreeContext(tree);
      treeUpdated = true;
    }

    const dynamicNode = newTree.find((node) => node.name === currentComp);
    if (dynamicNode) {
      setDynamicChild(dynamicNode.children);
    }
    // setTreeContext(newTree);
    // Return the new tree if there were updates, otherwise return the original tree
    return treeUpdated ? newTree : tree;
  };

  const handleCreateNewFolder = async () => {
    try {
      const res = await axios.post(
        url + "/folder/createNewDynamicFolder",
        {
          foldername: newFolder,
          project_id: project.project_id,
          username: userInfo.username,
          user_id: user.user_id,
          component: currentComp,
        },
        {
          headers: { token: user.token },
        }
      );
      findAndUpdateTree(treedynamic, currentComp, "add", "", newFolder);
      handleClickVariant("success", "Folder created successfully");
      setOpen(false);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

  const handleDeleteBucket = async (name) => {
    if (window.confirm("Are you sure do you want to delete this folder")) {
      const res = await axios.post(
        url + "/folder/deleteFolder",
        {
          component: currentComp,
          name: name,
          project_id: project.project_id,
          user_id: user.user_id,
        },
        {
          headers: { token: user.token },
        }
      );

      findAndUpdateTree(treedynamic, currentComp, "delete", name, "");
      handleClickVariant("success", "Folder deleted successfully");
    } else {
    }
  };

  const handleUpdateBucket = async (name, updatedName, component) => {
    const res = await axios.post(
      url + "/folder/updateFolder",
      {
        name: name,
        project_id: project.project_id,

        updatedName: updatedName,
        component: component,
        user_id: user.user_id,
      },
      {
        headers: { token: user.token },
      }
    );

    findAndUpdateTree(treedynamic, currentComp, "update", name, updatedName);
    handleClickVariant("success", "Folder updated successfully");
  };

  const isSubmittalDoc = (document_category) => {
    return submittalList.includes(document_category);
  };

  var dynamicDepEng = true;
  var dynamicDepCons = true;
  var dynamicDepQC = true;
  var dynamicDep = true;

  const handleDepEng = (t) => {
    if (
      (t.name === "Prequalification Submittal" ||
        t.name === "Technical Submittal" ||
        t.name === "Shop Drawing Submittals" ||
        t.name === "Material Submittals" ||
        t.name === "Method Statement Submittal" ||
        t.name === "Request for Information") &&
      dynamicDepEng
    ) {
      dynamicDepEng = false;
      return true;
    }
    if (
      (t.name === "Meterial Inspection Request" ||
        t.name === "Work Inspection Request" ||
        t.name === "Architectural Inspection Request") &&
      dynamicDepCons
    ) {
      dynamicDepCons = false;
      return true;
    }
    if (
      (t.name === "Non Conformance Report" || t.name === "Site Instruction") &&
      dynamicDepQC
    ) {
      dynamicDepQC = false;
      return true;
    }
    if (!submittalList.includes(t.name) && dynamicDep) {
      dynamicDep = false;

      return true;
    } else {
      return false;
    }
  };

  const handleHomeClick = () => {
    setCurrentComp("");

    // Set the children to the children of the popped node
    setChildren([]);

    // setChildren([]);
    setmainclicked(false);
    navHistory.current.length = 0;

    settreeHeight(0);
    setCategory("");
  };

  const BreadcrumbItem = ({ compName, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
      <span
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: "pointer",
          borderBottom:
            compName !== "Home"
              ? isHovered
                ? "2px solid #3a75b9"
                : "2px solid transparent"
              : "none",
          transition: "border-color .3s ease",
          color: isHovered ? "#3a75b9" : "#6b778c",
        }}
      >
        {compName === "Home" ? (
          <>
            {" "}
            <HomeIcon /> {">"}
          </>
        ) : (
          <span>{compName}</span>
        )}
      </span>
    );
  };

  const Breadcrumbs = ({ breadcrumbs }) => {
    return (
      <div
        className="breadcrumbs"
        style={{
          display: "flex",
          gap: "0.2rem",
          width: "100%",
          height: "fit-content",
          color: "#6b778c",
        }}
      >
        {treeHeight > 0 ? (
          <>
            <BreadcrumbItem compName="Home" onClick={handleHomeClick}>
              <HomeIcon />
            </BreadcrumbItem>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem
                  compName={breadcrumb.currentComp}
                  onClick={() => handleBreadcrumbClick(breadcrumb.currentComp)}
                />
                {index < breadcrumbs.length - 1 && " > "}
              </React.Fragment>
            ))}
          </>
        ) : null}
      </div>
    );
  };

  const handleBreadcrumbClick = (compName) => {
    let foundIndex = navHistory.current.findIndex(
      (item) => item.currentComp === compName
    );
    if (foundIndex >= 0) {
      navHistory.current = navHistory.current.slice(0, foundIndex + 1);
      const previousNode = navHistory.current[navHistory.current.length - 1];
      setCurrentComp(previousNode.currentComp);
      setChildren(previousNode.children);
      settreeHeight(previousNode.height);
      setCategory(previousNode.currentComp);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "20px",
        }}
      >
        <Breadcrumbs breadcrumbs={navHistory.current} />
        {treeHeight !== 4 ? (
          <>
            {isAdmin ? (
              <>
                {staticRoutes.includes(currentComp) && treeHeight !== 0 ? (
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "16px",
                      marginRight: "16px",
                      width: "100%",
                    }}
                  >
                    <Typography sx={{ fontStyle: "bold", color: "red" }}>
                      {" "}
                      &#9888; cant add folder here (static routes)
                    </Typography>
                  </div>
                ) : (
                  <div style={{ width: "100%", textAlign: "right" }}>
                    <Button
                      style={{ marginTop: "16px", marginRight: "16px" }}
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpen}
                    >
                      Add New Folder
                    </Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <div style={{ padding: 0 }}>
                            <TextField
                              id="standard-basic"
                              label="Folder name"
                              variant="standard"
                              sx={{ width: "100%" }}
                              onChange={(event) =>
                                setNewFolder(event.target.value)
                              }
                            />
                          </div>
                          <div style={{ marginTop: "20px" }}>
                            <Button
                              variant="contained"
                              endIcon={<CreateNewFolderIcon />}
                              size="small"
                              disabled={newFolder.length === 0 ? true : false}
                              onClick={handleCreateNewFolder}
                            >
                              Create
                            </Button>
                          </div>
                        </div>
                      </Box>
                    </Modal>
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : null}
      </div>
      {treeHeight === 0 ? (
        <Grid container spacing={2}>
          {treedynamic?.map((t, i) => {
            return (
              <Grid item md={3} xs={6} lg={3} key={i}>
                <ListItemFolders
                  key={i}
                  name={t.name}
                  children={t.children}
                  handleSelectComponent={handleSelectComponentMain}
                  update={t.update}
                  download={t.download}
                  exportFile={t.exportFile}
                  share={t.share}
                  remove={t.delete}
                  move={t.move}
                  handleDeleteBucket={handleDeleteBucket}
                  handleUpdateBucket={handleUpdateBucket}
                  treeHeight={treeHeight}
                  settreeHeight={settreeHeight}
                  isAdmin={isAdmin}
                  category={category}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : treeHeight === 1 ? (
        <>
          <Grid container spacing={2}>
            {isSubmittalDoc(currentComp) ? (
              <div className="keyparent">
                <div className="KeySection">
                  <div className="keyback">KEY</div>
                  <div className="d-flex flex-column w-100">
                    <Grid className="KeyIndecation_card">
                      <Grid item>
                        <Divider
                          orientation="vertical"
                          sx={{
                            backgroundColor: "var(--blue) !important",
                            width: "3px ",
                            height: "40px",
                            borderRadius: 50,
                            marginBlock: "auto !important",
                            border: "2px solid ",
                          }}
                        />
                      </Grid>
                      <Grid item className="key-card-text">
                        Engineering Department
                      </Grid>
                    </Grid>

                    <Grid className="KeyIndecation_card">
                      <Grid item>
                        <Divider
                          orientation="vertical"
                          sx={{
                            backgroundColor: "var(--green) !important",
                            width: "3px ",
                            height: "40px",
                            borderRadius: 50,
                            marginBlock: "auto !important",
                            border: "2px solid ",
                          }}
                        />
                      </Grid>
                      <Grid item className="key-card-text">
                        Construction Department
                      </Grid>
                    </Grid>

                    <Grid className="KeyIndecation_card">
                      <Grid item>
                        <Divider
                          orientation="vertical"
                          sx={{
                            backgroundColor: "var(--warningRed) !important",
                            width: "3px ",
                            height: "40px",
                            borderRadius: 50,
                            marginBlock: "auto !important",
                            border: "2px solid ",
                          }}
                        />
                      </Grid>
                      <Grid item className="key-card-text">
                        Quality Control Department
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <Grid container spacing={2}>
              {dynamicChild?.map((t, i) => {
                return (
                  <>
                    {handleDepEng(t) ? (
                      <Grid
                        className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading"
                        xs={12}
                      >
                        {t.department}{" "}
                      </Grid>
                    ) : null}

                    <Grid item md={3} xs={6} lg={3} key={i}>
                      <ListItemFolders
                        key={i}
                        name={t.name}
                        children={t.children}
                        handleSelectComponent={handleSelectComponentMain}
                        update={t.update}
                        download={t.download}
                        exportFile={t.exportFile}
                        share={t.share}
                        remove={t.delete}
                        move={t.move}
                        handleDeleteBucket={handleDeleteBucket}
                        handleUpdateBucket={handleUpdateBucket}
                        treeHeight={treeHeight}
                        settreeHeight={settreeHeight}
                        isAdmin={isAdmin}
                        category={category}
                        // name={t.name}
                        // children={t.children}
                        // key={i}
                        // update={t.update}
                        // download={t.download}
                        // exportFile={t.exportFile}
                        // share={t.share}
                        // remove={t.delete}
                        // move={t.move}
                        // project={project}
                        // user={user}
                        // handleSelectComponent={handleSelectComponentChildren}
                        // tree={treedynamic}
                        // handleDeleteBucket={handleDeleteBucket}
                        // handleUpdateBucket={handleUpdateBucket}
                        // currentComp={currentComp}
                        // isSubmittalDoc={isSubmittalDoc}
                        // // project={project}
                        // handleClickPreviewDoc={handleClickPreviewDoc}
                        // filters={filters}
                        // setFilters={setFilters}
                        // // user={user}
                        // saveClicked={saveClicked}
                        // clearAllHandler={clearAllHandler}
                        // saveToggle={saveToggle}
                        // category={category}
                        // setCategory={setCategory}
                        // contractor={contractor}
                        // setContractor={setContractor}
                        // setChildren={setChildren}
                        // isChildren={isChildren}
                        // setIsChildren={setIsChildren}
                        // // tree={tree}
                        // handleSelectComponentMain={handleSelectComponentMain}
                        // handleSelectComponentChildren={
                        //   handleSelectComponentChildren
                        // }
                        // //  currentComp={currentComp}
                        // setCurrentComp={setCurrentComp}
                        // check={check}
                        // socket={socket}
                        // users={users}
                        // pca={pca}
                        // isFilterSearch={isFilterSearch}
                        // // update={update}
                        // // download={download}
                        // // exportFile={exportFile}
                        // // remove={remove}
                        // // share={share}
                        // // move={move}
                        // backHistory={backHistory}
                        // navHistory={navHistory}
                        // department={department}
                        // allowedDuration={allowedDuration}
                      />
                    </Grid>
                  </>
                );
              })}
              <DocumentList
                project={project}
                handleClickPreviewDoc={handleClickPreviewDoc}
                filters={filters}
                setFilters={setFilters}
                user={user}
                saveClicked={saveClicked}
                clearAllHandler={clearAllHandler}
                saveToggle={saveToggle}
                children={children}
                category={category}
                setCategory={setCategory}
                contractor={contractor}
                setContractor={setContractor}
                setChildren={setChildren}
                isChildren={isChildren}
                setIsChildren={setIsChildren}
                tree={treedynamic}
                handleSelectComponentMain={handleSelectComponentMain}
                handleSelectComponentChildren={handleSelectComponentChildren}
                currentComp={currentComp}
                setCurrentComp={setCurrentComp}
                check={check}
                socket={socket}
                users={users}
                pca={pca}
                isFilterSearch={isFilterSearch}
                update={update}
                download={download}
                exportFile={exportFile}
                remove={remove}
                share={share}
                move={move}
                backHistory={backHistory}
                navHistory={navHistory}
                department={department}
                allowedDuration={allowedDuration}
                treeHeight={treeHeight}
              />
            </Grid>
          </Grid>
        </>
      ) : treeHeight === 2 ? (
        <>
          {isSubmittalDoc(currentComp) ? (
            <>
              <Grid container spacing={2}>
                <Grid item md={3} xs={6} lg={3}>
                  <InAndOut
                    name="IN"
                    project={project}
                    user={user}
                    handleSelectComponent={
                      handleSelectComponentInAndOutChildren
                    }
                    update={update}
                    download={download}
                    exportFile={exportFile}
                    share={share}
                    remove={remove}
                    move={move}
                    tree={treedynamic}
                    handleDeleteBucket={handleDeleteBucket}
                    handleUpdateBucket={handleUpdateBucket}
                    currentComp={currentComp}
                    isSubmittalDoc={isSubmittalDoc}
                  />
                </Grid>
                <Grid item md={3} xs={6} lg={3}>
                  <InAndOut
                    name="OUT"
                    project={project}
                    user={user}
                    handleSelectComponent={
                      handleSelectComponentInAndOutChildren
                    }
                    update={update}
                    download={download}
                    exportFile={exportFile}
                    share={share}
                    remove={remove}
                    move={move}
                    tree={treedynamic}
                    handleDeleteBucket={handleDeleteBucket}
                    handleUpdateBucket={handleUpdateBucket}
                    currentComp={currentComp}
                    isSubmittalDoc={isSubmittalDoc}
                  />
                </Grid>
              </Grid>
              {dynamicChild?.map((t, i) => {
                return (
                  <>
                    {handleDepEng(t) ? (
                      <Grid
                        className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading"
                        xs={12}
                      >
                        {t.department}{" "}
                      </Grid>
                    ) : null}
                    <Grid item md={3} xs={6} lg={3} key={i}>
                      <ListItemFolders
                        key={i}
                        name={t.name}
                        children={t.children}
                        handleSelectComponent={handleSelectComponentMain}
                        update={t.update}
                        download={t.download}
                        exportFile={t.exportFile}
                        share={t.share}
                        remove={t.delete}
                        move={t.move}
                        handleDeleteBucket={handleDeleteBucket}
                        handleUpdateBucket={handleUpdateBucket}
                        treeHeight={treeHeight}
                        settreeHeight={settreeHeight}
                        isAdmin={isAdmin}
                        category={category}
                        // name={t.name}
                        // key={i}
                        // update={t.update}
                        // download={t.download}
                        // exportFile={t.exportFile}
                        // share={t.share}
                        // remove={t.delete}
                        // move={t.move}
                        // project={project}
                        // user={user}
                        // handleSelectComponent={handleSelectComponentChildren1}
                        // tree={treedynamic}
                        // handleDeleteBucket={handleDeleteBucket}
                        // handleUpdateBucket={handleUpdateBucket}
                        // currentComp={currentComp}
                        // isSubmittalDoc={isSubmittalDoc}
                        // // project={project}
                        // handleClickPreviewDoc={handleClickPreviewDoc}
                        // filters={filters}
                        // setFilters={setFilters}
                        // // user={user}
                        // saveClicked={saveClicked}
                        // clearAllHandler={clearAllHandler}
                        // saveToggle={saveToggle}
                        // children={children}
                        // category={category}
                        // setCategory={setCategory}
                        // contractor={contractor}
                        // setContractor={setContractor}
                        // setChildren={setChildren}
                        // isChildren={isChildren}
                        // setIsChildren={setIsChildren}
                        // // tree={tree}
                        // handleSelectComponentMain={handleSelectComponentMain}
                        // handleSelectComponentChildren={
                        //   handleSelectComponentChildren
                        // }
                        // //  currentComp={currentComp}
                        // setCurrentComp={setCurrentComp}
                        // check={check}
                        // socket={socket}
                        // users={users}
                        // pca={pca}
                        // isFilterSearch={isFilterSearch}
                        // // update={update}
                        // // download={download}
                        // // exportFile={exportFile}
                        // // remove={remove}
                        // // share={share}
                        // // move={move}
                        // backHistory={backHistory}
                        // navHistory={navHistory}
                        // department={department}
                        // allowedDuration={allowedDuration}
                      />
                    </Grid>
                  </>
                );
              })}
            </>
          ) : (
            <Grid container spacing={2}>
              {dynamicChild?.map((t, i) => {
                return (
                  <>
                    {handleDepEng(t) ? (
                      <Grid
                        className="mt-3 ml-4 d-flex justify-content-start SubmittalHeading"
                        xs={12}
                      >
                        {t.department}{" "}
                      </Grid>
                    ) : null}
                    <Grid item md={3} xs={6} lg={3} key={i}>
                      <ListItemFolders
                        key={i}
                        name={t.name}
                        children={t.children}
                        handleSelectComponent={handleSelectComponentMain}
                        update={t.update}
                        download={t.download}
                        exportFile={t.exportFile}
                        share={t.share}
                        remove={t.delete}
                        move={t.move}
                        handleDeleteBucket={handleDeleteBucket}
                        handleUpdateBucket={handleUpdateBucket}
                        treeHeight={treeHeight}
                        settreeHeight={settreeHeight}
                        isAdmin={isAdmin}
                        category={category}
                        // name={t.name}
                        // children={children}
                        // key={i}
                        // update={t.update}
                        // download={t.download}
                        // exportFile={t.exportFile}
                        // share={t.share}
                        // remove={t.delete}
                        // move={t.move}
                        // project={project}
                        // user={user}
                        // handleSelectComponent={handleSelectComponentChildren}
                        // tree={treedynamic}
                        // handleDeleteBucket={handleDeleteBucket}
                        // handleUpdateBucket={handleUpdateBucket}
                        // currentComp={currentComp}
                        // isSubmittalDoc={isSubmittalDoc}
                        // // project={project}
                        // handleClickPreviewDoc={handleClickPreviewDoc}
                        // filters={filters}
                        // setFilters={setFilters}
                        // // user={user}
                        // saveClicked={saveClicked}
                        // clearAllHandler={clearAllHandler}
                        // saveToggle={saveToggle}
                        // category={category}
                        // setCategory={setCategory}
                        // contractor={contractor}
                        // setContractor={setContractor}
                        // setChildren={setChildren}
                        // isChildren={isChildren}
                        // setIsChildren={setIsChildren}
                        // // tree={tree}
                        // handleSelectComponentMain={handleSelectComponentMain}
                        // handleSelectComponentChildren={
                        //   handleSelectComponentChildren
                        // }
                        // //  currentComp={currentComp}
                        // setCurrentComp={setCurrentComp}
                        // check={check}
                        // socket={socket}
                        // users={users}
                        // pca={pca}
                        // isFilterSearch={isFilterSearch}
                        // // update={update}
                        // // download={download}
                        // // exportFile={exportFile}
                        // // remove={remove}
                        // // share={share}
                        // // move={move}
                        // backHistory={backHistory}
                        // navHistory={navHistory}
                        // department={department}
                        // allowedDuration={allowedDuration}
                      />
                    </Grid>
                  </>
                );
              })}
              <DocumentList
                project={project}
                handleClickPreviewDoc={handleClickPreviewDoc}
                filters={filters}
                setFilters={setFilters}
                user={user}
                saveClicked={saveClicked}
                clearAllHandler={clearAllHandler}
                saveToggle={saveToggle}
                children={children}
                category={category}
                setCategory={setCategory}
                contractor={contractor}
                setContractor={setContractor}
                setChildren={setChildren}
                isChildren={isChildren}
                setIsChildren={setIsChildren}
                tree={treedynamic}
                handleSelectComponentMain={handleSelectComponentMain}
                handleSelectComponentChildren={handleSelectComponentChildren}
                currentComp={currentComp}
                setCurrentComp={setCurrentComp}
                check={check}
                socket={socket}
                users={users}
                pca={pca}
                isFilterSearch={isFilterSearch}
                update={update}
                download={download}
                exportFile={exportFile}
                remove={remove}
                share={share}
                move={move}
                backHistory={backHistory}
                navHistory={navHistory}
                department={department}
                allowedDuration={allowedDuration}
                treeHeight={treeHeight}
              />
            </Grid>
          )}
        </>
      ) : treeHeight === 3 ? (
        <>
          <Grid container spacing={2}>
            <Grid container spacing={2}>
              {dynamicChild?.map((t, i) => {
                return (
                  <>
                    {/* {t.children.map((child, j) => ( */}
                    <Grid item md={3} xs={6} lg={3} key={i}>
                      <ListItemFolders
                        key={i}
                        name={t.name}
                        children={t.children}
                        handleSelectComponent={handleSelectComponentMain}
                        update={t.update}
                        download={t.download}
                        exportFile={t.exportFile}
                        share={t.share}
                        remove={t.delete}
                        move={t.move}
                        handleDeleteBucket={handleDeleteBucket}
                        handleUpdateBucket={handleUpdateBucket}
                        treeHeight={treeHeight}
                        settreeHeight={settreeHeight}
                        isAdmin={isAdmin}
                        category={category}
                        // name={t.name}
                        // key={i}
                        // update={t.update}
                        // download={t.download}
                        // exportFile={t.exportFile}
                        // share={t.share}
                        // remove={t.delete}
                        // move={t.move}
                        // project={project}
                        // user={user}
                        // handleSelectComponent={handleSelectComponentChildren}
                        // tree={treedynamic}
                        // handleDeleteBucket={handleDeleteBucket}
                        // handleUpdateBucket={handleUpdateBucket}
                        // currentComp={currentComp}
                        // isSubmittalDoc={isSubmittalDoc}
                        // handleClickPreviewDoc={handleClickPreviewDoc}
                        // filters={filters}
                        // setFilters={setFilters}
                        // saveClicked={saveClicked}
                        // clearAllHandler={clearAllHandler}
                        // saveToggle={saveToggle}
                        // children={t.children}
                        // category={category}
                        // setCategory={setCategory}
                        // contractor={contractor}
                        // setContractor={setContractor}
                        // setChildren={setChildren}
                        // isChildren={isChildren}
                        // setIsChildren={setIsChildren}
                        // handleSelectComponentMain={handleSelectComponentMain}
                        // handleSelectComponentChildren={
                        //   handleSelectComponentChildren
                        // }
                        // setCurrentComp={setCurrentComp}
                        // check={check}
                        // socket={socket}
                        // users={users}
                        // pca={pca}
                        // isFilterSearch={isFilterSearch}
                        // backHistory={backHistory}
                        // navHistory={navHistory}
                        // department={department}
                        // allowedDuration={allowedDuration}
                      />
                    </Grid>
                    {/* ))} */}
                  </>
                );
              })}

              <DocumentList
                project={project}
                handleClickPreviewDoc={handleClickPreviewDoc}
                filters={filters}
                setFilters={setFilters}
                user={user}
                saveClicked={saveClicked}
                clearAllHandler={clearAllHandler}
                saveToggle={saveToggle}
                children={children}
                category={category}
                setCategory={setCategory}
                contractor={contractor}
                setContractor={setContractor}
                setChildren={setChildren}
                isChildren={isChildren}
                setIsChildren={setIsChildren}
                tree={treedynamic}
                handleSelectComponentMain={handleSelectComponentMain}
                handleSelectComponentChildren={handleSelectComponentChildren}
                currentComp={currentComp}
                setCurrentComp={setCurrentComp}
                check={check}
                socket={socket}
                users={users}
                pca={pca}
                isFilterSearch={isFilterSearch}
                update={update}
                download={download}
                exportFile={exportFile}
                remove={remove}
                share={share}
                move={move}
                backHistory={backHistory}
                navHistory={navHistory}
                department={department}
                allowedDuration={allowedDuration}
                treeHeight={treeHeight}
              />
            </Grid>
          </Grid>
        </>
      ) : treeHeight === 4 ? (
        <Grid container spacing={2}>
          <DocumentList
            project={project}
            handleClickPreviewDoc={handleClickPreviewDoc}
            filters={filters}
            setFilters={setFilters}
            user={user}
            saveClicked={saveClicked}
            clearAllHandler={clearAllHandler}
            saveToggle={saveToggle}
            children={children}
            category={category}
            setCategory={setCategory}
            contractor={contractor}
            setContractor={setContractor}
            setChildren={setChildren}
            isChildren={isChildren}
            setIsChildren={setIsChildren}
            tree={treedynamic}
            handleSelectComponentMain={handleSelectComponentMain}
            handleSelectComponentChildren={handleSelectComponentChildren}
            currentComp={currentComp}
            setCurrentComp={setCurrentComp}
            check={check}
            socket={socket}
            users={users}
            pca={pca}
            isFilterSearch={isFilterSearch}
            update={update}
            download={download}
            exportFile={exportFile}
            remove={remove}
            share={share}
            move={move}
            backHistory={backHistory}
            navHistory={navHistory}
            department={department}
            allowedDuration={allowedDuration}
            treeHeight={treeHeight}
          />
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
}

const submittalList = [
  "Material Submittals",
  "Shop Drawing Submittals",
  "Site Instruction",
  "Technical Submittal",
  "Method Statement Submittal",
  "Non Conformance Report",
  "Prequalification Submittal",
  "Request for Information",
  "Work Inspection Request",
  "Meterial Inspection Request",
  "Architectural Inspection Request",
];
const staticRoutes = [
  "IN",
  "OUT",
  "Material Submittals",
  "Shop Drawing Submittals",
  "Site Instruction",
  "Technical Submittal",
  "Method Statement Submittal",
  "Non Conformance Report",
  "Prequalification Submittal",
  "Request for Information",
  "Work Inspection Request",
  "Meterial Inspection Request",
  "Architectural Inspection Request",
  "Architectural Inspection Request",
  "Non Conformance Report",
  "Site Instruction",
  "Responsibility Matrix",
  "Tender Addendums",
  "Text Contract",
  "Scanned Contract",
  "BOQ",
  "MOM",
  "Other",
  "Work Inspection Request",
  "Incoming Letters",
  "Outgoing Letters",
  "Intelligent Search",
  "Submittals",
];
