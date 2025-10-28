import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  IconButton,
  Typography,
  Box,
  CardContent,
  CardActionArea,
  CardActions,
  Button,
  Stack,
  Modal,
  TextField,
} from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import StorageIcon from "@mui/icons-material/Storage";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderOpen from "@mui/icons-material/FolderOpen";

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
export default function ListItemFolders({
  name,
  children,
  handleSelectComponent,
  update,
  share,
  remove,
  download,
  exportFile,
  move,
  handleDeleteBucket,
  handleUpdateBucket,
  treeHeight,
  settreeHeight,
  isAdmin,
  category,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [newFolder, setNewFolder] = useState(name);
  return (
    <>
      {name === "Submittals" ||
      name === "Bucket" ||
      name === "Intelligent Search" ||
      name === "Shop Drawing Submittals" ||
      name === "Material Submittals" ||
      name === "Prequalification Submittal" ||
      name === "Technical Submittal" ||
      name === "Method Statement Submittal" ||
      name === "Request for Information" ||
      name === "Meterial Inspection Request" ||
      name === "Work Inspection Request" ||
      name === "Architectural Inspection Request" ||
      name === "Non Conformance Report" ||
      name === "Site Instruction" ||
      name === "Responsibility Matrix" ||
      name === "Tender Addendums" ||
      name === "Text Contract" ||
      name === "Scanned Contract" ||
      name === "BOQ" ||
      name === "MOM" ||
      name === "Other" ||
      name === "Work Inspection Request" ||
      name === "Incoming Letters" ||
      name === "Outgoing Letters" ? (
        <Card>
          <CardActionArea
            onClick={() => {
              // debugger;
              handleSelectComponent(
                name,
                children,
                update,
                share,
                remove,
                download,
                exportFile,
                move
              );
            }}
          >
            <Grid container>
              <Grid
                item
                md={12}
                sx={{ textAlign: "right", marginBottom: "-20px" }}
              >
                <IconButton>
                  {name === "Bucket" ? (
                    <FolderOpen
                      sx={{ width: 50, height: 50, color: "var(--green)" }}
                    />
                  ) : (
                    <FolderOpen
                      sx={{ width: 50, height: 50, color: "var(--blue)" }}
                    />
                  )}
                </IconButton>
              </Grid>
            </Grid>
            <CardContent>
              <Typography
                color="text.secondary"
                sx={{ fontWeight: "bolder" }}
                gutterBottom
              >
                {/* {name.length > 20 ? (
              <>{name.slice(0, 20) + "..."} </>
            ) : (
              <>{name} </>
            )} */}

                {name}
              </Typography>

              <Typography sx={{ fontSize: 13 }} color="text.secondary">
                Folder
              </Typography>
            </CardContent>
            <CardActions
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                height: "18px",
                padding: 0,
              }}
            >
              {/* <Stack direction="row">
                <IconButton onClick={handleOpen}>
                  {" "}
                  <EditIcon style={{ color: "var(--green)" }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDeleteBucket(name);
                  }}
                >
                  <DeleteForeverIcon sx={{ color: "var(--warningRed)" }} />{" "}
                </IconButton>
              </Stack> */}
            </CardActions>
          </CardActionArea>
        </Card>
      ) : (
        <>
          <Card>
            <CardActionArea
              onClick={() => {
                // debugger;
                handleSelectComponent(
                  name,
                  children,
                  update,
                  share,
                  remove,
                  download,
                  exportFile,
                  move
                );
              }}
            >
              <Grid container>
                <Grid
                  item
                  md={12}
                  sx={{ textAlign: "right", marginBottom: "-20px" }}
                >
                  <IconButton sx={{ color: "var(--blue)" }}>
                    <FolderOpen sx={{ width: 50, height: 50 }} />
                  </IconButton>
                </Grid>
              </Grid>
              <CardContent sx={{ paddingBottom: "0px !important" }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontWeight: "bolder" }}
                  gutterBottom
                >
                  {/* {name.length > 20 ? (
          <>{name.slice(0, 20) + "..."} </>
        ) : (
          <>{name} </>
        )} */}
                  {name}
                </Typography>

                <Typography sx={{ fontSize: 13 }} color="text.secondary">
                  Folder
                </Typography>
              </CardContent>
            </CardActionArea>
            {/* {currentComp === "Bucket" ? ( */}
            {isAdmin ? (
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  height: "30px",
                  padding: 0,
                }}
              >
                <Stack direction="row">
                  <IconButton onClick={handleOpen}>
                    {" "}
                    <EditIcon style={{ color: "var(--green)" }} />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleDeleteBucket(name);
                    }}
                  >
                    <DeleteForeverIcon sx={{ color: "var(--warningRed)" }} />{" "}
                  </IconButton>
                </Stack>
              </CardActions>
            ) : (
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  height: "18px",
                  padding: 0,
                }}
              >
                {/* <Stack direction="row">
                <IconButton onClick={handleOpen}>
                  {" "}
                  <EditIcon style={{ color: "var(--green)" }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDeleteBucket(name);
                  }}
                >
                  <DeleteForeverIcon sx={{ color: "var(--warningRed)" }} />{" "}
                </IconButton>
              </Stack> */}
              </CardActions>
            )}
            {/* ) : null} */}
          </Card>
          {isAdmin ? (
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
                      value={newFolder}
                      sx={{ width: "100%" }}
                      onChange={(event) => setNewFolder(event.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      variant="contained"
                      // endIcon={<CreateNewFolderIcon />}
                      size="small"
                      // disabled={newFolder.length === 0 ? true : false}
                      onClick={() => {
                        handleUpdateBucket(name, newFolder, category);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          ) : null}
        </>
      )}
    </>
  );
}
