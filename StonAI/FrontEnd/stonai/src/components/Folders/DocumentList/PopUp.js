import React, { useState, useEffect } from "react";
import {
  Box,
  Chip,
  Autocomplete,
  TextField,
  IconButton,
  Paper,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { url } from "../../../url";
import { useSnackbar } from "notistack";

import CloseIcon from "@mui/icons-material/Close";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import "./popup.css";
import ButtonStyled from "../../../Reusable Components/Buttons/ButtonStyled";

import axios from "axios";
import { loginRequest } from "../../../authConfig";
import fileSize from "filesize";
import { Cancel, DeleteForeverOutlined } from "@mui/icons-material";
import { getToken } from "../../../utils/GetToken";

function PopUp({
  homeslider,
  sethomeslider,
  receivers,
  setReceivers,
  cc,
  setCC,
  subject,
  setSubject,
  body,
  setBody,
  checkedDocs,
  checked,
  pca,
  user,
  setChecked,
}) {
  const [chipData, setChipData] = useState(checkedDocs);
  const [uploadSucess, setUploadSucess] = useState(false);
  const [outlookRecv, setoutlookRecv] = useState([]);
  const [isValidRecv, setIsValidRecv] = useState(false);
  const [isValidCC, setIsValidCC] = useState(false);
  const [token, setToken] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const [openAutocomplete, setOpenAutocomplete] = React.useState(false);
  const [openAutocompleteCC, setOpenAutocompleteCC] = React.useState(false);
  const loading = openAutocomplete && outlookRecv.length === 0;
  const loadingCC = openAutocompleteCC && outlookRecv.length === 0;

  const handleToken = async () => {
    const token = await getToken();
    setToken(token);
    return token;
  };

  const handleClickVariant = (variant) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("Email Sent Sucessfully", { variant });
  };

  let documentSize = 0;
  const getReceivers = async () => {
    const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
      headers: { token: user.token, user_id: user.user_id },
    });
    let rec = [];
    responseRec.data.rows.map((g) => {
      rec.push(g.email_address);
    });
    // let to=[];
    // rec.map((t) => to.push(t.emailAddress.name));

    var uniqueRec = [...new Set(rec)];
    console.log("unique", uniqueRec);

    setoutlookRecv(uniqueRec);
  };

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
          headers: { token: user.token, user_id: user.user_id },
        });
        // let rec = [];
        // responseRec.data.rows.map((g) => {
        //   rec.push(g.email_address);
        // });
        // // let to=[];
        // // rec.map((t) => to.push(t.emailAddress.name));

        // var uniqueRec = [...new Set(rec)];
        // console.log("unique", uniqueRec);

        console.log("ASdasdaslkmdoqwmdkoqwm", responseRec);

        setoutlookRecv(responseRec.data.rows);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);
  useEffect(() => {
    let active = true;

    if (!loadingCC) {
      return undefined;
    }

    (async () => {
      if (active) {
        const responseRec = await axios(url + `/Email/getRec/${user.user_id}`, {
          headers: { token: user.token, user_id: user.user_id },
        });
        // let rec = [];
        // responseRec.data.rows.map((g) => {
        //   rec.push(g.email_address);
        // });
        // // let to=[];
        // // rec.map((t) => to.push(t.emailAddress.name));

        // var uniqueRec = [...new Set(rec)];
        // console.log("unique", uniqueRec);

        console.log("ASdasdaslkmdoqwmdkoqwm", responseRec);

        setoutlookRecv(responseRec.data.rows);
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingCC]);

  useEffect(() => {
    if (!openAutocomplete) {
      setoutlookRecv([]);
    }
    if (!openAutocompleteCC) {
      setoutlookRecv([]);
    }
  }, [openAutocomplete, openAutocompleteCC]);

  useEffect(() => {
    if (!openAutocompleteCC) {
      setoutlookRecv([]);
    }
  }, [openAutocompleteCC]);

  useEffect(() => {
    // handleToken();
  }, [chipData, token]);
  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handeReceiversChange = (newVal) => {
    setReceivers(newVal);
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    newVal.forEach((element) => {
      console.log(element);
      if (element.match(regexEmail)) {
        console.log("called here no error");
        setIsValidRecv(false);
      } else {
        console.log("called here error");

        setIsValidRecv(true);
      }
    });
  };

  const handleCcChange = (newVal) => {
    setCC(newVal);
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    newVal.forEach((element) => {
      console.log(element);
      if (element.match(regexEmail)) {
        console.log("called here no error");
        setIsValidCC(false);
      } else {
        console.log("called here error");

        setIsValidCC(true);
      }
    });
  };

  const handleDelete = (chipToDelete) => () => {
    console.log(chipToDelete);
    setChipData(chipData.filter((chip) => chip.document_name !== chipToDelete));
    console.log(chipData);
  };
  const handleShare = async () => {
    if (!token) {
      const tok = await handleToken();
      let recvArr = [];
      receivers.map((r) => {
        recvArr.push({ emailAddress: { address: r } });
      });
      console.log("sadsad", recvArr);

      let ccArr = [];
      cc.map((r) => {
        ccArr.push({ emailAddress: { address: r } });
      });

      var data = {
        message: {
          subject: `${subject}`,
          body: {
            contentType: "Text",
            content: `${body}`,
          },
          toRecipients: recvArr,
          ccRecipients: ccArr,
          attachments: [],
        },
        saveToSentItems: "false",
      };

      var config = {
        method: "post",
        url: "https://graph.microsoft.com/v1.0/me/sendMail",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tok}`,
        },
        data: data,
      };
      console.log(config);
      var arr = [];
      const covertAndAttach = async (request, index, doc) => {
        request.onload = function () {
          var reader = new FileReader();
          reader.readAsDataURL(request.response);
          reader.onload = function (e) {
            const obj = {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: doc.document_name,
              contentType: doc.document_type,
              contentBytes: e.target.result.split(",")[1],
            };
            arr.push({
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: doc.document_name,
              contentType: doc.document_type,
              contentBytes: e.target.result.split(",")[1],
            });
            data.message.attachments = arr;
            if (index === chipData.length - 1) {
              console.log("dsffdsfsd", data);

              axios(config)
                .then(function (response) {
                  handleClickVariant("success");
                  setUploadSucess(true);
                })
                .catch(function (error) {
                  alert("User not signed in click on ok to sign user");

                  pca
                    .loginPopup(loginRequest)
                    .then(function (response) {
                      // success response
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
                });
            }
          };
        };
        request.send();
      };

      for (let index = 0; index < chipData.length; index++) {
        var request = new XMLHttpRequest();
        request.open("GET", chipData[index].urls, true);
        request.responseType = "blob";
        console.log("called ", index);
        await covertAndAttach(request, index, chipData[index]);
      }
    } else if (token) {
      let recvArr = [];
      receivers.map((r) => {
        recvArr.push({ emailAddress: { address: r } });
      });
      console.log("sadsad", recvArr);

      let ccArr = [];
      cc.map((r) => {
        ccArr.push({ emailAddress: { address: r } });
      });

      var data = {
        message: {
          subject: `${subject}`,
          body: {
            contentType: "Text",
            content: `${body}`,
          },
          toRecipients: recvArr,
          ccRecipients: ccArr,
          attachments: [],
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
      console.log(config);
      var arr = [];
      const covertAndAttach = async (request, index, doc) => {
        request.onload = function () {
          var reader = new FileReader();
          reader.readAsDataURL(request.response);
          reader.onload = function (e) {
            const obj = {
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: doc.document_name,
              contentType: doc.document_type,
              contentBytes: e.target.result.split(",")[1],
            };
            arr.push({
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: doc.document_name,
              contentType: doc.document_type,
              contentBytes: e.target.result.split(",")[1],
            });
            data.message.attachments = arr;
            if (index === chipData.length - 1) {
              console.log("dsffdsfsd", data);

              axios(config)
                .then(function (response) {
                  handleClickVariant("success");
                  setUploadSucess(true);
                })
                .catch(function (error) {});
            }
          };
        };
        request.send();
      };

      for (let index = 0; index < chipData.length; index++) {
        var request = new XMLHttpRequest();
        request.open("GET", chipData[index].urls, true);
        request.responseType = "blob";
        console.log("called ", index);
        await covertAndAttach(request, index, chipData[index]);
      }
    }
  };
  return (
    <div className="">
      {/* <div className="home_area w-100 p-0 m-0"> */}
      {homeslider && (
        <div
          className="PopupDiv"
          // onClick={(e) => {
          //   sethomeslider(false);
          // }}
        >
          <div
            className="PopupBody"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="Popup">
              <div className="popupHead">
                <h4>Share Files</h4>
                <IconButton
                  sx={{ color: "white" }}
                  onClick={() => {
                    sethomeslider(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="popupBody">
                <div className="d-flex flex-column justify-content-between my-2">
                  <Autocomplete
                    disableCloseOnSelect
                    style={{ width: "100%" }}
                    size="small"
                    multiple
                    onChange={(event, newVal) => {
                      handeReceiversChange(newVal);
                    }}
                    open={openAutocomplete}
                    onOpen={() => {
                      setOpenAutocomplete(true);
                    }}
                    onClose={() => {
                      setOpenAutocomplete(false);
                    }}
                    id="receiver"
                    options={outlookRecv.map((option) => option.email_address)}
                    freeSolo
                    loading={loading}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        return (
                          <Chip
                            variant="outlined"
                            color="primary"
                            size="small"
                            label={option}
                            {...getTagProps({ index })}
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Receivers"
                        error={isValidRecv}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        helperText={
                          isValidRecv
                            ? "You have entered an invalid email"
                            : null
                        }

                        // placeholder="Emails"
                      />
                    )}
                  />
                  <Autocomplete
                    disableCloseOnSelect
                    style={{ marginTop: "0.5rem", width: "100%" }}
                    size="small"
                    onChange={(event, newVal) => {
                      handleCcChange(newVal);
                    }}
                    multiple
                    open={openAutocompleteCC}
                    onOpen={() => {
                      setOpenAutocompleteCC(true);
                    }}
                    onClose={() => {
                      setOpenAutocompleteCC(false);
                    }}
                    id="CC"
                    options={outlookRecv.map((option) => option.email_address)}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          variant="outlined"
                          color="secondary"
                          size="small"
                          label={option}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="CC"
                        error={isValidCC}
                        loading={loadingCC}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingCC ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        helperText={
                          isValidCC ? "You have entered an invalid email" : null
                        }

                        // placeholder="Emails"
                      />
                    )}
                  />
                </div>

                <div className="d-flex justify-content-between my-2">
                  <TextField
                    id="outlined-basic"
                    label="Subject"
                    size="small"
                    variant="outlined"
                    style={{ width: "100%" }}
                    onChange={(event) => {
                      setSubject(event.target.value);
                    }}
                  />
                </div>

                <div className="my-2">
                  <TextField
                    size="small"
                    id="BodyText"
                    label="Body"
                    multiline
                    onChange={(event) => {
                      setBody(event.target.value);
                    }}
                    rows={6}
                    style={{
                      width: "100%",
                    }}
                  />
                  {chipData.length > 0 ? (
                    <Paper
                      elevation={3}
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        listStyle: "none",
                        p: 0.5,
                        m: 0,

                        mt: "0.5rem",
                      }}
                      component="ul"
                    >
                      {chipData.map((data, i) => {
                        documentSize += parseInt(data.document_size);

                        return (
                          <ListItem key={i}>
                            <Chip
                              variant="outlined"
                              size="small"
                              color="primary"
                              // deleteIcon={<Cancel sx={{ color: "blue" }} />}
                              label={
                                data.document_name +
                                " " +
                                (data.document_size / 1000000).toFixed(2) +
                                " " +
                                "MB"
                              }
                              onDelete={
                                data.label === "React"
                                  ? undefined
                                  : handleDelete(data.document_name)
                              }
                            />
                          </ListItem>
                        );
                      })}
                      {(documentSize / 1000).toFixed(2) > 25000 ? (
                        <Alert
                          severity="error"
                          size="small"
                          sx={{ width: "100%" }}
                        >
                          File size must be smaller then 25 MB
                          <br />
                          <strong>
                            Uploaded documents Size:{" "}
                            {(documentSize / 1000000).toFixed(3)} MB
                          </strong>
                        </Alert>
                      ) : null}
                      {uploadSucess ? (
                        <Alert
                          severity="success"
                          size="small"
                          sx={{ width: "100%" }}
                        >
                          Files Shared Successfully
                        </Alert>
                      ) : null}
                    </Paper>
                  ) : null}
                </div>
              </div>

              <div>
                <div className="popupFooter">
                  <ButtonStyled
                    border="2px solid var(--blue)"
                    paddingInline=".7rem"
                    paddingBlock="0.2rem"
                    borderRadius="8px"
                    width="20%"
                    color="var(--blue)"
                    style={{ cursor: "pointer", fontWeight: "bolder" }}
                    className="mx-1"
                    onClick={(e) => {
                      sethomeslider(false);
                    }}
                  >
                    Cancel
                  </ButtonStyled>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleShare}
                    sx={{
                      borderRadius: "8px",
                      color: "var(--blue)",
                      fontWeight: "bolder",
                      borderWidth: "2px",
                    }}
                    disabled={
                      isValidCC ||
                      isValidRecv ||
                      receivers.length === 0 ||
                      (documentSize / 1000).toFixed(2) > 25000
                        ? true
                        : false
                    }
                    endIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                  >
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const accounts = [
  { title: "syedharoon544@gmail.com" },
  { title: "f179436@nu.edu.pk" },
  { title: "batch16.092@gmail.com" },
];

export default PopUp;
