import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { IconButton } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import TaskModel from "../../../outlook_components/CreateTaskModal/CreateTaskModal";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AddTaskIcon from "@mui/icons-material/AddTask";
import axios from "axios";
import { useSnackbar } from "notistack";
import { url } from "../../../url";
import ReplyComponent from "../ReplyComponent";
import Divider from "@mui/material/Divider";
import { Replies } from "../Replies";
import { getToken } from "../../../utils/GetToken";
import AiSearchDrawer from "./AiSearchDrawer";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

import UploadCard from "../UploadCard";

export default function EmailsDetail({
  emailDetails,
  height,
  user,
  project,
  userInfo,
  projectUsers,
  department,
}) {
  const value = 0;
  const [replyOpen, setReplyOpen] = useState(false);

  var size = Object.keys(emailDetails).length;
  const [selectedText, setSelectedText] = useState([]);
  const [taskModalToggle, setTaskModalToggle] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [open, setOpen] = useState(false);
  const [replyOrForward, setReplyOrForward] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [repliesEmail, setRepliesEmail] = useState();
  const [token, setToken] = useState(null);

  const [selectedTextAI, setSelectedTextAI] = useState("");
  const [attachments, setAttachments] = useState([]);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setContextMenu(null);
  };
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
    setContextMenu(null);
  };

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
  }, [token]);

  useEffect(() => {
    setAttachments([]);

    if (emailDetails.has_attachments) {
      attachmentsApiCall();
    }
  }, [emailDetails]);

  const handleClickVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("Email Deleted Sucessfully", { variant });
  };
  const handleCloseContext = () => {
    setContextMenu(null);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();

    if (window.getSelection().toString().length) {
      let exactText = window.getSelection().toString();
      setSelectedTextAI(exactText);

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
    <>
      <AiSearchDrawer
        user={user}
        project={project}
        openDrawer={openDrawer}
        handleDrawerClose={handleDrawerClose}
        selectedText={selectedTextAI}
        setSelectedText={setSelectedTextAI}
      />
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
        <MenuItem className="contextmenuitem" onClick={handleDrawerOpen}>
          <FontAwesomeIcon icon={faSearch} style={{ margin: "5px" }} />
          <Button
            aria-controls="demo-customized-menu"
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disableElevation
            className="filtersSubmenu"
          >
            <span sx={{ color: "black" }}>Check using Intelligent search</span>
          </Button>
        </MenuItem>
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

      {size > 0 ? (
        <Card
          sx={{
            width: "100%",
            bgcolor: "white",
            overflow: "auto",
            maxHeight: height - 100,
            paddingBottom: "50px",
            marginRight: "50px",
          }}
          onContextMenu={handleContextMenu}
        >
          <CardContent>
            <Grid container col={12}>
              <Grid item md>
                <Tooltip
                  title={emailDetails.sender_email}
                  placement="top"
                  className=""
                >
                  <Avatar color="primary">
                    {emailDetails.sender?.substring(0, 2).toUpperCase()}
                  </Avatar>
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
                  {emailDetails.sender}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 15,
                    color: "grey",
                    padding: "0",
                    margin: "0",
                  }}
                  color="text.secondary"
                  gutterBottom
                >
                  {emailDetails.sender_email}
                </Typography>
              </Grid>
              <Grid item md={3} style={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  <AccessTimeIcon sx={{ width: 16, height: 16 }} />{" "}
                  {emailDetails.time?.substring(0, 10)}
                </Typography>
              </Grid>
              <Grid item md={8}>
                <br />

                <Typography
                  sx={{ fontSize: 20, fontWeight: "bold" }}
                  color="text.secondary"
                  gutterBottom
                >
                  {emailDetails.subject}
                </Typography>
              </Grid>
              <Grid item md={4} style={{ textAlign: "right" }}>
                <br />

                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(emailDetails.email_id)}
                >
                  <DeleteForeverRoundedIcon
                    color="action"
                    sx={{ color: "#ff0e0e" }}
                  />
                </IconButton>
                {emailDetails.has_attachments ? (
                  <IconButton>
                    <AttachmentIcon style={{ transform: "rotate(130deg)" }} />
                  </IconButton>
                ) : null}
              </Grid>
              <Grid item md={12}>
                {/* <Typography
                  sx={{ fontSize: 17, fontWeight: 500, mb: 1.5 }}
                  color="text.secondary"
                >
                  {emailDetails.subtitle}
                </Typography> */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {emailDetails.email_body}
                </Typography>
              </Grid>

              <Grid item md={12} style={{ marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  {emailDetails.has_attachments ? (
                    attachments && attachments.length > 0 ? (
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
                            userInfo={userInfo}
                          />
                        </>
                      ))
                    ) : (
                      <CircularProgress />
                    )
                  ) : null}
                </div>
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
                  sender={emailDetails.sender_email}
                  subjectRec={emailDetails.subject}
                  email_id={emailDetails.email_id}
                  token={token}
                  bodyRec={emailDetails.email_body}
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
                <Grid item sx={{ marginRight: "20px" }}>
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

          {console.log("ressssfd", repliesEmail)}
          {repliesEmail && repliesEmail.length > 0
            ? repliesEmail.map((email, index) => (
                <Replies
                  key={index}
                  height={height}
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
        </Card>
      ) : (
        <Card
          sx={{
            minWidth: "50%",
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
          }}
        >
          <Grid sx={{ textAlign: "center" }}>
            <FontAwesomeIcon icon={faEnvelopesBulk} size="10x" />
            <Typography
              variant="body2"
              sx={{ fontSize: 20, fontWeight: "bold", mt: 2 }}
              color="text.secondary"
              gutterBottom
            >
              {"\n"} Select an item to read
            </Typography>
          </Grid>
        </Card>
      )}
    </>
  );
}
