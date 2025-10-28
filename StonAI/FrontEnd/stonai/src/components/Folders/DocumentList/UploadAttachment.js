import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Dropzone from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faTimes from "@fortawesome/free-solid-svg-icons";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import "../../NotificationModel/NotificationModel.css";
import ButtonStyled from "../../../Reusable Components/Buttons/ButtonStyled";
import { Formik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import { url } from "../../../url";
import {
  Button,
  Grid,
  List,
  Typography,
  Box,
  Checkbox,
  Modal,
} from "@mui/material";
import FileUploadsStepper from "../Upload/FileUploadsStepper";
import ProgressBar from "../Upload/LinearProgress";
import FileUploadList from "../Upload/FileUploadList";
import DocumentTypeSelectListAttachment from "../Upload/DocumentTypeSelectListAttachment";
import SendIcon from "@mui/icons-material/Send";
import { withSnackbar } from "notistack";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const dublicateModelStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "var(--background)",
  boxShadow: 24,
  height: "210px",
  borderRadius: "8px !important",
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
  paddingBottom: "20px",
};
var server_url = url;
const steps = ["Upload", "Process", "Document Type"];
var count = 0;
var countStorage = 0;
class UploadAttachment extends Component {
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
      subContractor: "",
      subContractorSingle: [],
      isAllowed: [],
      checked: [-1],
      checkedStorage: [-1],
      checkedGlobal: false,
      checkedGlobalStorage: false,
      currentLocation: "",
      subcontractorfromdb: [],
    };
  }
  handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    this.props.enqueueSnackbar(title, { variant });
  };
  handleStepsStorage = (steps) => {
    this.setState({ activeStepStorage: steps });
  };
  async uploadFileStorage() {
    this.uploadingInLoopStorage();
  }
  uploadingInLoopStorage() {
    for (let i = 0; i < this.state.filesStorage.length; i++) {
      this.uploadStorage(i);
    }
  }
  handleOpenDupliModel = () => this.setState({ openModelDuplicate: true });
  handleCloseDupliModel = () => this.setState({ openModelDuplicate: false });

  uploadStorage = async (i) => {
    console.log("storage ", this.state.filesStorage[i]);
    try {
      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var offset = 4; //UTC of Dubai is +04.00
      var dubai = utc + 3600000 * offset;
      var nd = new Date(dubai);
      console.log("this.props.user", this.props.user);
      var res = await axios.post(
        server_url + "/documentLinking/updateDocumentAttachment",
        {
          name: this.state.filesStorage[i].name,
          size: this.state.filesStorage[i].size,
          lastModified: this.state.filesStorage[i].lastModifiedDate,
          type: this.state.filesStorage[i].type,
          uploaded_by: this.props.user.username,
          uploader_id: this.props.user.user_id,
          project_id: this.props.project.project_id,
          document_id: this.props.file.document_id,
          document_status: "Bucket",
          uploaded_time: nd,
          isDeleted: "false",
        },
        {
          headers: { token: this.props.user.token },
        }
      );
      console.log(
        "uploadUrl",
        this.props.file.document_id + this.state.filesStorage[i].name
      );
      const response = await axios(
        "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
          this.props.file.document_id +
          this.state.filesStorage[i].name
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
          console.log(percentCompleted);
        },
      };
      console.log("this.state.files[i]", this.state.filesStorage[i]);

      await axios.put(url, this.state.filesStorage[i], config);
      console.log("res.data._id", res.data._id);
      countStorage++;
      console.log("count", countStorage);

      if (countStorage === this.state.filesStorage.length) {
        countStorage = 0;
        console.log("count", countStorage);
        this.handleClickVariant(
          "success",
          "The document is successfully uploaded"
        );
        this.setState({ activeStepStorage: 2 });
        const newCompleted1 = this.state.completedStorage;
        newCompleted1[this.state.activeStepStorage] = true;
        this.setState({ completedStorage: newCompleted1 });

        this.handleNextStorage();
      }
    } catch (error) {
      console.log("error", error);
    }
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
  handleSubmitStorage = () => {
    console.log("storage mf");
    this.setState({ activeStepStorage: 1 });
    const newCompleted = this.state.completedStorage;
    newCompleted[this.state.activeStepStorage] = true;
    this.setState({ completedStorage: newCompleted });
    this.handleNextStorage();

    this.uploadFileStorage();
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
  handleCompleteStepsStorage = (completeSteps) => {
    this.setState({ completedStorage: completeSteps });
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
  getAttachmentForThisFile = async () => {
    const res = this.props.file?.document_attachment;
    var list = [];
    res?.forEach((item) => {
      list.push(item.name);
    });
    return list;
  };
  handleNext = () => {
    const newActiveStep = this.state.activeStepStorage + 1;
    console.log("newActiveStep", newActiveStep);
    this.setState({ activeStepStorage: newActiveStep });
  };

  DroptheFiles = async (acceptedFiles) => {
    if (acceptedFiles.length) {
      for (let i = 0; i < acceptedFiles.length; i++) {
        this.setState({ progressStorage: [...this.state.progressStorage, 0] });
        this.setState({ isAllowed: [...this.state.isAllowed, false] });
      }
      console.log(this.state.progress);
      this.setState({ filesStorage: acceptedFiles.map((file) => file) });
      // this.handleSteps(1);
      this.setState({ activeStepStorage: 0 });
      const newCompleted = this.state.completedStorage;
      newCompleted[this.state.activeStepStorage] = true;
      this.setState({ completedStorage: newCompleted });
      this.handleNext();

      // this.handleCompleteSteps();
    }
  };
  checkForDublicateThenDrop = async (acceptedFiles) => {
    this.ListNames.current = await this.getAttachmentForThisFile();
    console.log("acceptedFiles", acceptedFiles);
    console.log("acceptedFiles.current", this.ListNames.current);
    this.dublicateFiles.current = acceptedFiles.filter((file) =>
      this.ListNames.current.includes(file.name)
    );
    this.acceptedFiles.current = acceptedFiles.filter(
      (file) => !this.ListNames.current.includes(file.name)
    );
    console.log("acceptedFiles.dupli", this.dublicateFiles.current);
    if (this.dublicateFiles.current.length >= 1) {
      this.handleOpenDupliModel();
    }
    this.DroptheFiles(this.acceptedFiles.current);
  };
  handleDropStorage = async (acceptedFiles) => {
    console.log("acceptedFiles", acceptedFiles);
    if (acceptedFiles.length > 5) {
      alert("Sorry! Maximum file limit is 5, you cannot upload more then that");
      return;
    }
    this.checkForDublicateThenDrop(acceptedFiles);
  };
  handleNextStorage = () => {
    const newActiveStep = this.state.activeStepStorage + 1;
    console.log("newActiveStep", newActiveStep);
    this.setState({ activeStepStorage: newActiveStep });
  };
  HandleDocumentListMapStorage = (file, i) => {
    return (
      <Grid>
        <DocumentTypeSelectListAttachment
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
  render() {
    var viewStorage;
    if (this.state.activeStepStorage === 0) {
      viewStorage = (
        <div style={{ height: "fit-content" }}>
          <Dropzone
            onDrop={this.handleDropStorage}
            // accept="image/jpeg, image/png, image/svg, image/jpg, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.ms-powerpoint,.xlsx,.xls,.dwg ,.pptx,.ppt"
            // accept="*"
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
            >
              Next
            </Button>
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
              {/* <Button
                onClick={this.handleResetStorage}
                style={{
                  color: "var(--blue)",
                }}
              >
                Upload a new doc
              </Button> */}
            </div>
          ) : null}
        </>
      );
    }
    return (
      <>
        <Modal
          open={this.props.openAttachModel}
          onClose={this.props.handleCloseAttachModel}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
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
                Upload Attachment
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
                Upload options
              </Typography>
            </Box>
            <Box className="" sx={{ p: 2 }}>
              <Typography sx={{ color: "gray", fontSize: "17px" }}>
                One or more items already exists in this location. Please rename
                the file and upload again.
              </Typography>
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
                endIcon={<SendIcon />}
                onClick={this.handleCloseDupliModel}
                variant="contained"
                sx={{ color: "white", backgroundColor: "var(--blue)" }}
              >
                Okay
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
}

const actions = [
  { label: "Infomation", id: 1 },
  { label: "Approve", id: 2 },
  { label: "Reject", id: 3 },
];

export default withSnackbar(UploadAttachment);
