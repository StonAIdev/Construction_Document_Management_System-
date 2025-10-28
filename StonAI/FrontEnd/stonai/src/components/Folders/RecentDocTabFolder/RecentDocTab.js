import React, { useEffect, useState, useRef } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  IconButton,
  CircularProgress,
  Box,
  Grid,
  Typography,
  Button,

} from "@mui/material";
import {
  MoreHoriz,
  Visibility,
  DeleteForever,
  Share,
  Cancel
} from "@mui/icons-material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import CoverPageContext from "../../../context/CoverPageContext";
import { url } from "../../../url";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import NoData from "../../../pages/Assets/NoData";
import NotificationModel from "../../NotificationModel/NotificationModel";

import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import TaskIcon from "@mui/icons-material/Task";
import { Person } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBack from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { RecentDocListLabel } from "./RecentDocListLabel";
import { useNavigate } from "react-router-dom";
import PopUp from "../DocumentList/PopUp";
import StyledMenu from "../DocumentList/StyledMenu";

var totalPages = 0;
var startFrom = 0;


export default function RecentDocTab({
  project,
  user,
  users,
  pca,
  socket,
  handleClickPreviewDoc,
  userPosition,
  check,
}) {
  //Documents List states
  let [checked, setChecked] = useState([]);
  let [checkedGlobal, setCheckedGlobal] = useState(false);
  let [checkedDocs, setCheckedDocs] = useState([]);
  const [isDel, setDel] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  var [files, setFiles] = useState([]);
  //Menu Items States
  var [isLoading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const [notilider, setNotislider] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchorElUsers, setAnchorElUsers] = React.useState(null);
  const openUsers = Boolean(anchorElUsers);
  const [clickApprove, setClickApprove] = useState(false);

  //Popup states
  const [homeslider, sethomeslider] = useState(false);
  let [receivers, setReceivers] = useState([]);
  let [cc, setCC] = useState([]);
  let [subject, setSubject] = useState("");
  let [body, setBody] = useState("");
  const navigate = useNavigate();
  const [documentToNotify, setDocumentToNotify] = useState();

  const [pageSize, setPageSize] = useState(50);

  const handlePopUp = () => {
    sethomeslider(true);
  };
  function handleClick(event, value) {
    console.log("value1", value);
    setSelectedFile(value);
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseUsers = () => {
    setAnchorElUsers(null);
  };
  const refreshList = () => {
    getCoverPages();
  };

  const handleToggle = (index, document_id, value) => {
    const currentIndex = checked.indexOf(index);
    const newChecked = [...checked];
    var newCheckedDocs = [...checkedDocs];

    if (currentIndex === -1) {
      newChecked.push(index);
      newCheckedDocs.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
      newCheckedDocs.splice(value.document_id, 1);
    }

    setChecked(newChecked);
    setCheckedDocs(newCheckedDocs);
    console.log(checkedDocs);
  };
  const getfilesurl = async (element, document_id, _id) => {
    try {
      console.log("document_id", document_id);
      element["document_id"] = element.document_id;
      element["_id"] = _id;
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
        document_id
      );
      element["urls"] = response.data.uploadURL;

      console.log("urllsssss", response.data.uploadURL);
      return element;
    } catch (error) {
      console.log("error", error);
    }
  };
  const getCoverPages = async () => {
    setLoading(true);
    var res;

    try {
      res = await axios.post(
        url + "/RecentDocuments/getRecentDocs",
        {
          project: project,
          pageSize: pageSize,
          startFrom: startFrom,
          uploader_id: user.user_id,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (error) {
      console.log("errorqqw", error);
      return error.response;
    }
    console.log("respop", res);
    var decimalCheck = (res.data.totalHits / pageSize) % 1;
    if (decimalCheck == 0) {
      totalPages = res.data.totalHits / pageSize;
    } else {
      totalPages = parseInt(res.data.totalHits / pageSize) + 1;
    }
    console.log("res.data.hits: ", res.data.hits);

    const files_db = res.data.hits;
    var arr = [];
    console.log("files_db", files_db);
    for (const element of files_db) {
      console.log("eleme", element);
      const ele = await getfilesurl(element._source, element._id);
      ele["document_id"] = element._id;
      arr.push(ele);
    }
    console.log("ele files", arr);

    console.log("arr", arr);
    setFiles(arr);
    console.log("beforeSetloading", arr);
    setLoading((isLoading = false));
  };

  const handlePageChange = async (event, page) => {
    setPageNo(page);
    setLoading(true);
    startFrom = page * pageSize - pageSize;
    var res;

    try {
      res = await axios.post(
        url + "/RecentDocuments/getRecentDocs",
        {
          project: project,
          pageSize: pageSize,
          startFrom: startFrom,
          uploader_id: user.user_id,
        },
        {
          headers: { token: user.token },
        }
      );
    } catch (error) {
      console.log(error.response);
      return error.response;
    }

    const files_db = res.data.hits;
    var arr = [];
    console.log("files_db", files_db);
    for (const element of files_db) {
      console.log("eleme", element);
      const ele = await getfilesurl(
        element._source,
        element._source.coverPageOf
      );
      arr.push(ele);
    }
    setFiles(arr);
    console.log("beforeSetloading", files);
    setLoading((isLoading = false));
  };

  const onDownload = async (url, name) => {
    console.log("to down", url, name);
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
    console.log(fileName);
    console.log(user);
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

      setLoading((isLoading = false));
      setDel(!isDel);
    } else {
      // Do nothing!
      console.log("Delete canceled");
    }
  };

  const handleCheckAll = () => {
    setCheckedGlobal((checkedGlobal = !checkedGlobal));
    var newChecked = [...checked];
    var newCheckedDocs = [...checkedDocs];

    if (checkedGlobal === true) {
      for (let index = 0; index < files.length; index++) {
        console.log(index);

        const currentIndex = checked.indexOf(index);
        if (currentIndex === -1) {
          newChecked.push(index);
          newCheckedDocs.push(files[index]);
        } else {
          newChecked.splice(currentIndex, 1);
          newCheckedDocs.splice(files[index], 1);
        }
      }
      setChecked((checked = newChecked));
      setCheckedDocs((checkedDocs = newCheckedDocs));
    } else if (checkedGlobal === false) {
      setChecked((checked = []));
      setCheckedDocs((checkedDocs = []));
    }
  };

  const handleDeleteSelected = async (user, file) => {
    if (window.confirm("Are you sure you want to delete these files?")) {
      // setLoading((isLoading = true));


      console.log("document_del", user, file);
      try {
        await axios.post(
          url + "/Document/deleteEs",
          {
            name: file.document_id,
          },
          {
            headers: { token: user.token },
          }
        );
        refreshList()
      } catch (error) {
        console.log("eror", error);
      }

      console.log("multiple files deleted");

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

  const handleClickApprove = async (selectedFile) => {
    try {
      const response = await axios.post(
        url + "/Document/updateDocumentStatus",
        { document_id: selectedFile.document_id },
        { headers: { token: user.token } }
      );
      handleClose();
      setClickApprove(true);
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  const handleClickEdit = (selectedFile) => {
    console.log("value111", selectedFile);
    CoverPageContext.coverpage_id = selectedFile._id;
    CoverPageContext.creatingOrEditing = "edit";
    navigate("/app/coverPageForm");
    handleClose();
    // setAnchorElUsers(event.currentTarget);
  };
  const handleClickNotify = (selectedFile) => {
    console.log("value111", selectedFile);
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
    console.log("statify", values);
    const res = await addNotifications(values);
    socket.emit("sendNotification", {
      sender: user,
      receivers: receivers,
    });
  };

  useEffect(() => {
    startFrom = 0;
    totalPages = 0;
    setPageNo(1);
    getCoverPages();
  }, [isDel, check, clickApprove]);

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
    </Stack>
  );

  return (
    <>
      {!isLoading ? (
        files.length > 0 ? (
          <Box>
            <Button
              size="small"
              variant="contained"
              onClick={() => refreshList()}
              sx={{ marginBottom: "8px" }}
            >
              <RefreshIcon sx={{ marginRight: "10px" }} />
              Refresh

            </Button>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                overflowWrap: "anywhere",
              }}
            >
              <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                <RecentDocListLabel />
              </Grid>
              {files.map((value, index) => {
                const labelId = `checkbox-list-label-${index}`;
                console.log("value", value);
                return (
                  <ListItem
                    sx={{
                      backgroundColor: "var(--background)",
                      marginBottom: 1,
                      cursor: "pointer",
                    }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteSelected(user, value)}>
                        <Cancel color="error" />
                      </IconButton>
                    }
                    key={index}
                    dense
                    disablePadding

                  >
                    <Grid
                      container
                      spacing={2}
                      wrap="nowrap"
                      sx={{ paddingLeft: 4 }}
                    >
                      <Grid container item md={3}>
                        <span>
                          <Typography
                            variant="caption"
                            sx={{ lineHeight: "40px", textAlign: "center" }}
                            onClick={() => handleClickPreviewDoc(value)}
                          >
                            {value?.document_name.length > 31 ? (
                              <>{value?.document_name.slice(0, 31) + "..."} </>
                            ) : (
                              <>{value?.document_name} </>
                            )}
                          </Typography>
                        </span>
                      </Grid>

                      <Grid item md={3}>
                        <Typography
                          variant="caption"
                          sx={{ lineHeight: "40px", textAlign: "center" }}
                          onClick={() => handleClickPreviewDoc(value)}
                        >
                          {value?.document_category}
                        </Typography>
                      </Grid>
                      <Grid item md={3}>
                        <Typography
                          variant="caption"
                          sx={{ lineHeight: "40px", textAlign: "center" }}
                          onClick={() => handleClickPreviewDoc(value)}
                        >
                          {value?.document_status}
                        </Typography>
                      </Grid>

                      <Grid item md={3}>
                        <Typography
                          variant="caption"
                          sx={{
                            lineHeight: "40px",
                            textAlign: "center",
                          }}
                          onClick={() => handleClickPreviewDoc(value)}
                        >
                          {value?.uploaded_by}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                );
              })}
              {paginationTag}
            </List>
          </Box>
        ) : (
          <></>
        )
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
}
