import React, { useEffect } from "react";
import {
  Grid,
  Card,
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

import FolderOpen from "@mui/icons-material/FolderOpen";
import { Divider } from "@material-ui/core";
import { useState } from "react";
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

export default function Children({
  name,
  children,
  key,
  update,
  download,
  exportFile,
  share,
  remove,
  move,

  handleSelectComponent,
  project,
  user,
  handleDeleteBucket,
  handleUpdateBucket,
  currentComp,
  isSubmittalDoc,
}) {
  useEffect(() => {
    console.log("children was hit", name);
    console.log("children was hit and children is", children);
  }, [name, children]);
  let winwidth = window.innerWidth;

  var labelColor = "";

  if (
    name === "Shop Drawing Submittals" ||
    name === "Material Submittals" ||
    name === "Technical Submittal" ||
    name === "Method Statement Submittal" ||
    (name === "Prequalification Submittal") |
      (name === "Request for Information")
  ) {
    labelColor = "var(--blue)";
  } else if (
    name === "Meterial Inspection Request" ||
    name === "Work Inspection Request" ||
    name === "Architectural Inspection Request"
  ) {
    labelColor = "var(--green)";
  } else if (name === "Site Instruction" || name === "Non Conformance Report") {
    labelColor = "var(--warningRed)";
  }
  const [newFolder, setNewFolder] = useState(name);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleUpdateFolder = async () => {
    try {
      const res = await axios.post(
        url + "/folder/createNewFolder",
        {
          foldername: newFolder,
          project_id: project.project_id,
          component: currentComp,
        },
        {
          headers: { token: user.token },
        }
      );

      setOpen(false);
    } catch (error) {
      alert(
        "The folder with this name already exist. Please Create a folder with unique name"
      );
    }
  };
  return (
    <>
      {name !== null || undefined ? (
        name === "Shop Drawing Submittals" ||
        name === "Material Submittals" ||
        name === "Site Instruction" ||
        name === "Meterial Inspection Request" ||
        name === "Technical Submittal" ||
        name === "Method Statement Submittal" ||
        name === "Non Conformance Report" ||
        name === "Prequalification Submittal" ||
        name === "Request for Information" ||
        name === "Work Inspection Request" ||
        name === "Architectural Inspection Request" ? (
          <Card>
            <CardActionArea
              onClick={() => {
                handleSelectComponent(
                  name,
                  children,
                  update,
                  download,
                  exportFile,
                  share,
                  remove,
                  move
                );
              }}
            >
              <Grid container sx={{ height: "130px" }}>
                <Grid item xs={9} className=" d-flex">
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      flexDirection: "column",
                      paddingBottom: "10px !important",
                    }}
                  >
                    <Typography
                      color="text.secondary"
                      sx={{ fontWeight: "bolder" }}
                      gutterBottom
                    >
                      {name}
                    </Typography>

                    <Typography sx={{ fontSize: 13 }} color="text.secondary">
                      Folder
                    </Typography>
                  </CardContent>
                </Grid>

                <Grid item xs={0} className="Center-P">
                  <Divider
                    orientation="vertical"
                    sx={{
                      background: `${labelColor}`,
                      width: "3px",
                      height: "70%",
                      borderRadius: 50,
                      marginBlock: "auto !important",
                    }}
                  />
                </Grid>

                <Grid
                  item
                  xs={2.5}
                  className=" p-1"
                  sx={{
                    marginLeft: "auto",
                    marginBottom: "-20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <IconButton sx={{ color: "var(--blue)" }}>
                    <FolderOpen sx={{ width: 50, height: 50 }} />
                  </IconButton>

                  <Typography
                    color="text.secondary"
                    sx={{ fontWeight: "bolder" }}
                  >
                    {/* 12 */}
                  </Typography>
                </Grid>
              </Grid>
            </CardActionArea>
          </Card>
        ) : (
          <>
            <Card>
              <CardActionArea
                onClick={() => {
                  handleSelectComponent(
                    name,
                    children,
                    update,
                    download,
                    exportFile,
                    share,
                    remove,
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
                    {name}
                  </Typography>

                  <Typography sx={{ fontSize: 13 }} color="text.secondary">
                    Folder
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  height: "30px",
                  padding: 0,
                }}
              >
                {name !== "Bucket" &&
                name !== "Incoming Letters" &&
                name !== "Outgoing Letters" &&
                name !== "Responsibility Matrix" &&
                name !== "Tender Addendums" &&
                name !== "Text Contract" &&
                name !== "Scanned Contract" &&
                name !== "BOQ" &&
                name !== "MOM" &&
                name !== "Other" ? (
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
                ) : null}
              </CardActions>
            </Card>
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
                      size="small"
                      onClick={() => {
                        handleUpdateBucket(name, newFolder, currentComp);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </>
        )
      ) : (
        <p>There is no children</p>
      )}
    </>
  );
}
