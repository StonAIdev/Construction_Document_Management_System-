import React, { useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/styles";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import CoverPageContext from "../context/CoverPageContext";
import axios from "axios";
import { url } from "../../../url";
import moment from "moment";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapForm: {
      display: "flex",
      justifyContent: "center",
      width: "95%",
      margin: "auto",
      marginTop: "15px",
    },
    wrapText: {
      width: "100%",
    },
    button: {
      //margin: theme.spacing(1),
    },
  })
);

export const PostTasksComment = ({
  user,
  coverPage_id,
  comments,
  userInfo,
  setComments_list,
  commentTaskId,
  Notify, department, project
}) => {
  const classes = useStyles();
  const coverPage_idRef = useRef("");
  const [comment, setComment] = useState();

  const updateKPI = async (totalTime) => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");
    console.log("today_date", today_date, url, department, project, user);
    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          searchType: "Tasks",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: totalTime
        },
        { headers: { token: user.token } }
      );
      console.log("on submit search: ", response.data);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const sendComment = async () => {
    try {
      var commentForPush = {
        comment: comment,
        user_id: user.user_id,
        username: userInfo.username,
        task_id: commentTaskId,
        avatar_url:
          "https://gravatar.com/avatar/16ecce3f8626fe4624164e3c31cb55e4?s=400&d=robohash&r=x",
      };

      var res = await axios.post(
        url + "/Comment/create",
        {
          comment: commentForPush,
        },
        {
          headers: { token: user.token },
        }
      );
      updateKPI(1000);
      setComments_list([...comments, commentForPush]);

      Notify();
    } catch (error) {
      console.log("Error", error);
    }
  };
  const sendButtonHandler = () => {
    sendComment();
  };

  const onChangeHandler = (event) => {
    setComment(event.target.value);
  };

  return (
    <>
      <form className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Comments"
          className={classes.wrapText}
          onChange={onChangeHandler}
        //margin="normal"
        />
        <Button
          onClick={sendButtonHandler}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          <SendIcon />
        </Button>
      </form>
    </>
  );
};
