import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";

import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";

import AttachmentIcon from "@mui/icons-material/Attachment";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Typography } from "@material-ui/core";
import { IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import EmailsDetailMobile from "./EmailsDetailsMobile";
import Divider from "@mui/material/Divider";
import { url } from "../../../url";

import axios from "axios";

export default function EmailsListMobile({
  emails,
  title,
  project,
  userInfo,
  projectUsers,
  user,
  department,
}) {
  const [checked, setChecked] = useState([-1]);
  var [clicked, setClicked] = useState(false);
  var [emailDetails, setEmailDetails] = useState({});

  const [paginatedEmails, setPaginatedEmails] = useState(emails);

  var startFrom = 0;
  const [isMailEnd, setMailEnd] = useState(false);
  const listInnerRef = useRef();

  const handleEmailDetails = (value) => {
    setEmailDetails(value);
    setClicked(!clicked);
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

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
  const cleanEmailDetail = () => {
    // setReplyOpen(false);
    setEmailDetails({});
    setClicked(-1);
  };

  const getNextMails = async () => {
    try {
      const mailsToPush = paginatedEmails;

      const response = await axios.post(
        url + "/Email/getNextMails",
        {
          user_id: user.user_id,
          startFrom: startFrom,
          title: title,
        },
        { headers: { token: user.token } }
      );
      if (response.data.length === 0) {
        setMailEnd(true);
        startFrom = 0;
      } else if (response.data.length > 0) {
        response.data.forEach((element) => {
          mailsToPush.push(element);
        });

        setPaginatedEmails(mailsToPush);
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
        startFrom = startFrom + 15;
        await getNextMails();

        // setEmails(response.data);
      }
    }
  };

  useEffect(() => {
    return () => {
      cleanEmailDetail();
    };
  }, [emails]);

  return (
    <Grid container spacing={2} columns={12}>
      {clicked === false ? (
        <Grid item xs={12}>
          <Card>
            <List
              onScroll={onScroll}
              ref={listInnerRef}
              sx={{
                width: "100%",
                bgcolor: "white",
                overflowY: "auto",
              }}
              dense
            >
              {paginatedEmails && paginatedEmails.length
                ? paginatedEmails.map((value, i) => {
                    const labelId = `checkbox-list-secondary-label-${value.id}`;
                    return (
                      <>
                        <ListItem
                          key={i}
                          disablePadding
                          onClick={() => handleEmailDetails(value)}
                          sx={
                            value.id === clicked
                              ? { borderLeft: 4, borderColor: "primary.main" }
                              : null
                          }
                        >
                          <ListItemButton>
                            <Grid container columns={12}>
                              <Grid item xs={2}>
                                <Avatar sx={{ bgcolor: "var(--blue)" }}>
                                  {value.sender?.substring(0, 2).toUpperCase()}
                                </Avatar>
                              </Grid>
                              <Grid item xs={8}>
                                <Typography
                                  sx={{ fontSize: 15, fontWeight: 20 }}
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  {value.sender}
                                </Typography>
                              </Grid>
                              <Grid item xs={2}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  gutterBottom
                                >
                                  {value.time?.substring(0, 10)}
                                </Typography>
                              </Grid>

                              <Grid item xs={2}>
                                {/* <Checkbox
                            edge="end"
                            onChange={handleToggle(value.id)}
                            checked={checked.indexOf(value.id) !== -1}
                            inputProps={{ "aria-labelledby": labelId }}
                            sx={{ width: 24, height: 24, ml: 2 }}
                          /> */}
                              </Grid>
                              <Grid item xs={10}>
                                <Typography
                                  sx={{ fontSize: 17, fontWeight: "bold" }}
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  {value.subject}
                                </Typography>
                              </Grid>

                              <Grid item xs={2}>
                                {/* <StarBorderIcon
                            sx={{ width: 24, height: 24, ml: 2 }}
                          /> */}
                              </Grid>

                              <Grid item xs={8}>
                                {/* <Typography variant="body2" color="text.secondary">
                            Well meaning and kindly.
                          </Typography> */}
                              </Grid>
                              <Grid item xs={2}>
                                {/* <IconButton>
                            <AttachmentIcon
                              style={{ transform: "rotate(130deg)" }}
                            />
                          </IconButton> */}
                              </Grid>
                            </Grid>
                          </ListItemButton>
                        </ListItem>
                        <Divider />
                      </>
                    );
                  })
                : null}
            </List>
          </Card>
        </Grid>
      ) : (
        <Grid item md={12}>
          <EmailsDetailMobile
            emailDetails={emailDetails}
            setClicked={handleClick}
            project={project}
            userInfo={userInfo}
            projectUsers={projectUsers}
            user={user}
            title={title}
            department={department}
          />
        </Grid>
      )}
    </Grid>
  );
}
