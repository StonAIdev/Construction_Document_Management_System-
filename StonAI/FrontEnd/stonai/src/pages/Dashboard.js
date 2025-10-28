import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import UploadedDocs from "../components/dashboard/UploadedDocs";
import UploadedContracts from "../components/dashboard/UploadedContracts";
import CompletedProjects from "../components/dashboard/CompletedProjects";
import TotalProjects from "../components/dashboard/TotalProjects";
import RecentProjects from "../components/dashboard/RecentProjects";
import React, { useState, useEffect } from "react";
import "../components/dashboard/Dashboard.css";
import DashCardList from "../components/dashboard/Cards/DashCardList";
import Invitecard from "../components/dashboard/Cards/Invitecard";
import PropTypes from "prop-types";
import {
  ResponsibilityMatrixSearchInfo,
  BOQSearchInfo,
  ContractSearchInfo,
  TenderAddendumSearchInfo,
  MOMSearchInfo,
  ProjectManagerSearchCost,
  HeadOfDepartmentSearchCost,
  EngineerSearchCost,
  ExecutiveSearchCost,
  task,
  taskEmail,
  taskCost,
  taskEmailCost,
  Log,
  LogCost,
  Tag,
  TagCost,
  DocSearch,
  DocCost,
} from "../SearchInfo";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Overview from "../components/dashboard/Overview";
import Heading1 from "../Reusable Components/Headings/Heading1";
import OrganizationalCharts from "../components/dashboard/OrganizationalCharts";
import CircularProgress from "@mui/material/CircularProgress";
import subDays from "date-fns/subDays";
import moment from "moment";

import { url } from "../url";

import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Dashboard({
  user,
  userInfo,
  project,
  permisions,
  department,
  userPosition,
}) {
  console.log("userposition", userPosition);
  const [value, setValue] = React.useState(0);
  const [assignedTaskStats, setAssignedTasksStats] = useState({
    cancelled: 0,
    completed: 0,
    delayed: 0,
    inProcess: 0,
  });

  const [mytaskStats, setMyTasksStats] = useState({
    cancelled: 0,
    completed: 0,
    delayed: 0,
    inProcess: 0,
  });

  const [timeSaved, setTimeSaved] = useState([]);
  const [moneySaved, setMoneySaved] = useState([]);

  ////Engineering////
  const [shopdrawingStatusCount, setShopdrawingStatusCount] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [MaterialStatusCount, setMaterialStatusCount] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [MethodStatementCount, setMethodStatementCount] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [preCount, setPreCount] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [technical, setTechinal] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  ////Construction////

  const [inspectionCount, setInspectionAccount] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [siteInstruction, setSiteInstruction] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [workClearance, setworkClearance] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [nonConformanceReport, setNonConformanceReport] = useState({
    approved: 0,
    approvedAsNoted: 0,
    reviseAndResubmit: 0,
    rejected: 0,
  });

  const [hodTasks, setHODTasks] = useState({
    cancelled: 0,
    completed: 0,
    delayed: 0,
    inProcess: 0,
  });

  const [infoReq, setInfoReq] = useState({
    cancelled: 0,
    completed: 0,
    delayed: 0,
    inProcess: 0,
  });

  const [arch, setArch] = useState({
    cancelled: 0,
    completed: 0,
    delayed: 0,
    inProcess: 0,
  });

  const [totalUsers, setTotalUsers] = useState();
  const [totalDeps, setTotalDeps] = useState();
  const [totalProjects, setTotalProjects] = useState();
  const [totalPendingTasks, setTotalPendingTasks] = useState();
  const [totalDocuments, setTotalDocuments] = useState();
  const [totalContracts, setTotalContracts] = useState();

  const [hodTimeSaved, setHoldTimeSaved] = useState(0);

  const [hodMoneySaved, setHodMoneySaved] = useState(0);

  const getTotalTasks = async () => {
    try {
      var res = await axios.post(
        url + "/Tasks/getTotalTasksHODStats",
        {
          user_id: userInfo.user_id,
          project_id: project.project_id,
          department_id: department.department_id,
        },
        {
          headers: { token: user.token },
        }
      );
      let completed = 0;
      let cancelled = 0;
      let delayed = 0;
      let inProcess = 0;
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
      console.log("HOD Tasks", res.data);
    } catch (e) {
      console.log(e);
    }
  };
  console.log("checdsfl", department);
  const [isLoading, setIsloading] = useState(true);

  const getTotalDocumentsCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/totalDocumentStats",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("document count", res.data);
      setTotalDocuments(res.data.count);
    } catch (e) {
      console.log(e);
    }
  };
  const getTotalContractsCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/totalContractStats",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );
      console.log("document count contract", res.data);
      setTotalContracts(res.data.count);
    } catch (e) {
      console.log(e);
    }
  };

  const getTotalPendingTasksCount = async () => {
    try {
      var res = await axios.post(
        url + "/Tasks/getProjectPendingTasks",
        {
          user_id: userInfo.user_id,
          project_id: project.project_id,
          department_id: department.department_id,
        },
        {
          headers: { token: user.token },
        }
      );

      console.log("poloc", res);
      setTotalPendingTasks(res.data[0].count);
      console.log("Pending Tasks", res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getTotalUsersCount = async () => {
    console.log("callledddd");
    try {
      var res = await axios.post(
        url + "/Userinfo/getEnterpriseUsersCount",
        {
          enterprise_id: userInfo.enterprise_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("total projects", res);
      setTotalUsers(res.data[0].count);
    } catch (e) {
      console.log(e);
    }
  };
  const getTotalDepCount = async () => {
    console.log("callledddd");
    try {
      var res = await axios.post(
        url + "/Department/getProjectDepartmentsStats",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );

      console.log("total projects", res);
      setTotalDeps(res.data[0].count);
    } catch (e) {
      console.log(e);
    }
  };
  const getTotalProjectsCount = async () => {
    try {
      var res = await axios.post(
        url + "/Project/getEnterpriseProjectsCount",
        {
          enterprise_id: userInfo.enterprise_id,
        },
        {
          headers: { token: user.token },
        }
      );

      console.log("total projects", res);
      setTotalProjects(res.data[0].count);
    } catch (e) {
      console.log(e);
    }
  };

  const asyncApis = async () => {
    getTotalDocumentsCount();
    getTotalContractsCount();
    getTotalPendingTasksCount();
    getTotalUsersCount();
    getTotalDepCount();
    getTotalProjectsCount();
    getMaterialCount();
    getShopDrawingStatusCount();
    getMethodCount();
    getPreCount();
    getTechinalCount();
    getRequestInformationCount();

    /// construction graphs
    getSiteInstruction();
    getInspectionRequest();
    getWorkClearence();
    getArch();
    getNonConformanceReport();
    // if (department?.department_name === "Engineering") {
    //   if (permisions?.canviewmaterialsubmittal) {
    //     getMaterialCount();
    //   }
    //   if (permisions?.canviewshopdrawingsubmittal) {
    //     getShopDrawingStatusCount();
    //   }

    //   if (permisions?.canviewmethodstatementsubmittal) {
    //     getMethodCount();
    //   }

    //   if (permisions?.canviewprequalificationsubmittal) {
    //     getPreCount();
    //   }

    //   if (permisions?.canviewtechnicalsubmittal) {
    //     getTechinalCount();
    //   }

    //   if (permisions?.canviewrequestforinformation) {
    //     getRequestInformationCount();
    //   }
    // }

    // //  else if (department?.department_name === "Construction") {

    // // if (permisions?.canviewmaterialinspectionrequest) {
    // //   getInspectionRequest();
    // // }
    // // if (permisions?.canviewworkinspectionrequest) {
    // //   getWorkClearence();
    // // }
    // // if (permisions?.canviewnonconformancereport) {
    // //   getNonConformanceReport();
    // // }
    // // if (permisions?.canviewsiteinstruction) {
    // //   getSiteInstruction();
    // // }
    // // if (permisions?.canviewarchitecturalinspectionrequest) {
    // //   getArch();
    // // }
    // // if (permisions?.canviewmaterialsubmittal) {
    // //   getMaterialCount();
    // // }
    // // if (permisions?.canviewshopdrawingsubmittal) {
    // //   getShopDrawingStatusCount();
    // // }

    // // if (permisions?.canviewmethodstatementsubmittal) {
    // //   getMethodCount();
    // // }

    // // if (permisions?.canviewprequalificationsubmittal) {
    // //   getPreCount();
    // // }

    // // if (permisions?.canviewtechnicalsubmittal) {
    // //   getTechinalCount();
    // // }

    // // if (permisions?.canviewrequestforinformation) {
    // //   getRequestInformationCount();
    // // }
    // // }
    // else {
    //   getMaterialCount();
    //   getShopDrawingStatusCount();
    //   getMethodCount();
    //   getPreCount();
    //   getTechinalCount();
    //   getRequestInformationCount();
    // }

    console.log("dep here", department);
    getUserTasks();
    if (permisions?.canviewassingedtaskpageworkspace) {
      getUserAssignedTasks();
    }

    if (userPosition === "Head of Department") {
      getTotalTasks();
      // getShopDrawingStatusCount();
      // getMethodCount();
      // getPreCount();
      // getTechinalCount();
      // getRequestInformationCount();
    }
  };

  useEffect(() => {
    asyncApis();
  }, []);

  const getKpiAsyncApis = async () => {
    getLast7DaysTimeSavedData();
    getLast7DaysMoneySavedData();
  };

  useEffect(() => {
    if (userPosition) {
      getKpiAsyncApis();
    }
  }, [userPosition]);

  const [documentsUploadCount, setDocumentsUploadCount] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getShopDrawingStatusCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStats",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;
      console.log("shopdrawingStatusCount", res);

      res.data.aggregations.shopdrawing_status_category_count.buckets.forEach(
        (element) => {
          console.log("shopdrawingStatusCount", element);
          if (element.key === "A-Approved" || element.key === "A Approved") {
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

  const getTechinalCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsTechnical",
        { project_id: project.project_id },

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

      setTechinal({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getMethodCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsMethod",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("methodCount", res);
      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.method_statement_category_count.buckets.forEach(
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

      setMethodStatementCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getPreCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsPre",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );
      console.log("preCount", res);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.Prequalification_status_category_count.buckets.forEach(
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

      setPreCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getRequestInformationCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsReq",
        { project_id: project.project_id },

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

      setInfoReq({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getLast7DaysMoneySavedData = async () => {
    var date = new Date();
    var end_date_utc = moment
      .utc(date)
      .set({ hour: 23, minute: 59, second: 59 })
      .format();
    var start_date_utc = moment
      .utc(subDays(date, 7))
      .set({ hour: 0, minute: 0, second: 0 })
      .format();
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
              stonai = item.count_search * ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                ResponsibilityMatrixSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai = item.count_search * HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                ResponsibilityMatrixSearchInfo.normal *
                item.count_search *
                EngineerSearchCost;
              stonai = item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "BOQ") {
            if (item.user_position == "Project Manager") {
              normal =
                BOQSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai = item.count_search * ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal = item.count_search * HeadOfDepartmentSearchCost;
              stonai =
                BOQSearchInfo.stonai *
                item.count_search *
                HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                BOQSearchInfo.normal * item.count_search * EngineerSearchCost;
              stonai = item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "Tender Addendums") {
            if (item.user_position == "Project Manager") {
              normal =
                TenderAddendumSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai = item.count_search * ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                TenderAddendumSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai = item.count_search * HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                TenderAddendumSearchInfo.normal *
                item.count_search *
                EngineerSearchCost;
              stonai = item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "Contracts") {
            if (item.user_position == "Project Manager") {
              normal =
                ContractSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai = item.count_search * ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                ContractSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai = item.count_search * HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                ContractSearchInfo.normal *
                item.count_search *
                EngineerSearchCost;
              stonai = item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "MOM") {
            if (item.user_position == "Project Manager") {
              normal =
                MOMSearchInfo.normal *
                item.count_search *
                ProjectManagerSearchCost;
              stonai = item.count_search * ProjectManagerSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Head of Department") {
              normal =
                MOMSearchInfo.normal *
                item.count_search *
                HeadOfDepartmentSearchCost;
              stonai = item.count_search * HeadOfDepartmentSearchCost;
              saved = normal - stonai;
            } else if (item.user_position == "Engineer") {
              normal =
                MOMSearchInfo.normal * item.count_search * EngineerSearchCost;
              stonai = item.count_search * EngineerSearchCost;
              saved = normal - stonai;
            }
          } else if (item.search_type == "Tasks") {
            normal = task.normal * item.count_search * taskCost;
            stonai = item.count_search * taskCost;
            saved = normal - stonai;
          } else if (item.search_type == "DocSearch") {
            normal = DocSearch.normal + item.count_search * DocCost;
            stonai = item.count_search * DocCost;
            saved = normal - stonai;
          } else if (item.search_type == "Tags") {
            normal = Tag.normal + item.count_search + TagCost;
            stonai = item.count_search * TagCost;
            saved = normal - stonai;
          } else if (item.search_type == "Log") {
            normal = Log.normal + item.count_search + LogCost;
            stonai = item.count_search * LogCost;
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

        let totalMoneySaved = 0;

        // list.forEach((item) => {
        //   item[1].Manually = (item[1].Manually / 1000).toFixed(2);
        //   item[1].StonAI = (item[1].StonAI / 1000).toFixed(2);
        //   item[1].SavedCost = (item[1].SavedCost / 1000).toFixed(2);
        //   moneySavedData.push(item[1]);
        //   totalMoneySaved += item[1].SavedCost / 1000;
        // });

        list.forEach((item) => {
          item[1].Manually = (item[1].Manually / 1000).toFixed(2);
          item[1].StonAI = (item[1].StonAI / 1000).toFixed(2);
          item[1].SavedCost = (item[1].SavedCost / 1000).toFixed(2);
          moneySavedData.push(item[1]);
          totalMoneySaved += item[1].SavedCost / 1000;
        });

        console.log("money saved", totalMoneySaved);

        setHodMoneySaved(totalMoneySaved);
        setMoneySaved(moneySavedData);
      } else {
        setMoneySaved([]);
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const getLast7DaysTimeSavedData = async () => {
    var date = new Date();
    var end_date_utc = moment
      .utc(date)
      .set({ hour: 23, minute: 59, second: 59 })
      .format();
    var start_date_utc = moment
      .utc(subDays(date, 7))
      .set({ hour: 0, minute: 0, second: 0 })
      .format();
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
          console.log("item kpi", item);
          date = moment(new Date(item.search_date)).format("YYYY-MM-DD");

          if (item.search_type == "Responsibility Matrix") {
            normal = ResponsibilityMatrixSearchInfo.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "BOQ") {
            normal = BOQSearchInfo.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Tender Addendums") {
            normal = TenderAddendumSearchInfo.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Contracts") {
            normal = ContractSearchInfo.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "MOM") {
            normal = MOMSearchInfo.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Tasks") {
            normal = task.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "DocSearch") {
            normal = DocSearch.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Tags") {
            normal = Tag.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          } else if (item.search_type == "Log") {
            normal = Log.normal * item.count_search;
            stonai = item.count_search;
            saved = normal - stonai;
          }

          if (Object.keys(rows).includes(date)) {
            rows[date]["Manually"] += normal;
            rows[date]["StonAI"] += stonai;
            rows[date]["SavedTime"] += saved;
          } else {
            rows[date] = {
              date: date,
              Manually: normal,
              StonAI: stonai,
              SavedTime: saved,
            };
          }
        });
        var list = Object.entries(rows);

        var timeSavedData = [];

        let totalTimeSaved = 0;
        // list.forEach((item) => {
        //   item[1].Manually = (item[1].Manually / 60000).toFixed(2);
        //   item[1].StonAI = (item[1].StonAI / 60000).toFixed(2);
        //   item[1].SavedTime = (item[1].SavedTime / 60000).toFixed(2);
        //   timeSavedData.push(item[1]);
        //   totalTimeSaved += item[1].SavedTime / 60;
        // });
        list.forEach((item) => {
          item[1].Manually = (item[1].Manually / 60000).toFixed(2);
          item[1].StonAI = (item[1].StonAI / 60000).toFixed(2);
          item[1].SavedTime = (item[1].SavedTime / 60000).toFixed(2);
          timeSavedData.push(item[1]);
          totalTimeSaved += item[1].SavedTime / 60;
        });

        // console.log("total time Saved", totalTimeSaved.toFixed(2));

        setHoldTimeSaved(totalTimeSaved);
        setTimeSaved(timeSavedData);
      } else {
        setTimeSaved([]);
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  // convert milliseconds to minutes
  const convertMillisecondsToMinutes = (milliseconds) => {
    return milliseconds / 60000;
  };

  const getMaterialCount = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsMaterial",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("material count", res.data);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          console.log("material element", element);
          if (element.key === "A-Approved" || element.key === "(A) Approved") {
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

      setMaterialStatusCount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getInspectionRequest = async () => {
    console.log("inspection count");

    try {
      var res = await axios.post(
        url + "/Document/documentStatsMaterialInspection",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("inspection count", res.data);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          console.log("material element", element);
          if (element.key === "A-Approved" || element.key === "(A) Approved") {
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

      setInspectionAccount({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getSiteInstruction = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsSiteInstruction",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("site count", res.data);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.site_instruction_category_count.buckets.forEach(
        (element) => {
          console.log("site instruction element count", element);
          if (element.key === "A-Approved" || element.key === "(A) Approved") {
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

      setSiteInstruction({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getArch = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsArchit",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("site count", res.data);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          console.log("material element", element);
          if (element.key === "A-Approved" || element.key === "(A) Approved") {
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

      setArch({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getWorkClearence = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsWorkClearance",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("inspection count", res.data);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          console.log("material element", element);
          if (element.key === "A-Approved" || element.key === "(A) Approved") {
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

      setworkClearance({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getNonConformanceReport = async () => {
    try {
      var res = await axios.post(
        url + "/Document/documentStatsNonConformance",
        { project_id: project.project_id },

        {
          headers: { token: user.token },
        }
      );

      console.log("inspection count", res.data);

      let approved = 0;
      let approvedAsNoted = 0;
      let reviseAndResubmit = 0;
      let rejected = 0;

      res.data.aggregations.material_submittal_category_count.buckets.forEach(
        (element) => {
          console.log("material element", element);
          if (element.key === "A-Approved" || element.key === "(A) Approved") {
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

      setNonConformanceReport({
        approved: approved,
        approvedAsNoted: approvedAsNoted,
        reviseAndResubmit: reviseAndResubmit,
        rejected: rejected,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getUserAssignedTasks = async () => {
    try {
      var res = await axios.post(
        url + "/Tasks/getAssignedTasksStats",
        {
          user_id: userInfo.user_id,
          project_id: project.project_id,
          department_id: department.department_id,
        },
        {
          headers: { token: user.token },
        }
      );

      let completed = 0;
      let cancelled = 0;
      let delayed = 0;
      let inProcess = 0;

      res.data.rows.forEach((element) => {
        console.log("element", element);
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

      setAssignedTasksStats({
        cancelled: cancelled,
        completed: completed,
        delayed: delayed,
        inProcess: inProcess,
      });
      setIsloading(false);
      console.log(" Tasks", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getUserTasks = async (title) => {
    try {
      var res = await axios.post(
        url + "/Tasks/getMyTasksStats",
        {
          user_id: userInfo.user_id,
          project_id: project.project_id,
          department_id: department.department_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log(" TasksDashboard", res.data);
      let completed = 0;
      let cancelled = 0;
      let delayed = 0;
      let inProcess = 0;
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
      setMyTasksStats({
        cancelled: cancelled,
        completed: completed,
        delayed: delayed,
        inProcess: inProcess,
      });
      console.log("assigned Tasks", res.data);
    } catch (e) {
      console.log(e);
    }
  };

  console.log("my tasks", "assigned tasks", mytaskStats, assignedTaskStats);

  return (
    <>
      {!isLoading ? (
        <>
          <Helmet>
            <title>Dashboard | StonAi</title>
          </Helmet>

          <div className="DashboardMain">
            <Heading1
              color="var(--blue)"
              width="fit-content"
              size="1.5em"
              weight="500"
              marginBottom=""
            >
              Dashboard
            </Heading1>

            <Box sx={{ width: "100%" }}>
              <Overview
                assignedTaskStats={assignedTaskStats}
                mytaskStats={mytaskStats}
                timeSaved={timeSaved}
                setTimeSaved={setTimeSaved}
                moneySaved={moneySaved}
                setMoneySaved={setMoneySaved}
                userPosition={userPosition}
                shopdrawingStatusCount={shopdrawingStatusCount}
                MaterialStatusCount={MaterialStatusCount}
                project={project}
                user={user}
                setAssignedTasksStats={setAssignedTasksStats}
                setMyTasksStats={setMyTasksStats}
                setShopdrawingStatusCount={setShopdrawingStatusCount}
                setMaterialStatusCount={setMaterialStatusCount}
                department={department}
                hodTasks={hodTasks}
                setHODTasks={setHODTasks}
                totalDeps={totalDeps}
                totalProjects={totalProjects}
                totalUsers={totalUsers}
                totalPendingTasks={totalPendingTasks}
                totalDocuments={totalDocuments}
                totalContracts={totalContracts}
                hodMoneySaved={hodMoneySaved}
                hodTimeSaved={hodTimeSaved}
                inspectionCount={inspectionCount}
                setInspectionAccount={setInspectionAccount}
                setSiteInstruction={setSiteInstruction}
                siteInstruction={siteInstruction}
                workClearance={workClearance}
                setworkClearance={setworkClearance}
                setNonConformanceReport={setNonConformanceReport}
                nonConformanceReport={nonConformanceReport}
                permisions={permisions}
                MethodStatementCount={MethodStatementCount}
                setMethodStatementCount={setMethodStatementCount}
                setPreCount={setPreCount}
                preCount={preCount}
                setTechinal={setTechinal}
                technical={technical}
                infoReq={infoReq}
                setInfoReq={setInfoReq}
                arch={arch}
                setArch={setArch}
              />
            </Box>
          </div>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
