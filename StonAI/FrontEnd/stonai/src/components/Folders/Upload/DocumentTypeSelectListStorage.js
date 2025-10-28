import React, { useEffect, useState } from "react";

import ListItem from "@mui/material/ListItem";

import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import Grid from "@mui/material/Grid";

import ClearIcon from "@mui/icons-material/Clear";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { url } from "../../../url";

import {
    Button,
    Checkbox,
    ListItemIcon,
    Typography,
    Autocomplete,
    CircularProgress,
    TextField,
} from "@mui/material";
import Divider from "@mui/material/Divider";

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

export default function InteractiveList({
    fileName,
    icon,
    docCategory,
    docCategorySingle,
    handleChange,
    title,
    checkedGlobal,
    index,
    handleGlobalCheckChange,
    checked,
    handleSingleCheckToggle,
    handleSingledocCategoryChange,
    handleDelete,
    handleNext,
    handleBack,
    project,
    user,
}) {
    const labelId = index;
    console.log(
        "doc cet",
        docCategory,
        docCategorySingle,
        checked,
        checkedGlobal,
        index
    );
    const handeSelectValue = () => {
        let isBool = false;
        checked.forEach((element) => {
            if (element === index) {
                isBool = true;
            }
        });
        return isBool;
    };


    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;

    const [openGlobal, setOpenGlobal] = useState(false);
    const [optionsGlobal, setOptionsGlobal] = useState([]);
    const loadingGlobal = openGlobal && optionsGlobal.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            if (active) {
                try {
                    const res = await axios.post(
                        url + "/folder/getNewFolders",
                        {
                            project_id: project.project_id,
                        },
                        {
                            headers: { token: user.token },
                        }
                    );
                    console.log("storage folders", res);
                    res.data.push({ name: "Incoming Letters" })
                    res.data.push({ name: "Outgoing Letters" })

                    setOptions(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    React.useEffect(() => {
        let active = true;

        if (!loadingGlobal) {
            return undefined;
        }

        (async () => {
            if (active) {
                try {
                    const res = await axios.post(
                        url + "/folder/getNewFolders",
                        {
                            project_id: project.project_id,
                        },
                        {
                            headers: { token: user.token },
                        }
                    );
                    setOptionsGlobal(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [loadingGlobal]);

    React.useEffect(() => {
        if (!openGlobal) {
            setOptions([]);
        }
    }, [openGlobal]);

    useEffect(() => { }, [fileName]);
    return (
        <Grid container>
            {title !== "global" ? (
                <ListItem
                    secondaryAction={
                        <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDelete(index)}
                        >
                            <ClearIcon sx={{ borderRadius: 5, color: "#B72020" }} />
                        </IconButton>
                    }
                    sx={{ backgroundColor: "background.paper", marginBottom: 1 }}
                >
                    <Grid item xs={1}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={checked.indexOf(index) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ "aria-labelledby": labelId }}
                                size="small"
                                onClick={() => handleSingleCheckToggle(index)}
                            />
                        </ListItemIcon>
                    </Grid>
                    <Grid item xs={0.5}>
                        <FontAwesomeIcon icon={icon} />
                    </Grid>
                    <Grid item xs={5.5}>
                        <Typography variant="caption" sx={{ mr: 1 }}>
                            {fileName.length > 31 ? (
                                <>{fileName.slice(0, 31) + "..."} </>
                            ) : (
                                <>{fileName} </>
                            )}{" "}
                        </Typography>
                    </Grid>

                    <Grid item xs={5}>
                        <Autocomplete
                            id="asynchronous-demo"
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            // value={
                            //   handeSelectValue() ? docCategory : docCategorySingle[index]
                            // }
                            onChange={(event, option) => {
                                if (option) {
                                    handleSingledocCategoryChange(option.name, index);
                                } else {
                                    console.log("ghererer", option);
                                    handleSingledocCategoryChange(option, index);
                                }
                            }}
                            isOptionEqualToValue={(option, value) =>
                                option.name === value.name
                            }
                            getOptionLabel={(option) => option.name}
                            options={options}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    label="Document Type"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {loading ? (
                                                    <CircularProgress color="inherit" size={20} />
                                                ) : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </ListItem>
            ) : null}
        </Grid>
    );
}

/* <ListItem>
          <Grid item xs={6.6}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                // checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                size="small"
                checked={checkedGlobal}
                disableRipple
                onClick={handleGlobalCheckChange}
              />
            </ListItemIcon>
          </Grid>
          <Grid item xs>
            <Autocomplete
              id="asynchronous-demo"
              open={openGlobal}
              onOpen={() => {
                setOpenGlobal(true);
              }}
              onClose={() => {
                setOpenGlobal(false);
              }}
              onChange={(event, option) => {
                if (option) {
                  handleChange(option.name, index);
                }
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              getOptionLabel={(option) => option.name}
              options={optionsGlobal}
              loading={loadingGlobal}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Document Type"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </ListItem> */