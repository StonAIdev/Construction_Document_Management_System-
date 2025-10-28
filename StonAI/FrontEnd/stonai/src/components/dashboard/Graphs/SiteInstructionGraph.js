import React, { useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from "recharts";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import Nodata from "../Cards/Assets/Nodata.svg";

import { Badge, TextField, IconButton, Button, Stack } from "@mui/material";
import axios from "axios";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./FiltersGraph.css";

import { SearchOutlined } from "@material-ui/icons";

import { url } from "../../../url";
import SubHeading from "../../../Reusable Components/Headings/Heading1";
import ClearIcon from "@mui/icons-material/Clear";

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
      <Heading1 size="1.2em" weight="600">
        Shop Drawing Submittals
      </Heading1>
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const SiteInstructionGraph = ({
  shopdrawingStatusCount,
  user,
  project,
  setShopdrawingStatusCount,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const isEmpty = Object.values(shopdrawingStatusCount).every(
    (x) => x === null || x === 0
  );

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openUploaderOption, setOpenUploaderOption] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = openUploaderOption && options.length === 0;

  const [openCreatorOption, setOpenCreatorOption] = React.useState(false);
  const [optionsCreator, setOptionsCreator] = React.useState([]);
  const loadingCreator = openCreatorOption && optionsCreator.length === 0;

  const [startdate, setStartdate] = useState(null);
  const [enddate, setEnddate] = useState(null);
  const [contractor, setContractor] = useState("");

  const [enddateValidation, setEnddateValidation] = useState(false);
  const [startDateValidation, setStartDateValidation] = useState(false);

  const total =
    parseInt(shopdrawingStatusCount.approved) +
    parseInt(shopdrawingStatusCount.approvedAsNoted) +
    parseInt(shopdrawingStatusCount.reviseAndResubmit) +
    parseInt(shopdrawingStatusCount.rejected);

  const data = [
    {
      name: "Approved",
      value: parseInt(shopdrawingStatusCount.approved),
      color: "#0088FE",
    },
    {
      name: "Approved noted",
      value: parseInt(shopdrawingStatusCount.approvedAsNoted),
      color: "#00C49F",
    },
    {
      name: "Revise",
      value: parseInt(shopdrawingStatusCount.reviseAndResubmit),
      color: "#FFBB28",
    },
    {
      name: "Rejected",
      value: parseInt(shopdrawingStatusCount.rejected),
      color: "#FF0000",
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF0000"];

  data.sort((a, b) => b.value - a.value);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleFilterClear = async () => {
    setStartdate(null);
    setEnddate(null);
    setContractor("");

    try {
      var res = await axios.post(
        url + "/Document/documentStatsSiteInstructionFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          contractor: "",
          start_date: null,
          enddate: null,
        },
        {
          headers: { token: user.token },
        }
      );
      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          if (element.key === "A-Approved") {
            approved = element.doc_count;
          }
          if (element.key === "B-Approved as noted") {
            approvedAsNoted = element.doc_count;
          }
          if (element.key === "C-Revise & resubmit") {
            reviseAndResubmit = element.doc_count;
          }
          if (element.key === "D-Rejected") {
            rejected = element.doc_count;
          }
        }
      );

      setShopdrawingStatusCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleFilter = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsSiteInstructionFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          contractor: contractor,
          start_date: startdate,
          enddate: enddate,
        },
        {
          headers: { token: user.token },
        }
      );
      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          if (element.key === "A-Approved") {
            approved = element.doc_count;
          }
          if (element.key === "B-Approved as noted") {
            approvedAsNoted = element.doc_count;
          }
          if (element.key === "C-Revise & resubmit") {
            reviseAndResubmit = element.doc_count;
          }
          if (element.key === "D-Rejected") {
            rejected = element.doc_count;
          }
        }
      );

      setShopdrawingStatusCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleFilterStartdate = async (newValue) => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsSiteInstructionFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          start_date: newValue,
          enddate: enddate,
        },
        {
          headers: { token: user.token },
        }
      );

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          if (element.key === "A-Approved") {
            approved = element.doc_count;
          }
          if (element.key === "B-Approved as noted") {
            approvedAsNoted = element.doc_count;
          }
          if (element.key === "C-Revise & resubmit") {
            reviseAndResubmit = element.doc_count;
          }
          if (element.key === "D-Rejected") {
            rejected = element.doc_count;
          }
        }
      );

      setShopdrawingStatusCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleFilterEnddate = async (newValue) => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsSiteInstructionFilter",
        {
          user_id: user.user_id,
          project_id: project.project_id,
          start_date: startdate,
          contractor: contractor,

          enddate: newValue,
        },
        {
          headers: { token: user.token },
        }
      );
      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          if (element.key === "A-Approved") {
            approved = element.doc_count;
          }
          if (element.key === "B-Approved as noted") {
            approvedAsNoted = element.doc_count;
          }
          if (element.key === "C-Revise & resubmit") {
            reviseAndResubmit = element.doc_count;
          }
          if (element.key === "D-Rejected") {
            rejected = element.doc_count;
          }
        }
      );

      setShopdrawingStatusCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
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
          width: "100%",
        }}
      >
        <Stack direction="row">
          <Heading1
            size="1.2em"
            weight="600"
            marginBottom="0.5em"
            JFcontent="center"
            align="center"
          >
            Site Instruction
            <Badge badgeContent={total} color="info"></Badge>
          </Heading1>
          {contractor?.length > 0 ||
          startdate?.toString().length ||
          enddate?.toString().length ? (
            <Button
              onClick={handleFilterClear}
              variant="contained"
              size="small"
              sx={{ marginBottom: 1 }}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          ) : null}
        </Stack>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <TextField
              id="outlined-basic"
              label="Contractor"
              value={contractor}
              fullWidth
              size="small"
              style={{ width: "150px" }}
              variant="outlined"
              onChange={(event) => setContractor(event.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleFilter}>
                    <SearchOutlined />
                  </IconButton>
                ),
              }}
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

export default SiteInstructionGraph;
