import { useEffect } from "react";
import List from "@mui/material/List";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import ListItemFolders from "./ListItemFoldersEmail";
import DocumentList from "./DocumentList/DocumentListEmail";
import Children from "./ChildrensEmail";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBack from "@mui/icons-material/ArrowBack";

export default function SaveNotClicked({
  project,
  handleClickPreviewDoc,
  filters,
  setFilters,
  user,
  saveClicked,
  clearAllHandler,
  saveToggle,
  children,
  setChildren,
  isChildren,
  setIsChildren,
  tree,
  handleSelectComponentMain,
  handleSelectComponentChildren,
  currentComp,
  setCurrentComp,
  category,
  setCategory,
  contractor,
  check,
  setCheck,
  socket,
  users,
  pca,
  isFilterSearch,
  checkedDocs,
  setCheckedDocs,
  name,
  setName,
  handleAttachFiles,
  handleClose,
  loading,
}) {
  console.log("SaveNotClicked", tree, children, isChildren);

  useEffect(() => {
    console.log("updated tree effect", tree);
    console.log("children tree", children);
    console.log("type of children", typeof children);
    // Check if children is defined before setting it
    if (children) {
      console.log("children is defined before setting", children);
    }
  }, [children]);

  return (
    <>
      {children.length === 0 && !isChildren ? (
        <Grid container spacing={2}>
          {tree.map((t, i) => {
            return (
              <Grid item md={3} xs={6} lg={3} key={i}>
                <ListItemFolders
                  key={i}
                  name={t.name}
                  children={t.children}
                  handleSelectComponent={handleSelectComponentMain}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : !isChildren ? (
        <>
          <Grid container spacing={1}>
            <Box sx={{ textAlign: "right", width: "100%" }}>
              <IconButton
                sx={{
                  width: 30,
                  height: 30,
                }}
                onClick={() => setChildren([])}
              >
                <ArrowBack />
              </IconButton>
            </Box>
            {children.map((t, i) => {
              return (
                <Grid item md={3} xs={6} lg={3} key={i}>
                  <Children
                    name={t.name}
                    key={i}
                    handleSelectComponent={handleSelectComponentChildren}
                  />
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <DocumentList
          project={project}
          handleClickPreviewDoc={handleClickPreviewDoc}
          filters={filters}
          setFilters={setFilters}
          user={user}
          saveClicked={saveClicked}
          clearAllHandler={clearAllHandler}
          saveToggle={saveToggle}
          currentComp={currentComp}
          setCurrentComp={setCurrentComp}
          category={category}
          setCategory={setCategory}
          isChildren={isChildren}
          setIsChildren={setIsChildren}
          check={check}
          socket={socket}
          users={users}
          pca={pca}
          isFilterSearch={isFilterSearch}
          setChildren
          checkedDocs={checkedDocs}
          setCheckedDocs={setCheckedDocs}
          documentNameFilter={name}
          setdocumentNameFilter={setName}
          handleAttachFiles={handleAttachFiles}
          handleClose={handleClose}
          loading={loading}
        />
      )}
    </>
  );
}
