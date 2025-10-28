import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { Menu } from "@mui/icons-material";
import { url } from "../../../url";
import axios from "axios";

import {
  Card,
  Box,
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Checkbox from "@mui/material/Checkbox";

export default function CustomizedInputBase({
  handleSearch,
  user,
  setIsFilter,
  setFilterData,
  isFilter,
  setFilterOrData,
  readCount,
  setReadCount,
}) {
  ///// Filter Popper
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isValidFrom, setisValidFrom] = useState(false);
  const [isValidCC, setIsValidCC] = useState(false);
  const [isValidTo, setIsValidTo] = useState(false);
  const [outlookRecv, setoutlookRecv] = useState([]);

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    cc: "",
    subject: "",
    body: "",
    dateFrom: null,
    dateTo: null,
    attachment: false,
    read: false,
    user_id: user.user_id,
  });

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;

  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [openAutocompleteCC, setOpenAutocompleteCC] = React.useState(false);

  const [options, setOptions] = React.useState([]);
  const loading = openAutocomplete && outlookRecv.length === 0;
  const loadingCC = openAutocompleteCC && outlookRecv.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
          headers: { token: user.token },
        });

        setoutlookRecv(responseRec.data.rows);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    let active = true;

    if (!loadingCC) {
      return undefined;
    }

    (async () => {
      if (active) {
        const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
          headers: { token: user.token },
        });

        setoutlookRecv(responseRec.data.rows);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingCC]);

  useEffect(() => {
    if (!openAutocomplete) {
      setoutlookRecv([]);
    }
    if (!openAutocompleteCC) {
      setoutlookRecv([]);
    }
  }, [openAutocomplete, openAutocompleteCC]);

  useEffect(() => {
    if (!openAutocompleteCC) {
      setoutlookRecv([]);
    }
  }, [openAutocompleteCC]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleToChange = (newVal) => {
    setFilters({
      ...filters,
      to: newVal,
    });
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (newVal && newVal.match(regexEmail)) {
      setIsValidTo(false);
    } else {
      if (newVal && newVal.length > 0) {
        setIsValidTo(true);
      }
    }
  };

  const handleFromChange = (newVal) => {
    setFilters({
      ...filters,
      from: newVal,
    });
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (newVal && newVal.length > 0 && newVal.match(regexEmail)) {
      setisValidFrom(false);
    } else {
      if (newVal && newVal.length > 0) {
        setisValidFrom(true);
      }
    }
  };

  const handleCcChange = (newVal) => {
    setFilters({
      ...filters,
      cc: newVal,
    });

    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (newVal && newVal.match(regexEmail)) {
      setIsValidCC(false);
    } else {
      setIsValidCC(true);
    }
  };

  const handleFilter = async () => {
    try {
      var res = await axios.post(
        url + "/Email/getEmailsFiltered",
        {
          values: filters,
        },
        {
          headers: { token: user.token },
        }
      );

      setFilterOrData(true);
      setIsFilter(!isFilter);

      var count = 0;
      res.data.map((g, i) => {
        if (!g.is_read) {
          count = count + 1;
        }
      });
      setReadCount(count);

      setFilterData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFilterClear = () => {
    setFilterOrData(false);

    setIsFilter(!isFilter);
    setFilters({
      from: "",
      to: "",
      cc: "",
      subject: "",
      body: "",
      dateFrom: null,
      dateTo: null,
      attachment: false,
      read: false,
      user_id: user.user_id,
    });
  };

  return (
    <>
      {" "}
      <Popper
        id={id}
        open={open}
        placement="bottom-end"
        anchorEl={anchorEl}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Card sx={{ p: 2, width: "39vw", backgroundColor: "#F5F5F5" }}>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    From:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  {" "}
                  <Autocomplete
                    disablePortal
                    freeSolo
                    value={filters.from}
                    onChange={(event, newVal) => {
                      const dynamicOption =
                        typeof newVal === "string" ||
                        newVal instanceof String ||
                        newVal === null
                          ? newVal
                          : newVal.label;
                      handleFromChange(dynamicOption);
                    }}
                    open={openAutocomplete}
                    onOpen={() => {
                      setOpenAutocomplete(true);
                    }}
                    onClose={() => {
                      setOpenAutocomplete(false);
                    }}
                    id="receiver"
                    options={outlookRecv.map((option) => option.email_address)}
                    loading={loading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        error={isValidFrom}
                        helperText={
                          isValidFrom
                            ? "You have entered an invalid email"
                            : null
                        }
                      />
                    )}
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    To:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  {" "}
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    freeSolo
                    value={filters.to}
                    options={outlookRecv.map((option) => option.email_address)}
                    open={openAutocompleteCC}
                    onOpen={() => {
                      setOpenAutocompleteCC(true);
                    }}
                    onClose={() => {
                      setOpenAutocompleteCC(false);
                    }}
                    onChange={(event, newVal) => {
                      const dynamicOption =
                        typeof newVal === "string" ||
                        newVal instanceof String ||
                        newVal === null
                          ? newVal
                          : newVal.label;
                      handleToChange(dynamicOption);
                    }}
                    loading={loadingCC}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        error={isValidTo}
                        helperText={
                          isValidTo ? "You have entered an invalid email" : null
                        }
                      />
                    )}
                    size="small"
                  />
                </Grid>
                {/* <Grid item xs={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    CC:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  {" "}
                  <Autocomplete
                    disablePortal
                    onChange={(event, newVal) => {
                      const dynamicOption =
                        typeof newVal === "string" ||
                        newVal instanceof String ||
                        newVal === null
                          ? newVal
                          : newVal.label;
                      handleCcChange(dynamicOption);
                    }}
                    id="combo-box-demo"
                    freeSolo
                    options={recvOption}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        size="small"
                        error={isValidCC}
                        helperText={
                          isValidCC ? "You have entered an invalid email" : null
                        }
                      />
                    )}
                    size="small"
                  />
                </Grid> */}
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Subject:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    size="small"
                    value={filters.subject}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        subject: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Body:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    variant="standard"
                    size="small"
                    value={filters.body}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        body: e.target.value,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Date From:
                  </Typography>
                </Grid>
                <Grid item xs={10} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    className=""
                  >
                    <DatePicker
                      label="Start Date"
                      size="small"
                      value={filters.dateFrom}
                      onChange={(newValue) => {
                        setFilters({
                          ...filters,
                          dateFrom: newValue,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={2} md={1}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    To:
                  </Typography>
                </Grid>
                <Grid item xs={10} md={4}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    className=""
                  >
                    <DatePicker
                      label="End Date"
                      size="small"
                      value={filters.dateTo}
                      onChange={(newValue) => {
                        setFilters({
                          ...filters,
                          dateTo: newValue,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item md={3} xs={4}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Attachment:
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <Checkbox
                    sx={{
                      color: "var(--blue)",
                      "&.Mui-checked": {
                        color: "var(--blue)",
                      },
                    }}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        attachment: e.target.checked,
                      });
                    }}
                    checked={filters.attachment}
                  />
                </Grid>
                <Grid item xs={4} md={3}>
                  <Typography
                    sx={{ fontSize: 17, fontWeight: "bold", pt: 1.3 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Read:
                  </Typography>
                </Grid>
                <Grid item xs={8} md={9}>
                  <Checkbox
                    sx={{
                      color: "var(--blue)",
                      "&.Mui-checked": {
                        color: "var(--blue)",
                      },
                    }}
                    onChange={(e) => {
                      setFilters({
                        ...filters,
                        read: e.target.checked,
                      });
                    }}
                    checked={filters.read}
                  />
                </Grid>
                <Grid item xs={6}></Grid>
                <Grid item xs={3}>
                  {" "}
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{ backgroundColor: "var(--blue)" }}
                    onClick={handleFilter}
                  >
                    Search
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  {" "}
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderColor: "var(--blue)",
                      color: "var(--blue)",
                      fontWeight: "bold",
                    }}
                    onClick={handleFilterClear}
                  >
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Fade>
        )}
      </Popper>
      <Paper
        component="form"
        sx={{
          ml: 1,
          mb: 1,
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "40vw",
        }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "Search" }}
          onChange={(event) => handleSearch(event)}
        />

        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="directions"
          onClick={handleClick}
        >
          <Menu />
        </IconButton>
      </Paper>
    </>
  );
}
