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
  Paper,
  TableHead,
  CircularProgress,
  IconButton,
  Drawer,
  Box,
  Grid,
  TextField
} from '@mui/material';
import { styled, useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { DeleteForever, Edit } from '@mui/icons-material';
import axios from 'axios';
// components
import Page from '../../../components/Page';

import { url } from '../../../url';
import Iconify from '../../../components/Iconify';

export default function ManageEnterprise({ openNewEnterprise }) {
  const [enterprise, setEnterprise] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = React.useState(false);

  const [enterpriseName, setEnterpriseName] = useState();
  const [country, setCountry] = useState();
  const [city, setCity] = useState();
  const [contact, setContact] = useState();

  const [enterpriseId, setEnterpriseId] = useState();

  const selectedProject = useRef([]);

  const theme = useTheme();


  const searchbarVal = useSelector(
    state => state.searchbar.value
  );



  const toggleDrawer = (anchor, open, row) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setEnterpriseName(row.enterprise_name);
    setCountry(row.enterprise_location);
    setCity(row.city);
    setContact(row.contactnumber)
    setEnterpriseId(row.enterprise_id)
    setOpen(open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {

      const response = await axios.post(
        `${url}/AdminAppProject/updateEnterprise`,
        {
          name: enterpriseName,
          city,
          country,
          contact,
          enterprise_id: enterpriseId
        }
      );
      setLoading(false)


    }

    catch (e) {

      console.log(e);
    }
  }

  const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  }));

  const list = (anchor) => (
    <Box
      sx={{ width: 500, padding: 2 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Grid container spacing={1}>

        <Grid item xs={12}>

          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ fontSize: 20 }} color="text.secondary">
            Update Enterprise
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Enterpise Name"
            margin="normal"
            name="enterprise_name"
            value={enterpriseName}
            onChange={
              (event) => {
                setEnterpriseName(event.target.value)
              }
            }
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Country"
            margin="normal"
            name="enterprise_country"
            value={country}
            onChange={
              (event) => {
                setCountry(event.target.value)
              }
            }
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="City"
            margin="normal"
            name="enterprise_city"
            value={city}
            onChange={
              (event) => {
                setCity(event.target.value)
              }
            }
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Contact number"
            margin="normal"
            value={contact}
            onChange={
              (event) => {
                setContact(event.target.value)
              }
            }
            name="contact_number"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ py: 2 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={handleUpdate}

              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Update Enterprise
            </Button>
          </Box>
        </Grid>
      </Grid>

    </Box>
  );

  const handleDelete = async (eid) => {
    if (window.confirm('Are you sure do you want to delete this enterprise')) {
      try {
        const response = await axios.post(`${url}/AdminAppProject/deleteEnterprise`, {
          eid
        });
        setLoading(false);

      } catch (error) {
        console.log(error);
      }
    }
  };

  const getEnterprises = async () => {
    try {
      const res1 = await axios.get(`${url}/AdminAppProject/getAllEnterprise`);
      console.log('project dasd', res1);
      setEnterprise(res1.data);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEnterprises();
  }, [loading]);
  // Manage enterprise

  return (
    <Page title="Enterprise | Minimal-UI">

      <Drawer
        anchor='right'
        open={open}
        onClose={toggleDrawer('right', false)}
      >
        {list('right')}
      </Drawer>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Enterprise
          </Typography>
          <Button
            variant="contained"
            onClick={openNewEnterprise}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create New Enterprise
          </Button>
        </Stack>

        {loading ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Enterprise</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enterprise.filter(
                  (f) =>
                    f?.enterprise_name
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase()) ||
                    f?.enterprise_location
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase()) ||
                    f?.city
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase()) ||
                    f?.contactnumber
                      ?.toLowerCase()
                      .includes(searchbarVal.toLowerCase())).map((row, i) => (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            {row.enterprise_name}
                          </TableCell>
                          <TableCell>{row.enterprise_location}</TableCell>
                          <TableCell>{row.city}</TableCell>

                          <TableCell>{row.contactnumber}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleDelete(row.enterprise_id)}
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
