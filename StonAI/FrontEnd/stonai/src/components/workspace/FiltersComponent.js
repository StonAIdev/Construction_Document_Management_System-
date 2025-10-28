import react from "react";
import Fade from "react-reveal/Fade";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  // borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  border: "2px solid var(--orange)",
  borderRadius: "8px !important",

  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));
const FiltersComponent = ({
  FiltersClicked,
  toggleDrawer,
  anchor,
  tabValue,
  toggleDrawerClose,
  state,
  list,
  search,
  setSearchFilter,
  setValueFilter,
  setFiltersClicked,
  valueFilter,
  filter,
  taskGroupsAssigned,
  taskGroups,
  StatusList,
  statusFilter,
  handlestatusFilter,
  handleSelectedAssignedTasksFilter,
  projectUsers,
  assignedTasksFilter,
  setStartDateValidationFilter,
  setDeadlineValidationFilter,
  setstartdateFilter,
  startDateValidationFilter,
  deadlineFilter,
  startdateFilter,
  setdeadlineFilter,
  deadlineValidationFilter,
  getUserTasks,
  getUserAssignedTasks,
  handleFilterClear,
  handleTaskNameFilter,
  taskNameFilter,
  permisions,
}) => {
  return (
    <Fade right>
      <div
        className={`${
          FiltersClicked ? "filtersContainer filterHeight " : "filtersContainer"
        }`}
      >
        <Grid container direction="column" spacing={0.5}>
          <Grid container direction="row" spacing={0.5} alignItems="center">
            <Grid item className="">
              {tabValue === "one" ? (
                <Button
                  variant="contained"
                  size="small"
                  className="AddtaskButton"
                  onClick={toggleDrawer(anchor, true, "Add Task", "My Tasks")}
                  sx={{
                    paddingBlock: "6px",
                    borderRadius: "8px !important",
                  }}
                >
                  Add Task
                </Button>
              ) : tabValue === "two" && permisions.cancreatetaskworkspace ? (
                <Button
                  variant="contained"
                  size="small"
                  className="AddtaskButton"
                  sx={{
                    paddingBlock: "6px",
                    borderRadius: "8px !important",
                  }}
                  onClick={toggleDrawer(
                    anchor,
                    true,
                    "Add Task",
                    "Assigned Task"
                  )}
                >
                  Add Task
                </Button>
              ) : null}

              <SwipeableDrawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawerClose(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer>
            </Grid>
            <Grid item>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  style={{ height: "32px" }}
                  onChange={(e) => {
                    console.log("searchhhh", search);

                    setSearchFilter(e.target.value);
                  }}
                  value={search}
                />
              </Search>
            </Grid>

            <Grid item>
              <ButtonStyled
                paddingInline=".8rem"
                paddingBlock="0.3rem"
                borderRadius="8px"
                width="fit-content"
                style={{ cursor: "pointer" }}
                className={`${
                  FiltersClicked
                    ? "FiltersClicked mx-1"
                    : "FiltersUnclicked mx-1"
                }`}
                onClick={(e) => {
                  setFiltersClicked(!FiltersClicked);
                }}
              >
                Filters
              </ButtonStyled>
              {/* <SwipeableDrawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                onOpen={toggleDrawer(anchor, true)}
              >
                {list(anchor)}
              </SwipeableDrawer> */}
            </Grid>
          </Grid>

          <Grid>
            {FiltersClicked && (
              <div className="FiltersDiv">
                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.2s",
                    width: 180,
                  }}
                >
                  <Autocomplete
                    onChange={(event, newValue) => {
                      if (typeof newValue === "string") {
                        setValueFilter({
                          group_name: newValue,
                        });
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setValueFilter({
                          group_name: newValue.inputValue,
                        });
                      } else {
                        setValueFilter(newValue);
                      }
                    }}
                    value={valueFilter}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.group_name
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          inputValue,
                          group_name: `Add "${inputValue}"`,
                        });
                      }

                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    options={
                      tabValue === "two" ? taskGroupsAssigned : taskGroups
                    }
                    size="small"
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === "string") {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.group_name;
                    }}
                    renderOption={(props, option) => (
                      <li {...props}>{option.group_name}</li>
                    )}
                    sx={{ width: "100%" }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField {...params} label="Task Groups" />
                    )}
                  />
                </div>
                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.2s",
                    width: 180,
                  }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Task Name"
                    variant="outlined"
                    size="small"
                    className="textfieldStyles"
                    onChange={(e) => handleTaskNameFilter(e)}
                    value={taskNameFilter}
                  />
                </div>

                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.2s",
                    width: 150,
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="statusFilter"
                    size="small"
                    options={StatusList}
                    value={statusFilter}
                    onChange={(e, option) => {
                      handlestatusFilter(e, option);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Status" />
                    )}
                  />
                </div>
                {tabValue === "two" || tabValue === "three" ? (
                  <div
                    className="fadein"
                    style={{
                      marginRight: "10px",
                      animationDelay: "0.2s",
                      width: 220,
                    }}
                  >
                    <Autocomplete
                      onChange={(e, option) => {
                        handleSelectedAssignedTasksFilter(e, option);
                      }}
                      size="small"
                      id="tags-outlined"
                      options={projectUsers}
                      getOptionLabel={(option) => option?.username}
                      isOptionEqualToValue={(option, value) =>
                        value.user_id === option.user_id
                      }
                      multiple
                      value={assignedTasksFilter}
                      // defaultValue={projectUsers.find((v) => {
                      //   console.log("v", v);
                      //   return v;
                      // })}
                      // disableCloseOnSelect
                      renderOption={(props, option, { selected }) => (
                        <li
                          {...props}
                          style={{
                            paddingLeft: "0px",
                            wordBreak: "break-all",
                          }}
                        >
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            // style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.username}
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Assigned To"
                          placeholder="Users"
                        />
                      )}
                    />
                  </div>
                ) : null}

                <div
                  className="fadein  "
                  style={{
                    marginRight: "10px",
                    animationDelay: "0.4s",
                    width: 150,
                  }}
                >
                  <Box sx={{ minWidth: 120 }}>
                    <div>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        className=""
                      >
                        <DatePicker
                          label="Start Date"
                          size="small"
                          value={startdateFilter}
                          onChange={(newValue) => {
                            if (
                              newValue &&
                              deadlineFilter &&
                              newValue > deadlineFilter
                            ) {
                              setStartDateValidationFilter(true);
                            } else {
                              setDeadlineValidationFilter(false);
                              setStartDateValidationFilter(false);
                            }
                            setstartdateFilter(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={startDateValidationFilter}
                              helperText={
                                startDateValidationFilter
                                  ? "Start Date Should not be greater then Deadline"
                                  : null
                              }
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </Box>
                </div>

                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: ".6s",
                    width: 150,
                  }}
                >
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Deadline"
                        size="small"
                        value={deadlineFilter}
                        onChange={(newValue) => {
                          if (
                            newValue &&
                            startdateFilter &&
                            newValue < startdateFilter
                          ) {
                            setDeadlineValidationFilter(true);
                          } else {
                            setDeadlineValidationFilter(false);
                            setStartDateValidationFilter(false);
                          }
                          setdeadlineFilter(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            error={deadlineValidationFilter}
                            helperText={
                              deadlineValidationFilter
                                ? "Deadline Should not be lesser then Start Date"
                                : null
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </div>

                <div
                  className="fadein"
                  style={{
                    marginRight: "10px",
                    animationDelay: ".6s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    bgcolor: "black",
                    width: "100%",
                    marginLeft: "10px",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="info"
                    sx={{ background: "var(--blue)" }}
                    className="MUIButtonsize"
                    onClick={() =>
                      tabValue === "one"
                        ? getUserTasks("filter")
                        : getUserAssignedTasks("filter")
                    }
                    disabled={false}
                    endIcon={<FontAwesomeIcon icon={faFilter} />}
                  >
                    APPLY
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="info"
                    className="MUIButtonsize"
                    sx={{ marginLeft: "5px" }}
                    borderRadius="8px"
                    onClick={handleFilterClear}
                    disabled={false}
                    endIcon={<FontAwesomeIcon icon={faTimes} />}
                  >
                    CLEAR
                  </Button>
                </div>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
    </Fade>
  );
};

export default FiltersComponent;
