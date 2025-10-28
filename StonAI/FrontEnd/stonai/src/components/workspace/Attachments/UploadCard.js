import React, { useState, useEffect } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import "./UploadCard.css";
import Heading1 from "../../../Reusable Components/Headings/Heading1";
import DownloadIcon from "@mui/icons-material/Download";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { url } from "../../../url";
import generatePdfThumbnails from "pdf-thumbnails-generator";
import Popover from "@mui/material/Popover";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import LoadingButton from "@mui/lab/LoadingButton";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import { useSnackbar } from "notistack";

function UploadCard({
  name,
  size,
  type,
  bytes,
  project,
  user,
  file,
  userInfo,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [imagesrc, setimagesrc] = useState("");
  const [uploadopacity, setuploadopacity] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [subContractor, setSubcontractorType] = useState("");

  const [docType, setDocType] = useState("");

  const [loading, setLoading] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  console.log("filePdf", file);

  useEffect(() => {
    if (imagesrc === "") {
      generateThumbnails();
    }
  }, [imagesrc]);

  const generateThumbnails = async () => {
    try {
      if (type === "application/pdf") {
        console.log("pdf aya ha", type);
        // var f = new File([file], name);'
        var raw = window.atob(file.contentBytes);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength)); // pass your byte response to this constructor

        for (var i = 0; i < rawLength; i++) {
          array[i] = raw.charCodeAt(i);
        }

        var blob = new Blob([array], { type: file.contentType });

        const converted = window.URL.createObjectURL(blob);

        const thumbnails = await generatePdfThumbnails(converted, 118);
        console.log("thumbnals", thumbnails);
        setimagesrc(thumbnails[0]?.thumbnail);
      } else {
        console.log("img aya ha", type);

        // var f = new File([file], name);'
        var raw = window.atob(file.contentBytes);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength)); // pass your byte response to this constructor

        for (var i = 0; i < rawLength; i++) {
          array[i] = raw.charCodeAt(i);
        }

        var blob = new Blob([array], { type: file.contentType });

        const converted = window.URL.createObjectURL(blob);
        console.log("img converted ha", converted);

        setimagesrc(converted);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function HideHeader() {
    setuploadopacity(true);
  }

  function showheader() {
    setuploadopacity(false);
  }

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const handleFolder = (type) => {
    if (type === "application/pdf") {
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

  function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
      var ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }
  function saveByteArray(reportName, byte, type) {
    var blob = new Blob([byte], { type: type });
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
  }

  const handleDownloadAttachments = (name, contentBytes, type) => {
    // var sampleArr = base64ToArrayBuffer(contentBytes);
    saveByteArray(name, contentBytes, type);
  };

  const handleUploadToStonAI = async (event) => {
    setLoading(true);

    var d = new Date();
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000;
    var utc = localTime + localOffset;
    var offset = 4; //UTC of Dubai is +04.00
    var dubai = utc + 3600000 * offset;
    var nd = new Date(dubai);

    var res = await axios.post(
      url + "/Document/createDocES",
      {
        name: file.name,
        size: file.size,
        lastModified: file.lastModifiedDateTime,
        type: file.type,
        uploaded_by: userInfo.username,
        uploader_id: user.user_id,
        project_id: project.project_id,
        uploaded_time: nd,
        subContractor: subContractor,
        category: "Bucket",
        sub_category: docType,
        document_status: "Bucket",
      },
      {
        headers: { token: user.token },
      }
    );
    const response = await axios(
      "https://cgwhfo8k3m.execute-api.ap-south-1.amazonaws.com/default/getPresignedURL?fileName=" +
      res.data._id
    );

    const respUrl = response.data.uploadURL;

    var config = {
      headers: { "content-type": file.type },
    };
    const resp = await axios.put(respUrl, file, config);

    setLoading(false);

    handleClickVariant("success", "Attachment successfully Uploaded to stonai");
  };
  return (
    <div
      className="UploadContainer"
      style={{ backgroundImage: `url(${imagesrc})`, cursor: "pointer" }}
      onClick={() => {
        handleDownloadAttachments(name, bytes, type);
      }}
    >
      {/* <img className='B1 PDFIMAGE' src={imagesrc}></img> */}

      <div
        className={`${uploadopacity
          ? "UploadCardTitle UploadCardTitlehOVER"
          : "UploadCardTitle"
          }`}
      >
        {name.length > 16 ? <>{name.slice(0, 16) + "..."} </> : <>{name} </>}
      </div>

      <div
        className="UploadRow"
        onMouseOver={HideHeader}
        onMouseOut={showheader}
      >
        <InsertDriveFileIcon className="uploadIcon" />
        <div className="d-flex flex-column">
          <div className="d-flex flex-column">
            <Tooltip title={name} placement="top">
              <Heading1
                color="var(--blue)"
                paddingInline="5px"
                paddingBlock="0px"
                width="fit-content"
                size="12px"
                weight="800"
                marginBottom="0px"
                style={{ wordBreak: "break-all" }}
              >
                {name.length > 45 ? (
                  <>{name.slice(0, 45) + "..."} </>
                ) : (
                  <>{name} </>
                )}
              </Heading1>
            </Tooltip>

            <Heading1
              color="grey"
              paddingInline="5px"
              paddingBlock="0px"
              width="fit-content"
              size="11px"
              weight="600"
              marginBottom="0px"
            >
              {(size / 1000000).toFixed(3)}MB
            </Heading1>
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Grid
              container
              sx={{
                width: "300px",
                height: "200px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ width: 200 }}>
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{ fontSize: 10 }}
                    size="small"
                  >
                    DocumentType
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="DocumentType"
                    size="small"
                    onChange={(event) => {
                      setDocType(event.target.value);
                    }}
                    //   variant="standard"
                    sx={{ fontSize: 12 }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Shop Drawing Submittals">
                      Shop Drawing
                    </MenuItem>
                    <MenuItem value="Material Submittals">
                      Material Submittals
                    </MenuItem>
                    {/* <MenuItem value="siteInstruction">Site Instruction</MenuItem>
                <MenuItem value="meterialInspectionRequest">
                  Meterial Inspection Request
                </MenuItem>
                <MenuItem value="technicalSubmittal">
                  Technical Submittal
                </MenuItem>
                <MenuItem value="methodStatementSubmittal">
                  Method Statement Submittal
                </MenuItem>
                <MenuItem value="nonConferenceReport">
                  Non Conference Report
                </MenuItem>
                <MenuItem value="requestForInformation">
                  Request for Information
                </MenuItem>
                <MenuItem value="workInfomationRequest">
                  Work Infomation Request
                </MenuItem>
                <MenuItem value="prequalificationApproval">
                  Prequalification Approval
                </MenuItem>
                <MenuItem value="architecturalInspectionRequest">
                  Architectural Inspection Request
                </MenuItem> */}
                    {/* <MenuItem value="Submittals">Other Submittals</MenuItem> */}
                    <Divider />
                    {/* 
                <MenuItem value="Approved Letters">Approved Letters</MenuItem>
                <MenuItem value="Rejected Letters">Rejected Letters</MenuItem>
                <MenuItem value="Other Letters">Other Letters</MenuItem> */}
                    <Divider />

                    <MenuItem value="Responsibility Matrix">
                      Responsibility Matrix
                    </MenuItem>

                    <MenuItem value="Tender Addendums">
                      Tender Addendums
                    </MenuItem>
                    <MenuItem value="Pdf Contract">Text Contract</MenuItem>
                    <MenuItem value="OCR Contract">Scanned Contract</MenuItem>
                    <MenuItem value="BOQ">BOQ</MenuItem>
                    <MenuItem value="MOM">MOM</MenuItem>
                    <MenuItem value="Bucket">Bucket</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="standard" sx={{ width: 200 }}>
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    sx={{ fontSize: 10 }}
                    size="small"
                  >
                    Sub-Contractor
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="DocumentType"
                    size="small"
                    //   variant="standard"
                    sx={{ fontSize: 12 }}
                    onChange={(event) => {
                      setSubcontractorType(event.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="VAMED">VAMED</MenuItem>
                    <MenuItem value="UNEC">UNEC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<DriveFolderUploadIcon />}
                  variant="outlined"
                  size="small"
                  onClick={handleUploadToStonAI}
                  disabled={
                    subContractor &&
                      docType &&
                      subContractor.length > 0 &&
                      docType.length > 0
                      ? false
                      : true
                  }
                >
                  Upload
                </LoadingButton>
              </Grid>
            </Grid>
          </Popover>
          {/* <div className="uploadiconsrow">
            <div className="uploadicons">
              <Tooltip title="Download Attachment">
                <IconButton
                  onClick={() => {
                    handleDownloadAttachments(name, bytes, type);
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </div>
            <div className="uploadicons">
              <Tooltip title="Upload Attachment to StonAI">
                <IconButton
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default UploadCard;
