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
    CardActions, Button,
    Stack,
    Modal, TextField
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import FolderOpen from "@mui/icons-material/FolderOpen";
import { render } from "react-dom";
import { Divider } from "@material-ui/core";
import { useState } from "react";
import { url } from "../../url";
import axios from "axios";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
};

export default function Children({
    name,
    key,
    update,
    download,
    exportFile,
    share,
    remove,
    move,
    handleSelectComponent,
}) {

    return (

        <>
            <Card>
                <CardActionArea
                    onClick={() => {
                        handleSelectComponent(name, update, download, exportFile, share, remove, move)
                    }
                    }
                >
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
                    <CardContent sx={{ paddingBottom: "0px !important" }}>
                        <Typography
                            color="text.secondary"
                            sx={{ fontWeight: "bolder" }}
                            gutterBottom
                        >
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
