import React, { useEffect } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

const SignInSignOutButton = () => {
  const { instance } = useMsal();

  const { inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <SignOutButton />;
  } else if (
    // inProgress !== InteractionStatus.Startup &&
    // inProgress !== InteractionStatus.HandleRedirect
    !isAuthenticated
  ) {
    // if (window.confirm) {
    //   instance
    //     .loginPopup(loginRequest)
    //     .then(function (response) {
    //       // success response
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // } else {
    // }
    console.log("auth:::::", isAuthenticated);

    // inProgress check prevents sign-in button from being displayed briefly after returning from a redirect sign-in. Processing the server response takes a render cycle or two
    return <SignInButton />;
  } else {
    console.log("nullll");

    return null;
  }
};

export default SignInSignOutButton;
