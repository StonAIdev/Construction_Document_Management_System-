import { Link, useNavigate } from "react-router-dom";

import PDFMerger from "pdf-merger-js/browser";
import _ from "lodash"; // cool kids know _ is low-dash
import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Checkbox from "@mui/material/Checkbox";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CoverPageContext from "../context/CoverPageContext";
import "../../src/components/CoverPage/covepage.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import PdfDocument from "../components/shopDrawing/prepareShopDrawing/PdfDocument";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { PDFViewer, pdf, ReactPDF, BlobProvider } from "@react-pdf/renderer";
import MethodStatementTemplate from "../components/CoverPage/MethodStatementTemplate";
import Modal from "@mui/material/Modal";
import CoverPageCommentList from "../components/CoverPage/CoverPageCommentList";
import { PostComment } from "../components/CoverPage/PostComment";
import { Paper } from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  FormGroup,
} from "@mui/material";
import AddShopDrawingList from "../components/shopDrawing/prepareShopDrawing/AddShopDrawingList";

import { Divider } from "@mui/material";
import { url } from "../url";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import Heading1 from "../Reusable Components/Headings/Heading1";
import {
  styled,
  useTheme,
  createStyles,
  makeStyles,
  Theme,
} from "@mui/material/styles";
import { useSnackbar } from "notistack";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import { keyframes } from "@emotion/react";
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

const comments = [
  {
    id: 1,
    replyComment: [{ id: 1, tagUser: "taf", postedAt: "14 August 1947" }],
    name: "Saad",
    message: "This is my message",
    avatarUrl:
      "https://gravatar.com/avatar/16ecce3f8626fe4624164e3c31cb55e4?s=400&d=robohash&r=x",

    users: [
      {
        name: "Saad",
        avatarUrl:
          "https://gravatar.com/avatar/16ecce3f8626fe4624164e3c31cb55e4?s=400&d=robohash&r=x",
      },
    ],
  },
];

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const Input = styled("input")({
  display: "none",
});
var server_url = url;
var mergedPdfFile = {};

const CoverPageMethodStatementSubmittal = ({
  setUser,
  user,
  userInfo,
  setUserInfo,
  project,
  userPosition,
}) => {
  var FetchedLogoList = useRef({
    uploadLogo1: {
      file: null,
      show: true,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo2: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo3: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo4: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo5: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo6: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
  });
  const [logoList, setlogoList] = useState({
    uploadLogo1: {
      file: null,
      show: true,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo2: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo3: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo4: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo5: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
    uploadLogo6: {
      file: null,
      show: false,
      blob: "",
      name: "",
      type: "",
      size: 0,
      changed: false,
    },
  });
  const [headerLogo, setHeaderLogo] = useState({
    uploadLogo1: "",
    uploadLogo2: "",
    uploadLogo3: "",
    uploadLogo4: "",
    uploadLogo5: "",
    uploadLogo6: "",
  });

  const [logoCount, setLogoCount] = useState(1);
  const [mergedPdfUrl, setMergedPdfUrl] = useState();
  const [files, setFiles] = useState([]);
  const [uploadLogo1, setUploadLogo1] = useState({
    blob: "",
    name: "",
    type: "",
    size: 0,
  });
  const [uploadLogo2, setUploadLogo2] = useState({
    blob: "",
    name: "",
    type: "",
    size: 0,
  });
  const [uploadLogo3, setUploadLogo3] = useState({
    blob: "",
    name: "",
    type: "",
    size: 0,
  });
  const [uploadLogo4, setUploadLogo4] = useState({
    blob: "",
    name: "",
    type: "",
    size: 0,
  });
  const [uploadLogo5, setUploadLogo5] = useState({
    blob: "",
    name: "",
    type: "",
    size: 0,
  });
  const [uploadLogo6, setUploadLogo6] = useState({
    blob: "",
    name: "",
    type: "",
    size: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState("");
  const navigate = useNavigate();
  const [viewPDF, setViewPDF] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [valuesG, setValuesG] = React.useState({});
  //Added Here
  const [date, setDate] = React.useState(new Date().toLocaleString());
  const [consultantDate, setConsultantDate] = React.useState(null);
  const [clientDate, setClientDate] = React.useState(null);

  //Added Here
  const SubmittalEntityRef = useRef({
    abbreviation_contractor: "",
    abbreviation_contractor: "",
    //Change here
    sub_type: "MS",
  });

  const [contractorDate, setContractorDate] = React.useState(null);
  const [subContractorDate, setSubContractorDate] = React.useState(null);
  const [discipline, setDiscipline] = React.useState(null);
  const [selectedProject, setProject] = React.useState(null);
  const [selectedStatus, setStatus] = React.useState(null);

  const [value, setValue] = React.useState();
  const [isLoading, setLoading] = useState(false);
  const [rows, setRows] = React.useState([]);
  const [editRowsModel, setEditRowsModel] = React.useState({});

  //Added Here
  const [showSelectCoverId, setShowSelectCoverId] = useState(false);
  const [openSelectId, setOpenSelectId] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loadingSelected, setLoadingSelected] = useState(false);

  var checkHeaderAndLogo = false;
  var checkSizeAndType = false;

  const [enclosureOther, setenclosureOther] = useState(false);
  const [state, setState] = React.useState({
    Structural: false,
    Architectural: false,
    Mechanical: false,
    Electrical: false,
    Plumbing: false,
    Interior: false,
    Landscape: false,
    other: false,
  });
  const {
    Structural,
    Architectural,
    Mechanical,
    Electrical,
    Plumbing,
    Interior,
    Landscape,
    other,
  } = state;

  const [Enclosure, setEnclosure] = React.useState({
    InspectionTestPlan: false,
    RiskAssessment: false,
    otherEnclosure: false,
  });
  const { InspectionTestPlan, RiskAssessment, otherEnclosure } = Enclosure;
  const handleChangeCheckbox = (event) => {
    if (event.target.name === "other" && event.target.checked === false) {
      setDiscipline(false);
    }
    if (event.target.name === "other" && event.target.checked === true) {
      setDiscipline(true);
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
    } else {
      setState({
        ...state,
        [event.target.name]: event.target.checked,
      });
    }
  };
  const handleEnclosure = (event) => {
    if (
      event.target.name === "otherEnclosure" &&
      event.target.checked === false
    ) {
      setenclosureOther(false);
    }
    if (
      event.target.name === "otherEnclosure" &&
      event.target.checked === true
    ) {
      setenclosureOther(true);
      setEnclosure({
        ...Enclosure,
        [event.target.name]: event.target.checked,
      });
    } else {
      setEnclosure({
        ...Enclosure,
        [event.target.name]: event.target.checked,
      });
    }
  };
  const formikValuesReference = useRef({
    header_logo_1: "",
    header_logo_2: "",
    header_logo_3: "",
    header_logo_4: "",
    header_logo_5: "",
    header_logo_6: "",
    MainContractor: "",
    Client: "",
    Consultant: "",
    Subcontractor: "",
    projectName: "",
    country: "",
    building: "",
    street: "",
    floor: "",
    SUBMITTAL_NO: "",
    Date: "",
    location: "",
    SUBMITTAL_TITLE: "",
    Discipline: "",
    Status: "",
    consultant_name: "",
    Document_title: "Shop Drawing Submittal",
    consultant_position: "",
    consultant_signature: "",
    consultant_datee: "",
    consultant_comments: "",
    contractor_name: "",
    contractor_position: "",
    contractor_signature: "",
    contractor_date: "",
    contractor_comments: "",
    sub_contractor_name: "",
    sub_contractor_position: "",
    sub_contractor_signature: "",
    sub_contractor_date: "",
    client_date: "",
    sub_contractor_comments: "",
    doc_ctrl_comments: "",
    drawing_list: [],
    uploadHeaderLogo: [],

    // files: [],
  });
  const coverPagePhaseRef = useRef("preparation");
  const [canActionOnForm, setCanActionOnForm] = useState(false);
  const disabledRef = useRef(false);
  const disableComments = useRef(false);
  const [coverPageOf, setCoverPageOf] = useState("");
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentsList, setComments_list] = useState([]);
  const theme = useTheme();
  var submitType = "";
  const disableFields = async () => {
    if (coverPagePhaseRef.current !== "preparation") {
      disabledRef.current = true;
    } else {
      disabledRef.current = false;
    }
  };
  const handleDrawerClose = () => {
    if (openDrawer === true) {
      setOpenDrawer(false);
    } else {
      setOpenDrawer(true);
    }
  };
  const getfileurl = async (document_id) => {
    try {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          document_id
      );
      var element = {};
      element["urls"] = response.data.uploadURL;
      element["document_id"] = document_id;

      return element;
    } catch (error) {
      console.log("error", error);
    }
  };

  // Added Here
  const getSubmittalNumberEntities = async () => {
    try {
      const res = await axios.post(
        url + "/CoverPage/getCoverPageEntities",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );

      SubmittalEntityRef.current = {
        ...SubmittalEntityRef.current,
        abbreviation_contractor: res.data[0].abbreviation_contractor,
        abbreviation_project: res.data[0].abbreviation_project,
      };
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const initialiseCoverPage = async () => {
    //Added Here
    await getSubmittalNumberEntities();
    if (coverPageOf === "") {
      setCoverPageOf(CoverPageContext.coverPageOf);
    }
    if (CoverPageContext.creatingOrEditing === "create") {
      // if the user open from create cover page

      disableComments.current = true;
    } else if (CoverPageContext.creatingOrEditing === "edit") {
      // if the user open from edit cover page

      await getCoverPageDetails(CoverPageContext.coverpage_id);
    }
    ActionOnForm();
    getProjectUsers();
  };

  useEffect(() => {
    //Added here
    setLoading(true);
    initialiseCoverPage();
  }, []);
  const { enqueueSnackbar } = useSnackbar();
  const snackBar = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const handleEditRowsModelChange = React.useCallback((model) => {
    setEditRowsModel(model);
  }, []);

  const changedisciplineHandler = (event) => {
    setDiscipline(event.target.value);
  };

  const dateFormatChange = (newValue) => {
    var month = newValue.getMonth() + 1;
    var day = newValue.getDate();
    var year = newValue.getFullYear();
    return month + "/" + day + "/" + year;
  };

  const changeDateHandler = (newValue) => {
    if (newValue != "Invalid Date" && newValue != null) {
      var myDate = dateFormatChange(newValue);
      setDate(myDate);
      setIsError(false);
      setErrMsg("");
    } else {
      setDate(null);
    }
  };
  const addLogo = () => {
    if (logoCount <= 6) {
      setLogoCount(logoCount + 1);
    }
  };
  const AddLogoBox = () => {
    return (
      <Button className="Center-P flex-column " onClick={addLogo}>
        <div className="Center-P Addlogobox">{/* <AddIcon /> */}+</div>
      </Button>
    );
  };
  const changeConsultantDateHandler = (newValue) => {
    if (newValue != "Invalid Date" && newValue != null) {
      var myDate = dateFormatChange(newValue);
      setConsultantDate(myDate);
    } else {
      setConsultantDate(null);
    }
  };
  const changeClientDateHandler = (newValue) => {
    if (newValue != "Invalid Date" && newValue != null) {
      var myDate = dateFormatChange(newValue);
      setClientDate(myDate);
    } else {
      setClientDate(null);
    }
  };
  const handleSelectedReceiverChange = (e, option) => {
    setSelectedReceivers(option);
  };

  const handleSelectedApprovalChange = (e, option) => {
    setSelectedApprovals(option);
  };
  const changeContractorDateHandler = (newValue) => {
    if (newValue != "Invalid Date" && newValue != null) {
      var myDate = dateFormatChange(newValue);
      setContractorDate(myDate);
    } else {
      setContractorDate(null);
    }
  };
  const changeSubContractorDateHandler = (newValue) => {
    if (newValue != "Invalid Date" && newValue != null) {
      var myDate = dateFormatChange(newValue);
      setSubContractorDate(myDate);
    } else {
      setSubContractorDate(null);
    }
  };

  const handleChangeUpload = (event) => {
    const uploadFile = event.target.files[0];
    if (uploadFile) {
      setFiles(event.target.files[0]);
    } else {
      setFiles([]);
    }
    setIsError(false);
  };

  const backFromPreview = () => {
    formikValuesReference.current.uploadHeaderLogo = [];
    checkHeaderAndLogo = false;
    checkSizeAndType = false;
    setIsError(false);
    setErrMsg("");
    setViewPDF(false);
  };

  const sizeTypeLogoCheck = () => {
    if (uploadLogo1.type != "") {
      if (
        uploadLogo1.size > 5000000 ||
        (uploadLogo1.type != "image/png" &&
          uploadLogo1.type != "image/jpeg" &&
          uploadLogo1.type != "image/jpg")
      ) {
        checkSizeAndType = true;
      }
    }
    if (uploadLogo2.type != "") {
      if (
        uploadLogo2.size > 5000000 ||
        (uploadLogo2.type != "image/png" &&
          uploadLogo2.type != "image/jpeg" &&
          uploadLogo2.type != "image/jpg")
      ) {
        checkSizeAndType = true;
      }
    }
    if (uploadLogo3.type != "") {
      if (
        uploadLogo3.size > 5000000 ||
        (uploadLogo3.type != "image/png" &&
          uploadLogo3.type != "image/jpeg" &&
          uploadLogo3.type != "image/jpg")
      ) {
        checkSizeAndType = true;
      }
    }
    if (uploadLogo4.type != "") {
      if (
        uploadLogo4.size > 5000000 ||
        (uploadLogo4.type != "image/png" &&
          uploadLogo4.type != "image/jpeg" &&
          uploadLogo4.type != "image/jpg")
      ) {
        checkSizeAndType = true;
      }
    }
    if (uploadLogo5.type != "") {
      if (
        uploadLogo5.size > 5000000 ||
        (uploadLogo5.type != "image/png" &&
          uploadLogo5.type != "image/jpeg" &&
          uploadLogo5.type != "image/jpg")
      ) {
        checkSizeAndType = true;
      }
    }
    if (uploadLogo6.type != "") {
      if (
        uploadLogo6.size > 5000000 ||
        (uploadLogo6.type != "image/png" &&
          uploadLogo6.type != "image/jpeg" &&
          uploadLogo6.type != "image/jpg")
      ) {
        checkSizeAndType = true;
      }
    }
  };

  const convertImageToBlob = (id, uploadLogo) => {
    const reader = new FileReader();
    reader.onloadend = function (e) {
      setlogoList({
        ...logoList,
        [id]: {
          ...logoList[id],
          show: true,
          file: uploadLogo,
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
          changed: true,
        },
      });
    };
    reader.readAsDataURL(uploadLogo);
  };
  const convertFileToBlob = async (id, uploadLogo) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(
          (FetchedLogoList.current = {
            ...FetchedLogoList.current,
            [id]: {
              ...FetchedLogoList.current[id],
              show: true,
              file: uploadLogo,
              blob: reader.result,
              name: uploadLogo.name,
              type: uploadLogo.type,
              size: uploadLogo.size,
              changed: false,
            },
          })
        );
      reader.readAsDataURL(uploadLogo);
    });
  };
  const convertUrlToBlob = async (url, name, defaultType = "image/jpeg") => {
    let response = await fetch(url);
    let data = await response.blob();
    return new File([data], name, {
      type: data.type || defaultType,
    });
  };
  const handleChangeUploadLogo1 = (event, key) => {
    const uploadLogo = event.target.files[0];

    if (uploadLogo) {
      convertImageToBlob(key, uploadLogo);
    } else {
      setlogoList({
        ...logoList,
        [key]: {
          ...logoList[key],
          file: null,
          blob: "",
          name: "",
          type: "",
          size: 0,
          changed: false,
        },
      });
    }
  };
  const handleChangeHeaderLogo = (event, key) => {
    setHeaderLogo({ ...headerLogo, [key]: event.target.value });
  };
  const uploadMultipleLogos = async (logos, coverpage_id) => {
    for (const key in logos) {
      if (logos[key].file && logos[key].changed)
        putFileToS3(coverpage_id, key, logos[key].file);
    }
    return true;
  };
  const putFileToS3 = async (coverpage_id, key, logoFile) => {
    try {
      const response = await axios(
        "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
          coverpage_id +
          key
      );
      const url = response.data.uploadURL;

      var config = {
        headers: { "content-type": logoFile.type },
      };
      await axios.put(url, logoFile, config);
    } catch (error) {
      throw error;
    }
  };
  const onImageClose = (e, id) => {
    setlogoList({
      ...logoList,
      [id]: {
        ...logoList[id],
        file: null,
        blob: "",
        name: "",
        type: "",
        size: 0,
        changed: false,
      },
    });
  };

  const handleDrawingListChange = (event) => {
    setValue(event.target.value);
  };
  const onsubmitDrawingList = (values) => {
    const val = {
      id: rows.length ? rows.length + 1 : 1,
      drawing_number: values.drawing_number,
      discription: values.discription,
      status: values.Status,
      remarks: values.remarks,
    };
    var newArray = rows.slice();
    newArray.push(val);
    setRows(newArray);
  };
  const onStateChangeDataGrid = (model) => {};

  const pushingLogosInUploadHeaderLogo = async (values) => {
    try {
      if (logoList?.uploadLogo1?.blob !== "") {
        // const uploadLogo1 = await convertUrlToBlob(
        //   logoList?.uploadLogo1?.blob,
        //   "uploadLogo1"
        // );
        values.uploadHeaderLogo.push({
          blob: logoList?.uploadLogo1?.blob,
          header: values?.headerLogo?.uploadLogo1,
        });
      }
      if (logoList?.uploadLogo2?.blob !== "") {
        values.uploadHeaderLogo.push({
          blob: logoList?.uploadLogo2?.blob,
          header: values?.headerLogo?.uploadLogo2,
        });
      }
      if (logoList?.uploadLogo3?.blob !== "") {
        values.uploadHeaderLogo.push({
          blob: logoList?.uploadLogo3?.blob,
          header: values?.headerLogo?.uploadLogo3,
        });
      }
      if (logoList?.uploadLogo4?.blob !== "") {
        values.uploadHeaderLogo.push({
          blob: logoList?.uploadLogo4?.blob,
          header: values?.headerLogo?.uploadLogo4,
        });
      }
      if (logoList?.uploadLogo5?.blob !== "") {
        values.uploadHeaderLogo.push({
          blob: logoList?.uploadLogo5?.blob,
          header: values?.headerLogo?.uploadLogo5,
        });
      }
      if (logoList?.uploadLogo6?.blob !== "") {
        values.uploadHeaderLogo.push({
          blob: logoList?.uploadLogo6?.blob,
          header: values?.headerLogo?.uploadLogo6,
        });
      }
    } catch (error) {
      console.log("erro", error);
    }
  };
  const getProjectUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        url + "/userInfo/getProjectUsers",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
    setLoading(false);
  };
  const missingLogoHeaderCheck = (values) => {
    if ((values.header_logo_1 ? 1 : 0) ^ (uploadLogo1.blob ? 1 : 0)) {
      checkHeaderAndLogo = true;
    }
    if ((values.header_logo_2 ? 1 : 0) ^ (uploadLogo2.blob ? 1 : 0)) {
      checkHeaderAndLogo = true;
    }
    if ((values.header_logo_3 ? 1 : 0) ^ (uploadLogo3.blob ? 1 : 0)) {
      checkHeaderAndLogo = true;
    }
    if ((values.header_logo_4 ? 1 : 0) ^ (uploadLogo4.blob ? 1 : 0)) {
      checkHeaderAndLogo = true;
    }
    if ((values.header_logo_5 ? 1 : 0) ^ (uploadLogo5.blob ? 1 : 0)) {
      checkHeaderAndLogo = true;
    }
    if ((values.header_logo_6 ? 1 : 0) ^ (uploadLogo6.blob ? 1 : 0)) {
      checkHeaderAndLogo = true;
    }
  };
  const getLogoFromS3 = async (key, coverPage_id) => {
    try {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          coverPage_id +
          key
      );

      const res = await fetch(response.data.uploadURL);
      const uploadLogo = await res.blob();
      if (uploadLogo) {
        await convertFileToBlob(key, uploadLogo);
      } else {
        FetchedLogoList.current = {
          ...FetchedLogoList.current,
          [key]: {
            ...FetchedLogoList.current[key],
            file: null,
            blob: "",
            name: "",
            type: "",
            size: 0,
            changed: false,
          },
        };
      }
    } catch (error) {
      console.log("error", error.response);
    }
  };
  const fetchLogoFromS3 = async (coverPage_id, varLogoList) => {
    for (const key in varLogoList) {
      if (varLogoList[key].name !== "") await getLogoFromS3(key, coverPage_id);
    }
  };
  const getlogos = async (coverPage_id, logoList) => {
    await fetchLogoFromS3(coverPage_id, logoList);
  };
  const ActionOnForm = () => {
    if (coverPagePhaseRef.current === "preparation") {
      setCanActionOnForm(true);
    } else if (
      coverPagePhaseRef.current === "review" &&
      formikValuesReference?.current?.receivers_list.some(
        (receiver) => receiver.user_id === user.user_id
      )
    ) {
      setCanActionOnForm(true);
    } else if (
      coverPagePhaseRef.current === "issue" &&
      formikValuesReference?.current?.approvals_list.some(
        (receiver) => receiver.user_id === user.user_id
      )
    ) {
      setCanActionOnForm(true);
    }
  };
  const pushPhaseUp = async () => {
    if (coverPagePhaseRef.current === "preparation") {
      coverPagePhaseRef.current = "review";
    } else if (coverPagePhaseRef.current === "review") {
      coverPagePhaseRef.current = "issue";
    } else if (coverPagePhaseRef.current === "issue") {
      coverPagePhaseRef.current = "outgoing";
    } else if (coverPagePhaseRef.current === "") {
      coverPagePhaseRef.current = "preparation";
    }
  };
  const pushPhaseDown = async () => {
    coverPagePhaseRef.current = "preparation";
  };
  const removeLogoBlobBeforeUpload = async () => {
    const { uploadHeaderLogo, ...otherProperties } =
      formikValuesReference.current;
    formikValuesReference.current = otherProperties;
  };
  const getCoverPageDetails = async (coverpage_id) => {
    setLoading(true);

    try {
      var res = await axios.post(
        server_url + "/CoverPage/getCoverPageDetails",
        {
          coverpage_id: CoverPageContext.coverpage_id,
        },
        {
          headers: { token: user.token },
        }
      );

      formikValuesReference.current = res.data._source.coverPage;
      formikValuesReference.current.uploadHeaderLogo = [];
      formikValuesReference.current.receivers_list =
        res.data._source.receivers_list;
      formikValuesReference.current.approvals_list =
        res.data._source.approvals_list;
      //Added here
      formikValuesReference.current.revision_number =
        res.data._source.revision_number;

      coverPagePhaseRef.current = res.data._source.coverPagePhase;
      disableFields();
      if (typeof res.data._source.comments_list !== "undefined") {
        console.log(
          "formikValuesReference.current.comments_list is undefined",
          formikValuesReference.current.comments_list
        );
        setComments_list(res.data._source.comments_list);
      } else {
        console.log(
          "formikValuesReference.current.comments_list",
          formikValuesReference.current.comments_list
        );
        formikValuesReference.current.comments_list = [];
      }

      console.log(
        "comments_list",
        typeof res.data._source.coverPage.comments_list
      );
      CoverPageContext.coverPageOf = res.data._source.coverPage.coverPageOf;

      await getlogos(CoverPageContext.coverpage_id, res.data._source.logoList);
      console.log(
        "loop runnoing complete this has run",
        FetchedLogoList.current
      );
      setlogoList({
        ...FetchedLogoList.current,
      });
      // Added Here pick and add there
      setHeaderLogo(res.data._source.coverPage?.headerLogo);
      setSelectedReceivers(formikValuesReference.current?.receivers_list);
      setSelectedApprovals(formikValuesReference.current?.approvals_list);
      setDate(res.data._source.coverPage.Date);
      setConsultantDate(res.data._source.coverPage.consultant_datee);
      setClientDate(res.data._source.coverPage.client_date);
      setContractorDate(res.data._source.coverPage.contractor_date);
      setSubContractorDate(res.data._source.coverPage.sub_contractor_date);
      // changeDateHandler(res.data._source.coverPage.Date);
      ActionOnForm();
      return true;
      // Disable fields if not in preparation
    } catch (e) {
      console.log("error:", e);
    }
    setLoading(false);
  };
  //Added Here
  function handleInputChange(event, value) {
    getCoverPageAfterSubmittalIdSelected(value?.coverpage_id);
  }
  //Added Here
  const getCoverPageSubmittalIds = async () => {
    setLoadingSelected(true);
    try {
      var res = await axios.post(
        server_url + "/CoverPage/getCoverPageSubmittalIds",
        {
          project_id: project.project_id,
          //Change here
          document_category: "Method Statement Submittal",
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (e) {
      console.log("error:", e);
    }

    setOptions([...res.data]);
    setLoadingSelected(false);
  };
  //Added Here
  const handleVersionButtin = () => {
    if (showSelectCoverId) {
      setShowSelectCoverId(false);
    } else {
      setShowSelectCoverId(true);
    }
  };
  //Added Here
  const getCoverPageAfterSubmittalIdSelected = async (coverpage_id) => {
    setLoading(true);

    try {
      var res = await axios.post(
        server_url + "/CoverPage/getCoverPageAfterSubmittalIdSelected",
        {
          coverpage_id: coverpage_id,
        },
        {
          headers: { token: user.token },
        }
      );

      formikValuesReference.current = res.data._source.coverPage;
      formikValuesReference.current.uploadHeaderLogo = [];

      await getlogos(CoverPageContext.coverpage_id, res.data._source.logoList);
      console.log(
        "loop runnoing complete this has run",
        FetchedLogoList.current
      );
      setlogoList({
        ...FetchedLogoList.current,
      });
      // Added Here pick and add here
      setHeaderLogo(res.data._source.coverPage?.headerLogo);
      setSelectedReceivers(formikValuesReference.current?.receivers_list);
      setSelectedApprovals(formikValuesReference.current?.approvals_list);
      setDate(res.data._source.coverPage.Date);
      setConsultantDate(res.data._source.coverPage.consultant_datee);
      setClientDate(res.data._source.coverPage.client_date);
      setContractorDate(res.data._source.coverPage.contractor_date);
      setSubContractorDate(res.data._source.coverPage.sub_contractor_date);
      // Disable fields if not in preparation
    } catch (e) {
      console.log("error:", e);
    }

    setLoading(false);
  };
  const saveButtonHandler = async () => {
    if (
      submitType === "Push for review" ||
      submitType === "Push for issue phase"
    )
      pushPhaseUp();
    else if (submitType === "Push back to preparation") pushPhaseDown();
    if (CoverPageContext.creatingOrEditing === "create") {
      // if the user open from create cover page
      saveCoverPageForm();
    } else if (CoverPageContext.creatingOrEditing === "edit") {
      // if the user open from edit cover page
      updateCoverPageForm();
    }
    navigate("/app/folder");
  };

  const saveCoverPageForm = async () => {
    var varLogoList = _.cloneDeep({ ...logoList });
    for (const key in varLogoList) {
      if (typeof varLogoList[key].blob !== "undefined")
        varLogoList[key].blob = "";
      varLogoList[key].changed = false;
    }

    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);
      var list = [];
      if (formikValuesReference.current.comments)
        list = formikValuesReference.current.comments_list.push(
          formikValuesReference.current.comments
        );
      removeLogoBlobBeforeUpload();
      var res = await axios.post(
        server_url + "/CoverPage/saveCoverPage",
        {
          name: formikValuesReference.current.SUBMITTAL_TITLE,
          isCoverPage: true,
          coverPageOf: coverPageOf,
          category: "Method Statement Submittal",
          uploaded_by: user.username,
          uploader_id: user.user_id,
          status: "review",
          coverPagePhase: coverPagePhaseRef.current,
          project_id: project.project_id,
          uploaded_time: nd,
          coverPage: formikValuesReference.current,
          approvals_list: selectedApprovals,
          receivers_list: selectedReceivers,
          logoList: varLogoList,
          //Added Here
          abbreviation_project: SubmittalEntityRef.current.abbreviation_project,
          abbreviation_contractor:
            SubmittalEntityRef.current.abbreviation_contractor,
          //Change here
          categoryAbbr: "MS",
        },
        {
          headers: { token: user.token },
        }
      );

      await uploadMultipleLogos(logoList, res.data);
    } catch (e) {
      console.log("error:", e);
    }
  };
  const updateCoverPageForm = async (coverPagePhase) => {
    var varLogoList = _.cloneDeep({ ...logoList });
    for (const key in varLogoList) {
      if (typeof varLogoList[key].blob !== "undefined")
        varLogoList[key].blob = "";
      varLogoList[key].changed = false;
    }
    removeLogoBlobBeforeUpload();

    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);
      console.log(
        "formikValuesReference.current",
        formikValuesReference.current
      );

      if (formikValuesReference.current.comments) {
        var commentator = {};
        commentator.user_id = user.user_id;
        commentator.username = user.username;
        commentator.comment = formikValuesReference.current.comments;
        formikValuesReference.current.comments_list.push(commentator);
      }

      var res = await axios.post(
        url + "/CoverPage/updateCoverPage",
        {
          coverpage_id: CoverPageContext.coverpage_id,
          name: formikValuesReference.current.SUBMITTAL_TITLE,
          isCoverPage: true,
          coverPageOf: coverPageOf,
          category: "Method Statement Submittal",
          uploaded_by: user.username,
          uploader_id: user.user_id,
          status: "review",
          coverPagePhase: coverPagePhaseRef.current,
          project_id: project.project_id,
          uploaded_time: nd,
          coverPage: formikValuesReference.current,
          approvals_list: selectedApprovals,
          receivers_list: selectedReceivers,
          logoList: varLogoList,
        },
        {
          headers: { token: user.token },
        }
      );

      await uploadMultipleLogos(logoList, CoverPageContext.coverpage_id);
    } catch (e) {
      console.log("error in update cover apge:", e);
    }
  };
  const uploadShopDrawing = async () => {
    delete formikValuesReference.current.uploadHeaderLogo;
    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);
      var res = await axios.post(
        server_url + "/Document/createDocMerged",
        {
          name: formikValuesReference.current.SUBMITTAL_TITLE + ".pdf",
          size: mergedPdfFile.size,
          lastModified: nd,
          type: mergedPdfFile.type,
          category: "Method Statement Submittal",
          uploaded_by: user.username,
          uploader_id: user.user_id,
          status: "registered",
          project_id: project.project_id,
          uploaded_time: nd,
          mapped_field: formikValuesReference.current,
        },
        {
          headers: { token: user.token },
        }
      );
      const response = await axios(
        "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
          res.data._id
      );
      const url = response.data.uploadURL;

      var config = {
        headers: { "content-type": mergedPdfFile.type },
      };

      try {
        await axios.put(url, mergedPdfFile, config);
        snackBar("Success", "Document Uploaded Successfully");
        setUploading(false);
      } catch (error) {
        throw error;
      }
    } catch (e) {
      console.log("error", e);
    }
  };

  const margePdfs = async (values) => {
    try {
      var file = [];

      const blob = await pdf(
        <MethodStatementTemplate values={values} />
      ).toBlob();

      var attachedDoc = await getfileurl(coverPageOf);

      file.push(blob);
      file.push(attachedDoc.urls);

      const merger = new PDFMerger();

      await Promise.all(file.map(async (theFile) => await merger.add(theFile)));

      const mergedPdf = await merger.saveAsBlob();
      mergedPdfFile = mergedPdf;

      const url = URL.createObjectURL(mergedPdf);

      setMergedPdfUrl(url);
      setUploading(false);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  const onSave = async (values) => {};
  const columns = [
    {
      field: "drawing_number",
      headerName: "Drawing Number",
      width: 180,
      editable: true,
    },
    {
      field: "discription",
      headerName: "discription",
      width: 200,
      editable: true,
    },
    {
      field: "status",
      headerName: "status",
      status: 180,
      editable: true,
    },
    {
      field: "remarks",
      headerName: "remarks",
      status: 180,
      editable: true,
    },
  ];
  return (
    <>
      <Helmet>
        <title>PrepareCoverForm | StonAi</title>
      </Helmet>
      {!isLoading ? (
        <>
          {!viewPDF && (
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <Main open={openDrawer} sx={{ marginRight: "0px" }}>
                <Box
                  sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                  }}
                >
                  <Container
                    maxWidth="lg"
                    sx={{
                      backgroundColor: "white",
                      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 10px",
                      marginTop: "3em",
                    }}
                  >
                    <Modal open={open} onClose={handleClose}>
                      <AddShopDrawingList
                        user={user}
                        handleDrawingListChange={handleDrawingListChange}
                        onsubmitDrawingList={onsubmitDrawingList}
                        handleClose={handleClose}
                      />
                    </Modal>
                    <Grid container spacing={1}>
                      <Grid item xs={11}>
                        <Heading1 size="24px" weight="600" JFcontent="left">
                          Doc ID: {coverPageOf}
                        </Heading1>
                        {!disableComments.current && (
                          <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={handleDrawerClose}
                            sx={{
                              ...(open && {
                                display: "none",
                              }),
                            }}
                          >
                            <MenuIcon />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton component={Link} to="/app/folder">
                          <ArrowBackIcon></ArrowBackIcon>
                        </IconButton>
                      </Grid>
                      <Grid item xs={12}>
                        <Divider
                          fullWidth
                          sx={{ backgroundColor: "darkgrey" }}
                        ></Divider>
                      </Grid>
                      {/*//Added Here*/}
                      {CoverPageContext.creatingOrEditing === "create" && (
                        <Grid item xs={12} className="d-flex p-2">
                          <Grid item xs={5}>
                            <Button
                              variant="contained"
                              onClick={handleVersionButtin}
                            >
                              Create a version of previous cover page
                            </Button>
                          </Grid>
                          <Grid item xs={7}>
                            {showSelectCoverId && (
                              <Autocomplete
                                id="asynchronous-demo"
                                sx={{ width: 300 }}
                                open={openSelectId}
                                onOpen={() => {
                                  setOpenSelectId(true);
                                  getCoverPageSubmittalIds();
                                }}
                                onClose={() => {
                                  setOpenSelectId(false);
                                }}
                                isOptionEqualToValue={(option, value) =>
                                  option.key === value.key
                                }
                                getOptionLabel={(option) => option.key}
                                options={options}
                                loading={loadingSelected}
                                onChange={handleInputChange}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Submittal No."
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <React.Fragment>
                                          {loadingSelected ? (
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
                            )}
                          </Grid>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Formik
                          initialValues={formikValuesReference.current}
                          validationSchema={Yup.object().shape({
                            SUBMITTAL_TITLE: Yup.string().required("Required"),
                          })}
                          onSubmit={async (values) => {
                            if (submitType === "save") {
                              formikValuesReference.current = values;
                              values.projectName = selectedProject;
                              values.Status = selectedStatus;
                              values.Discipline = discipline;
                              values.location =
                                values.floor +
                                " " +
                                values.street +
                                " " +
                                values.building +
                                " " +
                                values.country;

                              values.Date = date;
                              values.consultant_datee = consultantDate;
                              values.contractor_date = contractorDate;
                              values.sub_contractor_date = subContractorDate;
                              values.client_date = clientDate;
                              values.headerLogo = headerLogo;
                              pushingLogosInUploadHeaderLogo(values);
                              values.drawing_list = rows;

                              saveButtonHandler();
                            } else {
                              //This is preview

                              try {
                                formikValuesReference.current = values;
                                missingLogoHeaderCheck(
                                  formikValuesReference.current
                                );
                                //Added one for testing only
                                if (files.length != 0 || 1) {
                                  if (checkHeaderAndLogo) {
                                    setIsError(true);
                                    setErrMsg("Missing Header or Logo");
                                  } else if (checkSizeAndType) {
                                    setIsError(true);
                                    setErrMsg(
                                      "Size or Type issue of Uploaded Logos"
                                    );
                                  } else if (date == null) {
                                    setIsError(true);
                                    setErrMsg("Date is missing");
                                  } else {
                                    values.projectName = selectedProject;
                                    values.Status = selectedStatus;
                                    values.Discipline = discipline;
                                    values.location =
                                      values.floor +
                                      " " +
                                      values.street +
                                      " " +
                                      values.building +
                                      " " +
                                      values.country;

                                    values.Date = date;
                                    values.consultant_datee = consultantDate;
                                    values.contractor_date = contractorDate;
                                    values.sub_contractor_date =
                                      subContractorDate;
                                    values.client_date = clientDate;
                                    values.headerLogo = headerLogo;

                                    pushingLogosInUploadHeaderLogo(values);

                                    values.drawing_list = rows;

                                    if (submitType === "Preview") {
                                      //This is a push

                                      formikValuesReference.current = values;
                                      await margePdfs(values);
                                      setViewPDF(true);
                                    } else {
                                      formikValuesReference.current = values;
                                      if (
                                        selectedApprovals.length &&
                                        selectedReceivers.length
                                      ) {
                                        saveButtonHandler();
                                      } else {
                                        setIsError(true);
                                        setErrMsg(
                                          "Select issuer and reviewer first"
                                        );
                                      }
                                    }
                                  }
                                } else {
                                  setIsError(true);
                                  setErrMsg("Upload file first");
                                }
                                // navigate('app/adminDashboard', { replace: true })
                              } catch (error) {
                                setIsError(true);
                                if (files.type != "application/pdf") {
                                  setErrMsg("File should be of pdf type");
                                } else {
                                  setErrMsg(
                                    "Uploaded file can't be read due to some security issues. Try another file"
                                  );
                                }
                                console.log("error", error.response);
                                //alert("Unable to merge this file please try another file");
                                return error.response;
                              }
                            }
                          }}
                        >
                          {({
                            errors,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            handleSave,
                            isSubmitting,
                            touched,
                            values,
                          }) => (
                            <form onSubmit={handleSubmit}>
                              <Grid container spacing={1} xs={12} className="">
                                {/* ******************************logos****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 px-0 py-3"
                                >
                                  <div
                                    className=" d-flex mb-2 Center-P"
                                    style={{
                                      zIndex: 1,
                                    }}
                                  >
                                    {Object.keys(logoList).map((key, index) => {
                                      if (
                                        index < logoCount ||
                                        logoList[key].show
                                      )
                                        return (
                                          <div className="Center-P flex-column ">
                                            <label for={key}>
                                              <div
                                                className=" logoBox"
                                                style={{
                                                  backgroundImage: `url(${logoList[key].blob})`,
                                                }}
                                              >
                                                <input
                                                  style={{
                                                    display: "none",
                                                  }}
                                                  accept="image/png, image/jpg, image/jpeg"
                                                  id={key}
                                                  type="file"
                                                  name={key}
                                                  disabled={disabledRef.current}
                                                  onChange={(event) => {
                                                    console.log(
                                                      "clickedkey",
                                                      key
                                                    );
                                                    handleChangeUploadLogo1(
                                                      event,
                                                      key
                                                    );
                                                  }}
                                                />
                                                {logoList[key].blob ? (
                                                  <>
                                                    <Box
                                                      sx={{
                                                        position: "relative",
                                                      }}
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                      }}
                                                    >
                                                      <IconButton
                                                        edge="start"
                                                        color="inherit"
                                                        onClick={(e) => {
                                                          onImageClose(e, key);
                                                        }}
                                                        aria-label="close"
                                                        size="small"
                                                        sx={{
                                                          position: "absolute",
                                                          right: "0px",
                                                        }}
                                                      >
                                                        <CloseIcon />
                                                      </IconButton>
                                                    </Box>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Box
                                                      className="Center-P w-100"
                                                      sx={{ height: "100%" }}
                                                    >
                                                      Upload logo
                                                    </Box>
                                                  </>
                                                )}
                                              </div>
                                            </label>

                                            {uploadLogo1.size > 5000000 ? (
                                              <Typography
                                                align="center"
                                                color="red"
                                              >
                                                Maximum Size limit is 5MB
                                              </Typography>
                                            ) : null}
                                            {uploadLogo1.type != "" ? (
                                              uploadLogo1.type != "image/png" &&
                                              uploadLogo1.type !=
                                                "image/jpeg" &&
                                              uploadLogo1.type !=
                                                "image/jpg" ? (
                                                <Typography
                                                  align="center"
                                                  color="red"
                                                >
                                                  Accept only png, jepg, jpg
                                                  formats
                                                </Typography>
                                              ) : null
                                            ) : null}

                                            <div>
                                              <OutlinedInput
                                                className="textboxmui"
                                                disabled={disabledRef.current}
                                                size="small"
                                                style={{ width: "140px" }}
                                                value={headerLogo[key]}
                                                onBlur={handleBlur}
                                                onChange={(e) =>
                                                  handleChangeHeaderLogo(e, key)
                                                }
                                              ></OutlinedInput>
                                            </div>
                                          </div>
                                        );
                                    })}

                                    {logoCount <= 16 ? <AddLogoBox /> : null}
                                  </div>

                                  <Divider
                                    fullWidth
                                    sx={{ backgroundColor: "darkgrey" }}
                                  ></Divider>

                                  <div className="Center-P pt-3">
                                    <Heading1
                                      color=""
                                      size="20px"
                                      weight="500"
                                      width="fit-content"
                                    >
                                      PROJECT :
                                    </Heading1>

                                    {/* <Autocomplete
                                      disablePortal
                                      id="combo-box-demo"
                                      // options={userInfo.projects.map((item) => ({
                                      //     label: item.project_name,
                                      //     value: item.project_id,
                                      // }))}

                                      options={[
                                        { label: "Project I" },
                                        { label: "Project II" },
                                      ]}
                                      sx={{ width: "60%", marginLeft: "10px" }}
                                      className="autocompletemui"
                                      disabled={disabledRef.current}
                                      value={selectedProject}
                                      onChange={(event, newValue) => {
                                        if (newValue) {
                                          setProject(newValue.label);
                                        } else {
                                          setProject(null);
                                        }
                                      }}
                                      size="small"
                                      fullwidth
                                      renderInput={(params) => (
                                        <TextField
                                          fullwidth
                                          margin="small"
                                          disabled={disabledRef.current}
                                          size="small"
                                          {...params}
                                          label=""
                                          sx={{
                                            width: "100%",
                                            marginLeft: "10px",
                                          }}
                                        />
                                      )}
                                    /> */}
                                    <OutlinedInput
                                      className="textboxmui "
                                      size="small"
                                      sx={{ width: "50%" }}
                                      name="project"
                                      value={values.project}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                    ></OutlinedInput>
                                  </div>
                                </Grid>

                                {/* ****************************** Main****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 px-0 pb-0"
                                >
                                  <Grid xs={12}>
                                    <Heading1
                                      color="Black"
                                      size="30px"
                                      weight="500"
                                      width="100%"
                                    >
                                      METHOD STATEMENT SUBMITTAL
                                    </Heading1>

                                    <Divider
                                      fullWidth
                                      sx={{
                                        backgroundColor: "black",
                                        height: "1.1px",
                                      }}
                                    ></Divider>
                                  </Grid>
                                  <Grid container xs={12} className="">
                                    <Grid xs={12} className=" d-flex">
                                      <Grid
                                        item
                                        xs={2.3}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Submittal Title
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={5.2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          required
                                          error={Boolean(
                                            touched.SUBMITTAL_TITLE &&
                                              errors.SUBMITTAL_TITLE
                                          )}
                                          disabled={disabledRef.current}
                                          fullWidth
                                          helperText={
                                            touched.SUBMITTAL_TITLE &&
                                            errors.SUBMITTAL_TITLE
                                          }
                                          name="SUBMITTAL_TITLE"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.SUBMITTAL_TITLE}
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Date
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <LocalizationProvider
                                          dateAdapter={AdapterDateFns}
                                        >
                                          <Stack spacing={2}>
                                            <DesktopDatePicker
                                              fullWidth
                                              label=""
                                              inputFormat="MM/dd/yyyy"
                                              value={date}
                                              onChange={changeDateHandler}
                                              disabled={disabledRef.current}
                                              renderInput={(params) => (
                                                <TextField
                                                  required
                                                  className="textboxmui"
                                                  size="small"
                                                  margin="small"
                                                  {...params}
                                                />
                                              )}
                                            />
                                          </Stack>
                                        </LocalizationProvider>
                                      </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Divider
                                        fullWidth
                                        sx={{ backgroundColor: "darkgrey" }}
                                      ></Divider>
                                    </Grid>

                                    <Grid xs={12} className=" d-flex">
                                      {/*// Added Here */}
                                      {CoverPageContext.creatingOrEditing !==
                                        "create" && (
                                        <>
                                          <Grid
                                            item
                                            xs={2.3}
                                            className="m-1 d-flex align-items-center "
                                          >
                                            <Heading1
                                              color="Black"
                                              size="18px"
                                              weight="500"
                                              width="100%"
                                              JFcontent="start"
                                              className="my-2"
                                            >
                                              Submittal Number
                                            </Heading1>
                                          </Grid>
                                          <Divider
                                            orientation="vertical"
                                            className="VertDivider"
                                          ></Divider>

                                          <Grid
                                            item
                                            xs={5.0}
                                            className="m-1 d-flex align-items-center "
                                          >
                                            <OutlinedInput
                                              fullWidth
                                              error={Boolean(
                                                touched.SUBMITTAL_NO &&
                                                  errors.SUBMITTAL_NO
                                              )}
                                              disabled={true}
                                              helperText={
                                                touched.SUBMITTAL_NO &&
                                                errors.SUBMITTAL_NO
                                              }
                                              name="SUBMITTAL_NO"
                                              onBlur={handleBlur}
                                              onChange={handleChange}
                                              value={values.SUBMITTAL_NO}
                                              className="textboxmui"
                                              size="small"
                                              sx={{ width: "100%" }}
                                            ></OutlinedInput>
                                          </Grid>
                                          <Divider
                                            orientation="vertical"
                                            className="VertDivider"
                                          ></Divider>

                                          <Grid
                                            item
                                            xs={1}
                                            className="m-1 d-flex align-items-center "
                                          >
                                            <Heading1
                                              color="Black"
                                              size="18px"
                                              weight="500"
                                              width="100%"
                                              JFcontent="start"
                                              className="my-2"
                                            >
                                              Revision
                                            </Heading1>
                                          </Grid>
                                          <Divider
                                            orientation="vertical"
                                            className="VertDivider"
                                          ></Divider>

                                          <Grid
                                            item
                                            xs={1.1}
                                            className="m-1 d-flex align-items-center "
                                          >
                                            <OutlinedInput
                                              fullWidth
                                              name="Revision"
                                              value={values.revision_number}
                                              className="textboxmui"
                                              size="small"
                                              sx={{ width: "100%" }}
                                            ></OutlinedInput>
                                          </Grid>
                                          <Divider
                                            orientation="vertical"
                                            className="VertDivider"
                                          ></Divider>
                                        </>
                                      )}
                                    </Grid>
                                  </Grid>
                                </Grid>
                                {/* ******************************Submittals TEst****************************** */}
                                {/*//// Added here */}
                                {CoverPageContext.creatingOrEditing ===
                                  "create" && (
                                  <Grid
                                    item
                                    xs={12}
                                    className=" d-flex flex-column Mainborder mt-4 p-0 mb-0"
                                  >
                                    <Grid xs={12} className="d-flex p-0">
                                      <Grid
                                        item
                                        xs={3}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Submittal Number:
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>
                                      <Grid
                                        item
                                        xs={1.1}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          disabled
                                          name="Project"
                                          value={
                                            SubmittalEntityRef.current
                                              .abbreviation_project
                                          }
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={1.1}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          disabled
                                          name="Contractor"
                                          value={
                                            SubmittalEntityRef.current
                                              .abbreviation_contractor
                                          }
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={1.1}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          disabled
                                          name="SubType"
                                          value={
                                            SubmittalEntityRef.current.sub_type
                                          }
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={1.1}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          disabled
                                          name="Serial"
                                          value="Serial"
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )}
                                {/* ******************************Discpiline****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 px-0 mb-0"
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    className="m-1 d-flex align-items-center "
                                  >
                                    <Heading1
                                      color="Black"
                                      size="18px"
                                      weight="500"
                                      width="100%"
                                      JFcontent="start"
                                      className="my-1"
                                    >
                                      Discipline
                                    </Heading1>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Divider
                                      fullWidth
                                      sx={{ backgroundColor: "darkgrey" }}
                                    ></Divider>
                                  </Grid>

                                  <Grid xs={12} sx={{ marginLeft: "10px" }}>
                                    <FormControl component="fieldset">
                                      <FormGroup
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          alignItems: "center",
                                        }}
                                      >
                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Structural}
                                              onChange={handleChangeCheckbox}
                                              name="Structural"
                                            />
                                          }
                                          label="Structural"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Architectural}
                                              onChange={handleChangeCheckbox}
                                              name="Architectural"
                                            />
                                          }
                                          label="Architectural"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Mechanical}
                                              onChange={handleChangeCheckbox}
                                              name="Mechanical"
                                            />
                                          }
                                          label="Mechanical"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Electrical}
                                              onChange={handleChangeCheckbox}
                                              name="Electrical"
                                            />
                                          }
                                          label="Electrical"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Plumbing}
                                              onChange={handleChangeCheckbox}
                                              name="Plumbing"
                                            />
                                          }
                                          label="Plumbing"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Interior}
                                              onChange={handleChangeCheckbox}
                                              name="Interior"
                                            />
                                          }
                                          label="Interior"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={Landscape}
                                              onChange={handleChangeCheckbox}
                                              name="Landscape"
                                            />
                                          }
                                          label="Landscape"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={other}
                                              onChange={handleChangeCheckbox}
                                              name="other"
                                            />
                                          }
                                          label="other"
                                        />

                                        {discipline === true ? (
                                          <Grid
                                            item
                                            xs={12}
                                            md={4.9}
                                            sx={{
                                              marginBottom: "8px",
                                              float: "left",
                                            }}
                                          >
                                            <TextField
                                              label="Specify Discipline"
                                              margin="small"
                                              // onBlur={handleBlur}
                                              // onChange={handleChange}
                                              variant="outlined"
                                              size="small"
                                            />
                                          </Grid>
                                        ) : null}
                                      </FormGroup>
                                    </FormControl>
                                  </Grid>
                                </Grid>

                                {/* ******************************description****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 p-0 mb-0"
                                >
                                  <Grid container xs={12} className="">
                                    <Grid xs={12} className=" d-flex">
                                      <Grid
                                        item
                                        xs={2.3}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Doc Ref.
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={5.2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Description
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Soft Copies
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Hard Copies
                                        </Heading1>
                                      </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Divider
                                        fullWidth
                                        sx={{ backgroundColor: "darkgrey" }}
                                      ></Divider>
                                    </Grid>

                                    <Grid xs={12} className=" d-flex">
                                      <Grid
                                        item
                                        xs={2.3}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          className="textboxmui "
                                          size="small"
                                          sx={{ width: "100%" }}
                                          name="ref"
                                          value={values.ref}
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={5.2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          className="textboxmui p-0"
                                          size="small"
                                          multiline
                                          maxRows={4}
                                          sx={{ width: "100%" }}
                                          name="description"
                                          value={values.description}
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.soft_copies &&
                                              errors.soft_copies
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.soft_copies &&
                                            errors.soft_copies
                                          }
                                          value={values.soft_copies}
                                          label="Soft Copies"
                                          name="soft_copies"
                                          margin="small"
                                          type="number"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.hard_copies &&
                                              errors.hard_copies
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.hard_copies &&
                                            errors.hard_copies
                                          }
                                          label="Hard Copies"
                                          name="hard_copies"
                                          value={values.hard_copies}
                                          margin="small"
                                          type="number"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                      <Divider
                                        fullWidth
                                        sx={{
                                          backgroundColor: "black",
                                          height: "1.3px",
                                        }}
                                      ></Divider>
                                    </Grid>

                                    <Grid xs={12} className=" d-flex">
                                      <Grid
                                        item
                                        xs={2.3}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <Heading1
                                          color="Black"
                                          size="18px"
                                          weight="500"
                                          width="100%"
                                          JFcontent="start"
                                          className="my-2"
                                        >
                                          Remarks
                                        </Heading1>
                                      </Grid>
                                      <Divider
                                        orientation="vertical"
                                        className="VertDivider"
                                      ></Divider>

                                      <Grid
                                        item
                                        xs={9.5}
                                        className="w-100 m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          className="textboxmui p-0"
                                          size="small"
                                          multiline
                                          maxRows={4}
                                          name="remarks"
                                          value={values.remarks}
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* ******************************Enclosure****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 px-0 mb-0"
                                >
                                  <Grid
                                    item
                                    xs={12}
                                    className="m-1 d-flex align-items-center "
                                  >
                                    <Heading1
                                      color="Black"
                                      size="18px"
                                      weight="500"
                                      width="100%"
                                      JFcontent="start"
                                      className="my-1"
                                    >
                                      Enclosure : Risk Assessment
                                    </Heading1>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Divider
                                      fullWidth
                                      sx={{ backgroundColor: "darkgrey" }}
                                    ></Divider>
                                  </Grid>

                                  <Grid xs={12} sx={{ marginLeft: "10px" }}>
                                    <FormControl component="fieldset">
                                      <FormGroup
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          alignItems: "center",
                                        }}
                                      >
                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={InspectionTestPlan}
                                              onChange={handleEnclosure}
                                              name="InspectionTestPlan"
                                            />
                                          }
                                          label="Inspection & Test Plan"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={RiskAssessment}
                                              onChange={handleEnclosure}
                                              name="RiskAssessment"
                                            />
                                          }
                                          label="Risk Assessment"
                                        />

                                        <FormControlLabel
                                          sx={{ m: 0 }}
                                          control={
                                            <Checkbox
                                              checked={otherEnclosure}
                                              onChange={handleEnclosure}
                                              name="otherEnclosure"
                                            />
                                          }
                                          label="other"
                                        />

                                        {enclosureOther === true ? (
                                          <Grid
                                            item
                                            xs={12}
                                            md={4.9}
                                            sx={{
                                              marginBottom: "8px",
                                              float: "left",
                                              marginleft: "5px",
                                            }}
                                          >
                                            <TextField
                                              label="Specify Enclosure"
                                              margin="small"
                                              // onBlur={handleBlur}
                                              // onChange={handleChange}
                                              variant="outlined"
                                              size="small"
                                            />
                                          </Grid>
                                        ) : null}
                                      </FormGroup>
                                    </FormControl>
                                  </Grid>
                                </Grid>

                                {/* ******************************approval****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 p-0 mb-0"
                                >
                                  <Grid xs={12} className=" d-flex">
                                    <Grid
                                      item
                                      xs={2}
                                      className="m-1 d-flex align-items-center "
                                    >
                                      <Heading1
                                        color="Black"
                                        size="18px"
                                        weight="500"
                                        width="100%"
                                        JFcontent="start"
                                        className="my-2"
                                      >
                                        Reviewers
                                      </Heading1>
                                    </Grid>
                                    <Divider
                                      orientation="vertical"
                                      className="VertDivider"
                                    ></Divider>

                                    <Grid
                                      item
                                      xs={4}
                                      className="m-1 d-flex align-items-center "
                                    >
                                      <Autocomplete
                                        onChange={(e, option) => {
                                          handleSelectedReceiverChange(
                                            e,
                                            option
                                          );
                                        }}
                                        multiple
                                        id="receiver_combo"
                                        size="small"
                                        options={users}
                                        disabled={disabledRef.current}
                                        value={selectedReceivers}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) =>
                                          option?.username
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                          value.user_id === option.user_id
                                        }
                                        renderOption={(
                                          props,
                                          option,
                                          { selected }
                                        ) => (
                                          <li {...props}>
                                            <Checkbox
                                              icon={icon}
                                              checkedIcon={checkedIcon}
                                              style={{ marginRight: 8 }}
                                              checked={selected}
                                            />
                                            {option.username}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            fullwidth
                                            sx={{ width: "150px" }}
                                            margin="small"
                                            size="small"
                                            {...params}
                                            label="Receivers"
                                            disabled={disabledRef.current}
                                          />
                                        )}
                                      />
                                    </Grid>
                                    <Divider
                                      orientation="vertical"
                                      className="VertDivider"
                                    ></Divider>

                                    <Grid
                                      item
                                      xs={2}
                                      className="m-1 d-flex align-items-center "
                                    >
                                      <Heading1
                                        color="Black"
                                        size="18px"
                                        weight="500"
                                        width="100%"
                                        JFcontent="start"
                                        className="my-2"
                                      >
                                        Issuers
                                      </Heading1>
                                    </Grid>
                                    <Divider
                                      orientation="vertical"
                                      className="VertDivider"
                                    ></Divider>

                                    <Grid
                                      item
                                      xs={4}
                                      className="m-1 d-flex align-items-center "
                                    >
                                      <Autocomplete
                                        onChange={(e, option) => {
                                          handleSelectedApprovalChange(
                                            e,
                                            option
                                          );
                                        }}
                                        multiple
                                        id="approval_combo"
                                        size="small"
                                        options={users}
                                        disabled={disabledRef.current}
                                        value={selectedApprovals}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) =>
                                          option.username
                                        }
                                        renderOption={(
                                          props,
                                          option,
                                          { selected }
                                        ) => (
                                          <li {...props}>
                                            <Checkbox
                                              icon={icon}
                                              checkedIcon={checkedIcon}
                                              style={{ marginRight: 8 }}
                                              checked={selected}
                                            />
                                            {option.username}
                                          </li>
                                        )}
                                        renderInput={(params) => (
                                          <TextField
                                            fullwidth
                                            margin="small"
                                            size="small"
                                            sx={{ width: "150px" }}
                                            {...params}
                                            label="Approvals"
                                          />
                                        )}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <Divider
                                      fullWidth
                                      sx={{
                                        backgroundColor: "black",
                                        height: "1.1px",
                                      }}
                                    ></Divider>
                                  </Grid>

                                  <Grid xs={12} className=" d-flex">
                                    <Grid
                                      item
                                      xs={1.95}
                                      className="m-1 d-flex align-items-center "
                                    >
                                      <Heading1
                                        color="Black"
                                        size="18px"
                                        weight="500"
                                        width="100%"
                                        JFcontent="start"
                                        className="my-2"
                                      >
                                        Comments
                                      </Heading1>
                                    </Grid>

                                    <Divider
                                      orientation="vertical"
                                      className="VertDivider"
                                    ></Divider>

                                    <Grid
                                      item
                                      xs={10}
                                      className="m-1 d-flex align-items-center "
                                    >
                                      <OutlinedInput
                                        error={Boolean(
                                          touched.doc_ctrl_comments &&
                                            errors.doc_ctrl_comments
                                        )}
                                        fullWidth
                                        helperText={
                                          touched.doc_ctrl_comments &&
                                          errors.doc_ctrl_comments
                                        }
                                        margin="small"
                                        name="doc_ctrl_comments"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.doc_ctrl_comments}
                                        className="textboxmui p-0"
                                        size="small"
                                        multiline
                                        maxRows={2}
                                        sx={{ width: "100%" }}
                                      ></OutlinedInput>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                  <PdfDocument />
                                </Grid>
                                {/* ******************************button****************************** */}

                                {canActionOnForm && (
                                  <>
                                    <Grid item xs={12}>
                                      <Box sx={{ py: 2 }}>
                                        <Button
                                          disabled={isSubmitting}
                                          fullWidth
                                          size="large"
                                          type="submit"
                                          onClick={() => {
                                            submitType = "Preview";
                                            handleSubmit();
                                          }}
                                          variant="contained"
                                          style={{
                                            backgroundColor: "var(--darkblue)",
                                          }}
                                        >
                                          Preview
                                        </Button>

                                        {isError ? (
                                          <Typography
                                            align="center"
                                            color="red"
                                          >
                                            {errMsg}
                                          </Typography>
                                        ) : null}
                                      </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Box sx={{ py: 2 }}>
                                        <Button
                                          disabled={isSubmitting}
                                          fullWidth
                                          size="large"
                                          type="submit"
                                          onClick={() => {
                                            submitType = "save";
                                            handleSubmit();
                                          }}
                                          variant="contained"
                                          style={{
                                            backgroundColor: "var(--darkblue)",
                                          }}
                                        >
                                          Save
                                        </Button>
                                      </Box>
                                    </Grid>
                                    {(coverPagePhaseRef.current ===
                                      "preparation" ||
                                      coverPagePhaseRef.current === "") && (
                                      <Grid item xs={12}>
                                        <Box sx={{ py: 2 }}>
                                          <Button
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            onClick={() => {
                                              submitType = "Push for review";
                                              handleSubmit();
                                            }}
                                            variant="contained"
                                            style={{
                                              backgroundColor:
                                                "var(--darkblue)",
                                            }}
                                          >
                                            Push for review
                                          </Button>
                                        </Box>
                                      </Grid>
                                    )}
                                    {coverPagePhaseRef.current === "review" && (
                                      <Grid item xs={12}>
                                        <Box sx={{ py: 2 }}>
                                          <Button
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            onClick={() => {
                                              submitType =
                                                "Push for issue phase";
                                              handleSubmit();
                                            }}
                                            variant="contained"
                                            style={{
                                              backgroundColor:
                                                "var(--darkblue)",
                                            }}
                                          >
                                            Push to issue phase
                                          </Button>
                                        </Box>
                                      </Grid>
                                    )}
                                    {coverPagePhaseRef.current !==
                                      "preparation" && (
                                      <Grid item xs={12}>
                                        <Box sx={{ py: 2 }}>
                                          <Button
                                            disabled={isSubmitting}
                                            fullWidth
                                            size="large"
                                            type="submit"
                                            onClick={() => {
                                              submitType =
                                                "Push back to preparation";
                                              handleSubmit();
                                            }}
                                            variant="contained"
                                            style={{
                                              backgroundColor:
                                                "var(--darkblue)",
                                            }}
                                          >
                                            Push back to preparation
                                          </Button>
                                        </Box>
                                      </Grid>
                                    )}
                                  </>
                                )}
                              </Grid>
                            </form>
                          )}
                        </Formik>
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
              </Main>
              <Drawer
                disableEnforceFocus
                className=""
                sx={{
                  overflowY: "hidden",
                  width: drawerWidth,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                  },
                }}
                // variant="persistent"
                anchor="right"
                open={openDrawer}
              >
                <div
                  className="p-3 DrawerFlex docextractionDrawer"
                  style={{ height: "100%", flexDirection: "column" }}
                >
                  <div className="">
                    <DrawerHeader>
                      <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                          <ChevronLeftIcon />
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </IconButton>
                    </DrawerHeader>
                  </div>

                  <CoverPageCommentList user={user} comments={commentsList} />
                  <PostComment
                    userInfo={userInfo}
                    user={user}
                    coverpage_id={CoverPageContext.coverpage_id}
                    comments={commentsList}
                    setComments_list={setComments_list}
                  />
                </div>
              </Drawer>
            </Box>
          )}

          {
            viewPDF && (
              <>
                <Grid item xs={1}>
                  <IconButton onClick={backFromPreview}>
                    <ArrowBackIcon></ArrowBackIcon>
                  </IconButton>
                </Grid>
                <iframe
                  style={{ height: "80vh" }}
                  src={`${mergedPdfUrl}`}
                  title="pdf-viewer"
                  width="100%"
                ></iframe>
                {coverPagePhaseRef.current === "issue" && (
                  <Grid item xs={12}>
                    <Box sx={{ py: 2 }}>
                      <Button
                        disabled={uploading}
                        fullWidth
                        size="large"
                        type="submit"
                        onClick={uploadShopDrawing}
                        variant="contained"
                        style={{ backgroundColor: "var(--darkblue)" }}
                      >
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                )}
              </>
            )
            // <BlobProvider document={SDSTemplate({ values: valuesG })}>
            //   {({ url }) => <iframe src={url} style={{ width: '100%', height: '100%' }} />}
            // </BlobProvider>
          }
        </>
      ) : (
        <Box
          sx={{
            // backgroundColor: "blue",
            height: "100%",
            width: "100%",

            transform: "translate(50%,50%)",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default CoverPageMethodStatementSubmittal;

const statusdata = [
  { label: "Completed" },
  { label: "In Process" },
  { label: "Delayed" },
  { label: "Cancelled" },
];
