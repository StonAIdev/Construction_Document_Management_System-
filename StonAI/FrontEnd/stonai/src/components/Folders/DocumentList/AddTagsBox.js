import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from "@mui/material/Chip";
import axios from 'axios';
import { url } from "../../../url";
import { PublishedWithChangesSharp } from '@mui/icons-material';
import moment from "moment";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function AddTagsBox({
  project, user, file, setFiles, files, department
}) {
  const [options, setOptions] = React.useState([]);
  const loading = options.length === 0;
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    Tags: file?.tags4
  });



  const updateKPI = async (totalTime) => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");

    console.log("today_date", today_date, url, department, project, user);
    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          searchType: "Tags",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: 1000
        },
        { headers: { token: user.token } }
      );
      console.log("on submit search: ", response.data);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const pushTags = async (tags) => {
    console.log("user123", user);
    console.log("project123", project);
    updateKPI();
    try {
      var res = await axios.post(
        url + "/tags/updateTags",
        {
          tags: tags,
          document_id: file.document_id
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (e) {
      console.log("error123", e);
    }
  }
  const onChangeHandler2 = (e, value, name) => {
    console.log("Hnadler2")
    console.log("value", e, value, name)
    console.log("innerfile", files)
    file.tags4 = value;
    var tempfile = files
    tempfile.map(obj => {
      if (file.document_id === obj.document_id)
        return file;
      else
        return obj;
    });
    setFiles(tempfile);
    setValues({
      ...values,
      [name]: value,
    });
    pushTags(value);
  };
  const getDistinctTags = async () => {
    console.log("user", user);
    console.log("projecg", project);
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
      console.log("response122", res)
      var list = [];
      res.data.map((value) => {
        list.push(value.key)
      })
      console.log("list", list)
      setOptions([...list])
    } catch (e) {
      console.log("error123", e);
    }
  }

  React.useEffect(() => {
  }, [open]);

  return (
    <Autocomplete
      multiple
      options={options}
      className="DocExtractionTextField"
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
          <Chip variant="outlined" title={option} label={option} {...getTagProps({ index })} />
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
  );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  "Red", "Blue", "Green"
];
const props = ["Orange"];