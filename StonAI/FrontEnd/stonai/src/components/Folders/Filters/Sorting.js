import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Chip, Box, Button, Popover, Typography, Grid, Stack, Item, Select, MenuItem, FormControl, InputLabel, IconButton, Divider } from "@mui/material";
import axios from 'axios';
import { url } from "../../../url";
import { PublishedWithChangesSharp, Sort } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
function LenSort({ length }) {
  if (length > 0) {
    return <>{"/"}{length}</>
  } else {
    return null;
  }

}

function SortRow({ AvailableSorts, sortFeilds, handleKeyChange, handleSortDirChange, sortFeild, setSortFeilds, index, setFieldValue }) {
  function handleChange(event, value) {
    console.log("event", event)
  }
  function removeRow() {
    var tempSortFeild = [...sortFeilds];
    tempSortFeild.splice(index, 1);
    setSortFeilds(tempSortFeild);
    setFieldValue('Sorting', tempSortFeild);
  }

  const UsedUpArray = (x) => {
    const sortFeildArr = sortFeilds.map((item) => item.key)
    console.log("sortFeildArr", sortFeildArr);
    const r = x.filter(function (value, index, arr) {
      return !(sortFeildArr.includes(value) && value !== sortFeild.key);
    })
    console.log("r", r)
    return r
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Autocomplete
            id="demo-select-small"
            filterOptions={UsedUpArray}
            options={AvailableSorts.current}
            size="small"
            value={sortFeild.key}
            onChange={(event, newValue) => {
              handleKeyChange(event, newValue, index)
            }}
            renderInput={(params) => <TextField className="sortFields" {...params} label="" />}
          />
        </FormControl>

      </Grid>
      <Grid item xs={5}>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <Select
            className="sortFields"
            id="demo-select-small"
            value={sortFeild.sort_direction}
            onChange={(event, newValue) => {
              handleSortDirChange(event, newValue, index)
            }}
            InputLabelProps={{ shrink: false }}
          >
            <MenuItem value={"Ascending"}>Ascending</MenuItem>
            <MenuItem value={"Descending"}>Descending</MenuItem>
          </Select>
        </FormControl>

      </Grid>
      <Grid container item xs={1} alignItems="center" justifyContent="center">

        <IconButton onClick={removeRow} aria-label="Remove" size="small" className="SortClear">
          <ClearIcon fontSize="inherit" />
        </IconButton>
      </Grid>
    </Grid>
  )

}
export default function Sorting({
  project, user, setFieldValue
}) {

  var AvailableSorts = React.useRef([
    "Name", "Date"
  ]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [sortFeilds, setSortFeilds] = useState([
  ]);
  const push = () => {
    console.log("psu")
    var f = [...sortFeilds]
    f.push({ hr: "d" });
    console.log("psuh", f)
    setSortFeilds(f);
  }
  const handleKeyChange = (event, value, index) => {
    var tempSort = [...sortFeilds];
    tempSort[index] = {
      key: value,
      sort_direction: tempSort[index].sort_direction
    }
    setSortFeilds(tempSort);
    setFieldValue('Sorting', tempSort)
  }
  const handleSortDirChange = (event, value, index) => {
    console.log("value,", event, value)
    var tempSort = [...sortFeilds];
    tempSort[index] = {
      key: tempSort[index].key,
      sort_direction: event.target.value
    }
    setSortFeilds(tempSort);
    setFieldValue('Sorting', tempSort);
  }
  const getKeyFromAvailableArr = (x) => {
    const sortFeildArr = sortFeilds.map((item) => item.key)
    console.log("sortFeildArr", sortFeildArr);
    const r = x.filter(function (value, index, arr) {
      return !(sortFeildArr.includes(value));
    })
    return r
  }
  const getFirstItemFromAvailableArr = (array) => {
    const arr = getKeyFromAvailableArr(array);
    return arr[0]
  }
  function isAllArrUsedUp() {
    const arr = getKeyFromAvailableArr(AvailableSorts.current);
    if (arr.length > 0) {
      return false
    } else {
      return true
    }
  }
  const AddNewSort = () => {
    console.log("isAllArrUsedUp", isAllArrUsedUp())
    if (!isAllArrUsedUp()) {
      var tempSort = [...sortFeilds];
      tempSort.push({ "key": getFirstItemFromAvailableArr(AvailableSorts.current), sort_direction: "Ascending" });
      setSortFeilds(tempSort);
      setFieldValue('Sorting', tempSort);
    }

  }
  return (
    <div
      className="fadein"
      style={{
        marginRight: "10px",
        animationDelay: ".5s",
      }}
    >
      <Box className="filterWidth" >
        <Button aria-describedby={id} onClick={handleClick} className="textfieldMargin" startIcon={<Sort />}>Sort <LenSort length={sortFeilds.length} /></Button>
      </Box>
      <Popover
        className="SortModal"
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}

      >
        <Box sx={{ p: 2, width: "428px" }} className="SortModalContent">
          <Stack spacing={3}>
            <Typography>Sort by 
              <IconButton onClick={handleClose} size="small"><ClearIcon/></IconButton>
              </Typography>
            <Divider />
            <Grid
              direction="column"
              spacing={1}
            >
              {sortFeilds.length > 0 && sortFeilds.map((sortFeild, index) => {
                return <SortRow AvailableSorts={AvailableSorts} sortFeilds={sortFeilds} handleKeyChange={handleKeyChange} handleSortDirChange={handleSortDirChange} sortFeild={sortFeild} setSortFeilds={setSortFeilds} index={index} setFieldValue={setFieldValue} />
              })}
            </Grid>
            <Button onClick={AddNewSort}>+ Add new sort</Button>
          </Stack>
        </Box>
      </Popover>
    </div>
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  "Red", "Blue", "Green"
];
const props = ["Orange"];
