import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { url } from "../../../url";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function createData(
  id,
  responsibilitymatrixaliases_id,
  serialnumber,
  activity,
  remarks,
  editMode
) {
  return {
    id,
    responsibilitymatrixaliases_id,
    serialnumber,
    activity,
    remarks,
    editMode,
  };
}

export default function ResponsibilityMatrixAliasesTable({
  user,
  userInfo,
  project,
  permisions,
}) {
  const [tableRows, setTableRows] = useState([]);
  const [editRow, setEditRow] = useState({
    serialnumber: "",
    activity: "",
    remarks: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const handleEdit = (values, index) => {
    setEditRow({
      responsibilitymatrixaliases_id: values.responsibilitymatrixaliases_id,
      serialnumber: values.serialnumber,
      activity: values.activity,
      remarks: values.remarks,
    });
    let newArr = tableRows.map((v) => {
      if (v.editMode) {
        return Object.assign(v, { editMode: false });
      }
    });
    newArr = [...tableRows];
    newArr[index] = { ...values, editMode: true };
    setTableRows(newArr);
  };
  const handleAddAliasesToDb = async (values) => {
    setIsloading(true);
    if (!values.responsibilitymatrixaliases_id) {
      try {
        var res = await axios.post(
          url + "/Alias/AddReMatAliases",
          {
            row: editRow,
            project_id: project.project_id,
            user_id: user.user_id,
            enterprise_id: userInfo.enterprise_id,
          },
          {
            headers: { token: user.token },
          }
        );
        setEditRow({ serialnumber: "", activity: "", remarks: "" });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Alias/UpdateReMatAliases",
          {
            row: editRow,
            project_id: project.project_id,
            user_id: user.user_id,
            enterprise_id: userInfo.enterprise_id,
            responsibilitymatrixaliases_id:
              values.responsibilitymatrixaliases_id,
          },
          {
            headers: { token: user.token },
          }
        );
        setEditRow({ serialnumber: "", activity: "", remarks: "" });
      } catch (e) {
        console.log(e);
      }
    }
    setIsloading(false);
  };
  const handleSave = async (values, index) => {
    setIsloading(true);
    try {
      if (
        editRow.serialnumber === "" ||
        editRow.activity === "" ||
        editRow.remarks === ""
      ) {
        throw new "You can not keep fields empty"();
      } else {
        let newArr = [...tableRows];
        newArr[index] = createData(
          index,
          values.responsibilitymatrixaliases_id,
          editRow.serialnumber,
          editRow.activity,
          editRow.remarks,
          false
        );
        setTableRows(newArr);
        await handleAddAliasesToDb(values);
        await getAliases();
      }
    } catch (error) {
      alert("The Aliases can not be empty!");
    }

    setIsloading(false);
  };
  const handleAddAliases = () => {
    setEditRow({ serialnumber: "", activity: "", remarks: "" });
    let newArr = tableRows.map((v) => {
      if (v.editMode) {
        return Object.assign(v, { editMode: false });
      }
    });
    newArr = [...tableRows];
    newArr.push(createData(tableRows.length + 1, null, "", "", "", true));
    setTableRows(newArr);
    // handleEdit(createData(tableRows.length+1, "", "", "",true));
  };
  const handleDelete = async (values, index) => {
    if (window.confirm("Are you sure you want to delete it?")) {
      setIsloading(true);
      try {
        var res = await axios.post(
          url + "/Alias/DeleteReMatAliases",
          {
            responsibilitymatrixaliases_id:
              values.responsibilitymatrixaliases_id,
          },
          {
            headers: { token: user.token },
          }
        );
        await getAliases();
        setIsloading(false);
      } catch (e) {
        console.log(e);
      }
    } else {
    }
  };
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setEditRow({ ...editRow, [name]: value });
  };
  const getAliases = async () => {
    setIsloading(true);
    try {
      var res = await axios.post(
        url + "/Alias/getReMatAliases",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      let newArr = [];
      res.data.forEach((element, index) => {
        newArr.push(
          createData(
            index,
            element.responsibilitymatrixaliases_id,
            element.serialnumber,
            element.activity,
            element.remarks,
            false
          )
        );
      });

      setTableRows(newArr);
    } catch (e) {
      console.log(e);
    }
    setIsloading(false);
  };
  useEffect(() => {
    getAliases();
  }, []);
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleAddAliases}
        style={{ float: "right", marginBottom: "10px" }}
      >
        Add Aliases
      </Button>

      {!isLoading ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    Serial Number
                  </Heading1>
                </TableCell>

                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    Activity
                  </Heading1>
                </TableCell>

                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    Remarks
                  </Heading1>
                </TableCell>

                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  ></Heading1>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((row, index) => {
                if (row.editMode) {
                  return (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        {" "}
                        <TextField
                          hiddenLabel
                          id="filled-hidden-label-normal"
                          name="serialnumber"
                          value={editRow.serialnumber}
                          onChange={onChangeHandler}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell align="right">
                        {" "}
                        <TextField
                          hiddenLabel
                          id="filled-hidden-label-normal"
                          name="activity"
                          value={editRow.activity}
                          onChange={onChangeHandler}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell align="right">
                        {" "}
                        <TextField
                          hiddenLabel
                          id="filled-hidden-label-normal"
                          name="remarks"
                          value={editRow.remarks}
                          onChange={onChangeHandler}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Button
                          aria-label="edit"
                          onClick={() => handleSave(row, index)}
                        >
                          Save
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        style={{
                          fontSize: "1.1em",
                          width: "30%",
                          wordBreak: "break-all",
                          color: "grey",
                        }}
                      >
                        {row.serialnumber}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "1.1em",
                          width: "30%",
                          wordBreak: "break-all",
                          color: "grey",
                        }}
                        align="left"
                      >
                        {row.activity}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "1.1em",
                          width: "30%",
                          wordBreak: "break-all",
                          color: "grey",
                        }}
                        align="left"
                      >
                        {row.remarks}
                      </TableCell>
                      <TableCell align="right" className="p-0">
                        <div
                          className="d-flex justify-content-center"
                          style={{ columnGap: ".5em" }}
                        >
                          {permisions.canupdatealiasesresponsibilitymatrix ? (
                            <EditIcon
                              style={{ color: "var(--green)" }}
                              onClick={() => handleEdit(row, index)}
                            />
                          ) : null}

                          {permisions.candeletedocumentresponsibilitymatrix ? (
                            <DeleteForeverIcon
                              style={{ color: "var(--warningRed)" }}
                              onClick={() => handleDelete(row, index)}
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            position: "relative",
            // backgroundColor: "blue",
            height: "100%",
            width: "100%",
            transform: "translate(50%,500%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}
