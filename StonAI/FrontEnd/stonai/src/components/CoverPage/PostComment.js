import React, { useEffect, useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/styles";
import SendIcon from "@material-ui/icons/Send";
import Button from "@material-ui/core/Button";
import CoverPageContext from "../../context/CoverPageContext";
import axios from "axios";
import { url } from "../../url";

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

export const PostComment = ({
  user,
  coverPage_id,
  comments,
  userInfo,
  setComments_list,
}) => {
  const classes = useStyles();
  const coverPage_idRef = useRef("");
  const [comment, setComment] = useState();
  const sendComment = async () => {
    const now = new Date();
    
    try {
      var commentForPush = {
        comment: comment,
        user_id: user.user_id,
        username: userInfo.username,
        postedAt: now,
        avatarUrl:
          "https://gravatar.com/avatar/16ecce3f8626fe4624164e3c31cb55e4?s=400&d=robohash&r=x",
      };
      var commentsList = [...comments];
      commentsList.push(commentForPush);
      var res = await axios.post(
        url + "/CoverPage/addCoverPageComments",
        {
          coverPage_id: coverPage_idRef.current,
          comments_list: commentsList,
        },
        {
          headers: { token: user.token },
        }
      );
      setComments_list([...comments, commentForPush]);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const clearMessageBox = async()=>{
    setComment("");
  }
  const sendButtonHandler = () => {
    sendComment();
    clearMessageBox();
  };

  const onChangeHandler = (event) => {
    setComment(event.target.value);
  };
  useEffect(() => {
    console.log("CoverPageContext.coverpage_id", CoverPageContext.coverpage_id);
    coverPage_idRef.current = CoverPageContext.coverpage_id;
    console.log("comments", comments);
  }, []);
  return (
    <>
      <form onSubmit={sendButtonHandler} className={classes.wrapForm} noValidate autoComplete="off">
        <TextField
          id="standard-text"
          label="Comments"
          className={classes.wrapText}
          onChange={onChangeHandler}
          value={comment}
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
