// @mui
import { Box, List } from "@mui/material";
//
import Paper from "@mui/material/Paper";
import CoverPageCommentItem from "./CoverPageCommentItem";
import React from "react";
// ----------------------------------------------------------------------

export default function CoverPageCommentList({ user, comments }) {
  return (
    <Paper style={{ maxHeight: "90vh", overflow: "auto" }}>
      <List disablePadding className="w-100">
        {comments &&
          comments.map((comment) => {
            const { id, users } = comment;

            return (
              <Box key={id}>
                <CoverPageCommentItem
                  name={comment.username}
                  avatarUrl={comment.avatarUrl}
                  postedAt={comment.postedAt}
                  message={comment.comment}
                />
              </Box>
            );
          })}
      </List>
    </Paper>
  );
}
