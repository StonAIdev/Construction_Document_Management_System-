import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

import Grid from "@mui/material/Grid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { IconButton } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AddTaskIcon from "@mui/icons-material/AddTask";
import TaskModel from "../../../outlook_components/CreateTaskModal/CreateTaskModal";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Replies } from "../Replies";
import { getToken } from "../../../utils/GetToken";

import UploadCard from "../UploadCard";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import Popover from "@mui/material/Popover";

import Divider from "@mui/material/Divider";

import { url } from "../../../url";
import ReplyComponent from "../ReplyComponent";
import Box from "@mui/material/Box";

import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { Email } from "@mui/icons-material";

export default function EmailsDetailMobile({
  emailDetails,
  setClicked,
  project,
  userInfo,
  projectUsers,
  user,
  department,
}) {
  var size = Object.keys(emailDetails).length;

  const [contextMenu, setContextMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [taskModalToggle, setTaskModalToggle] = useState(false);
  const [selectedText, setSelectedText] = useState([]);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyOrForward, setReplyOrForward] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [repliesEmail, setRepliesEmail] = useState();
  const [token, setToken] = useState(null);

  const [attachments, setAttachments] = useState([]);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAttachment, setSelectedAttachment] = useState();

  const handleClick = (event, attachment) => {
    setSelectedAttachment(attachment);

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openAttachmentPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleToken = async () => {
    const token = await getToken();
    setToken(token);
  };
  const getGraphApiReplies = async (emailArr) => {
    const replayUsersArray = [];

    for (let index = 0; index < emailArr.length; index++) {
      var config = {
        method: "get",
        url: `https://graph.microsoft.com/v1.0/me/messages/${emailArr[index].email_id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const repliesGraphApi = await axios(config);

      replayUsersArray.push(repliesGraphApi.data);
    }
    return replayUsersArray;
  };

  const replyApiCall = async () => {
    try {
      var res = await axios.post(
        url + "/Email/getReply",
        {
          email_id: emailDetails.email_id,
        },
        {
          headers: { token: user.token },
        }
      );

      const emailArr = res.data;

      if (emailArr.length > 0) {
        const repliesArr = await getGraphApiReplies(emailArr);

        setRepliesEmail(repliesArr);
      } else {
        setRepliesEmail([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const attachmentsApiCall = async () => {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
      method: "GET",
      headers: headers,
    };

    try {
      var res = await axios(
        `https://graph.microsoft.com/v1.0/me/messages/${emailDetails.email_id}/attachments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAttachments(res.data.value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!token) {
      handleToken();
    }
    replyApiCall();

    if (emailDetails.has_attachments) {
      attachmentsApiCall();
    } else {
      setAttachments([]);
    }
  }, [emailDetails, token]);

  const handleClickVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("Email Deleted Sucessfully", { variant });
  };

  const handleCloseContext = () => {
    setContextMenu(null);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
    setContextMenu(null);
  };

  const handleFolder = (type) => {
    if (type === "application/pdf") {
      return faFilePdf;
    } else if (type === "docx" || type === "doc" || type === "msword") {
      return faFileWord;
    } else if (
      type === "jpeg" ||
      type === "jpg" ||
      type === "png" ||
      type === "svg"
    ) {
      return faImage;
    } else {
      return faFile;
    }
  };

  const handleReplyOpen = (title) => {
    setReplyOrForward(title);
    setReplyOpen(true);
  };

  function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  function saveByteArray(reportName, byte, type) {
    var blob = new Blob([byte], { type: type });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  const handleDownloadAttachments = (name, contentBytes, type) => {
    var sampleArr = base64ToArrayBuffer(contentBytes);
    saveByteArray(name, sampleArr, type);
  };
  const handleContextMenu = (event) => {
    event.preventDefault();

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
  const value = 0;

  const handleDelete = async (email_id) => {
    if (
      window.confirm(
        "Are you sure do you want to delete this email? This email will get deleted from outlook too"
      )
    ) {
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
  return (
    <>
      {taskModalToggle ? (
        <TaskModel
          taskModalToggle={taskModalToggle}
          setTaskModalToggle={setTaskModalToggle}
          selectedText={selectedText}
          project={project}
          projectUsers={projectUsers}
          userInfo={userInfo}
          user={user}
          department={department}
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
        }}
        onContextMenu={handleContextMenu}
      >
        <CardContent>
          <Grid container xs={{ mr: 0 }} col={12}>
            <Grid item xs={2} sm={1}>
              <Avatar sx={{ bgcolor: "var(--blue)" }}>
                {emailDetails.sender?.substring(0, 2).toUpperCase()}
              </Avatar>
            </Grid>

            <Grid item xs={6} sm={7}>
              <Typography
                sx={{ fontSize: 17, fontWeight: 20, mt: 0.5 }}
                color="text.secondary"
                gutterBottom
              >
                {emailDetails.sender}
              </Typography>
            </Grid>
            <Grid item xs={4} style={{ textAlign: "right" }}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                <AccessTimeIcon sx={{ width: 16, height: 16 }} />
                {emailDetails.time?.substring(0, 10)}
                <IconButton sx={{ width: 30, height: 30 }} onClick={setClicked}>
                  <ArrowBackIcon />
                </IconButton>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <br />

              <Typography
                sx={{ fontSize: 20, fontWeight: "bold" }}
                color="text.secondary"
                gutterBottom
              >
                {emailDetails.subject}
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ textAlign: "center" }}>
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(emailDetails.email_id)}
              >
                <DeleteForeverRoundedIcon color="action" />
              </IconButton>
              <IconButton>
                <AttachmentIcon style={{ transform: "rotate(130deg)" }} />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <br />

              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {emailDetails.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {emailDetails.email_body}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ marginTop: 10 }}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                {attachments && attachments.length > 0 ? (
                  attachments.map((a, index) => (
                    <>
                      <UploadCard
                        key={index}
                        name={a.name}
                        size={a.size}
                        type={a.contentType}
                        bytes={a.contentBytes}
                        project={project}
                        user={user}
                        file={a}
                      />
                    </>
                  ))
                ) : (
                  <CircularProgress />
                )}
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Grid container>
          {replyOpen ? (
            <Grid item md={12} xs={12}>
              <ReplyComponent
                user={user}
                project={project}
                userInfo={userInfo}
                setReplyOpen={setReplyOpen}
                replyOrForward={replyOrForward}
                sender={emailDetails.sender_email}
                subjectRec={emailDetails.subject}
                email_id={emailDetails.email_id}
                token={token}
                bodyRec={emailDetails.email_body}
              />
            </Grid>
          ) : (
            <>
              <Grid item sm xs></Grid>
              <Grid item sm={2} xs={3}>
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
              <Grid item sm={3} xs={4}>
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

              <Grid item sm xs></Grid>

              <Divider />
              {repliesEmail && repliesEmail.length > 0
                ? repliesEmail.map((email, i) => (
                    <Replies
                      key={i}
                      user={user}
                      project={project}
                      userInfo={userInfo}
                      projectUsers={projectUsers}
                      token={token}
                      email={email}
                      parent_email_id={emailDetails.id}
                    />
                  ))
                : null}
            </>
          )}
        </Grid>
      </Card>
    </>
  );
}
