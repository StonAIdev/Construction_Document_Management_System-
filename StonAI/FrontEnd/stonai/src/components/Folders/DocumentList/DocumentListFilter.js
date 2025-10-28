import React, { useEffect, useState, useRef } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";
import {
  MoreHoriz,
  Visibility,
  Folder,
  DeleteForever,
  Share,
} from "@mui/icons-material";
import NotificationModel from "../../NotificationModel/NotificationModel";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "material-ui-image";
import EmptyFolderImage from "../Assets/folder.png";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { url } from "../../../url";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";

import { faFileExport } from "@fortawesome/free-solid-svg-icons";

import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Person } from "@mui/icons-material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Popover, Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useMsal } from "@azure/msal-react";

import { DocumentListLabel } from "./DocumentListLabel";
import { loginRequest } from "../../../authConfig";
import PopUp from "./PopUp";

import StyledMenu from "./StyledMenu";

export default function DocumentListFilter({
  handleClickPreviewDoc,
  filters,
  isChildren,
  setFilters,
  user,
  saveClicked,
  clearAllHandler,
  saveToggle,
  check,
  fileType,
  calenderValue,
  setIsChildren,
  currentComp,
  setCurrentComp,
  category,
  setCategory,
  socket,
  users,
  pca,
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

  const [notilider, setNotislider] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [anchorElUsers, setAnchorElUsers] = React.useState(null);
  const openUsers = Boolean(anchorElUsers);

  //Popup states
  const [homeslider, sethomeslider] = useState(false);
  let [receivers, setReceivers] = useState([]);
  let [cc, setCC] = useState([]);
  let [subject, setSubject] = useState("");
  let [body, setBody] = useState("");

  const [documentToNotify, setDocumentToNotify] = useState();

  const checking = (value) => {
    console.log("value", value);
  };

  // const handleReceiver = ()=>{
  //   setReceiver();
  // }

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

  const backClickHandler = () => {
    setIsChildren(false);
    setCategory(null);
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

  const getFiles = async (user) => {
    console.log("getfiles", isLoading);
    console.log("Comp", currentComp);
    setLoading(true);
    const res = await axios.post(
      url + "/Document/getWithFiltersEs",
      {
        filters: filters,
      },
      {
        headers: { token: user.token },
      }
    );

    const files_db = res.data;
    var arr = [];
    console.log("files_db", files_db);
    const getfilesurl = async (element, document_id) => {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          element.document_id
      );
      element["urls"] = response.data.uploadURL;
      element["document_id"] = document_id;
      return element;
    };
    for (const element of files_db) {
      console.log("eleme", element);
      const ele = await getfilesurl(element._source, element._id);
      arr.push(ele);
    }
    setFiles(arr);
    console.log("beforeSetloading", files);
    setLoading((isLoading = false));
  };
  const onDownload = (url, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    // document.body.removeChild(link);
    // delete link;
  };

  const handleDelete = async (fileName, user) => {
    console.log(fileName);
    console.log(user);
    if (window.confirm("Are you sure you want to delete this file?")) {
      setLoading((isLoading = true));
      const res = await axios.post(
        url + "/Document/delete",
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

  const handleDeleteSelected = async (user) => {
    if (window.confirm("Are you sure you want to delete these files?")) {
      setLoading((isLoading = true));

      for (const element of checked) {
        // for (const element of checked) {
        console.log(element);
        const fileTodelete = files[element].document_id;
        console.log(fileTodelete);
        await axios.post(
          url + "/Document/delete",
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

  ///to export data to excel

  const handleExport = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let filteredData = files.map(
      ({ document_id, project_id, urls, ...rest }) => rest
    );

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "file" + fileExtension);
  };
  const [reciever, setReciever] = useState("Saad@gmail.com");
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

  const handleShareSingleFile = async (file) => {
    var a = window.sessionStorage.getItem(
      "697ad198-826a-42cb-9b69-56014aa18c18.a1e3cc4f-47e2-4e32-a7a1-5b14136b160b-login.windows.net-accesstoken-458bcb35-e708-4fd7-a2c0-d7f4c64e9b8e-a1e3cc4f-47e2-4e32-a7a1-5b14136b160b-mail.read mail.readbasic mail.send notifications.readwrite.createdbyapp openid profile user.read email"
    );
    if (!a) {
      alert("User not signed in");
      console.log(pca);
      await pca
        .loginPopup(loginRequest)
        .then(function (response) {
          // success response
        })
        .catch(function (error) {
          console.log(error);
        });
      a = window.sessionStorage.getItem(
        "697ad198-826a-42cb-9b69-56014aa18c18.a1e3cc4f-47e2-4e32-a7a1-5b14136b160b-login.windows.net-accesstoken-458bcb35-e708-4fd7-a2c0-d7f4c64e9b8e-a1e3cc4f-47e2-4e32-a7a1-5b14136b160b-mail.read mail.readbasic mail.send notifications.readwrite.createdbyapp openid profile user.read email"
      );
    }
    if (a) {
      const token = JSON.parse(a.toString()).secret;
      console.log(token);
      var data = {
        message: {
          subject: "Meet for lunch?",
          body: {
            contentType: "Text",
            content: "The new cafeteria is open.",
          },
          toRecipients: [
            {
              emailAddress: {
                address: "syedharoon544@gmail.com",
              },
            },
          ],
          ccRecipients: [
            {
              emailAddress: {
                address: "syedharoon544@gmail.com",
              },
            },
          ],
          attachments: [
            {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: `${file.document_name}`,
              contentType: `${file.document_type}`,
              contentBytes: "",
            },
          ],
        },
        saveToSentItems: "false",
      };
      var config = {
        method: "post",
        url: "https://graph.microsoft.com/v1.0/me/sendMail",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      var request = new XMLHttpRequest();
      request.open("GET", file.urls, true);
      request.responseType = "blob";
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload = function (e) {
          console.log("DataURL:", e.target.result);
          data.message.attachments[0].contentBytes =
            e.target.result.split(",")[1];

          axios(config)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
              console.log(error);
            });
        };
      };

      request.send();
    }
  };

  useEffect(() => {
    console.log("filtersINDOCLIST", filters);
    console.log("users", users);
    getFiles(user);
  }, [check, currentComp, isDel]);

  return (
    <>
      {!isLoading ? (
        files.length > 0 ? (
          <Box>
            {checked.length > 0 ? (
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
            />
            <Box sx={{ textAlign: "right" }}>
              <Checkbox
                edge="start"
                // checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                size="small"
                checked={checkedGlobal}
                disableRipple
                onClick={handleCheckAll}

                // inputProps={{ "aria-labelledby": labelId }}
              />

              <IconButton
                aria-label="delete"
                // onClick={() => handleDelete(value.document_name, user)}
                onClick={() => handleDeleteSelected(user, files)}
                disabled={checked.length > 0 ? false : true}
                sx={{ width: 30, height: 30 }}
              >
                <DeleteForever />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="comments"
                disabled={checked.length > 0 ? false : true}
                onClick={handleExport}
              >
                <ImportExportIcon />
              </IconButton>
              <IconButton
                disabled={checked.length > 0 ? false : true}
                onClick={handlePopUp}
              >
                <Share />
              </IconButton>
            </Box>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                overflowWrap: "anywhere",
              }}
            >
              <Grid container spacing={1} sx={{ marginBottom: 1 }}>
                <DocumentListLabel />
              </Grid>
              {files.map((value, index) => {
                const labelId = `checkbox-list-label-${index}`;
                console.log("value", value);
                return (
                  <ListItem
                    sx={{
                      backgroundColor: "var(--background)",
                      marginBottom: 1,
                    }}
                    key={index}
                    secondaryAction={
                      <div>
                        <IconButton
                          edge="end"
                          aria-label="download"
                          onClick={() =>
                            onDownload(value.urls, value.document_id)
                          }
                        >
                          <FileDownloadIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(value.document_id, user)}
                        >
                          <DeleteForever />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={(event) => {
                            handleClick(event, value);
                          }}
                        >
                          <MoreHoriz />
                        </IconButton>
                        <StyledMenu
                          id="demo-customized-menu"
                          MenuListProps={{
                            "aria-labelledby": "demo-customized-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                        >
                          <MenuItem onClick={handleClose} disableRipple>
                            <EditIcon />
                            Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleShareSingleFile(selectedFile)}
                            disableRipple
                          >
                            <Share />
                            Share
                          </MenuItem>
                          <Divider sx={{ my: 0.5 }} />
                          <MenuItem
                            onClick={() => handleClickNotify(selectedFile)}
                            disableRipple
                          >
                            <ArchiveIcon />
                            Notify
                          </MenuItem>
                          <StyledMenu
                            id="demo-customized-menu"
                            MenuListProps={{
                              "aria-labelledby": "demo-customized-button",
                            }}
                            open={openUsers}
                            anchorEl={anchorElUsers}
                            onClose={handleCloseUsers}
                          >
                            {users.map((use) => {
                              return (
                                <MenuItem
                                  onClick={() => Notify(use)}
                                  disableRipple
                                >
                                  <Person />
                                  {use.username}
                                </MenuItem>
                              );
                            })}
                          </StyledMenu>
                          <MenuItem
                            onClick={() => handleClickPreviewDoc(selectedFile)}
                            disableRipple
                          >
                            <Visibility />
                            View
                          </MenuItem>
                        </StyledMenu>
                      </div>
                    }
                    dense
                    disablePadding
                  >
                    <Grid container spacing={2} wrap="nowrap">
                      <Grid item md={0.5}>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={checked.indexOf(index) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={() =>
                              handleToggle(index, value.document_id, value)
                            }
                            sx={{ marginLeft: 0.5 }}
                          />
                        </ListItemIcon>
                      </Grid>
                      <Grid container item md={3.5}>
                        <IconButton>
                          <FontAwesomeIcon
                            icon={handleFolder(
                              value?.document_type.substring(
                                value?.document_type.indexOf("/") + 1
                              )
                            )}
                          />
                        </IconButton>

                        <span>
                          {/* <ListItemText
                              id={labelId}
                              primary={value?.document_name}
                              sx={{ fontSize: 1 }}
                            /> */}
                          <Typography
                            variant="caption"
                            sx={{ lineHeight: "40px", textAlign: "center" }}
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
                        {/* <Typography
                            variant="caption"
                            sx={{ lineHeight: "40px", textAlign: "center" }}
                          >
                            {value?.document_size + "KB"}
                          </Typography> */}
                        <Typography
                          variant="caption"
                          sx={{ lineHeight: "40px", textAlign: "center" }}
                        >
                          {value?.document_category}
                        </Typography>
                      </Grid>
                      <Grid item md={2}>
                        {/* <Typography
                            variant="caption"
                            sx={{ lineHeight: "40px", textAlign: "center" }}
                          >
                            {value?.document_type.substring(
                              value?.document_type.indexOf("/") + 1
                            )}
                          </Typography> */}
                        <Typography
                          variant="caption"
                          sx={{ lineHeight: "40px", textAlign: "center" }}
                        >
                          {value?.contractor}
                        </Typography>
                      </Grid>
                      <Grid item md={2}>
                        {/* <Typography
                          variant="caption"
                          sx={{
                            lineHeight: "40px",
                            textAlign: "center",
                          }}
                        >
                          {value?.last_modified.substring(0, 10)}{" "}
                        </Typography> */}
                        <Typography
                          variant="caption"
                          sx={{
                            lineHeight: "40px",
                            textAlign: "center",
                          }}
                        >
                          {value?.uploaded_by}
                        </Typography>
                      </Grid>

                      {/* </ListItemButton> */}
                    </Grid>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ) : (
          <>
            <IconButton
              sx={{ width: 30, height: 30 }}
              onClick={() => setIsChildren(false)}
            >
              <ArrowBack />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "500px",
                width: "100%",
                margin: 0,
              }}
            >
              <Grid sx={{ textAlign: "center" }}>
                <Image src={EmptyFolderImage} />

                <Typography
                  variant="body2"
                  sx={{ fontSize: 20, fontWeight: "bold", mt: 2 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {"\n"} Nothing in the folder
                </Typography>
              </Grid>
            </Box>
          </>
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
