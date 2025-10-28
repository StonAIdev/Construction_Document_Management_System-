import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../../url";
import {
  Drawer,
  IconButton,
  Typography,
  TextField,
  Divider,
  Select,
  Box,
  InputLabel,
  FormControl,
  MenuItem,
  Chip,
  Autocomplete,
  Grid,
  CircularProgress,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import TableCardChips from "../../../components/search/Contracts/TableCardChips";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFont,
  faBars,
  faBuilding,
  faComments,
  faCopy,
  faFileAlt,
  faFilter,
  faHashtag,
  faPaperPlane,
  faSearch,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import globalVars from "../../../globals";
import BookIcon from "@mui/icons-material/Book";
import ParagraphCardEmail from "../../../components/search/Contracts/ParagraphCardEmail";
import Heading1 from "../../../Reusable Components/Headings/Heading1";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ButtonStyled from "../../../Reusable Components/Buttons/ButtonStyled";

import { styled, alpha, useTheme } from "@mui/material/styles";

const drawerWidth = 550;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));
const AiSearchDrawer = ({
  user,
  project,
  openDrawer,
  handleDrawerClose,
  selectedText,
  setSelectedText,
}) => {
  const [contextMenu, setContextMenu] = useState(null);
  const [searchType, setSearchType] = useState("Contracts");

  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [tenderResult, setTenderResult] = useState([]);
  const [contractResult, setContractResult] = useState([]);
  const [contractTableResult, setContractTableResult] = useState([]);
  const [boqResult, setBoqResult] = useState([]);
  const [momResult, setMomResult] = useState([]);
  let [body, setBody] = useState("");

  const [openAuto, setOpenAuto] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = openAuto && options.length === 0;
  const [subContractor, setSubcontractorType] = useState("");

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res = await getSubcontractor();

        setOptions(res);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!openAuto) {
      setOptions([]);
    }
  }, [openAuto]);

  const getSubcontractor = async () => {
    try {
      const res = await axios.post(
        url + "/Project/getSubcontractors",
        {
          project_id: project.project_id,
        },
        {
          headers: { token: user.token },
        }
      );

      return res.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    globalVars.searchRef = [];
  }, []);

  const handleSearchTypeFilter = (event) => {
    setSearchType(event.target.value);
  };

  // **********************************************************************
  var view = <></>;
  var contractCheck = <></>;
  if (searchType == "Contracts") {
    view = (
      <>
        <div className="px-2">
          <div className="d-flex flex-column w-100" style={{ rowGap: "20px" }}>
            <IconButton style={{ width: "fit-content", marginLeft: "auto" }}>
              <BookIcon />
            </IconButton>
            {contractResult?.answers !== undefined ? (
              contractResult?.answers.map((para, i) => {
                return <ParagraphCardEmail para={para} />;
              })
            ) : (
              <></>
            )}

            <Heading1
              color="var(--blue)"
              paddingInline="10px"
              paddingBlock=""
              size="1.5rem"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
              style={{ marginBlock: "0px" }}
            >
              Details
            </Heading1>

            <div className="d-flex flex-column w-100" style={{ gap: "20px" }}>
              {contractResult?.context?.map((para, i) => {
                if (para.Heading)
                  return (
                    <div className="AnsDetailscard">
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div
                          className="d-flex flex-column"
                          style={{ rowGap: "5px" }}
                        >
                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="1rem"
                            weight="500"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              style={{
                                color: "var(--green)",
                                marginRight: "8px",
                              }}
                            />
                            {para.name}
                          </Heading1>

                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="1rem"
                            weight="500"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faBars}
                              style={{
                                color: "var(--blue)",
                                marginRight: "8px",
                              }}
                            />
                            {para.Heading}
                          </Heading1>

                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="1rem"
                            weight="400"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faFont}
                              style={{
                                color: "var(--orange)",
                                marginRight: "8px",
                              }}
                            />
                            {para.Text}
                          </Heading1>
                        </div>
                        <div>
                          <Tooltip title="Add as refrence to email">
                            <IconButton
                              onClick={() => {
                                let temp = body;
                                setBody(() => {
                                  return `${temp}\n\nDocument Name: ${para["name"]} \nHeading: ${para["Heading"]}\nText: ${para["Text"]}\n\n`;
                                });
                              }}
                            >
                              <BookIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  );
                else
                  return (
                    <div className=" TableCard">
                      <div className="d-flex align-items-center w-100 justify-content-between">
                        <div
                          className="d-flex flex-column"
                          style={{ rowGap: "5px" }}
                        >
                          <Heading1
                            color="grey"
                            paddingBlock=""
                            size="1.08rem"
                            weight="520"
                            JFcontent="left"
                            marginBottom="0px"
                          >
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              style={{
                                color: "var(--green)",
                                marginRight: "8px",
                              }}
                            />
                            {para.name}
                          </Heading1>
                        </div>
                        <div>
                          <Tooltip title="Add as refrence to email">
                            <IconButton
                              onClick={() => {
                                var rowText = [];
                                {
                                  para.Columns.map((attribute) => {
                                    rowText += `${attribute}: ${para[attribute]}\n`;
                                  });
                                }
                                let temp = body;
                                setBody(() => {
                                  return `${temp}\n\n${rowText}\n\n`;
                                });
                              }}
                            >
                              <BookIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </div>

                      <div
                        className="d-flex flex-wrap w-100"
                        style={{
                          columnGap: "10px",
                          rowGap: "10px",
                          marginTop: ".5em",
                        }}
                      >
                        {para.Columns.map((attribute) => {
                          return (
                            <TableCardChips row={para} attribute={attribute} />
                          );
                        })}
                      </div>
                    </div>
                  );
              })}
            </div>
          </div>

          {/* {tableCheck ? (
              <div
                className="d-flex flex-column w-100"
                style={{
                  columnGap: "10px",
                  rowGap: "20px",
                  marginTop: "1.5em",
                }}
              >
                {contractTableResult.map((row, i) => (
                  <div className=' TableCard'>
  
                    <div className='d-flex align-items-center w-100 justify-content-between'>
                      <div className='d-flex flex-column' style={{ rowGap: "5px" }}>
                        <Heading1
                          color="grey"
                          paddingBlock=""
                          size="1.08rem"
                          weight="520"
                          JFcontent="left"
                          marginBottom="0px"
                        >
                          <FontAwesomeIcon
                            icon={faFileAlt}
                            style={{ color: "var(--green)", marginRight: "8px" }}
                          />
                          {row.name}
                        </Heading1>
  
  
  
                      </div>
                      <div>
                        <Tooltip title="Add as refrence to email">
                          <IconButton
                            onClick={() => {
                              var rowText = [];
                              {
                                row.Columns.map((attribute) => {
                                  rowText += `${attribute}: ${row[attribute]}\n`;
                                });
                              }
                              let temp = body;
                              setBody(() => {
                                return `${temp}\n\n${rowText}\n\n`;
                              });
                            }}
                          >
                            <BookIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
  
                    <div className='d-flex flex-wrap w-100' style={{ columnGap: "10px", rowGap: "10px", marginTop: ".5em" }}>
                      {row.Columns.map((attribute) => {
                        return (
                          <TableCardChips row={row} attribute={attribute} />
  
                        );
                      })}
  
                    </div>
                  </div>
                ))}
  
              </div>
  
            ) : null} */}
        </div>
      </>
    );
  } else if (searchType == "Responsibility Matrix") {
    view = (
      <>
        {searchResult.map((row, i) => (
          <div className="ResponsibilityCards">
            <div className="d-flex justify-content-between align-items-center">
              <Heading1
                color="var(--warningRed)"
                paddingBlock=""
                size="1rem"
                weight="600"
                JFcontent="left"
                marginBottom="0px"
              >
                <FontAwesomeIcon
                  icon={faHashtag}
                  style={{ color: "var(--warningRed)", marginRight: "8px" }}
                />
                {row["S/N"]}
              </Heading1>

              <Tooltip title="Add as refrence to email">
                <IconButton
                  onClick={() => {
                    let temp = body;
                    setBody(() => {
                      return `${temp}\n\n${body} Refer to S / N: ${row["S/N"]} \nResponsibility: ${row.Responsibility}\nProviders: ${row.Responsible}\n\n`;
                    });
                  }}
                >
                  <BookIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faTasks}
                style={{ color: "var(--green)", marginRight: "8px" }}
              />
              {row.ACTIVITY}
            </Heading1>

            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faComments}
                style={{ color: "var(--blue)", marginRight: "8px" }}
              />
              {row.REMARKS}
            </Heading1>

            <Heading1
              color="var(--orange)"
              paddingBlock=""
              size="1rem"
              weight="600"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faBuilding}
                style={{ color: "var(--orange)", marginRight: "8px" }}
              />
              Responsibilities
            </Heading1>
            <Box sx={{ marginBottom: ".4em", marginTop: ".5em" }}>
              <div
                className=" d-flex flex-wrap"
                style={{ columnGap: "8px", rowGap: "10px" }}
              >
                {row.Responsible.map((responsibilityRow) => (
                  <Chip
                    label={responsibilityRow}
                    key={responsibilityRow}
                    className="chips"
                  />
                ))}
              </div>
            </Box>
          </div>
        ))}
      </>
    );
  } else if (searchType == "Tender Addendums") {
    view = (
      <>
        {tenderResult.map((row, i) => (
          <div className="ResponsibilityCards">
            <div className="d-flex justify-content-between align-items-center">
              <Heading1
                color="var(--warningRed)"
                paddingBlock=""
                size="1rem"
                weight="600"
                JFcontent="left"
                marginBottom="0px"
              >
                <FontAwesomeIcon
                  icon={faHashtag}
                  style={{ color: "var(--warningRed)", marginRight: "8px" }}
                />
                {row["Question"]}
              </Heading1>

              <Tooltip title="Add as refrence to email">
                <IconButton
                  onClick={() => {
                    let temp = body;
                    setBody(() => {
                      return `${temp}\n\nRefer to S/N: ${row["Question"]} \nQuestions: ${row["RFI QUESTION BY BIDDER"]}\nAnswer: ${row["ANSWER BY VAMED"]}\n\n`;
                    });
                  }}
                >
                  <BookIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faTasks}
                style={{ color: "var(--green)", marginRight: "8px" }}
              />
              {row["RFI QUESTION BY BIDDER"]}
            </Heading1>

            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faComments}
                style={{ color: "var(--blue)", marginRight: "8px" }}
              />
              {row["ANSWER BY VAMED"]}
            </Heading1>
          </div>
        ))}
      </>
    );
  } else if (searchType == "MOM") {
    view = (
      <>
        {momResult.map((row, i) => (
          <div className="ResponsibilityCards">
            <div className="d-flex justify-content-between align-items-center">
              <Heading1
                color="var(--warningRed)"
                paddingBlock=""
                size="1rem"
                weight="600"
                JFcontent="left"
                marginBottom="0px"
              >
                <FontAwesomeIcon
                  icon={faHashtag}
                  style={{ color: "var(--warningRed)", marginRight: "8px" }}
                />
                {row["name"]}
              </Heading1>

              <Tooltip title="Add as refrence to email">
                <IconButton
                  onClick={() => {
                    let temp = body;
                    setBody(() => {
                      return `${temp}\n\nDocument Name: ${row["name"]} \nHeading: ${row["Label"]}\nMinutes: ${row["Text"]}\n\n`;
                    });
                  }}
                >
                  <BookIcon />
                </IconButton>
              </Tooltip>
            </div>
            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faTasks}
                style={{ color: "var(--green)", marginRight: "8px" }}
              />
              {row["Label"]}
            </Heading1>

            <Heading1
              color="grey"
              paddingBlock=""
              size="1rem"
              weight="400"
              JFcontent="left"
              marginBottom="0px"
            >
              <FontAwesomeIcon
                icon={faComments}
                style={{ color: "var(--blue)", marginRight: "8px" }}
              />
              {row["Text"]}
            </Heading1>
          </div>
        ))}
      </>
    );
  } else if (searchType == "BOQ") {
    view = (
      <>
        {boqResult.map((row, i) => (
          <div className=" TableCard">
            <div className="d-flex align-items-center w-100 justify-content-between">
              <div className="d-flex flex-column" style={{ rowGap: "5px" }}>
                <Heading1
                  color="grey"
                  paddingBlock=""
                  size="1.08rem"
                  weight="520"
                  JFcontent="left"
                  marginBottom="0px"
                >
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    style={{ color: "var(--green)", marginRight: "8px" }}
                  />
                  {row.name}
                </Heading1>
              </div>
              <div>
                <Tooltip title="Add as refrence to email">
                  <IconButton
                    onClick={() => {
                      var rowText = [];
                      {
                        row.Columns.map((attribute) => {
                          rowText += `${attribute}: ${row[attribute]}\n`;
                        });
                      }
                      let temp = body;
                      setBody(() => {
                        return `${temp}\n\n${rowText}\n\n`;
                      });
                    }}
                  >
                    <BookIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <div
              className="d-flex flex-wrap w-100"
              style={{ columnGap: "10px", rowGap: "10px", marginTop: ".5em" }}
            >
              {row.Columns.map((attribute) => {
                return <TableCardChips row={row} attribute={attribute} />;
              })}
            </div>
          </div>
        ))}
      </>
    );
  }

  const onSubmitSearch = async () => {
    if (selectedText && searchType == "Responsibility Matrix") {
      try {
        setSearchResult(
          await globalVars.responsabilityMatrixSearch(
            selectedText,
            user,
            project
          )
        );
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (selectedText && searchType == "Tender Addendums") {
      try {
        setTenderResult(
          await globalVars.tenderSearch(selectedText, user, project)
        );
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (searchType == "Contracts" && selectedText) {
      try {
        setContractResult(
          await globalVars.contractSearch(
            selectedText,
            user,
            project,
            searchType
          )
        );
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (selectedText && searchType == "BOQ") {
      try {
        setBoqResult(await globalVars.BOQSearch(selectedText, user, project));
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    } else if (selectedText && searchType == "MOM") {
      try {
        setMomResult(await globalVars.MOMSearch(selectedText, user, project));
      } catch (e) {
        console.log("Error in elastic search: ", e);
      }
    }
  };
  const theme = useTheme();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          overflowX: "hidden",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        },
      }}
      variant="persistent"
      anchor="right"
      open={openDrawer}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Typography variant="h3" align="center">
        Intelligent Search
      </Typography>
      <Divider />

      <div className="px-3 py-2 d-flex flex-column mb-4">
        <Grid container sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Document Filter
              </InputLabel>
              <Select
                labelId="Filter"
                id="demo-simple-select-label"
                value={searchType}
                label="Document Filter"
                onChange={handleSearchTypeFilter}
                size="small"
              >
                {searchTypes.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              id="asynchronous-demo"
              sx={{ width: "100%" }}
              open={openAuto}
              onOpen={() => {
                setOpenAuto(true);
              }}
              onClose={() => {
                setOpenAuto(false);
              }}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              onChange={(event, value) => {
                setSubcontractorType(value);
              }}
              getOptionLabel={(option) => option.name}
              options={options}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Contractor filter"
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
                />
              )}
            />
          </Grid>
        </Grid>

        <TextField
          label="Search"
          size="small"
          variant="outlined"
          value={selectedText}
          style={{ width: "100%", margintop: "10px" }}
          onChange={(event) => {
            setSelectedText(event.target.value);
          }}
        />
        <div className="d-flex align-items-center justify-content-between">
          <div>
            {searchType == "Contracts" ? (
              <div
                className="d-flex align-items-center "
                style={{ columnGap: "5px", marginLeft: "5px" }}
              >
                {contractCheck}
              </div>
            ) : null}
          </div>

          <ButtonStyled
            paddingInline=".8rem"
            paddingBlock="0.3rem"
            borderRadius="8px"
            width="fit-content"
            style={{
              alignSelf: "self-end",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={onSubmitSearch}
          >
            Search
          </ButtonStyled>
        </div>
      </div>

      {view}
    </Drawer>
  );
};

const searchTypes = [
  { label: "Contracts", value: "Contracts" },
  { label: "Responsibility Matrix", value: "Responsibility Matrix" },
  { label: "Tender Addendums", value: "Tender Addendums" },
  { label: "BOQ", value: "BOQ" },
  { label: "MOM", value: "MOM" },
];

export default AiSearchDrawer;
