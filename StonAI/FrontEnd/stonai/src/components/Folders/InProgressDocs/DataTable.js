import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  IconButton,
} from "@mui/material";
import { FileDownload, DeleteForever } from "@mui/icons-material";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function DenseTable({ files }) {
  const onDownload = (url) => {
    const link = document.createElement("a");
    link.download = `download.txt`;
    link.href = url;
    link.click();
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bolder" }}>File Names</TableCell>
            <TableCell align="center" style={{ fontWeight: "bolder" }}>
              Document's State
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {file?.document_name}
              </TableCell>
              <TableCell align="center">{file?.status}</TableCell>
              <TableCell align="right">
                <IconButton
                  edge="end"
                  aria-label="download"
                  onClick={() => onDownload(file?.urls)}
                >
                  <FileDownload />
                </IconButton>
                <IconButton>
                  <DeleteForever />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
