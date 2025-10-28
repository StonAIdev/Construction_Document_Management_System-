import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./components/GlobalStyles";
import theme from "./theme";
import routes from "./routes";
import React from "react";
// eslint-disable-next-line
import { SnackbarProvider, useSnackbar } from "notistack";

import "./App.css";

const App = () => {
  const routing = useRoutes(routes());
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <GlobalStyles />
        {routing}
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
