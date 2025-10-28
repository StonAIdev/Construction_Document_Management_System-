import React from "react";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Chat,
  Edit,
  DeleteForever,
  Done,
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
} from "@mui/material";
import ToolTip from "@mui/material/Tooltip";

import {
  faTimes,
  faCheck,
  faSpinner,
  faClock,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AvatarGroup from "@atlaskit/avatar-group";
import TextTruncate from 'react-text-truncate'; // recommend
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Popover } from "@mui/material";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";

const DraftedTasks = ({
  row,
  handleGroupOpen,
  remDuplicatesDrafted,
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
  userPosition,
  handleTaskApproval,
  filterUsersDrafted,
  tasksAssigned,
  assignedTasks
}) => {

  // =============== icon menu ======================
  const SelectedOption = useRef("")

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenuIcon = Boolean(anchorEl);
  const handleClickMenuIcon = (event, data) => {
    SelectedOption.current = data
    setAnchorEl(event.currentTarget);
    console.log("=============================")
    console.log("SelectedOption", SelectedOption.current)
    console.log("=============================")
  };
  const handleCloseMenuIcon = () => {
    setAnchorEl(null);
  };

  // ============= POP over =======================

  // const [SelectedOption, setSelectedOption] = useState()


  const PopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'simple-popover' : undefined;




  return (
    <>
      <TableRow sx={{ "& > *": {} }} className="my-3">
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
                remDuplicatesDrafted.filter((f) => f.group_id === row.group_id)
                  .length
              }
              color="info"
              size="small"
              style={{ marginLeft: "5px" }}
            />
          </Heading1>

          {row.group_id == 183 ? null : (
            <div style={{ textAlign: "right" }}>
              <IconButton
                onClick={(event) =>
                  handleClick(event, row.group_name, row.group_color)
                }
              >
                <Edit style={{ color: "var(--green)" }} />
              </IconButton>
            </div>
          )}

          <div style={{ textAlign: "right" }}>
            {row.group_id == 210 ? null : (
              <div style={{ textAlign: "right" }}>
                <IconButton onClick={() => handleTaskGroupDelete(row.group_id)}>
                  <DeleteForever style={{ color: "var(--warningRed)" }} />
                </IconButton>
              </div>
            )}
          </div>
        </TableCell>
      </TableRow>
      <TableRow >
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
                    <td></td>
                  </TableRow>
                </TableHead>
                <TableBody style={{ wordBreak: "break-all", position: "relative" }}>
                  {remDuplicatesDrafted.map((data, i) => {
                    if (data.group_id === row.group_id) {
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
                                borderLeft: "4px solid " + data.group_color + "",
                                borderRadius: "8px 0px 0px 8px ",
                                width: "25%",
                                paddingLeft: "5px"
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

                            <td style={{ width: "25%" }}>

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

                            <td key={i} style={{ width: "10%" }}>
                              {filterUsersDrafted(data.task_id)}
                            </td>

                            <td style={{ width: "11%" }}>
                              <Heading1 className="tableCellText" color="grey">
                                {data.task_deadline?.substring(0, 10)}
                              </Heading1>
                            </td>

                            <td style={{ width: "5%" }}>
                              {data.task_status === "Canceled" ? (
                                <Heading1
                                  className="d-flex justify-content-center"
                                  width="100%"
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
                                  className="d-flex justify-content-center"
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
                                  className="d-flex justify-content-center"
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
                                  className="d-flex justify-content-center"
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

                            <td style={{ width: "10%" }}>
                              {/* DO NOT REMOVE */}
                            </td>

                          </TableRow>
                          <p style={{ width: "10px", position: "absolute", left: "90%", zIndex: "100", marginTop: "-45px", display: "flex" }}>
                            <div className="d-flex justify-content-end">

                              <ToolTip title="Approve Task" placement="top">
                                <div>
                                  <IconButton
                                    onClick={() => handleTaskApproval(data.task_id)}
                                    disabled={
                                      userPosition === "Head of Department"
                                        ? false
                                        : true
                                    }
                                  >
                                    <Done />
                                  </IconButton>
                                </div>
                              </ToolTip>


                              <div className=" ">
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
                                  {/* <MenuItem onClick={handleCloseMenuIcon}>
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
                                      )}
                                    >
                                      <IconButton>
                                        <Edit style={{ color: "var(--green)" }} />
                                      </IconButton>
                                      EDIT
                                    </div>

                                  </MenuItem> */}

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
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default DraftedTasks;
