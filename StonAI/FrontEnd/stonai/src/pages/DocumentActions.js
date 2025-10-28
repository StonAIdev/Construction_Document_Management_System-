import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
  ButtonBase
} from '@material-ui/core';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import AddUser from '../components/admin/AddUser';

const DocumentActions = ({user, setUser, userInfo, setUserInfo, project, setProject}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);



  return (
    <>
      <Helmet>
        <title>Documents Actions | StonAi</title>
      </Helmet>
      <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
      >
        <Container maxWidth={false}>
            <Grid
                container
                spacing={3}
            >
                <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
                >
                    <Card sx={{ maxWidth: "sm" }}>
                      <ButtonBase
                      onClick={() => navigate('/app/prepareShopDrawingForm', { replace: true })}>
                        <CardContent>
                            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                            Prepare Cover Page for Shop Drawing 
                            </Typography>
            
                        </CardContent>
                      </ButtonBase>

                    </Card>
                </Grid>  
                <Grid
                item
                lg={3}
                sm={6}
                xl={3}
                xs={12}
                >
                    <Card sx={{ maxWidth: "sm" }}>
                      <ButtonBase
                      onClick={() => navigate('/app/prepareShopDrawingForm', { replace: true })}>
                        <CardContent>
                            <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                            Prepare Cover Page for Material Approval 
                            </Typography>
            
                        </CardContent>
                      </ButtonBase>

                    </Card>
                </Grid>  
                
            </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DocumentActions;
