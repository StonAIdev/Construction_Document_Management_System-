import React, { useState } from "react";
import TaskModel from "../../outlook_components/CreateTaskModal/CreateTaskModal";
import {
  Menu,
  MenuItem,
  Button,
  CardContent,
  Grid,
  Typography,
  CardActions,
  IconButton,
  Divider,
  Avatar,
  Card,
} from "@mui/material";
import axios from "axios";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { url } from "../../url";
import { useSnackbar } from "notistack";
import ReplyComponent from "./ReplyComponent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Tooltip from "@mui/material/Tooltip";

export const Replies = ({
  height,
  user,
  project,
  userInfo,
  projectUsers,
  token,
  email,
  parent_email_id,
}) => {
  console.log("parent_email_id", parent_email_id);
  const [taskModalToggle, setTaskModalToggle] = useState(false);
  const [selectedText, setSelectedText] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyOrForward, setReplyOrForward] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const value = 0;

  console.log("email", email);

  const handleClickVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("Email Deleted Sucessfully", { variant });
  };
  const handleCloseContext = () => {
    setContextMenu(null);
  };
  const handleContextMenu = (event) => {
    event.preventDefault();
    console.log("context");
    if (window.getSelection().toString().length) {
      let exactText = window.getSelection().toString();
      var lines = exactText.split(/\r\n|\n\r|\n|\r/); // split by:     \r\n  \n\r  \n  or  \r
      const taskArray = [];
      Object.keys(lines).map((m) => {
        if (lines[m].length > 0) {
          taskArray.push({
            taskTitle: lines[m],
            assignedTo: projectUsers,
            startdate: null,
            deadline: null,
          });
        }
      });

      console.log("lines", taskArray);
      setSelectedText(taskArray);
    }
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleDelete = async (email_id) => {
    console.log(email_id);
    if (
      window.confirm(
        "Are you sure do you want to delete this email? This email will get deleted from outlook too"
      )
    ) {
      console.log("tokennn", token);

      if (token) {
        var config = {
          method: "delete",
          url: `https://graph.microsoft.com/v1.0/me/messages/${email_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        axios(config)
          .then(function (response) {
            try {
              var res = axios.delete(url + "/Email/deleteEmail" + email_id, {
                headers: { token: user.token },
              });
            } catch (e) {
              console.log(e);
            }
            console.log(response);
            handleClickVariant("success");
            window.location.reload();
          })
          .catch(function (error) {
            alert(
              "Your outlook token is expired refresh the page to delete the email"
            );
          });
      }
    } else {
    }
  };

  const handleReplyOpen = (title) => {
    setReplyOrForward(title);
    setReplyOpen(true);
  };
  return (
    <Accordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
      sx={{ width: "100%" }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography
          sx={{ fontSize: 20, fontWeight: "bold", width: "60%" }}
          color="text.secondary"
          gutterBottom
        >
          {email.subject}
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            marginLeft: "auto",
            marginRight: "15px",
          }}
        >
          <b>Sender:</b> {email.sender.emailAddress.name}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {taskModalToggle ? (
          <TaskModel
            taskModalToggle={taskModalToggle}
            setTaskModalToggle={setTaskModalToggle}
            selectedText={selectedText}
            project={project}
            projectUsers={projectUsers}
            userInfo={userInfo}
            user={user}
          />
        ) : null}
        <Menu
          open={contextMenu !== null}
          onClose={handleCloseContext}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? {
                  top: contextMenu.mouseY,
                  left: contextMenu.mouseX,
                }
              : undefined
          }
        >
          <MenuItem
            className="contextmenuitem"
            onClick={() => {
              setTaskModalToggle(true);
            }}
          >
            <AddTaskIcon style={{ margin: "5px" }} />
            <Button
              aria-controls="demo-customized-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              disableElevation
              className="filtersSubmenu"
            >
              <span sx={{ color: "black" }}>Add Tasks</span>
            </Button>
          </MenuItem>
        </Menu>
        <Card
          sx={{
            width: "100%",
            bgcolor: "white",
            overflow: "auto",
            maxHeight: height - 100,
          }}
          onContextMenu={handleContextMenu}
        >
          <CardContent>
            <Grid container col={12}>
              <Grid item md>
                <Tooltip
                  title={email.sender.emailAddress.address}
                  placement="top"
                >
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                    sx={{ width: 40, height: 40, bgcolor: "orange" }}
                  />
                </Tooltip>
              </Grid>

              <Grid item md={8}>
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 20,
                    padding: "0",
                    margin: "0",
                  }}
                  color="text.secondary"
                  gutterBottom
                >
                  {email.sender.emailAddress.name}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 20,
                    padding: "0",
                    margin: "0",
                  }}
                  color="text.secondary"
                  gutterBottom
                >
                  {email.sender.emailAddress.address}
                </Typography>
              </Grid>
              <Grid item md={3} style={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  <AccessTimeIcon sx={{ width: 16, height: 16 }} />{" "}
                  {email.receivedDateTime?.substring(0, 10)}
                </Typography>
              </Grid>
              <Grid item md={8}>
                <br />

                <Typography
                  sx={{ fontSize: 20, fontWeight: "bold" }}
                  color="text.secondary"
                  gutterBottom
                >
                  {email.subject}
                </Typography>
              </Grid>
              <Grid item md={4} style={{ textAlign: "right" }}>
                <br />
                <IconButton>
                  <ReplyOutlinedIcon color="action" />
                </IconButton>
                <IconButton>
                  <LocalPrintshopOutlinedIcon color="action" />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(email.id)}
                >
                  <DeleteForeverRoundedIcon
                    color="action"
                    sx={{ color: "#ff0e0e" }}
                  />
                </IconButton>
                <IconButton>
                  <AttachmentIcon style={{ transform: "rotate(130deg)" }} />
                </IconButton>
              </Grid>
              <Grid item md={12}>
                <Typography
                  sx={{ fontSize: 17, fontWeight: 500, mb: 1.5 }}
                  color="text.secondary"
                >
                  {email.subtitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {email.bodyPreview}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Grid container>
            {replyOpen ? (
              <Grid item md={12}>
                <ReplyComponent
                  user={user}
                  project={project}
                  userInfo={userInfo}
                  setReplyOpen={setReplyOpen}
                  replyOrForward={replyOrForward}
                  sender={email.sender.emailAddress.address}
                  subjectRec={email.subject}
                  email_id={parent_email_id}
                  token={token}
                  bodyRec={email.bodyPreview}
                />
              </Grid>
            ) : (
              <>
                <Grid item sx={{ marginLeft: "auto" }}>
                  <CardActions>
                    <Button
                      sx={{ border: 1 }}
                      variant="text"
                      startIcon={<ReplyOutlinedIcon />}
                      size="small"
                      onClick={() => {
                        handleReplyOpen("reply");
                      }}
                    >
                      Reply
                    </Button>
                  </CardActions>
                </Grid>
                <Grid item sx={{ marginright: "20px" }}>
                  <CardActions>
                    <Button
                      sx={{ border: 1 }}
                      variant="text"
                      startIcon={
                        <ReplyOutlinedIcon
                          sx={{ transform: "rotateY(180deg)" }}
                        />
                      }
                      size="small"
                      onClick={() => {
                        handleReplyOpen("forward");
                      }}
                    >
                      Forward
                    </Button>
                  </CardActions>
                </Grid>
              </>
            )}
          </Grid>

          <Divider />
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};
