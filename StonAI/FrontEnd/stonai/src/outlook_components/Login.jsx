import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Card, Grid, Container, Typography, Badge } from "@mui/material";
import { url } from "../url";
import { SignOutButton } from "../outlook_components/SignOutButton";
import WelcomeName from "../outlook_components/WelcomeName.jsx";
import MailIcon from "@mui/icons-material/Mail";
import Alert from "@mui/material/Alert";

export const Login = ({ userInfo, account }) => {
  return (
    <Card
      style={{
        padding: 10,
        margin: 10,
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Alert severity="warning" sx={{ margin: 20 }}>
        <Typography variant="body">
          You have logged in from unregisted account{" "}
          <strong> {account?.username} </strong>
          .The email account assosiated with your account is{" "}
          <strong>{userInfo?.email_address} </strong>. Please change your
          account from this account picker
          <span>
            <SignOutButton title="invalidAccount" />
          </span>
        </Typography>
      </Alert>
    </Card>
  );
};

export default Login;
