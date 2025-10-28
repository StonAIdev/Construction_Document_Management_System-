// ----------------------------------------------------------------------
import React from 'react';
// material
import { Container, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
// components
import Page from '../components/Page';

import ManageProject from '../sections/@dashboard/projects/ManageProject';
import CreateNewProject from '../sections/@dashboard/projects/CreateNewProject';
// Top Panel

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}
export default function Projects() {
  // Top Panel
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Page title="Projects | Stonai">
      <Container>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Manage Project" {...a11yProps(0)} />
            <Tab label="Create Project" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <ManageProject openNewEnterprise={(event) => handleChange(event, 1)} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CreateNewProject />
        </TabPanel>
      </Container>
    </Page>
  );
}
