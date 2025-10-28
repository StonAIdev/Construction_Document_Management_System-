import React, { Component } from "react";
import axios from "axios";
import Dropzone from "react-dropzone";
import Box from "@mui/material/Box";
import "../../components/Folders/Upload/drop.css";

import Modal from "@mui/material/Modal";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, Grid, List, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import LinearWithValueLabel from "../../components/Folders/Upload/LinearProgress";
import FileUploadsStepper from "../../components/Folders/Upload/FileUploadsStepper";
import { url } from "../../url";
import ProgressBar from "../../components/Folders/Upload/LinearProgress";
import FileUploadList from "../../components/Folders/Upload/FileUploadList";
import DocumentTypeSelectList from "../../components/Folders/Upload/DocumentTypeSelectList";
import { withSnackbar } from "notistack";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import SendIcon from "@mui/icons-material/Send";

// var progress = [];
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vh",
  bgcolor: "var(--background)",
  border: "2px solid #000",
  boxShadow: 24,
  height: "70vh",
};

var server_url = url;
const steps = ["Upload", "Process", "Document Type"];
var count = 0;

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadSuccess: undefined,
      files: [],
      loading: false,
      progress: [],
      checkUploaded: 0,
      activeStep: 1,
      completed: {},
      docCategory: "",
      docCategorySingle: [],
      checked: [-1],
      checkedGlobal: false,
      currentLocation: "",
    };
  }

  handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    this.props.enqueueSnackbar(title, { variant });
  };
  handleAnalysedVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    this.props.enqueueSnackbar("Document Analysed Sucessfully", { variant });
  };

  ////document type upload functionality
  handledocCategoryChange = (event) => {
    this.setState({ docCategory: event.target.value });
  };

  handleSingledocCategoryChange = (event, i) => {
    const newArray = [...this.state.docCategorySingle];
    newArray[i] = event.target.value;

    this.setState({
      docCategorySingle: newArray,
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

  handleDelete = (index) => {
    const newFiles = [...this.state.files];
    newFiles.splice(index, 1);
    if (newFiles.length === 0) {
      this.handleSteps(0);
      this.handleCompleteSteps({});
    }

    this.setState({ files: newFiles });
  };

  ////upload stepper functionality
  handleNext = () => {
    const newActiveStep = this.state.activeStep + 1;

    this.setState({ activeStep: newActiveStep });
  };

  handleSteps = (steps) => {
    this.setState({ activeStep: steps });
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
      checked: [-1],
      checkedGlobal: false,
    });
  };

  ////dropzone file upload functionality
  handleDrop = (acceptedFiles) => {
    for (let i = 0; i < acceptedFiles.length; i++) {
      this.setState({ progress: [...this.state.progress, 0] });
    }

    this.setState({ files: acceptedFiles.map((file) => file) });
    this.setState({
      docCategorySingle: acceptedFiles.map((file) => this.props.currentComp),
    });

    // this.handleSteps(1);
    this.setState({ activeStep: 0 });
    const newCompleted = this.state.completed;
    newCompleted[this.state.activeStep] = true;
    this.setState({ completed: newCompleted });
    this.handleNext();

    // this.handleCompleteSteps();
  };

  handleSubmit = () => {
    this.setState({ activeStep: 1 });
    const newCompleted = this.state.completed;
    newCompleted[this.state.activeStep] = true;
    this.setState({ completed: newCompleted });
    this.handleNext();

    this.uploadFile();
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

      var res = await axios.post(
        server_url + "/Document/createDocES",
        {
          name: this.props.file.name,
          size: this.props.file.size,
          lastModified: this.props.file.lastModifiedDateTime,
          type: this.props.file.type,
          // category: this.props.currentComp,
          category: this.state.docCategorySingle[i],
          uploaded_by: this.props.user.username,
          project_id: this.props.project.project_id,
          uploaded_time: nd,
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
      headers: { "content-type": this.props.file.type },
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
      await axios.put(url, this.props.file, config);

      axios
        .post(
          server_url + "/Document/analyseDoc",
          {
            name: this.props.file.name,
            size: this.props.file.size,
            lastModified: this.props.file.lastModifiedDate,
            type: this.props.file.type,
            // category: this.props.currentComp,
            document_category: this.state.docCategorySingle[i],
            uploaded_by: this.props.user.username,
            document_id: res.data._id,
            project_id: this.props.project.project_id,
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
      count++;

      if (count === this.props.file.length) {
        count = 0;

        this.handleClickVariant(
          "success",
          "The document is successfully uploaded"
        );
        this.setState({ activeStep: 2 });
        const newCompleted1 = this.state.completed;
        newCompleted1[this.state.activeStep] = true;
        this.setState({ completed: newCompleted1 });

        this.handleNext();
      }

      this.props.setCheck(!this.props.check);
    } catch (error) {}
  };
  uploadingInLoop() {
    this.upload(this.props.file);
  }
  async uploadFile() {
    this.uploadingInLoop();
  }

  handleSingledocCategoryPush = (val) => {
    this.setState({
      docCategorySingle: [...this.state.docCategorySingle, val],
    });
  };

  handleBack = () => {
    this.setState({ activeStep: 0 });
  };
  HandleDocumentListMap = (file, i) => {
    // this.handleSingledocCategoryPush("");
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
          handleBack={this.handleBack}
        />
      </Grid>
    );
  };

  handleValidationDoc = () => {
    let checkValid = false;

    this.state.docCategorySingle.forEach((element, index) => {
      if (element.length === 0) {
        console.log(
          "testtt",
          this.state.checked.indexOf(index),
          this.state.docCategory,
          index
        );
        if (
          this.state.checked.indexOf(index) === -1 ||
          this.state.docCategory.length === 0
        ) {
          console.log(
            "inside check",
            this.state.checked.indexOf(index),
            this.state.docCategory,
            index
          );

          checkValid = true;
        }
      }
    });

    return checkValid;
  };

  render() {
    var view;
    if (this.state.activeStep === 1) {
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
            />
            {this.HandleDocumentListMap(this.props.file)}
          </List>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button
              endIcon={<SendIcon />}
              onClick={this.handleSubmit}
              variant="contained"
              sx={{ color: "white", backgroundColor: "var(--blue)" }}
              // disabled={this.handleValidationDoc()}
            >
              Next
            </Button>
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
              <Grid>
                <FileUploadList
                  fileName={this.props.file.name}
                  uploadProgress={this.state.progress[0]}
                  icon={this.handleFolder(
                    this.props.file.name.substring(
                      this.props.file.name.indexOf(".") + 1
                    )
                  )}
                />
              </Grid>
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
                onClick={this.props.handleReset}
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
          <Modal
            open={this.props.open}
            onClose={this.props.handleClose}
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
                  setActiveStep={this.handleSteps}
                  activeStep={this.state.activeStep}
                  completed={this.state.completed}
                  setCompleted={this.handleCompleteSteps}
                />
                {view}
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
    );
  }
}
export default withSnackbar(FileUpload);
