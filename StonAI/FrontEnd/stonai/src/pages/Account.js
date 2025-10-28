import { Helmet } from "react-helmet";
import { Box, Container, Grid } from "@material-ui/core";
import AccountProfile from "../components/account/AccountProfile";
import AccountProfileDetails from "../components/account/AccountProfileDetails";
import AccountPassword from "../components/account/AccountPassword";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Account = ({ user, userInfo, project }) => {
  console.log("user", user, "userInfo", userInfo, "project", project);

  const [ProfileEdit, setProfileEdit] = useState(true);
  const [changePassword, setChangePassword] = useState(true);

  const [values, setValues] = useState({
    user_id: userInfo.user_id,
    firstName: userInfo.firstname,
    lastName: userInfo.lastname,
    phone: userInfo.phone_number,
    country: userInfo.country,
    image: userInfo.profile_pic,
  });
  return (
    <>
      <Helmet>
        <title>Account</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          width: "100%",
          py: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid
              item
              width="100%"
            // lg={4}
            // md={6}
            // xs={12}
            >
              <AccountProfile
                values={values}
                ProfileEdit={ProfileEdit}
                setProfileEdit={setProfileEdit}
                user={user}
                setChangePassword={setChangePassword}
                changePassword={changePassword}
              />
            </Grid>
            <Grid
              item
            // lg={8}
            // md={6}
            // xs={12}
            >
              <AccountProfileDetails
                values={values}
                setValues={setValues}
                ProfileEdit={ProfileEdit}
                setProfileEdit={setProfileEdit}
                user={user}
              />
            </Grid>

            <Grid
              item
            // lg={8}
            // md={6}
            // xs={12}
            >
              <AccountPassword
                values={values}
                setValues={setValues}
                ProfileEdit={changePassword}
                setChangePasswordPage={setChangePassword}
                setProfileEdit={setProfileEdit}

                user={user}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Account;
