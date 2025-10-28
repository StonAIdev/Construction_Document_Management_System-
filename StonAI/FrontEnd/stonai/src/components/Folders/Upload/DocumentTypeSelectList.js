import React, { useEffect, useState } from "react";

import ListItem from "@mui/material/ListItem";
import axios from "axios";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";

import ClearIcon from "@mui/icons-material/Clear";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { url } from "../../../url";
import ToggleButton from "react-toggle-button";
import { makeStyles } from "@mui/styles";
import ToggleSwitch from "./Switch/ToggleSwitch";
import { getOtherCategoryNames } from "../../OtherCategory";

import {
  Button,
  Checkbox,
  ListItemIcon,
  Typography,
  Tooltip,
  Autocomplete,
  TextField,
  CircularProgress,
  Chip,
  Switch,
} from "@mui/material";
import Divider from "@mui/material/Divider";
// import { Label } from "./label";
import Toggle from "@atlaskit/toggle";

const useStyles = makeStyles({
  root: {
    width: "50px",
    height: "24px",
    padding: "0px",
  },
  switchBase: {
    color: "#818181",
    padding: "1px",
    "&$checked": {
      "& + $track": {
        backgroundColor: "#23bf58",
      },
    },
  },
  thumb: {
    color: "white",
    width: "20px",
    height: "20px",
    margin: "1px",
  },
  track: {
    borderRadius: "20px",
    backgroundColor: "#818181",
    opacity: "1 !important",
    "&:after, &:before": {
      color: "white",
      fontSize: "11px",
      position: "absolute",
      top: "6px",
    },
    "&:after": {
      content: "'On'",
      left: "8px",
    },
    "&:before": {
      content: "'Off'",
      right: "7px",
    },
  },
  checked: {
    color: "#23bf58 !important",
    transform: "translateX(26px) !important",
  },
});
// function renderOption(node, depth = 0) {
//   if (!node) {
//     return null;
//   }

//   return (
//     <div
//       {...props}
//       style={
//         depth === 0
//           ? {
//               fontWeight: "bold",
//               borderTop: "1px solid black",
//               paddingLeft: "10px",
//             }
//           : depth === 1
//           ? { marginLeft: "20px", borderLeft: "1px solid black" }
//           : depth === 2
//           ? { marginLeft: "30px", borderLeft: "1px solid black" }
//           : depth === 3
//           ? { marginLeft: "40px", borderLeft: "1px solid black" }
//           : {}
//       }
//       onClick={() => {
//         if (depth >= 1) {
//           setOpenItems((prevState) => ({
//             ...prevState,
//             [node.id]: !prevState[node.id],
//           }));
//         }
//       }}
//     >
//       {"\u00A0".repeat(depth) + option.item}
//       {depth >= 1 && <button>{openItems[node.id] ? "-" : "+"}</button>}
//       {depth >= 1 &&
//         openItems[node.id] &&
//         node.children &&
//         node.children.map((child) => renderOption(child, depth + 1))}
//     </div>
//   );
// }

export default function InteractiveList({
  fileName,
  icon,
  docCategory,
  docCategorySingle,
  handleChange,
  title,
  checkedGlobal,
  index,
  handleGlobalCheckChange,
  checked,
  handleSingleCheckToggle,
  handleSingledocCategoryChange,
  handleDelete,
  handleNext,
  handleBack,
  subContractor,
  handlesubContractorChange,
  subContractorSingle,
  handlesubContractorSingleChange,
  setIsAllowed,
  isAllowed,
  subcontractorfromdb,
  project_id,
  user,
  handleDeleteSubcontractor,
  isOut,
  handleToogleOut,
  otherDocumentCategory,
  onChangeHandlerOtherDocCat,
  height,
  tree,
}) {
  const [open, setOpen] = React.useState(false);
  const [openOtherCat, setOpenOtherCat] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [otherCats, setOtherCats] = React.useState([]);
  const [Level, setLevel] = React.useState(0);
  const loading = open && options.length === 0;
  const loadingCat = openOtherCat && otherCats.length === 0;
  const [selectedNode, setSelectedNode] = useState(null);
  const [openItems, setOpenItems] = useState({});

  const classes = useStyles();
  let [newsletter, setNewsletter] = useState(false);
  let [daily, setDaily] = useState(false);
  let [weekly, setWeekly] = useState(false);
  let [monthly, setMonthly] = useState(false);

  const isSubmittalDoc = (document_category) => {
    // if (submittalList.includes(document_category)) {
    //   console.log("isSubmittalDoc", submittalList.includes(document_category), index, document_category);
    //   handlesubContractorSingleChange("VAMED", index);
    //   // handleDeleteSubcontractor(index);
    // }
    return submittalList.includes(document_category);
  };
  const isOtherDoc = (document_category) => {
    if (document_category === "Other") {
      return true;
    } else {
      return false;
    }
  };
  const getSubcontractor = async () => {
    console.log("getSubcontractor", project_id, user);
    try {
      const res = await axios.post(
        url + "/Project/getSubcontractors",
        {
          project_id: project_id,
        },
        {
          headers: { token: user.token },
        }
      );
      console.log("getSubcontractorRes", res.data);
      setOptions(res.data);

      return res.data;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  React.useEffect(() => {
    let active = true;
    console.log("tree at list component", tree);
    console.log("subContractor", subContractor);
    console.log(selectedNode, "selectedNode");
    console.log("selected node doc category", docCategorySingle);
    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res = getSubcontractor();
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, selectedNode]);

  React.useEffect(() => {
    let active = true;

    if (!loadingCat) {
      return undefined;
    }

    (async () => {
      if (active) {
        const res = getOtherCategoryNames(
          project_id,
          subContractorSingle[index],
          user,
          setOtherCats
        );
      }
    })();

    return () => {
      active = false;
    };
  }, [loadingCat]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  console.log("is allowd", isAllowed);
  const labelId = index;
  console.log("mnsvonsoivndsoi", index, isOut);

  useEffect(() => {}, [fileName]);
  // const flattenTree = (nodes, depth = 0) => {
  //   let flatNodes = [];
  //   flatNodes.push({ ...nodes, depth });
  //   if (nodes.children && nodes.children.length > 0) {
  //     flatNodes = flatNodes.concat(flattenTree(nodes.children, depth + 1));
  //   }
  //   return flatNodes;
  // };

  // const flattenTree = (nodes) => {
  //   let flatNodes = [];
  //   nodes?.forEach((node) => {
  //     flatNodes.push({ ...node, parent: "" });
  //     if (node.children && node.children.length > 0) {
  //       flatNodes = flatNodes.concat(flattenTree(node.children));
  //     }
  //   });
  //   return flatNodes;
  // };
  // const flatOptions = flattenTree(tree);

  // const groupedOptions = flatOptions.reduce((groups, option) => {
  //   const key = option.parent || "root";
  //   groups[key] = groups[key] || [];
  //   groups[key].push(option.name);
  //   return groups;
  // }, {});
  function transformTree(nodes) {
    return nodes?.map((node) => ({
      title: node.name,
      children: node.children ? transformTree(node.children) : undefined,
    }));
  }

  // const transformedTree = transformTree(tree);

  function traverse(node, depth, result) {
    if (!node) {
      return;
    }

    result.push({
      depth: depth,
      item: node.name,
    });

    if (node.children && node.children.length > 0) {
      for (let i = 0; i < node.children.length; i++) {
        traverse(node.children[i], depth + 1, result);
      }
    }
  }

  let result = [];
  for (let i = 0; i < tree?.length; i++) {
    traverse(tree[i], 0, result);
  }
  console.log(result, "result of tree");

  // result.map((item, index) => (
  //   <div
  //     key={index}
  //     style={
  //       item.depth === 0
  //         ? { fontWeight: "bold", borderTop: "1px solid black" }
  //         : {}
  //     }
  //     onClick={() => setSelectedNode(item)}
  //   >
  //     {"\u00A0".repeat(item.depth) + item.item}
  //   </div>
  // ));

  // const filterTree = (nodes, selectedNode) => {
  //   console.log(JSON.stringify(nodes), "asda");

  //   if (!selectedNode) {
  //     return nodes?.map((node) => node);
  //   }
  //   let filteredNodes = [];
  //   nodes?.forEach((node) => {
  //     if (node === selectedNode) {
  //       filteredNodes.push(...node.children.map((child) => child.name));
  //     }
  //     if (node.children) {
  //       filteredNodes = filteredNodes.concat(
  //         filterTree(node.children, selectedNode)
  //       );
  //     }
  //   });
  //   return filteredNodes;
  // };

  // const flatOptions = flattenTree(filterTree(tree, selectedNode)).map(
  //   (node) => {
  //     return node.name;
  //   }
  // );
  // console.log(flatOptions, "flat options");
  // const flatOptions = flattenTree(filterTree(tree, Level)).map(
  //   (node) => node.name
  // );

  return (
    <Grid container>
      {title !== "global" ? (
        <ListItem
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              set
              onClick={() => handleDelete(index)}
            >
              <ClearIcon sx={{ borderRadius: 5, color: "#B72020" }} />
            </IconButton>
          }
          sx={{ backgroundColor: "background.paper", marginBottom: 1 }}
        >
          <Grid item xs={0.5}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(index) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
                size="small"
                onClick={() => handleSingleCheckToggle(index)}
              />
            </ListItemIcon>
          </Grid>
          <Grid item xs={0.5}>
            <FontAwesomeIcon icon={icon} />
          </Grid>
          <Grid item xs={4}>
            <Tooltip title={fileName}>
              <Typography variant="caption" sx={{ mr: 1 }}>
                {fileName.length > 31 ? (
                  <>{fileName.slice(0, 31) + "..."} </>
                ) : (
                  <>{fileName} </>
                )}{" "}
              </Typography>
            </Tooltip>
          </Grid>
          <Tooltip
            title={isAllowed[index] ? "Disable Analyze" : "Enable Analyze"}
          >
            <Grid item xs>
              <>
                <InputLabel
                  id="toggle-tooltip"
                  sx={{ fontSize: 10, paddingBottom: "5px" }}
                  size="small"
                >
                  Analyze ..
                </InputLabel>

                <Toggle
                  id="toggle-tooltip"
                  isChecked={isAllowed[index]}
                  onChange={() => setIsAllowed(isAllowed[index], index)}
                />
              </>
            </Grid>
          </Tooltip>

          <Grid item xs={3}>
            {/* <Autocomplete
              id="size-small-standard"
              size="small"
              disableClearable
              options={documentCats}
              onChange={(event, value) =>
                handleSingledocCategoryChange(value, index, height )
              }
              value={docCategorySingle[index]}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Document Type"
                />
              )}
            /> */}
            <Autocomplete
              id="size-small-standard"
              size="small"
              options={result}
              disableClearable
              getOptionLabel={(option) => option.item}
              getOptionSelected={(option, value) => option.item === value.item}
              // onChange={(event, value) => {
              //   handleSingledocCategoryChange(value, index, height);
              //   setSelectedNode(value);
              // }}
              onChange={(event, value) => {
                handleSingledocCategoryChange(value.item, index, value.depth);
                setSelectedNode(value.item);
              }}
              // value={selectedNode}
              renderOption={(props, option) => (
                <div
                  {...props}
                  style={
                    option.depth === 0
                      ? {
                          fontWeight: "bold",
                          borderTop: "1px solid black",
                          paddingLeft: "10px",
                        }
                      : option.depth === 1
                      ? {
                          marginLeft: "20px",
                          paddingLeft: "0px",
                          // borderTop: "1px dotted black",
                          // borderLeft: "1px solid black",
                        }
                      : option.depth === 2
                      ? {
                          marginLeft: "20px",

                          // borderLeft: "1px solid black"
                        }
                      : option.depth === 3
                      ? {
                          marginLeft: "20px",
                          // borderLeft: "1px solid black"
                        }
                      : {}
                  }
                >
                  {option.depth === 2
                    ? ". . ."
                    : option.depth === 3
                    ? ". . . . . ."
                    : ""}
                  {"\u00A0".repeat(option.depth) + option.item}
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Document Type"
                />
              )}
            />
          </Grid>
          <Grid item xs={2.5}>
            {!isSubmittalDoc(docCategorySingle[index]) ? (
              // !isSubmittalDoc(selectedNode)
              <>
                <Autocomplete
                  id="asynchronous-demo"
                  size="small"
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  onChange={(event, newVal) => {
                    if (newVal) {
                      handlesubContractorSingleChange(newVal, index);
                    } else {
                      handlesubContractorSingleChange("", index);
                    }
                  }}
                  value={subContractorSingle[index]}
                  freeSolo
                  // isOptionEqualToValue={(option, value) => option.name === value.name}
                  options={options.map((option) => option.name)}
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
                      label="Subcontractors"
                      variant="standard"
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
                {isOtherDoc(docCategorySingle[index]) ? (
                  // isOtherDoc(selectedNode)
                  <Autocomplete
                    id="asynchronous-demo"
                    size="small"
                    freeSolo
                    // isOptionEqualToValue={(option, value) => option.name === value.name}
                    options={otherCats}
                    onChange={(e, value) => {
                      onChangeHandlerOtherDocCat(value, index);
                    }}
                    value={otherDocumentCategory[index]}
                    open={openOtherCat}
                    onOpen={() => {
                      setOtherCats([]);
                      setOpenOtherCat(true);
                    }}
                    onClose={() => {
                      setOpenOtherCat(false);
                    }}
                    loading={loadingCat}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Other Type"
                        variant="standard"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingCat ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        onChange={(e, value) => {
                          onChangeHandlerOtherDocCat(value, index);
                        }}
                      />
                    )}
                  />
                ) : null}
              </>
            ) : (
              <Grid item xs sx={{ textAlign: "right", marginTop: 2 }}>
                {/* <ToggleButton
                    id="toggle-tooltip"
                    // isChecked={isOut[index]}
                    label="Allow pull request"
                  // onChange={() => handleToogleOut(isOut[index], index)}
                  />   */}
                <ToggleSwitch
                  id="newsletter"
                  ID={index}
                  checked={isOut[index]}
                  onChange={(checked) => {
                    console.log("check toggle", index, checked);
                    handleToogleOut(checked, index);
                  }}
                  toogleValue={isOut[index]}
                />
              </Grid>
            )}
          </Grid>
        </ListItem>
      ) : (
        <ListItem>
          <Grid item xs={6.05} sx={{ marginLeft: 1.2 }}>
            <ListItemIcon>
              <FormControlLabel
                label={<Typography variant="caption">Select All</Typography>}
                control={
                  <Checkbox
                    edge="start"
                    // checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    size="small"
                    checked={checkedGlobal}
                    disableRipple
                    onClick={handleGlobalCheckChange}

                    // inputProps={{ "aria-labelledby": labelId }}
                  />
                }
              />
            </ListItemIcon>
          </Grid>

          <Grid item xs={3}>
            <Autocomplete
              id="size-small-standard"
              size="small"
              options={documentCats}
              disableClearable
              // onChange={handleChange}
              onChange={(event, value) => handleChange(event, value)}
              value={docCategory}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Document Type"
                />
              )}
            />
          </Grid>
          {!isSubmittalDoc(docCategorySingle[index]) ? (
            // !isSubmittalDoc(selectedNode)
            <Grid item xs={2.5}>
              <FormControl
                variant="standard"
                se
                sx={{
                  minWidth: 120,
                  position: "realtive",
                  marginLeft: "10px",
                }}
              >
                <InputLabel
                  id="demo-simple-select-standard-label1"
                  sx={{ fontSize: 16 }}
                  size="small"
                >
                  Sub-Contractor
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label1"
                  id="demo-simple-select-standard1"
                  value={subContractor}
                  onChange={(event) => {
                    handlesubContractorChange(event);
                  }}
                  label="Sub-Contractor"
                  size="small"
                  //   variant="standard"
                  sx={{ fontSize: 16 }}
                >
                  {subcontractorfromdb.map((sub) => (
                    <MenuItem value={sub.name}>{sub.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ) : null}
        </ListItem>
      )}
    </Grid>
  );
}
const documentCats = [
  "Shop Drawing Submittals",

  "Material Submittals",

  "Site Instruction",

  "Technical Submittal",

  "Method Statement Submittal",

  "Non Conformance Report",

  "Prequalification Submittal",

  "Request for Information",

  "Work Inspection Request",

  "Meterial Inspection Request",

  "Architectural Inspection Request",

  "Responsibility Matrix",

  "Tender Addendums",

  "Text Contract",

  "Scanned Contract",

  "BOQ",

  "MOM",

  "Other",
];

const submittalList = [
  "Material Submittals",
  "Shop Drawing Submittals",
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
