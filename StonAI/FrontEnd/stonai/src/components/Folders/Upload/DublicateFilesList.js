import {
    Button,
    Checkbox,
    ListItemIcon,
    Typography,
    Tooltip,
    Autocomplete,
    TextField,
    ListItem,
    IconButton,
    Grid
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState } from "react";
export default function DublicateFilesList({ dublicateFiles }) {
    const [doclist, setDoclist] = useState([...dublicateFiles]);
    console.log("dublicateFiles",dublicateFiles)
    const removeThisDubliFile = async (index) => {
        var array = [...doclist]
        array.splice(index, 1);
        setDoclist(array);
        dublicateFiles.splice(index, 1);
    }
    return (
        doclist?.length > 0 && doclist.map((file, index) => {
            return <ListItem
                key={index}
                secondaryAction={
                    <IconButton

                        edge="end"
                        aria-label="delete"
                        set
                        onClick={() => removeThisDubliFile(index)}
                    >
                        <ClearIcon sx={{ borderRadius: 5, color: "#B72020" }} />
                    </IconButton>
                }
                sx={{ backgroundColor: "background.paper", marginBottom: 1 }}
            >
                <Grid container>
                    <Grid item xs={6}>
                        <Tooltip title={file.name}>
                            <Typography variant="caption" style={{ color: "red" }} sx={{ mr: 1 }}>
                                {file.name.length > 31 ? (
                                    <>{file.name.slice(0, 31) + "..."} </>
                                ) : (
                                    <>{file.name} </>
                                )}{" "}
                            </Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6}>
                        <Tooltip title={file.locations}>
                            <Typography variant="caption" sx={{ mr: 1 }}>
                                {file.locations?.length > 31 ? (
                                    <>{file.locations.slice(0, 31) + "..."} </>
                                ) : (
                                    <>{file.locations} </>
                                )}{" "}
                            </Typography>
                        </Tooltip>
                    </Grid>
                </Grid>
            </ListItem>
        })

    );
}
