import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TableHead,
  Paper,
  CircularProgress,
  IconButton,
  Drawer,
  Box,
  Grid,
  TextField
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { DeleteForever, Edit } from '@mui/icons-material';

import { url } from '../../../url';

// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';

import ProjectDrawer from "./ProjectEditDrawer";

export default function ManageEnterprise({ openNewEnterprise }) {
  // Manage enterprise
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = useState(false);
  const selectedProject = useRef([]);


  const searchbarVal = useSelector(
    state => state.searchbar.value
  );




  const getProjects = async () => {
    try {
      const res1 = await axios.get(`${url}/AdminAppProject/getAllProjects`);
      console.log('project dasd', res1);
      setProjects(res1.data);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProjects();
  }, [loading]);



  const handleDelete = async (project_id) => {

    setLoading(false);

    if (window.confirm('Are you sure do you want to delete this Project')) {

      try {
        const response = await axios.post(`${url}/AdminAppProject/deleteProject`, {
          project_id: project_id
        });
        setLoading(false);

        console.log("response on dealted", response)


      } catch (error) {
        console.log(error);
      }
    }
  };

  const toggleDrawer = (anchor, open, project) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    // sl(project);
    selectedProject.current = project

    setOpen(open);
  };



  return (
    <Page title="Project | StonAi Admin">

      {open ?

        <ProjectDrawer
          openDrawer={open}
          setOpenDrawer={setOpen}
          refresh={refresh}
          setRefresh={setRefresh}
          setLoading={setLoading}

          proj={selectedProject.current}

        />
        : null
      }
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Project
          </Typography>
          <Button
            variant="contained"
            onClick={openNewEnterprise}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create New Project
          </Button>
        </Stack>

        {loading ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Project name</TableCell>
                  <TableCell align="right">Project Type</TableCell>
                  <TableCell align="right">Project Admin</TableCell>
                  <TableCell align="right">Enterprise Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.filter(
                  (f) =>
                    f?.project_name
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase()) ||
                    f?.project_type
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase()) ||
                    f?.username
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase()) ||
                    f?.enterprise_name
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase())
                ).map((row, i) => (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {row.project_name}
                    </TableCell>
                    <TableCell align="right">{row?.project_type}</TableCell>
                    <TableCell align="right">{row?.username}</TableCell>
                    <TableCell align="right">{row?.enterprise_name}</TableCell>
                    {/* <TableCell align="right">{row.start_date?.substring(0, 10)}</TableCell>
                    <TableCell align="right">{row.end_date?.substring(0, 10)}</TableCell> */}
                    <TableCell>
                      <IconButton onClick={() => handleDelete(row.project_id)}
                      >
                        <DeleteForever
                          color="error"
                        />
                      </IconButton>
                      <IconButton onClick={toggleDrawer('right', true, row)}>
                        <Edit color="primary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <CircularProgress />
        )}
      </Container>
    </Page>
  );
}
