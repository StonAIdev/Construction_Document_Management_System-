import React, { useState, useEffect } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PageLayout } from "./PageLayout";
import { Inbox } from "./Inbox";
import { Sent } from "./Sent";
import CreateEmail from "./CreateEmail";

import { Routes, Route, useLocation } from "react-router-dom";
import { Logout } from "./Logout";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Typography from "@material-ui/core/Typography";
import { Junk } from "./Junk";

import { CustomNavigationClient } from "../utils/NavigationClient";

function Home({ pca, user, project, userInfo, department, permisions }) {
  const isAuthenticated = useIsAuthenticated();

  // useEffect(() => {
  //   console.log("sadas", isAuthenticated);

  //   if (!isAuthenticated) {
  //     // window.location.reload();
  //     console.log(isAuthenticated);
  //   }
  // }, []);
  console.log("props:", userInfo);
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const history = useLocation();
  const navigationClient = new CustomNavigationClient(history);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <Pages
        user={user}
        pca={pca}
        project={project}
        userInfo={userInfo}
        department={department}
        permisions={permisions}

      />
    </MsalProvider>
  );
}

function Pages({ user, pca, project, userInfo, department, permisions }) {
  return (
    <Routes>
      <Route path="/logout" element={<Logout />} />
      <Route
        path="/inbox"
        element={
          <Inbox
            user={user}
            title="inbox"
            project={project}
            userInfo={userInfo}
            department={department}
            permisions={permisions}
          />
        }
      />
      <Route
        path="/sent"
        element={
          <Sent
            user={user}
            title="sent"
            project={project}
            userInfo={userInfo}
            department={department}
            permisions={permisions}
          />
        }
      />
      <Route
        path="/junk"
        element={
          <Junk
            user={user}
            title="junk"
            project={project}
            userInfo={userInfo}
            department={department}
            permisions={permisions}
          />
        }
      />
      <Route
        path="/create"
        element={
          <CreateEmail
            user={user}
            pca={pca}
            project={project}
            userInfo={userInfo}
            department={department}
            permisions={permisions}
          />
        }
      />

      {/* <UnauthenticatedTemplate>
        {console.log("unauth")}
        <Typography variant="h6">
          <center>Please sign-in to see your profile information.</center>
        </Typography>
      </UnauthenticatedTemplate> */}
    </Routes>
  );
}

export default Home;
