import React, { useState, useEffect, useRef } from "react";
import "./DocExtraction.css";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import axios from "axios";
import { url } from "../../../../url";
import Chip from "@mui/material/Chip";
// import AccordionDetails from "@mui/material/AccordionDetails";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { Box, IconButton } from "@material-ui/core";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import Heading1 from "../../../../Reusable Components/Headings/Heading1";
import Autocomplete from "@mui/material/Autocomplete";
// import { getAlertUtilityClass } from "@mui/material";
import { useSnackbar } from "notistack";
// import { reverse, set } from "lodash";
// import { date } from "yup";
// import { DateDbANDPicketAddaptor } from "./DateConversions";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  updateHash,
  selectionRawText,
  // multipleSelectionRawText,
  PreparingRawTextForOptions,
} from "./DocumentExtraction";
//added this
import ConfidenceKey from "./ConfidenceKey";
// import { getColorFromConfidence } from "./ConditionalStyling";

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
  Recieved_date: "",
  FLOOR: "",
  BLOCK: "",
  ZONE: "",
  MAIN_CONTRACTOR: "",
  CLIENT: "",
  CONSULTANT: "",
  SUBCONTRACTOR: "",
  PROJECT: "",
  LOCATION: "",
  Document_title: "",
  DISCIPLINE: "",
  SUBMITTAL_NO: "",
  SUBMITTAL_TITLE: "",
  subcontractorRep: "",
  descOfDrawing: [],
  Revision: null,
  statusofDrawing: "",
  ref_Specs_BOQ_Dwg: "",
  STATUS: "",
  Comments_Box: [],
  Client_Comment: [],
  DATE_1: "",
  Raw_Text: [],
};
const allStatus = [
  "A-Approved",
  "B-Approved as noted",
  "C-Revise & resubmit",
  "D-Rejected",
];
// const allDiscipline = [
//   "Administration",
//   "Architectural",
//   "Civil",
//   "Commercial",
//   "Electrical",
//   "Environmental",
//   "Fire",
//   "Geotechnical",
//   "Health and Safety",
//   "HVAC",
//   "Hydraulics",
//   "Internal Fit out",
//   "Landscape",
//   "Mechanical",
//   "Project Management",
//   "Structural",
//   "Sustainability",
//   "Traffic",
//   "Vertical Transportation",
// ];
// const err = "You need to add this feild";
// const notErr = "";
// const initialErrors = {
//   Recieved_date: err,
//   FLOOR: err,
//   BLOCK: err,
//   ZONE: err,
//   MAIN_CONTRACTOR: err,
//   CLIENT: err,
//   CONSULTANT: err,
//   SUBCONTRACTOR: err,
//   Project: err,
//   LOCATION: err,
//   Document_title: err,
//   DISCIPLINE: err,
//   Submittal_no: err,
//   Submittal_Title: err,
//   subcontractorRep: err,
//   descOfMaterial: err,
//   Revision: err,
//   copies: err,
//   locationOfUse: err,
//   Comments_Box: err,
//   Client_Comment: err,
//   ref_Specs_BOQ_Dwg: err,
// };
// const intitalAliases = {
//   Recieved_date: [],
//   FLOOR: [],
//   BLOCK: [],
//   ZONE: [],
//   MAIN_CONTRACTOR: [],
//   CLIENT: [],
//   CONSULTANT: [],
//   SUBCONTRACTOR: [],
//   Project: [],
//   LOCATION: [],
//   Document_title: [],
//   DISCIPLINE: [],
//   SUBMITTAL_NO: [],
//   SUBMITTAL_TITLE: [],
//   subcontractorRep: [],
//   descOfDrawing: [],
//   Revision: [],
//   remarks: [],
//   statusofDrawing: [],
//   ref_Specs_BOQ_Dwg: [],
//   status: [],
//   date: [],
// };
const id = "1";
function ShopDrawingSubmitals({
  extractedFeilds,
  setExtractedFeilds,
  user,
  userInfo,
  project,
  update,
}) {
  const [editMode, setEditMode] = useState({
    Comments_Box: false,
    Client_Comment: false,
    descOfDrawing: false,
    DESCRIPTION: false,
    SEQUENCE_OF_WORK: false,
  });
  const [editBox, setEditBox] = useState({
    Comments_Box: "",
    Client_Comment: "",
    descOfDrawing: "",
    DESCRIPTION: "",
    SEQUENCE_OF_WORK: "",
  });
  const [checkedValues, setCheckedValues] = React.useState({}); // State to store checked values
  const [isMapButtonDisabled, setIsMapButtonDisabled] = React.useState(true);
  // const [ExtDate, setExtDate] = React.useState(new Date("2014-08-18T21:11:54"));
  const [value, setValue] = React.useState(0);
  const [values, setValues] = useState({});
  // const [errors, setErrors] = useState(initialErrors);
  // const [text, setText] = useState({ name: "" });
  // const [date1, setDate1] = useState(new Date("01-01-2020"));
  const { enqueueSnackbar } = useSnackbar();
  // function handleDate(newValue) {
  //   //console.log("event", newValue);
  //   setDate1(newValue);
  // }
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

  // function getKnownDecipline(input) {
  //   if (allDiscipline.includes(input)) {
  //     return input;
  //   } else {
  //     return "";
  //   }
  // }
  // function getKnownStatus(input) {
  //   if (allStatus.includes(input)) {
  //     return input;
  //   } else {
  //     return "";
  //   }
  // }
  // function convertStringToListIfItIsList(input) {
  //   var listOutput = [];
  //   if (typeof extractedFeilds?.mapped_field?.[input] === "string") {
  //     listOutput.push(extractedFeilds?.mapped_field?.[input]);
  //   } else {
  //     listOutput = extractedFeilds?.mapped_field?.[input];
  //   }
  //   return listOutput;
  // }

  // const handleSetStates = () => {
  //   //console.log("handleState",extractedFeilds);
  //   var Raw_Text = PreparingRawTextForOptions(extractedFeilds);
  //   if (extractedFeilds?.mapped_field) {
  //     var val;
  //     if (
  //       extractedFeilds?.mapped_field?.Revision === "o" ||
  //       extractedFeilds?.mapped_field?.Revision === "O"
  //     ) {
  //       val = "0";
  //     } else {
  //       val = extractedFeilds?.mapped_field?.Revision;
  //     }
  //     // var Comments_Box_LIST = convertStringToListIfItIsList("Comments_Box");
  //     // var Client_Comment_LIST = convertStringToListIfItIsList("Client_Comment");
  //     // var descOfDrawing = convertStringToListIfItIsList("descOfDrawing");
  //     // var convertedDate = DateDbANDPicketAddaptor(
  //     //   extractedFeilds?.mapped_field?.DATE_1
  //     // );
  //     // var knownStatus = getKnownStatus(extractedFeilds?.mapped_field?.STATUS);
  //     // var knownDecipline = getKnownDecipline(
  //     //   extractedFeilds?.mapped_field?.DISCIPLINE
  //     // );

  //     console.log(extractedFeilds.unMapped_field);

  //     // setValues({
  //     //   FLOOR: extractedFeilds?.mapped_field?.FLOOR ?? "",
  //     //   BLOCK: extractedFeilds?.mapped_field?.BLOCK ?? "",
  //     //   ZONE: extractedFeilds?.mapped_field?.ZONE ?? "",
  //     //   MAIN_CONTRACTOR: extractedFeilds?.mapped_field?.MAIN_CONTRACTOR ?? "",
  //     //   CLIENT: extractedFeilds?.mapped_field?.CLIENT ?? "",
  //     //   CONSULTANT: extractedFeilds?.mapped_field?.CONSULTANT ?? "",
  //     //   SUBCONTRACTOR: extractedFeilds?.mapped_field?.SUBCONTRACTOR ?? "",
  //     //   PROJECT: extractedFeilds?.mapped_field?.PROJECT ?? "",
  //     //   LOCATION: extractedFeilds?.mapped_field?.LOCATION ?? "",
  //     //   Document_title: extractedFeilds?.mapped_field?.Document_title ?? "",
  //     //   DISCIPLINE: knownDecipline ?? "",
  //     //   Recieved_date: extractedFeilds?.mapped_field?.Recieved_date ?? "",
  //     //   SUBMITTAL_NO: extractedFeilds?.mapped_field?.SUBMITTAL_NO ?? "",
  //     //   SUBMITTAL_TITLE: extractedFeilds?.mapped_field?.SUBMITTAL_TITLE ?? "",
  //     //   subcontractorRep: extractedFeilds?.mapped_field?.subcontractorRep ?? "",
  //     //   descOfDrawing: descOfDrawing ?? [],
  //     //   Revision: val ?? null,
  //     //   statusofDrawing: extractedFeilds?.mapped_field?.statusofDrawing ?? "",
  //     //   ref_Specs_BOQ_Dwg:
  //     //     extractedFeilds?.mapped_field?.ref_Specs_BOQ_Dwg ?? "",
  //     //   STATUS: knownStatus ?? "",
  //     //   DATE_1: convertedDate ?? "",
  //     //   Comments_Box: Comments_Box_LIST ?? [],
  //     //   Client_Comment: Client_Comment_LIST ?? [],
  //     //   Raw_Text: Raw_Text,
  //     //   //Added this
  //     //   Confidences:
  //     //     extractedFeilds?.mapped_field?.Confidences ??
  //     //     extractedFeilds?.mapped_field_Conf,
  //     // });
  //   }
  // };
  const [Status, setStatus] = useState("");
  const handleUnmappedSetStates = () => {
    // console.log("zzzzzz", extractedFeilds.unMapped_field.Key_Values);

    // console.log("zzzzzz", extractedFeilds.unMapped_field.Raw_Text);
    if (extractedFeilds.unMapped_field) {
      const filtered = Object.keys(extractedFeilds?.unMapped_field?.Key_Values)
        .map((i) => {
          // Remove ':' from key names
          if (
            !extractedFeilds.unMapped_field.Key_Values[i].includes(
              ":unselected"
            ) &&
            !extractedFeilds.unMapped_field.Key_Values[i].includes(":selected:")
          ) {
            return {
              [i.replace(":", "")]:
                extractedFeilds.unMapped_field.Key_Values[i],
            };
          } else return null;
        })
        .filter((j) => j)
        .reduce(
          (obj, item) => ({
            ...obj,
            [Object.keys(item)[0]]:
              typeof item[Object.keys(item)[0]] === "array"
                ? item[Object.keys(item)[0]][0]
                : item[Object.keys(item)[0]],
          }),
          {}
        );

      setValues(filtered);
      setStatus(filtered.Status);
    } else {
      setValues({});
    }
  };

  //   if (extractedFeilds.unMapped_field) {
  //     const filtered = Object.keys(extractedFeilds?.unMapped_field?.Key_Values)
  //       .map((i) => {
  //         if (
  //           !extractedFeilds.unMapped_field.Key_Values[i].includes(
  //             ":unselected:"
  //           ) &&
  //           !extractedFeilds.unMapped_field.Key_Values[i].includes(":selected:")
  //         ) {
  //           return { [i]: extractedFeilds.unMapped_field.Key_Values[i] };
  //         } else return null;
  //       })
  //       .filter((j) => j)
  //       .reduce(
  //         (obj, item) => ({
  //           ...obj,
  //           [Object.keys(item)[0]]:
  //             typeof item[Object.keys(item)[0]] === "array"
  //               ? item[Object.keys(item)[0]][0]
  //               : item[Object.keys(item)[0]],
  //         }),
  //         {}
  //       );

  //     setValues(filtered);
  //     // setExtractedFeilds((prev) => {
  //     //   return { ...prev, mapped_field: { ...prev.mapped_field, ...filtered } };
  //     // });
  //     console.log(filtered);

  //   } else {
  //     setValues({});
  //   }
  // };

  const onChangeEditBoxHandler = (event, name) => {
    //console.log("EventClciked", name);
    //console.log("eventname", event.target.value);
    setEditBox({
      ...editBox,
      [name]: event.target.value,
    });
  };
  const handleChipClick = (event, name) => {
    setEditMode({
      ...editMode,
      [name]: true,
    });
    setEditBox({
      ...editBox,
      [name]: event.target.textContent,
    });
  };
  // const onEnterClickHandler = (event, name) => {
  //   //console.log("Chekc enter clicked", event)
  //   if (event.key === "Enter") {
  //     //console.log("Enter is cliked")
  //     //console.log("editBox[name]", editBox)
  //     //console.log("editBox[name]", name)
  //     setValues({
  //       ...values,
  //       [name]: [...values[name], editBox[name]],
  //     });
  //     setEditMode({
  //       ...editMode,
  //       [name]: false,
  //     });
  //   }
  // };
  const getAliases = async (doc_cat) => {
    try {
      const response2 = await axios.post(
        url + "/Document/getAliases",
        { user, project, doc_cat },
        { headers: { token: user.token } }
      );

      const data = response2.data;
      //console.log("response2", data);
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
      //console.log("data", data);
      data.forEach((element) => {
        aliases.current[element.feild].push(element.element);
      });
      //console.log("aliases", aliases.current);
      //console.log("data", data);
      return response2.data;
    } catch (error) {
      //console.log(error.response);
      return error.response;
    }
  };

  //==========================useEffect=======================================
  useEffect(() => {
    //console.log("user", project);
    //console.log("alias", aliases.current);
    console.log("typeeee", extractedFeilds.document_category);
    if (extractedFeilds.document_category !== undefined) {
      fetchAndSetCheckedValues(
        project?.project_id,
        userInfo?.user_id,
        extractedFeilds?.document_category
      );
    }
    if (extractedFeilds?.project_id !== undefined) {
      // handleSetStates();

      handleUnmappedSetStates();
    }
    const doc_cat = extractedFeilds.document_category;
    getAliases(doc_cat);

    console.log("extracted", extractedFeilds);

    return function cleanup() {
      setValues({});
    };
  }, [extractedFeilds]);

  useEffect(() => {
    //console.log("alias", aliases.current);
    //console.log("Raw_TextRaw_Text", values);
  }, [values]);

  //============================ handleFunctions ============================
  // const handleDocExtDate = (newValue) => {
  //   setExtDate(newValue);
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function convertStringToArray(obj) {
    const result = {};
    for (const key in obj) {
      const value = obj[key];
      // If the value is not a string, keep it as is
      result[key] = [value];
    }
    return result;
  }

  const onSubmit = async () => {
    const { document_id } = extractedFeilds;

    // var convertedDate = DateDbANDPicketAddaptor(values?.DATE_1);
    // var convertRecieved_date = DateDbANDPicketAddaptor(values?.Recieved_date);
    //console.log("ALL", aliases.current);
    try {
      console.log(values.Status, "status");
      const updatedValues = convertStringToArray(values);
      console.log("vard", updatedValues);
      // const mapped_object = {
      //   SUBMITTAL_NO: Array.isArray(values["Submittal No"])
      //     ? values["Submittal No"][0]
      //     : values["Submittal No"] ?? "",
      //   SUBMITTAL_TITLE: Array.isArray(values["Submittal title"])
      //     ? values["Submittal title"][0]
      //     : values["Submittal title"] ?? "",
      //   REVISION: Array.isArray(values?.Revision)
      //     ? values?.Revision[0]
      //     : values?.Revision ?? 0,
      //   STATUS: values?.Status ?? "",

      //   DATE_1: Array.isArray(values?.Date)
      //     ? values?.Date[0]
      //     : values?.Date ?? "",
      //   Recieved_date: Array.isArray(values?.Recieved_date)
      //     ? values?.RECIEVED[0]
      //     : values?.RECIEVED ?? "",
      // };
      const mapped_object = {
        ...(values["Submittal No"] && {
          SUBMITTAL_NO: Array.isArray(values["Submittal No"])
            ? values["Submittal No"][0]
            : values["Submittal No"],
        }),
        ...(values["Submittal title"] && {
          SUBMITTAL_TITLE: Array.isArray(values["Submittal title"])
            ? values["Submittal title"][0]
            : values["Submittal title"],
        }),
        ...(values?.Revision && {
          REVISION: Array.isArray(values?.Revision)
            ? values?.Revision[0]
            : values?.Revision,
        }),
        ...(values?.Status && { STATUS: values?.Status }),
        ...(values?.Date && {
          DATE_1: Array.isArray(values?.Date) ? values?.Date[0] : values?.Date,
        }),
        ...(values?.Recieved_date && {
          Recieved_date: Array.isArray(values?.Recieved_date)
            ? values?.RECIEVED[0]
            : values?.RECIEVED,
        }),
      };

      console.log(mapped_object, "valuesss mapped");
      console.log(values, "valuessss");

      const response = await axios.post(
        url + "/Document/updateDocument",
        {
          user,
          values: values,
          mapped_values: mapped_object,
          document_id,
        },
        { headers: { token: user.token } }
      );
      handleClickVariant(
        "Success",
        "Extracted fields have been successfully updated"
      );
      // setExtractedFeilds({
      //   ...extractedFeilds,
      //   unMapped_field: { Key_Values: values },
      //   // mapped_field:values ,
      // });
      // setExtractedFeilds({
      //   ...extractedFeilds,
      //   mapped_field: {
      //     FLOOR: values?.FLOOR ?? "",
      //     BLOCK: values?.BLOCK ?? "",
      //     ZONE: values?.ZONE ?? "",
      //     MAIN_CONTRACTOR: values?.MAIN_CONTRACTOR ?? "",
      //     CLIENT: values?.CLIENT ?? "",
      //     CONSULTANT: values?.CONSULTANT ?? "",
      //     SUBCONTRACTOR: values?.SUBCONTRACTOR ?? "",
      //     PROJECT: values?.PROJECT ?? "",
      //     LOCATION: values?.LOCATION ?? "",
      //     Document_title: values?.Document_title ?? "",
      //     DISCIPLINE: values?.DISCIPLINE ?? "",
      //     SUBMITTAL_NO: values?.SUBMITTAL_NO ?? "",
      //     SUBMITTAL_TITLE: values?.SUBMITTAL_TITLE ?? "",
      //     subcontractorRep: values?.subcontractorRep ?? "",
      //     descOfDrawing: values?.descOfDrawing ?? [],
      //     Revision: values?.Revision ?? 0,
      //     statusofDrawing: values?.statusofDrawing ?? "",
      //     ref_Specs_BOQ_Dwg: values?.ref_Specs_BOQ_Dwg ?? "",
      //     STATUS: values?.STATUS ?? "",
      //     DATE_1: convertedDate ?? "",
      //     Recieved_date: convertRecieved_date ?? "",
      //     Comments_Box: values?.Comments_Box ?? [],
      //     Client_Comment: values?.Client_Comment ?? [],
      //     Raw_Text: values?.Raw_Text ?? [],
      //     //Added this
      //     Confidences: values?.Confidences ?? {},
      //   },
      // });
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
      console.log("mmmmm", response.data);
      return response.data;
    } catch (error) {
      //console.log(error.response);
      return error.response;
    }
  };
  const onMap = async () => {
    console.log("Map clicked");
    console.log("Checked Values:", checkedValues);

    const mappedValues = {};

    Object.entries(checkedValues).forEach(([key, value]) => {
      if (value !== undefined) {
        if (!mappedValues[extractedFeilds?.document_category]) {
          mappedValues[extractedFeilds?.document_category] = [];
        }
        mappedValues[extractedFeilds?.document_category].push(key);
      }
    });

    console.log("Mapped Values:", mappedValues);
    try {
      var res1 = await axios.post(
        url + "/Document/MappedKeysApi",
        { userInfo, project, user, mappedValues },
        {
          headers: { token: user.token },
        }
      );
      console.log(res1.data, "data from backend");
      enqueueSnackbar("Keys mapped successfully", { variant: "success" });
      return res1.data;
    } catch (e) {
      enqueueSnackbar("Error in keys mapping", { variant: "error" });
      console.log(e);
      throw e;
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    //console.log("name", name);
    //console.log("value", value);
    // if (value.length) {
    //   setErrors({
    //     ...errors,
    //     [name]: notErr,
    //   });
    // } else if (errors.name !== err) {
    //   setErrors({
    //     ...errors,
    //     [name]: err,
    //   });
    // }

    setValues({
      ...values,
      [`${name}`]: value,
    });
  };
  // const handleCheckboxChange = (event, key) => {
  //   const isChecked = event.target.checked;
  //   setCheckedValues((prevCheckedValues) => ({
  //     ...prevCheckedValues,
  //     [key]: isChecked ? values[key] : undefined,
  //   }));

  //   const isAnyCheckboxChecked = Object.values(checkedValues).some(
  //     (value) => value !== undefined
  //   );
  //   setIsMapButtonDisabled(!isAnyCheckboxChecked);
  // };
  function setInitialCheckedValues(keys) {
    const initialCheckedValues = {};
    keys.forEach((key) => {
      initialCheckedValues[key] = true;
    });
    setCheckedValues(initialCheckedValues);
  }
  console.log(typeof values?.Status, "DAWAR");
  async function fetchAndSetCheckedValues(projectId, userId, category) {
    try {
      const response = await axios.post(
        url + "/Document/check-categories",
        {
          projectId: projectId,
          userId: userId,
          category: category,
        },
        { headers: { token: user.token } }
      );

      // Assume the response contains an array of keys
      const keys = response.data;

      // Set the initial checked values
      setInitialCheckedValues(response.data.keys);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  // function setInitialCheckedValues(keys) {
  //   const initialCheckedValues = {};
  //   const missingFrontendKeys = [];

  //   // Convert the keys of the 'values' object to an array
  //   const valueKeys = Object.keys(values);

  //   // Check each provided key against the keys of the 'values' object
  //   keys.forEach((key) => {
  //     if (!valueKeys.includes(key)) {
  //       missingFrontendKeys.push(key);
  //     } else {
  //       initialCheckedValues[key] = true;
  //     }
  //   });

  //   // If there are any missing keys, trigger the error message
  //   if (missingFrontendKeys.length > 0) {
  //     setKeyValidationError(
  //       `Your keys aren't matched. Missing keys: ${missingFrontendKeys.join(
  //         ", "
  //       )}. Please redo it from the first document.`
  //     );
  //   } else {
  //     // Only set checked values if there are no missing keys
  //     setCheckedValues(initialCheckedValues);
  //   }
  // }

  const handleCheckboxChange = (event, key) => {
    const isChecked = event.target.checked;
    setCheckedValues((prevCheckedValues) => {
      const updatedCheckedValues = {
        ...prevCheckedValues,
        [key]: isChecked ? values[key] : undefined,
      };
      setIsMapButtonDisabled(
        !Object.values(updatedCheckedValues).some(
          (value) => value !== undefined
        )
      );
      return updatedCheckedValues;
    });
  };

  // console.log("typeeee", extractedFeilds.document_category);

  const onChangeHandler2 = (e, value, name) => {
    setValues({
      ...values,
      [name]: value,
    });
    setStatus(value);
  };

  // // State variable to hold the error message
  const [keyValidationError, setKeyValidationError] = useState("");

  // async function fetchAndSetCheckedValues(projectId, userId, category) {
  //   try {
  //     const response = await axios.post(
  //       url + "/Document/check-categories",
  //       {
  //         projectId: projectId,
  //         userId: userId,
  //         category: category,
  //       },
  //       { headers: { token: user.token } }
  //     );

  //     // Assume the response contains an array of keys
  //     const backendKeys = response.data;

  //     // Get the frontend keys from the values object
  //     const frontendKeys = Object.keys(
  //       extractedFeilds?.unMapped_field?.Key_Values
  //     );
  //     console.log(frontendKeys, "forntend  check  keys");
  //     console.log(backendKeys, "backend check keys");
  //     // Find keys that exist in the backend but not in the frontend
  //     const missingFrontendKeys = backendKeys.filter(
  //       (key) => !frontendKeys.includes(key)
  //     );

  //     // If there are missing keys, set an error message
  //     if (missingFrontendKeys.length > 0) {
  //       setKeyValidationError(
  //         `Your keys aren't matched. Missing keys: ${missingFrontendKeys.join(
  //           ", "
  //         )}. Please redo it from the first document.`
  //       );
  //     } else {
  //       // If all keys are matched, clear the error and set the initial checked values
  //       setKeyValidationError("");
  //       setInitialCheckedValues(backendKeys);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //   }
  // }

  // Fetch the keys from the backend and set the initial checked values

  console.log("main type", extractedFeilds?.document_category);
  console.log(values, "valuessss");
  //============================  ============================

  return (
    <>
      {(extractedFeilds &&
        values.length === 0 &&
        extractedFeilds?.document_category === "responsibility_matrix") ||
      extractedFeilds?.document_category === "tender_addendums" ||
      extractedFeilds?.document_category === "BOQ" ||
      extractedFeilds?.document_category === "MOM" ||
      extractedFeilds?.document_category === "Scanned Contract" ||
      extractedFeilds?.document_category === "Text Contract" ? (
        //  ||
        // extractedFeilds?.document_category === "Prequalification Submittal" ||
        // extractedFeilds?.document_category === "Request for Information" ||
        // extractedFeilds?.document_category === "Work Inspection Request" ||
        // extractedFeilds?.document_category === "Meterial Inspection Request" ||
        // extractedFeilds?.document_category === "Architectural Inspection Request"
        <p>no data to show</p>
      ) : (
        <>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <div className="w-100 d-flex justify-content-end">
                {value === 0 && (
                  <Button
                    style={{
                      marginBottom: "-3em",
                      paddingBlock: "-2px",
                      paddingInline: "2px",
                      zIndex: 10,
                    }}
                    variant="contained"
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                )}
                {value === 1 && (
                  <Button
                    style={{
                      marginBottom: "-3em",
                      paddingBlock: "-2px",
                      paddingInline: "2px",
                      zIndex: 10,
                    }}
                    variant="contained"
                    onClick={onMap}
                    disabled={isMapButtonDisabled}
                  >
                    Map
                  </Button>
                )}
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
              {/* <ConfidenceKey /> */}
              <div className=" mb-3">
                <Typography
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "var(--blue)",
                  }}
                >
                  {extractedFeilds?.document_category} Details{" "}
                </Typography>
              </div>

              {Object.keys(values).length !== 0 &&
                ((extractedFeilds?.document_category ===
                  "shop_drawing_submittal" ||
                  extractedFeilds?.document_category === "material_submittal" ||
                  extractedFeilds?.document_category === "Site Instruction" ||
                  extractedFeilds?.document_category ===
                    "Technical Submittal" ||
                  extractedFeilds?.document_category ===
                    "Method Statement Submittal" ||
                  extractedFeilds?.document_category ===
                    "Non Conformance Report" ||
                  extractedFeilds?.document_category ===
                    "Prequalification Submittal" ||
                  extractedFeilds?.document_category ===
                    "Request for Information" ||
                  extractedFeilds?.document_category ===
                    "Work Inspection Request" ||
                  extractedFeilds?.document_category ===
                    "Meterial Inspection Request" ||
                  extractedFeilds?.document_category ===
                    "Architectural Inspection Request" ||
                  extractedFeilds?.document_category === "Submittals") &&
                extractedFeilds?.unMapped_field ? (
                  <Autocomplete
                    options={allStatus}
                    error={!values?.Status?.length}
                    helperText={
                      <Typography style={{ fontSize: "10px" }}>
                        {!values?.Status?.length
                          ? "You need to fill this feild"
                          : ""}
                      </Typography>
                    }
                    className="DocExtractionTextField"
                    multiline
                    minRows="1"
                    onChange={(event, newValue) => {
                      onChangeHandler2(event, newValue, "Status");
                    }}
                    onHighlightChange={(event, newValue) => {
                      if (newValue?.id != null) {
                        console.log("newValue", newValue);
                        updateHash(newValue.id);
                      }
                    }}
                    value={Status}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!values?.Status?.length}
                        helperText={
                          <Typography style={{ fontSize: "10px" }}>
                            {!values?.Status?.length
                              ? "You need to fill this feild"
                              : ""}
                          </Typography>
                        }
                        value={Status}
                        onChange={onChangeHandler}
                        size="small"
                        id="nothing"
                        name="nothing"
                        label="Status"
                      />
                    )}
                  />
                ) : null)}

              {/* {Object.keys(values).map((key, index) => (
      <Autocomplete
        freeSolo
        options={PreparingRawTextForOptions(extractedFeilds)}
        // error={!values[key].length}
        // helperText={
        //   <Typography style={{ fontSize: "10px" }}>
        //     {!values[key].length ? "You need to fill this feild" : ""}
        //   </Typography>
        // }
        className="DocExtractionTextField"
        multiline
        minRows="1"
        // onChange={onChangeHandler}
        onChange={(event, newValue) => {
          selectionRawText(event, newValue, key, setValues, values);
        }}
        onHighlightChange={(event, newValue) => {
          if (newValue?.id != null) {
            //console.log("newValue",newValue);
            updateHash(newValue.id);
          }
        }}
        value={values[key]}
        renderInput={(params) => (
          <div className="d-flex">
            <TextField
              {...params}
              // error={!values[key].length}
              // helperText={
              //   <Typography style={{ fontSize: "10px" }}>
              //     {!values[key].length ? "You need to fill this feild" : ""}
              //   </Typography>
              // }
              value={values[key]}
              size="small"
              // onChange={(event, newValue) => {
              //   selectionRawText(event, newValue, key, setValues, values);
              // }}
              onChange={onChangeHandler}
              id={key}
              name={key}
              label={key}
            />
          </div>
        )}
      />
    ))} */}

              {Object.keys(values)
                .filter((key) => key !== "Status")
                .map((key, index) => (
                  <Autocomplete
                    freeSolo
                    options={PreparingRawTextForOptions(extractedFeilds)}
                    className="DocExtractionTextField"
                    multiline
                    minRows="1"
                    onChange={(event, newValue) => {
                      selectionRawText(event, newValue, key, setValues, values);
                    }}
                    onHighlightChange={(event, newValue) => {
                      if (newValue?.id != null) {
                        updateHash(newValue.id);
                      }
                    }}
                    value={values[key]}
                    renderInput={(params) => (
                      <div className="d-flex">
                        <TextField
                          {...params}
                          value={values[key]}
                          size="small"
                          onChange={onChangeHandler}
                          id={key}
                          name={key}
                          label={key}
                        />
                      </div>
                    )}
                  />
                ))}
            </TabPanel>

            {extractedFeilds?.document_category === "shop_drawing_submittal" ||
            extractedFeilds?.document_category === "material_submittal" ||
            extractedFeilds?.document_category === "Site Instruction" ||
            extractedFeilds?.document_category === "Technical Submittal" ||
            extractedFeilds?.document_category ===
              "Method Statement Submittal" ||
            extractedFeilds?.document_category === "Non Conformance Report" ||
            extractedFeilds?.document_category ===
              "Prequalification Submittal" ||
            extractedFeilds?.document_category === "Request for Information" ||
            extractedFeilds?.document_category === "Work Inspection Request" ||
            extractedFeilds?.document_category ===
              "Meterial Inspection Request" ||
            extractedFeilds?.document_category ===
              "Architectural Inspection Request" ||
            extractedFeilds?.document_category === "Submittsls" ? (
              <></>
            ) : (
              <TabPanel value={value} index={1}>
                {/* <ConfidenceKey /> */}

                <div className=" mb-3">
                  <Typography
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--blue)",
                    }}
                  >
                    Select the headings for export and table Details{" "}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--warningRed)",
                      opacity: "50%",
                    }}
                  >
                    Note : If you are selecting heading for the first time add
                    those which are similar accros this catagory (
                    {extractedFeilds?.document_category})
                  </Typography>
                  {keyValidationError && (
                    <div className="alert alert-danger" role="alert">
                      {keyValidationError}
                    </div>
                  )}
                </div>

                {Object.keys(values).map((key, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center "
                    style={{ width: "100%" }}
                  >
                    <Checkbox
                      onChange={(event) => handleCheckboxChange(event, key)}
                      checked={!!checkedValues[key]} // Use the state to determine if the checkbox should be checked
                    />

                    <Autocomplete
                      style={{ width: "100%" }}
                      freeSolo
                      disabled
                      options={PreparingRawTextForOptions(extractedFeilds)}
                      // error={!values[key].length}
                      // helperText={
                      //   <Typography style={{ fontSize: "10px" }}>
                      //     {!values[key].length ? "You need to fill this feild" : ""}
                      //   </Typography>
                      // }
                      className="DocExtractionTextField"
                      multiline
                      minRows="1"
                      // onChange={onChangeHandler}
                      onChange={(event, newValue) => {
                        selectionRawText(
                          event,
                          newValue,
                          key,
                          setValues,
                          values
                        );
                      }}
                      onHighlightChange={(event, newValue) => {
                        if (newValue?.id != null) {
                          //console.log("newValue",newValue);
                          updateHash(newValue.id);
                        }
                      }}
                      value={key}
                      renderInput={(params) => (
                        <div className="d-flex">
                          <TextField
                            {...params}
                            // error={!values[key].length}
                            // helperText={
                            //   <Typography style={{ fontSize: "10px" }}>
                            //     {!values[key].length ? "You need to fill this feild" : ""}
                            //   </Typography>
                            // }
                            value={key}
                            size="small"
                            // onChange={(event, newValue) => {
                            //   selectionRawText(event, newValue, key, setValues, values);
                            // }}
                            onChange={onChangeHandler}
                            id={key}
                            name={key}
                            sx={{
                              height: "fit-content",
                              "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "#000000",
                                MozUserSelect: "none",
                                msUserSelect: "none",
                                userSelect: "none",
                              },
                            }}
                          />
                        </div>
                      )}
                    />
                  </div>
                ))}
              </TabPanel>
            )}
          </Box>
        </>
      )}
    </>
  );
}
// }

export default ShopDrawingSubmitals;
