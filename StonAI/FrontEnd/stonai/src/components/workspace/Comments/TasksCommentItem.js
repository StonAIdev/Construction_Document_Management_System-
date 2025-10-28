import PropTypes from "prop-types";
// @mui
import {
  Box,
  Button,
  Avatar,
  Divider,
  ListItem,
  TextField,
  Typography,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
// utils
// import { fDate } from "../../../utils/formatTime";

// ----------------------------------------------------------------------

TasksCommentItem.propTypes = {
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  message: PropTypes.string,
  tagUser: PropTypes.string,
  postedAt: PropTypes.string,
  hasReply: PropTypes.bool,
};

export default function TasksCommentItem({
  name,
  avatarUrl,
  message,
  tagUser,
  postedAt,
}) {
  return (
    <>
      <ListItem
        disableGutters
        sx={{
          alignItems: "flex-start",
          pl: 1,
          ml: "auto",
          // width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
        </ListItemAvatar>

        <ListItemText
          primary={name}
          primaryTypographyProps={{ variant: "subtitle1" }}
          secondary={
            <>
              <Typography
                gutterBottom
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.disabled",
                }}
              >
                {postedAt?.substring(0, 10)}
              </Typography>
              <Typography component="span" variant="body2">
                <strong>{tagUser}</strong> {message}
              </Typography>
            </>
          }
        />
      </ListItem>

      <Divider
        sx={{
          ml: "auto",
          width: (theme) => `calc(100% - ${theme.spacing(7)})`,
        }}
      />
    </>
  );
}
