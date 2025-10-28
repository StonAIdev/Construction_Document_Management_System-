import React, { useState, useEffect } from "react";
import {
  faBars,
  faFileAlt,
  faFont,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";
import moment from "moment";
// import { Box, Container,Grid} from "@material-ui/core";
import { url } from "../url";
import "../components/search/search.css";
import axios from "axios";
import { List, ListItem, Divider } from "@mui/material";
import Heading1 from "../Reusable Components/Headings/Heading1";
import SubHeading from "../Reusable Components/Headings/Heading1";
import { useSnackbar } from "notistack";
import { styled, useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Collapse from "@mui/material/Collapse";
import BookIcon from "@mui/icons-material/Book";
import globalVars from "../globals";
import Tooltip from "@mui/material/Tooltip";
import { Navigate } from "react-router";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { useNavigate } from "react-router-dom";
import NoData from "./Assets/NoData";
import { TestHighlighter } from "../components/TestHighlighter";
import { getOtherCategoryNames } from "../components/OtherCategory";
import {
  Select,
  MenuItem,
  InputLabel,
  Avatar,
  Menu,
  Typography,
  Skeleton,
  Stack,
  TextField,
  Switch,
  CircularProgress,
  Drawer,
  CssBaseline,
  Autocomplete,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TableCardChips from "../components/search/Contracts/TableCardChips";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
//temp
import "monday-ui-react-core/dist/main.css";
import { Box, Container, Grid, IconButton } from "@material-ui/core";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import ButtonStyled from "../Reusable Components/Buttons/ButtonStyled";
import FormControl from "@mui/material/FormControl";
import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faComments,
  faHashtag,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import ParagraphAnsCard from "../components/search/Contracts/ParagraphAnsCard";
import ParagraphAnsDetails from "../components/search/Contracts/ParagraphAnsDetails";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import HighlighterAiSearch from "../components/Folders/Viewer/HighlighterAiSearch";
import { convertRawTextToHighlightForContract } from "../components/ConvertToHighlights";

const drawerWidth = 600;
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

export default function Search({
  user,
  permisions,
  project,
  department,
  userPosition,
  socket,
  setSocket,
  userInfo,
  currentComp,
  setCurrentComp,
  check,
  setCheck,
  pca,
  extractedFeilds,
  setExtractedFeilds,
  docUrl,
  setDocUrl,
  showViewer,
  setShowViewer,
  tabValue,
  setTabValue,
}) {
  const theme = useTheme();
  const [FiltersClicked, setFiltersClicked] = useState(false);
  const [searchType, setSearchType] = useState("Contracts");
  const [searchResult, setSearchResult] = useState([]);
  const [tenderResult, setTenderResult] = useState([]);
  const [contractResult, setContractResult] = useState([]);
  const [contractTableResult, setContractTableResult] = useState([]);
  const [otherResult, setOtherResult] = useState([]);
  const [otherTableResult, setOtherTableResult] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [redirect, setRedirect] = useState("");
  const [open, setOpen] = React.useState(false);
  const [subContractor, setSubcontractorType] = useState("");
  const [subcontractorfromdb, setSubcontractorfromdb] = useState([]);
  const [openAuto, setOpenAuto] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = openAuto && options.length === 0;
  var [raw_Texts, setRawTexts] = useState([]);
  const [otherCats, setOtherCats] = React.useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openOtherCat, setOpenOtherCat] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const loadingCat = openOtherCat && otherCats.length === 0;
  React.useEffect(() => {
    setDefaultPermittedRadioButton();
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res = await getSubcontractor();
        console.log("dsadsavdfvs", res);
        setOptions(res);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    console.log(contractResult, "contrat");
    // console.log(contractResult.length, "contract length");
    console.log(Object.keys(contractResult).length, "contract length");
  }, [contractResult]);

  React.useEffect(() => {
    console.log("ussseeds");
    let active = true;

    if (!loadingCat) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res = getOtherCategoryNames(
          project.project_id,
          subContractor?.name,
          user,
          setOtherCats
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingCat]);
  React.useEffect(() => {
    if (!openAuto) {
      setOptions([]);
    }
  }, [openAuto]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const getSubcontractor = async () => {
    console.log("fsdf sdds");

    try {
      const res = await axios.post(
        url + "/Project/getSubcontractors",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("fsdf sdds", res.data);
      return res.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const [dataLoading, setDataLoading] = useState(false);

  const [boqResult, setBoqResult] = useState([]);
  const [momResult, setMomResult] = useState([]);

  var boq_attributes = [];

  const navigate = useNavigate();

  var selectedRows = [];

  const searchTypes = [
    { label: "Contracts", value: "Contracts" },
    { label: "Responsibility Matrix", value: "Responsibility Matrix" },
    { label: "Tender Addendums", value: "Tender Addendums" },
    { label: "BOQ", value: "BOQ" },
    { label: "MOM", value: "MOM" },
  ];
  const [otherDocumentCategory, setOtherDocumentCategory] = useState("");
  const onChangeHandlerOtherDocCat = (value, index) => {
    console.log("valie", value);
    setOtherDocumentCategory(value);
  };
  const handleSearchTypeChange = (event) => {
    selectedRows = [];
    setSearchType(event.target.value);
  };
  const [radioButtonValue, setRadioButtonValue] = React.useState("");

  function setDefaultPermittedRadioButton() {
    if (permisions.canviewcontract) {
      setRadioButtonValue("Contracts");
    } else if (permisions.canviewresponsibilitymatrix) {
      setRadioButtonValue("Responsibility Matrix");
    } else if (permisions.canviewtender) {
      setRadioButtonValue("Tender Addendums");
    } else if (permisions.canviewboq) {
      setRadioButtonValue("BOQ");
    } else if (permisions.canviewminutesofmeeting) {
      setRadioButtonValue("MOM");
    }
  }
  const updateKPI = async (totalTime) => {
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
          totalTime: totalTime,
        },
        { headers: { token: user.token } }
      );
      console.log("on submit search: ", response.data);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const getfilesurl = async (element, document_id) => {
    console.log("element", element);
    const response = await axios(
      "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
        document_id
    );
    return response.data.uploadURL;
  };
  const isOtherDoc = (document_category) => {
    console.log("document_category", document_category);
    if (document_category === "Other") {
      return true;
    } else {
      return false;
    }
  };
  const HandleExtractedFeilds = async (value) => {
    try {
      console.log(" 2 is updating??");
      const response = await axios.post(
        url + "/Document/getExtractedFeilds",
        value,
        {
          headers: { token: user.token },
        }
      );
      console.log("2 is this updating?", response.data._source);
      setExtractedFeilds(response.data._source);
      return response.data._source;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const handleClickPreviewDoc = async (value) => {
    console.log("valuevalue", value);
    setRawTexts(await convertRawTextToHighlightForContract(value));

    const res = await HandleExtractedFeilds(value);
    console.log("res", res);
    const urls = await getfilesurl(res, value.document_id);
    console.log("urls", urls);
    setDocUrl(urls);
    setShowViewer(true);
    setTabValue("three");
    return true;
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const previewDocument = async (value) => {
    await handleClickPreviewDoc(value);
    handleDrawerOpen();
  };
  const onSubmitSearch = async () => {
    if (searchText) {
      setDataLoading(true);
    }

    if (searchText && radioButtonValue === "Responsibility Matrix") {
      try {
        let start = window.performance.now();
        console.log("start", start);

        setSearchResult(
          await globalVars.responsabilityMatrixSearch(
            searchText,
            user,
            project,
            subContractor
          )
        );
        let end = window.performance.now();
        const totalTime = end - start;
        updateKPI(totalTime);

        setDataLoading(false);
      } catch (e) {
        enqueueSnackbar("Server Error", { variant: "error" });
        setDataLoading(false);
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "Tender Addendums") {
      try {
        // console.log("result:", await globalVars.responsabilityMatrixSearch(searchText, user))
        let start = window.performance.now();
        console.log("project", project);
        setTenderResult(
          await globalVars.tenderSearch(
            searchText,
            user,
            project,
            subContractor
          )
        );
        let end = window.performance.now();
        const totalTime = end - start;
        updateKPI(totalTime);
        setDataLoading(false);
      } catch (e) {
        enqueueSnackbar("Server Error", { variant: "error" });
        setDataLoading(false);
        console.log("Error in elastic search: ", e);
      }
    } else if (radioButtonValue === "Contracts" && searchText) {
      try {
        // console.log("result:", await globalVars.responsabilityMatrixSearch(searchText, user))
        console.log("contracg result", project);
        console.log("subContractor", subContractor);

        let start = window.performance.now();
        let a = await globalVars.contractSearch(
          searchText,
          user,
          project,
          subContractor?.name,
          radioButtonValue
        );
        console.log(a);
        setContractResult(a);

        let end = window.performance.now();
        const totalTime = end - start;
        updateKPI(totalTime);
        setDataLoading(false);
        console.log(a, "contract resultttt");
      } catch (e) {
        console.log("Error in elastic search: ", e);
        enqueueSnackbar("Server Error", { variant: "error" });
        setDataLoading(false);
      }
    } else if (radioButtonValue === "Other" && searchText) {
      try {
        // console.log("result:", await globalVars.responsabilityMatrixSearch(searchText, user))
        console.log("contracg result", project);
        console.log("subContractor", subContractor);
        let start = window.performance.now();
        let c = await globalVars.otherTextSearch(
          searchText,
          user,
          project,
          subContractor?.name,
          otherDocumentCategory,
          radioButtonValue
        );
        console.log(c, "otherText resultttt");
        setOtherResult(c);

        setOtherTableResult(
          await globalVars.otherTableSearch(
            searchText,
            user,
            project,
            subContractor?.name,
            otherDocumentCategory
          )
        );
        let end = window.performance.now();
        const totalTime = end - start;
        updateKPI(totalTime);
        setDataLoading(false);
      } catch (e) {
        enqueueSnackbar("Server Error", { variant: "error" });
        setDataLoading(false);
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "BOQ") {
      let start = window.performance.now();
      try {
        setBoqResult(
          await globalVars.BOQSearch(searchText, user, project, subContractor)
        );
        let end = window.performance.now();
        const totalTime = end - start;
        updateKPI(totalTime);
        setDataLoading(false);
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (searchText && radioButtonValue === "MOM") {
      let start = window.performance.now();
      try {
        let b = await globalVars.MOMSearch(
          searchText,
          user,
          project,
          subContractor,
          radioButtonValue
        );
        setMomResult(b);
        let end = window.performance.now();
        const totalTime = end - start;
        updateKPI(totalTime);
        setDataLoading(false);
      } catch (e) {
        enqueueSnackbar("Server Error", { variant: "error" });
        setDataLoading(false);
        console.log("Error in elastic search: ", e);
      }
    }
  };

  const handleRadioButtonChange = (event) => {
    setRadioButtonValue(event.target.value);
  };
  console.log("radioButtonVLaue", radioButtonValue);

  var view = <></>;
  var contractCheck = <></>;
  if (radioButtonValue == "Contracts") {
    if (dataLoading) {
      view = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    } else if (Object.keys(contractResult).length > 0) {
      view = (
        <>
          <Heading1
            color="var(--blue)"
            paddingInline="10px"
            paddingBlock=""
            size="18px"
            weight="600"
            JFcontent="left"
            marginBottom="0px"
            className="d-flex align-items-left"
            style={{ marginBlock: "10px" }}
          >
            Generative AI Search Results
          </Heading1>

          <div className="d-flex flex-column align-items-center w-100">
            {/* {contractResult.map((para, i) => ( */}
            <div className="AnsDetailscard TableCard mb-2 mt-1 w-100">
              <div className="d-flex align-items-center w-100 justify-content-between">
                <div
                  className="d-flex flex-column w-100"
                  style={{ rowGap: "5px" }}
                >
                  <Heading1
                    color="grey"
                    paddingBlock=""
                    size="14px"
                    weight="400"
                    JFcontent="left"
                    marginBottom="0px"
                    flexDirection="row"
                  >
                    <FontAwesomeIcon
                      icon={faFont}
                      style={{
                        color: "var(--orange)",
                        marginRight: "8px",
                      }}
                    />
                    <p>
                      {isExpanded
                        ? contractResult?.answer
                        : `${contractResult?.answer.slice(0, 500)}`}
                      {contractResult?.answer.length > 500 && (
                        <span
                          style={{ color: "black", cursor: "pointer" }}
                          onClick={toggleExpand}
                        >
                          {isExpanded ? ".... Show Less" : ".... Show More"}
                        </span>
                      )}
                    </p>

                    {/* {contractResult?.answer} */}
                  </Heading1>
                  <Divider
                    sx={{
                      marginTop: "5px",
                      marginBottom: "0px",
                      width: "100%",
                    }}
                  />
                  <Heading1
                    color="var(--orange)"
                    paddingBlock=""
                    size="14px"
                    weight="600"
                    JFcontent="left"
                    marginBottom="0px"
                    width="auto"
                  >
                    <FontAwesomeIcon
                      icon={faBuilding}
                      style={{ color: "var(--orange)", marginRight: "8px" }}
                    />
                    Sources :
                  </Heading1>
                  <div
                    className="d-flex flex-row "
                    style={{
                      rowGap: "5px",
                      marginTop: "0.5rem",
                      overflow: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        marginBottom: ".4em",
                        marginLeft: ".5rem",
                      }}
                    >
                      <div
                        className=" d-flex"
                        style={{
                          columnGap: "8px",
                          rowGap: "10px",
                          width: "100%",
                          overflow: "auto",
                        }}
                      >
                        {/* {row.Responsible.map((responsibilityRow) => ( */}
                        {contractResult?.source_documents?.map((document) => (
                          <Chip
                            label={
                              document.metadata.doc_name +
                              ` (Page # ${
                                parseInt(document.metadata.page_no) + 1
                              })`
                            }
                            key={document.metadata.page_no}
                            className="chips"
                            size="small"
                          />
                        ))}
                      </div>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>

          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "96%" }}
          >
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="18px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "10px" }}
            >
              Source Document Search Results
            </Heading1>
            <Tooltip title="Add as refrence to email">
              <IconButton
                onClick={() => {
                  if (selectedRows) {
                    globalVars.contractRef = selectedRows;
                    navigate("/app/mails/create");
                  }
                }}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          </div>

          <div className="d-flex flex-column align-items-center">
            {contractResult.source_documents.map((para, i) => (
              <div
                className="AnsDetailscard TableCard mb-2 mt-1"
                style={{ padding: "6px", minHeight: "30px" }}
              >
                <div className="d-flex align-items-center w-100 justify-content-between">
                  <div className="d-flex flex-column" style={{}}>
                    <Accordion sx={{ boxShadow: "none" }}>
                      <AccordionSummary
                        sx={{ height: "20px" }}
                        expandIcon={<ExpandMoreIcon />}
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
                              marginRight: "12px",
                            }}
                          />
                          {para?.metadata.doc_name}
                        </Heading1>
                      </AccordionSummary>
                      {/*
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
                      {para?.Heading}
                    </Heading1> */}
                      <AccordionDetails>
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
                          {para?.page_content}
                        </Heading1>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                  <div>
                    <Box sx={{ marginLeft: "auto", display: "flex" }}>
                      <Checkbox
                        className="p-0"
                        onClick={() => {
                          var preAdded = false;
                          for (var i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i] === para) {
                              selectedRows.splice(i, 1);
                              preAdded = true;
                              break;
                            }
                          }
                          if (!preAdded) selectedRows.push(para);
                          console.log("ADDED TO LIST", selectedRows);
                        }}
                      />
                    </Box>
                  </div>
                  {/* 
                    
                      <MenuOpenIcon
                        onClick={() => previewDocument(para)}
                        sx={{
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      />
                  */}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else {
      view = <NoData description="No Data Found" />;
    }
  } else if (radioButtonValue == "Responsibility Matrix") {
    if (dataLoading) {
      view = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    } else if (searchResult.length > 0) {
      view = (
        <>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "96%" }}
          >
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="18px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "10px" }}
            >
              Intelligent Search Results
            </Heading1>
            <Tooltip title="Add as refrence to email">
              <IconButton
                onClick={() => {
                  if (selectedRows) {
                    globalVars.searchRef = selectedRows;
                    navigate("/app/mails/create");
                  }
                }}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          </div>

          {searchResult.map((row, i) => (
            <div
              className="ResponsibilityCards TableCard"
              // onClick={() => previewDocument(row)}
            >
              <div className="d-flex align-items-center">
                <Heading1
                  color="var(--warningRed)"
                  paddingBlock=""
                  size="14px"
                  weight="600"
                  JFcontent="left"
                  marginBottom="0px"
                >
                  <FontAwesomeIcon
                    onClick={() => previewDocument(row)}
                    icon={faHashtag}
                    style={{ color: "var(--warningRed)", marginRight: "8px" }}
                  />
                  {row["S/N"]}
                </Heading1>

                <Box sx={{ marginLeft: "auto", display: "flex" }}>
                  <MenuOpenIcon
                    onClick={() => previewDocument(row)}
                    sx={{
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />

                  <Checkbox
                    className="p-0"
                    onClick={() => {
                      var preAdded = false;
                      for (var i = 0; i < selectedRows.length; i++) {
                        if (selectedRows[i] === row) {
                          selectedRows.splice(i, 1);
                          preAdded = true;
                          break;
                        }
                      }
                      if (!preAdded) selectedRows.push(row);
                      console.log("ADDED TO LIST", selectedRows);
                    }}
                  />
                </Box>
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
              <Box sx={{ marginBottom: ".4em", marginTop: ".5em" }}>
                <div
                  className=" d-flex flex-wrap"
                  style={{ columnGap: "8px", rowGap: "10px" }}
                >
                  {row.Responsible.map((responsibilityRow) => (
                    <Chip
                      label={responsibilityRow}
                      key={responsibilityRow}
                      className="chips"
                      size="small"
                    />
                  ))}
                </div>
              </Box>
            </div>
          ))}
        </>
      );
    } else {
      view = <NoData description="No Data Found" />;
    }
  } else if (radioButtonValue == "Tender Addendums") {
    if (dataLoading) {
      console.log("if ma ata ha");

      view = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    } else if (tenderResult.length > 0) {
      view = (
        <>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "96%" }}
          >
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="18px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "10px" }}
            >
              Intelligent Search Results
            </Heading1>
            <Tooltip title="Add as refrence to email">
              <IconButton
                onClick={() => {
                  if (selectedRows) {
                    globalVars.tenderRef = selectedRows;
                    navigate("/app/mails/create");
                  }
                }}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          </div>

          {tenderResult.map((row, i) => (
            <div
              className="ResponsibilityCards TableCard"
              // onClick={() => previewDocument(row)}
            >
              <div className="d-flex align-items-center">
                <Heading1
                  color="var(--warningRed)"
                  paddingBlock=""
                  size="14px"
                  weight="600"
                  JFcontent="left"
                  marginBottom="0px"
                >
                  <FontAwesomeIcon
                    onClick={() => previewDocument(row)}
                    icon={faHashtag}
                    style={{ color: "var(--warningRed)", marginRight: "8px" }}
                  />
                  {row["Question"]}
                </Heading1>

                <Box sx={{ marginLeft: "auto", display: "flex" }}>
                  <MenuOpenIcon
                    onClick={() => previewDocument(row)}
                    sx={{
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />

                  <Checkbox
                    className="p-0"
                    onClick={() => {
                      var preAdded = false;
                      for (var i = 0; i < selectedRows.length; i++) {
                        if (selectedRows[i] === row) {
                          selectedRows.splice(i, 1);
                          preAdded = true;
                          break;
                        }
                      }
                      if (!preAdded) selectedRows.push(row);
                      console.log("ADDED TO LIST", selectedRows);
                    }}
                  />
                </Box>
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
    } else {
      console.log("else ma ata ha");
      view = <NoData description="No Data Found" />;
    }
  } else if (radioButtonValue == "BOQ") {
    if (dataLoading) {
      console.log("if ma ata ha");

      view = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    } else if (boqResult.length > 0) {
      view = (
        <>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "96%" }}
          >
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="18px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "10px" }}
            >
              Source Document Search Results
            </Heading1>
            <Tooltip title="Add as refrence to email">
              <IconButton
                onClick={() => {
                  if (selectedRows) {
                    globalVars.BOQRef = selectedRows;
                    navigate("/app/mails/create");
                  }
                }}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          </div>

          {boqResult.map((row, i) => (
            <div
              className="ResponsibilityCards TableCard"
              // onClick={() => previewDocument(row)}
              style={{ flexDirection: "row", flexWrap: "wrap" }}
            >
              <div className="d-flex align-items-center w-100 ">
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

                <Box sx={{ marginLeft: "auto", display: "flex" }}>
                  <MenuOpenIcon
                    onClick={() => previewDocument(row)}
                    sx={{
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />

                  <Checkbox
                    className="p-0"
                    onClick={() => {
                      var preAdded = false;
                      for (var i = 0; i < selectedRows.length; i++) {
                        if (selectedRows[i] === row) {
                          selectedRows.splice(i, 1);
                          preAdded = true;
                          break;
                        }
                      }
                      if (!preAdded) selectedRows.push(row);
                      console.log("ADDED TO LIST", selectedRows);
                    }}
                  />
                </Box>
              </div>

              <div
                className="d-flex flex-wrap w-100"
                style={{
                  columnGap: "10px",
                  rowGap: "10px",
                  marginTop: ".5em",
                }}
              >
                {row.Columns.map((attribute) => {
                  return <TableCardChips row={row} attribute={attribute} />;
                })}
              </div>
            </div>
          ))}
        </>
      );
    } else {
      console.log("else ma ata ha");
      view = <NoData description="No Data Found" />;
    }
  } else if (radioButtonValue === "MOM") {
    if (dataLoading) {
      view = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    } else if (Object.keys(momResult).length > 0) {
      view = (
        <>
          <Heading1
            color="var(--blue)"
            paddingInline="10px"
            paddingBlock=""
            size="18px"
            weight="600"
            JFcontent="left"
            marginBottom="0px"
            className="d-flex align-items-left"
            style={{ marginBlock: "10px" }}
          >
            Generative AI Search Results
          </Heading1>

          <div className="d-flex flex-column align-items-center">
            {/* {contractResult.map((para, i) => ( */}
            <div className="AnsDetailscard TableCard mb-2 mt-1">
              <div className="d-flex align-items-center w-100 justify-content-between">
                <div className="d-flex flex-column" style={{ rowGap: "5px" }}>
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
                    <p>
                      {isExpanded
                        ? momResult?.answer
                        : `${momResult?.answer.slice(0, 500)}`}
                      {momResult?.answer.length > 500 && (
                        <span
                          style={{ color: "black", cursor: "pointer" }}
                          onClick={toggleExpand}
                        >
                          {isExpanded ? ".... Show Less" : ".... Show More"}
                        </span>
                      )}
                    </p>
                    {/* {momResult?.answer} */}
                  </Heading1>
                  <Divider sx={{ marginTop: "5px", marginBottom: "0px" }} />
                  <div
                    className="d-flex flex-row "
                    style={{ rowGap: "5px", marginTop: "0.5rem" }}
                  >
                    <Heading1
                      color="var(--orange)"
                      paddingBlock=""
                      size="14px"
                      weight="600"
                      JFcontent="left"
                      marginBottom="0px"
                      width="auto"
                    >
                      <FontAwesomeIcon
                        icon={faBuilding}
                        style={{ color: "var(--orange)", marginRight: "8px" }}
                      />
                      Sources :
                    </Heading1>
                    <Box
                      sx={{
                        marginBottom: ".4em",
                        marginLeft: ".5rem",
                      }}
                    >
                      <div
                        className=" d-flex"
                        style={{ columnGap: "8px", rowGap: "10px" }}
                      >
                        {/* {row.Responsible.map((responsibilityRow) => ( */}
                        {momResult?.source_documents?.map((document) => (
                          <Chip
                            label={
                              document.metadata.doc_name +
                              ` (Page # ${
                                parseInt(document.metadata.page_no) + 1
                              })`
                            }
                            key={document.metadata.page_no}
                            className="chips"
                            size="small"
                          />
                        ))}
                        {/* ))} */}
                      </div>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "96%" }}
          >
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="18px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "10px" }}
            >
              Source Document Search Results
            </Heading1>
            <Tooltip title="Add as refrence to email">
              <IconButton
                onClick={() => {
                  if (selectedRows) {
                    globalVars.MOMRef = selectedRows;
                    navigate("/app/mails/create");
                  }
                }}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          </div>

          {/* {momResult.source_documents.map((row, i) => (
            <div
              className="ResponsibilityCards TableCard"
              // onClick={() => previewDocument(row)}
            >
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
                  {row["name"]}
                </Heading1>

                <Box sx={{ marginLeft: "auto", display: "flex" }}>
                  <MenuOpenIcon
                    onClick={() => previewDocument(row)}
                    sx={{
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  />

                  <Checkbox
                    className="p-0"
                    onClick={() => {
                      var preAdded = false;
                      for (var i = 0; i < selectedRows.length; i++) {
                        if (selectedRows[i] === row) {
                          selectedRows.splice(i, 1);
                          preAdded = true;
                          break;
                        }
                      }
                      if (!preAdded) selectedRows.push(row);
                      console.log("ADDED TO LIST", selectedRows);
                    }}
                  />
                </Box>
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
                {row["Label"]}
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
                {row["Text"]}
              </Heading1>
            </div>
          ))} */}
          <div className="d-flex flex-column align-items-center">
            {momResult.source_documents.map((para, i) => (
              <div
                className="AnsDetailscard TableCard mb-2 mt-1"
                style={{ padding: "6px", minHeight: "30px" }}
              >
                <div className="d-flex align-items-center w-100 justify-content-between">
                  <div className="d-flex flex-column" style={{}}>
                    <Accordion sx={{ boxShadow: "none" }}>
                      <AccordionSummary
                        sx={{ height: "20px" }}
                        expandIcon={<ExpandMoreIcon />}
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
                              marginRight: "12px",
                            }}
                          />
                          {para?.metadata.doc_name}
                        </Heading1>
                      </AccordionSummary>
                      {/*
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
                      {para?.Heading}
                    </Heading1> */}
                      <AccordionDetails>
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
                          {para?.page_content}
                        </Heading1>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                  <div>
                    <Box sx={{ marginLeft: "auto", display: "flex" }}>
                      <Checkbox
                        className="p-0"
                        onClick={() => {
                          var preAdded = false;
                          for (var i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i] === para) {
                              selectedRows.splice(i, 1);
                              preAdded = true;
                              break;
                            }
                          }
                          if (!preAdded) selectedRows.push(para);
                          console.log("ADDED TO LIST", selectedRows);
                        }}
                      />
                    </Box>
                  </div>
                  {/* <div>
                    <Box sx={{ marginLeft: "auto", display: "flex" }}>
                      <MenuOpenIcon
                        onClick={() => previewDocument(para)}
                        sx={{
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      />
                      <Checkbox
                        className="p-0"
                        onClick={() => {
                          var preAdded = false;
                          for (var i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i] === para) {
                              selectedRows.splice(i, 1);
                              preAdded = true;
                              break;
                            }
                          }
                          if (!preAdded) selectedRows.push(para);
                          console.log("ADDED TO LIST", selectedRows);
                        }}
                      />
                    </Box>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else {
      console.log("else ma ata ha");
      view = <NoData description="No Data Found" />;
    }
    console.log("acjaaaa", view);
  } else if (radioButtonValue == "Other") {
    if (dataLoading) {
      view = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      );
    } else if (Object.keys(otherResult).length > 0) {
      view = (
        <>
          <Heading1
            color="var(--blue)"
            paddingInline="10px"
            paddingBlock=""
            size="18px"
            weight="600"
            JFcontent="left"
            marginBottom="0px"
            className="d-flex align-items-left"
            style={{ marginBlock: "10px" }}
          >
            Generative AI Search Results
          </Heading1>

          <div className="d-flex flex-column align-items-center">
            {/* {contractResult.map((para, i) => ( */}
            <div className="AnsDetailscard TableCard mb-2 mt-1">
              <div className="d-flex align-items-center w-100 justify-content-between">
                <div className="d-flex flex-column" style={{ rowGap: "5px" }}>
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
                    <p>
                      {isExpanded
                        ? otherResult?.answer
                        : `${otherResult?.answer.slice(0, 500)}`}
                      {otherResult?.answer.length > 500 && (
                        <span
                          style={{ color: "black", cursor: "pointer" }}
                          onClick={toggleExpand}
                        >
                          {isExpanded ? ".... Show Less" : ".... Show More"}
                        </span>
                      )}
                    </p>
                    {/* {otherResult?.answer} */}
                  </Heading1>
                  <Divider sx={{ marginTop: "5px", marginBottom: "0px" }} />
                  <div
                    className="d-flex flex-row "
                    style={{ rowGap: "5px", marginTop: "0.5rem" }}
                  >
                    <Heading1
                      color="var(--orange)"
                      paddingBlock=""
                      size="14px"
                      weight="600"
                      JFcontent="left"
                      marginBottom="0px"
                      width="auto"
                    >
                      <FontAwesomeIcon
                        icon={faBuilding}
                        style={{ color: "var(--orange)", marginRight: "8px" }}
                      />
                      Sources :
                    </Heading1>
                    <Box
                      sx={{
                        marginBottom: ".4em",
                        marginLeft: ".5rem",
                      }}
                    >
                      <div
                        className=" d-flex"
                        style={{ columnGap: "8px", rowGap: "10px" }}
                      >
                        {/* {row.Responsible.map((responsibilityRow) => ( */}
                        {otherResult?.source_documents?.map((document) => (
                          <Chip
                            label={
                              document.metadata.doc_name +
                              ` (Page # ${
                                parseInt(document.metadata.page_no) + 1
                              })`
                            }
                            key={document.metadata.page_no}
                            className="chips"
                            size="small"
                          />
                        ))}
                        {/* ))} */}
                      </div>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
            {/* ))} */}
          </div>
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "96%" }}
          >
            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="18px"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "10px" }}
            >
              Source Document Search Results
            </Heading1>
            <Tooltip title="Add as refrence to email">
              <IconButton
                onClick={() => {
                  if (selectedRows) {
                    globalVars.contractRef = selectedRows;
                    navigate("/app/mails/create");
                  }
                }}
              >
                <BookIcon />
              </IconButton>
            </Tooltip>
          </div>

          <div className="d-flex flex-column align-items-center">
            {otherResult.source_documents.map((para, i) => (
              <div className="AnsDetailscard TableCard mb-2 mt-1">
                <div className="d-flex align-items-center w-100 justify-content-between">
                  <div className="d-flex flex-column" style={{}}>
                    {/* <Heading1
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
                      Source #{i + 1}
                    </Heading1> */}
                    <Accordion sx={{ boxShadow: "none" }}>
                      <AccordionSummary
                        sx={{ height: "20px" }}
                        expandIcon={<ExpandMoreIcon />}
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
                              marginRight: "12px",
                            }}
                          />
                          {para?.metadata.doc_name}
                        </Heading1>
                      </AccordionSummary>
                      {/*
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
                      {para?.Heading}
                    </Heading1> */}
                      <AccordionDetails>
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
                          {para?.page_content}
                        </Heading1>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                  <div>
                    <Box sx={{ marginLeft: "auto", display: "flex" }}>
                      {/* <MenuOpenIcon
                        onClick={() => previewDocument(para)}
                        sx={{
                          marginRight: "8px",
                          cursor: "pointer",
                        }}
                      /> */}
                      <Checkbox
                        className="p-0"
                        onClick={() => {
                          var preAdded = false;
                          for (var i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i] === para) {
                              selectedRows.splice(i, 1);
                              preAdded = true;
                              break;
                            }
                          }
                          if (!preAdded) selectedRows.push(para);
                          console.log("ADDED TO LIST", selectedRows);
                        }}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Heading1
            color="var(--blue)"
            paddingInline="10px"
            paddingBlock=""
            size="18px"
            weight="600"
            JFcontent="left"
            marginBottom="0px"
            className="d-flex align-items-left"
            style={{ marginBlock: "10px" }}
          >
            Intelligent Search Results
          </Heading1>
          {Object.keys(otherResult).length > 0 &&
            otherTableResult.map((row, i) => (
              <div
                className="ResponsibilityCards TableCard"
                // onClick={() => previewDocument(row)}
                style={{ flexDirection: "row", flexWrap: "wrap" }}
              >
                <div className="d-flex align-items-center w-100 ">
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

                  <Box sx={{ marginLeft: "auto", display: "flex" }}>
                    <MenuOpenIcon
                      onClick={() => previewDocument(row)}
                      sx={{
                        marginRight: "8px",
                        cursor: "pointer",
                      }}
                    />

                    <Checkbox
                      className="p-0"
                      onClick={() => {
                        var preAdded = false;
                        for (var i = 0; i < selectedRows.length; i++) {
                          if (selectedRows[i] === row) {
                            selectedRows.splice(i, 1);
                            preAdded = true;
                            break;
                          }
                        }
                        if (!preAdded) selectedRows.push(row);
                        console.log("ADDED TO LIST", selectedRows);
                      }}
                    />
                  </Box>
                </div>

                <div
                  className="d-flex flex-wrap w-100"
                  style={{
                    columnGap: "10px",
                    rowGap: "10px",
                    marginTop: ".5em",
                  }}
                >
                  {row.Columns.map((attribute) => {
                    return <TableCardChips row={row} attribute={attribute} />;
                  })}
                </div>
              </div>
            ))}
        </>
      );
    } else {
      view = <NoData description="No Data Found" />;
    }
  }

  return (
    <>
      <Helmet>
        <title>Customers | Material Kit</title>
      </Helmet>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Main open={open} sx={{ marginRight: "0px" }}>
          {" "}
          <Box
            sx={{
              backgroundColor: "background.default",
              minHeight: "100%",
              py: 3,
            }}
          >
            <Grid>
              {/* ************************************** FILTER ************************************** */}
              <Fade right>
                <div
                  className={`${
                    FiltersClicked
                      ? "filtersContainer filterHeight "
                      : "filtersContainer"
                  }`}
                >
                  <Grid container direction="column" spacing={0.5}>
                    <Grid
                      container
                      direction="row"
                      spacing={0.5}
                      alignItems="center"
                    >
                      <Grid
                        item
                        xs={8}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {radioButtonValue == "Responsibility Matrix" ? (
                          <b
                            style={{
                              color: "var(--blue)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Who is responsible for:{" "}
                          </b>
                        ) : null}

                        <TextField
                          onKeyPress={(ev) => {
                            console.log(`Pressed keyCode ${ev.key}`);
                            if (ev.key === "Enter" && !dataLoading) {
                              // console.log("vallll", ev.target.value);
                              // setsearchText(ev.target.value);

                              // Do code here
                              ev.preventDefault();
                              onSubmitSearch();
                            }
                          }}
                          id="searchbox"
                          label="Search inside contractual documents"
                          type="search"
                          size="small"
                          style={{ marginLeft: "0px" }}
                          className="searchbox"
                          value={searchText}
                          onChange={(event) => {
                            setsearchText(event.target.value);
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          disabled={dataLoading}
                          onClick={onSubmitSearch}
                          endIcon={<SearchIcon />}
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>

                    <Grid container sx={12}>
                      <Grid item xs={4}>
                        <Autocomplete
                          id="asynchronous-demo"
                          sx={{ width: "100%", marginTop: 1 }}
                          open={openAuto}
                          onOpen={() => {
                            setOpenAuto(true);
                          }}
                          onClose={() => {
                            setOpenAuto(false);
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.name === value.name
                          }
                          onChange={(event, value) => {
                            console.log("valuedssf", value);
                            setSubcontractorType(value);
                          }}
                          getOptionLabel={(option) => option.name}
                          options={options}
                          loading={loading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="Entity name"
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
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControl
                          sx={{ width: "98%", marginTop: 1, marginLeft: 1 }}
                          size="small"
                        >
                          <InputLabel id="demo-select-small">
                            Document Type
                          </InputLabel>
                          <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={radioButtonValue}
                            label="Document Type"
                            onChange={handleRadioButtonChange}
                          >
                            {documentCats.map((name) => (
                              <MenuItem key={name} value={name}>
                                {name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        {isOtherDoc(radioButtonValue) ? (
                          <Autocomplete
                            id="asynchronous-demo"
                            sx={{ width: "100%", marginTop: 1, marginLeft: 1 }}
                            size="small"
                            // isOptionEqualToValue={(option, value) => option.name === value.name}
                            options={otherCats}
                            onChange={(e, value) => {
                              onChangeHandlerOtherDocCat(value);
                            }}
                            value={otherDocumentCategory}
                            open={openOtherCat}
                            onOpen={() => {
                              setOtherCats([]);
                              setOpenOtherCat(true);
                            }}
                            onClose={() => {
                              setOpenOtherCat(false);
                            }}
                            loading={loadingCat}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Other Type"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <React.Fragment>
                                      {loadingCat ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </React.Fragment>
                                  ),
                                }}
                                onChange={(e, value) => {
                                  onChangeHandlerOtherDocCat(value);
                                }}
                              />
                            )}
                          />
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Fade>

              <Container maxWidth={false}></Container>
            </Grid>

            <div>
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "96%" }}
              ></div>

              {view}
            </div>
          </Box>
        </Main>
        <Drawer
          className=""
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,

              boxShadow: "-3px 0px 15px 0px rgb(0 0 0 / 31%)",
            },
          }}
          // variant="persistent"
          hideBackdrop="True"
          anchor="right"
          open={open}
        >
          <div className="p-3 DrawerFlex docextractionDrawer">
            <div className="w-100 mr-3">
              <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronLeftIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </IconButton>
              </DrawerHeader>

              <div style={{ paddingInline: "20px" }}>
                {raw_Texts.length && (
                  <HighlighterAiSearch
                    docUrl={docUrl}
                    highlights={raw_Texts}
                    isAiSearch={true}
                  />
                )}
                {/* <iframe
                  src={docUrl}
                  width="100%"
                  style={{ height: "80vh" }}
                ></iframe> */}
              </div>
            </div>

            <div className="sideline"></div>
          </div>
        </Drawer>
      </Box>
    </>
  );
}
const documentCats = [
  "Contracts",
  "Responsibility Matrix",
  "Tender Addendums",
  "BOQ",
  "MOM",
  "Other",
];
