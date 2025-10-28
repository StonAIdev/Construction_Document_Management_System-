import React, { useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  IconButton,
  Typography,
  Box,
  CardContent,
  CardActionArea,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderOpen from "@mui/icons-material/FolderOpen";

export default function ListItemFolders({
  name,
  children,
  handleSelectComponent,
}) {
  console.log("ListItemFolders", children, name);
  return (

    <Card>
      <CardActionArea onClick={() => handleSelectComponent(name, children)}>
        <Grid container>
          <Grid item md={12} sx={{ textAlign: "right", marginBottom: "-20px" }}>
            <IconButton sx={{ color: "var(--blue)" }}>
              <FolderOpen sx={{ width: 50, height: 50 }} />
            </IconButton>
          </Grid>
        </Grid>
        <CardContent>
          <Typography
            color="text.secondary"
            sx={{ fontWeight: "bolder" }}
            gutterBottom
          >
            {/* {name.length > 20 ? (
              <>{name.slice(0, 20) + "..."} </>
            ) : (
              <>{name} </>
            )} */}

            {name}
          </Typography>

          <Typography sx={{ fontSize: 13 }} color="text.secondary">
            Folder
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
