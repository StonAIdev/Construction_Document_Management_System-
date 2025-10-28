import { Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import MainLayout from "./components/MainLayout";
import Account from "./pages/Account";
import CustomerList from "./pages/CustomerList";
import Dashboard from "./pages/Dashboard";
import Workspace from "./pages/Workspace";
import Login from "./pages/Login";
import Forget from "./pages/Forget";
import Recover from "./pages/Recover";

import Landing from "./pages/Landing";
import RegisterEnterprise from "./pages/RegisterEnterprise";
import Mails from "./pages/Mails";
import Documents from "./pages/Documents";
import DocumentActions from "./pages/DocumentActions";
import NotFound from "./pages/NotFound";
import PrepareShopDrawingForm from "./components/shopDrawing/prepareShopDrawing/PrepareShopDrawingForm";
import AddUser from "./components/admin/AddUser";
import CreateUser from "./pages/CreateUser";
import PrepareCoverForm from "./pages/CoverPageForm";
import CoverPageShopDrawingSubmittal from "./pages/CoverPageShopDrawingSubmittal";
import CoverPageMaterialSubmittal from "./pages/CoverPageMaterialSubmittal";
import CoverPagesiteInstruction from "./pages/CoverPagesiteInstruction";
import CoverPageMeterialInspectionRequest from "./pages/CoverPageMeterialInspectionRequest";
import CoverPageTechnicalSubmittal from "./pages/CoverPageTechnicalSubmittal";
import CoverPageMethodStatementSubmittal from "./pages/CoverPageMethodStatementSubmittal";
import CoverPageNonConformanceReport from "./pages/CoverPageNonConformanceReport";
import CoverPagePrequalificationSubmittal from "./pages/CoverPagePrequalificationSubmittal";
import CoverPageRequestforInformation from "./pages/CoverPageRequestforInformation";
import CoverPageWorkInspectionRequest from "./pages/CoverPageWorkInspectionRequest";
import CoverPageArchitecturalInspectionRequest from "./pages/CoverPageArchitecturalInspectionRequest";

// import ProductList from './pages/ProductList';

import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import Folder from "./components/Folders/Folder";
import Financials from "./pages/Financials";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProject from "./pages/CreateProject";
import CreateDepartment from "./pages/CreateDepartment";
import Home from "./outlook_components/Home.jsx";
import PDFView from "./components/shopDrawing/prepareShopDrawing/PDFView";
import AddUserToCurrentProject from "./pages/AddUserToCurrentProject";
import ProjectEntities from "./pages/ProjectEntities";

import PrepareMaterialDrawingForm from "./components/shopDrawing/prepareShopDrawing/PrepareMaterialDrawingForm";
import Aboutus from "./pages/Aboutus";
import AddSubcontractor from "./components/ProjectEntities/AddSubcontractor";

const routes = (
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
  setCurrentComp,
  currentComp,
  check,
  setCheck,
  pca,
  extractedFeilds,
  setExtractedFeilds,
  docUrl,
  setDocUrl,
  showViewer,
  setShowViewer,
  tabValue,
  setTabValue,
  department,
  setDepartment,
  userPosition,
  setUserPosition,
  category,
  setCategory
) => [
  {
    path: "app",
    element: user?.token ? (
      <DashboardLayout
        permisions={permisions}
        setPermissions={setPermissions}
        socket={socket}
        setSocket={setSocket}
        user={user}
        setUser={setUser}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        project={project}
        setProject={setProject}
        currentComp={category}
        setCurrentComp={setCategory}
        setCheck={setCheck}
        check={check}
        extractedFeilds={extractedFeilds}
        setExtractedFeilds={setExtractedFeilds}
        docUrl={docUrl}
        setDocUrl={setDocUrl}
        showViewer={showViewer}
        setShowViewer={setShowViewer}
        tabValue={tabValue}
        setTabValue={setTabValue}
        department={department}
        setDepartment={setDepartment}
        userPosition={userPosition}
        setUserPosition={setUserPosition}
      />
    ) : (
      <Navigate to="/landing" />
    ),
    children: [
      {
        path: "account",
        element: permisions?.canviewpageaccount ? (
          <Account
            userInfo={userInfo}
            user={user}
            project={project}
            permisions={permisions}
          />
        ) : null,
      },
      {
        path: "search",
        element: permisions?.canviewpageaisearch ? (
          <Search
            user={user}
            permisions={permisions}
            project={project}
            department={department}
            userPosition={userPosition}
            socket={socket}
            setSocket={setSocket}
            userInfo={userInfo}
            currentComp={currentComp}
            setCurrentComp={setCurrentComp}
            check={check}
            setCheck={setCheck}
            pca={pca}
            extractedFeilds={extractedFeilds}
            setExtractedFeilds={setExtractedFeilds}
            docUrl={docUrl}
            setDocUrl={setDocUrl}
            showViewer={showViewer}
            setShowViewer={setShowViewer}
            tabValue={tabValue}
            setTabValue={setTabValue}
          />
        ) : null,
      },
      {
        path: "DrawingForm",
        element: (
          <PrepareShopDrawingForm
            user={user}
            permisions={permisions}
            project={project}
            userPosition={userPosition}
          />
        ),
      },

      {
        path: "MaterialDrawingForm",
        element: (
          <PrepareMaterialDrawingForm
            user={user}
            permisions={permisions}
            project={project}
            userPosition={userPosition}
          />
        ),
      },

      {
        path: "mails/*",
        element: permisions?.canviewpagemail ? (
          <Home
            pca={pca}
            user={user}
            userInfo={userInfo}
            project={project}
            permisions={permisions}
            title="routes"
            department={department}
          />
        ) : null,
      },

      {
        path: "folder",
        element: permisions?.canviewpagefolder ? (
          <Folder
            socket={socket}
            setSocket={setSocket}
            user={user}
            userInfo={userInfo}
            project={project}
            currentComp={currentComp}
            setCurrentComp={setCurrentComp}
            check={check}
            setCheck={setCheck}
            pca={pca}
            extractedFeilds={extractedFeilds}
            setExtractedFeilds={setExtractedFeilds}
            docUrl={docUrl}
            setDocUrl={setDocUrl}
            showViewer={showViewer}
            setShowViewer={setShowViewer}
            tabValue={tabValue}
            setTabValue={setTabValue}
            permisions={permisions}
            userPosition={userPosition}
            category={category}
            setCategory={setCategory}
            department={department}
          />
        ) : null,
      },
      {
        path: "projectEntities",
        element: (
          <ProjectEntities
            user={user}
            userInfo={userInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      // {
      //   path: "financials",
      //   element: (
      //     <Financials
      //       user={user}
      //       userInfo={userInfo}
      //       permisions={permisions}
      //       project={project}

      //     />
      //   ),
      // },
      {
        path: "addsubcontractor",
        element: (
          <AddSubcontractor
            user={user}
            userInfo={userInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },

      {
        path: "prepareShopDrawingForm",
        element: (
          <PrepareShopDrawingForm
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "dashboard",
        element: (
          <Dashboard
            user={user}
            permisions={permisions}
            project={project}
            userInfo={userInfo}
            department={department}
            userPosition={userPosition}
          />
        ),
      },

      {
        path: "coverPageForm",
        element: (
          <PrepareCoverForm
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageShopDrawingSubmittal",
        element: (
          <CoverPageShopDrawingSubmittal
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageMaterialSubmittal",
        element: (
          <CoverPageMaterialSubmittal
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPagesiteInstruction",
        element: (
          <CoverPagesiteInstruction
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageMeterialInspectionRequest",
        element: (
          <CoverPageMeterialInspectionRequest
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageTechnicalSubmittal",
        element: (
          <CoverPageTechnicalSubmittal
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageMethodStatementSubmittal",
        element: (
          <CoverPageMethodStatementSubmittal
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageNonConformanceReport",
        element: (
          <CoverPageNonConformanceReport
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPagePrequalificationSubmittal",
        element: (
          <CoverPagePrequalificationSubmittal
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageRequestforInformation",
        element: (
          <CoverPageRequestforInformation
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageWorkInspectionRequest",
        element: (
          <CoverPageWorkInspectionRequest
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },
      {
        path: "coverPageArchitecturalInspectionRequest",
        element: (
          <CoverPageArchitecturalInspectionRequest
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
            project={project}
          />
        ),
      },

      {
        path: "addUsersToProject",
        element: permisions?.canadduserstoprojectusers ? (
          <AddUserToCurrentProject
            user={user}
            userInfo={userInfo}
            permisions={permisions}
            project={project}
          />
        ) : null,
      },

      {
        path: "createProject",
        element: permisions?.cancreateprojectsprojects ? (
          <CreateProject
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            permisions={permisions}
          />
        ) : null,
      },
      {
        path: "createUsers",
        element: permisions?.cancreateusersusers ? (
          <CreateUser
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            project={project}
            permisions={permisions}
          />
        ) : null,
      },
      {
        path: "createDepartment",
        element: permisions?.cancreatedepartmentsdepartments ? (
          <CreateDepartment
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            project={project}
            setProject={setProject}
            permisions={permisions}
          />
        ) : null,
      },

      {
        path: "workspace",
        element: permisions?.canviewpageworkspace ? (
          <Workspace
            permisions={permisions}
            user={user}
            userInfo={userInfo}
            project={project}
            pca={pca}
            socket={socket}
            setSocket={setSocket}
            department={department}
            userPosition={userPosition}
          />
        ) : null,
      },
      {
        path: "adminDashboard",
        element: permisions?.canviewpageadmin ? (
          <AdminDashboard
            user={user}
            setUser={setUser}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            project={project}
            setProject={setProject}
            permisions={permisions}
            department={department}
          />
        ) : null,
      },
      // {
      //   path: "settings",
      //   element: permisions?.canviewpagesetting ? (
      //     <Settings permisions={permisions} />
      //   ) : null,
      // },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
  {
    path: "/",
    element: !user?.token ? <MainLayout /> : <Navigate to="/app/folder" />,
    children: [
      { path: "landing", element: <Landing /> },
      { path: "login", element: <Login setUser={setUser} /> },
      { path: "forget", element: <Forget setUser={setUser} /> },
      { path: "reset", element: <Recover setUser={setUser} /> },
      { path: "registerEnterprise", element: <RegisterEnterprise /> },
      { path: "register", element: <Register /> },
      { path: "404", element: <NotFound /> },
      { path: "/", element: <Navigate to="/app/folder" /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
