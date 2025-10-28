import {
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import DocumentDatePicker from "./DocumentDatePicker";
// import TypePicker from "./TypePicker";
// import InProgressDocs from "./InProgressDocs/InProgressDocs";
// import SmartFilters from "./SmartFilters";
// import MenuIcon from "@mui/icons-material/Menu";
import SaveNotClicked from "./SaveNotClickedEmail";
// import List from "@mui/material/List";
// import { styled } from "@mui/material/styles";
// import FileUpload from "./Upload/Upload";
// import DocumentList from "./DocumentList/DocumentList";

// import DocumentListFilter from "./DocumentList/DocumentListFilter";
// import PDFView from "./Viewer/PDFView";
// import Aliases from "../Folders/Aliases/Aliases";
// import FolderCard from "./FolderCard";

// import { Tabs, Tab } from "@mui/material";
// import { textAlign } from "@material-ui/system";

const tree = [
  {
    name: "Submittals",
    children: [
      {
        name: "Shop Drawing Submittals",
      },
      {
        name: "Material Submittals",
      },
      // {
      //   name: "Site Instruction",
      // },
      // {
      //   name: "Meterial Inspection Request",
      // },
      // {
      //   name: "Technical Submittal",
      // },
      // {
      //   name: "Method Statement Submittal",
      // },
      // {
      //   name: "Non Conference Report",
      // },
      // {
      //   name: "Prequalification Approval",
      // },
      // {
      //   name: "Request for Information",
      // },
      // {
      //   name: "Work Infomation Request",
      // },
      // {
      //   name: "Architectural Inspection Request",
      // },
      // {
      //   name: "Other Submittals",
      // },
    ],
  },
  {
    name: "Letters",
    children: [
      { name: "Approved Letters" },
      { name: "Rejected Letters" },
      { name: "Other Letters" },
    ],
  },
  {
    name: "Responsibility Matrix",
    children: [
      {
        name: "Responsibility Matrix",
      },
    ],
  },
  {
    name: "Tender Addendums",
    children: [
      {
        name: "Tender Addendums",
      },
    ],
  },
  {
    name: "Contract",
    children: [
      {
        name: "Text Contract",
      },
      {
        name: "Scanned Contract",
      },
    ],
  },
  {
    name: "BOQ",
    children: [
      {
        name: "BOQ",
      },
    ],
  },
  {
    name: "MOM",
    children: [
      {
        name: "MOM",
      },
    ],
  },
  // {
  //   name: "Bucket",
  //   children: [{ name: "Bucket" }],
  // },
];
export default function Folders({
  user,
  userInfo,
  project,
  checkedDocs,
  setCheckedDocs,
  name,
  setName,
}) {
  const [category, setCategory] = useState("");
  const [contractor, setContractor] = useState("");

  const [children, setChildren] = React.useState([]);
  const [currentComp, setCurrentComp] = React.useState("");
  const [isChildren, setIsChildren] = React.useState(false);
  const [saveClicked, setSaveClicked] = React.useState(false);
  const [filters, setFilters] = React.useState();
  const [saveToggle, setSaveToggle] = React.useState(true);
  // const [check, setCheck] = useState(false);

  const [open, setOpen] = React.useState(true);

  const users = [
    { user_id: 4, username: "Saad@gmail.com" },
    { user_id: 5, username: "Waqar@gmail.com" },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelectComponentMain = (name, children) => {
    setCurrentComp(name);
    setChildren(children);
  };
  const handleSelectComponentChildren = (name) => {
    setCurrentComp(name);
    setChildren([]);
    setIsChildren(true);
    setCategory(name);
    clearAllExceptCategoryHandler();
  };
  const clearAllExceptCategoryHandler = () => {
    setSaveClicked(false);
  };
  const clearAllHandler = () => {
    if (!isChildren) {
      setCategory(null);
    }

    setSaveClicked(false);
  };

  //   useEffect(() => {
  //     console.log("showViewer", showViewer);
  //     console.log("current comp", currentComp);
  //     console.log("check comp", check);

  //     users.splice(
  //       users.findIndex((e) => e === user.username),
  //       1
  //     );
  //   }, [extractedFeilds, docUrl, check]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "background.default",
        }}
      >
        <Grid container direction="column" rowSpacing={2}>
          <Grid item>
            <SaveNotClicked
              checkedDocs={checkedDocs}
              setCheckedDocs={setCheckedDocs}
              project={project}
              filters={filters}
              setFilters={setFilters}
              user={user}
              saveClicked={saveClicked}
              clearAllHandler={clearAllHandler}
              saveToggle={saveToggle}
              children={children}
              category={category}
              setCategory={setCategory}
              contractor={contractor}
              setContractor={setContractor}
              setChildren={setChildren}
              isChildren={isChildren}
              setIsChildren={setIsChildren}
              tree={tree}
              handleSelectComponentMain={handleSelectComponentMain}
              handleSelectComponentChildren={handleSelectComponentChildren}
              currentComp={currentComp}
              setCurrentComp={setCurrentComp}
              users={users}
              isFilterSearch={false}
              name={name}
              setName={setName}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
