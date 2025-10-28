import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {Chip,Box} from "@mui/material";
import axios from 'axios';
import { url } from "../../../url";
import { PublishedWithChangesSharp } from '@mui/icons-material';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function TagsFilter({
    project,user,value,setFieldValue
}) {
    const [options, setOptions] = React.useState([]);
    const loading = options.length === 0;
    const [open,setOpen] = React.useState(false);
    const [values,setValues] = React.useState({
        Tags:[]
    });
    const onChangeHandler2 = (e, tag, name) => {
        setFieldValue('Tags', tag)
        setValues({
            ...values,
            [name]: tag,
        });
    };
    const getDistinctTags= async()=>{
      console.log("user",user);
      console.log("projecg",project);
        try {
            console.log("This rana");
            var res = await axios.post(
            url + "/tags/getDistinctTags",
            {
                project_id: project.project_id,
            },
            {
                headers: { token: user.token },
            }
            );
            console.log("response122",res)
            var list = [];
            res.data.map((value)=>{
              list.push(value.key)
            })
            console.log("list",list)
            setOptions([...list])
        } catch (e) {
            console.log("error123",e);
        }
    }

  React.useEffect(() => {
  }, [open]);

  return (
    <div
    className="fadein"
    style={{
      marginRight: "10px",
      animationDelay: ".5s",
    }}
  >
    <Box className="filterWidth">
    <Autocomplete
    multiple
    options={options}
    className="fadein"
    size="small"
    multiline
    minRows="1"
    open={open}
    onOpen={() => {
      getDistinctTags();
      setOpen(true);
    }}
    onClose={() => {
      setOpen(false);
    }}
    onChange={(event, newValue) => {
      onChangeHandler2(event, newValue, "Tags");
    }}
    freeSolo
    value={values.Tags}
    loading={loading}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip variant="outlined" title={option} label={option} {...getTagProps({ index })}/>
      ))
    }
    renderInput={(params) => (
      <TextField
        {...params}
        id="Tags"
        name="Tags"
        label="Tags"
      />
    )}
  />
  </Box>
  </div>
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
    "Red","Blue","Green"
];
const props = ["Orange"];