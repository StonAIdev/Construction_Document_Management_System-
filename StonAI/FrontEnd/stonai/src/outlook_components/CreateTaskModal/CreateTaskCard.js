import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "@mui/material/Checkbox";

import {
  faCalendarAlt,
  faFileAlt,
  faStopwatch,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import Fade from "react-reveal/Fade";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

function CreateTaskCard({
  taskNumber,
  project,
  projectUsers,
  setTaskCard,
  TaskCard,
  index,
}) {
  const [value, setValue] = useState(null);
  console.log("projectUsers", projectUsers);
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Fade bottom>
      <div className="taskCardContainer">
        <Heading1
          color="grey"
          paddingBlock="0pxm"
          size="1rem"
          weight="600"
          marginBotto1m="5px"
          JFcontent="left"
          width="100%"
          style={{ marginLeft: "1rem" }}
        >
          Task : {taskNumber + 1}
        </Heading1>
        <div className="d-flex flex-column align-items-center w-100">
          <div className="d-flex justify-content-between textFieldSplit align-items-center w-100">
            <div className="d-flex w-100">
              <FontAwesomeIcon
                icon={faFileAlt}
                className=" TaskModalIcons"
                style={{ color: "var(--blue" }}
              />
              <TextField
                id="outlined-basic"
                label="Task Name"
                variant="outlined"
                size="small"
                className="textfieldStyles"
                onChange={(event) => {
                  //   let item = [TaskCard[0], { taskTitle: event.target.value }];

                  const newTask = [...TaskCard];
                  newTask[index] = {
                    ...newTask[index],
                    taskTitle: event.target.value,
                  };
                  console.log("newTask", newTask, index);
                  setTaskCard(newTask);
                }}
                value={TaskCard[index].taskTitle}
              />
            </div>
            <div className="d-flex w-100" style={{ marginBottom: 14 }}>
              <FontAwesomeIcon
                icon={faUserCircle}
                className="TaskModalIcons"
                style={{ color: "var(--orange" }}
              />
              <Autocomplete
                onChange={(e, option) => {
                  const newTask = [...TaskCard];
                  newTask[index] = {
                    ...newTask[index],
                    assignedTask: option,
                  };
                  console.log("newTask", newTask, index);
                  setTaskCard(newTask);

                  // handleSelectedAssignedTasks(e, option);
                }}
                multiple
                size="small"
                style={{ width: "100%" }}
                id="tags-outlined"
                options={projectUsers}
                getOptionLabel={(option) => option.username}
                isOptionEqualToValue={(option, value) =>
                  value.user_id === option.user_id
                }
                value={TaskCard[index].assignedTask}
                // defaultValue={projectUsers.find((v) => {
                //   console.log("v", v);
                //   return v;
                // })}
                // disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props} style={{ overflow: "hidden", whiteSpace:"normal" }}>
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
          </div>

          <div className="d-flex justify-content-between textFieldSplit w-100">
            <div className="d-flex w-100">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="TaskModalIcons"
                style={{ color: "var(--green" }}
              />
              <div className="datesize w-100" style={{ marginRight: "3px" }}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  className="datePickerStyle"
                >
                  <DesktopDatePicker
                    label="Start Date"
                    size="small"
                    value={TaskCard[index].startdate}
                    onChange={(newValue) => {
                      const newTask = [...TaskCard];
                      newTask[index] = {
                        ...newTask[index],
                        startdate: newValue,
                      };
                      console.log("newTask", newTask, index);
                      setTaskCard(newTask);
                    }}
                    style={{
                      border: "2px solid red !important",
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="d-flex w-100" style={{ marginBottom: 10 }}>
              <FontAwesomeIcon
                icon={faStopwatch}
                className=" TaskModalIcons"
                style={{ color: "var(--warningRed" }}
              />
              <div className="datesize w-100" style={{ marginLeft: "3px" }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Deadline"
                    inputFormat="MM/dd/yyyy"
                    size="small"
                    value={TaskCard[index].deadline}
                    onChange={(newValue) => {
                      const newTask = [...TaskCard];
                      newTask[index] = {
                        ...newTask[index],
                        deadline: newValue,
                      };
                      console.log("newTask", newTask, index);
                      setTaskCard(newTask);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}

export default CreateTaskCard;
