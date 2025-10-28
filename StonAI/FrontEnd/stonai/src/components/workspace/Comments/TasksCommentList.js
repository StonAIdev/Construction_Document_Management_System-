import React from "react";

import { Box, List } from "@mui/material";

import Paper from "@mui/material/Paper";
import TasksCommentItem from "./TasksCommentItem";

export default function TasksCommentList({ user, comments }) {
  return (
    <Paper style={{ maxHeight: "90vh", overflow: "auto" }}>
      <List disablePadding className="w-100">
        {comments &&
          comments.map((comment) => {
            const { id, users } = comment;

            return (
              <Box key={id}>
                <TasksCommentItem
                  name={comment.username}
                  avatarUrl={comment.avatar_url}
                  postedAt={comment.created_on}
                  message={comment.comment}
                />
              </Box>
            );
          })}
      </List>
    </Paper>
  );
}
