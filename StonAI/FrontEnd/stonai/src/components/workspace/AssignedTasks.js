import React from "react";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Chat,
  Edit,
  DeleteForever,
} from "@mui/icons-material";
import {
  Collapse,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Box,
  IconButton,
  TableCell,
  Chip,
  Tooltip,
  MenuItem,
  Menu,
  Button,
  Modal,
  Typography, Tabs, Tab,
  Stack,
} from "@mui/material";
import ToolTip from "@mui/material/Tooltip";
import LoadingButton from '@mui/lab/LoadingButton';

import {
  faTimes,
  faCheck,
  faSpinner,
  faClock,
  faExclamationTriangle,
  faLessThanEqual,
} from "@fortawesome/free-solid-svg-icons";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarGroup from "@atlaskit/avatar-group";
import TextTruncate from 'react-text-truncate'; // recommend
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRef } from "react";
import { useState } from "react";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import "react-dropzone-uploader/dist/styles.css";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import Dropzone from "react-dropzone-uploader";
import axios from "axios";
import Docmodal from "./Attachments/Docmodal";
import { url } from "../../url";

var viewcount = 3;

const AttachmentModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75vw",
  bgcolor: "var(--background)",
  boxShadow: 24,
  height: "75vh",
  borderRadius: "8px !important",
  overflowY: "scroll",
};

const AssignedTasks = ({
  row,
  handleGroupOpen,
  remDuplicatesAssigned,
  checked,
  handleTaskDelete,
  handleTaskGroupDelete,
  toggleDrawerUpdate,
  handleCommentDrawerOpen,
  colorChange,
  filterUsers,
  search,
  handleClick,
  anchor,
  tasksAssigned,
  permisions,
  assignedTasks,
  project, userInfo, user,
  handleClickVariant,
  setAttachments


}) => {

  const [ViewTaskDetail, setViewTaskDetail] = useState(true)
  const [ViewCreationdate, setViewCreationdate] = useState(true)
  const [ViewAssignedTo, setViewAssignedTo] = useState(true)
  const [ViewDeadline, setViewDeadline] = useState(faLessThanEqual)
  const [ViewStatus, setViewStatus] = useState(faLessThanEqual)
  const [ViewCreatedBy, setViewCreatedBy] = useState(faLessThanEqual)
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [value, setValue] = React.useState("one");


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handledate = (sampledate) => {
    let date = new Date(sampledate)
    return ((date.getUTCDate().toString() + "-" + (date.getUTCMonth() + 1).toString() + "-" + date.getFullYear()).toString())

    // return( date.toString() )
  }

  const handleCheckboxes = (event, check) => {

    console.log(" ============== Entered ============== ")
    console.log(check)


    if (check === "viewTaskDetail") {
      setViewTaskDetail(!ViewTaskDetail)
      if (ViewTaskDetail === true)
        viewcount--
      else if (ViewTaskDetail === false)
        viewcount++
    }
    else if (check === "viewCreationdate") {
      setViewCreationdate(!ViewCreationdate)
      if (ViewCreationdate === true)
        viewcount--
      else if (ViewCreationdate === false)
        viewcount++
    }
    else if (check === "viewAssignedTo") {
      setViewAssignedTo(!ViewAssignedTo)
      if (ViewAssignedTo === true)
        viewcount--
      else if (ViewAssignedTo === false)
        viewcount++
    }
    else if (check === "ViewDeadline") {
      setViewDeadline(!ViewDeadline)
      if (ViewDeadline === true)
        viewcount--
      else if (ViewDeadline === false)
        viewcount++
    }
    else if (check === "viewStatus") {
      setViewStatus(!ViewStatus)
      if (ViewStatus === true)
        viewcount--
      else if (ViewStatus === false)
        viewcount++
    }
    else if (check === "viewUpdateby") {
      setViewCreatedBy(!ViewCreatedBy)
      if (ViewCreatedBy === true)
        viewcount--
      else if (ViewCreatedBy === false)
        viewcount++
    }

  };
  // =============== icon menu ======================

  const onFileChange = ({ meta, file }, status) => {
    console.log("filesCheck", file, status);

    if (status === "done") {
      let uploaded_files = files;
      uploaded_files.push(file);

      setFiles(uploaded_files);
    } else if (status === "removed") {
      const filtered_files = files.filter((item) => item.name !== file.name);
      setFiles(filtered_files);
    }
  };

  const fileParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };


  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        chosenFiles.forEach((element) => { });
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };

  const SelectedOption = useRef("")

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenuIcon = Boolean(anchorEl);
  const handleClickMenuIcon = (event, data) => {

    SelectedOption.current = data
    setAnchorEl(event.currentTarget);
    console.log("=============================")
    console.log("SelectedOption", SelectedOption.current)
    console.log("=============================")
    console.log(data)
  };
  const handleCloseMenuIcon = () => {
    setAnchorEl(null);
  };


  const handleAttachFiles = async (task_id) => {
    console.log("newCheckedDocs", files);
    setLoading(true);
    for (const file of files) {

      const res = await axios.post(url + "/Tasks/uploadAttachments", {
        task_id: task_id,
        project_id: project.project_id,
        name: file.name,
        type: file.type,
        size: file.size,
      }, { headers: { token: user.token } });
      console.log("res", res.data);

      const response = await axios(
        "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
        res.data + "task"
      );
      const uploadURL = response.data.uploadURL;

      var config = {
        headers: { "content-type": file.type },

      };
      await axios.put(uploadURL, file, config);
      setLoading(false);

      console.log("response", response);
    }



    handleClickVariant("success", "Files Attached Successfully")
    // for (const file of files) {

    // }
    // console.log("converted files", convertedFiles);
    setFiles([]);
    // setOpen(false);
  };

  return (
    <>
      <TableRow sx={{ "& > *": {} }} className="my-3 ">
        <TableCell className=" TableHeadderRow" style={{ cursor: "pointer" }}>
          {/* ============================================ cell icon */}
          <IconButton
            aria-label="expand row"
            size="small"
            className="tableIcon"
            style={{ background: row.group_color }}
            onClick={() => handleGroupOpen(row.group_id)}
          >
            {checked.indexOf(row.group_id) !== -1 ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
          <Heading1
            color="grey"
            paddingInline="10px"
            paddingBlock=""
            size="1.2rem"
            weight="500"
            JFcontent="left"
            marginBottom="0px"
            style={{
              fontWeight: !row.is_read ? "bolder" : "normal",
            }}
          >
            {row.group_name}
            <Chip
              label={
                remDuplicatesAssigned.filter((f) => f.group_id == row.group_id)
                  .length
              }
              color="info"
              size="small"
              style={{ marginLeft: "5px" }}
            />
          </Heading1>

          {permisions.canedittaskgroup ? (
            <div style={{ textAlign: "right" }}>
              <IconButton
                onClick={(event) =>
                  handleClick(event, row.group_name, row.group_color)
                }
              >
                <Edit style={{ color: "var(--green)" }} />
              </IconButton>
            </div>
          ) : null}

          {permisions.candeletetaskgroup ? (
            <div style={{ textAlign: "right" }}>
              {row.group_id == 210 ? null : (
                <div style={{ textAlign: "right" }}>
                  <IconButton
                    onClick={() => handleTaskGroupDelete(row.group_id)}
                  >
                    <DeleteForever style={{ color: "var(--warningRed)" }} />
                  </IconButton>
                </div>
              )}
            </div>
          ) : null}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            marginBottom: "10px",
          }}
          colSpan={6}
        >
          <Collapse
            in={checked.indexOf(row.group_id) !== -1 ? true : false}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1, paddingBottom: 5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow
                    className=""
                    style={{ borderLeft: "4px solid " + colorChange }}
                  >
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Task
                      </Heading1>
                    </td>
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Description
                      </Heading1>
                    </td>
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Creation Date
                      </Heading1>
                    </td>
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Assigned To
                      </Heading1>
                    </td>
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Deadline
                      </Heading1>
                    </td>
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Status
                      </Heading1>
                    </td>
                    <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="500"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Action Required
                      </Heading1>
                    </td>
                    {/* <td>
                      <Heading1
                        color="grey"
                        paddingInline="5px"
                        paddingBlock="5px"
                        size="14px"
                        weight="600"
                        JFcontent="left"
                        marginBottom="4px"
                      >
                        Creator
                      </Heading1>
                    </td> */}
                    <td></td>
                  </TableRow>
                </TableHead>
                <TableBody style={{ wordBreak: "break-all", position: "relative" }}>
                  {remDuplicatesAssigned
                    .filter((data) => {
                      if (search) {
                        return data.task_name
                          .toLowerCase()
                          .includes(search.toLowerCase());
                      } else {
                        return data;
                      }
                    })
                    .map((data, i) => {
                      if (data.group_id == row.group_id) {
                        return (
                          <>
                            <TableRow
                              key={i}
                              className="CellDivision2 tablerowHighlight w-100"
                              style={{ cursor: "pointer" }}
                              onClick={toggleDrawerUpdate(anchor,
                                true,
                                "Edit Task",
                                data.task_name,
                                data.action,
                                data.task_details,
                                data.task_deadline,
                                data.task_startdate,
                                data.task_id,
                                "assignedtask",
                                "Assigned Task",
                                tasksAssigned,
                                data.task_status,
                                data.is_created_from_email,
                                data.group_id

                              )}
                            >
                              <td
                                style={{
                                  borderLeft:
                                    "4px solid " + data.group_color + "",
                                  borderRadius: "8px 0px 0px 8px ",
                                  width: "25%",
                                  paddingLeft: "5px",
                                }}


                              >
                                {data?.task_name?.length > 42 ? (
                                  <Tooltip title={data.task_name} placement="top">
                                    <div>
                                      <TextTruncate
                                        line={1}
                                        element="span"
                                        truncateText="…"
                                        text={data.task_name}
                                        style={{ color: "grey" }}
                                      />
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <>{data.task_name} </>
                                )}
                              </td>

                              {/* Details */}
                              <td style={{ width: "25%" }} className="">

                                {data?.task_details?.length > 42 ? (
                                  <Tooltip title={data.task_details} placement="top">
                                    <div>
                                      <TextTruncate
                                        line={1}
                                        element="span"
                                        truncateText="…"
                                        text={data.task_details}
                                        style={{ color: "grey" }}
                                      />
                                    </div>
                                  </Tooltip>
                                ) : (
                                  <>{data.task_details} </>
                                )}

                              </td>

                              {/* creation date */}
                              <td style={{ width: "8%" }}>
                                <Heading1 className="tableCellText"
                                  size="13px !important"
                                  paddingBlock="0px !important"
                                  marginBottom="-2px !important"
                                  color="grey">
                                  {data.task_deadline?.substring(0, 10)}
                                </Heading1>
                              </td>

                              {/* assigned to */}
                              <td key={i} style={{ width: "10%" }}>
                                {filterUsers(data.task_id)}
                              </td>

                              {/* deadline */}
                              <td style={{ width: "8%" }}>
                                <Heading1 className="tableCellText"
                                  size="13px !important"
                                  paddingBlock="0px !important"
                                  marginBottom="-2px !important"
                                  color="grey">
                                  {/* {data.task_deadline?.substring(0, 10)} */}
                                  {data.task_deadline ? handledate(data.task_deadline?.substring(0, 10)) : null}

                                </Heading1>
                              </td>

                              {/* status */}
                              <td style={{ width: "5%" }}>
                                {data.task_status === "Canceled" ? (
                                  <Heading1
                                    className="d-flex justify-content-center align-items-center"
                                    width="100%"
                                    paddingBlock="0px !important"
                                    marginBottom="-2px !important"
                                    style={{
                                      color: "var(--warningRed)",
                                      fontWeight: "600"

                                    }}
                                  >
                                    <Tooltip title={data.task_status} placement="top">
                                      <div>
                                        <FontAwesomeIcon
                                          icon={faTimes}
                                          style={{
                                            color: "var(--warningRed)",
                                            marginRight: "10px",
                                          }}
                                        />
                                      </div>
                                    </Tooltip>
                                  </Heading1>
                                ) : null}



                                {data.task_status === "In Process" ? (
                                  <Heading1
                                    className="d-flex justify-content-center align-items-center"
                                    width="100%"
                                    paddingBlock="0px !important"
                                    marginBottom="-2px !important"
                                    style={{
                                      color: "var(--blue)",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <Tooltip title={data.task_status} placement="top">
                                      <div>
                                        <FontAwesomeIcon
                                          icon={faSpinner}
                                          style={{
                                            color: "var(--blue)",
                                            marginRight: "10px",
                                          }}
                                        />
                                      </div>
                                    </Tooltip>
                                  </Heading1>
                                ) : null}

                                {data.task_status === "Completed" ? (
                                  <Heading1
                                    className="d-flex justify-content-center align-items-center"
                                    width="100%"
                                    paddingBlock="0px !important"
                                    marginBottom="-2px !important"
                                    style={{
                                      color: "var(--green)",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <Tooltip title={data.task_status} placement="top">
                                      <div>
                                        <FontAwesomeIcon
                                          icon={faCheck}
                                          style={{
                                            color: "var(--green)",
                                            marginRight: "10px",
                                          }}
                                        />
                                      </div>
                                    </Tooltip>
                                  </Heading1>
                                ) : null}

                                {data.task_status === "Delayed" ? (
                                  <Heading1
                                    className="d-flex justify-content-center align-items-center"
                                    width="100%"
                                    paddingBlock="0px !important"
                                    marginBottom="-2px !important"
                                    style={{
                                      color: "var(--warningRed)",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <Tooltip title={data.task_status} placement="top">
                                      <div>
                                        <FontAwesomeIcon
                                          icon={faClock}
                                          style={{
                                            color: "var(--warningRed)",
                                            marginRight: "10px",
                                          }}
                                        />
                                      </div>
                                    </Tooltip>
                                  </Heading1>
                                ) : null}

                                {data.task_status != "Delayed" &&
                                  data.task_status != "Completed" &&
                                  data.task_status != "Canceled" &&
                                  data.task_status != "In Process" ? (
                                  <Heading1
                                    className="d-flex justify-content-center"
                                    style={{
                                      color: "var(--orange)",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <Tooltip title="Nil" placement="top">
                                      <div>
                                        <FontAwesomeIcon
                                          icon={faExclamationTriangle}
                                          style={{ marginRight: "10px" }}
                                        />
                                      </div>
                                    </Tooltip>
                                  </Heading1>
                                ) : null}
                              </td>

                              <td style={{ width: "12%" }}>
                                <Heading1 className="tableCellText"
                                  size="13px !important"
                                  paddingBlock="0px !important"
                                  marginBottom="-2px !important"
                                  color="grey">
                                  {data.action}
                                </Heading1>
                              </td>

                              {/* Created by */}
                              {/* <td key={i} style={{ width: "5%" }}>
                                {filterUsers(data.task_id)}
                              </td> */}


                            </TableRow>
                            <p style={{ width: "10px", position: "absolute", left: "94%", zIndex: "100", marginTop: "-45px", display: "flex" }}>
                              <div className="d-flex justify-content-end">

                                <div className="">
                                  <Button
                                    aria-controls={openMenuIcon ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openMenuIcon ? 'true' : undefined}

                                    onClick={(event) => {
                                      handleClickMenuIcon(event, data);
                                    }}

                                  >
                                    <MoreVertIcon />
                                  </Button>
                                  <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={openMenuIcon}
                                    onClose={handleCloseMenuIcon}
                                    MenuListProps={{
                                      'aria-labelledby': 'basic-button',
                                    }}
                                    className="ShadowFix"
                                  >
                                    {permisions.canedittaskworkspace ?
                                      <MenuItem onClick={handleCloseMenuIcon}>
                                        <div className=" w-100"
                                          onClick={toggleDrawerUpdate(anchor,
                                            true,
                                            "Edit Task",
                                            SelectedOption.current.task_name,
                                            SelectedOption.current.action,
                                            SelectedOption.current.task_details,
                                            SelectedOption.current.task_deadline,
                                            SelectedOption.current.task_startdate,
                                            SelectedOption.current.task_id,
                                            "assignedtask",
                                            "Assigned Task",
                                            tasksAssigned,
                                            SelectedOption.current.task_status,
                                            SelectedOption.current.is_created_from_email,
                                            SelectedOption.current.group_id,
                                          )}
                                        >
                                          <IconButton>
                                            <Edit style={{ color: "var(--green)" }} />
                                          </IconButton>
                                          EDIT
                                        </div>

                                      </MenuItem>
                                      : null}
                                    {permisions.candeletetaskworkspace ?

                                      <MenuItem onClick={handleCloseMenuIcon}>
                                        <div className=" w-100"
                                          onClick={() => handleTaskDelete(
                                            SelectedOption.current.task_id,
                                          )}
                                        >
                                          <IconButton>
                                            <DeleteForever
                                              style={{ color: "var(--warningRed)" }}
                                            />
                                          </IconButton>
                                          DELETE
                                        </div>

                                      </MenuItem>
                                      : null}

                                    <MenuItem onClick={handleCloseMenuIcon}>
                                      <div className=" w-100"

                                        onClick={() => handleCommentDrawerOpen(
                                          SelectedOption.current.task_id, SelectedOption.current.task_name,
                                          assignedTasks
                                        )}
                                      >
                                        <IconButton>
                                          <Chat color="primary" />
                                        </IconButton>
                                        TASK COMMENTS
                                      </div>

                                    </MenuItem>

                                    <MenuItem onClick={handleOpen}>
                                      <div className=" w-100"

                                      >
                                        <IconButton>
                                          <DriveFolderUploadIcon color="primary" />
                                        </IconButton>
                                        ATTACHMENTS
                                      </div>

                                    </MenuItem>


                                  </Menu>
                                </div>

                              </div>
                            </p>
                          </>
                        );
                      }
                    })}
                </TableBody>
              </Table>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              // styles={{ minHeight: 200, maxHeight: 250 }}
              >
                <Box sx={AttachmentModalStyle}>
                  <Box
                    sx={{
                      backgroundColor: "var(--blue)",
                      height: "50px",
                      p: 2,
                      fontWeight: "bolder",
                      display: "flex",
                      alignItems: "center",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                  >
                    <Typography variant="h4" sx={{ color: "white" }}>
                      Add Attachment to task
                    </Typography>

                  </Box>
                  <Tabs value={value} onChange={handleChange} centered>
                    <Tab label="Upload From System" value="one" />
                    <Tab label="Upload From StonAI" value="two" />
                  </Tabs>

                  <Box sx={{
                    marginTop: 2,
                    padding: 2
                  }}>

                    {value === "one" ?

                      <Box> <Dropzone
                        // onSubmit={onSubmit}
                        onChangeStatus={onFileChange}
                        getUploadParams={fileParams}
                        getFilesFromEvent={getFilesFromEvent}

                        styles={{

                          dropzone: {

                            height: "300px",
                            width: "100%",
                            border: "3px dashed black",
                            overflowY: "scroll",


                          }

                        }}


                      />
                        <Stack direction="row" spacing={2} sx={{ display: "flex", justifyContent: "flex-end", width: "100%", padding: 2 }}>

                          {/* <Button variant="contained" color="primary" onClick={() => handleAttachFiles(SelectedOption.current.task_id)}>
                            Attach files
                          </Button> */}

                          <LoadingButton loading={loading} variant="contained" color="primary" onClick={() => handleAttachFiles(SelectedOption.current.task_id)}>
                            Attach files
                          </LoadingButton>
                          <Button variant="contained" color="primary" onClick={handleClose}>
                            Close
                          </Button>


                        </Stack>
                      </Box> :

                      <Docmodal
                        docmodal={open}
                        handleClose={handleClose}
                        project={project}
                        userInfo={userInfo}
                        user={user}
                        files={files}
                        setFiles={setFiles}
                        permisions={permisions}
                        value={value}
                        task_id={SelectedOption.current.task_id}
                        loading={loading}
                        setLoading={setLoading}
                        handleClickVariant={handleClickVariant}
                      // stonAiAttachments={stonAiAttachments}
                      // setStonAiAttachments={setStonAiAttachments}
                      />
                    }


                  </Box>

                </Box>
              </Modal>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};




export default AssignedTasks;
