import React, { useState, useEffect, useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import ListItemIcon from "@mui/material/ListItemIcon";
import EmailsDetail from "./EmailsDetails";
import { Typography } from "@material-ui/core";
import { IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import "react-perfect-scrollbar/dist/css/styles.css";
import Attachment from "@mui/icons-material/Attachment";
import MailIcon from "@mui/icons-material/Mail";
import Badge from "@mui/material/Badge";
import { deepOrange, deepPurple } from "@mui/material/colors";
import axios from "axios";
import { url } from "../../../url";
import Search from "./Search";
import EmailSkel from "../EmailsSkel";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export default function EmailsList({
  emails,
  title,
  project,
  userInfo,
  user,
  projectUsers,
  handleSearch,
  searchBarVal,
  setSearchBarVal,
  department,
  filterOrData,
  setEmails,
  setReadCount,
  readCount,
}) {
  const [checked, setChecked] = useState([-1]);
  var [emailDetails, setEmailDetails] = useState({});
  var [clicked, setClicked] = useState(-1);

  const [checkBot, setCheckBot] = useState(false);

  const [renderState, setRenderState] = useState(false);
  const startFrom = useRef(0);
  const [isMailEnd, setMailEnd] = useState(false);

  // const [replyOpen, setReplyOpen] = useState(false);
  const listInnerRef = useRef(0);

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const cleanEmailDetail = () => {
    // setReplyOpen(false);

    setEmailDetails({});
    setClicked(-1);
  };

  const getNextMails = async () => {
    try {
      const mailsToPush = emails;

      const response = await axios.post(
        url + "/Email/getNextMails",
        {
          user_id: user.user_id,
          startFrom: startFrom.current,
          title: title,
        },
        { headers: { token: user.token } }
      );
      var count = 0;

      if (response.data.length === 0) {
        setMailEnd(true);
      } else if (response.data.length > 0) {
        response.data.forEach((element) => {
          if (!element.is_read) {
            count = count + 1;
          }

          mailsToPush.push(element);
        });

        setReadCount(readCount + count);

        setEmails(mailsToPush);
        setRenderState(!renderState);
      }

      // setPaginatedEmails(mailsToPush);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const onScroll = async () => {
    if (listInnerRef.current && !isMailEnd) {
      var { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

      scrollTop = parseInt(scrollTop);
      scrollHeight = parseInt(scrollHeight);
      clientHeight = parseInt(clientHeight);
      if (scrollTop + clientHeight === scrollHeight) {
        setCheckBot(true);

        startFrom.current = startFrom.current + 15;
        if (!filterOrData) {
          await getNextMails();
        }

        // setEmails(response.data);
      }
    }
  };
  useEffect(() => {
    return function cleanup() {
      cleanEmailDetail();
    };
  }, []);

  useEffect(() => {}, [renderState, isMailEnd]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleEmailDetails = (value, i) => {
    // setReplyOpen(false);

    if (value.is_read === false) {
      setReadCount(readCount - 1);
    }
    value.is_read = true;
    setEmailDetails((emailDetails = value));

    setClicked((clicked = value.email_id));

    try {
      const response = axios.get(
        url + `/Email/updateStatus/${value.email_id}`,
        {
          headers: { token: user.token },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkReadUnread = (email) => {
    if (!email.is_read) {
      return "bolder";
    } else {
      return "normal";
    }
  };

  const { height } = windowDimensions;
  const { width } = windowDimensions;

  return (
    <Grid
      container
      spacing={2}
      columns={12}
      fullWidth
      sx={{ flexWrap: "nowrap" }}
    >
      <Grid container item className="" md={3.5}>
        <Card className="w-100">
          <List
            onScroll={onScroll}
            ref={listInnerRef}
            sx={{
              width: "100%",
              bgcolor: "white",
              paddingBottom: "50px",
              height: height - 100,
              overflowY: "auto",
            }}
            dense
          >
            {emails && emails.length > 0
              ? emails
                  .filter((val) => {
                    if (searchBarVal.length > 0) {
                      return val.email_body
                        .toLowerCase()
                        .includes(searchBarVal?.toLowerCase());
                    } else {
                      return val;
                    }
                  })
                  .map((value, i) => {
                    const labelId = `checkbox-list-secondary-label-${value.id}`;

                    return (
                      <ListItem
                        className=" emailleftList"
                        key={value.i}
                        disablePadding
                        onClick={() => handleEmailDetails(value, i)}
                        sx={
                          value.email_id === clicked
                            ? {
                                borderLeft: 4,
                                borderColor: "primary.main",
                              }
                            : null
                        }
                        secondaryAction={
                          <IconButton>
                            {/* <Attachment
                              style={{ transform: "rotate(130deg)" }}
                            /> */}
                          </IconButton>
                        }
                      >
                        <ListItemButton>
                          <Grid
                            container
                            columns={12}
                            className="my-1"
                            sx={{ flexWrap: "nowrap" }}
                          >
                            <Grid item className="p-1 mr-2">
                              <Avatar
                                sx={{
                                  bgcolor: "var(--blue)",
                                  height: 35,
                                  width: 35,
                                }}
                              >
                                {value.sender?.substring(0, 2).toUpperCase()}
                              </Avatar>
                            </Grid>
                            <Grid item md="auto">
                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: checkReadUnread(value),
                                }}
                                className="p-0 m-0"
                                color="text.secondary"
                                gutterBottom
                              >
                                {value.sender?.length > 22 ? (
                                  <>{value.sender?.slice(0, 22) + "..."} </>
                                ) : (
                                  <>{value.sender} </>
                                )}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 16,
                                  fontWeight: checkReadUnread(value),
                                }}
                                className="p-0 m-0 ml-1"
                                color="text.secondary"
                                gutterBottom
                              >
                                {value.subject.length > 22 ? (
                                  <>{value.subject?.slice(0, 22) + "..."} </>
                                ) : (
                                  <>{value.subject} </>
                                )}
                              </Typography>
                            </Grid>

                            {/* <Grid item md={2}  className="B5">
                              <ListItemIcon>
                                <Checkbox
                                  edge="end"
                                  onChange={handleToggle(value.id)}
                                  checked={checked.indexOf(value.id) !== -1}
                                  inputProps={{ "aria-labelledby": labelId }}
                                  sx={{ width: 24, height: 24, ml: 2 }}
                                />
                              </ListItemIcon>
                            </Grid> */}
                          </Grid>
                        </ListItemButton>
                      </ListItem>
                    );
                  })
              : null}

            {!isMailEnd && !filterOrData && checkBot ? (
              <div style={{ marginLeft: "15px" }}>
                <div className="flex-column d-flex">
                  <EmailSkel />
                </div>
                <div className="flex-column d-flex">
                  <EmailSkel />
                </div>
              </div>
            ) : null}
          </List>
        </Card>
      </Grid>

      <Grid item md={8.9}>
        <div className="EmailrightColumn">
          <EmailsDetail
            emailDetails={emailDetails}
            height={height}
            project={project}
            userInfo={userInfo}
            user={user}
            projectUsers={projectUsers}
            title={title}
            // replyOpen={replyOpen}
            // setReplyOpen={setReplyOpen}
            department={department}
          />
        </div>
      </Grid>
    </Grid>
  );
}
