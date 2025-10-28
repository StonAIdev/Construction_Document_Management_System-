import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  IconButton,
  CircularProgress,
  Box,
  Grid,
  TextField,
} from "@mui/material";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

import { url } from "../../../../url";

import {
  faFilePdf,
  faFileWord,
  faImage,
  faFile,
} from "@fortawesome/free-regular-svg-icons";
import NoData from "../../../../pages/Assets/NoData";

import { Typography } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";

import { DocumentListLabel } from "./DocumentListLabelEmail";

var totalPages = 0;
var startFrom = 0;

export default function DocumentList({
  project,
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
  isFilterSearch,
  setChildren,
  checkedDocs,
  setCheckedDocs,
}) {
  //Documents List states
  let [checked, setChecked] = useState([]);
  const [isDel, setDel] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  var [files, setFiles] = useState([]);
  //Menu Items States
  var [isLoading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);

  const [name, setName] = React.useState("");
  const handleChange = (event) => {
    setName(event.target.value);
  };

  const backClickHandler = () => {
    setIsChildren(false);
    setCategory(null);
  };
  const handleToggle = async (index, document_id, value) => {
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
  };
  const getfilesurl = async (element, document_id) => {
    try {
      const response = await axios(
        "https://g0ajndudsk.execute-api.ap-south-1.amazonaws.com/default/getPresignedURLGetObject?fileName=" +
          document_id
      );
      element["urls"] = response.data.uploadURL;
      element["document_id"] = document_id;

      return element;
    } catch (error) {
      console.log("error", error);
    }
  };
  const getFiles = async (event, page) => {
    setPageNo(page);

    setLoading(true);
    var res;
    if (isFilterSearch) {
      try {
        res = await axios.post(
          url + "/Document/getWithFiltersEs",
          {
            filters: filters,
            project: project,
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
            category: currentComp,
            project: project,
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

  const handlePageChange = async (event, page) => {
    setPageNo(page);
    setLoading(true);
    startFrom = page * 10 - 10;
    var res;
    if (isFilterSearch) {
      try {
        res = await axios.post(
          url + "/Document/getWithFiltersEs",
          {
            filters: filters,
            project: project,
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
            category: currentComp,
            project: project,
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

  useEffect(() => {
    startFrom = 0;
    totalPages = 0;
    setPageNo(1);
    getFiles(user);
  }, [check, currentComp, isDel, filters]);

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
          <div>
            <Box sx={{ textAlign: "right" }}>
              <IconButton
                sx={{ width: 30, height: 30 }}
                onClick={backClickHandler}
              >
                <ArrowBack />
              </IconButton>
            </Box>
            <TextField
              id="outlined-name"
              label="Document Name"
              value={name}
              onChange={handleChange}
              sx={{ bgcolor: "background.paper", marginBottom: 1 }}
            />

            <Box sx={{ height: "55vh" }} className="docscroll ">
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                  overflowWrap: "anywhere",
                }}
              >
                <Grid container>
                  <DocumentListLabel />
                </Grid>
                {files
                  .filter((file) => {
                    if (name) {
                      return file.document_name
                        .toLowerCase()
                        .includes(name.toLowerCase());
                    } else {
                      return file;
                    }
                  })
                  .map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                      <ListItem
                        sx={{
                          backgroundColor: "var(--background)",
                          cursor: "pointer",
                        }}
                        key={index}
                        dense
                        disablePadding
                      >
                        <Grid container wrap="nowrap">
                          <Grid item md={0.5}>
                            <ListItemIcon>
                              <Checkbox
                                edge="start"
                                checked={checked.indexOf(index) !== -1}
                                tabIndex={-1}
                                size="small"
                                disableRipple
                                inputProps={{ "aria-labelledby": labelId }}
                                onClick={() =>
                                  handleToggle(index, value.document_id, value)
                                }
                                sx={{ marginLeft: 0.5 }}
                              />
                            </ListItemIcon>
                          </Grid>

                          <Grid container item md={4}>
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
                              <Typography
                                variant="caption"
                                sx={{ lineHeight: "40px", textAlign: "center" }}
                              >
                                {value?.document_name.length > 31 ? (
                                  <>
                                    {value?.document_name.slice(0, 31) + "..."}{" "}
                                  </>
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
                          <Grid item md={3}>
                            {/* <Typography
                            variant="caption"¬
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
                {paginationTag}
              </List>
            </Box>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "right" }}>
              <IconButton
                onClick={() => setIsChildren(false)}
                sx={{
                  width: 30,
                  height: 30,
                }}
              >
                <ArrowBack />
              </IconButton>
            </div>
            <NoData description="No Documents in the folder" />
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
