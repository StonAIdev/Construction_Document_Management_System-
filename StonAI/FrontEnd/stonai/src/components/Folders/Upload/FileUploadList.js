import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";

import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import ClearIcon from "@mui/icons-material/Clear";
import ProgressBar from "./LinearProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InteractiveList({ fileName, uploadProgress, icon }) {
  return (
    <div>
      <ListItem sx={{ backgroundColor: "background.paper", marginBottom: 1 }}>
        <Grid container>
          <Grid item xs={1}>
            <FontAwesomeIcon icon={icon} />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              {fileName.length > 31 ? (
                <>{fileName.slice(0, 31) + "..."} </>
              ) : (
                <>{fileName} </>
              )}
            </Typography>
          </Grid>


          <Grid item xs={5} sx={{ textAlign: "right" }}>
            <ProgressBar progress={uploadProgress} />
          </Grid>
        </Grid>
      </ListItem>
    </div>
  );
}
