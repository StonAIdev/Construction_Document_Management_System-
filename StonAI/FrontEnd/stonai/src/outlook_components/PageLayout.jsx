// import Typography from "@material-ui/core/Typography";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

import { useIsAuthenticated, useMsal } from "@azure/msal-react";
export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();
  console.log("starreddsadasdasdasda", isAuthenticated);

  return (
    <>
      <NavBar />

      {props.children}
    </>
  );
};
