import React from "react";
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
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FolderOpen from "@mui/icons-material/FolderOpen";
import { render } from "react-dom";

export default function Children({ name, handleSelectComponent }) {
  let winwidth = window.innerWidth;

  return (
    // <ListItemButton onClick={() => handleSelectComponent(name)}>
    //   <ListItem>
    //     <IconButton>
    //       <FolderIcon />
    //     </IconButton>

    //     <ListItemText primary={name} />
    //   </ListItem>
    // </ListItemButton>
    <>
      <Card>
        <CardActionArea onClick={() => handleSelectComponent(name)}>
          <Grid container>
            <Grid
              item
              md={12}
              sx={{ textAlign: "right", marginBottom: "-20px" }}
            >
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
    </>
  );
}
