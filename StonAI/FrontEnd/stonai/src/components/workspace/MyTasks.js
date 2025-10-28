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
  Button,
  Menu,
} from "@mui/material";

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
import { useRef } from "react";

const MyTasks = ({
  row,
  handleGroupOpen,
  remDuplicates,
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

}) => {

  // =============== icon menu ======================

  const SelectedOption = useRef("")

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenuIcon = Boolean(anchorEl);
  const handleClickMenuIcon = (event, data) => {
    SelectedOption.current = data
    setAnchorEl(event.currentTarget);
    console.log("=============================")
    console.log("SelectedOption", SelectedOption)
    console.log("=============================")
  };
  const handleCloseMenuIcon = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <TableRow sx={{ "& > *": {} }} className="my-3 ">
        <TableCell className=" TableHeadderRow" style={{ cursor: "pointer" }}>
          {console.log("Sadsadasdasfv", row.group_id)}
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
            weight="700"
            JFcontent="left"
            marginBottom="0px"
            style={{
              fontWeight: !row.is_read ? "bolder" : "normal",
            }}
          >
            {row.group_name}
            <Chip
              label={
                remDuplicates.filter((f) => f.group_id === row.group_id).length
              }
              color="info"
              size="small"
              style={{ marginLeft: "5px" }}
            />
          </Heading1>

          <div style={{ textAlign: "right" }}>
            <IconButton
              onClick={(event) =>
                handleClick(event, row.group_name, row.group_color)
              }
            >
              <Edit style={{ color: "var(--green)" }} />
            </IconButton>
          </div>
          <div style={{ textAlign: "right" }}>
            <IconButton onClick={() => handleTaskGroupDelete(row.group_id)}>
              <DeleteForever style={{ color: "var(--warningRed)" }} />
            </IconButton>
          </div>
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
                    <td></td>
                  </TableRow>
                </TableHead>
                <TableBody style={{ wordBreak: "break-all", position: "relative" }}>
                  {remDuplicates
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
                        console.log("count", row.group_task_count);
                        return (
                          <>
                            <TableRow
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
                                "mytask",
                                "My Tasks",
                                "",
                                data.task_status,
                              )}
                              key={i}
                            >
                              <td
                                style={{
                                  borderLeft:
                                    "4px solid " + data.group_color + "",

                                  borderRadius: "8px 0px 0px 8px ",
                                  width: "35%",
                                  paddingLeft: "5px",
                                }}
                              >

                                {" "}
                                {data.task_name.length > 60 ? (
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

                              <td style={{ width: "35%" }} className="">

                                {data.task_details.length > 60 ? (
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
                              {/* <td key={i} style={{ width: "20%" }}>
                                  <Heading1
                                    className="tableCellText"
                                    color="grey"
                                  >
                                    <AvatarGroup
                                      max={2}
                                      style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                      }}
                                    >
                                      {taskAllUSers.map((t) =>
                                        t.task_id === data.task_id ? (
                                          <Tooltip
                                            title={t.username}
                                            placement="top"
                                            arrow
                                          >
                                            <Avatar
                                              alt={t.username}
                                              sx={{
                                                bgcolor: data.group_color,
                                                width: "1.5em",
                                                height: "1.5em",
                                              }}
                                            >
                                              {t.username?.charAt(0)}
                                            </Avatar>
                                          </Tooltip>
                                        ) : null
                                      )}
                                    </AvatarGroup>
                                  </Heading1>
                                </td> */}
                              <td style={{ width: "10%" }}>
                                <Heading1 className="tableCellText" color="grey">
                                  {data.task_deadline?.substring(0, 10)}
                                </Heading1>
                              </td>

                              <td style={{ width: "5%" }}>
                                {data.task_status === "Canceled" ? (
                                  <Heading1
                                    className="d-flex justify-content-center align-items-center m-0"
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
                                    className="d-flex justify-content-center align-items-center m-0"
                                    width="100%"
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
                                    className="d-flex justify-content-center align-items-center m-0"
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
                                    className="d-flex justify-content-center align-items-center m-0"
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
                                    className="d-flex  justify-content-center align-items-center m-0"
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

                              <td style={{ width: "10%" }}>

                              </td>
                            </TableRow>
                            <p style={{ width: "10px", position: "absolute", left: "94%", zIndex: "100", marginTop: "-45px", display: "flex" }}>

                              <div className="d-flex justify-content-end">
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
                                  <MenuItem onClick={handleCloseMenuIcon}>
                                    <div className="w-100"
                                      onClick={toggleDrawerUpdate(anchor,
                                        true,
                                        "Edit Task",
                                        SelectedOption.current.task_name,
                                        SelectedOption.current.action,
                                        SelectedOption.current.task_details,
                                        SelectedOption.current.task_deadline,
                                        SelectedOption.current.task_startdate,
                                        SelectedOption.current.task_id,
                                        "mytask",
                                        "My Tasks",
                                        "",
                                        SelectedOption.current.task_status,
                                      )}
                                    >
                                      <IconButton>
                                        <Edit style={{ color: "var(--green)" }} />
                                      </IconButton>
                                      EDIT
                                    </div>

                                  </MenuItem>
                                  <MenuItem onClick={handleCloseMenuIcon}>
                                    <div className="w-100"
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
                                </Menu>
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

export default MyTasks;
