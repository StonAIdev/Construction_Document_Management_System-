import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { experimentalStyled } from "@material-ui/core";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { CircularProgress, Box, Container } from "@mui/material";
import axios from "axios";
import { url, SocketUrl } from "../url";
import Upload from "./Folders/Upload/Upload";
import { io } from "socket.io-client";
import { Search, Workspaces } from "@material-ui/icons";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Mail,
  Send,
  File,
  Lock as LockIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Folder,
} from "react-feather";

const DashboardLayoutRoot = experimentalStyled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: "flex",
  height: "100%",
  overflow: "hidden",
  width: "100%",
}));

const DashboardLayoutWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
  paddingTop: 64,
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 256,
  },
}));

const DashboardLayoutContainer = experimentalStyled("div")({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",
});

const DashboardLayoutContent = experimentalStyled("div")({
  flex: "1 1 auto",
  height: "100%",
  overflow: "auto",
});

const DashboardLayout = ({
  permisions,
  setPermissions,
  socket,
  setSocket,
  user,
  setUser,
  userInfo,
  setUserInfo,
  project,
  setProject,
  currentComp,
  setCurrentComp,
  setCheck,
  check,
  extractedFeilds,
  setExtractedFeilds,
  docUrl,
  setDocUrl,
  showViewer,
  setShowViewer,
  tabValue,
  setTabValue,
  setDepartment,
  department,
  userPosition,
  setUserPosition,
}) => {
  const location = useLocation();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const getUserPermissions = async () => {
    try {
      const response = await axios.post(
        url + "/Userinfo/getUserPermissions",
        { user, project },
        {
          headers: { token: user.token },
        }
      );

      setPermissions(response.data[0]);

      const tempItems = [];

      tempItems.push({
        href: "/app/dashboard",
        icon: BarChartIcon,
        title: "Dashboard",
      });
      //   if (response.data[0].canviewpagedashboard) {

      // }
      if (response.data[0].canviewpageworkspace) {
        tempItems.push({
          href: "/app/workspace",
          icon: Workspaces,
          title: "Workspace",
        });
      }

      if (response.data[0].canviewpageaisearch) {
        tempItems.push({
          href: "/app/search",
          icon: Search,
          title: "Intelligent Search",
        });
      }
      if (response.data[0].canviewpagemail) {
        tempItems.push({
          href: "/app/mails",
          icon: Mail,
          title: "Mails",
        });
      }
      if (response.data[0].canviewpagefolder) {
        tempItems.push({
          href: "/app/folder",
          icon: Folder,
          title: "Documents",
        });
      }
      // tempItems.push({
      //   href: "/app/financials",
      //   icon: PaymentIcon,
      //   title: "Financials",
      // });
      // if (response.data[0].canviewpagesetting) {
      //   tempItems.push({
      //     href: "/app/settings",
      //     icon: SettingsIcon,
      //     title: "Settings",
      //   });
      // }
      if (response.data[0].canviewpageadmin) {
        tempItems.push({
          href: "/app/adminDashboard",
          icon: AdminPanelSettingsIcon,
          title: "Admin",
        });
      }
      tempItems.push({
        href: "/app/projectEntities",
        icon: AccountTreeIcon,
        title: "Project Entities",
      });
      tempItems.push({
        href: "/app/projectEntities",
        icon: ArchitectureIcon,
        title: "Auto Cad",
      });

      setItems(tempItems);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const VerifyToken = async () => {
    try {
      const response = await axios.post(url + "/Auth/verify", user, {
        headers: { token: user.token },
      });
      if (!response.data) {
        setUser(null);
        localStorage.clear();
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const getDepartment = async (user_id) => {
    try {
      const response = await axios.post(
        url + "/Department/getCurrentDep",
        { user_id: user_id, project_id: project.project_id },
        {
          headers: { token: user.token },
        }
      );
      if (response.data.length === 1) {
        setDepartment(response.data[0]);
      } else if (response.data.length > 1) {
        setDepartment(response.data);
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const getUserInfo = async () => {
    try {
      const response = await axios.post(
        url + "/Userinfo/getUserinfo",
        { user_id: user.user_id },
        {
          headers: { token: user.token },
        }
      );
      const userInfor = response.data;
      const projects1 = [];
      userInfor.forEach((project) => {
        projects1.push({
          project_name: project.project_name,
          project_id: project.project_id,
          project_admin: project.project_admin,
        });
      });
      const profilePic = await getProfilePicFromS3(response.data[0].user_id);

      await setUserInfo({
        enterprise_name: response.data[0].enterprise_name,
        enterprise_id: response.data[0].enterprise_id,
        user_id: response.data[0].user_id,
        username: response.data[0].username,
        projects: projects1,
        email_address: response.data[0].email_address,
        firstname: response.data[0].firstname,
        lastname: response.data[0].lastname,
        country: response.data[0].country,
        phone_number: response.data[0].phone_number,
        state: response.data[0].state,
        profile_pic: profilePic,
      });

      if (!project) {
        await setProject({
          project_name: response.data[0].project_name,
          project_id: response.data[0].project_id,
          project_admin: response.data[0].project_admin,
        });
      }
      if (!department) {
        await getDepartment(response.data[0].user_id);
      }

      await getUserPermissions();

      // setUserInfo()
    } catch (error) {
      console.log(error);
      return error.response;
    }
  };

  const getProfilePicFromS3 = async () => {
    try {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          user.user_id
      );

      const fileUrl = response.data.uploadURL;
      return fileUrl;
    } catch (error) {
      console.log(error.response);
    }
  };
  const settingUserPosition = async () => {
    if (project != undefined && department != undefined) {
      if (
        project.project_admin != null &&
        project.project_admin == user.user_id
      ) {
        setUserPosition("Project Manager");
      } else if (
        department.head_of_department != null &&
        department.head_of_department == user.user_id
      ) {
        setUserPosition("Head of Department");
      } else {
        setUserPosition("Engineer");
      }
    }
  };
  async function getTokenAndUserInfo() {
    await VerifyToken();
    await getUserInfo();
    await settingUserPosition();
    setIsLoading(true);
  }
  useEffect(() => {
    setSocket(io(SocketUrl));
  }, []);

  useEffect(() => {
    getTokenAndUserInfo();
  }, [
    userInfo.enterprise_name,
    location,
    user,
    project,
    department,
    userPosition,
  ]);

  useEffect(() => {
    socket?.emit("newUser", user);
    console.log("socketChange", socket);
  }, [socket, user]);

  return (
    <>
      {isLoading ? (
        <DashboardLayoutRoot>
          <DashboardNavbar
            onMobileNavOpen={() => setMobileNavOpen(true)}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            project={project}
            setProject={setProject}
            socket={socket}
            user={user}
            extractedFeilds={extractedFeilds}
            setExtractedFeilds={setExtractedFeilds}
            docUrl={docUrl}
            setDocUrl={setDocUrl}
            showViewer={showViewer}
            setShowViewer={setShowViewer}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />

          <DashboardSidebar
            user={user}
            setUser={setUser}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            project={project}
            setProject={setProject}
            onMobileClose={() => setMobileNavOpen(false)}
            openMobile={isMobileNavOpen}
            socket={socket}
            extractedFeilds={extractedFeilds}
            setExtractedFeilds={setExtractedFeilds}
            docUrl={docUrl}
            setDocUrl={setDocUrl}
            showViewer={showViewer}
            setShowViewer={setShowViewer}
            tabValue={tabValue}
            setTabValue={setTabValue}
            permisions={permisions}
            items={items}
            department={department}
            setDepartment={setDepartment}
          />

          {permisions.canuplaoddocumentsdocument ? (
            <Upload
              user={user}
              project={project}
              location={location}
              currentComp={currentComp}
              setCurrentComp={setCurrentComp}
              setCheck={setCheck}
              check={check}
              userPosition={userPosition}
              permisions={permisions}
              department={department}
            />
          ) : null}
          <DashboardLayoutWrapper>
            <DashboardLayoutContainer>
              <DashboardLayoutContent>
                <Outlet />
              </DashboardLayoutContent>
            </DashboardLayoutContainer>
          </DashboardLayoutWrapper>
        </DashboardLayoutRoot>
      ) : (
        <Container
          maxWidth="sm"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box>
            <CircularProgress />
          </Box>
        </Container>
      )}
    </>
  );
};

export default DashboardLayout;
