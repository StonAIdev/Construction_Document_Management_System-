import React, { useState, useEffect } from "react";
import "./replycomponent.css";
import Heading1 from "../../Reusable Components/Headings/Heading1";
import {
  TextField,
  Chip,
  Autocomplete,
  Typography,
  Alert,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import ButtonStyled from "../../Reusable Components/Buttons/ButtonStyled";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFileAlt,
  faFilter,
  faPaperPlane,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
// import { ButtonUnstyled } from "@mui/core";
// import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { getDroppedOrSelectedFiles } from "html5-file-selector";
import axios from "axios";
import { url } from "../../url";
import { loginRequest } from "../../authConfig";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import BookIcon from "@mui/icons-material/Book";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  DeleteForever,
  BorderColorSharp,
  DriveFolderUpload,
  AttachFile,
  PendingActions,
  Send,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Docmodal from "./DocumentsPopup/Docmodal";

import { borderRadius } from "@mui/system";
import { forEach } from "lodash";
import { element } from "prop-types";
import { SnackbarProvider, useSnackbar } from "notistack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import globalVars from "../../globals";
import TaskModel from "../../outlook_components/CreateTaskModal/CreateTaskModal";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
// import cuid from "cuid";

const drawerWidth = 550;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

function CreateEmail({
  user,
  pca,
  project,
  userInfo,
  setReplyOpen,
  replyOrForward,
  sender,
  subjectRec,
  email_id,
  token,
  bodyRec,
}) {
  ///////
  const [projectUsers, setProjectUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [outlookRecv, setoutlookRecv] = useState([sender]);
  const [isValidRecv, setIsValidRecv] = useState(false);
  const [isValidCC, setIsValidCC] = useState(false);
  const [cc, setCC] = useState([]);
  const [receivers, setReceivers] = useState([sender]);
  let [subject, setSubject] = useState(subjectRec);
  let [body, setBody] = useState(bodyRec);
  const [searchTextFilter, setSearchTextFilter] = useState("");
  const [displayStyle, setStyle] = useState("hidden");
  const [contextMenu, setContextMenu] = useState(null);
  const [searchResult, setSearchResult] = useState([]);

  const [selectedText, setSelectedText] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [taskModalToggle, setTaskModalToggle] = useState(false);

  const searchTypes = [
    { label: "Contracts", value: "Contracts" },
    { label: "Responsability Matrix", value: "Responsability Matrix" },
  ];

  const handleClickVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("Email Sent Sucessfully", { variant });
  };

  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [openAutocompleteCC, setOpenAutocompleteCC] = React.useState(false);

  const [options, setOptions] = React.useState([]);
  const loading = openAutocomplete && outlookRecv.length === 0;
  const loadingCC = openAutocompleteCC && outlookRecv.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        getReceivers();
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    let active = true;

    if (!loadingCC) {
      return undefined;
    }

    (async () => {
      if (active) {
        getReceivers();
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingCC]);

  useEffect(() => {
    if (!openAutocomplete) {
      setoutlookRecv([]);
    }
    if (!openAutocompleteCC) {
      setoutlookRecv([]);
    }
  }, [openAutocomplete, openAutocompleteCC]);

  useEffect(() => {
    if (!openAutocompleteCC) {
      setoutlookRecv([]);
    }
  }, [openAutocompleteCC]);

  useEffect(() => {
    if (globalVars.searchRef && globalVars.searchRef.length > 0) {
      setBody(createRefrenceText);
      globalVars.searchRef = [];
    }
    // getReceivers();
    // getUsers();
  }, [files, refresh]);

  const getUsers = async () => {
    try {
      var res = await axios.post(
        url + "/Tasks/getUsers",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );

      setProjectUsers(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const fileParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };

  const onSubmitSearch = async () => {
    if (searchTypeFilter == "Responsability Matrix" && searchTextFilter) {
      try {
        setSearchResult(
          await globalVars.responsabilityMatrixSearch(
            searchTextFilter,
            user,
            project
          )
        );
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    }
  };

  const createRefrenceText = () => {
    var refText = "";
    globalVars.searchRef.forEach(
      (item) =>
        (refText += `Refer to S/N: ${item["S/N"]} \nResponsibility: ${item.Responsibility}\nProviders: ${item.Responsible}\n\n`)
    );
    globalVars.tenderRef.forEach(
      (item) =>
        (refText += `Refer to S/N: ${item["Question"]} \nQuestions: ${item["RFI QUESTION BY BIDDER"]}\nAnswer: ${item["ANSWER BY VAMED"]}\n\n`)
    );
    return refText;
  };

  const onFileChange = ({ meta, file }, status) => {
    setStyle("hidden");
    if (status === "done") {
      let uploaded_files = files;
      uploaded_files.push(file);

      setFiles(uploaded_files);
    } else if (status === "removed") {
      const filtered_files = files.filter((item) => item.name !== file.name);
      setFiles(filtered_files);
    }
  };

  const onSubmit = (files, allFiles) => {
    allFiles.forEach((f) => f.remove());
  };

  const getFilesFromEvent = (e) => {
    return new Promise((resolve) => {
      getDroppedOrSelectedFiles(e).then((chosenFiles) => {
        chosenFiles.forEach((element) => {});
        resolve(chosenFiles.map((f) => f.fileObject));
      });
    });
  };

  const getReceivers = async () => {
    const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
      headers: { token: user.token, user_id: user.user_id },
    });
    let rec = [];
    // if (subjectRec === "reply") {
    //   rec.push(sender);
    // }

    responseRec.data.rows.map((g) => {
      rec.push({ email_address: g.email_address });
    });
    // let to=[];
    // rec.map((t) => to.push(t.emailAddress.name));

    setoutlookRecv(rec);
  };

  const handleCcChange = (newVal) => {
    setCC(newVal);
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    newVal.forEach((element) => {
      if (element.match(regexEmail)) {
        setIsValidCC(false);
      } else {
        setIsValidCC(true);
      }
    });
  };

  const handeReceiversChange = (newVal) => {
    setReceivers(newVal);
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    newVal.forEach((element) => {
      if (element.match(regexEmail)) {
        setIsValidRecv(false);
      } else {
        setIsValidRecv(true);
      }
    });
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const createReplyEmailDB = async (email_id_reply) => {
    try {
      var res = await axios.post(
        url + "/email/createReply",
        {
          email_id: email_id,
          email_id_reply: email_id_reply,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  const replyApi = async () => {
    if (!token) {
      alert("token expired please refresh the page and try again");
    }

    if (token) {
      let recvArr = [];
      receivers.map((r) => {
        recvArr.push({ emailAddress: { address: r } });
      });

      let ccArr = [];
      cc.map((r) => {
        ccArr.push({ emailAddress: { address: r } });
      });

      var data = {
        message: {
          body: {
            content: `${body}`,
          },
          toRecipients: recvArr,
          ccRecipients: ccArr,
          attachments: [],
        },
        comment: "",
      };

      var config = {
        method: "post",
        url: `https://graph.microsoft.com/v1.0/me/messages/${email_id}/createReply`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Prefer: `IdType="ImmutableId"`,
        },
        data: data,
      };
      var arr = [];
      const covertAndAttach = async (doc, index) => {
        var reader = new FileReader();
        reader.readAsDataURL(doc);
        reader.onloadend = function () {
          var base64data = reader.result;

          arr.push({
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: doc.name,
            contentType: doc.type,
            contentBytes: base64data.split(",")[1],
          });
          data.message.attachments = arr;
          if (index === files.length - 1) {
            axios(config)
              .then(function (response) {
                // createReplyEmailDB(replyId);

                handleClickVariant("success");
                setReplyOpen(false);
                setRefresh(!refresh);

                // if(title==="replay"){

                // }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        };
      };

      if (files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          await covertAndAttach(files[index], index);
        }
      } else {
        axios(config)
          .then(function (response) {
            const replyId = response.data.id;
            const sendConfig = {
              method: "post",
              url: `https://graph.microsoft.com/v1.0/me/messages/${replyId}/send`,
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            axios(sendConfig)
              .then(function (response) {
                createReplyEmailDB(replyId);
                setRefresh(!refresh);
                handleClickVariant("success");
                setReplyOpen(false);
              })
              .catch(function (error) {
                alert("Outlook token is expired refresh page to send mail");
              });
          })
          .catch(function (error) {
            alert("Outlook token is expired refresh page to send mail");
          });
      }
    }
  };

  const forwardApi = async () => {
    if (!token) {
      alert("token expired please refresh the page and try again");
    }

    if (token) {
      let recvArr = [];
      receivers.map((r) => {
        recvArr.push({ emailAddress: { address: r } });
      });

      let ccArr = [];
      cc.map((r) => {
        ccArr.push({ emailAddress: { address: r } });
      });

      // const id = cuid();

      var data = {
        message: {
          subject: `${subject}`,
          body: {
            contentType: "Text",
            content: `${body}`,
          },
          toRecipients: recvArr,
          ccRecipients: ccArr,
          attachments: [],
        },
        saveToSentItems: "true",
      };

      var config = {
        method: "post",
        url: `https://graph.microsoft.com/v1.0/me/messages/${email_id}/forward`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };
      var arr = [];
      const covertAndAttach = async (doc, index) => {
        var reader = new FileReader();
        reader.readAsDataURL(doc);
        reader.onloadend = function () {
          var base64data = reader.result;

          arr.push({
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: doc.name,
            contentType: doc.type,
            contentBytes: base64data.split(",")[1],
          });
          data.message.attachments = arr;
          if (index === files.length - 1) {
            axios(config)
              .then(function (response) {
                handleClickVariant("success");
                setReplyOpen(false);

                // if(title==="replay"){

                // }
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        };
      };

      if (files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          await covertAndAttach(files[index], index);
        }
      } else {
        axios(config)
          .then(function (response) {
            handleClickVariant("success");
            setReplyOpen(false);
          })
          .catch(function (error) {
            alert("Outlook token is expired refresh page to send mail");
          });
      }
    }
  };
  const handleShare = () => {
    if (replyOrForward === "reply") {
      replyApi();
    } else if (replyOrForward === "forward") {
      forwardApi();
    }
  };
  const [docmodal, setdocmodal] = useState(false);

  function _onDragEnter(e) {
    setStyle("visible");
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function _onDragEnterParent(e) {
    setStyle("hidden");

    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  function _onDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  function _onDragLeave(e) {
    setStyle("hidden");
    e.stopPropagation();
    e.preventDefault();
    return true;
  }

  function _onDrop(e) {
    setStyle("hidden");
    let files = e.dataTransfer.files;

    e.preventDefault();

    // Upload files
  }

  const handleEmailModelOpen = () => {
    setdocmodal(true);
  };

  const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
    const textMsg = files.length > 0 ? "Upload Again" : "Select Files";

    let documentSize = 0;

    files.forEach((element) => {
      documentSize += parseInt(element.file.size);
    });

    return (
      <div
        // className="btn btn-danger mt-4"
        style={{
          bottom: 0,
          right: 0,

          visibility: "visible",
          zIndex: 10,

          position: "relative",
          marginLeft: "auto",
        }}
      >
        <Tooltip title="Intelligent Search">
          <IconButton onClick={handleDrawerOpen}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Tasks">
          <IconButton
            onClick={(e) => {
              setTaskModalToggle(true);
            }}
          >
            <AddTaskIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete Drafted Reply">
          <IconButton onClick={() => setReplyOpen(false)}>
            <DeleteForever />
          </IconButton>
        </Tooltip>

        {/* <IconButton>
          <BorderColorSharp />
        </IconButton> */}
        <Tooltip title="Upload to StonAI">
          <IconButton onClick={handleEmailModelOpen}>
            <DriveFolderUpload />
          </IconButton>
        </Tooltip>

        <label
          className="btn btn-outline-info btn-sm mt-1  mx-1"
          style={{ borderRadius: "8px", width: "fit-content" }}
        >
          {/* {textMsg} */}
          <AttachFile />
          <input
            style={{ display: "none" }}
            type="file"
            accept={accept}
            multiple
            onChange={(e) => {
              getFilesFromEvent(e).then((chosenFiles) => {
                onFiles(chosenFiles);
              });
            }}
          />
        </label>

        <Button
          variant="outlined"
          size="small"
          borderRadius="8px"
          onClick={handleShare}
          sx={{
            borderRadius: "8px",
            color: "var(--blue)",
            fontWeight: "bolder",
            borderWidth: "2px",
          }}
          disabled={isValidCC || isValidRecv}
          endIcon={<FontAwesomeIcon icon={faPaperPlane} />}
        >
          Send Email
        </Button>
      </div>
    );
  };
  let docSize = 0;

  // ******************** Context Menu Functions *********************
  const handleContextMenu = (event) => {
    event.preventDefault();

    if (window.getSelection().toString().length) {
      let exactText = window.getSelection().toString();
      var lines = exactText.split(/\r\n|\n\r|\n|\r/); // split by:     \r\n  \n\r  \n  or  \r
      const taskArray = [];
      Object.keys(lines).map((m) => {
        if (lines[m].length > 0) {
          taskArray.push({
            taskTitle: lines[m],
            assignedTo: projectUsers,
            startdate: null,
            deadline: null,
          });
        }
      });

      setSelectedText(taskArray);
    }
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
          }
        : null
    );
  };

  const handleCloseContext = () => {
    setContextMenu(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closemenu = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  // const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //*********************** Drawer  **************************** */

  const [opendrawer, setOpendrawer] = React.useState(true);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [searchTypeFilter, setSearchTypeFilter] = React.useState("");
  const handleDrawerOpen = () => {
    setOpen(true);
    setContextMenu(null);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setContextMenu(null);
  };

  const handleSearchTypeFilter = (event) => {
    setSearchTypeFilter(event.target.value);
  };

  // **********************************************************************
  const [stonAiAttachments, setStonAiAttachments] = useState(false);
  const handleInitalFiles = () => {
    return stonAiAttachments.length > 0 ? stonAiAttachments : [];
  };

  const dynamicDefaultRec = replyOrForward === "reply" ? [outlookRecv[0]] : [];
  return (
    <div>
      <>
        <Box sx={{ display: "flex" }}>
          <Docmodal
            docmodal={docmodal}
            setdocmodal={setdocmodal}
            project={project}
            userInfo={userInfo}
            user={user}
            files={files}
            setFiles={setFiles}
            stonAiAttachments={stonAiAttachments}
            setStonAiAttachments={setStonAiAttachments}
          />
          {taskModalToggle ? (
            <TaskModel
              taskModalToggle={taskModalToggle}
              setTaskModalToggle={setTaskModalToggle}
              selectedText={selectedText}
              project={project}
              projectUsers={projectUsers}
              userInfo={userInfo}
              user={user}
            />
          ) : null}

          <CssBaseline />

          <Main open={open}>
            <div className="w-100 d-flex">
              <div
                className="createEmailContainerReply "
                onDragEnter={(e) => {
                  _onDragEnterParent(e);
                }}
                onDrop={(e) => {
                  _onDrop(e);
                }}
              >
                <div
                  className="createEmailSplitReply"

                  // onDragLeave={(e) => {
                  //   _onDragLeave(e);
                  // }}
                >
                  <div className="p-3 " style={{ width: "100%" }}>
                    <div className="d-flex flex-column justify-content-between my-2">
                      <Autocomplete
                        disableCloseOnSelect
                        style={{ width: "100%" }}
                        size="small"
                        multiple
                        defaultValue={dynamicDefaultRec}
                        onChange={(event, newVal) => {
                          handeReceiversChange(newVal);
                        }}
                        open={openAutocomplete}
                        onOpen={() => {
                          setOpenAutocomplete(true);
                        }}
                        onClose={() => {
                          setOpenAutocomplete(false);
                        }}
                        id="receiver"
                        options={outlookRecv.map(
                          (option) => option.email_address
                        )}
                        freeSolo
                        loading={loading}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => {
                            return (
                              <Chip
                                variant="outlined"
                                color="primary"
                                size="small"
                                label={option}
                                {...getTagProps({ index })}
                              />
                            );
                          })
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Receivers"
                            error={isValidRecv}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {loading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                            helperText={
                              isValidRecv
                                ? "You have entered an invalid email"
                                : null
                            }

                            // placeholder="Emails"
                          />
                        )}
                      />
                      <Autocomplete
                        disableCloseOnSelect
                        style={{ marginTop: "0.5rem", width: "100%" }}
                        size="small"
                        onChange={(event, newVal) => {
                          handleCcChange(newVal);
                        }}
                        multiple
                        open={openAutocompleteCC}
                        onOpen={() => {
                          setOpenAutocompleteCC(true);
                        }}
                        onClose={() => {
                          setOpenAutocompleteCC(false);
                        }}
                        id="CC"
                        options={outlookRecv.map(
                          (option) => option.email_address
                        )}
                        freeSolo
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              color="secondary"
                              size="small"
                              label={option}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label="CC"
                            error={isValidCC}
                            loading={loadingCC}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <React.Fragment>
                                  {loadingCC ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                            helperText={
                              isValidCC
                                ? "You have entered an invalid email"
                                : null
                            }

                            // placeholder="Emails"
                          />
                        )}
                      />
                    </div>

                    <div className="d-flex justify-content-between my-2">
                      <TextField
                        id="outlined-basic"
                        label="Subject"
                        size="small"
                        variant="outlined"
                        style={{ width: "100%" }}
                        value={subject}
                        onChange={(event) => {
                          setSubject(event.target.value);
                        }}
                      />
                    </div>

                    <div className="my-2">
                      <div
                        onContextMenu={handleContextMenu}
                        style={{ cursor: "context-menu" }}
                      >
                        <TextField
                          size="small"
                          id="BodyText"
                          label="Body"
                          value={body}
                          multiline
                          onChange={(event) => {
                            handleBodyChange(event);
                          }}
                          onDragEnter={(e) => {
                            _onDragEnter(e);
                          }}
                          onDrop={(e) => {
                            _onDrop(e);
                          }}
                          onDragOver={(e) => {
                            _onDragOver(e);
                          }}
                          rows={8}
                          style={{
                            width: "100%",
                          }}
                          InputProps={{
                            endAdornment: (
                              <Dropzone
                                onChangeStatus={onFileChange}
                                InputComponent={selectFileInput}
                                getUploadParams={fileParams}
                                getFilesFromEvent={getFilesFromEvent}
                                maxSizeBytes={26214400}
                                initialFiles={handleInitalFiles()}
                                // inputContent="Drop A File"

                                styles={{
                                  dropzone: {
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    visibility: displayStyle,
                                    border: "3px dashed black",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    alignItems: "flex-end",
                                    overflow: "scroll",
                                  },
                                  dropzoneActive: {
                                    border: "3px dashed green",
                                  },
                                  preview: {
                                    minHeight: "5px",
                                    padding: "0px",
                                    paddingInline: "5px",
                                    background: "rgb(239 239 239)",
                                    marginBlock: "3px",
                                    boxShadow: "rgb(0 0 0 / 15%) 0px 2px 4px",
                                    visibility: "visible",
                                  },
                                }}
                              />
                            ),
                          }}
                        ></TextField>

                        <Menu
                          open={contextMenu !== null}
                          onClose={handleCloseContext}
                          anchorReference="anchorPosition"
                          anchorPosition={
                            contextMenu !== null
                              ? {
                                  top: contextMenu.mouseY,
                                  left: contextMenu.mouseX,
                                }
                              : undefined
                          }
                        >
                          <MenuItem
                            className="contextmenuitem"
                            onClick={handleDrawerOpen}
                          >
                            <FontAwesomeIcon
                              icon={faSearch}
                              style={{ margin: "5px" }}
                            />
                            <Button
                              aria-controls="demo-customized-menu"
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              disableElevation
                              className="filtersSubmenu"
                            >
                              {" "}
                              <span sx={{ color: "black" }}>Add reference</span>
                            </Button>
                          </MenuItem>
                          <MenuItem
                            className="contextmenuitem"
                            onClick={() => {
                              setTaskModalToggle(true);
                            }}
                          >
                            <AddTaskIcon style={{ margin: "5px" }} />
                            <Button
                              aria-controls="demo-customized-menu"
                              aria-haspopup="true"
                              aria-expanded={open ? "true" : undefined}
                              disableElevation
                              className="filtersSubmenu"
                            >
                              <span sx={{ color: "black" }}>Add Tasks</span>
                            </Button>
                          </MenuItem>
                        </Menu>
                      </div>
                    </div>
                    {files.length > 0
                      ? files.forEach((element) => {
                          docSize += parseInt(element.size);
                        })
                      : null}
                    {(docSize / 1000).toFixed(2) > 25000 ? (
                      <Alert
                        severity="error"
                        size="small"
                        sx={{ width: "100%" }}
                      >
                        File size must be smaller then 25 MB
                        <br />
                        <strong>
                          Uploaded documents Size:{" "}
                          {(docSize / 1000000).toFixed(3)} MB
                        </strong>
                      </Alert>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Main>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
              },
            }}
            variant="persistent"
            anchor="right"
            open={open}
          >
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronLeftIcon />
                ) : (
                  <ChevronRightIcon />
                )}
              </IconButton>
            </DrawerHeader>

            <Typography variant="h3" align="center">
              Intelligent Search
            </Typography>
            <Divider />

            <div className="px-3 py-2  d-flex flex-column">
              <Box sx={{ minWidth: 120, marginBottom: "10px" }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                  <Select
                    labelId="Filter"
                    value={searchTypeFilter}
                    label="Filter"
                    onChange={handleSearchTypeFilter}
                    size="small"
                  >
                    {searchTypes.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                label="Search"
                size="small"
                variant="outlined"
                style={{ width: "95%" }}
                onChange={(event) => {
                  setSearchTextFilter(event.target.value);
                }}
              />
              <ButtonStyled
                paddingInline=".8rem"
                paddingBlock="0.3rem"
                borderRadius="8px"
                width="fit-content"
                style={{
                  alignSelf: "self-end",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                onClick={onSubmitSearch}
              >
                Search
              </ButtonStyled>
            </div>
            {searchResult ? (
              searchResult.map((item) => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>
                        <b>{item["S/N"]}</b> - {item.Responsibility}
                      </Typography>{" "}
                      <Tooltip title="Add as refrence to email">
                        <IconButton
                          onClick={() => {
                            setBody(() => {
                              return `${body} Refer to S / N: ${item["S/N"]} \nResponsibility: ${item.Responsibility}\nProviders: ${item.Responsible}\n\n`;
                            });
                          }}
                        >
                          <BookIcon />
                        </IconButton>
                      </Tooltip>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <b>Responsiable Entities</b>
                      </Typography>
                      {item.Responsible.map((innerItem) => {
                        return <Typography>{innerItem}</Typography>;
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <Stack spacing={1}>
                <Skeleton variant="text" />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={118} />
              </Stack>
            )}
          </Drawer>
        </Box>
      </>
    </div>
  );
}

export default CreateEmail;
