import React from "react";
import {
  Grid,
  Card,
  CardHeader,
  IconButton,
  Typography,
  Box,
  CardContent,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderOpen from "@mui/icons-material/FolderOpen";
// import { Icon } from "@material-ui/core";

const card = (
  <React.Fragment>
    <Grid container>
      <Grid item md={6} sx={{ textAlign: "left" }}>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Grid>
      <Grid item md={6} sx={{ textAlign: "right" }}>
        <IconButton sx={{ color: "text.primary" }}>
          <FolderOpen sx={{ width: 50, height: 50 }} />
        </IconButton>
      </Grid>
    </Grid>
    <CardContent>
      <Typography color="text.secondary" gutterBottom>
        Drawings
      </Typography>

      <Typography sx={{ fontSize: 12 }} color="text.secondary">
        Folder
      </Typography>
    </CardContent>
  </React.Fragment>
);

export default function OutlinedCard() {
  return (
    <Box>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
