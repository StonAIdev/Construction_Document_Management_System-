import React, { useEffect, useState, useRef } from "react";
import {
    MenuItem,
    InputLabel,
    FormControl,
    Select,
} from "@mui/material";

export default function RowPerPage({pageSize,handlePageSizeChange}){

    return(
        <FormControl sx={{ m: 1, maxWidth: 100 }} size="small">
        <InputLabel id="demo-select-small">Page Size</InputLabel>
        <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={pageSize}
        label="Page Size"
        name="pageSizeValue"
        onChange={(event,pageSizeValue)=>handlePageSizeChange(event,pageSizeValue)}
        >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        </Select>
        </FormControl>
    );
}