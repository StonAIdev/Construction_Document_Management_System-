import {
    Box,
    Grid,
    Container,
    Button,
    TextField,
    Typography
  } from '@material-ui/core';
import { Formik } from 'formik';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import axios from 'axios'; 
import {url} from '../../../url';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
 
  function getStyles(name, department, theme) {
    return {
      fontWeight:
      department.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
const AddShopDrawingList =  ({onsubmitDrawingList,handleDrawingListChange,handleClose,user}) =>{

    return(
        <>
        <Container 
        sx={style}
        >
          <Formik
            initialValues={{
                drawing_number: '',
                discription: '',
                status: '',
                remarks: ''
            }}

            onSubmit={async(values)=>{
                onsubmitDrawingList(values);
                handleClose();
          }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid container item xs={12}>
                        <Typography
                            color="textPrimary"
                            variant="h2"
                        >
                            Add ShopDrawing
                        </Typography>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12}>
                                <TextField
                                error={Boolean(touched.drawing_number && errors.drawing_number)}
                                required
                                id="outlined-required"
                                fullWidth
                                helperText={touched.drawing_number && errors.drawing_number}
                                label="drawing_number"
                                margin="normal"
                                name="drawing_number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.drawing_number}
                                />    
                            </Grid>   
                            <Grid item xs={12}>
                                <TextField
                                error={Boolean(touched.discription && errors.discription)}
                                required
                                id="outlined-required"
                                fullWidth
                                helperText={touched.discription && errors.discription}
                                label="discription"
                                margin="normal"
                                name="discription"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.discription}
                                />    
                            </Grid> 
                            <Grid item xs={12}>
                                <TextField
                                error={Boolean(touched.status && errors.status)}
                                required
                                id="outlined-required"
                                fullWidth
                                helperText={touched.status && errors.status}
                                label="status"
                                margin="normal"
                                name="status"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.status}
                                />    
                            </Grid> 
                            <Grid item xs={12}>
                                <TextField
                                error={Boolean(touched.remarks && errors.remarks)}
                                required
                                id="outlined-required"
                                fullWidth
                                helperText={touched.remarks && errors.remarks}
                                label="remarks"
                                margin="normal"
                                name="remarks"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.remarks}
                                />    
                            </Grid>           
                            
                        <Box sx={{ py: 2 }}>
                            <Button
                                color="primary"
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                type="submit"
                                onClick={handleSubmit}
                                variant="contained"
                            >
                                Add
                            </Button>
                        </Box>
                        </Grid>
                    </Grid>

                  


                </Box>

                


              </form>
            )}
          </Formik>
        </Container>
        </>
    );
}
export default AddShopDrawingList;