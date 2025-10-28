import { Link, useNavigate } from "react-router-dom";

import PDFMerger from "pdf-merger-js/browser";

import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik } from "formik";
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
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import PdfDocument from "../components/shopDrawing/prepareShopDrawing/PdfDocument";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { pdf } from "@react-pdf/renderer";
import SDSTemplate from "../components/shopDrawing/SDSTemplate";
import Modal from "@mui/material/Modal";
import CoverPageCommentList from "../../src/components/CoverPage/CoverPageCommentList";
import { PostComment } from "../../src/components/CoverPage/PostComment";
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
} from "@mui/material";
import AddShopDrawingList from "../components/shopDrawing/prepareShopDrawing/AddShopDrawingList";

import { Divider } from "@mui/material";
import { url } from "../url";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import Heading1 from "../Reusable Components/Headings/Heading1";
import { styled, useTheme } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
const drawerWidth = 600;

let logocount = 1;

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

const PrepareCoverForm = ({
  setUser,
  user,
  userInfo,
  setUserInfo,
  project,
  userPosition,
}) => {
  const [logoList, setlogoList] = useState([{ propertyname: "" }]);
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
  const [date, setDate] = React.useState(null);
  const [consultantDate, setConsultantDate] = React.useState(null);
  const [contractorDate, setContractorDate] = React.useState(null);
  const [subContractorDate, setSubContractorDate] = React.useState(null);
  const [discipline, setDiscipline] = React.useState(null);
  const [selectedProject, setProject] = React.useState(null);
  const [selectedStatus, setStatus] = React.useState(null);

  const [value, setValue] = React.useState();
  const [isLoading, setLoading] = useState(false);
  const [rows, setRows] = React.useState([]);
  const [editRowsModel, setEditRowsModel] = React.useState({});

  var checkHeaderAndLogo = false;
  var checkSizeAndType = false;

  const formikValuesReference = useRef({
    header_logo_1: "",
    header_logo_2: "",
    header_logo_3: "",
    header_logo_4: "",
    header_logo_5: "",
    header_logo_6: "",
    file_name: "",
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
  const initialiseCoverPage = async () => {
    if (CoverPageContext.creatingOrEditing === "create") {
      // if the user open from create cover page
      setCoverPageOf(CoverPageContext.coverPageOf);
      disableComments.current = true;
    } else if (CoverPageContext.creatingOrEditing === "edit") {
      // if the user open from edit cover page
      await getCoverPageDetails(CoverPageContext.coverpage_id);
    }
    ActionOnForm();
    getProjectUsers();
  };

  useEffect(() => {
    initialiseCoverPage();
  }, [formikValuesReference, coverPagePhaseRef, disabledRef, canActionOnForm]);
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
      // var myDate = dateFormatChange(newValue);
      setDate(newValue);
      setIsError(false);
      setErrMsg("");
    } else {
      setDate(null);
    }
  };
  const addLogo = () => {
    if (logocount <= 5) {
      setlogoList([...logoList, { propertyname: "" }]);
      logocount++;
    }
  };
  const AddLogoBox = () => {
    return (
      <div className="Center-P flex-column " onClick={addLogo}>
        <div className="Center-P Addlogobox">{/* <AddIcon /> */}+</div>
      </div>
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
      if (id == 1) {
        setUploadLogo1({
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
        });
      } else if (id == 2) {
        setUploadLogo2({
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
        });
      } else if (id == 3) {
        setUploadLogo3({
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
        });
      } else if (id == 4) {
        setUploadLogo4({
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
        });
      } else if (id == 5) {
        setUploadLogo5({
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
        });
      } else if (id == 6) {
        setUploadLogo6({
          blob: reader.result,
          name: uploadLogo.name,
          type: uploadLogo.type,
          size: uploadLogo.size,
        });
      }
    };
    reader.readAsDataURL(uploadLogo);
  };

  const handleChangeUploadLogo1 = (event) => {
    const uploadLogo = event.target.files[0];
    if (uploadLogo) {
      convertImageToBlob(1, uploadLogo);
    } else {
      setUploadLogo1({ blob: "", name: "", type: "", size: 0 });
    }
  };

  const handleChangeUploadLogo2 = (event) => {
    const uploadLogo = event.target.files[0];
    if (uploadLogo) {
      convertImageToBlob(2, uploadLogo);
    } else {
      setUploadLogo2({ blob: "", name: "", type: "", size: 0 });
    }
  };

  const handleChangeUploadLogo3 = (event) => {
    const uploadLogo = event.target.files[0];
    if (uploadLogo) {
      convertImageToBlob(3, uploadLogo);
    } else {
      setUploadLogo3({ blob: "", name: "", type: "", size: 0 });
    }
  };

  const handleChangeUploadLogo4 = (event) => {
    const uploadLogo = event.target.files[0];
    if (uploadLogo) {
      convertImageToBlob(4, uploadLogo);
    } else {
      setUploadLogo4({ blob: "", name: "", type: "", size: 0 });
    }
  };

  const handleChangeUploadLogo5 = (event) => {
    const uploadLogo = event.target.files[0];
    if (uploadLogo) {
      convertImageToBlob(5, uploadLogo);
    } else {
      setUploadLogo5({ blob: "", name: "", type: "", size: 0 });
    }
  };

  const handleChangeUploadLogo6 = (event) => {
    const uploadLogo = event.target.files[0];
    if (uploadLogo) {
      convertImageToBlob(6, uploadLogo);
    } else {
      setUploadLogo6({ blob: "", name: "", type: "", size: 0 });
    }
  };

  const onImageClose = (id) => {
    if (id == 0) {
      setFiles([]);
    } else if (id == 1) {
      setUploadLogo1({ blob: "", name: "", type: "", size: 0 });
    } else if (id == 2) {
      setUploadLogo2({ blob: "", name: "", type: "", size: 0 });
    } else if (id == 3) {
      setUploadLogo3({ blob: "", name: "", type: "", size: 0 });
    } else if (id == 4) {
      setUploadLogo4({ blob: "", name: "", type: "", size: 0 });
    } else if (id == 5) {
      setUploadLogo5({ blob: "", name: "", type: "", size: 0 });
    } else if (id == 6) {
      setUploadLogo6({ blob: "", name: "", type: "", size: 0 });
    }
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
  const onStateChangeDataGrid = (model) => {
    //console.log(model.rows.idRowsLookup);
  };

  const pushingLogosInUploadHeaderLogo = (values) => {
    if (uploadLogo1.blob) {
      values.uploadHeaderLogo.push({
        blob: uploadLogo1.blob,
        header: values.header_logo_1,
      });
    }
    if (uploadLogo2.blob) {
      values.uploadHeaderLogo.push({
        blob: uploadLogo2.blob,
        header: values.header_logo_2,
      });
    }
    if (uploadLogo3.blob) {
      values.uploadHeaderLogo.push({
        blob: uploadLogo3.blob,
        header: values.header_logo_3,
      });
    }
    if (uploadLogo4.blob) {
      values.uploadHeaderLogo.push({
        blob: uploadLogo4.blob,
        header: values.header_logo_4,
      });
    }
    if (uploadLogo5.blob) {
      values.uploadHeaderLogo.push({
        blob: uploadLogo5.blob,
        header: values.header_logo_5,
      });
    }
    if (uploadLogo6.blob) {
      values.uploadHeaderLogo.push({
        blob: uploadLogo6.blob,
        header: values.header_logo_6,
      });
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
  const getCoverPageDetails = async (coverpage_id) => {
    setUploading(true);
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
      formikValuesReference.current.receivers_list =
        res.data._source.receivers_list;
      formikValuesReference.current.approvals_list =
        res.data._source.approvals_list;
      coverPagePhaseRef.current = res.data._source.coverPagePhase;
      disableFields();
      if (typeof res.data._source.comments_list !== "undefined") {
        setComments_list(res.data._source.comments_list);
      } else {
        formikValuesReference.current.comments_list = [];
      }

      setSelectedReceivers(formikValuesReference.current?.receivers_list);
      setSelectedApprovals(formikValuesReference.current?.approvals_list);
      changeDateHandler(res.data._source.coverPage.Date);
      ActionOnForm();
      return true;
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
    setUploading(true);

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
      var res = await axios.post(
        server_url + "/CoverPage/saveCoverPage",
        {
          name: formikValuesReference.current.file_name,
          isCoverPage: true,
          coverPageOf: coverPageOf,
          category: "shop_drawing_submittal",
          uploaded_by: user.username,
          uploader_id: user.user_id,
          status: "review",
          coverPagePhase: coverPagePhaseRef.current,
          project_id: project.project_id,
          uploaded_time: nd,
          coverPage: formikValuesReference.current,
          approvals_list: selectedApprovals,
          receivers_list: selectedReceivers,
          comments_list: list,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (e) {
      console.log("error:", e);
    }
  };
  const updateCoverPageForm = async (coverPagePhase) => {
    //("coverPagePhase", coverPagePhase);
    setUploading(true);

    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);

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
          name: formikValuesReference.current.file_name,
          isCoverPage: true,
          coverPageOf: coverPageOf,
          category: "shop_drawing_submittal",
          uploaded_by: user.username,
          uploader_id: user.user_id,
          status: "review",
          coverPagePhase: coverPagePhaseRef.current,
          project_id: project.project_id,
          uploaded_time: nd,
          coverPage: formikValuesReference.current,
          approvals_list: selectedApprovals,
          receivers_list: selectedReceivers,
          comments_list: formikValuesReference.current.comments_list,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (e) {
      console.log("error in update cover apge:", e);
    }
  };
  const uploadShopDrawing = async () => {
    setUploading(true);
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
        server_url + "/CoverPage/createDocMerged",
        {
          name: formikValuesReference.current.file_name + ".pdf",
          size: mergedPdfFile.size,
          lastModified: nd,
          type: mergedPdfFile.type,
          category: "shop_drawing_submittal",
          uploaded_by: user.username,
          uploader_id: user.user_id,
          status: "review",
          project_id: project.project_id,
          uploaded_time: nd,
          mapped_field: formikValuesReference.current,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (e) {}

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
      console.log("error from s3 bucket uploading");
    }
  };

  const margePdfs = async (values) => {
    try {
      var file = [];

      const blob = await pdf(<SDSTemplate values={values} />).toBlob();

      var attachedDoc = await getfileurl(CoverPageContext.coverPageOf);

      file.push(blob);
      file.push(attachedDoc.urls);
      const merger = new PDFMerger();

      await Promise.all(file.map(async (theFile) => await merger.add(theFile)));

      const mergedPdf = await merger.saveAsBlob();
      mergedPdfFile = mergedPdf;

      const url = URL.createObjectURL(mergedPdf);
      //console.log("url", url);
      setMergedPdfUrl(url);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };
  const onSave = async (values) => {
    //console.log("savevales", values);
  };
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
              <Main open={openDrawer}>
                <Box
                  sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 3,
                  }}
                >
                  <Container
                    maxWidth="md"
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
                      <Grid item xs={12}>
                        <Formik
                          initialValues={formikValuesReference.current}
                          validationSchema={Yup.object().shape({
                            SUBMITTAL_NO: Yup.string().required("Required"),
                            SUBMITTAL_TITLE: Yup.string().required("Required"),
                            file_name: Yup.string().required("Required"),
                          })}
                          onSubmit={async (values) => {
                            if (submitType === "save") {
                              formikValuesReference.current = values;
                              saveButtonHandler();
                            } else {
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
                                    pushingLogosInUploadHeaderLogo(values);
                                    values.drawing_list = rows;

                                    if (submitType === "Preview") {
                                      await margePdfs(values);
                                      setViewPDF(true);
                                      formikValuesReference.current = values;
                                    } else {
                                      formikValuesReference.current = values;
                                      saveButtonHandler();
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
                                  <div className=" d-flex mb-2 Center-P">
                                    {logoList.map((x) => {
                                      return (
                                        <div className="Center-P flex-column ">
                                          <label htmlFor="uploadLogo1">
                                            <Input
                                              accept="image/png, image/jpg, image/jpeg"
                                              id="uploadLogo1"
                                              type="file"
                                              name="uploadLogo1"
                                              onChange={handleChangeUploadLogo1}
                                            />
                                            <div
                                              className=" logoBox"
                                              style={{
                                                backgroundImage: `url(${uploadLogo1.blob})`,
                                              }}
                                            >
                                              {uploadLogo1.blob ? (
                                                <>
                                                  <Box
                                                    sx={{
                                                      position: "relative",
                                                    }}
                                                  >
                                                    <IconButton
                                                      edge="start"
                                                      color="inherit"
                                                      onClick={() => {
                                                        onImageClose(1);
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
                                            uploadLogo1.type != "image/jpeg" &&
                                            uploadLogo1.type != "image/jpg" ? (
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
                                              size="small"
                                              style={{ width: "140px" }}
                                            ></OutlinedInput>
                                          </div>
                                        </div>
                                      );
                                    })}

                                    {logocount <= 5 ? <AddLogoBox /> : null}
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

                                    <Autocomplete
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
                                          size="small"
                                          {...params}
                                          label=""
                                          sx={{
                                            width: "100%",
                                            marginLeft: "10px",
                                          }}
                                        />
                                      )}
                                    />
                                  </div>
                                </Grid>

                                {/* ******************************Material Submital Main****************************** */}
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
                                      MATERIAL SUBMITTAL FORM
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
                                        xs={5.2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
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
                                          Revision
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
                                        <OutlinedInput
                                          fullWidth
                                          name="Revision"
                                          value="R-1"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>

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
                                      <RadioGroup
                                        row
                                        name="row-radio-buttons-group"
                                        // defaultValue={values.discipline}
                                        onChange={changedisciplineHandler}
                                      >
                                        <FormControlLabel
                                          value="Structural"
                                          control={<Radio />}
                                          label="Structural"
                                        />
                                        <FormControlLabel
                                          value="Architectural"
                                          control={<Radio />}
                                          label="Architectural"
                                        />
                                        <FormControlLabel
                                          value="Mechanical"
                                          control={<Radio />}
                                          label="Mechanical"
                                        />
                                        <FormControlLabel
                                          value="Electrical"
                                          control={<Radio />}
                                          label="Electrical"
                                        />
                                        <FormControlLabel
                                          value="Plumbing"
                                          control={<Radio />}
                                          label="Plumbing"
                                        />
                                        <FormControlLabel
                                          value="Interior"
                                          control={<Radio />}
                                          label="Interior"
                                        />
                                        <FormControlLabel
                                          value="Landscape"
                                          control={<Radio />}
                                          label="Landscape"
                                        />
                                        <FormControlLabel
                                          value="other"
                                          control={<Radio />}
                                          label="other"
                                        />

                                        {discipline === "other" ? (
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
                                      </RadioGroup>
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
                                          Ref.
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
                                          Description of Material
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
                                        sx={{ backgroundColor: "darkgrey" }}
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
                                        xs={5.2}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <OutlinedInput
                                          className="textboxmui p-0"
                                          size="small"
                                          multiline
                                          maxRows={4}
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
                                          Location of Use
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.locationOfUse &&
                                              errors.locationOfUse
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.locationOfUse &&
                                            errors.locationOfUse
                                          }
                                          label="location Of Use"
                                          margin="small"
                                          name="locationOfUse"
                                          value={values.locationOfUse}
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          className="textboxmui"
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* ******************************Consultant****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 p-0 mb-0"
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
                                      Consultant
                                    </Heading1>
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

                                  <Grid container xs={12} className="">
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
                                          Name
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.consultant_name &&
                                              errors.consultant_name
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.consultant_name &&
                                            errors.consultant_name
                                          }
                                          label="Consultant Name"
                                          margin="small"
                                          name="consultant_name"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.consultant_name}
                                          className="textboxmui "
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
                                          Position
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.consultant_position &&
                                              errors.consultant_position
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.consultant_position &&
                                            errors.consultant_position
                                          }
                                          label="Consultant Position"
                                          margin="small"
                                          name="consultant_position"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.consultant_position}
                                          className="textboxmui "
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
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
                                          Signature
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.consultant_signature &&
                                              errors.consultant_signature
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.consultant_signature &&
                                            errors.consultant_signature
                                          }
                                          label="consultant_signature"
                                          margin="small"
                                          name="consultant_signature"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.consultant_signature}
                                          className="textboxmui "
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
                                        xs={4}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <LocalizationProvider
                                          dateAdapter={AdapterDateFns}
                                        >
                                          <Stack spacing={2}>
                                            <DesktopDatePicker
                                              fullWidth
                                              label=" "
                                              inputFormat="MM/dd/yyyy"
                                              value={consultantDate}
                                              sx={{ width: "100%" }}
                                              onChange={
                                                changeConsultantDateHandler
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  className="textboxmui"
                                                  size="small"
                                                  margin="small"
                                                  fullWidth
                                                  sx={{ width: "100%" }}
                                                  {...params}
                                                />
                                              )}
                                            />
                                          </Stack>
                                        </LocalizationProvider>
                                      </Grid>
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
                                          touched.consultant_comments &&
                                            errors.consultant_comments
                                        )}
                                        fullWidth
                                        helperText={
                                          touched.consultant_comments &&
                                          errors.consultant_comments
                                        }
                                        label="consultant_comments"
                                        margin="small"
                                        name="consultant_comments"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.consultant_comments}
                                        className="textboxmui p-0"
                                        size="small"
                                        multiline
                                        maxRows={2}
                                        sx={{ width: "100%" }}
                                      ></OutlinedInput>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* ******************************Contractor****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 p-0 mb-0"
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
                                      Contractor
                                    </Heading1>
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

                                  <Grid container xs={12} className="">
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
                                          Name
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.contractor_name &&
                                              errors.contractor_name
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.contractor_name &&
                                            errors.contractor_name
                                          }
                                          label="Contractor Name"
                                          margin="small"
                                          name="contractor_name"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.contractor_name}
                                          className="textboxmui "
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
                                          Position
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.contractor_position &&
                                              errors.contractor_position
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.contractor_position &&
                                            errors.contractor_position
                                          }
                                          label="Contractor Position"
                                          margin="small"
                                          name="contractor_position"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.contractor_position}
                                          className="textboxmui "
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
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
                                          Signature
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.contractor_signature &&
                                              errors.contractor_signature
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.contractor_signature &&
                                            errors.contractor_signature
                                          }
                                          label="contractor signature"
                                          margin="small"
                                          name="contractor_signature"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.contractor_signature}
                                          className="textboxmui "
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
                                        xs={4}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <LocalizationProvider
                                          dateAdapter={AdapterDateFns}
                                        >
                                          <Stack spacing={2}>
                                            <DesktopDatePicker
                                              fullWidth
                                              label=" "
                                              inputFormat="MM/dd/yyyy"
                                              value={contractorDate}
                                              onChange={
                                                changeContractorDateHandler
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  className="textboxmui "
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
                                            touched.contractor_comments &&
                                              errors.contractor_comments
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.contractor_comments &&
                                            errors.contractor_comments
                                          }
                                          label="contractor_comments"
                                          margin="small"
                                          name="contractor_comments"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.contractor_comments}
                                          className="textboxmui p-0"
                                          size="small"
                                          multiline
                                          maxRows={2}
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>

                                {/* ******************************Sub Contractor****************************** */}
                                <Grid
                                  item
                                  xs={12}
                                  className=" d-flex flex-column Mainborder mt-4 p-0 mb-0"
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
                                      Sub Contractor
                                    </Heading1>
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

                                  <Grid container xs={12} className="">
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
                                          Name
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.sub_contractor_name &&
                                              errors.sub_contractor_name
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.sub_contractor_name &&
                                            errors.sub_contractor_name
                                          }
                                          label="Subcontractor Name"
                                          margin="small"
                                          name="sub_contractor_name"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.sub_contractor_name}
                                          className="textboxmui "
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
                                          Position
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.sub_contractor_position &&
                                              errors.sub_contractor_position
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.sub_contractor_position &&
                                            errors.sub_contractor_position
                                          }
                                          label="Subcontractor Position"
                                          margin="small"
                                          name="sub_contractor_position"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.sub_contractor_position}
                                          className="textboxmui "
                                          size="small"
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
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
                                          Signature
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
                                        <OutlinedInput
                                          error={Boolean(
                                            touched.sub_contractor_signature &&
                                              errors.sub_contractor_signature
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.sub_contractor_signature &&
                                            errors.sub_contractor_signature
                                          }
                                          label="sub_contractor_signature"
                                          margin="small"
                                          name="sub_contractor_signature"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={
                                            values.sub_contractor_signature
                                          }
                                          className="textboxmui "
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
                                        xs={4}
                                        className="m-1 d-flex align-items-center "
                                      >
                                        <LocalizationProvider
                                          dateAdapter={AdapterDateFns}
                                        >
                                          <Stack spacing={2}>
                                            <DesktopDatePicker
                                              fullWidth
                                              label=" "
                                              inputFormat="MM/dd/yyyy"
                                              value={subContractorDate}
                                              onChange={
                                                changeSubContractorDateHandler
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  margin="small"
                                                  className="textboxmui "
                                                  size="small"
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
                                            touched.sub_contractor_comments &&
                                              errors.sub_contractor_comments
                                          )}
                                          fullWidth
                                          helperText={
                                            touched.sub_contractor_comments &&
                                            errors.sub_contractor_comments
                                          }
                                          label="sub_contractor_comments"
                                          margin="small"
                                          name="sub_contractor_comments"
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          value={values.sub_contractor_comments}
                                          className="textboxmui p-0"
                                          size="small"
                                          multiline
                                          maxRows={2}
                                          sx={{ width: "100%" }}
                                        ></OutlinedInput>
                                      </Grid>
                                    </Grid>
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
                                            required
                                            fullwidth
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
                                            required
                                            fullwidth
                                            margin="small"
                                            size="small"
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
                className=""
                sx={{
                  overflowY: "hidden",
                  width: drawerWidth,
                  flexShrink: 0,
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                  },
                }}
                variant="persistent"
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
    </>
  );
};

export default PrepareCoverForm;

const statusdata = [
  { label: "Completed" },
  { label: "In Process" },
  { label: "Delayed" },
  { label: "Cancelled" },
];
