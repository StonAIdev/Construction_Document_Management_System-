import React, { useState, useEffect } from "react";
import "./CreateEmail.css";

import Heading1 from "../Reusable Components/Headings/Heading1";
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
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFont,
  faBars,
  faBuilding,
  faComments,
  faCopy,
  faFileAlt,
  faFilter,
  faHashtag,
  faPaperPlane,
  faSearch,
  faTasks,
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
import { url } from "../url";
import { loginRequest } from "../authConfig";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";
import BookIcon from "@mui/icons-material/Book";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import {
  DeleteForever,
  BorderColorSharp,
  DriveFolderUpload,
  AttachFile,
  PendingActions,
  Send,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

import "./dropzone.css";

import { useSnackbar } from "notistack";
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
import globalVars from "../globals";
import TaskModel from "./CreateTaskModal/CreateTaskModal";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { getToken } from "../utils/GetToken";
import ParagraphAnsCard from "../components/search/Contracts/ParagraphAnsCard";
import ParagraphAnsDetails from "../components/search/Contracts/ParagraphAnsDetails";
import TenderCard from "../components/Folders/Viewer/DocumentExtraction/TenderCard";
import ParagraphCardEmail from "../components/search/Contracts/ParagraphCardEmail";
import TableCard from "../components/search/Contracts/TableCard";
import TableCardChips from "../components/search/Contracts/TableCardChips";

import Docmodal from "./DocumentsPopup/Docmodal";
import moment from "moment";

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
  department,
  userPosition,
  permisions,
}) {
  const [searchType, setSearchType] = useState("Contracts");
  const [searchText, setsearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [tenderResult, setTenderResult] = useState([]);
  const [contractResult, setContractResult] = useState([]);
  const [contractTableResult, setContractTableResult] = useState([]);
  const [boqResult, setBoqResult] = useState([]);
  const [momResult, setMomResult] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////////  Email States ///////////////////////////////////////////////////////////////////////////////////////

  const [projectUsers, setProjectUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [outlookRecv, setoutlookRecv] = useState([]);
  const [isValidRecv, setIsValidRecv] = useState(false);
  const [isValidCC, setIsValidCC] = useState(false);
  const [cc, setCC] = useState([]);
  const [receivers, setReceivers] = useState([]);
  let [subject, setSubject] = useState("");
  let [body, setBody] = useState("");
  const [searchTextFilter, setSearchTextFilter] = useState("");
  const [displayStyle, setStyle] = useState("hidden");
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedText, setSelectedText] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [token, setToken] = useState(null);

  const [dataLoading, setDataLoading] = useState(false);

  const handleToken = async () => {
    const token = await getToken();
    setToken(token);
  };
  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [openAutocompleteCC, setOpenAutocompleteCC] = React.useState(false);

  const [radioButtonValue, setRadioButtonValue] = React.useState("");

  const [options, setOptions] = React.useState([]);
  const loading = openAutocomplete && outlookRecv.length === 0;
  const loadingCC = openAutocompleteCC && outlookRecv.length === 0;

  ///////////////////////////////////////////////////////////////////////////////////////  Dcouments StonAI  States ///////////////////////////////////////////////////////////////////////////////////////
  const [docmodal, setdocmodal] = useState(false);
  const [stonAiAttachments, setStonAiAttachments] = useState(false);

  const handleRadioButtonChange = (event) => {
    setRadioButtonValue(event.target.value);
  };

  useEffect(() => {
    let active = true;
    // debugger;
    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
          headers: { token: user.token },
        });

        setoutlookRecv(responseRec.data.rows);
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
        const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
          headers: { token: user.token },
        });

        setoutlookRecv(responseRec.data.rows);
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

  const heightcheck = () => {
    if (windowDimensions.height > 1080) setrowscount(30);

    if (windowDimensions.height <= 1080 && windowDimensions.height > 995)
      setrowscount(25);

    if (windowDimensions.height <= 995 && windowDimensions.height > 800)
      setrowscount(20);

    if (windowDimensions.height <= 800) setrowscount(15);
  };

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);

    return function cleanup() {
      window.removeEventListener("resize", handleResize);
      heightcheck();
    };
  });

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [rowscount, setrowscount] = useState();

  const [taskModalToggle, setTaskModalToggle] = useState(false);
  const [tableCheck, setTableCheck] = useState();

  const searchTypes = [
    { label: "Contracts", value: "Contracts" },
    { label: "Responsibility Matrix", value: "Responsibility Matrix" },
    { label: "Tender Addendums", value: "Tender Addendums" },
    { label: "BOQ", value: "BOQ" },
    { label: "MOM", value: "MOM" },
  ];

  const handleClickVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("Email Sent Sucessfully", { variant });
  };

  const updateKPI = async () => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");
    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          searchType: radioButtonValue,
          todayDate: today_date,
          userPosition: userPosition,
        },
        { headers: { token: user.token } }
      );

      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  var refText = "";
  useEffect(() => {
    setBody(createRefrenceText);
    // globalVars.searchRef = [];
  }, []);

  useEffect(() => {
    // getReceivers();
    getUsers();
  }, [files]);

  useEffect(() => {
    refText = "";

    handleToken();
  }, []);
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
    if (searchText) {
      setDataLoading(true);

      await updateKPI();
    }
    // =============================================================
    // if (searchText && searchType == "Responsibility Matrix") {
    //   console.log("ResponsibilitysearchText", searchText);
    //   console.log("ResponsibilitysearchType", searchType);
    //   try {
    //     setSearchResult(
    //       await globalVars.responsabilityMatrixSearch(searchText, user, project)
    //     );
    //   } catch (e) {
    //     console.log("Error in elastic search: ", e);
    //   }
    // } else if (searchText && searchType == "Tender Addendums") {
    //   try {
    //     // console.log("result:", await globalVars.responsabilityMatrixSearch(searchText, user))
    //     console.log("project", project);
    //     setTenderResult(
    //       await globalVars.tenderSearch(searchText, user, project)
    //     );
    //   } catch (e) {
    //     console.log("Error in elastic search: ", e);
    //   }
    // } else if (searchType == "Contracts" && searchText) {
    //   console.log("searchText", searchText);
    //   try {
    //     // console.log("result:", await globalVars.responsabilityMatrixSearch(searchText, user))
    //     console.log("project", project);
    //     setContractResult(
    //       await globalVars.contractSearch(searchText, user, project)
    //     );
    //   } catch (e) {
    //     console.log("Error in elastic search: ", e);
    //   }
    // } else if (searchText && searchType == "BOQ") {
    //   try {
    //     setBoqResult(await globalVars.BOQSearch(searchText, user, project));
    //   } catch (e) {
    //     console.log("Error in elastic search: ", e);
    //   }
    // } else if (searchText && searchType == "MOM") {
    //   try {
    //     setMomResult(await globalVars.MOMSearch(searchText, user, project));
    //   } catch (e) {
    //     console.log("Error in elastic search: ", e);
    //   }
    // }
    // ==========================================================================

    if (searchText && radioButtonValue === "Responsibility Matrix") {
      try {
        setSearchResult(
          await globalVars.responsabilityMatrixSearch(searchText, user, project)
        );
        setSearchType("Responsibility Matrix");
        setDataLoading(false);
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "Tender Addendums") {
      try {
        setTenderResult(
          await globalVars.tenderSearch(searchText, user, project)
        );
        setSearchType("Tender Addendums");
        setDataLoading(false);
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "Contracts") {
      try {
        setContractResult(
          await globalVars.contractSearch(
            searchText,
            user,
            project,
            radioButtonValue
          )
        );
        setSearchType("Contracts");
        setDataLoading(false);
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "BOQ") {
      try {
        setBoqResult(await globalVars.BOQSearch(searchText, user, project));
        setSearchType("BOQ");
        setDataLoading(false);
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "MOM") {
      try {
        setMomResult(
          await globalVars.MOMSearch(
            searchText,
            user,
            project,
            radioButtonValue
          )
        );
        setSearchType("MOM");
        setDataLoading(false);
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    }
  };

  const createRefrenceText = () => {
    // var refText = "";
    globalVars.searchRef.forEach(
      (item) =>
        (refText += `Refer to S/N: ${item["S/N"]} \nResponsibility: ${item.Responsibility}\nProviders: ${item.Responsible}\n\n`)
    );
    globalVars.tenderRef.forEach(
      (item) =>
        (refText += `Refer to S/N: ${item["Question"]} \nQuestions: ${item["RFI QUESTION BY BIDDER"]}\nAnswer: ${item["ANSWER BY VAMED"]}\n\n`)
    );
    globalVars.MOMRef.forEach(
      (item) =>
        (refText += `Refer to page no: ${item.metadata["page_no"]} \nStating: ${item["page_content"]}\nDocument name: ${item.metadata["doc_name"]}\n\n`)
      // (refText += `Document Name: ${item["name"]} \nHeading: ${item["type"]}\nMinutes: ${item["page_content"]}\n\n`)
    );

    globalVars.contractRef.forEach(
      (item) =>
        (refText += `Refer to page no: ${item.metadata["page_no"]} \nStating: ${item["page_content"]}\nDocument name: ${item.metadata["doc_name"]}\n\n`)
      // (refText += `Refer to Heading: ${item["Heading"]} \nStating: ${item["page_content"]}\nDocument: ${item["type"]}\n\n`)
    );
    globalVars.contractTableRef.forEach((item) => {
      var rowText = [];
      {
        item.Columns.map((attribute) => {
          rowText += `${attribute}: ${item[attribute]}\n`;
        });
      }
      refText += `${rowText}\n\n`;
    });
    globalVars.BOQRef.forEach((item) => {
      var rowText = [];
      {
        item.Columns.map((attribute) => {
          rowText += `${attribute}: ${item[attribute]}\n`;
        });
      }
      refText += `${rowText}\n\n`;
    });

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
      headers: { token: user.token },
    });
    let rec = [];
    responseRec.data.rows.map((g) => {
      rec.push(g.email_address);
    });
    // let to=[];
    // rec.map((t) => to.push(t.emailAddress.name));

    var uniqueRec = [...new Set(rec)];

    setoutlookRecv(uniqueRec);
  };

  const handleCcChange = (newVal) => {
    setCC(newVal);
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    newVal.forEach((element) => {
      if (element.match(regexEmail)) {
        setIsValidCC(false);
      } else {
        if (newVal && newVal.length > 0) {
          setIsValidCC(true);
        }
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
        if (newVal && newVal.length > 0) {
          setIsValidRecv(true);
        }
      }
    });
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const handleShare = async () => {
    if (!token) {
      handleToken();
    } else if (token) {
      let recvArr = [];
      receivers.map((r) => {
        recvArr.push({ emailAddress: { address: r } });
      });

      let ccArr = [];
      cc.map((r) => {
        ccArr.push({ emailAddress: { address: r } });
      });

      var data = {};

      if (files && files.length > 0) {
        data = {
          message: {
            subject: `${subject}`,
            body: {
              contentType: "Text",
              content: `${body}`,
            },
            toRecipients: recvArr,
            ccRecipients: ccArr,
            attachments: [files],
          },
          saveToSentItems: "true",
        };
      } else {
        data = {
          message: {
            subject: `${subject}`,
            body: {
              contentType: "Text",
              content: `${body}`,
            },
            toRecipients: recvArr,
            ccRecipients: ccArr,
          },
          saveToSentItems: "true",
        };
      }

      var config = {
        method: "post",
        url: "https://graph.microsoft.com/v1.0/me/sendMail",
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
              })
              .catch(function (error) {
                alert("User not signed in click on ok to sign user");

                pca
                  .loginPopup(loginRequest)
                  .then(function (response) {
                    // success response
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
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
          })
          .catch(function (error) {
            alert("User not signed in click on ok to sign user");

            pca
              .loginPopup(loginRequest)
              .then(function (response) {
                // success response
              })
              .catch(function (error) {
                console.log(error);
              });
          });
      }
    }
  };

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
        <Tooltip title="Add Reference">
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

        {/* <IconButton>
          <DeleteForever />
        </IconButton> */}
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
          disabled={
            isValidCC ||
            isValidRecv ||
            receivers.length === 0 ||
            (documentSize / 1000).toFixed(2) > 25000
              ? true
              : false
          }
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
    setSearchType(event.target.value);
  };

  // **********************************************************************
  var view = <></>;
  var contractCheck = <></>;
  if (searchType === "Contracts") {
    view = (
      <>
        <div className="px-2">
          <div className="d-flex flex-column w-100 " style={{ rowGap: "20px" }}>
            <IconButton style={{ width: "fit-content", marginLeft: "auto" }}>
              <BookIcon />
            </IconButton>
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="20px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "0px" }}
            >
              Details
            </Heading1>

            <div className="d-flex flex-column w-100" style={{ gap: "20px" }}>
              {contractResult.map((para, i) => {
                if (para.Heading)
                  return (
                    <div className=" TableCard mx-auto">
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div
                          className="d-flex flex-column"
                          style={{ rowGap: "5px" }}
                        >
                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="14px"
                            weight="500"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              style={{
                                color: "var(--green)",
                                marginRight: "8px",
                              }}
                            />
                            {para.name}
                          </Heading1>

                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="14px"
                            weight="500"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faBars}
                              style={{
                                color: "var(--blue)",
                                marginRight: "8px",
                              }}
                            />
                            {para.Heading}
                          </Heading1>

                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="14px"
                            weight="400"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faFont}
                              style={{
                                color: "var(--orange)",
                                marginRight: "8px",
                              }}
                            />
                            {para.Text}
                          </Heading1>
                        </div>
                        <div className="mb-auto">
                          <Tooltip title="Add as refrence to email">
                            <IconButton
                              onClick={() => {
                                let temp = body;

                                setBody(() => {
                                  return `${temp}\n\nDocument Name: ${para["name"]} \nHeading: ${para["Heading"]}\nText: ${para["Text"]}\n\n`;
                                });
                              }}
                            >
                              <BookIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                else
                  return (
                    <div className=" TableCard">
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div
                          className="d-flex flex-column"
                          style={{ rowGap: "5px" }}
                        >
                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="1.08rem"
                            weight="520"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              style={{
                                color: "var(--green)",
                                marginRight: "8px",
                              }}
                            />
                            {para.name}
                          </Heading1>
                        </div>
                        <div>
                          <Tooltip title="Add as refrence to email">
                            <IconButton
                              onClick={() => {
                                var rowText = [];
                                {
                                  para.Columns.map((attribute) => {
                                    rowText += `${attribute}: ${para[attribute]}\n`;
                                  });
                                }
                                let temp = body;
                                setBody(() => {
                                  return `${temp}\n\n${rowText}\n\n`;
                                });
                              }}
                            >
                              <BookIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>

                      <div
                        className="d-flex flex-wrap w-100"
                        style={{
                          columnGap: "10px",
                          rowGap: "10px",
                          marginTop: ".5em",
                        }}
                      >
                        {para.Columns.map((attribute) => {
                          return (
                            <TableCardChips row={para} attribute={attribute} />
                          );
                        })}
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      </>
    );
  } else if (searchType === "Responsibility Matrix") {
    view = (
      <>
        {searchResult.map((row, i) => (
          <div className="ResponsibilityCards" style={{ gap: "7px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <Heading1
                color="var(--warningRed)"
                paddingBlock=""
                size="14px"
                weight="600"
                JFcontent="left"
                marginBottom="0px"
              >
                <FontAwesomeIcon
                  icon={faHashtag}
                  style={{ color: "var(--warningRed)", marginRight: "8px" }}
                />
                {row["S/N"]}
              </Heading1>

              <Tooltip title="Add as refrence to email">
                <IconButton
                  onClick={() => {
                    let temp = body;
                    setBody(() => {
                      return `${temp}\n\n${body} Refer to S / N: ${row["S/N"]} \nResponsibility: ${row.Responsibility}\nProviders: ${row.Responsible}\n\n`;
                    });
                  }}
                >
                  <BookIcon className="p-0 m-0" />
                </IconButton>
              </Tooltip>
            </div>
            <Heading1
              color="grey"
              paddingBlock=""
              size="14px"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faTasks}
                style={{ color: "var(--green)", marginRight: "8px" }}
              />
              {row.ACTIVITY}
            </Heading1>

            <Heading1
              color="grey"
              paddingBlock=""
              size="14px"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faComments}
                style={{ color: "var(--blue)", marginRight: "8px" }}
              />
              {row.REMARKS}
            </Heading1>

            <Heading1
              color="var(--orange)"
              paddingBlock=""
              size="14px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faBuilding}
                style={{ color: "var(--orange)", marginRight: "8px" }}
              />
              Responsibilities
            </Heading1>
            <Box>
              <div
                className=" d-flex flex-wrap"
                style={{ columnGap: "8px", rowGap: "10px" }}
              >
                {row.Responsible.map((responsibilityRow) => (
                  <Chip
                    size="small"
                    label={responsibilityRow}
                    key={responsibilityRow}
                    className="chips"
                  />
                ))}
              </div>
            </Box>
          </div>
        ))}
      </>
    );
  } else if (searchType === "Tender Addendums") {
    view = (
      <>
        {tenderResult.map((row, i) => (
          <div className="ResponsibilityCards " style={{ gap: "7px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <Heading1
                color="var(--warningRed)"
                paddingBlock=""
                size="14px"
                weight="600"
                JFcontent="left"
                marginBottom="0px"
              >
                <FontAwesomeIcon
                  icon={faHashtag}
                  style={{ color: "var(--warningRed)", marginRight: "8px" }}
                />
                {row["Question"]}
              </Heading1>

              <Tooltip title="Add as refrence to email">
                <IconButton
                  onClick={() => {
                    let temp = body;
                    setBody(() => {
                      return `${temp}\n\nRefer to S/N: ${row["Question"]} \nQuestions: ${row["RFI QUESTION BY BIDDER"]}\nAnswer: ${row["ANSWER BY VAMED"]}\n\n`;
                    });
                  }}
                >
                  <BookIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Heading1
              color="grey"
              paddingBlock=""
              size="14px"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faTasks}
                style={{ color: "var(--green)", marginRight: "8px" }}
              />
              {row["RFI QUESTION BY BIDDER"]}
            </Heading1>

            <Heading1
              color="grey"
              paddingBlock=""
              size="14px"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faComments}
                style={{ color: "var(--blue)", marginRight: "8px" }}
              />
              {row["ANSWER BY VAMED"]}
            </Heading1>
          </div>
        ))}
      </>
    );
  } else if (searchType === "MOM") {
    view = (
      <>
        {momResult.map((row, i) => (
          <div className="ResponsibilityCards">
            <div className="d-flex justify-content-between align-items-center">
              <Heading1
                color="var(--warningRed)"
                paddingBlock=""
                size="1rem"
                weight="600"
                JFcontent="left"
                marginBottom="0px"
              >
                <FontAwesomeIcon
                  icon={faHashtag}
                  style={{ color: "var(--warningRed)", marginRight: "8px" }}
                />
                {row["name"]}
              </Heading1>

              <Tooltip title="Add as refrence to email">
                <IconButton
                  onClick={() => {
                    let temp = body;
                    setBody(() => {
                      return `${temp}\n\nDocument Name: ${row["name"]} \nHeading: ${row["Label"]}\nMinutes: ${row["Text"]}\n\n`;
                    });
                  }}
                >
                  <BookIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faTasks}
                style={{ color: "var(--green)", marginRight: "8px" }}
              />
              {row["Label"]}
            </Heading1>

            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faComments}
                style={{ color: "var(--blue)", marginRight: "8px" }}
              />
              {row["Text"]}
            </Heading1>
          </div>
        ))}
      </>
    );
  } else if (searchType === "BOQ") {
    view = (
      <>
        {boqResult.map((row, i) => (
          <div className=" TableCard mx-3 my-2">
            <div className="d-flex align-items-center w-100 justify-content-between">
              <div className="d-flex flex-column" style={{ rowGap: "5px" }}>
                <Heading1
                  color="grey"
                  paddingBlock=""
                  size="14px"
                  weight="520"
                  JFcontent="left"
                  marginBottom="0px"
                >
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    style={{ color: "var(--green)", marginRight: "8px" }}
                  />
                  {row.name}
                </Heading1>
              </div>
              <div>
                <Tooltip title="Add as refrence to email">
                  <IconButton
                    onClick={() => {
                      var rowText = [];
                      {
                        row.Columns.map((attribute) => {
                          rowText += `${attribute}: ${row[attribute]}\n`;
                        });
                      }
                      let temp = body;
                      setBody(() => {
                        return `${temp}\n\n${rowText}\n\n`;
                      });
                    }}
                  >
                    <BookIcon className="p-0 m-0" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div
              className="d-flex flex-wrap w-100"
              style={{ columnGap: "10px", rowGap: "10px", marginTop: ".5em" }}
            >
              {row.Columns.map((attribute) => {
                return <TableCardChips row={row} attribute={attribute} />;
              })}
            </div>
          </div>
        ))}
      </>
    );
  }

  const handleEmailModelOpen = () => {
    setdocmodal(true);
  };

  const handleInitalFiles = () => {
    return stonAiAttachments.length > 0 ? stonAiAttachments : [];
  };
  return (
    <div className="" style={{ height: "100%" }}>
      {/* ******************************************* */}
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
          permisions={permisions}
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
            department={department}
          />
        ) : null}

        <CssBaseline />

        <Main open={open}>
          <div className="w-100 d-flex">
            <div
              className="createEmailContainer"
              onDragEnter={(e) => {
                _onDragEnterParent(e);
              }}
              onDrop={(e) => {
                _onDrop(e);
              }}
            >
              <div
                className="createEmailSplit "

                // onDragLeave={(e) => {
                //   _onDragLeave(e);
                // }}
              >
                <div className="p-3 " style={{ width: "100%" }}>
                  <Heading1
                    color="black"
                    // paddingInline="5px"
                    // paddingBlock=".6rem"
                    size="1.5rem"
                    weight="500"
                    marginBotto1m="0em"
                    JFcontent="left"
                  >
                    Compose Email
                  </Heading1>
                  <div className="d-flex flex-column justify-content-between my-2">
                    <Autocomplete
                      disableCloseOnSelect
                      style={{ width: "100%" }}
                      size="small"
                      multiple
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
                                  <CircularProgress color="inherit" size={20} />
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
                                  <CircularProgress color="inherit" size={20} />
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
                        className="emailbodyheight"
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
                        rows={rowscount}
                        style={{
                          width: "100%",
                        }}
                        InputProps={{
                          endAdornment: (
                            <Dropzone
                              // onSubmit={onSubmit}
                              onChangeStatus={onFileChange}
                              InputComponent={selectFileInput}
                              getUploadParams={fileParams}
                              getFilesFromEvent={getFilesFromEvent}
                              // className="dropzone"
                              // accept="image/*,audio/*,video/*"
                              // maxFiles={5}
                              // maxSizeBytes={26214400}
                              // inputContent="Drop A File"
                              initialFiles={handleInitalFiles()}
                              styles={{
                                dropzone: {
                                  // visibility: "hidden",
                                  // marginTop: "20px",
                                  // height: "100%",
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
                                  // maxHeight: "20em",
                                  overflow: "scroll",
                                },
                                dropzoneActive: {
                                  // borderColor: "green",
                                  // padding: "20px",
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
                            <span sx={{ color: "black" }}>
                              Intelligent Search
                            </span>
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
                    <Alert severity="error" size="small" sx={{ width: "100%" }}>
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
              overflowX: "hidden",
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

          <div className="px-3 py-2 d-flex flex-column">
            <div className="d-flex" style={{ gap: "10px" }}>
              <TextField
                label="Search"
                size="small"
                variant="outlined"
                style={{ width: "100%", margintop: "10px" }}
                onChange={(event) => {
                  setsearchText(event.target.value);
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
                }}
                onClick={onSubmitSearch}
              >
                Search
              </ButtonStyled>
            </div>

            <Box sx={{ minWidth: 120 }}>
              {/* <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                <Select
                  labelId="Filter"
                  value={searchType}
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
              </FormControl> */}

              <FormControl sx={{ marginTop: 2 }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={radioButtonValue}
                  // onChange={handleSearchTypeFilter}
                  onChange={handleRadioButtonChange}
                  className="EmailDrawer-Radio"
                >
                  <FormControlLabel
                    value="Contracts"
                    control={<Radio />}
                    label="Contracts"
                  />
                  <FormControlLabel
                    value="Responsibility Matrix"
                    control={<Radio />}
                    label="Responsibility Matrix"
                  />
                  <FormControlLabel
                    value="Tender Addendums"
                    control={<Radio />}
                    label="Tender Addendums"
                  />
                  <FormControlLabel
                    value="BOQ"
                    control={<Radio />}
                    label="BOQ"
                  />
                  <FormControlLabel
                    value="MOM"
                    control={<Radio />}
                    label="MOM"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <div className=" d-flex align-items-center justify-content-between">
              <div>
                {searchType === "Contracts" ? (
                  <div
                    className="d-flex align-items-center "
                    style={{ columnGap: "5px", marginLeft: "5px" }}
                  >
                    {contractCheck}
                  </div>
                ) : null}
              </div>

              {/* <ButtonStyled
                paddingInline=".8rem"
                paddingBlock="0.3rem"
                borderRadius="8px"
                width="fit-content"
                style={{
                  alignSelf: "self-end",
                  cursor: "pointer",
                }}
                onClick={onSubmitSearch}
              >
                Search
              </ButtonStyled> */}
            </div>
          </div>

          {view}
        </Drawer>
      </Box>
    </div>
  );
}

export default CreateEmail;
