import { Link, useNavigate } from "react-router-dom";
import PDFMerger from "pdf-merger-js/browser";
import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import * as Yup from "yup";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import Paper from "@mui/material/Paper";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import PdfDocument from "./PdfDocument";
import Alert from "@mui/material/Alert";
import { PDFViewer, pdf, ReactPDF, BlobProvider } from "@react-pdf/renderer";
import SDSTemplate from "../SDSTemplate";
import PdfDoc from "../PdfDoc";
import Modal from "@mui/material/Modal";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import AddShopDrawingList from "./AddShopDrawingList";
import InputLabel from "@mui/material/InputLabel";
import { Divider } from "@mui/material";
import { url } from "../../../url";
import countryList from "react-select-country-list";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import { styled } from "@mui/material/styles";
import { isTypedArray } from "lodash";
import { useSnackbar } from "notistack";
import MaterialTemplate from "../MaterialTemplate";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Input = styled("input")({
  display: "none",
});

var server_url = url;
var mergedPdfFile = {};

const PrepareMaterialDrawingForm = ({
  setUser,
  user,
  userInfo,
  setUserInfo,
  project,
  userPosition,
}) => {
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
  const [rows, setRows] = React.useState([]);
  const [editRowsModel, setEditRowsModel] = React.useState({});
  const [SpecifyDisc, setSpecifyDisc] = useState(false);
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [users, setUsers] = useState([]);

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
    generalContractor: "",
    Client: "",
    consultant: "",
    Subcontractor: "",
    projectName: "",
    country: "",
    building: "",
    street: "",
    floor: "",
    date: "",
    location: "",

    SUBMITTAL_NO: "",
    SUBMITTAL_TITLE: "",
    discipline: "",
    Status: "",
    subcontractorRep: "",
    locationOfUse: "",
    soft_copies: 0,
    hard_copies: 0,
    Revision: "R-1",
    Document_title: "Material Submittal",
    consultant_name: "",
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
    receivers_list: [],
    approvals_list: [],
    drawing_list: [],
    uploadHeaderLogo: [],
    // files: [],
  });

  const { enqueueSnackbar } = useSnackbar();
  const snackBar = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
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

  const uploadMaterialSubmital = async () => {
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
        server_url + "/Document/createDocMerged",
        {
          name: formikValuesReference.current.file_name + ".pdf",
          size: mergedPdfFile.size,
          lastModified: nd,
          type: mergedPdfFile.type,
          category: "material_submittal",
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

  const handleEditRowsModelChange = React.useCallback((model) => {
    setEditRowsModel(model);
  }, []);
  const changedisciplineHandler = (event) => {
    if (discipline === "other") {
      setSpecifyDisc(true);
    } else {
      setSpecifyDisc(false);
    }

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

  const changeConsultantDateHandler = (newValue) => {
    if (newValue != "Invalid Date" && newValue != null) {
      var myDate = dateFormatChange(newValue);
      setConsultantDate(myDate);
    } else {
      setConsultantDate(null);
    }
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

  const handleSelectedReceiverChange = (e, option) => {
    setSelectedReceivers(option);
  };

  const handleSelectedApprovalChange = (e, option) => {
    setSelectedApprovals(option);
  };

  const getProjectUsers = async () => {
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
  };

  useEffect(() => {
    getProjectUsers();
  }, []);

  const margePdfs = async (values) => {
    try {
      var file = [];

      const blob = await pdf(<MaterialTemplate values={values} />).toBlob();

      file.push(blob);
      file.push(files);

      const merger = new PDFMerger();

      await Promise.all(file.map(async (theFile) => await merger.add(theFile)));

      const mergedPdf = await merger.saveAsBlob();
      mergedPdfFile = mergedPdf;

      const url = URL.createObjectURL(mergedPdf);

      setMergedPdfUrl(url);
    } catch (error) {
      console.log("error", error);
      throw error;
    }
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
        <title>Prepare Material Form | StonAi</title>
      </Helmet>

      {!viewPDF && (
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
                  Prepare Material Drawing Form
                </Heading1>
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
                    try {
                      formikValuesReference.current = values;
                      missingLogoHeaderCheck(formikValuesReference.current);
                      sizeTypeLogoCheck();
                      if (files.length != 0) {
                        if (checkHeaderAndLogo) {
                          setIsError(true);
                          setErrMsg("Missing Header or Logo");
                        } else if (checkSizeAndType) {
                          setIsError(true);
                          setErrMsg("Size or Type issue of Uploaded Logos");
                        } else if (date == null) {
                          setIsError(true);
                          setErrMsg("Date is missing");
                        } else {
                          values.projectName = selectedProject;
                          values.location =
                            values.floor +
                            " " +
                            values.street +
                            " " +
                            values.building +
                            " " +
                            values.country;
                          values.Status = selectedStatus;
                          values.discipline = discipline;
                          values.receivers_list = selectedReceivers;
                          values.approvals_list = selectedApprovals;
                          values.Date = date;
                          values.consultant_datee = consultantDate;
                          values.contractor_date = contractorDate;
                          values.sub_contractor_date = subContractorDate;
                          pushingLogosInUploadHeaderLogo(values);
                          values.drawing_list = rows;
                          //alert(JSON.stringify(values, null, 2));

                          await margePdfs(values);
                          setViewPDF(true);
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
                      return error.response;
                    }
                  }}
                >
                  {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    touched,
                    values,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <label htmlFor="contained-button-file">
                            <Input
                              accept="application/pdf"
                              id="contained-button-file"
                              type="file"
                              name="files"
                              value={values.files}
                              onChange={handleChangeUpload}
                            />
                            <Button variant="contained" component="span">
                              Upload
                            </Button>
                          </label>
                          {files.length != 0 ? (
                            <>
                              <Typography>
                                {files.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(0);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>{" "}
                            </>
                          ) : null}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            sx={{ fontSize: 16 }}
                            color="text.secondary"
                          >
                            Select Material Drawing from existing documents
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            sx={{ fontSize: 16 }}
                            color="text.secondary"
                          >
                            Cover page details
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(
                              touched.header_logo_1 && errors.header_logo_1
                            )}
                            fullWidth
                            helperText={
                              touched.header_logo_1 && errors.header_logo_1
                            }
                            label="header_logo_1"
                            margin="small"
                            name="header_logo_1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.header_logo_1}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <label htmlFor="uploadLogo1">
                            <Input
                              accept="image/png, image/jpg, image/jpeg"
                              id="uploadLogo1"
                              type="file"
                              name="uploadLogo1"
                              onChange={handleChangeUploadLogo1}
                            />
                            <Button variant="contained" component="span">
                              Upload logo 1
                            </Button>
                          </label>
                          {uploadLogo1.blob ? (
                            <>
                              <Typography>
                                {uploadLogo1.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(1);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>
                            </>
                          ) : null}
                          {uploadLogo1.size > 5000000 ? (
                            <Typography align="center" color="red">
                              Maximum Size limit is 5MB
                            </Typography>
                          ) : null}
                          {uploadLogo1.type != "" ? (
                            uploadLogo1.type != "image/png" &&
                            uploadLogo1.type != "image/jpeg" &&
                            uploadLogo1.type != "image/jpg" ? (
                              <Typography align="center" color="red">
                                Accept only png, jepg, jpg formats
                              </Typography>
                            ) : null
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px", marginLeft: 1.1 }}
                        >
                          <TextField
                            fullWidth
                            label="Header Logo 2"
                            margin="small"
                            name="header_logo_2"
                            onChange={handleChange}
                            value={values.header_logo_2}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <label htmlFor="uploadLogo2">
                            <Input
                              accept="image/png, image/jpg, image/jpeg"
                              id="uploadLogo2"
                              type="file"
                              name="uploadLogo2"
                              onChange={handleChangeUploadLogo2}
                            />
                            <Button variant="contained" component="span">
                              Upload logo 2
                            </Button>
                          </label>
                          {uploadLogo2.blob ? (
                            <>
                              <Typography>
                                {uploadLogo2.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(2);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>
                            </>
                          ) : null}
                          {uploadLogo2.size > 5000000 ? (
                            <Typography align="center" color="red">
                              Maximum Size limit is 5MB
                            </Typography>
                          ) : null}
                          {uploadLogo2.type != "" ? (
                            uploadLogo2.type != "image/png" &&
                            uploadLogo2.type != "image/jpeg" &&
                            uploadLogo2.type != "image/jpg" ? (
                              <Typography align="center" color="red">
                                Accept only png, jepg, jpg formats
                              </Typography>
                            ) : null
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            fullWidth
                            label="Header Logo 3"
                            margin="small"
                            name="header_logo_3"
                            onChange={handleChange}
                            value={values.header_logo_3}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <label htmlFor="uploadLogo3">
                            <Input
                              accept="image/png, image/jpg, image/jpeg"
                              id="uploadLogo3"
                              type="file"
                              name="uploadLogo3"
                              onChange={handleChangeUploadLogo3}
                            />
                            <Button variant="contained" component="span">
                              Upload logo 3
                            </Button>
                          </label>
                          {uploadLogo3.blob ? (
                            <>
                              <Typography>
                                {uploadLogo3.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(3);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>
                            </>
                          ) : null}
                          {uploadLogo3.size > 5000000 ? (
                            <Typography align="center" color="red">
                              Maximum Size limit is 5MB
                            </Typography>
                          ) : null}
                          {uploadLogo3.type != "" ? (
                            uploadLogo3.type != "image/png" &&
                            uploadLogo3.type != "image/jpeg" &&
                            uploadLogo3.type != "image/jpg" ? (
                              <Typography align="center" color="red">
                                Accept only png, jepg, jpg formats
                              </Typography>
                            ) : null
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px", marginLeft: 1.1 }}
                        >
                          <TextField
                            fullWidth
                            label="Header Logo 4"
                            margin="small"
                            name="header_logo_4"
                            onChange={handleChange}
                            value={values.header_logo_4}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <label htmlFor="uploadLogo4">
                            <Input
                              accept="image/png, image/jpg, image/jpeg"
                              id="uploadLogo4"
                              type="file"
                              name="uploadLogo4"
                              onChange={handleChangeUploadLogo4}
                            />
                            <Button variant="contained" component="span">
                              Upload logo 4
                            </Button>
                          </label>
                          {uploadLogo4.blob ? (
                            <>
                              <Typography>
                                {uploadLogo4.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(4);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>
                            </>
                          ) : null}
                          {uploadLogo4.size > 5000000 ? (
                            <Typography align="center" color="red">
                              Maximum Size limit is 5MB
                            </Typography>
                          ) : null}
                          {uploadLogo4.type != "" ? (
                            uploadLogo4.type != "image/png" &&
                            uploadLogo4.type != "image/jpeg" &&
                            uploadLogo4.type != "image/jpg" ? (
                              <Typography align="center" color="red">
                                Accept only png, jepg, jpg formats
                              </Typography>
                            ) : null
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            fullWidth
                            label="Header Logo 5"
                            margin="small"
                            name="header_logo_5"
                            onChange={handleChange}
                            value={values.header_logo_5}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <label htmlFor="uploadLogo5">
                            <Input
                              accept="image/png, image/jpg, image/jpeg"
                              id="uploadLogo5"
                              type="file"
                              name="uploadLogo5"
                              onChange={handleChangeUploadLogo5}
                            />
                            <Button variant="contained" component="span">
                              Upload logo 5
                            </Button>
                          </label>
                          {uploadLogo5.blob ? (
                            <>
                              <Typography>
                                {uploadLogo5.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(5);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>
                            </>
                          ) : null}
                          {uploadLogo5.size > 5000000 ? (
                            <Typography align="center" color="red">
                              Maximum Size limit is 5MB
                            </Typography>
                          ) : null}
                          {uploadLogo5.type != "" ? (
                            uploadLogo5.type != "image/png" &&
                            uploadLogo5.type != "image/jpeg" &&
                            uploadLogo5.type != "image/jpg" ? (
                              <Typography align="center" color="red">
                                Accept only png, jepg, jpg formats
                              </Typography>
                            ) : null
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px", marginLeft: 1.1 }}
                        >
                          <TextField
                            fullWidth
                            label="Header Logo 6"
                            margin="small"
                            name="header_logo_6"
                            onChange={handleChange}
                            value={values.header_logo_6}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={2.95}
                          sx={{ marginBottom: "8px" }}
                        >
                          <label htmlFor="uploadLogo6">
                            <Input
                              accept="image/png, image/jpg, image/jpeg"
                              id="uploadLogo6"
                              type="file"
                              name="uploadLogo6"
                              onChange={handleChangeUploadLogo6}
                            />
                            <Button variant="contained" component="span">
                              Upload logo 6
                            </Button>
                          </label>
                          {uploadLogo6.blob ? (
                            <>
                              <Typography>
                                {uploadLogo6.name}
                                <IconButton
                                  edge="start"
                                  color="inherit"
                                  onClick={() => {
                                    onImageClose(6);
                                  }}
                                  aria-label="close"
                                  size="small"
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Typography>
                            </>
                          ) : null}
                          {uploadLogo6.size > 5000000 ? (
                            <Typography align="center" color="red">
                              Maximum Size limit is 5MB
                            </Typography>
                          ) : null}
                          {uploadLogo6.type != "" ? (
                            uploadLogo6.type != "image/png" &&
                            uploadLogo6.type != "image/jpeg" &&
                            uploadLogo6.type != "image/jpg" ? (
                              <Typography align="center" color="red">
                                Accept only png, jepg, jpg formats
                              </Typography>
                            ) : null
                          ) : null}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            required
                            error={Boolean(
                              touched.file_name && errors.file_name
                            )}
                            fullWidth
                            helperText={touched.file_name && errors.file_name}
                            label="file_name"
                            margin="small"
                            name="file_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.file_name}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 1.1 }}
                        >
                          <TextField
                            error={Boolean(
                              touched.generalContractor &&
                                errors.generalContractor
                            )}
                            fullWidth
                            helperText={
                              touched.generalContractor &&
                              errors.generalContractor
                            }
                            label="Main Contractor"
                            margin="small"
                            name="generalContractor"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.generalContractor}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(touched.Client && errors.Client)}
                            fullWidth
                            helperText={touched.Client && errors.Client}
                            label="Client"
                            margin="small"
                            name="Client"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.Client}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 1.1 }}
                        >
                          <TextField
                            error={Boolean(
                              touched.consultant && errors.consultant
                            )}
                            fullWidth
                            helperText={touched.consultant && errors.consultant}
                            label="consultant"
                            margin="small"
                            name="consultant"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.consultant}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(
                              touched.Subcontractor && errors.Subcontractor
                            )}
                            fullWidth
                            helperText={
                              touched.Subcontractor && errors.Subcontractor
                            }
                            label="Sub Contractor"
                            margin="small"
                            name="Subcontractor"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            type="Subcontractor"
                            value={values.Subcontractor}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={userInfo.projects.map((item) => ({
                              label: item.project_name,
                              value: item.project_id,
                            }))}
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
                                label="Project"
                              />
                            )}
                          />
                          {/* <TextField
                                                    error={Boolean(touched.project && errors.project)}
                                                    fullWidth
                                                    helperText={touched.project && errors.project}
                                                    label="project"
                                                    margin="small"
                                                    name="project"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.project}
                                                    variant="outlined"
                                                    size="small"
                                                /> */}
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(touched.country && errors.country)}
                            fullWidth
                            helperText={touched.country && errors.country}
                            label="Country"
                            margin="small"
                            name="country"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.country}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
                            error={Boolean(touched.building && errors.building)}
                            fullWidth
                            helperText={touched.building && errors.building}
                            label="Building"
                            margin="small"
                            name="building"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.building}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(touched.street && errors.street)}
                            fullWidth
                            helperText={touched.street && errors.street}
                            label="Street"
                            margin="small"
                            name="street"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.street}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
                            error={Boolean(touched.floor && errors.floor)}
                            fullWidth
                            helperText={touched.floor && errors.floor}
                            label="Floor"
                            margin="small"
                            name="floor"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.floor}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            required
                            error={Boolean(
                              touched.SUBMITTAL_TITLE && errors.SUBMITTAL_TITLE
                            )}
                            fullWidth
                            helperText={
                              touched.SUBMITTAL_TITLE && errors.SUBMITTAL_TITLE
                            }
                            label="Material Title"
                            margin="small"
                            name="SUBMITTAL_TITLE"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.SUBMITTAL_TITLE}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                              <DesktopDatePicker
                                fullWidth
                                label="Date"
                                inputFormat="MM/dd/yyyy"
                                value={date}
                                onChange={changeDateHandler}
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    size="small"
                                    margin="small"
                                    {...params}
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(
                              touched.subcontractorRep &&
                                errors.subcontractorRep
                            )}
                            fullWidth
                            helperText={
                              touched.subcontractorRep &&
                              errors.subcontractorRep
                            }
                            label="SubContractor Rep"
                            margin="small"
                            name="subcontractorRep"
                            value={values.subcontractorRep}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
                            disabled={true}
                            fullWidth
                            label="Revision"
                            margin="small"
                            name="Revision"
                            value="R-1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          sx={{
                            marginBottom: "0px",
                            marginLeft: 0.8,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Heading1
                            JFcontent="left"
                            style={{ alignSelf: "center" }}
                          >
                            Coppies
                          </Heading1>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={3.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
                            error={Boolean(
                              touched.soft_copies && errors.soft_copies
                            )}
                            fullWidth
                            helperText={
                              touched.soft_copies && errors.soft_copies
                            }
                            value={values.soft_copies}
                            label="Soft Copies"
                            name="soft_copies"
                            margin="small"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={3.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
                            error={Boolean(
                              touched.hard_copies && errors.hard_copies
                            )}
                            fullWidth
                            helperText={
                              touched.hard_copies && errors.hard_copies
                            }
                            label="Hard Copies"
                            name="hard_copies"
                            value={values.hard_copies}
                            margin="small"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
                            required
                            error={Boolean(
                              touched.SUBMITTAL_NO && errors.SUBMITTAL_NO
                            )}
                            fullWidth
                            helperText={
                              touched.SUBMITTAL_NO && errors.SUBMITTAL_NO
                            }
                            label="Material Reference"
                            name="SUBMITTAL_NO"
                            margin="small"
                            value={values.SUBMITTAL_NO}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(
                              touched.locationOfUse && errors.locationOfUse
                            )}
                            fullWidth
                            helperText={
                              touched.locationOfUse && errors.locationOfUse
                            }
                            label="location Of Use"
                            margin="small"
                            name="locationOfUse"
                            value={values.locationOfUse}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">Discipline</FormLabel>
                            <RadioGroup
                              row
                              aria-label="gender"
                              name="row-radio-buttons-group"
                              defaultValue={values.discipline}
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
                                  sx={{ marginBottom: "8px", float: "left" }}
                                >
                                  <TextField
                                    label="Specify Discipline"
                                    margin="small"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    variant="outlined"
                                    size="small"
                                  />
                                </Grid>
                              ) : null}
                            </RadioGroup>
                          </FormControl>

                          <Box fullWidth>
                            <div style={{ width: "100%" }}>
                              <div style={{ height: 400, width: "100%" }}>
                                <DataGrid
                                  rows={rows}
                                  columns={columns}
                                  editRowsModel={editRowsModel}
                                  onEditRowsModelChange={
                                    handleEditRowsModelChange
                                  }
                                />
                              </div>
                            </div>
                            <div className="d-flex w-100">
                              <Button
                                variant="contained"
                                onClick={handleOpen}
                                style={{
                                  backgroundColor: "var(--darkblue",
                                  marginLeft: "auto",
                                  marginBlock: "8px",
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(
                              touched.consultant_name && errors.consultant_name
                            )}
                            fullWidth
                            helperText={
                              touched.consultant_name && errors.consultant_name
                            }
                            label="Consultant Name"
                            margin="small"
                            name="consultant_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.consultant_name}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
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
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
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
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                              <DesktopDatePicker
                                fullWidth
                                label="Consultant Date"
                                inputFormat="MM/dd/yyyy"
                                value={consultantDate}
                                onChange={changeConsultantDateHandler}
                                renderInput={(params) => (
                                  <TextField
                                    size="small"
                                    margin="small"
                                    {...params}
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: "8px" }}>
                          <TextField
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
                            multiline
                            maxRows={5}
                            name="consultant_comments"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.consultant_comments}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
                            error={Boolean(
                              touched.contractor_name && errors.contractor_name
                            )}
                            fullWidth
                            helperText={
                              touched.contractor_name && errors.contractor_name
                            }
                            label="Contractor Name"
                            margin="small"
                            name="contractor_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contractor_name}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
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
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
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
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                              <DesktopDatePicker
                                fullWidth
                                label="Contractor Date"
                                inputFormat="MM/dd/yyyy"
                                value={contractorDate}
                                onChange={changeContractorDateHandler}
                                renderInput={(params) => (
                                  <TextField
                                    size="small"
                                    margin="small"
                                    {...params}
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: "8px" }}>
                          <TextField
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
                            multiline
                            maxRows={5}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contractor_comments}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
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
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <TextField
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
                            variant="outlined"
                            size="small"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <TextField
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
                            value={values.sub_contractor_signature}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Stack spacing={2}>
                              <DesktopDatePicker
                                fullWidth
                                label="Subcontractor Date"
                                inputFormat="MM/dd/yyyy"
                                value={subContractorDate}
                                onChange={changeSubContractorDateHandler}
                                renderInput={(params) => (
                                  <TextField
                                    margin="small"
                                    size="small"
                                    {...params}
                                  />
                                )}
                              />
                            </Stack>
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: "8px" }}>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={statusdata}
                            size="small"
                            value={selectedStatus}
                            onChange={(event, newValue) => {
                              if (newValue) {
                                setStatus(newValue.label);
                              } else {
                                setStatus(null);
                              }
                            }}
                            fullwidth
                            renderInput={(params) => (
                              <TextField
                                fullwidth
                                margin="small"
                                size="small"
                                {...params}
                                label="status"
                              />
                            )}
                          />
                          {/* <TextField
                                                    error={Boolean(touched.status && errors.status)}
                                                    fullWidth
                                                    helperText={touched.status && errors.status}
                                                    label="status"
                                                    margin="small"
                                                    name="status"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.status}
                                                    variant="outlined"
                                                    size="small"
                                                /> */}
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: "8px" }}>
                          <TextField
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
                            multiline
                            maxRows={5}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.sub_contractor_comments}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: "8px" }}>
                          <TextField
                            error={Boolean(
                              touched.doc_ctrl_comments &&
                                errors.doc_ctrl_comments
                            )}
                            fullWidth
                            helperText={
                              touched.doc_ctrl_comments &&
                              errors.doc_ctrl_comments
                            }
                            label="doc_ctrl_comments"
                            margin="small"
                            name="doc_ctrl_comments"
                            multiline
                            maxRows={5}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.doc_ctrl_comments}
                            variant="outlined"
                            size="small"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px" }}
                        >
                          <Autocomplete
                            onChange={(e, option) => {
                              handleSelectedReceiverChange(e, option);
                            }}
                            multiple
                            id="receiver_combo"
                            size="small"
                            options={users}
                            value={selectedReceivers}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.username}
                            renderOption={(props, option, { selected }) => (
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
                              />
                            )}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={5.9}
                          sx={{ marginBottom: "8px", marginLeft: 0.8 }}
                        >
                          <Autocomplete
                            onChange={(e, option) => {
                              handleSelectedApprovalChange(e, option);
                            }}
                            multiple
                            id="approval_combo"
                            size="small"
                            options={users}
                            value={selectedApprovals}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.username}
                            renderOption={(props, option, { selected }) => (
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
                        <Grid item xs={12}>
                          <PdfDocument />
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ py: 2 }}>
                            <Button
                              disabled={isSubmitting}
                              fullWidth
                              size="large"
                              type="submit"
                              onClick={handleSubmit}
                              variant="contained"
                              style={{ backgroundColor: "var(--darkblue)" }}
                            >
                              Preview
                            </Button>
                            {isError ? (
                              <Typography align="center" color="red">
                                {errMsg}
                              </Typography>
                            ) : null}
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Formik>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}

      {
        viewPDF && (
          <>
            <Grid item xs={1}>
              <IconButton onClick={backFromPreview}>
                <ArrowBackIcon
                  sx={{ color: "var(--darkblue)" }}
                ></ArrowBackIcon>
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
                  onClick={uploadMaterialSubmital}
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
  );
};

export default PrepareMaterialDrawingForm;

const statusdata = [
  { label: "Completed" },
  { label: "In Process" },
  { label: "Delayed" },
  { label: "Cancelled" },
];
