import React, { useEffect, useState, useRef } from "react";
import Alert from "@mui/material/Alert";
import {
  CircularProgress,
  Box,
  Grid,
  Button,
  Modal,
  TextField,
  Container,
  Stack,
  Autocomplete,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DeleteForever,
  Share,
  TurnedInNot,
  AttachFile,
  Tag,
} from "@mui/icons-material";

import NotificationModel from "../../NotificationModel/NotificationModel";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { url } from "../../../url";

import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import { getDiffInWorkingDays } from "./DelayedDays";
import UploadAttachment from "./UploadAttachment";
import ArchiveIcon from "@mui/icons-material/Archive";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useNavigate } from "react-router-dom";

import PopUp from "./PopUp";
import { getToken } from "../../../utils/GetToken";
import AddIcon from "@mui/icons-material/Add";

import CoverPageContext from "../../../context/CoverPageContext";
import { Link } from "react-router-dom";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { useSnackbar } from "notistack";

import NotificationsIcon from "@mui/icons-material/Notifications";
import "./Doclist.css";
import { isEqual } from "lodash";
// import Tags from "./Tags";
import TagsModel from "./TagsModel";
import Chips from "./Chips";
import MaterialTable, { Column } from "@material-table/core";

import { tableIcons } from "./TableIcons";

import FilePresentIcon from "@mui/icons-material/FilePresent";

import RowPerPage from "./RowPerPage";
import PreviewIcon from "@mui/icons-material/Preview";
import FileViewerPopup from "./FileViewerPopup";
import { removeTimeFromDate } from "./RemoveTime";
import moment from "moment";
import { Chip } from "@material-ui/core";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
var totalPages = 0;
var startFrom = 0;

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

const rowBackgroundColors = {
  false: "#E6E8F2",
};

export default function DocumentList({
  project,
  handleClickPreviewDoc,
  filters,
  // isChildren,
  // setFilters,
  user,
  // saveClicked,
  // clearAllHandler,
  // saveToggle,
  check,
  // fileType,
  // calenderValue,
  setIsChildren,
  category,
  setCurrentComp,
  currentComp,
  // setCategory,
  socket,
  // users,
  pca,
  isFilterSearch,
  setChildren,
  update,
  download,
  exportFile,
  remove,
  share,
  move,
  backHistory,
  tableRef,
  department,
  allowedDuration,
  // treeHeight,
}) {
  var document_id_of_row_clicked = useRef("");
  var selected_file_to_view = useRef("");

  const { enqueueSnackbar } = useSnackbar();
  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  const navigate = useNavigate();
  //Documents List states
  let [checked, setChecked] = useState([]);
  // let [checkedGlobal, setCheckedGlobal] = useState(false);
  let [checkedDocs, setCheckedDocs] = useState([]);
  // let [checkeddocumentids, setCheckedDocumentids] = useState();
  const [isDel, setDel] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  var [files, setFiles] = useState([]);

  //Menu Items States
  var [isLoading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  // const [tagValues, setTagValues] = React.useState([]);
  const [notilider, setNotislider] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchorElUsers, setAnchorElUsers] = React.useState(null);
  const openUsers = Boolean(anchorElUsers);
  // const [callCount, setCallCount] = useState(0);
  const [catagoryExists, setCatagoryExists] = useState();
  // const [initialCheckedValues, setInitialCheckedValues] = useState([]);
  // const [nullOrUndefinedCounter, setNullOrUndefinedCounter] = useState(0);
  const [filtering, setFiltering] = useState(false);

  //Popup states
  const [homeslider, sethomeslider] = useState(false);
  const [openCoverCat, setOpenCoverCat] = useState(false);
  let [receivers, setReceivers] = useState([]);
  let [cc, setCC] = useState([]);
  let [subject, setSubject] = useState("");
  let [body, setBody] = useState("");

  const [documentToNotify, setDocumentToNotify] = useState();

  const [token, setToken] = useState(null);

  const [anchorElTag, setAnchorElTag] = React.useState(null);

  const handleClickTag = (event) => {
    setAnchorElTag(event.currentTarget);
  };

  const handleCloseTag = () => {
    setAnchorElTag(null);
  };

  const [pageSize, setPageSize] = useState(50);
  const openTag = Boolean(anchorElTag);
  const idTag = openTag ? "simple-popover" : undefined;

  const handleOpenCoverCat = async (event, selectedFile) => {
    setSelectedFile(selectedFile);
    setOpenCoverCat(true);
    // onClick={() => CreateCoverPage(selectedFile)}
  };
  const handleOpenAttachModel = async (value) => {
    document_id_of_row_clicked.current = value;

    setOpenAttachModel(true);
    // onClick={() => CreateCoverPage(selectedFile)}
  };
  const handleOpenTagsModel = async (value) => {
    document_id_of_row_clicked.current = value;
    setOpenTagsModel(true);
  };
  const handleOpenTagPopOver = async (value) => {
    setOpenTagPopOver(true);
    // onClick={() => CreateCoverPage(selectedFile)}
  };
  const handleCloseTagPopOver = async (value) => {
    setOpenTagPopOver(false);
    // onClick={() => CreateCoverPage(selectedFile)}
  };
  const handleCloseAttachModel = async (event, selectedFile) => {
    setOpenAttachModel(false);
    // onClick={() => CreateCoverPage(selectedFile)}
  };
  const handleCloseTagsModel = async (event, selectedFile) => {
    setOpenTagsModel(false);
    // onClick={() => CreateCoverPage(selectedFile)}
  };
  const handleCloseCoverCat = async (selectedFile) => {
    setOpenCoverCat(false);
    // onClick={() => CreateCoverPage(selectedFile)}
  };

  const [openMoveModel, setOpenMoveModel] = useState(false);
  const [openAttachModel, setOpenAttachModel] = useState(false);
  const [openTagsModel, setOpenTagsModel] = useState(false);
  const [openTagPopOver, setOpenTagPopOver] = useState(false);
  const [folderToMove, setFolderToMove] = useState("");
  const [keys, setKeys] = useState([]);
  const [openFolders, setOpenFolders] = useState(false);
  const [optionsFolders, setOptionsFolders] = useState([]);
  const loadingFolders = openFolders && optionsFolders.length === 0;
  const [reMap, setRemap] = useState(false);
  const [columns, setColumns] = useState([]);
  var defaultdynamicColumns = [
    // name
    {
      title: "File Name",
      field: "document_name",

      render: (rowData) => (
        <>
          <Tooltip placement="top" title={rowData?.document_name}>
            <p className="truncstestyle"> {rowData?.document_name} </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },

      filterCellStyle: MaterialFilterCellStyle(),
    },
    // date
    {
      title: "Upload Time",
      field: "uploaded_time",

      render: (rowData) => (
        <>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "0px",
            }}
          >
            {" "}
            {rowData?.uploaded_time?.slice(0, 10)}{" "}
          </p>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    // uploader
    {
      title: "Uploader",
      field: "uploaded_by",

      render: (rowData) => (
        <>
          <Tooltip placement="top" title={rowData?.uploaded_by}>
            <p className="truncstestyle"> {rowData?.uploaded_by} </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    {
      title: "Delayed",
      field: "Delayed",

      render: (rowData) => (
        <>
          {getDiffInWorkingDays(
            rowData?.mapped_field?.DATE_1,
            rowData?.mapped_field?.Recieved_date ?? "",
            allowedDuration,
            rowData.document_category
          ) !== "No" && (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "0px",
                color: "red",
              }}
            >
              {getDiffInWorkingDays(
                rowData?.mapped_field?.DATE_1,
                rowData?.mapped_field?.Recieved_date ?? "",
                allowedDuration,
                rowData.document_category
              )}
            </p>
          )}
          {getDiffInWorkingDays(
            rowData?.mapped_field?.DATE_1,
            rowData?.mapped_field?.Recieved_date ?? "",
            allowedDuration,
            rowData.document_category
          ) === "No" && (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "0px",
              }}
            >
              No
            </p>
          )}
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    // tags
    {
      title: "Tags",
      field: "tags4",
      disableClick: true,

      cellStyle: {
        // maxWidth: 200,
        width: "max-content",
        minWidth: "400",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        // maxWidth: 200,
        minWidth: "400",
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },

      render: (rowData) => (
        <Grid item className="d-flex flex-wrap">
          <p
            style={{
              // whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "0px",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            <Chips value={rowData} onClick={handleOpenTagsModel} />
          </p>
        </Grid>
      ),
    },
  ];

  const defaultCloumnsList = [
    // submittal title
    {
      title: "Submittal Title ",
      field: "mapped_field?.SUBMITTAL_TITLE",

      render: (rowData) => (
        <>
          <Tooltip
            placement="top"
            title={rowData?.mapped_field?.SUBMITTAL_TITLE}
          >
            <p className="truncstestyle">
              {" "}
              {rowData?.mapped_field?.SUBMITTAL_TITLE}{" "}
            </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    // submittal no
    {
      title: "Submittal No. ",
      field: "mapped_field?.SUBMITTAL_NO",

      render: (rowData) => (
        <>
          <Tooltip placement="top" title={rowData?.mapped_field?.SUBMITTAL_NO}>
            <p className="truncstestyle">
              {" "}
              {rowData?.mapped_field?.SUBMITTAL_NO}{" "}
            </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    {
      title: "Revision",
      field: "mapped_field?.REVISION",

      render: (rowData) => (
        <>
          <Tooltip
            placement="top"
            title={
              rowData?.mapped_field?.REVISION ?? rowData?.mapped_field?.Revision
            }
          >
            <p className="truncstestyle">
              {" "}
              {rowData?.mapped_field?.REVISION ??
                rowData?.mapped_field?.Revision}{" "}
            </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    // name
    {
      title: "File Name",
      field: "document_name",

      render: (rowData) => (
        <>
          <Tooltip placement="top" title={rowData?.document_name}>
            <p className="truncstestyle"> {rowData?.document_name} </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },

      filterCellStyle: MaterialFilterCellStyle(),
    },

    // Status
    {
      title: "Status",
      field: "mapped_field?.STATUS",

      render: (rowData) => (
        <>
          <Tooltip placement="top" title={rowData?.mapped_field?.STATUS}>
            <p className="truncstestyle"> {rowData.mapped_field?.STATUS} </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },

    // uploader
    {
      title: "Uploader",
      field: "uploaded_by",

      render: (rowData) => (
        <>
          <Tooltip placement="top" title={rowData?.uploaded_by}>
            <p className="truncstestyle"> {rowData?.uploaded_by} </p>
          </Tooltip>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    // tags
    {
      title: "Tags",
      field: "tags4",
      disableClick: true,

      cellStyle: {
        // maxWidth: 200,
        width: "max-content",
        minWidth: "400",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        // maxWidth: 200,
        minWidth: "400",
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },

      render: (rowData) => (
        <Grid item className="d-flex flex-wrap">
          <p
            style={{
              // whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "0px",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            <Chips value={rowData} onClick={handleOpenTagsModel} />
          </p>
        </Grid>
      ),
    },
    // date
    {
      title: "Date",
      field: "mapped_field?.DATE_1",

      render: (rowData) => (
        <>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "0px",
            }}
          >
            {" "}
            {rowData?.mapped_field?.DATE_1?.slice(0, 10)}{" "}
          </p>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    {
      title: "Delayed",
      field: "Delayed",

      render: (rowData) => (
        <>
          {getDiffInWorkingDays(
            rowData?.mapped_field?.DATE_1,
            rowData?.mapped_field?.Recieved_date ?? "",
            allowedDuration,
            rowData.document_category
          ) !== "No" && (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "0px",
                color: "red",
              }}
            >
              {getDiffInWorkingDays(
                rowData?.mapped_field?.DATE_1,
                rowData?.mapped_field?.Recieved_date ?? "",
                allowedDuration,
                rowData.document_category
              )}
            </p>
          )}
          {getDiffInWorkingDays(
            rowData?.mapped_field?.DATE_1,
            rowData?.mapped_field?.Recieved_date ?? "",
            allowedDuration,
            rowData.document_category
          ) === "No" && (
            <p
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "0px",
              }}
            >
              No
            </p>
          )}
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
    // date
    {
      title: "Upload Time",
      field: "uploaded_time",

      render: (rowData) => (
        <>
          <p
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginBottom: "0px",
            }}
          >
            {" "}
            {rowData?.uploaded_time?.slice(0, 10)}{" "}
          </p>
        </>
      ),

      cellStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid silver",
        padding: "12px",
      },

      headerStyle: {
        minWidth: 30,
        width: "max-content",
        textAlign: "left",
        borderBottom: "2px solid silver",
        borderRight: "1px solid #ffffff",
        padding: "12px",
      },
      filterCellStyle: MaterialFilterCellStyle(),
    },
  ];
  // const [viewDocName, setviewDocName] = useState(true);
  const [viewDocRef, setviewDocRef] = useState(true);
  const [viewDocType, setViewDocType] = useState(true);
  const [viewContractor, setViewContractor] = useState(true);
  const [viewSubContractor, setViewSubContractor] = useState(false);
  const [viewTags, setViewTags] = useState(true);
  const [ViewUploadDate, setViewUploadDate] = useState(false);
  const [ViewSubmittalDate, setViewSubmittalDate] = useState(false);
  const [viewStatus, setviewStatus] = useState(false);
  const [viewDicipline, setViewDicipline] = useState(false);
  const [viewUpdateby, setViewUpdateby] = useState(false);
  const [viewSubmittalTitle, setViewSubmittalTitle] = useState(false);
  const [openFileViewerModal, setOpenFileViewerModal] = useState(false);
  const [showcolumns, setShowColumns] = useState(true);

  const viewcount = useRef(3);

  useEffect(() => {
    let active = true;

    if (!loadingFolders) {
      return undefined;
    }

    (async () => {
      if (active) {
        try {
          const res = await axios.post(
            url + "/folder/getNewFolders",
            {
              project_id: project.project_id,
              component: currentComp,
            },
            {
              headers: { token: user.token },
            }
          );
          setOptionsFolders(res.data);
        } catch (error) {
          console.log(error);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingFolders]);

  // const [myColumns, setMyColumns] = useState([]);
  useEffect(() => {
    // Check if columns are not empty and category is valid
    if (columns.length !== 0 && category && columns) {
      const fetchData = async () => {
        try {
          const res = await axios.post(
            url + "/Document/getColumns",
            {
              user_id: user.user_id,
              category: category,
            },
            {
              headers: { token: user.token },
            }
          );

          // const backendColumns = JSON.parse(res.data);
          // const backendColumns = res.data;

          const backendColumns = JSON?.parse(res?.data[0]?.columns);
          const updatedColumns = columns?.map((column) => {
            const backendColumn = backendColumns.find(
              (bc) => bc.field === column.field
            );
            if (backendColumn) {
              return { ...column, hidden: backendColumn.hidden };
            } else if (backendColumn) return { ...column, hidden: false };
            return column;
          });
          // setColumns(updatedColumns);
          if (!isEqual(columns, updatedColumns)) {
            // setMyColumns(updatedColumns);
            setColumns(updatedColumns);
          }
        } catch (error) {
          console.log("error", error);
        }
      };

      fetchData();
    }
  }, [columns, category]); // Dependencies to re-run the effect

  function getDateFromDateTime(dateTime) {
    var date = new Date(dateTime);
    return date.toDateString();
  }
  function getTodaysDate() {
    var d = new Date();
    return d.toDateString();
  }
  function getExcelExportFileName() {
    var fileName =
      getTodaysDate() + "-" + project.project_name + "-" + user.username;
    return fileName;
  }
  // pop hover states and functions
  const [anchorElColsize, setAnchorElColsize] = React.useState(null);

  const handleClickColumn = (event) => {
    setAnchorElColsize(event.currentTarget);
  };

  const handleCloseColumn = () => {
    setAnchorElColsize(null);
  };

  function getDistintTags() {}
  function convertDocCatToCorrectFormat(catName) {
    if (catName === "shop_drawing_submittal") {
      return "Shop Drawing";
    } else if (catName === "material_submittal") {
      return "Material Submittal";
    } else {
      return catName.replace(" Submittal", "");
    }
  }

  const handleCheckboxes = (event, check) => {
    if (check === "viewDocRef") {
      if (viewDocRef === true) viewcount.current--;
      else if (viewDocRef === false) viewcount.current++;
      setviewDocRef(!viewDocRef);
    } else if (check === "viewDocType") {
      if (viewDocType === true) viewcount.current--;
      else if (viewDocType === false) viewcount.current++;
      setViewDocType(!viewDocType);
    } else if (check === "viewContractor") {
      if (viewContractor === true) viewcount.current--;
      else if (viewContractor === false) viewcount.current++;
      setViewContractor(!viewContractor);
    } else if (check === "viewSubContractor") {
      if (viewSubContractor === true) viewcount.current--;
      else if (viewSubContractor === false) viewcount.current++;
      setViewSubContractor(!viewSubContractor);
    } else if (check === "viewTags") {
      if (viewTags === true) viewcount.current--;
      else if (viewTags === false) viewcount.current++;
      setViewTags(!viewTags);
    } else if (check === "ViewUploadDate") {
      if (ViewUploadDate === true) viewcount.current--;
      else if (ViewUploadDate === false) viewcount.current++;
      setViewUploadDate(!ViewUploadDate);
    } else if (check === "ViewSubmittalDate") {
      if (ViewSubmittalDate === true) viewcount.current--;
      else if (ViewSubmittalDate === false) viewcount.current++;
      setViewSubmittalDate(!ViewSubmittalDate);
    } else if (check === "viewStatus") {
      if (viewStatus === true) viewcount.current--;
      else if (viewStatus === false) viewcount.current++;
      setviewStatus(!viewStatus);
    } else if (check === "viewDicipline") {
      if (viewDicipline === true) viewcount.current--;
      else if (viewDicipline === false) viewcount.current++;
      setViewDicipline(!viewDicipline);
    } else if (check === "viewUpdateby") {
      if (viewUpdateby === true) viewcount.current--;
      else if (viewUpdateby === false) viewcount.current++;
      setViewUpdateby(!viewUpdateby);
    } else if (check === "viewSubmittalTitle") {
      if (viewSubmittalTitle === true) viewcount.current--;
      else if (viewSubmittalTitle === false) viewcount.current++;
      setViewSubmittalTitle(!viewSubmittalTitle);
    }
  };

  const openCol = Boolean(anchorElColsize);

  // ==============================

  useEffect(() => {
    if (!open) {
      setOptionsFolders([]);
    }
  }, [open]);

  let documentIds = [];
  const handleToken = async () => {
    const token = await getToken();
    setToken(token);
  };
  const checking = (value) => {};

  // const handleReceiver = ()=>{
  //   setReceiver();
  // }

  const handlePopUp = () => {
    setCheckedDocs(documentIds);
    sethomeslider(true);
  };
  function handleClick(event, value) {
    setSelectedFile(value);
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseUsers = () => {
    setAnchorElUsers(null);
  };

  const backClickHandler = () => {
    if (isSubmittalDoc(category)) {
      setCurrentComp(category);
    } else {
      setCurrentComp(backHistory.current.currentComp);

      setChildren(backHistory.current.children);
      setIsChildren(false);
    }
  };

  const startAnalyzation = async (fileName) => {
    try {
      axios
        .post(
          url + "/Document/analyseDoc",
          {
            name: fileName?.document_name,
            size: fileName?.document_size,
            lastModified: fileName?.last_modified,
            type: fileName?.document_type,
            // category: this.props.category,

            document_category: fileName?.sub_category,
            document_id: fileName?.document_id,
            project_id: fileName?.project_id,
            document_status: fileName?.document_status,
          },
          {
            headers: { token: user.token },
          }
        )
        .then((response) => {
          handleClickVariant(
            "Success",
            "The document is successfully analysed"
          );
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const getfilesurl = async (element, document_id) => {
    try {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          document_id
      );
      if (element?.document_attachment) {
        var attachments = [];
        for (const ele of element?.document_attachment) {
          const e = await getAttachmenturl(ele);
          attachments.push(e);
        }
        element["document_attachment"] = attachments;
      }
      element["urls"] = response.data.uploadURL;
      element["document_id"] = document_id;

      return element;
    } catch (error) {
      console.log("error", error);
    }
  };
  const getAttachmenturl = async (element) => {
    try {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          element.document_id +
          element.name
      );
      element["urls"] = response.data.uploadURL;
      return element;
    } catch (error) {
      console.log("error", error);
    }
  };
  const getFiles = async () => {
    setLoading(true);
    var res;
    if (isFilterSearch) {
      try {
        res = await axios.post(
          url + "/Document/getWithFiltersEs",
          {
            filters: filters,
            project: project,
            pageSize: pageSize,
          },
          {
            headers: { token: user.token },
          }
        );
        updateKPIDocSearch();
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    } else {
      try {
        res = await axios.post(
          url + "/Document/getCategoryEs",
          {
            category: category,
            project: project,
            pageSize: pageSize,
            currentComp: currentComp,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    }

    var decimalCheck = (res.data.totalHits / pageSize) % 1;
    if (decimalCheck == 0) {
      totalPages = res.data.totalHits / pageSize;
    } else {
      totalPages = parseInt(res.data.totalHits / pageSize) + 1;
    }

    const files_db = res.data.hits;
    var arr = [];

    for (const element of files_db) {
      const ele = await getfilesurl(element._source, element._id);
      arr.push(ele);
    }
    setFiles(arr);
    setLoading((isLoading = false));
  };
  const getSortedFiles = async () => {
    setLoading(true);
    var res;
    if (isFilterSearch) {
      try {
        res = await axios.post(
          url + "/Document/getWithFiltersEs",
          {
            filters: filters,
            project: project,
            pageSize: pageSize,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    } else {
      try {
        res = await axios.post(
          url + "/Document/getCategoryEs",
          {
            category: category,
            project: project,
            pageSize: pageSize,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    }

    var decimalCheck = (res.data.totalHits / 10) % 1;
    if (decimalCheck == 0) {
      totalPages = res.data.totalHits / 10;
    } else {
      totalPages = parseInt(res.data.totalHits / 10) + 1;
    }

    const files_db = res.data.hits;
    var arr = [];

    for (const element of files_db) {
      const ele = await getfilesurl(element._source, element._id);
      arr.push(ele);
    }
    setFiles(arr);
    setLoading((isLoading = false));
  };
  const handlePageSizeChange = async (event) => {
    const pageSizeValue = event.target.value;
    setPageSize(pageSizeValue);
    setLoading(true);
    startFrom = pageNo * pageSizeValue - pageSizeValue;
    var res;
    if (isFilterSearch) {
      try {
        res = await axios.post(
          url + "/Document/getWithFiltersEs",
          {
            filters: filters,
            project: project,
            pageSize: pageSizeValue,
            startFrom: startFrom,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    } else {
      try {
        res = await axios.post(
          url + "/Document/getCategoryEs",
          {
            category: category,
            project: project,
            pageSize: pageSizeValue,
            startFrom: startFrom,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    }
    var decimalCheck = (res.data.totalHits / pageSizeValue) % 1;
    if (decimalCheck == 0) {
      totalPages = res.data.totalHits / pageSizeValue;
    } else {
      totalPages = parseInt(res.data.totalHits / pageSizeValue) + 1;
    }
    const files_db = res.data.hits;
    var arr = [];

    for (const element of files_db) {
      const ele = await getfilesurl(element._source, element._id);
      arr.push(ele);
    }
    setFiles(arr);

    setLoading((isLoading = false));
  };
  const handlePageChange = async (event, page) => {
    setPageNo(page);
    setLoading(true);
    startFrom = page * pageSize - pageSize;
    var res;
    if (isFilterSearch) {
      try {
        res = await axios.post(
          url + "/Document/getWithFiltersEs",
          {
            filters: filters,
            project: project,
            pageSize: pageSize,
            startFrom: startFrom,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    } else {
      try {
        res = await axios.post(
          url + "/Document/getCategoryEs",
          {
            category: category,
            project: project,
            pageSize: pageSize,
            startFrom: startFrom,
          },
          {
            headers: { token: user.token },
          }
        );
      } catch (error) {
        console.log(error.response);
        return error.response;
      }
    }

    const files_db = res.data.hits;
    var arr = [];

    for (const element of files_db) {
      const ele = await getfilesurl(element._source, element._id);
      arr.push(ele);
    }
    setFiles(arr);

    setLoading((isLoading = false));
  };

  const onDownload = async (url, name) => {
    const image = await fetch(url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);
    const anchor = document.createElement("a");
    anchor.href = imageURL;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    // URL.revoke0bjectURL(imageURL);
  };

  const handleDelete = async (fileName, user) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setLoading((isLoading = true));
      const res = await axios.post(
        url + "/Document/deleteEs",
        {
          name: fileName,
        },
        {
          headers: { token: user.token },
        }
      );
      const response = await axios(
        "https://90dje6827j.execute-api.ap-south-1.amazonaws.com/default/deleteFile?fileName=" +
          fileName
      );
      setLoading((isLoading = false));
      setDel(!isDel);
    } else {
      // Do nothing!
      console.log("Delete canceled");
    }
  };

  const handleDeleteSelected = async (user) => {
    if (window.confirm("Are you sure you want to delete these files?")) {
      setLoading((isLoading = true));

      for (const element of documentIds) {
        // for (const element of checked) {

        const fileTodelete = element?.document_id;
        try {
          await axios.post(
            url + "/Document/deleteEs",
            {
              name: fileTodelete,
            },
            {
              headers: { token: user.token },
            }
          );

          const response = await axios(
            "https://90dje6827j.execute-api.ap-south-1.amazonaws.com/default/deleteFile?fileName=" +
              fileTodelete
          );
        } catch (error) {
          console.log("eror", error);
        }
      }

      setLoading((isLoading = false));
      setDel(!isDel);
    } else {
      // Do nothing!
      console.log("Delete canceled");
    }
  };
  const handleFolder = (type) => {
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
  const isSubmittalDoc = (document_category) => {
    return submittalList.includes(document_category);
  };
  // get zone
  function getLastWord(words) {
    words = words.trim();
    var n = words.split(" ");
    return n[n.length - 1];
  }
  function getFirstWord(words) {
    words = words.trim();
    var n = words.split(" ");
    return n[0];
  }
  const getZone = (locations) => {
    var location = locations.split("@")[1];
    if (typeof location === "undefined") {
      location = locations;
    }
    const regEscape = (v) => v.replace(/[-[\]{ }()*+?.,\\^$|#\s]/g, "\\$&");
    var zone = location.split(new RegExp(regEscape("zone"), "ig"))[1];
    if (typeof zone === "undefined") {
      zone = "";
    } else {
      zone = zone.replace("-", "");
    }
    return zone;
  };
  const getBlock = (locations) => {
    var location = locations.split("@")[1];
    if (typeof location === "undefined") {
      location = locations;
    }
    var block;
    const regEscape = (v) => v.replace(/[-[\]{ }()*+?.,\\^$|#\s]/g, "\\$&");
    block = location.split(new RegExp(regEscape("block"), "ig"))[1];
    if (typeof block === "undefined") {
      block = "";
    } else {
      block = getLastWord(block);
    }
    return block;
  };
  const getFloor = (locations) => {
    var location = locations.split("@")[1];
    if (typeof location === "undefined") {
      location = locations;
    }
    var floor;
    if (location.match("/ROOF/gi")) {
      floor = "ROOF";
    } else if (location.match("/floor/gi")) {
      const regEscape = (v) => v.replace(/[-[\]{ }()*+?.,\\^$|#\s]/g, "\\$&");
      floor = location.split(new RegExp(regEscape("floor"), "ig"))[0];
      floor = getLastWord(floor);
    }
    return floor;
  };
  const getRev = (ref) => {
    var splitRef = ref.split("-");

    splitRef = splitRef[splitRef.length - 1];

    splitRef = splitRef.trim();
    splitRef = splitRef.slice(1);
    return splitRef;
  };
  //Get due date
  const getDueDate = (daysToAnswer) => {};
  //to export data to excel

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
          searchType: "Log",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: 1000,
        },
        { headers: { token: user.token } }
      );
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const updateKPIDocSearch = async (totalTime) => {
    var date = new Date();
    var today_date = moment.utc(date).format("YYYY-MM-DD");

    try {
      const response = await axios.post(
        url + "/kpi/updateKPI",
        {
          userID: user.user_id,
          departmentID: department.department_id,
          projectID: project.project_id,
          searchType: "DocSearch",
          todayDate: today_date,
          userPosition: "Engineer",
          totalTime: 1000,
        },
        { headers: { token: user.token } }
      );
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const handleExport = () => {
    updateKPI();
    try {
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const fileExtension = ".xlsx";
      let newData = null;
      newData = files.map((fileData) => {
        let dataObject = {};
        if (
          fileData?.sub_category === "shop_drawing_submittal" ||
          fileData?.sub_category === "material_submittal" ||
          fileData?.sub_category === "Technical Submittal" ||
          fileData?.sub_category === "Site Instruction" ||
          fileData?.sub_category === "Method Statement Submittal" ||
          fileData?.sub_category === "Non Conformance Report" ||
          fileData?.sub_category === "Prequalification Submittal" ||
          fileData?.sub_category === "Request for Information" ||
          fileData?.sub_category === "Work Inspection Request" ||
          fileData?.sub_category === "Meterial Inspection Request" ||
          fileData?.sub_category === "Architectural Inspection Request"
        ) {
          var shopDrawingRef;
          if (fileData?.sub_category === "shop_drawing_submittal") {
            shopDrawingRef = fileData?.mapped_field?.SUBMITTAL_NO;
          } else {
            shopDrawingRef = fileData?.mapped_field?.SPEC_BOQ_DRAWING_REF;
          }
          var CATEGORY;
          if (fileData?.sub_category === "shop_drawing_submittal") {
            CATEGORY = "Shop Drawing Submittal";
          } else if (fileData?.sub_category === "material_submittal") {
            CATEGORY = "Material Submittal";
          } else {
            CATEGORY = fileData?.sub_category;
          }
          let dateOnly = removeTimeFromDate(
            fileData?.mapped_field?.DATE || fileData?.mapped_field?.DATE_1
          );
          return {
            "Submittal Title":
              fileData?.mapped_field?.SUBMITTAL_TITLE ||
              fileData?.mapped_field?.SUBMITTAL_NO,
            "Submittal REFERENCE": fileData?.mapped_field?.SUBMITTAL_NO,
            "DATE Received": dateOnly,
            "DOC. TYPE": CATEGORY,
            FLOOR: fileData?.mapped_field?.FLOOR,
            BLOCK: fileData?.mapped_field?.BLOCK,

            Zone: fileData?.mapped_field?.ZONE,
            SUBCON: fileData?.mapped_field?.SUBCONTRACTOR,
            "DISCRIPTION/Subject":
              fileData?.mapped_field?.DescOfMaterial?.join(" . ") ||
              fileData?.mapped_field?.DESCRIPTION ||
              fileData?.mapped_field?.descOfDrawing ||
              fileData?.mapped_field?.["desc of Drawing"] ||
              fileData?.mapped_field?.DESCRIPTION_SUPPLIED_MATERIALS ||
              fileData?.mapped_field?.NON_CONFORMANCE ||
              fileData?.mapped_field?.INFORMATION_REQUESTED ||
              fileData?.mapped_field?.INSPECTION_DESCRIPTION,
            DISCIPLINE:
              fileData?.mapped_field?.DISCIPLINE ||
              fileData?.mapped_field?.DESCIPTION,
            "Shop drawing Ref.": shopDrawingRef,
            "Rev.":
              fileData?.mapped_field?.REVISION ||
              fileData?.mapped_field?.Revision,
            status:
              fileData?.mapped_field?.STATUS ||
              fileData?.mapped_field?.Status ||
              fileData?.mapped_field?.INSPECTION_STATUS,
            Remarks: fileData?.mapped_field?.Comments_Box?.join(" . "),
          };
        } else {
          // Set the static fields first
          let staticData = {
            "Date Uploaded": fileData?.uploaded_time?.slice(0, 10),
            "Doc Name": fileData?.document_name,
            "Uploaded by": fileData?.uploaded_by,
          };

          // Dynamic properties for other categories
          keys.forEach((key) => {
            // Check if the value is an array and join it
            if (Array.isArray(fileData?.unMapped_field?.Key_Values[key])) {
              staticData[key] =
                fileData?.unMapped_field?.Key_Values[key].join("; ");
            } else if (
              fileData?.unMapped_field?.Key_Values &&
              fileData.unMapped_field.Key_Values[key]
            ) {
              // Map the value to the key
              staticData[key] = fileData.unMapped_field.Key_Values[key];
            } else {
              // If the key does not exist, set a default value
              staticData[key] = "No Value";
            }
          });

          return staticData;
        }

        return dataObject;
      });

      const results = newData.filter((element) => {
        return element !== undefined;
      });

      let ws = XLSX.utils.json_to_sheet(results);
      const wsKeys = Object.keys(ws);
      var wscols = [];
      wsKeys.forEach((key) => {
        wscols.push({ width: key.length + 20 });
        if (key[1] == 1) {
          ws[key[0] + "1"].s = {
            fill: {
              patternType: "solid", // none / solid
              fgColor: { rgb: "50A2FF" },
              bgColor: { rgb: "50A2FF" },
            },
            font: {
              sz: 12,
              bold: true,
            },
          };
        }
      });
      ws["!autofilter"] = { ref: ws["!ref"] };
      ws["!cols"] = wscols;
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, getExcelExportFileName() + fileExtension);
      // FileSaver.saveAs(data, "Log Registery" + fileExtension);
    } catch (e) {
      console.log(e);
    }
  };
  const [reciever, setReciever] = useState("Saad@gmail.com");

  const CreateCoverPage = (e, item) => {
    if (item.label === "Shop Drawing Submital") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageShopDrawingSubmittal");
    } else if (item.label === "Material Submittal") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageMaterialSubmittal");
    } else if (item.label === "Site Instruction") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPagesiteInstruction");
    } else if (item.label === "Meterial Inspection Request") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageMeterialInspectionRequest");
    } else if (item.label === "Technical Submittal") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageTechnicalSubmittal");
    } else if (item.label === "Method Statement Submittal") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageMethodStatementSubmittal");
    } else if (item.label === "Non Conformance Report") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageNonConformanceReport");
    } else if (item.label === "Prequalification Submittal") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPagePrequalificationSubmittal");
    } else if (item.label === "Request for Information") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageRequestforInformation");
    } else if (item.label === "Work Inspection Request") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageWorkInspectionRequest");
    } else if (item.label === "Architectural Inspection Request") {
      CoverPageContext.coverPageOf = selectedFile.document_id;
      CoverPageContext.creatingOrEditing = "create";

      navigate("/app/coverPageArchitecturalInspectionRequest");
    }
  };
  const handleClickNotify = (selectedFile) => {
    <Button
      variant="contained"
      component={Link}
      to="/app/prepareShopDrawingForm"
      startIcon={<AddIcon />}
    >
      Create Cover Page
    </Button>;

    setDocumentToNotify(selectedFile.document_id);
    setNotislider(true);
    handleClose();
    // setAnchorElUsers(event.currentTarget);
  };

  const addNotifications = async (content) => {
    try {
      const response = await axios.post(
        url + "/Notification/addNotifications",
        { user, content },
        { headers: { token: user.token } }
      );
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const Notify = async (values) => {
    const { action, message, receivers } = values;

    const res = await addNotifications(values);
    socket.emit("sendNotification", {
      sender: user,
      receivers: receivers,
    });
  };

  const handleOpenMoveModel = async (event, value) => {
    handleClick(event, value);
    setOpenMoveModel(true);
  };
  const onOrderChangeHandler = (orderedColumnId, orderDirection, name) => {
    getFiles();
  };
  const handleFolderMove = async () => {
    setLoading((isLoading = true));

    try {
      const res = await axios.post(
        url + "/folder/updateBucketCategory",
        {
          document_id: selectedFile.document_id,
          name: folderToMove,
        },
        {
          headers: { token: user.token },
        }
      );

      handleClickVariant("success", "File is moved successfully");
      setDel(!isDel);

      setLoading((isLoading = false));
    } catch (error) {
      console.log(error);
    }
  };
  const sortBySize = (row, value, direction) => {};
  async function saveColumns(col) {
    var tempCols = [];
    col.forEach((element) => {
      const tempcol1 = {
        field: element?.field,
        hidden: element?.hidden ? true : false,
      };
      tempCols.push(tempcol1);
    });
    try {
      const res = await axios.post(
        url + "/Document/UpdateColumns",
        {
          user_id: user.user_id,
          columns: JSON.stringify(tempCols),
          category: category,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function handleColumnDrag(sourceIndex, destinationIndex) {
    var tempcol = [...columns];
    const sourceColumn = tempcol[sourceIndex];
    const destinationColumn = tempcol[destinationIndex];

    // Swapping the column order

    tempcol[sourceIndex] = destinationColumn;
    tempcol[destinationIndex] = sourceColumn;

    await saveColumns(tempcol);
    setColumns(tempcol);
  }

  async function onChangeColumnHidden(column, hidden) {
    var tempcol = [...columns];
    const col = tempcol.map((temp) => {
      if (temp.field === column.field) {
        temp["hidden"] = hidden;
        return temp;
      } else {
        return temp;
      }
    });
    await saveColumns(col);
    setColumns(col);
  }
  function handleSelectChange(rows) {
    documentIds = rows;
  }
  var savedColumns;
  useEffect(() => {
    // Call the function with the required parameters
    fetchAndSetCheckedValues(project.project_id, user.user_id, category);
  }, []);

  const fetchAndSetCheckedValues = async (projectId, userId, category) => {
    try {
      // let nullCounter = 0;
      let totalCounter;
      let nullCounter = [];
      const response = await axios.post(
        url + "/Document/check-categories",
        {
          projectId: projectId,
          userId: userId,
          category: category,
        },
        { headers: { token: user.token } }
      );
      setCatagoryExists(response.data?.categoryExists);

      if (response.data?.categoryExists === true) {
        setKeys(response.data.keys);

        const newColumns = response.data.keys?.map((key) => ({
          title: key,
          field: key,
          customFilterAndSearch: (filter, rowData) => {
            // Assuming `key` is defined somewhere in your code, extract the value from the array
            const valueArray = rowData.unMapped_field?.Key_Values[key];
            // Check if valueArray is defined and not empty

            if (valueArray && valueArray.length > 0) {
              // Extract the first element of the array (assuming you want to compare against this value)
              const value = valueArray[0];
              // Perform the comparison
              return (
                value && value.toLowerCase().includes(filter.toLowerCase())
              );
            }
            // Return false if valueArray is undefined or empty
            return false;
          },

          // customFilterAndSearch: (filter, rowData) => {
          //   const values = rowData.unMapped_field?.Key_Values[key];
          //   if (!values) return false;
          //   return values?.some(value => value.includes(filter.value));
          // },

          render: (rowData) => {
            if (
              rowData?.unMapped_field?.Key_Values[key] === null ||
              rowData?.unMapped_field?.Key_Values[key] === undefined
            ) {
              if (!nullCounter.includes(key)) {
                nullCounter.push(key);
              }

              // setNullOrUndefinedCounter(nullOrUndefinedCounter + 1);
              return <span style={{ color: "red" }}>-</span>;
            }
            // debugger;

            return (
              <>
                <Tooltip
                  placement="top"
                  title={rowData?.unMapped_field?.Key_Values[key]}
                >
                  <p
                    style={{
                      // whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: "0px",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {rowData?.unMapped_field?.Key_Values[key]}
                  </p>
                </Tooltip>
              </>
            );
          },
          cellStyle: {
            minWidth: 30,
            width: "max-content",
            textAlign: "left",
            borderBottom: "2px solid silver",
            borderRight: "1px solid silver",
            padding: "12px",
          },
          headerStyle: {
            minWidth: 30,
            width: "max-content",
            textAlign: "left",
            borderBottom: "2px solid silver",
            borderRight: "1px solid #ffffff",
            padding: "12px",
          },
          filterCellStyle: MaterialFilterCellStyle(),
        }));

        totalCounter = newColumns.length;

        // Use the spread operator to create a new array with the new columns
        setColumns([...defaultdynamicColumns, ...newColumns]);
      } else if (response.data.categoryExists === false) {
        if (
          category === "Shop Drawing Submittals" ||
          category === "Material Submittals" ||
          category === "Technical Submittal" ||
          category === "Site Instruction" ||
          category === "Method Statement Submittal" ||
          category === "Non Conformance Report" ||
          category === "Prequalification Submittal" ||
          category === "Request for Information" ||
          category === "Work Inspection Request" ||
          category === "Meterial Inspection Request" ||
          category === "Architectural Inspection Request" ||
          category === "Intelligent Search" ||
          category === "Responsibility Matrix" ||
          category === "Tender Addendums" ||
          category === "Text Contract" ||
          category === "Scanned Contract" ||
          category === "BOQ" ||
          category === "MOM" ||
          category === "Other" ||
          category === "IN" ||
          category === "OUT"
        ) {
          getColumns();
        } else {
          setShowColumns(false);
          setColumns(defaultdynamicColumns);
        }
      }
      if (nullCounter.length / totalCounter >= 0.5) {
        setRemap(true);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  async function getColumns() {
    savedColumns = defaultCloumnsList;

    var tempcolumns = [];
    for (var columnIndex in savedColumns) {
      if (savedColumns[columnIndex].field === "tags4") {
        savedColumns[columnIndex].render = (rowData) => (
          <Grid item md={2}>
            <Chips value={rowData} onClick={handleOpenTagsModel} />
          </Grid>
        );
      }
      tempcolumns.push(savedColumns[columnIndex]);
    }
    setColumns(tempcolumns);
  }
  useEffect(() => {
    startFrom = 0;
    totalPages = 0;
    setPageNo(1);
    getFiles();
  }, [check, category, isDel, filters, allowedDuration]);

  useEffect(() => {
    if (openAttachModel === false) {
      startFrom = 0;
      totalPages = 0;
      setPageNo(1);
      getFiles();
    }
  }, [openAttachModel]);

  const paginationTag = (
    <Stack spacing={2}>
      <Pagination
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        count={totalPages}
        page={pageNo}
        onChange={handlePageChange}
      />
      <RowPerPage
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />
    </Stack>
  );

  const handleOpenFileViewModal = async (value) => {
    selected_file_to_view.current = value;
    setOpenFileViewerModal(true);
  };
  return (
    <>
      {
        <Box sx={{ paddingTop: "80px" }}>
          {openFileViewerModal ? (
            <FileViewerPopup
              open={openFileViewerModal}
              setOpen={setOpenFileViewerModal}
              file={selected_file_to_view.current}
              // rows={rows}
              // cols={cols}
            />
          ) : null}

          <UploadAttachment
            openAttachModel={openAttachModel}
            handleCloseAttachModel={handleCloseAttachModel}
            user={user}
            project={project}
            file={document_id_of_row_clicked.current}
          />
          <TagsModel
            open={openTagsModel}
            onClose={handleCloseTagsModel}
            project={project}
            user={user}
            file={document_id_of_row_clicked.current}
            setFiles={setFiles}
            files={files}
            department={department}
          />
          {homeslider ? (
            <PopUp
              homeslider={homeslider}
              sethomeslider={sethomeslider}
              receivers={receivers}
              setReceivers={setReceivers}
              cc={cc}
              setCC={setCC}
              subject={subject}
              setSubject={setSubject}
              body={body}
              setBody={setBody}
              checkedDocs={checkedDocs}
              checked={checked}
              pca={pca}
              user={user}
              setChecked={setChecked}
            />
          ) : null}

          <NotificationModel
            documentToNotify={documentToNotify}
            homeslider={notilider}
            sethomeslider={setNotislider}
            Notify={Notify}
            user={user}
            project={project}
          />

          <Modal open={openCoverCat} onClose={handleCloseCoverCat}>
            <Container sx={style}>
              <Grid container spacing={2}>
                <Grid container item xs={12}>
                  <Typography color="textPrimary" variant="h2">
                    Select cover page category
                  </Typography>
                </Grid>
                <Grid container item xs={12} spacing={2}>
                  {coverPageCate.map((item) => {
                    return (
                      <Grid item xs={12}>
                        <Button
                          color="primary"
                          fullWidth
                          size="small"
                          type="submit"
                          variant="contained"
                          onClick={(e) => CreateCoverPage(e, item)}
                        >
                          {item.label}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Container>
          </Modal>

          <div>
            <Modal
              open={openMoveModel}
              onClose={() => {
                setOpenMoveModel(false);
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ padding: 0 }}>
                    <Autocomplete
                      id="asynchronous-demo"
                      sx={{ width: 300 }}
                      open={openFolders}
                      onOpen={() => {
                        setOpenFolders(true);
                      }}
                      onClose={() => {
                        setOpenFolders(false);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.name === value.name
                      }
                      onChange={(event, option) => {
                        if (option) {
                          setFolderToMove(option.name);
                        } else {
                          setFolderToMove(option);
                        }
                      }}
                      getOptionLabel={(option) => option.name}
                      options={optionsFolders}
                      loading={loadingFolders}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Folders"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loadingFolders ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <Button
                      variant="contained"
                      endIcon={<DriveFileMoveIcon />}
                      size="small"
                      onClick={handleFolderMove}
                      disabled={
                        folderToMove && folderToMove.length > 0 ? false : true
                      }
                    >
                      Move
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>
          </div>

          <Box sx={{ textAlign: "left" }}>
            <div className="d-flex" style={{ gap: "2px" }}>
              {catagoryExists === false &&
                category !== "Shop Drawing Submittals" &&
                category !== "Material Submittal" &&
                category !== "Technical Submittal" &&
                category !== "Site Instruction" &&
                category !== "Method Statement Submittal" &&
                category !== "Non Conformance Report" &&
                category !== "Prequalification Submittal" &&
                category !== "Request for Information" &&
                category !== "Work Inspection Request" &&
                category !== "Meterial Inspection Request" &&
                category !== "Architectural Inspection Request" &&
                category !== "Intelligent Search" &&
                category !== "Responsibility Matrix" &&
                category !== "Tender Addendums" &&
                category !== "Text Contract" &&
                category !== "Scanned Contract" &&
                category !== "BOQ" &&
                category !== "MOM" &&
                category !== "Other" && (
                  <Alert variant="filled" severity="warning">
                    You haven't mapped the dynamic keys for this category yet.
                    Please select the common keys from the documents mapping
                    tab.
                  </Alert>
                )}
              {reMap === true && (
                <Alert variant="filled" severity="warning">
                  More than 50 percent of keys in a row are null. Please remap
                  the keys that are common in all documents.
                </Alert>
              )}

              {category === "Intelligent Search" ||
              category === "Responsibility Matrix" ||
              category === "Tender Addendums" ||
              category === "BOQ" ||
              category === "MOM" ||
              category === "Scanned Contract" ||
              category === "Text Contract" ? null : (
                <div style={{ textAlign: "right", width: "100%" }}>
                  <Button
                    variant="contained"
                    onClick={handleExport}
                    startIcon={<AddIcon />}
                  >
                    Export Logs as Excel
                  </Button>
                </div>
              )}
            </div>
          </Box>

          {columns.length ? (
            <Box
              sx={{ fontSize: "13px", paddingTop: "50px" }}
              className="doclistTable"
            >
              <MaterialTable
                tableRef={tableRef}
                icons={tableIcons}
                onColumnDragged={handleColumnDrag}
                onChangeColumnHidden={onChangeColumnHidden}
                columns={columns}
                // onOrderChange={onOrderChangeHandler}
                onRowClick={(event, rowData) => handleClickPreviewDoc(rowData)}
                data={files}
                isLoading={isLoading}
                actions={[
                  {
                    icon: () => (
                      <Chip
                        color="primary"
                        variant="outlined"
                        clickable
                        icon={<FilterListIcon />}
                        label={"Show Filters"}
                      />
                    ),
                    isFreeAction: true,
                    hidden: filtering,
                    onClick: () => {
                      setFiltering(true);
                    },
                  },
                  {
                    icon: () => (
                      <Chip
                        color="error"
                        variant="outlined"
                        clickable
                        icon={<FilterListOffIcon />}
                        label={"Hide Filters"}
                      />
                    ),
                    isFreeAction: true,
                    hidden: !filtering,
                    onClick: () => {
                      setFiltering(false);
                    },
                  },
                  {
                    position: "row",
                    icon: () => <Tag />,
                    tooltip: "Add Tags",
                    onClick: (event, rowData) => handleOpenTagsModel(rowData),
                  },
                  {
                    position: "row",
                    hidden: !download,
                    icon: () => <FileDownloadIcon />,
                    tooltip: "Download",
                    onClick: (event, rowData) =>
                      onDownload(rowData.urls, rowData?.document_name),
                  },
                  {
                    position: "row",
                    hidden: !remove,
                    icon: () => <DeleteForever />,
                    tooltip: "delete",
                    onClick: (event, rowData) =>
                      handleDelete(rowData.document_id, user),
                  },
                  {
                    position: "row",
                    icon: () => <TurnedInNot />,
                    tooltip: "Cover Page",
                    onClick: (event, rowData) =>
                      handleOpenCoverCat(event, rowData),
                  },
                  {
                    position: "row",
                    icon: () => <AttachFile />,
                    tooltip: "Add Attachment",
                    onClick: (event, rowData) => handleOpenAttachModel(rowData),
                  },
                  {
                    position: "row",
                    hidden: category !== "Bucket",
                    icon: () => <ArchiveIcon />,
                    tooltip: "Start Analyzation",
                    onClick: (event, rowData) => startAnalyzation(rowData),
                  },
                  {
                    position: "row",
                    icon: () => <NotificationsIcon />,
                    tooltip: "Notify",
                    onClick: (event, rowData) => handleClickNotify(rowData),
                  },
                  {
                    position: "row",
                    hidden: !move,
                    icon: () => <DriveFileMoveIcon />,
                    tooltip: "Move",
                    onClick: (event, rowData) =>
                      handleOpenMoveModel(event, rowData),
                  },
                  {
                    position: "row",
                    icon: () => <PreviewIcon />,
                    tooltip: "View File",
                    onClick: (event, rowData) =>
                      handleOpenFileViewModal(rowData),
                  },
                  {
                    hidden: !share,
                    icon: () => <Share />,
                    tooltip: "Share documents through outlook mail",
                    onClick: () => handlePopUp(),
                  },
                  {
                    hidden: !remove,
                    icon: () => <DeleteForever />,
                    tooltip: "Delete checked documents",
                    onClick: () => handleDeleteSelected(user, checkedDocs),
                  },
                ]}
                options={{
                  rowStyle: (rowData) => {
                    return {
                      backgroundColor:
                        rowBackgroundColors[rowData.isRead] ?? "#fff",
                    };
                  },
                  fixedColumns: -1,
                  showTitle: false,
                  searchAutoFocus: false,

                  showTextRowsSelected: false,
                  paging: false,
                  tableLayout: "fixed",
                  columnResizable: true,
                  search: true,
                  searchFieldStyle: {
                    width: "30%",
                    display: "flex",

                    textAlign: "left",
                    alignSelf: "flex-end",
                  },
                  // searchFieldVariant: "outlined",

                  filtering: filtering,
                  actionsColumnIndex: -1,
                  selection: true,
                  columnsButton: showcolumns,
                  headerStyle: {
                    // width: 'fit-content',
                    borderBottom: "2px solid silver",
                    borderRight: "1px solid #ffffff",
                  },
                  pageSizeOptions: [3, 5],
                  cellStyle: {
                    // width: 'max-content',
                    textAlign: "right",
                    borderBottom: "2px solid silver",
                    borderRight: "1px solid silver",
                    padding: "12px",
                    display: "flex",
                    justifyContent: "end",
                  },

                  actionsCellStyle: {
                    borderBottom: "2px solid silver",
                    borderRight: "1px solid silver",
                    padding: "12px",
                    marginLeft: "auto",
                  },

                  // filterCellStyle: MaterialFilterCellStyle(),
                }}
                onSelectionChange={(rows) => handleSelectChange(rows)}
                detailPanel={(rowData) => {
                  return rowData?.rowData?.document_attachment ? (
                    rowData?.rowData?.document_attachment.map((attachment) => {
                      return (
                        <Box
                          sx={{ m: 1 }}
                          onClick={() => handleOpenFileViewModal(attachment)}
                        >
                          <Typography className="TableColapse">
                            <FilePresentIcon />
                            {attachment.name}
                          </Typography>

                          {/* <Tooltip title="View File" placement="top">
                        <IconButton
                          onClick={() => handleOpenFileViewModal(attachment)}
                        >
                          <PreviewIcon />
                        </IconButton>
                      </Tooltip> */}
                        </Box>
                      );
                    })
                  ) : (
                    <Box sx={{ m: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          display: "Flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        No Attachment Found
                      </Typography>
                    </Box>
                  );
                }}
              />

              {paginationTag}
            </Box>
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
        </Box>
      }
    </>
  );
}
function HeaderStyles() {
  return {
    minWidth: 150,
    width: "max-content",
    textAlign: "left",
    borderBottom: "2px solid silver",
    borderRight: "1px solid #ffffff",
    padding: "12px",
  };
}

function MaterialCellStyle() {
  return {
    minWidth: 150,
    width: "max-content",
    textAlign: "left",
    borderBottom: "2px solid silver",
    borderRight: "1px solid silver",
    padding: "12px",
  };
}

function MaterialFilterCellStyle() {
  return {
    // width: "100%",
    padding: "0px",
    margin: "0px",
    borderRight: "none",
    borderTop: "none",
    borderBottom: "none",
    fontSize: "12px",
    // minWidth: 150,
    // width: "max-content",
    // whiteSpace: "nowrap",
  };
}

const coverPageCate = [
  { label: "Shop Drawing Submital" },
  { label: "Material Submittal" },
  { label: "Site Instruction" },
  { label: "Meterial Inspection Request" },
  { label: "Technical Submittal" },
  { label: "Method Statement Submittal" },
  { label: "Non Conformance Report" },
  { label: "Prequalification Submittal" },
  { label: "Request for Information" },
  { label: "Work Inspection Request" },
  { label: "Architectural Inspection Request" },
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
