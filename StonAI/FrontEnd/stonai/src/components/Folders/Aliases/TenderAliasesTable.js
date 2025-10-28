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
  tenderaddendumsaliases_id,
  questionNumber,
  question,
  answer,
  editMode
) {
  return {
    id,
    tenderaddendumsaliases_id,
    questionNumber,
    question,
    answer,
    editMode,
  };
}

export default function TenderAliasesTable({
  user,
  userInfo,
  project,
  permisions,
}) {
  const [tableRows, setTableRows] = useState([]);
  const [editRow, setEditRow] = useState({
    questionNumber: "",
    question: "",
    answer: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const handleEdit = (values, index) => {
    setEditRow({
      tenderaddendumsaliases_id: values.tenderaddendumsaliases_id,
      questionNumber: values.questionNumber,
      question: values.question,
      answer: values.answer,
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
    //console.log("values", values);
    if (!values.tenderaddendumsaliases_id) {
      try {
        var res = await axios.post(
          url + "/Alias/AddTenderAliases",
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
        setEditRow({ questionNumber: "", question: "", answer: "" });
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        var res = await axios.post(
          url + "/Alias/UpdateTenderAliases",
          {
            row: editRow,
            project_id: project.project_id,
            user_id: user.user_id,
            enterprise_id: userInfo.enterprise_id,
            tenderaddendumsaliases_id: values.tenderaddendumsaliases_id,
          },
          {
            headers: { token: user.token },
          }
        );
        setEditRow({ questionNumber: "", question: "", answer: "" });
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
        editRow.questionNumber === "" ||
        editRow.question === "" ||
        editRow.answer === ""
      ) {
        throw new "You can not keep fields empty"();
      } else {
        let newArr = [...tableRows];
        newArr[index] = createData(
          index,
          values.tenderaddendumsaliases_id,
          editRow.questionNumber,
          editRow.question,
          editRow.answer,
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
    setEditRow({ questionNumber: "", question: "", answer: "" });
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
      //console.log("values123", values);
      try {
        var res = await axios.post(
          url + "/Alias/DeleteTenderAliases",
          {
            tenderaddendumsaliases_id: values.tenderaddendumsaliases_id,
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
        url + "/Alias/getTenderAliases",
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
            element.tenderaddendumsaliases_id,
            element.questionnumber,
            element.question,
            element.answer,
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
    //console.log("tableRows", tableRows);
    getAliases();
  }, []);
  return (
    <div className="">
      <Button
        variant="contained"
        onClick={handleAddAliases}
        style={{ float: "right", marginBottom: "10px" }}
      >
        Add Aliases
      </Button>

      {!isLoading ? (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="simple table"
            style={{ borderRadius: "8px" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    Question Number
                  </Heading1>
                </TableCell>

                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    Question
                  </Heading1>
                </TableCell>

                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    Answer
                  </Heading1>
                </TableCell>

                <TableCell>
                  <Heading1
                    color="grey"
                    weight="600"
                    siz3="1.5em"
                    JFcontent="left"
                  >
                    {" "}
                  </Heading1>
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
                          name="questionNumber"
                          value={editRow.questionNumber}
                          onChange={onChangeHandler}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell align="right">
                        {" "}
                        <TextField
                          hiddenLabel
                          id="filled-hidden-label-normal"
                          name="question"
                          value={editRow.question}
                          onChange={onChangeHandler}
                          variant="filled"
                        />
                      </TableCell>

                      <TableCell align="right">
                        {" "}
                        <TextField
                          hiddenLabel
                          id="filled-hidden-label-normal"
                          name="answer"
                          value={editRow.answer}
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
                        {row.questionNumber}
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
                        {row.question}
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
                        {row.answer}
                      </TableCell>
                      <TableCell align="right" className="p-0">
                        <div
                          className="d-flex justify-content-center"
                          style={{ columnGap: ".5em" }}
                        >
                          {permisions.canupdatealiasestender ? (
                            <EditIcon
                              style={{ color: "var(--green)" }}
                              onClick={() => handleEdit(row, index)}
                            />
                          ) : null}
                          {permisions.candeletedocumenttender ? (
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
