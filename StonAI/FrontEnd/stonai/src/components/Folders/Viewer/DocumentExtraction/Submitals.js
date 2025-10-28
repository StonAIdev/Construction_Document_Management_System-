import React, { useState, useEffect, useRef } from "react";
import "./DocExtraction.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { url } from "../../../../url";

import TextField from "@mui/material/TextField";
import { Box, IconButton } from "@material-ui/core";

import Button from "@mui/material/Button";

import Autocomplete from "@mui/material/Autocomplete";

import { useSnackbar } from "notistack";

import { DateDbANDPicketAddaptor } from "./DateConversions";

import {
  updateHash,
  selectionRawText,
  PreparingRawTextForOptions,
} from "./DocumentExtraction";
//added this
import ConfidenceKey from "./ConfidenceKey";
import { getColorFromConfidence } from "./ConditionalStyling";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const initialValues = {
  key_Values: [],
  Raw_Text: [],
};

function Submitals({
  extractedFeilds,
  setExtractedFeilds,
  user,
  userInfo,
  project,
  update,
}) {
  const [value, setValue] = React.useState(0);
  const [values, setValues] = useState(initialValues);

  // const [text, setText] = useState({ name: "" });

  const { enqueueSnackbar } = useSnackbar();

  const handleClickVariant = (variant, title) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(title, { variant });
  };

  var dragged = useRef();
  var aliases = useRef({
    MAIN_CONTRACTOR: [],
    CLIENT: [],
    CONSULTANT: [],
    SUBCONTRACTOR: [],
    Project: [],
    LOCATION: [],
    Document_title: [],
    DISCIPLINE: [],
    SUBMITTAL_NO: [],
    SUBMITTAL_TITLE: [],
    subcontractorRep: [],
    descOfDrawing: [],
    Revision: [],
    remarks: [],
    statusofDrawing: [],
    ref_Specs_BOQ_Dwg: [],
    DATE_1: [],
  });

  function convertStringToListIfItIsList(input) {
    var listOutput = [];
    if (typeof extractedFeilds?.mapped_field?.[input] === "string") {
      listOutput.push(extractedFeilds?.mapped_field?.[input]);
    } else {
      listOutput = extractedFeilds?.mapped_field?.[input];
    }
    return listOutput;
  }

  const handleSetStates = () => {
    var Raw_Text = PreparingRawTextForOptions(extractedFeilds);
    if (extractedFeilds?.mapped_field) {
      var val;
      if (
        extractedFeilds?.mapped_field?.Revision === "o" ||
        extractedFeilds?.mapped_field?.Revision === "O"
      ) {
        val = "0";
      } else {
        val = extractedFeilds?.mapped_field?.Revision;
      }
      var Comments_Box_LIST = convertStringToListIfItIsList("Comments_Box");
      var Client_Comment_LIST = convertStringToListIfItIsList("Client_Comment");
      var descOfDrawing = convertStringToListIfItIsList("descOfDrawing");
      var convertedDate = DateDbANDPicketAddaptor(
        extractedFeilds?.mapped_field?.DATE_1
      );

      setValues({
        FLOOR: extractedFeilds?.mapped_field?.FLOOR ?? "",
        BLOCK: extractedFeilds?.mapped_field?.BLOCK ?? "",
        ZONE: extractedFeilds?.mapped_field?.ZONE ?? "",
        MAIN_CONTRACTOR: extractedFeilds?.mapped_field?.MAIN_CONTRACTOR ?? "",
        CLIENT: extractedFeilds?.mapped_field?.CLIENT ?? "",
        CONSULTANT: extractedFeilds?.mapped_field?.CONSULTANT ?? "",
        SUBCONTRACTOR: extractedFeilds?.mapped_field?.SUBCONTRACTOR ?? "",
        PROJECT: extractedFeilds?.mapped_field?.PROJECT ?? "",
        LOCATION: extractedFeilds?.mapped_field?.LOCATION ?? "",
        Document_title: extractedFeilds?.mapped_field?.Document_title ?? "",

        Recieved_date: extractedFeilds?.mapped_field?.Recieved_date ?? "",
        SUBMITTAL_NO: extractedFeilds?.mapped_field?.SUBMITTAL_NO ?? "",
        SUBMITTAL_TITLE: extractedFeilds?.mapped_field?.SUBMITTAL_TITLE ?? "",
        subcontractorRep: extractedFeilds?.mapped_field?.subcontractorRep ?? "",
        descOfDrawing: descOfDrawing ?? [],
        Revision: val ?? null,
        statusofDrawing: extractedFeilds?.mapped_field?.statusofDrawing ?? "",
        ref_Specs_BOQ_Dwg:
          extractedFeilds?.mapped_field?.ref_Specs_BOQ_Dwg ?? "",

        DATE_1: convertedDate ?? "",
        Comments_Box: Comments_Box_LIST ?? [],
        Client_Comment: Client_Comment_LIST ?? [],
        Raw_Text: Raw_Text,
        //Added this
        Confidences:
          extractedFeilds?.mapped_field?.Confidences ??
          extractedFeilds?.mapped_field_Conf,
      });
    }
  };
  const handleChange1 = (e, key) => {
    var result = [...extractedFeilds?.unMapped_field?.Key_Values]; //<- copy roomRent into result
    result = result.map((x) => {
      //<- use map on result to find element to update using id
      if (x.key === key) x.value = e.target.value;
      return x;
    });
    setExtractedFeilds(result);

    // setRoomRent(result); //<- update roomRent with value edited
  };

  const getAliases = async (doc_cat) => {
    try {
      const response2 = await axios.post(
        url + "/Document/getAliases",
        { user, project, doc_cat },
        { headers: { token: user.token } }
      );

      const data = response2.data;

      aliases.current = {
        MAIN_CONTRACTOR: [],
        CLIENT: [],
        CONSULTANT: [],
        SUBCONTRACTOR: [],
        Project: [],
        LOCATION: [],
        Document_title: [],
        DISCIPLINE: [],
        Submittal_no: [],
        Submittal_Title: [],
        subcontractorRep: [],
        descOfMaterial: [],
        Revision: [],
        copies: [],
        locationOfUse: [],
        ref_Specs_BOQ_Dwg: [],
        DATE_1: [],
      };

      data.forEach((element) => {
        aliases.current[element.feild].push(element.element);
      });

      return response2.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };

  //==========================useEffect=======================================
  useEffect(() => {
    if (extractedFeilds?.project_id !== undefined) {
      handleSetStates();
    }
    const doc_cat = extractedFeilds.document_category;
    getAliases(doc_cat);

    return function cleanup() {
      setValues(initialValues);
    };
  }, [extractedFeilds]);

  useEffect(() => {}, [values]);

  //============================ handleFunctions ============================

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const onSubmit = async () => {
    const { document_id } = extractedFeilds;
    var convertedDate = DateDbANDPicketAddaptor(values?.DATE_1);
    var convertRecieved_date = DateDbANDPicketAddaptor(values?.Recieved_date);

    try {
      const response = await axios.post(
        url + "/Document/updateDocument",
        { user, values, document_id },
        { headers: { token: user.token } }
      );
      handleClickVariant(
        "Success",
        "Extracted fields have been successfully updated"
      );
      setExtractedFeilds({
        ...extractedFeilds,
        unmapped_field: {
          FLOOR: values?.FLOOR ?? "",
          BLOCK: values?.BLOCK ?? "",
          ZONE: values?.ZONE ?? "",
          MAIN_CONTRACTOR: values?.MAIN_CONTRACTOR ?? "",
          CLIENT: values?.CLIENT ?? "",
          CONSULTANT: values?.CONSULTANT ?? "",
          SUBCONTRACTOR: values?.SUBCONTRACTOR ?? "",
          PROJECT: values?.PROJECT ?? "",
          LOCATION: values?.LOCATION ?? "",
          Document_title: values?.Document_title ?? "",
          DISCIPLINE: values?.DISCIPLINE ?? "",
          SUBMITTAL_NO: values?.SUBMITTAL_NO ?? "",
          SUBMITTAL_TITLE: values?.SUBMITTAL_TITLE ?? "",
          subcontractorRep: values?.subcontractorRep ?? "",
          descOfDrawing: values?.descOfDrawing ?? [],
          Revision: values?.Revision ?? 0,
          statusofDrawing: values?.statusofDrawing ?? "",
          ref_Specs_BOQ_Dwg: values?.ref_Specs_BOQ_Dwg ?? "",
          STATUS: values?.STATUS ?? "",
          DATE_1: convertedDate ?? "",
          Recieved_date: convertRecieved_date ?? "",
          Comments_Box: values?.Comments_Box ?? [],
          Client_Comment: values?.Client_Comment ?? [],
          Raw_Text: values?.Raw_Text ?? [],
          //Added this
          Confidences: values?.Confidences ?? {},
        },
      });
      const alia = aliases.current;
      var arr = [];
      for (const prop in alia) {
        for (const elem in alia[prop]) {
          arr.push([
            userInfo.enterprise_id,
            project.project_id,
            user.user_id,
            prop,
            alia[prop][elem],
            extractedFeilds.document_category,
          ]);
        }
      }
      return response.data;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  };
  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };

  //============================  ============================

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <div className="w-100 d-flex justify-content-end">
          <Button
            style={{
              marginBottom: "-3em",
              paddingBlock: "-2px",
              paddingInline: "2px",
              zIndex: 10,
            }}
            variant="contained"
            onClick={onSubmit}
            disabled={update ? false : true}
          >
            Submit
          </Button>
        </div>

        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Extracted" {...a11yProps(0)} />
          <Tab label="Mapping" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <ConfidenceKey />
        <div className=" mb-3">
          <Typography
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--blue)",
            }}
          >
            Submittal Details{" "}
          </Typography>
        </div>
        <div>
          {Object.keys(extractedFeilds?.unMapped_field?.Key_Values).map(
            (key, i) => {
              if (
                extractedFeilds?.unMapped_field?.Key_Values[key][0] !==
                ":selected:"
              ) {
                if (
                  extractedFeilds?.unMapped_field?.Key_Values[key][0] !==
                  ":unselected:"
                ) {
                  return (
                    <Autocomplete
                      sx={{
                        root: {
                          "& .Mui-error": {
                            color: "orange",
                          },
                          "& .MuiFormHelperText-root": {
                            color: "orange",
                          },
                        },
                      }}
                      freeSolo
                      options={values.Raw_Text}
                      error={
                        !extractedFeilds?.unMapped_field?.Key_Values[key].length
                      }
                      className="DocExtractionTextField"
                      multiline
                      minRows="1"
                      onChange={(e) => {
                        // selectionRawText(event, newValue, setValues, values);
                        handleChange1(e, key);
                      }}
                      onHighlightChange={(event, newValue) => {
                        if (newValue?.id != null) {
                          updateHash(newValue.id);
                        }
                      }}
                      value={extractedFeilds?.unMapped_field?.Key_Values[key]}
                      renderInput={(params) => (
                        <div className="d-flex">
                          <div
                            className="SubmittalColor"
                            style={{
                              background: `${getColorFromConfidence(
                                values?.Confidences?.SUBMITTAL_NO
                              )}`,
                            }}
                          ></div>
                          <TextField
                            {...params}
                            error={
                              !extractedFeilds?.unMapped_field?.Key_Values[key]
                                .length
                            }
                            // helperText={
                            //   <Typography style={{ fontSize: "10px" }}>
                            //     {!values?.SUBMITTAL_NO?.length
                            //       ? "You need to fill this feild"
                            //       : ""}
                            //   </Typography>
                            // }
                            value={
                              extractedFeilds?.unMapped_field?.Key_Values[key]
                            }
                            size="small"
                            onChange={onChangeHandler}
                            id={key}
                            name={key}
                            label={key}
                          />
                        </div>
                      )}
                    />
                  );
                } else return <></>;
              } else return <></>;
            }
          )}
        </div>
      </TabPanel>
    </Box>
  );
}

export default Submitals;
