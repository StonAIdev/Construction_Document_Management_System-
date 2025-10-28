import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Autocomplete from "@mui/material/Autocomplete";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import Button from "@mui/material/Button";

import {
  ResponsibilityMatrixSearchInfo,
  BOQSearchInfo,
  ContractSearchInfo,
  TenderAddendumSearchInfo,
  MOMSearchInfo,
  ProjectManagerSearchCost,
  HeadOfDepartmentSearchCost,
  EngineerSearchCost,
  LogCost,
  TagCost,
  DocCost,
  taskCost,
} from "../../../SearchInfo";
import subDays from "date-fns/subDays";
import moment from "moment";
import { url } from "../../../url";

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import AddIcon from "@mui/icons-material/Add";

export const MoneySavedGraph = ({
  project,
  user,
  department,
  moneySaved,
  setMoneySaved,
  userPosition,
}) => {
  const [yearMonth, setYearMonth] = useState(null);
  const [selectedLast, setSelectedLast] = useState("Last 7 days");

  const getLastDateOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleExport = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(moneySaved);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Cost Saved" + fileExtension);
  };

  const getMoneySavedData = async (selectedOption) => {
    var end_date_utc = null;
    var start_date_utc = null;

    if (selectedOption == 7) {
      var date = new Date();
      end_date_utc = moment
        .utc(date)
        .set({ hour: 23, minute: 59, second: 59 })
        .format();
      start_date_utc = moment
        .utc(subDays(date, 7))
        .set({ hour: 0, minute: 0, second: 0 })
        .format();
    } else if (selectedOption == 30) {
      var date = new Date();
      end_date_utc = moment
        .utc(date)
        .set({ hour: 23, minute: 59, second: 59 })
        .format();
      start_date_utc = moment
        .utc(subDays(date, 30))
        .set({ hour: 0, minute: 0, second: 0 })
        .format();
    } else {
      var date = selectedOption;
      let year = date.getFullYear();
      let month = date.getMonth();
      let lastDateOfMonth = getLastDateOfMonth(year, month);
      end_date_utc = moment
        .utc(date)
        .set({ date: lastDateOfMonth, hour: 23, minute: 59, second: 59 })
        .format();
      start_date_utc = moment
        .utc(subDays(date, 7))
        .set({ date: 1, hour: 0, minute: 0, second: 0 })
        .format();
    }

    try {
      const response = await axios.post(
        url + "/kpi/getKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          startDate: start_date_utc,
          endDate: end_date_utc,
          userPosition: userPosition,
        },
        { headers: { token: user.token } }
      );

      var rows = {};
      if (response.data.length > 0) {
        let normal, stonai, saved, date;

        response.data.forEach((item) => {
          date = moment(new Date(item.search_date)).format("YYYY-MM-DD");

          if (item.search_type == "Responsibility Matrix") {
            if (item.user_position == "Project Manager") {
              normal =
                ResponsibilityMatrixSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai =
                ResponsibilityMatrixSearchInfo.stonai *
                item.count_search *
                ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                ResponsibilityMatrixSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai =
                ResponsibilityMatrixSearchInfo.stonai *
                item.count_search *
                HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                ResponsibilityMatrixSearchInfo.normal *
                item.count_search *
                EngineerSearchCost;
              stonai =
                ResponsibilityMatrixSearchInfo.stonai *
                item.count_search *
                EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "BOQ") {
            if (item.user_position == "Project Manager") {
              normal =
                BOQSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai =
                BOQSearchInfo.stonai *
                item.count_search *
                ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                BOQSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai =
                BOQSearchInfo.stonai *
                item.count_search *
                HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                BOQSearchInfo.normal * item.count_search * EngineerSearchCost;
              stonai =
                BOQSearchInfo.stonai * item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "Tender Addendums") {
            if (item.user_position == "Project Manager") {
              normal =
                TenderAddendumSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai =
                TenderAddendumSearchInfo.stonai *
                item.count_search *
                ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                TenderAddendumSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai =
                TenderAddendumSearchInfo.stonai *
                item.count_search *
                HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                TenderAddendumSearchInfo.normal *
                item.count_search *
                EngineerSearchCost;
              stonai =
                TenderAddendumSearchInfo.stonai *
                item.count_search *
                EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "Contracts") {
            if (item.user_position == "Project Manager") {
              normal =
                ContractSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai =
                ContractSearchInfo.stonai *
                item.count_search *
                ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                ContractSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai =
                ContractSearchInfo.stonai *
                item.count_search *
                HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                ContractSearchInfo.normal *
                item.count_search *
                EngineerSearchCost;
              stonai =
                ContractSearchInfo.stonai *
                item.count_search *
                EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "MOM") {
            if (item.user_position == "Project Manager") {
              normal =
                MOMSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai =
                MOMSearchInfo.stonai *
                item.count_search *
                ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                MOMSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai =
                MOMSearchInfo.stonai *
                item.count_search *
                HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                MOMSearchInfo.normal * item.count_search * EngineerSearchCost;
              stonai =
                MOMSearchInfo.stonai * item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "Log") {
            normal = LogCost.normal * item.count_search;
            stonai = LogCost.stonai * item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Tags") {
            normal = TagCost.normal * item.count_search;
            stonai = TagCost.stonai * item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "DocSearch") {
            normal = DocCost.normal * item.count_search;
            stonai = DocCost.stonai * item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Tasks") {
            normal = taskCost.normal * item.count_search;
            stonai = taskCost.stonai * item.count_search;
            saved = normal - stonai;
          }

          if (Object.keys(rows).includes(date)) {
            rows[date]["Manually"] += normal;
            rows[date]["StonAI"] += stonai;
            rows[date]["SavedCost"] += saved;
          } else {
            rows[date] = {
              date: date,
              Manually: normal,
              StonAI: stonai,
              SavedCost: saved,
            };
          }
        });
        var list = Object.entries(rows);
        var moneySavedData = [];
        list.forEach((item) => {
          item[1].Manually = (item[1].Manually / 60).toFixed(2);
          item[1].StonAI = (item[1].StonAI / 60).toFixed(2);
          item[1].SavedCost = (item[1].SavedCost / 60).toFixed(2);
          moneySavedData.push(item[1]);
        });

        setMoneySaved(moneySavedData);
      } else {
        setMoneySaved([]);
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
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
            Cost Utilized (Dhs)
          </Heading1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div>
            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
              <DatePicker
                inputFormat="yyyy-MM"
                views={["year", "month"]}
                label="Year and Month"
                sx={{ width: "200px" }}
                value={yearMonth}
                onChange={(date) => {
                  setSelectedLast(null);
                  if (date) {
                    getMoneySavedData(date);
                    setYearMonth(date);
                  } else {
                    setYearMonth(null);
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} size="small" sx={{ width: "200px" }} />
                )}
              />
            </LocalizationProvider>
          </div>
          <div>
            <Autocomplete
              id="combo-box-demo"
              options={lastOptions}
              size="small"
              sx={{ width: "200px" }}
              value={selectedLast}
              onChange={(event, newValue) => {
                setYearMonth(null);
                if (newValue) {
                  getMoneySavedData(newValue.value);
                  setSelectedLast(newValue);
                } else {
                  setSelectedLast(null);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Last" />
              )}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              onClick={handleExport}
              startIcon={<AddIcon />}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={moneySaved}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Manually" fill="#F93154" />
          <Bar dataKey="StonAI" fill="#1f77b4" />
          <Bar dataKey="SavedCost" fill="#2ca02c" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default MoneySavedGraph;

const lastOptions = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 7 days", value: 7 },
];
