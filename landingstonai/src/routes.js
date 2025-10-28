import React from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Aboutus from "./pages/Aboutus";
import Privacy from "./pages/Privacy";

const routes = () => [
  {
    path: "app",
    element: false ? <MainLayout /> : <Navigate to="/landing" />,
  },
  {
    path: "/",
    element: true ? <MainLayout /> : <Navigate to="landing" />,
    children: [
      { path: "landing", element: <Landing /> },
      { path: "404", element: <NotFound /> },
      { path: "/", element: <Navigate to="/landing" /> },
      { path: "*", element: <Navigate to="/404" /> },

      { path: "AboutusPage", element: <Aboutus /> },
      { path: "Legal", element: <Privacy /> },
    ],
  },
];

export default routes;
