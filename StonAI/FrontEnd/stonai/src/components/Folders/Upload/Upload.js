import React, { Component, useContext } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Box from "@mui/material/Box";
import "./drop.css";
import Alert from "@mui/material/Alert";
import Observer from "./Observer.js";
import Modal from "@mui/material/Modal";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import { Button, Grid, List, Typography, Stack, Paper } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import LinearWithValueLabel from "./LinearProgress";
import FileUploadsStepper from "./FileUploadsStepper";
import { url } from "../../../url";
import ProgressBar from "./LinearProgress";
import FileUploadList from "./FileUploadList";
import DocumentTypeSelectList from "./DocumentTypeSelectList";
import DocumentTypeSelectListStorage from "./DocumentTypeSelectListStorage";
import { styled } from "@mui/material/styles";

import { withSnackbar } from "notistack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import DriveFolderUploadTwoToneIcon from "@mui/icons-material/DriveFolderUploadTwoTone";
import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";

import SendIcon from "@mui/icons-material/Send";
import DublicateFilesList from "./DublicateFilesList";
import moment from "moment";
import { TreeContext } from "../../../context/TreeContext.js";
const actions = [
  { icon: <CloudUploadTwoToneIcon />, name: "Copy" },
  { icon: <DriveFolderUploadTwoToneIcon />, name: "Save" },
];

const submittalList = [
  "Material Submittals",
  "Shop Drawing Submittals",
  "Submittals",
  "Site Instruction",
  "Technical Submittal",
  "Method Statement Submittal",
  "Non Conformance Report",
  "Prequalification Submittal",
  "Request for Information",
  "Work Inspection Request",
  "Meterial Inspection Request",
  "Architectural Inspection Request",
];

// var progress = [];
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "65vw",
  bgcolor: "var(--background)",
  boxShadow: 24,
  height: "70vh",
  borderRadius: "8px !important",
};
const dublicateModelStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "var(--background)",
  boxShadow: 24,
  height: "500px",
  borderRadius: "8px !important",
};

var server_url = url;
const steps = ["Upload", "Process", "Document Type"];
var count = 0;
var countStorage = 0;

const Input = styled("input")({
  display: "none",
});

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.dublicateFiles = React.createRef([]);
    this.acceptedFiles = React.createRef([]);
    this.ListNames = React.createRef([]);
    this.state = {
      radioButtonValue: "keep",
      uploadSuccess: undefined,
      uploadSuccessStorage: undefined,
      files: [],
      filesStorage: [],
      open: false,
      openStorage: false,
      openSpeedDial: false,
      openModelDuplicate: false,
      openModelBulk: false,
      dulicateFileName: "",
      loading: false,
      loadingStorage: false,
      progress: [],
      progressStorage: [],
      checkUploaded: 0,
      checkUploadedStorage: 0,
      activeStep: 0,
      activeStepStorage: 0,
      completedStorage: {},
      completed: {},
      docCategory: "",
      docCategoryStorage: "",
      docCategorySingle: [],
      docCategorySingleStorage: [],
      height: 0,
      subContractor: "",
      subContractorSingle: [],
      isAllowed: [],
      checked: [-1],
      checkedStorage: [-1],
      checkedGlobal: false,
      checkedGlobalStorage: false,
      currentLocation: "",
      subcontractorfromdb: [],
      isOut: [],
      otherDocumentCategory: [],
      tree: [],
    };
  }

  getSubcontractor = async () => {
    try {
      const res = await axios.post(
        server_url + "/Project/getSubcontractors",
        {
          project_id: this.props.project.project_id,
        },
        {
          headers: { token: this.props.user.token },
        }
      );

      this.setState({ subcontractorfromdb: res.data });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // componentDidMount() {
  //   this.getSubcontractor();
  // }

  handleOpenDupliModel = () => this.setState({ openModelDuplicate: true });
  handleCloseDupliModel = () => this.setState({ openModelDuplicate: false });
  handleCloseBulkModel = () => this.setState({ openModelBulk: false });
  handleOpenBulkModel = () => this.setState({ openModelBulk: true });

  handleOpenSpeedDial = () => this.setState({ openSpeedDial: true });
  handleCloseSpeedDial = () => this.setState({ openSpeedDial: false });
  static contextType = TreeContext;

  handleAnlayzeAllowed = (isAllowed, i) => {
    const newArray = [...this.state.isAllowed];
    newArray[i] = !isAllowed;
    this.setState({ isAllowed: newArray });
  };

  handleToogleOut = (isOut, i) => {
    const newArray = [...this.state.isOut];
    newArray[i] = isOut;
    this.setState({ isOut: newArray });
  };

  handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    this.props.enqueueSnackbar(title, { variant });
  };
  handleAnalysedVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    this.props.enqueueSnackbar("Document Analysed Sucessfully", { variant });
  };

  ////document type upload functionality
  handledocCategoryChange = (event, value) => {
    if (value && value.length > 0) {
      var newArray = [];
      this.state.checked.forEach((element) => {
        if (element !== -1) {
          // console.log("element", element, this.state.docCategorySingle);
          // newArray = [...this.state.docCategorySingle];
          newArray[element] = value;
        }
      });

      this.setState({ docCategorySingle: newArray });

      this.setState({ docCategory: value });
    }
  };

  ////document type upload functionality
  handledocCategoryChangeStorage = (option) => {
    this.setState({ docCategoryStorage: option });
  };

  handlesubContractorChange = (event) => {
    const value = event.target.value;

    if (value && value.length > 0) {
      var newArray = [];
      this.state.checked.forEach((element) => {
        if (element !== -1) {
          // console.log("element", element, this.state.docCategorySingle);
          // newArray = [...this.state.docCategorySingle];
          newArray[element] = value;
        }
      });

      this.setState({ subContractorSingle: newArray });

      this.setState({ subContractor: value });
    }
  };
  // upload document type

  handlesubContractorSingleChange = async (value, i) => {
    const newArray = [...this.state.subContractorSingle];
    newArray[i] = value;

    this.setState({
      subContractorSingle: newArray,
    }); //simple value

    const values = {
      name: value,
      project_id: this.props.project.project_id,
    };
    if (value && value !== "") {
      const response = await axios.post(
        url + "/Project/addSubcontractor",
        values,
        { headers: { token: this.props.user.token } }
      );
      this.getSubcontractor();
    }
  };

  handleSingledocCategoryChange = (value, i, height) => {
    if (value) {
      const newArray = [...this.state.docCategorySingle];
      newArray[i] = value;

      this.setState({
        docCategorySingle: newArray,
      });
      this.setState({
        height: height,
      }); //simple value
    }
  };

  handleSingledocCategoryChangeStorage = (option, i) => {
    const newArray = [...this.state.docCategorySingleStorage];
    newArray[i] = option;

    this.setState({
      docCategorySingleStorage: newArray,
    }); //simple value
  };

  handleSingleCheckToggle = (value) => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checked: newChecked });
  };
  handleSingleCheckToggleStorage = (value) => {
    const currentIndex = this.state.checkedStorage.indexOf(value);
    const newChecked = [...this.state.checkedStorage];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ checkedStorage: newChecked });
  };

  handleGlobalCheckChange = () => {
    this.setState({ checkedGlobal: !this.state.checkedGlobal });
    var newChecked = [...this.state.checked];

    if (this.state.checkedGlobal === false) {
      for (let index = 0; index < this.state.files.length; index++) {
        const currentIndex = this.state.checked.indexOf(index);

        if (currentIndex === -1) {
          newChecked.push(index);
        } else {
          newChecked.splice(currentIndex, 1);
        }
      }
      this.setState({ checked: newChecked });
    } else if (this.state.checkedGlobal === true) {
      this.setState({ checked: [-1] });
    }
  };

  handleGlobalCheckChangeStorage = () => {
    this.setState({ checkedGlobalStorage: !this.state.checkedGlobalStorage });
    var newChecked = [...this.state.checkedStorage];

    if (this.state.checkedGlobalStorage === false) {
      for (let index = 0; index < this.state.filesStorage.length; index++) {
        const currentIndex = this.state.checkedStorage.indexOf(index);

        if (currentIndex === -1) {
          newChecked.push(index);
        } else {
          newChecked.splice(currentIndex, 1);
        }
      }
      this.setState({ checkedStorage: newChecked });
    } else if (this.state.checkedGlobalStorage === true) {
      this.setState({ checkedStorage: [-1] });
    }
  };

  handleDelete = (index) => {
    const newFiles = [...this.state.files];
    newFiles.splice(index, 1);
    if (newFiles.length === 0) {
      this.handleSteps(0);
      this.handleCompleteSteps({});
    }

    this.setState({ files: newFiles });
  };

  handleDeleteStorage = (index) => {
    const newFiles = [...this.state.filesStorage];
    newFiles.splice(index, 1);
    if (newFiles.length === 0) {
      this.handleStepsStorage(0);
      this.handleCompleteStepsStorage({});
    }

    this.setState({ filesStorage: newFiles });
  };

  ////upload stepper functionality
  handleNext = () => {
    const newActiveStep = this.state.activeStep + 1;

    this.setState({ activeStep: newActiveStep });
  };

  handleSteps = (steps) => {
    this.setState({ activeStep: steps });
  };

  handleStepsStorage = (steps) => {
    this.setState({ activeStepStorage: steps });
  };
  handleCompleteStepsStorage = (completeSteps) => {
    this.setState({ completedStorage: completeSteps });
  };
  handleCompleteSteps = (completeSteps) => {
    this.setState({ completed: completeSteps });
  };
  handleReset = () => {
    this.handleSteps(0);
    this.handleCompleteSteps({});
    this.setState({
      uploadSuccess: undefined,
      files: [],
      loading: false,
      progress: [],
      checkUploaded: 0,
      activeStep: 0,
      completed: {},
      docCategory: "",
      docCategorySingle: [],
      subContractor: "",
      isAllowed: [],
      subContractorSingle: [],
      checked: [-1],
      checkedGlobal: false,
      isActive: [],
    });
  };
  handleResetStorage = () => {
    this.handleStepsStorage(0);
    this.handleCompleteStepsStorage({});
    this.setState({
      uploadSuccessStorage: undefined,
      filesStorage: [],
      loadingStorage: false,
      progressStorage: [],
      checkUploaded: 0,
      activeStepStorage: 0,
      completedStorage: {},
      docCategoryStorage: "",
      docCategorySingleStorage: [],
      checkedStorage: [-1],
      checkedGlobalStorage: false,
    });
  };
  getProjectFileNames = async () => {
    try {
      const res = await axios.post(
        server_url + "/Document/getAllDocumentsNamesForThisProject",
        {
          project_id: this.props.project.project_id,
        },
        {
          headers: { token: this.props.user.token },
        }
      );

      var list = [];
      var locations = [];
      res.data.forEach((item) => {
        list.push(item.fields.document_name[0]);
        locations.push(item.fields.document_category[0]);
      });
      return { list, locations };
    } catch (error) {
      console.log("Error:", error);
    }
  };
  DroptheFiles = async (acceptedFiles) => {
    if (acceptedFiles.length) {
      for (let i = 0; i < acceptedFiles.length; i++) {
        this.setState({ progress: [...this.state.progress, 0] });
        this.setState({ isAllowed: [...this.state.isAllowed, false] });
        this.setState({ isOut: [...this.state.isOut, false] });
        this.setState({
          otherDocumentCategory: [...this.state.otherDocumentCategory, ""],
        });
      }

      this.setState({ files: acceptedFiles.map((file) => file) });
      this.setState({
        docCategorySingle: acceptedFiles.map((file) => this.props.currentComp),
      });
      this.setState({
        subContractorSingle: acceptedFiles.map((file) => ""),
      });
      // this.handleSteps(1);
      this.setState({ activeStep: 0 });
      const newCompleted = this.state.completed;
      newCompleted[this.state.activeStep] = true;
      this.setState({ completed: newCompleted });
      this.handleNext();

      // this.handleCompleteSteps();
    }
  };
  isSubmittalDoc = (document_category) => {
    return submittalList.includes(document_category);
  };
  convertDocCatLabel = (document_category) => {
    if (
      document_category === "material_submittal" ||
      document_category === "Material Submittals"
    ) {
      return "Material Submittals";
    } else if (
      document_category === "shop_drawing_submittal" ||
      document_category === "Shop Drawing Submittals"
    ) {
      return "Shop Drawing Submittals";
    } else {
      return document_category;
    }
  };
  getOldFilePath = (document_category) => {
    var path = "";
    if (this.isSubmittalDoc(document_category)) {
      path = "Submittals/" + document_category;
    } else {
      path = document_category + "/" + document_category;
    }
    return path;
  };
  IncreaseFileName = async () => {
    const latestObj = this.ListNames.current.reduce((a, v) => {
      const [filename, ext] = v.split(".");
      var [name, version] = filename.split(/_V(?=\d+$)/);
      if (typeof version === "undefined") {
        version = 0;
      }
      name = name + "." + ext;
      a[name] = a[name] && +a[name] >= +version ? a[name] : version;

      return a;
    }, {});
    const newUploadFile = [];
    const newUploadFile2 = [];

    this.dublicateFiles.current.forEach((element, index) => {
      const [filename, ext] = element.name.split(".");
      var [name, version] = filename.split(/_V(?=\d+$)/);
      const withoutVersionName = name + "." + ext;
      newUploadFile[withoutVersionName] =
        parseInt(latestObj[withoutVersionName]) + 1;

      var fileTemp = new File(
        [element],
        name + "_V" + newUploadFile[withoutVersionName] + "." + ext,
        {
          type: element.type,
        }
      );

      Object.defineProperty(fileTemp, "locations", {
        value: this.getOldFilePath(this.convertDocCatLabel(element.locations)),
        writable: false,
      });
      this.dublicateFiles.current[index] = fileTemp;
    });

    return true;

    // const [filename, ext] = v.split(".");
    // var [name, version] = filename.split(/_V(?=\d+$)/);
  };
  mergeAcceptedDupliFiles = async () => {
    if (this.state.radioButtonValue === "keep") {
      await this.IncreaseFileName();
      const mergedFiles = Array.from(this.acceptedFiles.current).concat(
        Array.from(this.dublicateFiles.current)
      );
      return mergedFiles;
    } else {
      const mergedFiles = Array.from(this.acceptedFiles.current).concat(
        Array.from(this.dublicateFiles.current)
      );
      return mergedFiles;
    }
  };
  DroptheDuplicateFiles = async (acceptedFiles) => {
    if (acceptedFiles.length) {
      for (let i = 0; i < acceptedFiles.length; i++) {
        this.setState({ progress: [...this.state.progress, 0] });
        this.setState({ isAllowed: [...this.state.isAllowed, false] });
        this.setState({ isOut: [...this.state.isOut, false] });
        this.setState({
          otherDocumentCategory: [...this.state.otherDocumentCategory, ""],
        });
      }

      this.setState({ files: acceptedFiles.map((file) => file) });
      this.setState({
        docCategorySingle: acceptedFiles.map((file) => this.props.currentComp),
      });
      this.setState({
        subContractorSingle: acceptedFiles.map((file) => ""),
      });

      if (!this.state.activeStep) {
        // this.handleSteps(1);
        this.setState({ activeStep: 0 });
        const newCompleted = this.state.completed;
        newCompleted[this.state.activeStep] = true;
        this.setState({ completed: newCompleted });
        this.handleNext();

        // this.handleCompleteSteps();
      }
    }
    return true;
  };
  // This will check for duplicate
  checkForDublicateThenDrop = async (acceptedFiles) => {
    const res = await this.getProjectFileNames();
    this.ListNames.current = res.list;

    var listDup = [];
    acceptedFiles.forEach((file) => {
      if (this.ListNames.current.indexOf(file.name) !== -1) {
        file["locations"] =
          res.locations[this.ListNames.current.indexOf(file.name)];

        listDup.push(file);
      }
    });
    this.dublicateFiles.current = listDup;

    await this.IncreaseFileName();
    this.acceptedFiles.current = acceptedFiles.filter(
      (file) => !this.ListNames.current.includes(file.name)
    );

    if (this.dublicateFiles.current.length >= 1) {
      this.handleOpenDupliModel();
    }
    this.DroptheFiles(this.acceptedFiles.current);
  };
  // Handle dublicate file before upload
  handleDulicatateUploadButton = async () => {
    const acceptedFiles = await this.mergeAcceptedDupliFiles();

    await this.DroptheDuplicateFiles(acceptedFiles);
    this.handleCloseDupliModel();
  };
  ////dropzone file upload functionality
  handleDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      alert("Sorry! Maximum file limit is 5, you cannot upload more then that");
      return;
    }
    if (
      !this.props.permisions.canbulkuploaddocumentsdocument &&
      acceptedFiles.length > 1
    ) {
      this.handleOpenBulkModel();
      return;
    }
    this.checkForDublicateThenDrop(acceptedFiles);
  };

  handleDropStorage = async (acceptedFiles) => {
    if (acceptedFiles.length > 5) {
      alert("Sorry! Maximum file limit is 5, you cannot upload more then that");
      return;
    }
    for (let i = 0; i < acceptedFiles.length; i++) {
      this.setState({ progressStorage: [...this.state.progressStorage, 0] });
    }

    this.setState({ filesStorage: acceptedFiles.map((file) => file) });
    // this.setState({
    //   docCategorySingle: acceptedFiles.map((file) => this.props.currentComp),
    // });

    // this.handleSteps(1);
    this.setState({ activeStepStorage: 0 });
    const newCompleted = this.state.completedStorage;
    newCompleted[this.state.activeStepStorage] = true;
    this.setState({ completedStorage: newCompleted });
    this.handleNextStorage();
  };

  ////upload stepper functionality
  handleNextStorage = () => {
    const newActiveStep = this.state.activeStepStorage + 1;

    this.setState({ activeStepStorage: newActiveStep });
  };

  handleSubmit = () => {
    this.setState({ activeStep: 1 });
    const newCompleted = this.state.completed;
    newCompleted[this.state.activeStep] = true;
    this.setState({ completed: newCompleted });
    this.handleNext();

    this.uploadFile();
  };

  handleSubmitStorage = () => {
    this.setState({ activeStepStorage: 1 });
    const newCompleted = this.state.completedStorage;
    newCompleted[this.state.activeStepStorage] = true;
    this.setState({ completedStorage: newCompleted });
    this.handleNextStorage();

    this.uploadFileStorage();
  };

  uploadingInLoopStorage() {
    for (let i = 0; i < this.state.filesStorage.length; i++) {
      this.uploadStorage(i);
    }
  }

  updateKPI = async (totalTime) => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");
    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: this.props.user.user_id,
          departmentID: this.props.department.department_id,
          projectID: this.props.project.project_id,
          searchType: "DocSearch",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: totalTime,
        },
        { headers: { token: this.props.user.token } }
      );
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  uploadStorage = async (i) => {
    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);
      this.updateKPI(1000);
      var res = await axios.post(
        server_url + "/Document/createDocES",
        {
          name: this.state.filesStorage[i].name,
          size: this.state.filesStorage[i].size,
          lastModified: this.state.filesStorage[i].lastModifiedDate,
          type: this.state.filesStorage[i].type,
          category: this.state.docCategorySingleStorage[i],
          uploaded_by: this.props.user.username,
          uploader_id: this.props.user.user_id,
          project_id: this.props.project.project_id,
          document_status: "Bucket",
          uploaded_time: nd,
          isDeleted: "false",
          height: this.state.height,
        },
        {
          headers: { token: this.props.user.token },
        }
      );
    } catch (e) {}
    // this.setState({
    //   progress: (this.state.progress[i] = 50),
    // });

    const response = await axios(
      "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
        res.data._id
    );
    const url = response.data.uploadURL;

    const _this = this;
    var config = {
      headers: { "content-type": this.state.filesStorage[i].type },
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        let prog = _this.state.progressStorage;
        prog[i] = percentCompleted;

        _this.setState({
          progressStorage: prog,
        });
      },
    };

    try {
      await axios.put(url, this.state.filesStorage[i], config);
      this.handleClickVariant(
        "success",
        "The document is successfully uploaded"
      );

      axios
        .post(
          server_url + "/Document/analyseDoc",
          {
            name: this.state.filesStorage[i].name,
            size: this.state.filesStorage[i].size,
            lastModified: this.state.filesStorage[i].lastModifiedDate,
            type: this.state.filesStorage[i].type,
            // category: this.props.currentComp,
            document_category: this.state.docCategorySingleStorage[i],
            uploaded_by: this.props.user.username,
            document_id: res.data._id,
            project_id: this.props.project.project_id,
            document_status: "Bucket",
            isDeleted: "false",
            otherDocumentCategory: this.state.otherDocumentCategory[i],
          },
          {
            headers: { token: this.props.user.token },
          }
        )
        .then((response) => {});
      countStorage++;

      if (countStorage === this.state.filesStorage.length) {
        countStorage = 0;

        this.setState({ activeStepStorage: 2 });
        const newCompleted1 = this.state.completedStorage;
        newCompleted1[this.state.activeStepStorage] = true;
        this.setState({ completedStorage: newCompleted1 });

        this.handleNextStorage();
      }

      this.props.setCheck(!this.props.check);
    } catch (error) {}
  };
  async uploadFileStorage() {
    this.uploadingInLoopStorage();
  }

  handleResetOnClose = () => {
    this.setState({
      docCategory: "",
      docCategorySingle: [],
      subContractor: "",
      isAllowed: [],
      subContractorSingle: [],
      checked: [-1],
      checkedGlobal: false,
    });
  };
  handleOpen = () => {
    this.getSubcontractor();
    this.setState({ open: true });
  };
  handleClose = () => {
    // this.handleResetOnClose();

    this.setState({ open: false });
  };

  handleOpenStorage = () => this.setState({ openStorage: true });
  handleCloseStorage = () => {
    // this.handleResetOnClose();

    this.setState({ openStorage: false });
  };

  getUploadParams = ({ meta }) => {
    return { url: "https://httpbin.org/post" };
  };
  toast = (innerHTML) => {
    const el = document.getElementById("toast");
    el.innerHTML = innerHTML;
    el.className = "show";
    setTimeout(() => {
      el.className = el.className.replace("show", "");
    }, 3000);
  };

  handleFolder = (type) => {
    if (type === "pdf") {
      return faFilePdf;
    } else if (type === "docx" || type === "doc" || type === "msword") {
      return faFileWord;
    } else if (
      type === "jpeg" ||
      type === "jpg" ||
      type === "png" ||
      type === "svg"
    ) {
      return faImage;
    } else {
      return faFile;
    }
  };

  upload = async (i) => {
    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);
      console.log(
        "this.state.otherDocumentCategory",
        this.state.otherDocumentCategory
      );
      var res = "";
      console.log(
        "this.state.otherDocumentCategory[i]",
        this.state.otherDocumentCategory[i],
        i
      );

      this.updateKPI(1000);

      if (this.state.isAllowed[i]) {
        res = await axios.post(
          server_url + "/Document/createDocES",
          {
            name: this.state.files[i].name,
            size: this.state.files[i].size,
            lastModified: this.state.files[i].lastModifiedDate,
            type: this.state.files[i].type,
            category: this.state.docCategorySingle[i],
            uploaded_by: this.props.user.username,
            uploader_id: this.props.user.user_id,
            project_id: this.props.project.project_id,
            uploaded_time: nd,
            subContractor: this.state.subContractorSingle[i],
            document_status: "Analyzing",
            sub_category: this.state.docCategorySingle[i],
            isDeleted: "false",
            isOut: this.state.isOut[i],
            otherDocumentCategory: this.state.otherDocumentCategory[i],
            height: this.state.height,
          },
          {
            headers: { token: this.props.user.token },
          }
        );
      } else {
        res = await axios.post(
          server_url + "/Document/createDocES",
          {
            name: this.state.files[i].name,
            size: this.state.files[i].size,
            lastModified: this.state.files[i].lastModifiedDate,
            type: this.state.files[i].type,
            uploaded_by: this.props.user.username,
            uploader_id: this.props.user.user_id,
            project_id: this.props.project.project_id,
            uploaded_time: nd,
            subContractor: this.state.subContractorSingle[i],
            category: this.state.docCategorySingle[i],
            sub_category: this.state.docCategorySingle[i],
            isDeleted: "false",
            document_status: "Bucket",
            isOut: this.state.isOut[i],
            otherDocumentCategory: this.state.otherDocumentCategory[i],
            height: this.state.height,
          },
          {
            headers: { token: this.props.user.token },
          }
        );
      }
    } catch (e) {}
    // this.setState({
    //   progress: (this.state.progress[i] = 50),
    // });

    const response = await axios(
      "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
        res.data._id
    );
    const url = response.data.uploadURL;

    const _this = this;
    var config = {
      headers: { "content-type": this.state.files[i].type },
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        let prog = _this.state.progress;
        prog[i] = percentCompleted;

        _this.setState({
          progress: prog,
        });
      },
    };

    try {
      await axios.put(url, this.state.files[i], config);
      this.handleClickVariant(
        "success",
        "The document is successfully uploaded"
      );

      if (this.state.isAllowed[i]) {
        axios
          .post(
            server_url + "/Document/analyseDoc",
            {
              name: this.state.files[i].name,
              size: this.state.files[i].size,
              lastModified: this.state.files[i].lastModifiedDate,
              type: this.state.files[i].type,
              // category: this.props.currentComp,
              subContractor: this.state.subContractorSingle[i],
              document_category: this.state.docCategorySingle[i],
              uploaded_by: this.props.user.username,
              document_id: res.data._id,
              project_id: this.props.project.project_id,
              isDeleted: "false",
              otherDocumentCategory: this.state.otherDocumentCategory[i],
            },
            {
              headers: { token: this.props.user.token },
            }
          )
          .then((response) => {
            this.handleClickVariant(
              "success",
              "The document is successfully analysed"
            );
          });
      } else {
        axios
          .post(
            server_url + "/Document/analyseDoc",
            {
              name: this.state.files[i].name,
              size: this.state.files[i].size,
              lastModified: this.state.files[i].lastModifiedDate,
              type: this.state.files[i].type,
              // category: this.props.currentComp,
              subContractor: this.state.subContractorSingle[i],
              document_category: "Bucket",
              uploaded_by: this.props.user.username,
              document_id: res.data._id,
              project_id: this.props.project.project_id,
              isDeleted: "false",
              otherDocumentCategory: this.state.otherDocumentCategory[i],
            },
            {
              headers: { token: this.props.user.token },
            }
          )
          .then((response) => {
            // this.handleClickVariant(
            //   "success",
            //   "The document is successfully analysed"
            // );
          });
      }
      count++;

      if (count === this.state.files.length) {
        count = 0;

        // this.handleClickVariant(
        //   "success",
        //   "The documents successfully uploaded"
        // );
        this.setState({ activeStep: 2 });
        const newCompleted1 = this.state.completed;
        newCompleted1[this.state.activeStep] = true;
        this.setState({ completed: newCompleted1 });

        this.handleNext();
        this.handleReset();
      }

      this.props.setCheck(!this.props.check);
    } catch (error) {
      console.log("error", error);
    }
  };
  uploadingInLoop() {
    for (let i = 0; i < this.state.files.length; i++) {
      this.upload(i);
    }
  }
  async uploadFile() {
    this.uploadingInLoop();
  }
  componentDidUpdate(prevProps, prevState) {
    // Check if the context has changed
    if (this.state.tree !== this.context.treeContext) {
      // Update the tree state if the context has changed
      this.setState({ tree: this.context.treeContext });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ docCategory: nextProps.currentComp });
    this.setState({ currentLocation: nextProps.location.pathname });
    this.setState({ tree: this.context.treeContext });
  }

  handleBack = () => {
    this.setState({ activeStep: 0 });
  };
  handleBackStorage = () => {
    this.setState({ activeStepStorage: 0 });
  };
  HandleDocumentListMap = (file, i) => {
    return (
      <Grid>
        <DocumentTypeSelectList
          fileName={file.name}
          icon={this.handleFolder(
            file.name.substring(file.name.indexOf(".") + 1)
          )}
          docCategory={this.state.docCategory}
          docCategorySingle={this.state.docCategorySingle}
          handleSingledocCategoryChange={this.handleSingledocCategoryChange}
          checkedGlobal={this.state.checkedGlobal}
          handleGlobalCheckChange={this.handleGlobalCheckChange}
          handleSingleCheckToggle={this.handleSingleCheckToggle}
          checked={this.state.checked}
          index={i}
          handleDelete={this.handleDelete}
          handleDeleteSubcontractor={this.handleDeleteSubcontractor}
          handleBack={this.handleBack}
          subContractorSingle={this.state.subContractorSingle}
          handlesubContractorSingleChange={this.handlesubContractorSingleChange}
          subContractor={this.state.subContractor}
          setIsAllowed={this.handleAnlayzeAllowed}
          isAllowed={this.state.isAllowed}
          subcontractorfromdb={this.state.subcontractorfromdb}
          project_id={this.props.project.project_id}
          user={this.props.user}
          isOut={this.state.isOut}
          handleToogleOut={this.handleToogleOut}
          otherDocumentCategory={this.state.otherDocumentCategory}
          onChangeHandlerOtherDocCat={this.onChangeHandlerOtherDocCat}
          isSubmittalDoc={this.state.isSubmittalDoc}
          height={this.state.height}
          tree={this.state.tree}
        />
      </Grid>
    );
  };
  HandleDocumentListMapStorage = (file, i) => {
    return (
      <Grid>
        <DocumentTypeSelectListStorage
          fileName={file.name}
          icon={this.handleFolder(
            file.name.substring(file.name.indexOf(".") + 1)
          )}
          docCategory={this.state.docCategoryStorage}
          docCategorySingle={this.state.docCategorySingleStorage}
          handleSingledocCategoryChange={
            this.handleSingledocCategoryChangeStorage
          }
          checkedGlobal={this.state.checkedGlobalStorage}
          handleGlobalCheckChange={this.handleGlobalCheckChangeStorage}
          handleSingleCheckToggle={this.handleSingleCheckToggleStorage}
          checked={this.state.checkedStorage}
          index={i}
          handleDelete={this.handleDeleteStorage}
          handleBack={this.handleBackStorage}
          project={this.props.project}
          user={this.props.user}
        />
      </Grid>
    );
  };
  handleRadioButtonChange = (event) => {
    this.setState({ radioButtonValue: event.target.value });
  };
  handleValidationDoc = () => {
    let checkInvalid = false;
    let checkInvalidSub = false;

    this.state.docCategorySingle.forEach((element, index) => {
      if (element.length === 0) {
        if (
          this.state.checked.indexOf(index) === -1 ||
          this.state.docCategory.length === 0
        ) {
          checkInvalid = true;
        }
      }
    });

    // return checkInvalid || checkInvalidSub ? true : false;
    return checkInvalid ? true : false;
  };

  handleValidationDocStorage = () => {
    const checkNull = this.state.docCategorySingleStorage.filter(
      (x) => x !== null
    );

    if (checkNull.length === this.state.filesStorage.length) {
      return false;
    } else {
      return true;
    }
  };

  uploadMore = (files) => {
    const convertToArr = Object.values(files);

    const oldFiles = this.state.files;
    convertToArr.forEach((element) => {
      oldFiles.push(element);
    });

    if (oldFiles.length < 6) {
      this.setState({ files: oldFiles });
    } else {
      alert("Sorry you cannot upload more then 5 documents");
    }
  };
  onChangeHandlerOtherDocCat = (value, index) => {
    const newArray = [...this.state.otherDocumentCategory];
    newArray[index] = value;
    this.setState({ otherDocumentCategory: newArray });
  };
  uploadMoreStorage = (files) => {
    const convertToArr = Object.values(files);

    const oldFiles = this.state.filesStorage;
    convertToArr.forEach((element) => {
      oldFiles.push(element);
    });

    if (oldFiles.length < 6) {
      this.setState({ filesStorage: oldFiles });
    } else {
      alert("Sorry you cannot upload more then 5 documents");
    }
  };

  render() {
    // const CheckedFileUpload = withTreeCheck(FileUpload);
    // return <CheckedFileUpload tree={this.props.tree} />;

    var view;
    if (this.state.activeStep === 0) {
      view = (
        <div style={{ height: "fit-content" }}>
          <Dropzone
            onDrop={this.handleDrop}
            accept="application/pdf"
            // minSize={1024}
            // maxSize={3072000}
            style={{ cursor: "pointer" }}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => {
              const additionalClass = isDragAccept
                ? "accept"
                : isDragReject
                ? "reject"
                : "";

              return (
                <div
                  {...getRootProps({
                    className: `upload ${additionalClass}`,
                  })}
                  style={{ cursor: "pointer" }}
                >
                  <input {...getInputProps()} />
                  <span>{isDragActive ? "📂" : "📁"}</span>
                  <p>Drag'n'drop images, or click to select files</p>
                </div>
              );
            }}
          </Dropzone>
        </div>
      );
    } else if (this.state.activeStep === 1) {
      view = (
        <Box
          sx={{
            mt: 4,
          }}
        >
          <List
            dense={true}
            sx={{
              overflow: "auto",
              height: "35vh",
              overflowWrap: "break-word",
            }}
          >
            <DocumentTypeSelectList
              title="global"
              checkedGlobal={this.state.checkedGlobal}
              docCategory={this.state.docCategory}
              handleChange={this.handledocCategoryChange}
              checked={this.state.checked}
              handleGlobalCheckChange={this.handleGlobalCheckChange}
              handleBack={this.handleBack}
              subContractor={this.state.subContractor}
              handlesubContractorChange={this.handlesubContractorChange}
              setIsAllowed={this.handleAnlayzeAllowed}
              isAllowed={this.state.isAllowed}
              subcontractorfromdb={this.state.subcontractorfromdb}
              project_id={this.props.project.project_id}
              user={this.props.user}
              isOut={this.state.isOut}
              handleToogleOut={this.handleToogleOut}
              otherDocumentCategory={this.state.otherDocumentCategory}
              onChangeHandlerOtherDocCat={this.onChangeHandlerOtherDocCat}
              docCategorySingle={this.state.docCategorySingle}
              isSubmittalDoc={this.isSubmittalDoc}
            />

            {this.state.files
              ? this.state.files.map((file, i) =>
                  this.HandleDocumentListMap(file, i)
                )
              : null}
          </List>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button
              endIcon={<SendIcon />}
              onClick={this.handleSubmit}
              variant="contained"
              sx={{ color: "white", backgroundColor: "var(--blue)" }}
              disabled={this.handleValidationDoc()}
            >
              Next
            </Button>

            <label htmlFor="contained-button-file">
              <Input
                accept="application/pdf"
                id="contained-button-file"
                multiple
                type="file"
                onChange={(e) => this.uploadMore(e.target.files)}
              />
              <Button
                variant="contained"
                component="span"
                sx={{ marginLeft: 2, color: "white" }}
              >
                Add more
              </Button>
            </label>
          </Box>
        </Box>
      );
    } else if (this.state.activeStep === 2 || this.state.activeStep === 3) {
      view = (
        <>
          <Box sx={{ mt: 4 }}>
            <List
              dense={true}
              sx={{
                height: "35vh",
                overflow: "auto",
                overflowWrap: "break-word",
              }}
            >
              {this.state.files.map((file, i) => (
                <FileUploadList
                  fileName={file.name}
                  uploadProgress={this.state.progress[i]}
                  icon={this.handleFolder(
                    file.name.substring(file.name.indexOf(".") + 1)
                  )}
                />
              ))}
            </List>
          </Box>

          {this.state.activeStep === 3 ? (
            <div style={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                style={{ color: "green", fontWeight: 500 }}
              >
                Files upload completed{" "}
              </Typography>
              <Button
                onClick={this.handleReset}
                style={{
                  color: "var(--blue)",
                }}
              >
                Upload a new doc
              </Button>
            </div>
          ) : null}
        </>
      );
    }

    var viewStorage;
    if (this.state.activeStepStorage === 0) {
      viewStorage = (
        <div style={{ height: "fit-content" }}>
          <Dropzone
            onDrop={this.handleDropStorage}
            accept="application/pdf"

            // minSize={1024}
            // maxSize={3072000}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => {
              const additionalClass = isDragAccept
                ? "accept"
                : isDragReject
                ? "reject"
                : "";

              return (
                <div
                  {...getRootProps({
                    className: `upload ${additionalClass}`,
                  })}
                >
                  <input {...getInputProps()} />
                  <span>{isDragActive ? "📂" : "📁"}</span>
                  <p>Drag'n'drop images, or click to select files</p>
                </div>
              );
            }}
          </Dropzone>
        </div>
      );
    } else if (this.state.activeStepStorage === 1) {
      viewStorage = (
        <Box
          sx={{
            mt: 4,
          }}
        >
          <List
            dense={true}
            sx={{
              overflow: "auto",
              height: "35vh",
              overflowWrap: "break-word",
            }}
          >
            <DocumentTypeSelectListStorage
              title="global"
              checkedGlobal={this.state.checkedGlobalStorage}
              docCategory={this.state.docCategoryStorage}
              docCategorySingle={this.state.docCategorySingleStorage}
              handleChange={this.handledocCategoryChangeStorage}
              checked={this.state.checkedStorage}
              handleGlobalCheckChange={this.handleGlobalCheckChangeStorage}
              handleBack={this.handleBackStorage}
              project={this.props.project}
              user={this.props.user}
            />

            {this.state.filesStorage
              ? this.state.filesStorage.map((file, i) =>
                  this.HandleDocumentListMapStorage(file, i)
                )
              : null}
          </List>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button
              endIcon={<SendIcon />}
              onClick={this.handleSubmitStorage}
              variant="contained"
              sx={{ color: "white", backgroundColor: "var(--blue)" }}
              disabled={this.handleValidationDocStorage()}
            >
              Next
            </Button>

            <label htmlFor="contained-button-file">
              <Input
                accept="application/pdf"
                id="contained-button-file"
                multiple
                type="file"
                onChange={(e) => this.uploadMoreStorage(e.target.files)}
              />
              <Button
                variant="contained"
                component="span"
                sx={{ marginLeft: 2, color: "white" }}
              >
                Add more
              </Button>
            </label>
          </Box>
        </Box>
      );
    } else if (
      this.state.activeStepStorage === 2 ||
      this.state.activeStepStorage === 3
    ) {
      viewStorage = (
        <>
          <Box sx={{ mt: 4 }}>
            <List
              dense={true}
              sx={{
                height: "35vh",
                overflow: "auto",
                overflowWrap: "break-word",
              }}
            >
              {this.state.filesStorage.map((file, i) => (
                <Grid>
                  <FileUploadList
                    fileName={file.name}
                    uploadProgress={this.state.progressStorage[i]}
                    icon={this.handleFolder(
                      file.name.substring(file.name.indexOf(".") + 1)
                    )}
                  />
                </Grid>
              ))}
            </List>
          </Box>

          {this.state.activeStepStorage === 3 ? (
            <div style={{ textAlign: "center" }}>
              <Typography
                variant="h5"
                style={{ color: "green", fontWeight: 500 }}
              >
                Files upload completed{" "}
              </Typography>
              <Button
                onClick={this.handleResetStorage}
                style={{
                  color: "var(--blue)",
                }}
              >
                Upload a new doc
              </Button>
            </div>
          ) : null}
        </>
      );
    }
    return (
      <div>
        <div>
          <Box
            style={{
              margin: 0,
              top: "auto",
              right: 20,
              bottom: 20,
              left: "auto",
              position: "fixed",
              zIndex: "5",
            }}
          >
            {this.state.currentLocation === "/app/folder" &&
            this.props.permisions.canuplaoddocumentsdocument ? (
              <>
                <Backdrop open={this.state.openSpeedDial} />

                <SpeedDial
                  className="UploadBtn"
                  ariaLabel="SpeedDial basic example"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    height: "175px",
                  }}
                  icon={
                    <Typography sx={{ whiteSpace: "nowrap", padding: "0px" }}>
                      upload Document
                    </Typography>
                  }
                  onClose={this.handleCloseSpeedDial}
                  onOpen={this.handleOpenSpeedDial}
                  open={this.state.openSpeedDial}
                >
                  <SpeedDialAction
                    className="speeddialSubIcon"
                    icon={
                      // <CloudUploadTwoToneIcon
                      // sx={{ height: 30, width: 30}} />

                      <Typography className="UploadText">
                        Upload and analyze
                      </Typography>
                    }
                    onClick={this.handleOpen}
                  />
                  <SpeedDialAction
                    className="speeddialSubIcon"
                    icon={
                      //   <DriveFolderUploadTwoToneIcon
                      //     sx={{ height: 30, width: 30 }}
                      //   />

                      <Typography className="UploadText">Upload</Typography>
                    }
                    onClick={this.handleOpenStorage}
                  />
                </SpeedDial>
              </>
            ) : null}
          </Box>
          <Modal
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // styles={{ minHeight: 200, maxHeight: 250 }}
          >
            <Box sx={style}>
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
                  Upload Document
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FileUploadsStepper
                  setActiveStep={this.handleSteps}
                  activeStep={this.state.activeStep}
                  completed={this.state.completed}
                  setCompleted={this.handleCompleteSteps}
                />
                {view}
              </Box>
            </Box>
          </Modal>

          <Modal
            open={this.state.openModelDuplicate}
            onClose={this.handleCloseDupliModel}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // styles={{ minHeight: 200, maxHeight: 250 }}
          >
            <Box sx={dublicateModelStyle}>
              <Box
                sx={{
                  backgroundColor: "var(--blue)",
                  height: "10px",
                  p: 2,
                  fontWeight: "bolder",
                  display: "flex",
                  alignItems: "center",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <Typography variant="h4" sx={{ color: "white" }}>
                  Upload options
                </Typography>
              </Box>
              <Box className="" sx={{ p: 2 }}>
                <Typography sx={{ color: "gray", fontSize: "17px" }}>
                  One or more items already exists in this Project. Do you want
                  to skip the items or keep both items with new version name
                  shown below?
                </Typography>
                <List
                  sx={{
                    position: "relative",
                    overflow: "auto",
                    maxHeight: 300,
                  }}
                >
                  <DublicateFilesList
                    dublicateFiles={this.dublicateFiles.current}
                  />
                </List>
              </Box>
              <Box className="Uploaderrorfooter">
                <Button
                  endIcon={<SendIcon />}
                  onClick={this.handleCloseDupliModel}
                  variant="contained"
                  sx={{ color: "white", backgroundColor: "var(--blue)" }}
                >
                  Skip
                </Button>
                <Button
                  endIcon={<SendIcon />}
                  onClick={this.handleDulicatateUploadButton}
                  variant="contained"
                  sx={{ color: "white", backgroundColor: "var(--blue)" }}
                >
                  Keep Both
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={this.state.openStorage}
            onClose={this.handleCloseStorage}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // styles={{ minHeight: 200, maxHeight: 250 }}
          >
            <Box sx={style}>
              <Box
                sx={{
                  backgroundColor: "var(--blue)",
                  height: "15%",
                  p: 2,
                  fontWeight: "bolder",
                }}
              >
                <Typography variant="h4" sx={{ color: "white" }}>
                  Upload Document
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FileUploadsStepper
                  setActiveStep={this.handleStepsStorage}
                  activeStep={this.state.activeStepStorage}
                  completed={this.state.completedStorage}
                  setCompleted={this.handleCompleteStepsStorage}
                />
                {viewStorage}
              </Box>
            </Box>
          </Modal>
          <Modal
            open={this.state.openModelBulk}
            onClose={this.handleCloseBulkModel}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            // styles={{ minHeight: 200, maxHeight: 250 }}
          >
            <Box sx={dublicateModelStyle}>
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
                  Bulk Upload Permission
                </Typography>
              </Box>
              <Box className="" sx={{ p: 2 }}>
                <Alert severity="error">
                  {" "}
                  Sorry! You don't have permission to bulk upload, you can only
                  upload one file at a time
                </Alert>

                {/* <Typography sx={{ color: "gray", fontSize: "17px" }}>
                  You dont have permission to bulk upload
                </Typography> */}
                {/* <FormControl>


                  <RadioGroup
                    column
                    aria-labelledby="demo-form-control-label-placement"
                    name="position"
                    value={this.state.radioButtonValue}
                    onChange={this.handleRadioButtonChange}
                  >
                    <FormControlLabel
                      value="replace"
                      control={<Radio />}
                      label="Replace existing file"
                    />
                    <FormControlLabel
                      value="keep"
                      control={<Radio />}
                      label="Keep both files"
                    />
                  </RadioGroup>
                </FormControl> */}
              </Box>
              <Box className="Uploaderrorfooter">
                <Button
                  onClick={this.handleCloseBulkModel}
                  variant="contained"
                  sx={{ color: "white", backgroundColor: "var(--blue)" }}
                >
                  OK
                </Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
    );
  }
}
export default withSnackbar(FileUpload);
