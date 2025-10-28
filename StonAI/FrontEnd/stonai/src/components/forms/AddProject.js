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
import {url} from '../../url';

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
const AddProject =  ({setProject,project,handleClose,user,departmentsList,renderProject,setRenderProject}) =>{
    console.log("departmentsList",departmentsList)
    const project1 = {};
    const theme = useTheme();
    const [department, setDepartment] = React.useState([]);
    const handleChanges = (event) => {
      const {
        target: { value },
      } = event;
      setDepartment(
        // On autofill we get a the stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };
    const addProjectToDept = async(project1) =>{
      try {
        const response = await axios.post(url+'/Project/registerProjectsWithDepartment',project1,{ headers:{'token':user.token}});
        console.log("ProjectName",project1);
        return response.data
      } catch (error) {
        console.log(error.response); 
        return error.response;
      }
    }
    return(
        <>
        <Container 
        sx={style}
        >
          <Formik
            initialValues={{
              project_name: '',
              department_name: []
            }}

            onSubmit={async(values)=>{
              try {
                // setProject({
                //   "project_name": values.project_name,
                //   'department_name': department
                // })
                project1.project_name=values.project_name;
                project1.department_name=department;
                const res = await addProjectToDept(project1);
                if(renderProject==1){
                  setRenderProject(0)
                }else{
                  setRenderProject(1)
                }
                handleClose();
              } catch (error) {
                console.log(error); 
              }
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
                            Create Project
                        </Typography>
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid item xs={12}>
                                <TextField
                                error={Boolean(touched.project_name && errors.project_name)}
                                required
                                id="outlined-required"
                                fullWidth
                                helperText={touched.project_name && errors.project_name}
                                label="Project Name"
                                margin="normal"
                                name="project_name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.project_name}
                                />    
                            </Grid>             
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-multiple-chip-label">Department</InputLabel>
                                        <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={department}
                                        onChange={handleChanges}
                                        input={<OutlinedInput id="select-multiple-chip" label="Department" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            
                                            {selected.map((value) => (
                                                <Chip key={value.department_name} label={value.department_name} />
                                            ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                        >
                                        {departmentsList.map((name) => (
                                            <MenuItem
                                            key={name.department_name}
                                            value={name}
                                            style={getStyles(name.department_name, department, theme)}
                                            >
                                            {name.department_name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                </FormControl>                                  
                            </Grid>                
                        </Grid>
                        <Grid  item xs={12}>
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
                                Create
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
export default AddProject;