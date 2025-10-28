import React, { useState } from "react";
import TenderAliasesTable from "./TenderAliasesTable";
import ResponsibilityMatrixAliasesTable from "./ResponsibilityMatrixAliasesTable";
import { Box, Container, Grid } from "@material-ui/core";
import { Tabs, Tab } from "@mui/material";

export default function Aliases({ user, userInfo, project, permisions }) {
  const [tabValue, setTabValue] = useState("one");
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const renderSwitch = (param) => {
    switch (param) {
      case "one":
        return (
          <TenderAliasesTable
            user={user}
            userInfo={userInfo}
            project={project}
            permisions={permisions}
          />
        );
      case "two":
        return (
          <ResponsibilityMatrixAliasesTable
            user={user}
            userInfo={userInfo}
            project={project}
            permisions={permisions}
          />
        );
      default:
        return (
          <TenderAliasesTable
            user={user}
            userInfo={userInfo}
            project={project}
          />
        );
    }
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
          minHeight: "100%",
          py: 3,
          marginBottom: "3rem",
        }}
      >
        <Grid container direction="column" rowSpacing={2}>
          <Grid container item>
            <Grid item md={6}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="secondary tabs example"
              >
                <Tab value="one" label="Tender Addendum" />
                <Tab value="two" label="Responsibility Matrix" />
              </Tabs>
            </Grid>
          </Grid>
          <Grid item>
            <Container maxWidth={false}>{renderSwitch(tabValue)}</Container>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
