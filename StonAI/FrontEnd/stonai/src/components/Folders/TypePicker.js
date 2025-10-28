import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function TypePicker({ type, setType }) {
  const handleChange = (event) => {
    setType(event.target.value);
  };
  return (
    <Box sx={{ minWidth: 120, backgroundColor: "white" }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">All types</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="allTypes">All types</MenuItem>
          <MenuItem value="pdf">Pdf</MenuItem>
          <MenuItem value="docx">Docx</MenuItem>
          <MenuItem value="jpeg">Image</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
