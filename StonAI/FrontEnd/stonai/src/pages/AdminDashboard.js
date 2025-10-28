import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  CircularProgress,
} from "@mui/material";

import Modal from "@mui/material/Modal";
import AddUser from "../components/admin/AddUser";
import Fade from "react-reveal/Fade";
import AdminCard from "../components/admin/AdminCard";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import "../components/admin/Admin.css";
import AdminUserCard from "../components/admin/AdminUserCard";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AdminProjectCard from "../components/admin/AdminProjectCard";
import AdminDepartmentCard from "../components/admin/AdminDepartmentCard";
import { url } from "../url";
import AddIcon from "@mui/icons-material/Add";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFilter } from "@fortawesome/free-solid-svg-icons";
import Fab from "@mui/material/Fab";

const AdminDashboard = ({
  user,
  userInfo,
  project,
  permisions,
  department,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const [ProjectNameFilter, setProjectNameFilter] = useState([]);
  const [ProjectTypeFilter, setProjectTypeFilter] = useState([]);

  const [FiltersClicked, setFiltersClicked] = useState(false);
  const [startdate, setstartdate] = useState(null);
  const [enddate, setenddate] = useState(null);
  const [selectedTab, setselectedTab] = useState(2);

  const [projectApiData, setProjectApiData] = useState(null);
  const [departmentApiData, setDepartmentApiData] = useState(null);
  const [userApiData, setUserApiData] = useState(null);

  const [DepartmentNameFilter, setDepartmentNameFilter] = useState([]);
  const [DescriptionFilter, setDescriptionFilter] = useState("");
  const [DepartmentCreatorFilter, setDepartmentCreatorFilter] = useState([]);

  const [DepartmentCreatedDateFilter, setDepartmentCreatedDateFilter] =
    useState(null);

  const [firstNameFilter, setFirstNameFilter] = useState([]);
  const [lastNameFilter, setLastNameFilter] = useState([]);
  const [usernameFilter, setUserNameFilter] = useState([]);
  const [userRole, setUserRoleFilter] = useState([]);
  const [userCreatorFilter, setUserCreatorFilter] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [totalUsers, setTotalUsers] = useState();

  const [totalDeps, setTotalDeps] = useState();

  const [search, setSearch] = useState("");

  const [totalProjects, setTotalProjects] = useState();

  const AdminCardData = [
    // {
    //   id: 1,
    //   folderName: "Projects",
    //   image: "",
    //   number: totalProjects,
    //   sidebarColor: "var(--blue)",
    //   pageUrl: "/app/createProject",
    //   permisionsCheck: permisions.canviewprojectspageadmin,
    // },
    {
      id: 2,
      folderName: "Departments",
      image: "",
      number: totalDeps,
      sidebarColor: "var(--green)",
      pageUrl: "/app/createDepartment",
      permisionsCheck: permisions.canviewdepartmentspageadmin,
    },
    {
      id: 3,
      folderName: "Users",
      image: "",
      number: totalUsers,
      sidebarColor: "var(--orange)",
      pageUrl: "/app/createUsers",
      permisionsCheck: permisions.canviewuserspageadmin,
    },
  ];

  useEffect(() => {
    // projectsCount();
    usersCount();
    depCount();
    if (selectedTab === 1) {
      projectApiCall();
    } else if (selectedTab === 2) {
      departmentApiCall();
    } else if (selectedTab === 3) {
      usersApiCall();
    }
  }, [refresh]);

  const projectsCount = async () => {
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

      setTotalProjects(res.data[0].count);
    } catch (e) {
      console.log(e);
    }
  };

  const depCount = async () => {
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

      setTotalDeps(res.data[0].count);
    } catch (e) {
      console.log(e);
    }
  };

  const usersCount = async () => {
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

      setTotalUsers(res.data[0].count);
    } catch (e) {
      console.log(e);
    }
  };

  const projectApiCall = async () => {
    setLoading(false);

    try {
      var res = await axios.post(
        url + "/Project/getEnterpriseProjects",
        {
          enterprise_id: userInfo.enterprise_id,
        },
        {
          headers: { token: user.token },
        }
      );

      setProjectApiData(res.data);

      const projectNameArray = [];
      const projectTypeArray = [];

      res.data.forEach((element) => {
        if (element?.project_name) {
          projectNameArray.push({ label: element?.project_name });
        }
        if (element?.project_type) {
          projectTypeArray.push({ label: element?.project_type });
        }
      });

      const uniqueprojNameArray = [
        ...new Set(projectNameArray.map((item) => item.label)),
      ];
      const uniqueprojCreatorArray = [
        ...new Set(projectTypeArray.map((item) => item.label)),
      ];

      setProjectNameFilter(uniqueprojNameArray);
      setProjectTypeFilter(uniqueprojCreatorArray);
      setProjectApiData(res.data);

      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const departmentApiCall = async () => {
    setLoading(false);

    try {
      var res = await axios.post(
        url + "/Department/getProjectDepartments",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );

      const depNameArray = [];
      const depCreatorArray = [];
      res.data.forEach((element) => {
        if (element?.department_name) {
          depNameArray.push({ label: element?.department_name });
        }
        if (element?.created_by) {
          depCreatorArray.push({ label: element?.created_by });
        }
      });

      const uniquedepNameArray = [
        ...new Set(depNameArray.map((item) => item.label)),
      ];
      const uniquedepCreatorArray = [
        ...new Set(depCreatorArray.map((item) => item.label)),
      ];
      setDepartmentNameFilter(uniquedepNameArray);
      setDepartmentCreatorFilter(uniquedepCreatorArray);
      setDepartmentApiData(res.data);
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const usersApiCall = async () => {
    setLoading(false);

    try {
      var res = await axios.post(
        url + "/Userinfo/getEnterpriseUsers",
        {
          enterprise_id: userInfo.enterprise_id,
          // project_id: project.project_id,
          // user_id: user.user_id,
        },
        {
          headers: { token: user.token },
        }
      );
      const firstNameArray = [];
      const lastNameArray = [];
      const usernameArray = [];
      const userRoleArray = [];
      const createdByArray = [];

      res.data.forEach((element) => {
        if (element?.firstname) {
          firstNameArray.push({ label: element.firstname });
        }
        if (element?.lastname) {
          lastNameArray.push({ label: element.lastname });
        }
        if (element?.username) {
          usernameArray.push({ label: element.username });
        }
        if (element?.user_role) {
          userRoleArray.push({ label: element.user_role });
        }
        if (element?.created_by) {
          createdByArray.push({ label: element.created_by });
        }
      });

      const uniqueName = [...new Set(firstNameArray.map((item) => item.label))];
      const uniqueLastName = [
        ...new Set(lastNameArray.map((item) => item.label)),
      ];
      const uniqueUsername = [
        ...new Set(usernameArray.map((item) => item.label)),
      ];
      const uniqueRole = [...new Set(userRoleArray.map((item) => item.label))];
      const uniqueCreator = [
        ...new Set(createdByArray.map((item) => item.label)),
      ];
      setFirstNameFilter(uniqueName);
      setLastNameFilter(uniqueLastName);
      setUserNameFilter(uniqueUsername);
      setUserRoleFilter(uniqueRole);
      setUserCreatorFilter(uniqueCreator);
      setUserApiData(res.data);
      setLoading(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSelectedTab = (id) => {
    handleClear();

    if (id === 1) {
      projectApiCall();
    } else if (id === 2) {
      departmentApiCall();
    } else if (id === 3) {
      usersApiCall();
    }

    setselectedTab(id);
  };

  const handleFilterClearProject = () => {
    setDataForDbProject({
      name: "",
      type: "",
      startdate: null,
      enddate: null,
      enterprise_id: userInfo.enterprise_id,
    });

    setRefresh(!refresh);
  };
  const handleFilterClearDep = () => {
    setDataForDepartment({
      name: "",
      description: "",
      createdBy: "",
      createdOn: null,
      project_id: project.project_id,
    });

    setRefresh(!refresh);
  };
  const handleFilterClearUsers = () => {
    setDataForDbUser({
      firstname: "",
      lastname: "",
      username: "",
      role: "",
      createdBy: "",
      enterprise_id: userInfo.enterprise_id,
    });
    setRefresh(!refresh);
  };

  const CardToDisplayView = () => {
    if (selectedTab === 1 && projectApiData) {
      return projectApiData.map((proj) => (
        <AdminProjectCard
          user={user}
          project={project}
          setRefresh={setRefresh}
          refresh={refresh}
          userInfo={userInfo}
          proj={proj}
          permisions={permisions}
        />
      ));
    } else if (selectedTab === 2 && departmentApiData) {
      return departmentApiData
        .filter(
          (f) =>
            f?.department_name?.toLowerCase().includes(search.toLowerCase()) ||
            f?.resposibility?.toLowerCase().includes(search.toLowerCase()) ||
            f?.created_by?.toLowerCase().includes(search.toLowerCase()) ||
            f?.created_on?.toLowerCase().includes(search.toLowerCase())
        )
        .map((dep) => (
          <AdminDepartmentCard
            selectedTab={selectedTab}
            name={dep.department_name}
            resposibility={dep.resposibility}
            created_by={dep.created_by}
            created_on={dep.created_on}
            user={user}
            userInfo={userInfo}
            project={project}
            depID={dep.department_id}
            setRefresh={setRefresh}
            refresh={refresh}
            head_of_department={dep.head_of_department}
            permisions={permisions}
          />
        ));
    } else if (selectedTab === 3 && userApiData) {
      return userApiData
        .filter(
          (f) =>
            f?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
            f?.lastname?.toLowerCase().includes(search.toLowerCase()) ||
            f?.username?.toLowerCase().includes(search.toLowerCase()) ||
            f?.user_role?.toLowerCase().includes(search.toLowerCase()) ||
            f?.created_by?.toLowerCase().includes(search.toLowerCase())
        )
        .map((u) => (
          <AdminUserCard
            selectedTab={selectedTab}
            firstName={u.firstname}
            lastName={u.lastname}
            username={u.username}
            createdBy={u.created_by}
            role={u.user_role}
            user={user}
            userInfo={userInfo}
            project={project}
            setRefresh={setRefresh}
            refresh={refresh}
            user_id={u.user_id}
            permisions={permisions}
            department={department}
          />
        ));
    }
  };

  const DisplayLabel = () => {
    if (selectedTab === 1 && projectApiData) {
      return (
        <div className="HeaderLabel">
          <div className="seaarchresultDivision" style={{ width: "30%" }}>
            Project Name
          </div>
          <div className="seaarchresultDivision" style={{ width: "20%" }}>
            Project Type
          </div>
          <div className="seaarchresultDivision" style={{ width: "20%" }}>
            Docs Uploaded
          </div>
          <div className="seaarchresultDivision" style={{ width: "15%" }}>
            Start Date
          </div>
          <div className="seaarchresultDivision" style={{ width: "15%" }}>
            End Date
          </div>
          <div className="seaarchresultDivision" style={{ width: "8%" }}></div>
        </div>
      );
    } else if (selectedTab === 2 && departmentApiData) {
      return (
        <div className=" HeaderLabel">
          <div className="seaarchresultDivision" style={{ width: "15%" }}>
            Department
          </div>
          <div className="seaarchresultDivision" style={{ width: "15%" }}>
            Project
          </div>
          <div className="seaarchresultDivision" style={{ width: "25%" }}>
            Description
          </div>
          <div className="seaarchresultDivision" style={{ width: "15%" }}>
            Created By
          </div>
          <div className="seaarchresultDivision" style={{ width: "15%" }}>
            Created On
          </div>
          <div className="seaarchresultDivision" style={{ width: "10%" }}></div>
        </div>
      );
    } else if (selectedTab === 3 && userApiData) {
      return (
        <div className=" HeaderLabel">
          <div
            className="seaarchresultDivision"
            style={{ width: "55px" }}
          ></div>
          <div className="seaarchresultDivision" style={{ width: "16%" }}>
            {" "}
            First Name
          </div>
          <div className="seaarchresultDivision" style={{ width: "16%" }}>
            {" "}
            Last Name
          </div>
          <div className="seaarchresultDivision" style={{ width: "16%" }}>
            Username
          </div>
          <div className="seaarchresultDivision" style={{ width: "16%" }}>
            Project
          </div>
          <div className="seaarchresultDivision" style={{ width: "16%" }}>
            Role
          </div>
          <div className="seaarchresultDivision" style={{ width: "16%" }}>
            {" "}
            Created By
          </div>
          <div className="seaarchresultDivision" style={{ width: "10%" }}></div>
        </div>
      );
    }
  };

  const handleClear = () => {
    setDataForDbProject({
      name: "",
      type: "",
      startdate: null,
      enddate: null,
      enterprise_id: userInfo.enterprise_id,
    });

    setDataForDepartment({
      name: "",
      description: "",
      createdBy: "",
      createdOn: null,
      project_id: project.project_id,
    });
    setDataForDbUser({
      firstname: "",
      lastname: "",
      username: "",
      role: "",
      createdBy: "",
      enterprise_id: userInfo.enterprise_id,
    });
  };

  const [dataForDbProject, setDataForDbProject] = useState({
    name: "",
    type: "",
    startdate: null,
    enddate: null,
    enterprise_id: userInfo.enterprise_id,
  });

  const [dataForDbDepartment, setDataForDepartment] = useState({
    name: "",
    description: "",
    createdBy: "",
    createdOn: null,
    project_id: project.project_id,
  });

  const [dataForDbUser, setDataForDbUser] = useState({
    firstname: "",
    lastname: "",
    username: "",
    role: "",
    createdBy: "",
    enterprise_id: userInfo.enterprise_id,
  });
  const handleProjectFilter = async () => {
    try {
      var res1 = await axios.post(
        url + "/Project/getEnterpriseProjectsFilter",
        dataForDbProject,

        {
          headers: { token: user.token },
        }
      );

      setProjectApiData(res1.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDepartementFilter = async () => {
    try {
      var res1 = await axios.post(
        url + "/Department/getProjectDepartmentsFilter",
        dataForDbDepartment,

        {
          headers: { token: user.token },
        }
      );

      setDepartmentApiData(res1.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleUserFilter = async () => {
    try {
      var res1 = await axios.post(
        url + "/Userinfo/getEnterpriseUsersFilter",
        dataForDbUser,

        {
          headers: { token: user.token },
        }
      );
      setUserApiData(res1.data);
    } catch (e) {
      console.log(e);
    }
  };
  const dynamicFilters = () => {
    if (selectedTab === 1) {
      return (
        <div
          className="d-flex flex-wrap align-items-center   w-100 ml-1"
          style={{ columnGap: "8px", rowGap: "8px", marginTop: "0em" }}
        >
          <div
            className="fadein"
            style={{
              animationDelay: "0.2s",
              width: 170,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={ProjectNameFilter}
              onChange={(e, option) => {
                setDataForDbProject({
                  ...dataForDbProject,
                  name: option,
                });
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Projects" />
              )}
            />
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 150,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={ProjectTypeFilter}
              sx={{ width: "100%" }}
              onChange={(e, option) => {
                setDataForDbProject({
                  ...dataForDbProject,
                  type: option,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Project Type" />
              )}
            />
          </div>

          <div
            className="fadein SRdatesize"
            style={{
              animationDelay: "0.3s",
              width: 130,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
              <DatePicker
                label="Start Date"
                size="small"
                value={dataForDbProject.startdate}
                sx={{ width: 130 }}
                onChange={(newValue) => {
                  setDataForDbProject({
                    ...dataForDbProject,
                    startdate: newValue,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

          <div
            className="fadein SRdatesize"
            style={{
              animationDelay: "0.35s",
              width: 130,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
              <DatePicker
                label="End Date"
                size="small"
                value={dataForDbProject.enddate}
                sx={{ width: 130 }}
                onChange={(newValue) => {
                  setDataForDbProject({
                    ...dataForDbProject,
                    enddate: newValue,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

          <div
            className="fadein"
            style={{
              marginRight: "5px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="info"
              sx={{ background: "var(--blue)" }}
              className="MUIButtonsize"
              onClick={handleProjectFilter}
              endIcon={<FontAwesomeIcon icon={faFilter} />}
            >
              APPLY
            </Button>
          </div>
          <div
            className="fadein"
            style={{
              marginRight: "10px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="info"
              onClick={handleFilterClearProject}
              className="MUIButtonsize"
              disabled={false}
              endIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              CLEAR
            </Button>
          </div>
        </div>
      );
    } else if (selectedTab === 2) {
      return (
        <div
          className="d-flex flex-wrap align-items-center  w-100 ml-1"
          style={{ columnGap: "8px", rowGap: "8px", marginTop: "0em" }}
        >
          <div
            className="fadein"
            style={{
              animationDelay: "0.2s",
              width: 160,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={DepartmentNameFilter}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
              onChange={(e, option) => {
                setDataForDepartment({
                  ...dataForDbDepartment,
                  name: option,
                });
              }}
            />
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 160,
            }}
          >
            <TextField
              id="description"
              label="Description"
              size="small"
              style={{
                width: "100%",
              }}
              onChange={(event) => {
                setDataForDepartment({
                  ...dataForDbDepartment,
                  description: event.target.value,
                });
              }}
            />
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 160,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={DepartmentCreatorFilter}
              sx={{ width: "100%" }}
              onChange={(e, option) => {
                setDataForDepartment({
                  ...dataForDbDepartment,
                  createdBy: option,
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Creater" />
              )}
            />
          </div>

          <div
            className="fadein SRdatesize"
            style={{
              animationDelay: "0.3s",
              width: 130,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns} className="">
              <DatePicker
                label="Created on"
                size="small"
                value={dataForDbDepartment.createdOn}
                sx={{ width: 130 }}
                onChange={(newValue) => {
                  setDataForDepartment({
                    ...dataForDbDepartment,
                    createdOn: newValue,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>

          <div
            className="fadein"
            style={{
              marginRight: "5px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="info"
              sx={{ background: "var(--blue)" }}
              className="MUIButtonsize"
              onClick={handleDepartementFilter}
              endIcon={<FontAwesomeIcon icon={faFilter} />}
            >
              APPLY
            </Button>
          </div>
          <div
            className="fadein"
            style={{
              marginRight: "10px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="info"
              className="MUIButtonsize"
              onClick={handleFilterClearDep}
              disabled={false}
              endIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              CLEAR
            </Button>
          </div>
        </div>
      );
    } else if (selectedTab === 3) {
      return (
        <div
          className="d-flex flex-wrap align-items-center  w-100 ml-1"
          style={{ columnGap: "8px", rowGap: "8px", marginTop: "0em" }}
        >
          <div
            className="fadein"
            style={{
              animationDelay: "0.2s",
              width: 130,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={firstNameFilter}
              sx={{ width: 130 }}
              renderInput={(params) => (
                <TextField {...params} label="First name" />
              )}
              onChange={(e, option) => {
                setDataForDbUser({ ...dataForDbUser, firstname: option });
              }}
            />
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 130,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={lastNameFilter}
              sx={{ width: 130 }}
              renderInput={(params) => (
                <TextField {...params} label="Last name" />
              )}
              onChange={(e, option) => {
                setDataForDbUser({ ...dataForDbUser, lastname: option });
              }}
            />
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 160,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={usernameFilter}
              sx={{ width: "100%" }}
              className="wordsplit"
              renderInput={(params) => (
                <TextField {...params} label="Username" className="wordsplit" />
              )}
              onChange={(e, option) => {
                setDataForDbUser({ ...dataForDbUser, username: option });
              }}
            />
          </div>
          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 160,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={userRole}
              sx={{ width: "100%" }}
              renderInput={(params) => <TextField {...params} label="Role" />}
              onChange={(e, option) => {
                setDataForDbUser({ ...dataForDbUser, role: option });
              }}
            />
          </div>

          <div
            className="fadein"
            style={{
              animationDelay: "0.25s",
              width: 130,
            }}
          >
            <Autocomplete
              disablePortal
              size="small"
              options={userCreatorFilter}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Creator" />
              )}
              onChange={(e, option) => {
                setDataForDbUser({ ...dataForDbUser, createdBy: option });
              }}
            />
          </div>

          <div
            className="fadein"
            style={{
              marginRight: "5px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="info"
              sx={{ background: "var(--blue)" }}
              className="MUIButtonsize"
              onClick={handleUserFilter}
              endIcon={<FontAwesomeIcon icon={faFilter} />}
            >
              APPLY
            </Button>
          </div>

          <div
            className="fadein"
            style={{
              marginRight: "10px",
              animationDelay: ".4s",
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
              width: "fit-content",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              color="info"
              className="MUIButtonsize"
              onClick={handleFilterClearUsers}
              disabled={false}
              endIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              CLEAR
            </Button>
          </div>
        </div>
      );
    }
  };

  const handlePageUrl = () => {
    if (selectedTab === 1) {
      return "/app/createProject";
    } else if (selectedTab === 2) {
      return "/app/createDepartment";
    } else if (selectedTab === 3) {
      return permisions.cancreateusersusers
        ? "/app/createUsers"
        : "/app/addUsersToProject";
    }
  };

  const checkCreatePermisions = () => {
    if (selectedTab === 1) {
      return permisions.cancreateprojectsprojects;
    } else if (selectedTab === 2) {
      return permisions.cancreatedepartmentsdepartments;
    } else if (selectedTab === 3) {
      return permisions.cancreateusersusers ||
        permisions.canadduserstoprojectusers
        ? true
        : false;
    }
  };
  return (
    <>
      <Helmet>
        <title>Admin | StonAi</title>
      </Helmet>

      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Modal open={open} onClose={handleClose}>
            <AddUser handleClose={handleClose} project={project} />
          </Modal>

          <div className="d-flex flex-wrap w-100">
            {AdminCardData.map((data) => {
              if (data.permisionsCheck) {
                return (
                  <AdminCard
                    id={data.id}
                    folderName={data.folderName}
                    image={data.image}
                    number={data.number}
                    sidebarColor={data.sidebarColor}
                    fadeDelay={data.fadeDelay}
                    selectedTab={selectedTab}
                    handleSelectedTab={handleSelectedTab}
                    pageUrl={data.pageUrl}
                  />
                );
              } else {
                return null;
              }
            })}
          </div>
          {isLoading ? (
            <>
              <br />
              <br />

              <Fade right>
                <div className="filtersContainer">
                  <Grid container direction="column" spacing={0.5}>
                    <Grid
                      container
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Grid
                        container
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Grid item xs style={{ flexGrow: "0" }}>
                          <TextField
                            id="searchbox"
                            label="Search"
                            type="search"
                            size="small"
                            style={{ width: "20rem" }}
                            className="searchbox "
                            onChange={(event) => {
                              setSearch(event.target.value);
                            }}
                          />
                        </Grid>
                        {/* <Grid item xs style={{ flexGrow: "0" }}>
                          <ButtonStyled
                            paddingInline=".8rem"
                            paddingBlock="0.3rem"
                            borderRadius="8px"
                            width="fit-content"
                            style={{ cursor: "pointer" }}
                            className={`${FiltersClicked
                              ? "FiltersClicked mx-1"
                              : "FiltersUnclicked mx-1"
                              }`}
                            onClick={(e) => {
                              setFiltersClicked(!FiltersClicked);
                            }}
                          >
                            Filters
                          </ButtonStyled>
                        </Grid> */}
                      </Grid>

                      {/* <Grid item>{FiltersClicked && dynamicFilters()}</Grid> */}

                      {checkCreatePermisions() ? (
                        <Grid
                          item
                          xs
                          style={{
                            position: "absolute",
                            marginLeft: "auto",
                            top: "0",
                            right: "0",
                            padding: "16px",
                          }}
                        >
                          <Fab
                            color="primary"
                            aria-label="add"
                            size="small"
                            style={{}}
                            onClick={() =>
                              navigate(handlePageUrl(), { replace: true })
                            }
                          >
                            <AddIcon />
                          </Fab>
                        </Grid>
                      ) : null}
                    </Grid>
                  </Grid>
                </div>
              </Fade>

              <div className="seaarchresultContainer">
                {DisplayLabel()}
                {CardToDisplayView()}
              </div>
            </>
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: "60%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AdminDashboard;
