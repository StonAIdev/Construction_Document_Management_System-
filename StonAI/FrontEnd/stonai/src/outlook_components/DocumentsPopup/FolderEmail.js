import {
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import SaveNotClicked from "./SaveNotClickedEmail";

const tree = [];

const subObj = {
  name: "Submittals",
  children: [],
};

const letterObj = {
  name: "Letters",
  children: [],
};
const resMatrixObj = {
  name: "Responsibility Matrix",
  children: [],
};
const tenderObj = {
  name: "Tender Addendums",
  children: [],
};
const contractObj = {
  name: "Contract",
  children: [],
};
const boqObj = {
  name: "BOQ",
  children: [],
};
const momObj = {
  name: "MOM",
  children: [],
};
const bucketObj = {
  name: "Bucket",
  children: [],
};

const dynamicTree = (permision, setDynamicTree) => {
  // ------------------ Engineering Department ------------------------

  if (permision.canviewshopdrawingsubmittal) {
    subObj.children.push({
      name: "Shop Drawing Submittals",
      update: permision.canupdateextractedfeildsshopdrawingsubmittal,
      share: permision.cansharedocumentthoughemailshopdrawingsubmittal,
      delete: permision.candeletedocumentshopdrawingsubmittal,
      download: permision.candownloaddocumentshopdrawingsubmittal,
      exportFile:
        permision.canexportdocumentinfoasexcelfileshopdrawingsubmittal,
      department: "Engineering Department",
    });
  }
  if (permision.canviewmaterialsubmittal) {
    subObj.children.push({
      name: "Material Submittals",
      update: permision.canupdateextractedfeildsmaterialsubmittal,
      share: permision.cansharedocumentthoughemailmaterialsubmittal,
      delete: permision.candeletedocumentmaterialsubmittal,
      download: permision.candownloaddocumentmaterialsubmittal,
      exportFile: permision.canexportdocumentinfoasexcelfilematerialsubmittal,
      department: "Engineering Department",
    });
  }
  if (permision.canviewprequalificationsubmittal) {
    subObj.children.push({
      name: "Prequalification Submittal",
      update: permision.canupdateextractedfeildsprequalificationsubmittal,
      share: permision.cansharedocumentthoughemailprequalificationsubmittal,
      delete: permision.candeletedocumentprequalificationsubmittal,
      download: permision.candownloaddocumentprequalificationsubmittal,
      exportFile:
        permision.canexportdocumentinfoasexcelfileprequalificationsubmittal,
      department: "Engineering Department",
    });
  }
  if (permision.canviewtechnicalsubmittal) {
    subObj.children.push({
      name: "Technical Submittal",
      update: permision.canupdateextractedfeildstechnicalsubmittal,
      share: permision.cansharedocumentthoughemailtechnicalsubmittal,
      delete: permision.candeletedocumenttechnicalsubmittal,
      download: permision.candownloaddocumenttechnicalsubmittal,
      exportFile: permision.canexportdocumentinfoasexcelfiletechnicalsubmittal,
      department: "Engineering Department",
    });
  }
  if (permision.canviewmethodstatementsubmittal) {
    subObj.children.push({
      name: "Method Statement Submittal",
      update: permision.canupdateextractedfeildsmethodstatementsubmittal,
      share: permision.cansharedocumentthoughemailmethodstatementsubmittal,
      delete: permision.candeletedocumentmethodstatementsubmittal,
      download: permision.candownloaddocumentmethodstatementsubmittal,
      exportFile:
        permision.canexportdocumentinfoasexcelfilemethodstatementsubmittal,
      department: "Engineering Department",
    });
  }
  if (permision.canviewrequestforinformation) {
    subObj.children.push({
      name: "Request for Information",
      update: permision.canupdateextractedfeildsrequestforinformation,
      share: permision.cansharedocumentthoughemailrequestforinformation,
      delete: permision.candeletedocumentrequestforinformation,
      download: permision.candownloaddocumentrequestforinformation,
      exportFile:
        permision.canexportdocumentinfoasexcelfilerequestforinformation,
      department: "Engineering Department",
    });
  }
  if (permision.canviewmaterialinspectionrequest) {
    subObj.children.push({
      name: "Meterial Inspection Request",
      update: permision.canupdateextractedfeildsmaterialinspectionrequest,
      share: permision.cansharedocumentthoughemailmaterialinspectionrequest,
      delete: permision.candeletedocumentmaterialinspectionrequest,
      download: permision.candownloaddocumentmaterialinspectionrequest,
      exportFile:
        permision.canexportdocumentinfoasexcelfilematerialinspectionrequest,
      department: "Construction Department",
    });
  }
  if (permision.canviewworkinspectionrequest) {
    subObj.children.push({
      name: "Work Inspection Request",
      update: permision.canupdateextractedfeildsworkinspectionrequest,
      share: permision.cansharedocumentthoughemailworkinspectionrequest,
      delete: permision.candeletedocumentworkinspectionrequest,
      download: permision.candownloaddocumentworkinspectionrequest,
      exportFile:
        permision.canexportdocumentinfoasexcelfileworkinspectionrequest,
      department: "Construction Department",
    });
  }
  if (permision.canviewarchitecturalinspectionrequest) {
    subObj.children.push({
      name: "Architectural Inspection Request",
      update: permision.canupdateextractedfeildsarchitecturalinspectionrequest,
      share:
        permision.cansharedocumentthoughemailarchitecturalinspectionrequest,
      delete: permision.candeletedocumentarchitecturalinspectionrequest,
      download: permision.candownloaddocumentarchitecturalinspectionrequest,
      exportFile:
        permision.canexportdocumentinfoasexcelfilearchitecturalinspectionrequest,
      department: "Construction Department",
    });
  }
  if (permision.canviewnonconformancereport) {
    subObj.children.push({
      name: "Non Conformance Report",
      update: permision.canupdateextractedfeildsnonconformancereport,
      share: permision.cansharedocumentthoughemailnonconformancereport,
      delete: permision.candeletedocumentnonconformancereport,
      download: permision.candownloaddocumentnonconformancereport,
      exportFile:
        permision.canexportdocumentinfoasexcelfilenonconformancereport,
      department: "Quality Control Department",
    });
  }
  if (permision.canviewsiteinstruction) {
    subObj.children.push({
      name: "Site Instruction",
      update: permision.canupdateextractedfeildssiteinstruction,
      share: permision.cansharedocumentthoughemailsiteinstruction,
      delete: permision.candeletedocumentsiteinstruction,
      download: permision.candownloaddocumentsiteinstruction,
      exportFile: permision.canexportdocumentinfoasexcelfilesiteinstruction,
      department: "Quality Control Department",
    });
  }
  tree.push(subObj);

  if (permision.canviewletter) {
    letterObj.children.push(
      {
        name: "Approved Letters",
        update: permision.canupdateextractedfeildsletter,
        share: permision.cansharedocumentthoughemailletter,
        delete: permision.candeletedocumentletter,
        download: true,
        exportFile: true,
      },
      {
        name: "Rejected Letters",
        update: permision.canupdateextractedfeildsletter,
        share: permision.cansharedocumentthoughemailletter,
        delete: permision.candeletedocumentletter,
        download: true,
        exportFile: true,
      },

      {
        name: "Other Letters",
        update: permision.canupdateextractedfeildsletter,
        share: permision.cansharedocumentthoughemailletter,
        delete: permision.candeletedocumentletter,
        download: true,
        exportFile: true,
      }
    );
    tree.push(letterObj);
  }
  if (permision.canviewresponsibilitymatrix) {
    resMatrixObj.children.push({
      name: "Responsibility Matrix",
      update: permision.canupdatealiasesresponsibilitymatrix,
      share: permision.cansharedocumentthoughemailresponsibilitymatrix,
      delete: permision.candeletedocumentresponsibilitymatrix,
      download: permision.candownloaddocumentresponsibilitymatrix,
      exportFile: true,
    });
    tree.push(resMatrixObj);
  }
  if (permision.canviewtender) {
    tenderObj.children.push({
      name: "Tender Addendums",
      update: permision.canupdateextractedfeildstender,
      share: permision.cansharedocumentthoughemailtender,
      delete: permision.candeletedocumenttender,
      download: permision.candownloaddocumenttender,
      exportFile: true,
    });
    tree.push(tenderObj);
  }
  if (permision.canviewcontract) {
    contractObj.children.push(
      {
        name: "Text Contract",
        update: true,
        share: permision.cansharedocumentthoughemailcontract,
        delete: permision.candeletedocumentcontract,
        download: permision.candownloaddocumentcontract,
        exportFile: true,
      },

      {
        name: "Scanned Contract",
        update: true,
        share: permision.cansharedocumentthoughemailcontract,
        delete: permision.candeletedocumentcontract,
        download: permision.candownloaddocumentcontract,
        exportFile: true,
      }
    );
    tree.push(contractObj);
  }

  if (permision.canviewboq) {
    boqObj.children.push({
      name: "BOQ",
      update: permision.canupdateextractedfeildsboq,
      share: permision.cansharedocumentthoughemailboq,
      delete: permision.candeletedocumentboq,
      download: permision.candownloaddocumentboq,
      exportFile: true,
    });
    tree.push(boqObj);
  }
  if (permision.canviewminutesofmeeting) {
    momObj.children.push({
      name: "MOM",
      update: permision.canupdateextractedfeildsminutesofmeeting,
      share: permision.cansharedocumentthoughemailminutesofmeeting,
      delete: permision.candeletedocumentminutesofmeeting,
      download: permision.candownloaddocumentminutesofmeeting,
      exportFile: true,
    });
    tree.push(momObj);
  }
  if (permision.canviewbucket) {
    bucketObj.children.push({
      name: "Bucket",
      update: false,
      share: permision.cansharedocumentthoughemailbucket,
      delete: permision.candeletedocumentbucket,
      download: permision.candownloaddocumentbucket,
      exportFile: true,
    });
    tree.push(bucketObj);
  }
  setDynamicTree(tree);
};

export default function Folders({
  user,
  userInfo,
  project,
  checkedDocs,
  setCheckedDocs,
  name,
  setName,
  permisions,
  value,
  handleAttachFiles,
  handleClose,
  loading,
}) {
  const [category, setCategory] = useState("");
  const [contractor, setContractor] = useState("");
  const [updatedTree, setDynamicTree] = useState([]);
  const [children, setChildren] = React.useState([]);
  const [currentComp, setCurrentComp] = React.useState("");
  const [isChildren, setIsChildren] = React.useState(false);
  const [saveClicked, setSaveClicked] = React.useState(false);
  const [filters, setFilters] = React.useState();
  const [saveToggle, setSaveToggle] = React.useState(true);
  // const [check, setCheck] = useState(false);

  const asyncApis = async () => {
    dynamicTree(permisions, setDynamicTree);
  };
  useEffect(() => {
    setDynamicTree(tree);
    if (tree.length <= 0) {
      asyncApis();
    }
  }, [updatedTree, value]);
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
  return (
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
      tree={updatedTree}
      handleSelectComponentMain={handleSelectComponentMain}
      handleSelectComponentChildren={handleSelectComponentChildren}
      currentComp={currentComp}
      setCurrentComp={setCurrentComp}
      users={users}
      isFilterSearch={false}
      name={name}
      setName={setName}
      handleAttachFiles={handleAttachFiles}
      handleClose={handleClose}
      loading={loading}
    />
  );
}
