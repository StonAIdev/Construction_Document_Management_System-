import React, { useState, useEffect } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import axios from "axios";
import { url } from "../../../url";

import {
  Badge,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import "./FiltersGraph.css";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SubHeading from "../../../Reusable Components/Headings/Heading1";
import Nodata from "../Cards/Assets/Nodata.svg";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  let {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const COLORS = [
  "#1bad7b",
  "#ce0000",
  "#fe8b22",
  "rgb(58, 117, 185)",
  "#02283f",
];

export const HODTotalTasksGraph = ({
  hodTasks,
  project,
  user,
  setHODTasks,
}) => {
  const isEmpty = Object.values(hodTasks).every((x) => x === null || x === 0);
  const [activeIndex, setActiveIndex] = useState(0);

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openUploaderOption, setOpenUploaderOption] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = openUploaderOption && options.length === 0;

  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [creatorForFilter, setCreatorForFilter] = useState(null);

  const [enddateValidation, setEnddateValidation] = useState(false);
  const [startDateValidation, setStartDateValidation] = useState(false);

  const total =
    parseInt(hodTasks.completed) +
    parseInt(hodTasks.cancelled) +
    parseInt(hodTasks.delayed) +
    parseInt(hodTasks.inProcess);

  const data = [
    {
      name: "Completed",
      value: parseInt(hodTasks.completed),
      color: "#1bad7b",
    },
    {
      name: "Cancelled",
      value: parseInt(hodTasks.cancelled),
      color: "#ce0000",
    },
    { name: "Delayed", value: parseInt(hodTasks.delayed), color: "#fe8b22" },
    {
      name: "In Process",
      value: parseInt(hodTasks.inProcess),
      color: "rgb(58, 117, 185)",
    },
  ];

  data.sort((a, b) => b.value - a.value);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res1 = await axios.post(
          url + "/Tasks/getAssignees",
          {
            project_id: project.project_id,
          },
          {
            headers: { token: user.token },
          }
        );
        setOptions([...res1.data]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!openUploaderOption) {
      setOptions([]);
    }
  }, [openUploaderOption]);

  const handleFilter = async (newValue) => {
    try {
      var res = await axios.post(
        url + "/Tasks/getAssignedTasksStatsFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          task_creator: newValue?.user_id,
          start_date: startdate,
          deadline: enddate,
        },
        {
          headers: { token: user.token },
        }
      );
      var completed = 0;
      var cancelled = 0;
      var delayed = 0;
      var inProcess = 0;
      res.data.rows.forEach((element) => {
        if (element.task_status === "Completed") {
          completed = element.count;
        }
        if (element.task_status === "Canceled") {
          cancelled = element.count;
        }
        if (element.task_status === "In Process") {
          inProcess = element.count;
        }
        if (element.task_status === "Delayed") {
          delayed = element.count;
        }
      });

      setHODTasks({
        cancelled: cancelled,
        completed: completed,
        delayed: delayed,
        inProcess: inProcess,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFilterStartdate = async (newValue) => {
    try {
      var res = await axios.post(
        url + "/Tasks/getAssignedTasksStatsFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          task_creator: creatorForFilter,
          start_date: newValue,
          deadline: enddate,
        },
        {
          headers: { token: user.token },
        }
      );
      var completed = 0;
      var cancelled = 0;
      var delayed = 0;
      var inProcess = 0;
      res.data.rows.forEach((element) => {
        if (element.task_status === "Completed") {
          completed = element.count;
        }
        if (element.task_status === "Canceled") {
          cancelled = element.count;
        }
        if (element.task_status === "In Process") {
          inProcess = element.count;
        }
        if (element.task_status === "Delayed") {
          delayed = element.count;
        }
      });

      setHODTasks({
        cancelled: cancelled,
        completed: completed,
        delayed: delayed,
        inProcess: inProcess,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFilterEnddate = async (newValue) => {
    try {
      var res = await axios.post(
        url + "/Tasks/getAssignedTasksStatsFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          start_date: startdate,
          deadline: newValue,
          task_creator: creatorForFilter,
        },
        {
          headers: { token: user.token },
        }
      );
      var completed = 0;
      var cancelled = 0;
      var delayed = 0;
      var inProcess = 0;
      res.data.rows.forEach((element) => {
        if (element.task_status === "Completed") {
          completed = element.count;
        }
        if (element.task_status === "Canceled") {
          cancelled = element.count;
        }
        if (element.task_status === "In Process") {
          inProcess = element.count;
        }
        if (element.task_status === "Delayed") {
          delayed = element.count;
        }
      });

      setHODTasks({
        cancelled: cancelled,
        completed: completed,
        delayed: delayed,
        inProcess: inProcess,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div>
          <Heading1
            size="1.2em"
            weight="600"
            width="100%"
            marginBottom="0.5em"
            JFcontent="center"
            align="center"
          >
            Department Tasks
            <Badge badgeContent={total} color="info"></Badge>
          </Heading1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <Autocomplete
              id="asynchronous-demo"
              size="small"
              open={openUploaderOption}
              style={{ width: "150px" }}
              onOpen={() => {
                setOpenUploaderOption(true);
              }}
              onClose={() => {
                setOpenUploaderOption(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.username === value.username
              }
              onChange={(event, newValue) => {
                setCreatorForFilter(newValue);
                handleFilter(newValue);
              }}
              getOptionLabel={(option) => option.username}
              options={options}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assignees"
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
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
              <DatePicker
                label="Start Date"
                size="small"
                value={startdate}
                onChange={(newValue) => {
                  if (newValue && enddate && newValue > enddate) {
                    setStartDateValidation(true);
                  } else {
                    setEnddateValidation(false);
                    setStartDateValidation(false);
                  }
                  setStartdate(newValue);
                  handleFilterStartdate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    error={startDateValidation}
                    helperText={
                      startDateValidation
                        ? "Start Date Should not be greater then Dealine"
                        : null
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
              <DatePicker
                label="End Date"
                size="small"
                value={enddate}
                onChange={(newValue) => {
                  if (newValue && startdate && newValue < startdate) {
                    setEnddateValidation(true);
                  } else {
                    setEnddateValidation(false);
                    setStartDateValidation(false);
                  }
                  setEnddate(newValue);
                  handleFilterEnddate(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    error={enddateValidation}
                    helperText={
                      enddateValidation
                        ? "End Date Should not be lesser then Start Date"
                        : null
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
      {!isEmpty ? (
        <>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {data.map((entry, index) => (
                  <Cell fill={entry.color} key={index} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div style={{ paddingBlock: "32px" }}>
          <img src={Nodata} alt="no data icon" />

          <SubHeading>Nothing to Show</SubHeading>
        </div>
      )}
    </>
  );
};

export default HODTotalTasksGraph;
