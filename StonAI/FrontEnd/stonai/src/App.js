import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import GlobalStyles from "./components/GlobalStyles";
import "./mixins/chartjs";
import theme from "./theme";
import routes from "./routes";
import React, { useState, useEffect } from "react";
import useUserToken from "./components/useUserToken";
import { SnackbarProvider } from "notistack";

import useProject from "./components/useProject";
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import "./App.css";
import { TreeContext } from "./context/TreeContext";

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const App = () => {
  const [userInfo, setUserInfo] = useState({
    enterprise_name: "",
    user_id: null,
    enterprise_id: null,
    projects: [],
    email_address: null,
  });

  //Socket state
  const [socket, setSocket] = useState(null);

  ////File Upload part
  const [currentComp, setCurrentComp] = useState("");
  const [check, setCheck] = useState(false);

  ////File Viewer part
  const [extractedFeilds, setExtractedFeilds] = useState({});
  const [docUrl, setDocUrl] = useState();
  const [showViewer, setShowViewer] = useState(false);
  const [tabValue, setTabValue] = useState("one");
  const [permisions, setPermissions] = useState({});
  const [department, setDepartment] = useState();
  const { project, setProject } = useProject();
  const { user, setUser } = useUserToken();
  const [category, setCategory] = useState("");

  const [userPosition, setUserPosition] = useState("");

  const routing = useRoutes(
    routes(
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
      msalInstance,
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
    )
  );
  useEffect(() => {}, [project]);
  const [treeContext, setTreeContext] = React.useState([]);
  return (
    <ThemeProvider theme={theme}>
      <TreeContext.Provider value={{ treeContext, setTreeContext }}>
        <SnackbarProvider maxSnack={3}>
          <GlobalStyles />
          {routing}
        </SnackbarProvider>
      </TreeContext.Provider>
    </ThemeProvider>
  );
};

export default App;
