import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DocumentDatePicker({ value, setValue }) {
  return (
    <Box sx={{ backgroundColor: "white" }}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        sx={{ minWidth: 120, backgroundColor: "white" }}
      >
        <DatePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
}
