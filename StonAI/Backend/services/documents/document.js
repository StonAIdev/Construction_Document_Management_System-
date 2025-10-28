const { Router, text } = require("express");
const pools = require("../../db");
const dotenv = require("dotenv");
const format = require("pg-format");
const axios = require("axios");
const { response } = require("express");
const client = require("../../elasticSearch");
const authorize = require("../../middleware/authorization");
("use strict");
const fs = require("fs");
var qs = require("qs");
const express = require("express");
const { Console } = require("console");
const { start } = require("repl");
const { match } = require("assert");
const { SortDefinition } = require("@aws-sdk/client-cost-explorer");
const document = express.Router();
// const test_json = require('./test_json.js')

function changeLabelToLabel(category) {
  var category;
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Other Letters") {
    category = "other_letters";
  } else if (category === "Responsibility Matrix") {
    category = "responsibility_matrix";
  }
  return category;
}
function convertSubmittalsCatLabel(category) {
  if (category === "Material Submittals") {
    category = "Material Submittals";
  } else if (category === "Shop Drawing Submittals") {
    category = "Shop Drawing Submittals";
  } else if (category === "Site Instruction") {
    category = "Site INstruction";
  } else if (category === "Technical Submittal") {
    category = "Technical Submittal";
  } else if (category === "Method Statement Submittal") {
    category = "Method Statement Submittal";
  } else if (category === "Non Conformance Report") {
    category = "Non Conformance Report";
  } else if (category === "Prequalification Submittal") {
    category = "Prequalification";
  } else if (category === "Request for Information") {
    category = "Request For Information";
  } else if (category === "Work Inspection Request") {
    category = "Work inspection request";
  } else if (category === "Meterial Inspection Request") {
    category = "Material inspection request";
  } else if (category === "Architectural Inspection Request") {
    category = "Architectural inspection request";
  }
  return category;
}
function ExtractingInfoFromSubmittalNo(SUBMITTAL_NO) {
  function extractFromSlashFormat() {
    console.log("/");
    var splitRef = SUBMITTAL_NO.split("/");
    splitRef = splitRef[splitRef.length - 1];
    splitRef = splitRef.trim();
    splitRef = splitRef.slice(1);
    console.log("splitRef", splitRef);
  }
  function extractFromDashFormat() {
    console.log("-");
    var splitRef = SUBMITTAL_NO.split("-");
    splitRef = splitRef[splitRef.length - 1];
    splitRef = splitRef.trim();
    SUBMITTAL_NO_INFO.Revision = splitRef.slice(1);
  }
  try {
    var SUBMITTAL_NO_INFO = {
      Revision: 0,
      subCon: "",
    };
    if (SUBMITTAL_NO.indexOf("PKE") === -1) {
      SUBMITTAL_NO_INFO.subCon = "UNEC";
    } else {
      SUBMITTAL_NO_INFO.subCon = "PKE";
    }
    console.log("SUBMITTAL_NO_INFO", SUBMITTAL_NO_INFO);
    var delimiter = SUBMITTAL_NO.indexOf("/");

    if (delimiter === -1) {
      extractFromDashFormat();
    } else {
      extractFromSlashFormat();
    }
    return SUBMITTAL_NO_INFO;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
document.get("/ExtractingInfoFromSubmittalNo", async (req, res) => {
  console.log("i am here");
  const result = ExtractingInfoFromSubmittalNo("VEE-RIH-MTS-0003-PKE- R00");
  res.json(result);
});
function mappingFeildsMaterialSubs(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    var checkLetters = /[a-zA-Z]/g;
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.generalContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:" || obj.Field === "Date") {
        if (checkLetters.test(obj.Value)) known.Date = obj.Value;
      } else if (obj.Field === "SUBMITTAL_NO") {
        known.SUBMITTAL_NO = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.discipline = obj.Value;
      } else if (obj.Field === "Material") {
        known.Material = obj.Value;
      } else if (obj.Field === "SUBMITTAL_TITLE") {
        known.SUBMITTAL_TITLE = obj.Value;
      } else if (obj.Field === "Description of Material") {
        known.DescOfMaterial = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (obj.Field === "Ref. Specs/BOQ/Dwg") {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:" || obj.Field === "Name") {
        known.subcontractorRep = obj.Value;
      }
    });
    if (typeof known.SUBMITTAL_NO !== "undefined")
      var extracted = ExtractingInfoFromSubmittalNo(known.SUBMITTAL_NO);
    known.Subcontractor = extracted.subCon;
    if (typeof known.revision_number === "undefined") {
      var extracted = ExtractingInfoFromSubmittalNo(known.SUBMITTAL_NO);
      known.Revision = extracted.Revision;
    } else {
      const rev = known.revision_number;

      splitRef = rev.trim();
      splitRef = splitRef.slice(1);
      splitRef = splitRef.replace("-", "");

      known.Revision = splitRef;
    }

    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsShopSubs(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    var checkLetters = /[a-zA-Z]/g;
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :" || obj.Field === "Location") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:" || obj.Field === "Date") {
        if (checkLetters.test(obj.Value)) known.Date = obj.Value;
      } else if (obj.Field === "SUBMITTAL_NO") {
        known.SUBMITTAL_NO = obj.Value;
      } else if (obj.Field === "SUBMITTAL_TITLE") {
        known.SUBMITTAL_TITLE = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    if (typeof known.SUBMITTAL_NO !== "undefined")
      var extracted = ExtractingInfoFromSubmittalNo(known.SUBMITTAL_NO);
    known.Subcontractor = extracted.subCon;
    if (typeof known.revision_number === "undefined") {
      var extracted = ExtractingInfoFromSubmittalNo(known.SUBMITTAL_NO);
      known.Revision = extracted.Revision;
    } else {
      const rev = known.revision_number;

      splitRef = rev.trim();
      splitRef = splitRef.slice(1);
      splitRef = splitRef.replace("-", "");

      known.Revision = splitRef;
    }
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsSiteInstruction(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "Main Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SI Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "Subject" || obj.Field === "SI Title/Subject") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Issued to") {
        known.Issued_To = obj.Value;
      } else if (obj.Field === "Document Control") {
        known.Document_Control = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Site Instruction Details") {
        known.Site_Instrution_Details = obj.Value;
      } else if (obj.Field === "Attachments/s") {
        known.Attachments = obj.Value;
      } else if (obj.Field === "Project/Contruction Manager") {
        known.Main_Contractor_Contruction_Manager = obj.Value;
      } else if (obj.Field === "Subcontractor Response") {
        known.Subcontractor_Response = obj.Value;
      } else if (obj.Field === "Site Instruction Implementation Comments") {
        known.Site_Instruction_Implementation_Comments = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Project/Contruction Manager") {
        known.Site_Instruction_Contruction_Manager = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsMeterialInspectionRequest(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsTechnicalSubmittal(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsMethodStatementSubmittal(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsNonConferenceReport(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsRequestForInformation(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsWorkInfomationRequest(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsPrequalificationApproval(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}
function mappingFeildsArchitecturalInspectionRequest(jsonData) {
  try {
    var known = {};
    var DataWithValues = [];
    var dataval = [];
    jsonData.Forms.forEach((obj) => {
      if (obj.Value) {
        DataWithValues.push(obj);
        dataval.push(obj.Field);
      }
    });
    console.log("Feilds", dataval);
    DataWithValues.forEach((obj) => {
      if (obj.Field === "Client") {
        known.Client = obj.Value;
      } else if (obj.Field === "Consultant") {
        known.Consultant = obj.Value;
      } else if (obj.Field === "General Contractor") {
        known.MainContractor = obj.Value;
      } else if (obj.Field === "C&S Contractor") {
        known.Subcontractor = obj.Value;
      } else if (obj.Field === "Project") {
        known.projectName = obj.Value;
      } else if (obj.Field === "Location :") {
        known.location = obj.Value;
      } else if (obj.Field === "Document_title") {
        known.Document_title = obj.Value;
      } else if (obj.Field === "Date:") {
        known.Date = obj.Value;
      } else if (obj.Field === "SDS Reference") {
        known.SDS_REFERENCE = obj.Value;
      } else if (obj.Field === "SDS Title") {
        known.SDS_Title = obj.Value;
      } else if (obj.Field === "Revision:") {
        known.revision_number = obj.Value;
      } else if (obj.Field === "Discipline") {
        known.Discipline = obj.Value;
      } else if (obj.Field === "Description") {
        known.descOfDrawing = obj.Value;
      } else if (obj.Field === "Copies") {
        known.Copies = obj.Value;
      } else if (
        obj.Field === "Ref. Specs/BOQ/Dwg" ||
        obj.Field === "Drawing Number"
      ) {
        known.Ref_Specs_BOQ_Dwg = obj.Value;
      } else if (
        obj.Field === "Location of Use" ||
        obj.Field === "Location of Use:"
      ) {
        known.locationOfUse = obj.Value;
      } else if (obj.Field === "Enclosure") {
        known.Enclosure = obj.Value;
      } else if (obj.Field === "Subcontractor/Supplier") {
        known.subcontractor_Supplier = obj.Value;
      } else if (obj.Field === "Consultant's Remarks:") {
        known.consultant_Remarks = obj.Value;
      } else if (obj.Field === "General Contractor Remarks") {
        known.generalContractor_Remarks = obj.Value;
      } else if (obj.Field === "Status") {
        known.Status = obj.Value;
      } else if (obj.Field === "Name:") {
        known.subcontractorRep = obj.Value;
      }
    });
    // known.extracted_field = console.log("Known", known);
    return known;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

async function getAliases(project_id, doc_cat) {
  try {
    const pools2 = await pools.getPool();
    DatasetsInDbQuery = await pools2.query(
      "SELECT feild,element FROM aliases WHERE project_id = '" +
        project_id +
        "' AND document_category = '" +
        doc_cat +
        "'"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    return DatasetsInDb;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}
document.get("/searchDocument", authorize, async (req, res) => {
  var query = {
    query: {
      match_all: {},
    },
  };

  try {
    const { body } = await client.search({
      // type: '_doc', // uncomment this line if you are using {es} ≤ 6
      body: query,
    });
    console.log("Search results:");
    console.log(body.hits.hits);
    res.json(body.hits.hits);
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server error");
  }
});

document.post("/updateDocumentStatus", authorize, async (req, res) => {
  const { document_id } = req.body;
  console.log("document_id", document_id);
  try {
    const client1 = await client.getEs();
    var index_name = "documents";
    var { body } = await client1.update({
      id: document_id,
      index: index_name,
      body: {
        doc: {
          status: "issued",
        },
      },
      refresh: true,
    });
    console.log("body", body);
    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/updateDocument", authorize, async (req, res) => {
  console.log("req.body", req.body);
  const { values, user, document_id, mapped_values } = req.body;
  console.log("values", values);
  console.log("user", user);
  console.log("document_id", document_id);
  const { Raw_Text, ...rest } = values;
  // Add a document to the index.
  try {
    const client1 = await client.getEs();
    var index_name = "documents";
    var { body } = await client1.update({
      id: document_id,
      index: index_name,
      body: {
        doc: {
          unMapped_field: { Key_Values: rest },

          mapped_field: mapped_values,
        },
      },
      refresh: true,
    });
    console.log("body", body);
    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/updateAliases", authorize, async (req, res) => {
  const { arr } = req.body;
  console.log("arr", arr);

  try {
    const pools2 = await pools.getPool();

    let query1 = format(
      "INSERT INTO aliases (enterprise_id,project_id,user_id,feild,element,document_category) VALUES %L returning *",
      arr
    );

    const DatasetsInDbQuery2 = await pools2.query(query1);

    DatasetsInDb = DatasetsInDbQuery2.rows;
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/getAliases", authorize, async (req, res) => {
  console.log("req", req.body);
  const { project, doc_cat } = req.body;
  console.log("doc_cat", doc_cat);
  try {
    const DatasetsInDb = await getAliases(project.project_id, doc_cat);
    console.log("DatasetsInDb", DatasetsInDb);
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/addDocument", authorize, async (req, res) => {});

const convertLabel = (category) => {
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Submittals" || category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Letters" || category === "Other Letters") {
    category = "other_letters";
  } else if (
    category === "Responsibility Matrix" ||
    category === "Responsibility Matrix"
  ) {
    category = "responsibility_matrix";
  } else if (category === "Tender Addendums") {
    category = "tender_addendums";
  }
  return category;
};
async function deleteDocumentIfAlreadyExists(document) {
  console.log("testing ma c", document);
  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: document.project_id,
              },
            },
            {
              term: {
                document_name: document.document_name,
              },
            },
          ],
        },
      },
    };
    var { body } = await client1.deleteByQuery({
      index: "documents",
      body: query,
    });
    console.log("testing ho rhi hi", body);
    return body;
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
}
document.post("/createDocES", authorize, async (req, res) => {
  const {
    name,
    size,
    lastModified,
    type,
    uploaded_by,
    uploader_id,
    status,
    project_id,
    uploaded_time,
    subContractor,
    sub_category,
    document_status,
    isDeleted,
    isOut,
    otherDocumentCategory,
    height,
  } = req.body;
  var { category } = req.body;
  console.log("req.body1234", req.body);

  const convertCategory = convertLabel(category);
  const convertCategorySub = convertLabel(sub_category);

  const document = {
    project_id: project_id,
    document_name: name,
    document_size: size,
    last_modified: lastModified,
    document_type: type,
    revision_number: 1,
    document_category: convertCategory,
    uploaded_by: uploaded_by,
    uploader_id: uploader_id,
    status: status,
    uploaded_time: uploaded_time,
    subContractor: subContractor,
    sub_category: convertCategorySub,
    document_status: document_status,
    isDeleted: isDeleted,
    mapped_field: {},
    isOut: isOut,
    isRead: false,
    otherDocumentCategory: otherDocumentCategory,
    height: height,
  };
  const res1 = await deleteDocumentIfAlreadyExists(document);
  try {
    const client1 = await client.getEs();
    var { body } = await client1.index({
      index: "documents",
      body: document,
      refresh: true,
    });
    console.log(body);
    res.send(body);
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});
document.post("/createDocMerged", authorize, async (req, res) => {
  const {
    name,
    size,
    lastModified,
    type,
    uploaded_by,
    uploader_id,
    project_id,
    uploaded_time,
    mapped_field,
    isDeleted,
  } = req.body;
  var { category } = req.body;
  console.log("req.body1234", req.body);
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Submittals" || category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Letters" || category === "Other Letters") {
    category = "other_letters";
  } else if (
    category === "Responsibility Matrix" ||
    category === "Responsibility Matrix"
  ) {
    category = "responsibility_matrix";
  } else if (category === "Tender Addendums") {
    category = "tender_addendums";
  }
  const document = {
    project_id: project_id,
    document_name: name,
    document_size: size,
    last_modified: lastModified,
    document_type: type,
    revision_number: 1,
    document_category: category,
    uploaded_by: uploaded_by,
    uploader_id: uploader_id,
    uploaded_time: uploaded_time,
    mapped_field: mapped_field,
    document_status: "Registered",
    isDeleted: isDeleted,
  };
  try {
    const client1 = await client.getEs();
    var { body } = await client1.index({
      index: "documents",
      body: document,
      refresh: true,
    });
    console.log(body);
    res.send(body);
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
document.post("/analyseDoc", authorize, async (req, res) => {
  const doc = req.body;
  console.log("analyseDoc", doc);
  try {
    if (doc.document_category === "Responsibility Matrix") {
      try {
        const response = await axios.get(process.env.backendApi + "/RM", {
          params: {
            BUCKET: "documentsstonai",
            KEY: doc.document_id,
            DOC_INFO: doc,
          },
        });
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    } else if (doc.document_category === "Tender Addendums") {
      try {
        console.log("Inside Tenders ");
        const response = await axios.get(
          process.env.backendApi + "/Addendums",
          {
            params: {
              BUCKET: "documentsstonai",
              KEY: doc.document_id,

              DOC_INFO: doc,
              "S/N": "Question",
              Question: "RFI QUESTION BY BIDDER",
              Answer: "ANSWER BY VAMED",
            },
          }
        );
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    } else if (
      doc.document_category === "Text Contract" ||
      doc.document_category === "Scanned Contract"
    ) {
      var apiType;
      if (doc.document_category === "Text Contract") {
        apiType = "/PdfContract";
      } else {
        // apiType = "/OCRContract";
        apiType = "/DocING";
      }
      console.log("inseideContract", apiType);
      console.log(doc, "docccc");
      try {
        const response = await axios.get(process.env.backendApi + apiType, {
          params: {
            BUCKET: "documentsstonai",
            KEY: doc.document_id,
            NAME: doc.name,
            DOC_INFO: doc,
            project_id: doc.project_id,
            doc_type: doc.document_category,
          },
        });
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    } else if (
      doc.document_category === "Material Submittals" ||
      doc.document_category === "Shop Drawing Submittals" ||
      doc.document_category === "Submittals" ||
      doc.document_category === "Site Instruction" ||
      doc.document_category === "Technical Submittal" ||
      doc.document_category === "Method Statement Submittal" ||
      doc.document_category === "Non Conformance Report" ||
      doc.document_category === "Prequalification Submittal" ||
      doc.document_category === "Request for Information" ||
      doc.document_category === "Work Inspection Request" ||
      doc.document_category === "Meterial Inspection Request" ||
      doc.document_category === "Architectural Inspection Request"
    ) {
      const docCat = convertSubmittalsCatLabel(doc.document_category);
      console.log("docCat", docCat);
      console.log("shoopp", doc.document_category);
      console.log("docxx", doc);
      //Calling Submittals api that will extract the doc and add it to elastic search(index:submittals)
      try {
        const response = await axios.get(
          process.env.backendApi + "/Submittals",
          {
            params: {
              BUCKET: "documentsstonai",
              KEY: doc.document_id,
              DOC_INFO: doc,
              DOC_CATEGORY: docCat,
            },
          }
        );
        console.log("analysed", response);
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    } else if (doc.document_category === "BOQ") {
      try {
        console.log("Inside BOQ ");
        const response = await axios.get(process.env.backendApi + "/BOQ", {
          params: {
            BUCKET: "documentsstonai",
            KEY: doc.document_id,
            DOC_INFO: doc,
          },
        });
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    } else if (doc.document_category === "MOM") {
      try {
        console.log("Inside MOM ");
        // const response = await axios.get(process.env.backendApi + "/MOM", {
        const response = await axios.get(process.env.backendApi + "/DocING", {
          params: {
            BUCKET: "documentsstonai",
            KEY: doc.document_id,
            NAME: doc.name,
            DOC_INFO: doc,
            project_id: doc.project_id,
            doc_type: doc.document_category,
          },
        });
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    } else if (doc.document_category === "Other") {
      console.log("It came here");
      try {
        // const response = await axios.get(
        //   process.env.backendApi + "/OCRContract",
        //   {
        const response = await axios.get(process.env.backendApi + "/DocING", {
          params: {
            BUCKET: "documentsstonai",
            KEY: doc.document_id,
            NAME: doc.name,
            DOC_INFO: doc,
            project_id: doc.project_id,
            doc_type: doc.document_category,
          },
        });
        console.log("response", response);
      } catch (error) {
        console.log("error", error);
        throw error;
      }
    } else if (doc.document_category === "Bucket") {
      //no analysation needed
    } else {
      try {
        const response = await axios.get(
          process.env.backendApi + "/Submittals",
          {
            params: {
              BUCKET: "documentsstonai",
              KEY: doc.document_id,
              DOC_INFO: doc,
              DOC_CATEGORY: doc.document_category,
            },
          }
        );
        console.log("analysed", response);
      } catch (error) {
        console.error(error.message);
        throw error;
      }
    }
    const convertCategory = convertLabel(doc.document_category);
    //Changing the status of the document

    if (doc.document_category !== "Bucket") {
      const cat = convertLabel(doc.document_category);
      console.log("cate", cat);

      try {
        const client1 = await client.getEs();
        var { body } = await client1.update({
          index: "documents",
          id: doc.document_id,
          body: {
            doc: {
              document_status: "Registered",
              document_category: cat,
            },
          },
          refresh: true,
        });
        console.log(body);
        res.send(body);
      } catch (error) {
        console.error(error.message);
        throw error;
        // res.send("File with similar name already exists! and will not be uploaded");
      }
    } else {
      try {
        const client1 = await client.getEs();
        var { body } = await client1.update({
          index: "documents",
          id: doc.document_id,
          body: {
            doc: {
              document_status: "Bucket",
            },
          },
          refresh: true,
        });
        console.log(body);
        res.send(body);
      } catch (error) {
        console.error(error.message);
        throw error;
        // res.send("File with similar name already exists! and will not be uploaded");
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured during smart extraction");
  }
});
document.post("/create", authorize, async (req, res) => {
  const { name, size, lastModified, type, uploaded_by } = req.body;
  var { category } = req.body;
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Submittals" || category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Letters" || category === "Other Letters") {
    category = "other_letters";
  }
  const cat = convertLabel(category);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO documents (project_id, document_name,document_size,last_modified,document_type,revision_number,document_category,uploaded_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [55, name, size, lastModified, type, 1, cat, uploaded_by]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});

document.get("/get", authorize, async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM documents");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
document.post("/getCategoryEs", authorize, async (req, res) => {
  var { category, project, pageSize, startFrom, currentComp } = req.body;
  console.log("cat", category, project);
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Other Letters") {
    category = "other_letters";
  } else if (category === "Responsibility Matrix") {
    category = "responsibility_matrix";
  } else if (category === "Tender Addendums") {
    category = "tender_addendums";
  } else if (category === "BOQ") {
    category = "BOQ";
  } else if (category === "MOM") {
    category = "MOM";
  }

  try {
    const client1 = await client.getEs();
    var query = {};
    if (currentComp === "IN" || currentComp === "OUT") {
      query = {
        from: startFrom,
        size: pageSize,
        sort: [{ uploaded_time: { order: "desc" } }],
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project.project_id,
                },
              },
              {
                term: {
                  isOut: currentComp === "OUT" ? true : false,
                },
              },
              {
                bool: {
                  should: [
                    {
                      match: {
                        document_status: "Bucket",
                      },
                    },
                    {
                      match: {
                        document_status: "Registered",
                      },
                    },
                  ],
                },
              },
              {
                term: {
                  "document_category.keyword": category,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
            ],
          },
        },
      };
    } else {
      query = {
        from: startFrom,
        size: pageSize,
        sort: [{ uploaded_time: { order: "desc" } }],
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project.project_id,
                },
              },
              {
                bool: {
                  should: [
                    {
                      match: {
                        document_status: "Bucket",
                      },
                    },
                    {
                      match: {
                        document_status: "Registered",
                      },
                    },
                  ],
                },
              },
              {
                term: {
                  "document_category.keyword": category,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
            ],
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    // console.log("body", body.hits.hits);
    res.json({ hits: body.hits.hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
document.post("/getDraftedEs", authorize, async (req, res) => {
  var { project, startFrom } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: 10,
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project.project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
            {
              terms: {
                "status.keyword": ["review", "approved", "drafted"],
              },
            },
          ],
        },
      },
    };

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("body", body.hits.hits);
    res.json({ hits: body.hits.hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/getNextCategoryEs", authorize, async (req, res) => {
  var { category, project, startFrom } = req.body;
  console.log("cat", category, " Start from: ", startFrom);
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Other Letters") {
    category = "other_letters";
  } else if (category === "Responsibility Matrix") {
    category = "responsibility_matrix";
  } else if (category === "Tender Addendums") {
    category = "tender_addendums";
  } else if (category === "Pdf Contract") {
    category = "pdf_contract";
  } else if (category === "OCR Contract") {
    category = "ocr_contract";
  } else if (category === "BOQ") {
    category = "boq";
  } else if (category === "MOM") {
    category = "mom";
  }

  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: 10,
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project.project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
            {
              term: {
                "document_category.keyword": category,
              },
            },
          ],
        },
      },
    };

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("body", body.hits.hits);
    res.json(body.hits.hits);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
document.post("/getCategory", authorize, async (req, res) => {
  var { category } = req.body;
  if (category === "Shop Drawing Submittals") {
    category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    category = "material_submittal";
  } else if (category === "Other Submittals") {
    category = "other_submittal";
  } else if (category === "Approved Letters") {
    category = "approved_letters";
  } else if (category === "Rejected Letters") {
    category = "rejected_letters";
  } else if (category === "Other Letters") {
    category = "other_letters";
  } else if (category === "	Responsibility Matrix") {
    category = "responsibility_matrix";
  }
  console.log("responsibility_matrix", category);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM documents where document_category = '${category}'`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
document.get("/shop_drawing_submittal", authorize, async (req, res) => {
  const pools2 = await pools.getPool();
  DatasetsInDbQuery = await pools2.query(
    `SELECT * FROM documents
        JOIN shop_drawing_submittal ON documents.document_id = shop_drawing_submittal.document_id `
  );
  DatasetsInDb = DatasetsInDbQuery.rows[0];
  res.json(DatasetsInDb);
});
document.get("/material_submittal", authorize, async (req, res) => {
  const pools2 = await pools.getPool();
  DatasetsInDbQuery = await pools2.query(
    `SELECT * FROM documents
        JOIN material_submittal ON documents.document_id = material_submittal.document_id `
  );
  DatasetsInDb = DatasetsInDbQuery.rows[0];
  res.json(DatasetsInDb);
});

function keyConversions(feild) {
  convertionsKey = {
    Name: "document_name.keyword",
    Date: "mapped_field.DATE_1.keyword",
  };
  return convertionsKey[feild];
}
document.post("/getWithFiltersEs", authorize, async (req, res) => {
  var { filters, project, startFrom, pagesize } = req.body;
  console.log("filter", filters);
  var { start_date, end_date, ...restFilters } = filters;
  var dropDownFeilds = ["DISCIPLINE", "STATUS", "Status"];
  var query;
  var category = restFilters.document_category;
  function isEmptyField(key) {
    if (restFilters[key] === "" || typeof restFilters[key] === "undefined") {
      return true;
    } else {
      return false;
    }
  }
  function isDropField(key) {
    if (dropDownFeilds.includes(key)) {
      console.log("doesinclude");
      return true;
    } else {
      console.log("doesnotinclude");
      return false;
    }
  }
  function isADate(key) {
    if (key === "start_date" || key === "end_date") {
      return true;
    } else {
      return false;
    }
  }
  if (category === "Shop Drawing Submittals") {
    restFilters.document_category = "shop_drawing_submittal";
  } else if (category === "Material Submittals") {
    restFilters.document_category = "material_submittal";
  } else if (category === "Other Submittals") {
    restFilters.document_category = "other_submittal";
  } else if (category === "Approved Letters") {
    restFilters.document_category = "approved_letters";
  } else if (category === "Rejected Letters") {
    restFilters.document_category = "rejected_letters";
  } else if (category === "Other Letters") {
    restFilters.document_category = "other_letters";
  } else if (
    category === "Architectural Inspection Request" ||
    category === "Meterial Inspection Request" ||
    category === "Method Statement Submittal" ||
    category === "Non Conformance Report" ||
    category === "Prequalification Submittal" ||
    category === "Request for Information" ||
    category === "Site Instruction" ||
    category === "Technical Submittal" ||
    category === "Work Inspection Request"
  ) {
    //do nothing
  } else {
    restFilters.document_category = "All";
  }
  console.log("restFilters.document_category", restFilters.document_category);
  var dynamicFiltersList = [];
  if (restFilters.document_category === "All") {
    dynamicFiltersList = [
      { term: { project_id: project.project_id } },
      {
        term: {
          isDeleted: false,
        },
      },
      {
        match: {
          document_status: "Registered",
        },
      },
    ];
  } else {
    dynamicFiltersList = [
      { term: { project_id: project.project_id } },
      {
        term: {
          isDeleted: false,
        },
      },
      { term: { "document_category.keyword": restFilters.document_category } },
      {
        match: {
          document_status: "Registered",
        },
      },
    ];
  }
  var dateFilters = {};
  if (start_date && end_date) {
    dateFilters = {
      range: {
        "mapped_field.DATE_1.keyword": {
          gte: start_date,
          lte: end_date,
        },
      },
    };
    dynamicFiltersList.push(dateFilters);
  } else if (start_date) {
    dateFilters = {
      range: {
        "mapped_field.DATE_1.keyword": {
          gte: start_date,
        },
      },
    };
    dynamicFiltersList.push(dateFilters);
  } else if (end_date) {
    dateFilters = {
      range: {
        "mapped_field.DATE_1.keyword": {
          lte: end_date,
        },
      },
    };
    dynamicFiltersList.push(dateFilters);
  }
  var TagFile = {};
  if (restFilters.Tags.length > 0) {
    TagFile = {
      wildcard: {
        "tags4.keyword": "*" + restFilters.Tags + "*",
      },
    };
    dynamicFiltersList.push(TagFile);
  }
  Comments_BoxFilter = {};
  if (restFilters.Comments_Box?.length > 0) {
    Comments_BoxFilter = {
      bool: {
        should: [
          {
            wildcard: {
              "mapped_field.Comments_Box.keyword":
                "*" + restFilters.Comments_Box + "*",
            },
          },
          {
            wildcard: {
              "mapped_field.Client_Comment.keyword":
                "*" + restFilters.Comments_Box + "*",
            },
          },
        ],
      },
    };
    dynamicFiltersList.push(Comments_BoxFilter);
  }
  var SortFilter = [];
  if (restFilters.Sorting.length > 0) {
    restFilters.Sorting.forEach((element) => {
      const feildCon = keyConversions(element.key);
      var feild = "" + feildCon + "";
      var order;
      if (element["sort_direction"] === "Ascending") {
        order = "asc";
      } else {
        order = "desc";
      }
      SortFilter.push({
        [feild]: { order: order },
      });
    });
  }
  Object.keys(filters).forEach(function (key) {
    var dynamicFilters = {};
    console.log("key", key);
    if (
      !isADate(key) &&
      !isEmptyField(key) &&
      !isDropField(key) &&
      key !== "document_category" &&
      key !== "Tags" &&
      key !== "Sorting" &&
      key !== "Comments_Box"
    ) {
      var dbKey = "mapped_field." + key;

      dynamicFilters = {
        bool: {
          should: [
            {
              prefix: {
                [dbKey]: restFilters[key],
              },
            },
            {
              match: {
                [dbKey]: restFilters[key],
              },
            },
          ],
        },
      };
      dynamicFiltersList.push(dynamicFilters);
    } else if (
      !isADate(key) &&
      !isEmptyField(key) &&
      isDropField(key) &&
      key !== "document_category" &&
      key !== "Tags" &&
      key !== "Sorting" &&
      key !== "Consultant2"
    ) {
      console.log("it is here");
      var dbKey = "mapped_field." + key + ".keyword";

      dynamicFilters = {
        term: {
          [dbKey]: restFilters[key],
        },
      };
      dynamicFiltersList.push(dynamicFilters);
    }
  });

  console.log("SortFilter", SortFilter);
  query = {
    from: startFrom,
    size: pagesize,
    sort: SortFilter,
    query: {
      bool: {
        must: dynamicFiltersList,
      },
    },
  };
  console.log("query", JSON.stringify(query));

  console.log("cota", category);
  console.log("filters", filters);
  try {
    const client1 = await client.getEs();
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("boday", body.hits.hits);
    res.send({ hits: body.hits.hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});
document.post("/getNextWithFiltersEs", authorize, async (req, res) => {
  var { filters, project, startFrom } = req.body;
  console.log("filter", filters);
  var query;
  var category = filters.document_category;
  if (!filters.keword_search) {
    filters.keword_search = "*";
  }
  if (typeof filters.end_date === "undefined") {
    filters.end_date = "now()";
  }
  if (typeof filters.start_date === "undefined") {
    filters.start_date = "1900-01-01";
  }
  if (filters.contractor === null || filters.contractor === "ALL") {
    filters.contractor = "";
  }
  if (category === "Shop Drawing Submittals") {
    filters.document_category = "shop_drawing_submittal";
    query = {
      from: startFrom,
      size: 10,
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              term: {
                isDeleted: false,
              },
            },
            { match: { document_category: filters.document_category } },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Status": filters.status,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Status": filters.status,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Discipline": filters.discipline,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Discipline": filters.discipline,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.MainContractor": filters.main_contractor,
                    },
                  },
                  {
                    match: {
                      "mapped_field.MainContractor": filters.main_contractor,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.SDS_REFERENCE": filters.sds_ref,
                    },
                  },
                  {
                    match: {
                      "mapped_field.SDS_REFERENCE": filters.sds_ref,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.SDS_Title": filters.sds_title,
                    },
                  },
                  {
                    match: {
                      "mapped_field.SDS_Title": filters.sds_title,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.projectName": filters.project,
                    },
                  },
                  {
                    match: {
                      "mapped_field.projectName": filters.project,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.location": filters.location,
                    },
                  },
                  {
                    match: {
                      "mapped_field.location": filters.location,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Client": filters.client,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Client": filters.client,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Consultant": filters.consultant,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Consultant": filters.consultant,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Subcontractor": filters.subcontractor,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Subcontractor": filters.subcontractor,
                    },
                  },
                ],
              },
            },
          ],
          // filter: [
          //   {
          //     match: {
          //       "mapped_field.MainContractor": filters.main_contractor,
          //     },
          //   },
          // ],
        },
      },
    };
  } else if (category === "Material Submittals") {
    filters.document_category = "material_submittal";
    query = {
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            { prefix: { document_category: filters.document_category } },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Submittal_Title": filters.mts_title,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Submittal_Title": filters.mts_title,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Submittal_no": filters.mts_ref,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Submittal_no": filters.mts_ref,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Discipline": filters.discipline,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Discipline": filters.discipline,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.locationOfUse": filters.location_of_use,
                    },
                  },
                  {
                    match: {
                      "mapped_field.locationOfUse": filters.location_of_use,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Project": filters.project,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Project": filters.project,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Location": filters.location,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Location": filters.location,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Status": filters.status,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Status": filters.status,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.MainContractor": filters.main_contractor,
                    },
                  },
                  {
                    match: {
                      "mapped_field.MainContractor": filters.main_contractor,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Client": filters.client,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Client": filters.client,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Consultant": filters.consultant,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Consultant": filters.consultant,
                    },
                  },
                ],
              },
            },
            {
              bool: {
                should: [
                  {
                    prefix: {
                      "mapped_field.Subcontractor": filters.subcontractor,
                    },
                  },
                  {
                    match: {
                      "mapped_field.Subcontractor": filters.subcontractor,
                    },
                  },
                ],
              },
            },
          ],
          // filter: [
          //   { prefix: { SDS_REFERENCE: filters.sds_ref } },
          //   { prefix: { SDS_Title: filters.sds_title } },
          //   { term: { SDS_Title: filters.sds_title } },
          //   // { "range": { "publish_date": { "gte": "2015-01-01" }}}
          // ],
        },
      },
    };
  } else if (category === "Other Submittals") {
    filters.document_category = "other_submittal";
  } else if (category === "Approved Letters") {
    filters.document_category = "approved_letters";
  } else if (category === "Rejected Letters") {
    filters.document_category = "rejected_letters";
  } else if (category === "Other Letters") {
    filters.document_category = "other_letters";
  } else {
    filters.document_category = "All";
    if (!filters.revision_number) {
      filters.revision_number = 1;
    }
    query = {
      from: startFrom,
      size: 10,
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            { match: { revision_number: filters.revision_number } },
            { prefix: { document_type: filters.document_extension } },
            // {
            //   range: {
            //     last_modified: {
            //       gte: filters.start_date,
            //       lte: filters.end_date,
            //     },
            //   },
            // },
            {
              prefix: {
                document_name: {
                  value: filters.document_name,
                  case_insensitive: true,
                },
              },
            },
            // {
            //   term: { document_extension: filters.document_extension },
            // },
          ],
        },
      },
    };
  }

  console.log("cota", category);
  console.log("filters", filters);
  try {
    const client1 = await client.getEs();
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("boday", body.hits.hits);
    res.send(body.hits.hits);
    // const DatasetsInDbQuery = await pools2.query(
    //   "INSERT INTO documents (project_id, document_name,document_size,last_modified,document_type,revision_number,document_category,uploaded_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    //   [55, name, size, lastModified, type, 1, category, uploaded_by]
    // );
    // DatasetsInDb = DatasetsInDbQuery.rows;
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});

document.post("/deleteEs", authorize, async (req, res) => {
  const { name } = req.body;
  console.log("filetodelete", name);
  try {
    const client1 = await client.getEs();
    var index_name = "documents";
    var { body } = await client1.update({
      id: name,
      index: index_name,
      body: {
        doc: {
          isDeleted: true,
        },
      },
      refresh: true,
    });
    console.log("body", body);
    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
document.post("/delete", authorize, async (req, res) => {
  const { name } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `Delete FROM documents where document_name = '${name}'`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/getExtractedFeilds", authorize, async (req, res) => {
  console.log("bodyexx", req.body);
  const { document_id } = req.body;
  console.log("document_id", document_id);
  try {
    const client1 = await client.getEs();
    const { body } = await client1.get({
      index: "documents",
      id: document_id,
    });
    console.log("body", body);
    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

document.post("/searchResponsabilityMatrix", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText } = req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              match: {
                ACTIVITY: searchText,
              },
            },
          ],
        },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "resp_matrix",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post(
  "/searchResponsabilityMatrixFilter",
  authorize,
  async (req, res) => {
    console.log("valeue", req.body);
    const { project, searchText, subContractor } = req.body;

    console.log("project", project, subContractor);
    try {
      const client1 = await client.getEs();
      var query = {
        query: {
          bool: {
            must: [
              {
                term: { project_id: project.project_id },
              },
              {
                term: { "subContractor.keyword": subContractor },
              },
              {
                match: {
                  ACTIVITY: searchText,
                },
              },
            ],
          },
        },
      };

      const { body } = await client1.search({
        index: "resp_matrix",
        body: query,
      });
      var hits = [];
      body.hits.hits.forEach((item) => [
        hits.push({ score: item._score, ...item._source }),
      ]);
      res.json(hits);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);

document.post("/getResponsabilityMatrixDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: 0,
      size: 50,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };

    const { body } = await client1.search({
      index: "resp_matrix",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);

    if (hits[0]["S/N"][0].includes("."))
      current_SN = hits[0]["S/N"][0].split(".")[0].trim();
    else current_SN = hits[0]["S/N"][0].trim();
    var updated_JSON = { [current_SN]: [hits[0]] };

    // ([A])\d+
    // regex: /^([A])\d+/
    hits.forEach((item) => {
      var re = new RegExp(/^([A])\d+/);

      if (item["S/N"][0].match(re)) updated_JSON[current_SN].push(item);
      else {
        if (item["S/N"][0].includes("."))
          current_SN = item["S/N"][0].split(".")[0].trim();
        else current_SN = item["S/N"][0].trim();
        updated_JSON = { ...updated_JSON, [current_SN]: [item] };
      }
    });
    res.json(updated_JSON);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/searchBOQ", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              query_string: {
                query: searchText,
              },
            },
          ],
        },
      },
    };
    const { body } = await client1.search({
      index: "boq_results",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/searchBOQFilter", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText, subContractor } = req.body;
  console.log("project", project, subContractor);

  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            {
              term: { project_id: project.project_id },
            },
            {
              term: { "subContractor.keyword": subContractor },
            },
            {
              query_string: {
                query: searchText,
              },
            },
          ],
        },
      },
    };
    const { body } = await client1.search({
      index: "boq_results",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    console.log("hits", hits);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/getBOQDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: 0,
      size: 5,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "boq_results",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json({ hits: hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/getNextBOQDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;
  const { startFrom } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: 5,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "boq_results",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/searchTenderAddenda", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText } = req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              match: {
                "RFI QUESTION BY BIDDER": searchText,
              },
            },
          ],
        },
      },
    };
    // var query = {
    //   query: {
    //     match: {
    //       "RFI QUESTION BY BIDDER": searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "addenda",
      body: query,
    });
    console.log("body", body);
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    body.hits.hits.forEach((item) => console.log("item", item));
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/searchTenderAddendaFilter", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText, subContractor } = req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project.project_id,
              },
            },

            {
              term: {
                "subContractor.keyword": subContractor,
              },
            },
            {
              match: {
                "RFI QUESTION BY BIDDER": searchText,
              },
            },
          ],
        },
      },
    };
    // var query = {
    //   query: {
    //     match: {
    //       "RFI QUESTION BY BIDDER": searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "addenda",
      body: query,
    });
    console.log("body", body);
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    body.hits.hits.forEach((item) => console.log("item", item));
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
// document.post("/searchMOM", authorize, async (req, res) => {
//   console.log("valeue", req.body);
//   const { project, searchText, searchType } = req.body;

//   console.log("project", project);
//   try {
//     console.log(
//       `     http://13.234.48.115:8080/GenQA?question=${encodeURIComponent(
//         searchText
//       )} &PROJECT_ID= ${project.project_id} &DOCUMEN_TYPE= ${searchType}`,
//       "request url"
//     );
//     let response = await axios.get(
//       `http://13.234.48.115:8080/GenQA?question=${encodeURIComponent(
//         searchText
//       )}&PROJECT_ID= ${project.project_id} &DOCUMEN_TYPE= ${searchType}`
//     );
//     console.log(response);
//     res.status(200).send(response.data);
//     return response;
//     // const client1 = await client.getEs();
//     // var query = {
//     //   query: {
//     //     bool: {
//     //       must: [
//     //         { term: { project_id: project.project_id } },
//     //         {
//     //           bool: {
//     //             should: [
//     //               {
//     //                 match: {
//     //                   Label: searchText,
//     //                 },
//     //               },
//     //               {
//     //                 match: {
//     //                   Text: searchText,
//     //                 },
//     //               },
//     //             ],
//     //           },
//     //         },
//     //       ],
//     //     },
//     //   },
//     // };

//     // const { body } = await client1.search({
//     //   index: "mom_body_extractions",
//     //   body: query,
//     // });
//     // console.log("body", body);
//     // var hits = [];
//     // body.hits.hits.forEach((item) => [
//     //   hits.push({ score: item._score, ...item._source }),
//     // ]);
//     // body.hits.hits.forEach((item) => console.log("item", item));
//     // res.json(hits);
//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send("An error occured, please try again later");
//   }
// });
document.post("/searchMOM", authorize, async (req, res) => {
  console.log("value", req.body);
  const { project, searchText, searchType } = req.body;

  console.log("project", project);
  try {
    const backendUrl = `${
      process.env.backendApi
    }/GenQA?question=${encodeURIComponent(searchText)}&PROJECT_ID= ${
      project.project_id
    } &DOCUMEN_TYPE= ${searchType}`;
    console.log(`Request URL: ${backendUrl}`);
    let response = await axios.get(backendUrl);
    console.log(response);
    res.status(200).send(response.data);
    return response;
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occurred, please try again later");
  }
});

// document.post("/searchMOM", authorize, async (req, res) => {
//   console.log("valeue", req.body);
//   const { project, searchText, searchType } = req.body;

//   console.log("project", project);
//   try {
//     console.log(
//       `     http://13.235.33.150:8080/GenQA?question=${encodeURIComponent(
//         searchText
//       )} &PROJECT_ID= ${project.project_id} &DOCUMEN_TYPE= ${searchType}`,
//       "request url"
//     );
//     let response = await axios.get(
//       `http://13.235.33.150:8080/GenQA?question=${encodeURIComponent(
//         searchText
//       )}&PROJECT_ID= ${project.project_id} &DOCUMEN_TYPE= ${searchType}`
//     );
//     console.log(response);
//     res.status(200).send(response.data);
//     return response;

//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send("An error occured, please try again later");
//   }
// });

document.post("/searchMOMFilter", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText, Subcontractor } = req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            {
              term: { project_id: project.project_id },
            },
            {
              term: { "subContractor.keyword": subContractor },
            },
            {
              bool: {
                should: [
                  {
                    match: {
                      Label: searchText,
                    },
                  },
                  {
                    match: {
                      Text: searchText,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const { body } = await client1.search({
      index: "mom_body_extractions",
      body: query,
    });
    console.log("body", body);
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    body.hits.hits.forEach((item) => console.log("item", item));
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/getMOM", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: 0,
      size: 5,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "mom_body_extractions",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json({ hits: hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/getNextMOM", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;
  const { startFrom } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: 5,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "mom_body_extractions",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/getTenderAddendaDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: 0,
      size: 5,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "addenda",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json({ hits: hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/getNextTenderAddendaDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;
  const { startFrom } = req.body;
  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: 5,
      query: {
        term: { "document_id.keyword": document_id },
      },
    };
    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: "addenda",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
//This api is also for OCR too, not just pdf
// document.post("/searchPdfContractText", authorize, async (req, res) => {
//   console.log("valeue", req.body);
//   const { project, searchText, searchType } = req.body;

//   console.log("project", project);
//   try {
//     console.log(

//       `http://13.235.33.150:8080/GenQA?question=${encodeURIComponent(

//         searchText
//       )}  &PROJECT_ID= ${project.project_id} &DOCUMEN_TYPE= ${searchType}`,
//       "request url"
//     );

//     let response = await axios.get(

//       `http://13.235.33.150:8080/GenQA?question=${encodeURIComponent(

//         searchText
//       )}  &PROJECT_ID= ${project.project_id} &DOCUMEN_TYPE= ${searchType}`
//     );
//     console.log(response);
//     res.status(200).send(response.data);
//     return response;

//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send("An error occured, please try again later");
//   }
// });
document.post("/searchPdfContractText", authorize, async (req, res) => {
  console.log("value", req.body);
  const { project, searchText, searchType } = req.body;

  console.log("project", project);
  try {
    const backendUrl = `${
      process.env.backendApi
    }/GenQA?question=${encodeURIComponent(searchText)} &PROJECT_ID= ${
      project.project_id
    } &DOCUMEN_TYPE= ${searchType}`;
    console.log(`Request URL: ${backendUrl}`);

    let response = await axios.get(backendUrl);
    console.log(response);
    res.status(200).send(response.data);
    return response;
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occurred, please try again later");
  }
});

// document.post("/searchOtherText", authorize, async (req, res) => {
//   console.log("valeue", req.body);
//   const { project, searchText, searchType } = req.body;

//   console.log("project", project);
//   try {
//     console.log(

//   } catch (error) {
//     console.error(error.message);
//     res.status(400).send("An error occured, please try again later");
//   }
// });
document.post("/searchOtherText", authorize, async (req, res) => {
  console.log("value", req.body);
  const { project, searchText, searchType } = req.body;

  console.log("project", project);
  try {
    const backendUrl = `${
      process.env.backendApi
    }/GenQA?question=${encodeURIComponent(searchText)} &PROJECT_ID= ${
      project.project_id
    } &DOCUMEN_TYPE= ${searchType}`;
    console.log(`Request URL: ${backendUrl}`);

    let response = await axios.get(backendUrl);
    console.log(response);
    res.status(200).send(response.data);
    return response;
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occurred, please try again later");
  }
});

document.post("/searchOtherTable", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              query_string: {
                query: searchText,
              },
            },
          ],
        },
      },
    };
    const { body } = await client1.search({
      index: "others_tables",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

//This api is also for OCR too, not just pdf
document.post("/searchPdfContractTextFilter", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText, subContractor } = req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();

    var query = {
      size: 5,
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              term: {
                "subContractor.keyword": subContractor,
              },
            },
            {
              bool: {
                should: [
                  { match: { Heading: searchText } },
                  { match: { Text: searchText } },
                ],
              },
            },
          ],
        },
      },
    };

    // var query = {
    //   query: {
    //     bool: {
    //       should: [
    //         {
    //           bool: {
    //             must: [
    //               {
    //                 term: {
    //                   project_id: project.project_id,
    //                 },
    //               },
    //               {
    //                 term: {
    //                   "subContractor.keyword": subContractor,
    //                 },
    //               },
    //               {
    //                 query_string: {
    //                   query: searchText,
    //                 },
    //               },
    //             ],
    //             filter: [
    //               {
    //                 terms: {
    //                   _index: [
    //                     "pdf_contracts_texts_bordered_tables",
    //                     "pdf_contracts_borderless_tables",
    //                   ],
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //         {
    //           bool: {
    //             must: [
    //               {
    //                 term: {
    //                   project_id: project.project_id,
    //                 },
    //               },
    //               {
    //                 term: {
    //                   "subContractor.keyword": subContractor,
    //                 },
    //               },
    //               {
    //                 bool: {
    //                   should: [
    //                     // {
    //                     //   match: {
    //                     //     Heading: searchText,
    //                     //   },
    //                     // },
    //                     {
    //                       match: {
    //                         Text: searchText,
    //                       },
    //                     },
    //                   ],
    //                 },
    //               },
    //             ],
    //             filter: [
    //               {
    //                 terms: {
    //                   _index: ["pdf_contracts_texts", "ocr_contracts_texts"],
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   size: 10,
    // };

    const { body } = await client1.search({
      index: ["pdf_contracts_texts", "ocr_contracts_texts"],
      body: query,
    });
    console.log("body", body);
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    body.hits.hits.forEach((item) => console.log("item", item));
    var result = [];
    hits.forEach((a) => {
      if (a.Heading) {
        a = a.Heading.replace(/;|“|’/g, "");
        result.push(a);
      }
    });
    res.json(hits);
    console.log("LENGTH OF REPLY", hits.length);
    console.log("hits", hits);
    console.log("REUSL", result);
    console.log("question", searchText);
    apiType = "/BERT";
    // try {
    //   const response = await axios.post(
    //     process.env.backendApi +
    //       "/BERT?TEXTS=" +
    //       JSON.stringify(
    //         result.slice(0, result.length < 5 ? result.length : 5)
    //       ) +
    //       "&QUESTION=" +
    //       JSON.stringify(searchText) +
    //       ""
    //   );
    //   console.log("response", response.data);
    //   if (hits.length < 5) length = hits.length;
    //   else length = 5;
    //   var response2 = {
    //     answers: response.data.data,
    //     context: hits,
    //   };
    //   res.json(response2);
    // } catch (error) {
    //   console.log("error", error);
    //   throw error;
    // }
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/searchOtherTextFilter", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText, subContractor, otherDocumentCategory } =
    req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();
    var filterList = [
      { term: { project_id: project.project_id } },
      {
        bool: {
          should: [
            { match: { Heading: searchText } },
            { match: { Text: searchText } },
          ],
        },
      },
    ];
    if (typeof subContractor !== "undefined") {
      filterList.push({
        term: {
          "subContractor.keyword": subContractor,
        },
      });
    }
    if (typeof otherDocumentCategory !== "undefined") {
      filterList.push({
        term: {
          "otherDocumentCategory.keyword": otherDocumentCategory,
        },
      });
    }
    console.log(filterList);
    var query = {
      size: 5,
      query: {
        bool: {
          must: filterList,
        },
      },
    };

    const { body } = await client1.search({
      index: ["others_texts"],
      body: query,
    });
    console.log("body", body);
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    body.hits.hits.forEach((item) => console.log("item", item));
    var result = [];
    hits.forEach((a) => {
      if (a.Heading) {
        a = a.Heading.replace(/;|“|’/g, "");
        result.push(a);
      }
    });
    res.json(hits);
    console.log("LENGTH OF REPLY", hits.length);
    console.log("hits", hits);
    console.log("REUSL", result);
    console.log("question", searchText);
    apiType = "/BERT";
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/searchOtherTableFilter", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText, subContractor, otherDocumentCategory } =
    req.body;

  console.log("project", project);
  try {
    const client1 = await client.getEs();
    var filterList = [
      { term: { project_id: project.project_id } },
      {
        query_string: {
          query: searchText,
        },
      },
    ];
    if (typeof subContractor !== "undefined") {
      filterList.push({
        term: {
          "subContractor.keyword": subContractor,
        },
      });
    }
    if (typeof otherDocumentCategory !== "undefined") {
      filterList.push({
        term: {
          "otherDocumentCategory.keyword": otherDocumentCategory,
        },
      });
    }
    console.log(filterList);
    var query = {
      size: 5,
      query: {
        bool: {
          must: filterList,
        },
      },
    };

    const { body } = await client1.search({
      index: "others_tables",
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/getPdfContractDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      size: 5,
      query: {
        match: { document_id: document_id },
      },
    };

    // var query = {
    //   query: {
    //     match: {
    //       ACTIVITY: searchText,
    //     },
    //   },
    //   query: {
    //     match: {
    //       project_id: project.project_id,
    //     },
    //   },
    // };
    const { body } = await client1.search({
      index: ["pdf_contracts_texts", "ocr_contracts_texts"],
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/getNextPdfContractDoc", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { document_id } = req.body;
  const { startFrom } = req.body;
  const { endOfDocument } = req.body;
  if (!endOfDocument) {
    try {
      const client1 = await client.getEs();
      var query = {
        from: startFrom,
        size: 5,
        query: {
          term: { "document_id.keyword": document_id },
        },
      };

      // var query = {
      //   query: {
      //     match: {
      //       ACTIVITY: searchText,
      //     },
      //   },
      //   query: {
      //     match: {
      //       project_id: project.project_id,
      //     },
      //   },
      // };
      const { body } = await client1.search({
        index: ["pdf_contracts_texts", "ocr_contracts_texts"],
        body: query,
      });
      var hits = [];
      body.hits.hits.forEach((item) => [
        hits.push({ score: item._score, ...item._source }),
      ]);
      res.json(hits);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
});

document.post("/searchPdfContractTable", authorize, async (req, res) => {
  console.log("valeue", req.body);
  const { project, searchText } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      query: {
        bool: {
          must: [
            { term: { project_id: project.project_id } },
            {
              query_string: {
                query: searchText,
              },
            },
          ],
        },
      },
    };
    const { body } = await client1.search({
      index: [
        "pdf_contracts_texts_bordered_tables",
        "pdf_contracts_borderless_tables",
      ],
      body: query,
    });
    var hits = [];
    body.hits.hits.forEach((item) => [
      hits.push({ score: item._score, ...item._source }),
    ]);
    res.json(hits);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

//Documents stats for dashboards
document.post("/documentStats", authorize, async (req, res) => {
  const { project_id } = req.body;

  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },

            {
              match_phrase: {
                document_category: "shop_drawing_submittal",
              },
            },
          ],
        },
      },
      aggs: {
        shopdrawing_status_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsMaterial", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },

            {
              match_phrase: {
                document_category: "material_submittal",
              },
            },
          ],
        },
      },
      aggs: {
        material_submittal_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsMethod", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client2 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },

            {
              match_phrase: {
                document_category: "Method Statement Submittal",
              },
            },
          ],
        },
      },
      aggs: {
        method_statement_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client2.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/documentStatsPre", authorize, async (req, res) => {
  const { project_id } = req.body;

  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },

            {
              match_phrase: {
                document_category: "Prequalification Submittal",
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
          ],
        },
      },
      aggs: {
        Prequalification_status_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("pre", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsTechnical", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },

            {
              match_phrase: {
                document_category: "Technical Submittal",
              },
            },
          ],
        },
      },
      aggs: {
        material_submittal_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsReq", authorize, async (req, res) => {
  const { project_id } = req.body;

  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },

            {
              match_phrase: {
                document_category: "Request for Information",
              },
            },
          ],
        },
      },
      aggs: {
        material_submittal_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.get("/documentStatsUpload", authorize, async (req, res) => {
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,
      query: {
        bool: {
          must: {
            range: {
              uploaded_time: {
                from: "now-1w",
                include_lower: true,
                include_upper: true,
              },
            },
          },
        },
      },
      aggs: {
        group_by_week: {
          date_histogram: {
            field: "uploaded_time",
            calendar_interval: "1d",
          },
          aggs: {
            group_by_Type: {
              terms: {
                field: "document_category.keyword",
              },
            },
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/documentStatsFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match: {
                  document_category: "shop_drawing_submittal",
                },
              },
            ],
          },
        },
        aggs: {
          shopdrawing_status_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match: {
                  document_category: "shop_drawing_submittal",
                },
              },
            ],
          },
        },
        aggs: {
          shopdrawing_status_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/documentStatsMaterialFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match: {
                  document_category: "material_submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match: {
                  document_category: "material_submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsMethodFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Method Statement Submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Method Statement Submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsPreFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Prequalification Submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Prequalification Submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsTechnicalFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Technical Submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Technical Submittal",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});
document.post("/documentStatsReqFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Request for Information",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match_phrase: {
                  document_category: "Request for Information",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/totalDocumentStats", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
          ],
        },
      },
    };
    const { body } = await client1.count({
      index: "documents",
      body: query,
    });
    console.log("total docs", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/totalContractStats", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              bool: {
                should: [
                  { match: { document_category: "pdf_contract" } },
                  { match: { document_category: "ocr_contract" } },
                ],
              },
            },
          ],
        },
      },
    };
    const { body } = await client1.count({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post(
  "/getAllDocumentsNamesForThisProject",
  authorize,
  async (req, res) => {
    const { project_id } = req.body;
    try {
      const client1 = await client.getEs();
      var query = {
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },
            ],
          },
        },
        fields: ["document_name", "document_category"],
        _source: false,
      };
      console.log("project_id", project_id);
      const { body } = await client1.search({
        index: "documents",
        body: query,
        size: 10000,
      });
      console.log("bodyyy", body);
      res.json(body.hits.hits);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);
// document.get("/awin", authorize, async (req, res) => {
//   var current_SN = ""
//   if (test_json[0]['S/N'][0].includes("."))
//     current_SN = test_json[0]['S/N'][0].split('.')[0].trim()
//   else
//     current_SN = test_json[0]['S/N'][0].trim()
//   updated_JSON = { [current_SN]: [test_json[0]] }

//   // ([A])\d+
//   test_json.forEach(item => {
//     if (item["S/N"][0].match(/^([A])\d+/))
//       updated_JSON[current_SN].push(item)
//     else {
//       if (item['S/N'][0].includes("."))
//         current_SN = item['S/N'][0].split('.')[0].trim()
//       else
//         current_SN = item['S/N'][0].trim()
//       updated_JSON = { ...updated_JSON, [current_SN]: [item] }

//     }
//   })
//   console.log(updated_JSON)
//   res.json(updated_JSON);

// });

document.post(
  "/documentStatsMaterialInspection",
  authorize,
  async (req, res) => {
    const { project_id } = req.body;
    try {
      const client1 = await client.getEs();

      var query = {
        size: 0,

        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                term: {
                  isDeleted: false,
                },
              },

              {
                match_phrase: {
                  document_category: "Meterial Inspection Request",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
      const { body } = await client1.search({
        index: "documents",
        body: query,
      });
      console.log("bodyyy", body);

      res.json(body);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);

document.post(
  "/documentStatsMaterialIspectionFilter",
  authorize,
  async (req, res) => {
    let { project_id, contractor, start_date, enddate } = req.body;
    console.log(project_id, contractor, start_date, enddate);

    if (!start_date) {
      start_date = "1900-12-21";
    }
    if (!enddate) {
      enddate = "2090-12-21";
    }

    try {
      const client1 = await client.getEs();

      if (contractor) {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },
                {
                  term: {
                    isDeleted: false,
                  },
                },
                {
                  match: {
                    "mapped_field.MainContractor": contractor,
                  },
                },
                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Meterial Inspection Request",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.INSPECTION_STATUS.keyword",
              },
            },
          },
        };
      } else {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },

                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Meterial Inspection Request",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.INSPECTION_STATUS.keyword",
              },
            },
          },
        };
      }

      const { body } = await client1.search({
        index: "documents",
        body: query,
      });
      console.log("bodyyy", body);

      res.json(body);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);

/////////////////////////

document.post("/documentStatsSiteInstruction", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
            {
              match_phrase: {
                document_category: "Site Instruction",
              },
            },
          ],
        },
      },
      aggs: {
        site_instruction_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post(
  "/documentStatsSiteInstructionFilter",
  authorize,
  async (req, res) => {
    let { project_id, contractor, start_date, enddate } = req.body;
    console.log(project_id, contractor, start_date, enddate);

    if (!start_date) {
      start_date = "1900-12-21";
    }
    if (!enddate) {
      enddate = "2090-12-21";
    }

    try {
      const client1 = await client.getEs();

      if (contractor) {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },
                {
                  match: {
                    "mapped_field.MainContractor": contractor,
                  },
                },
                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Site Instruction",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.STATUS.keyword",
              },
            },
          },
        };
      } else {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },

                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Site Instruction",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.STATUS.keyword",
              },
            },
          },
        };
      }

      const { body } = await client1.search({
        index: "documents",
        body: query,
      });
      console.log("bodyyy", body);

      res.json(body);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);

document.post("/documentStatsWorkClearance", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
            {
              match_phrase: {
                document_category: "Work Inspection Request",
              },
            },
          ],
        },
      },
      aggs: {
        material_submittal_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post(
  "/documentStatsWorkClearanceFiltr",
  authorize,
  async (req, res) => {
    let { project_id, contractor, start_date, enddate } = req.body;
    console.log(project_id, contractor, start_date, enddate);

    if (!start_date) {
      start_date = "1900-12-21";
    }
    if (!enddate) {
      enddate = "2090-12-21";
    }

    try {
      const client1 = await client.getEs();

      if (contractor) {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },
                {
                  match: {
                    "mapped_field.MainContractor": contractor,
                  },
                },
                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Work Inspection Request",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.STATUS.keyword",
              },
            },
          },
        };
      } else {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },

                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Work Inspection Request",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.STATUS.keyword",
              },
            },
          },
        };
      }

      const { body } = await client1.search({
        index: "documents",
        body: query,
      });
      console.log("bodyyy", body);

      res.json(body);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);
document.post("/documentStatsNonConformance", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },

            {
              match_phrase: {
                document_category: "Non Conformance Report",
              },
            },
          ],
        },
      },
      aggs: {
        material_submittal_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post(
  "/documentStatsNonConformanceFilter",
  authorize,
  async (req, res) => {
    let { project_id, contractor, start_date, enddate } = req.body;
    console.log(project_id, contractor, start_date, enddate);

    if (!start_date) {
      start_date = "1900-12-21";
    }
    if (!enddate) {
      enddate = "2090-12-21";
    }

    try {
      const client1 = await client.getEs();

      if (contractor) {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },
                {
                  match: {
                    "mapped_field.MainContractor": contractor,
                  },
                },
                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Non Conformance Report",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.STATUS.keyword",
              },
            },
          },
        };
      } else {
        var query = {
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    project_id: project_id,
                  },
                },

                {
                  range: {
                    uploaded_time: {
                      gte: start_date,
                      lte: enddate,
                    },
                  },
                },
                {
                  match: {
                    document_category: "Non Conformance Report",
                  },
                },
              ],
            },
          },
          aggs: {
            material_submittal_category_count: {
              terms: {
                field: "mapped_field.STATUS.keyword",
              },
            },
          },
        };
      }

      const { body } = await client1.search({
        index: "documents",
        body: query,
      });
      console.log("bodyyy", body);

      res.json(body);
    } catch (error) {
      console.error(error.message);
      res.status(400).send("An error occured, please try again later");
    }
  }
);
document.post("/documentStatsArchit", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const client1 = await client.getEs();

    var query = {
      size: 0,

      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                isDeleted: false,
              },
            },
            {
              match_phrase: {
                document_category: "Architectural Inspection Request",
              },
            },
          ],
        },
      },
      aggs: {
        material_submittal_category_count: {
          terms: {
            field: "mapped_field.STATUS.keyword",
          },
        },
      },
    };
    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/documentStatsArchitFilter", authorize, async (req, res) => {
  let { project_id, contractor, start_date, enddate } = req.body;
  console.log(project_id, contractor, start_date, enddate);

  if (!start_date) {
    start_date = "1900-12-21";
  }
  if (!enddate) {
    enddate = "2090-12-21";
  }

  try {
    const client1 = await client.getEs();

    if (contractor) {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },
              {
                match: {
                  "mapped_field.MainContractor": contractor,
                },
              },
              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match: {
                  document_category: "Architectural Inspection Request",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    } else {
      var query = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  project_id: project_id,
                },
              },

              {
                range: {
                  uploaded_time: {
                    gte: start_date,
                    lte: enddate,
                  },
                },
              },
              {
                match: {
                  document_category: "Architectural Inspection Request",
                },
              },
            ],
          },
        },
        aggs: {
          material_submittal_category_count: {
            terms: {
              field: "mapped_field.STATUS.keyword",
            },
          },
        },
      };
    }

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("bodyyy", body);

    res.json(body);
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occured, please try again later");
  }
});

document.post("/getColumns", authorize, async (req, res) => {
  const { user_id, category } = req.body;

  try {
    const pools2 = await pools.getPool();

    const DatasetsInDbQuery2 = await pools2.query(
      "SELECT columns FROM user_documentList_columns WHERE user_id=$1 AND category=$2",
      [user_id, category]
    );

    DatasetsInDb = DatasetsInDbQuery2.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
document.post("/check-categories", authorize, async (req, res) => {
  const { projectId, userId, category } = req.body;
  const pools2 = await pools.getPool();
  try {
    // First, check if the category exists
    const categoryCheckResult = await pools2.query(
      "SELECT EXISTS (SELECT  1 FROM mappedkeys WHERE project_id = $1 AND user_id = $2 AND category = $3)",
      [projectId, userId, category]
    );

    const categoryExists = categoryCheckResult.rows[0].exists;

    // If the category exists, retrieve all keys for that category
    if (categoryExists) {
      const keysResult = await pools2.query(
        "SELECT keys FROM mappedkeys WHERE project_id = $1 AND user_id = $2 AND category = $3",
        [projectId, userId, category]
      );

      // Extract the keys from the result
      const keysArray = keysResult.rows[0].keys
        ? keysResult.rows[0].keys
            .replace(/[{}]/g, "") // Remove curly braces
            .split(",") // Split by commas
            .map((key) => key.trim())
        : [];

      // Sanitize the keys
      const sanitizedKeys = keysArray.map((key) => key.replace(/"/g, ""));

      // Send the sanitized keys along with the categoryExists flag
      res.json({ keys: sanitizedKeys, categoryExists });
    } else {
      // If the category does not exist, send an empty array for keys
      res.json({ keys: [], categoryExists });
    }
  } catch (error) {
    console.error("Error checking categories:", error);
    res.status(500).send("Server error");
  }
});

document.post("/MappedKeysApi", authorize, async (req, res) => {
  console.log("value", req.body);
  const { userInfo, project, mappedValues, docName } = req.body;

  console.log("project", project.project_id);
  console.log("userInfo", userInfo.user_id);
  console.log("enterprise", userInfo.enterprise_id);
  console.log("mapped value", mappedValues);

  try {
    // Extract category and keys from mappedValues
    const entries = Object.entries(mappedValues);
    const pools2 = await pools.getPool();

    for (let [category, keys] of entries) {
      const keysString = JSON.stringify(keys);

      console.log(`Category: ${category}, Keys: ${keysString}`);

      // Check if the category exists
      const checkQuery = await pools2.query(
        `SELECT EXISTS(
           SELECT  1 FROM mappedkeys WHERE category = $1 AND user_id = $2 AND project_id = $3
        )`,
        [category, userInfo.user_id, project.project_id]
      );

      if (checkQuery.rows[0].exists) {
        // If the category exists, update the keys
        await pools2.query(
          `UPDATE mappedkeys SET keys = $1 WHERE category = $2 AND user_id = $3 AND project_id = $4`,
          [keys, category, userInfo.user_id, project.project_id]
        );
      } else {
        // If the category does not exist, insert a new row
        await pools2.query(
          `INSERT INTO mappedkeys(user_id, project_id, category, keys, enterprise_id) VALUES ($1, $2, $3, $4, $5)`,
          [
            userInfo.user_id,
            project.project_id,
            category,
            keys,
            userInfo.enterprise_id,
          ]
        );
      }
    }

    res
      .status(200)
      .send({ success: true, message: "Data processed successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(400).send("An error occurred, please try again later");
  }
});

document.post("/UpdateColumns", authorize, async (req, res) => {
  const { user_id, columns, category } = req.body;
  try {
    const pools2 = await pools.getPool();

    // Step 1: Check if user_id exists
    const checkUserExistsQuery = `
       SELECT EXISTS(SELECT 1 FROM user_documentList_columns WHERE user_id = $1)
     `;
    const {
      rows: [userExists],
    } = await pools2.query(checkUserExistsQuery, [user_id]);

    if (userExists.exists) {
      // Step 2: Check if category exists for the user_id
      const checkCategoryExistsQuery = `
         SELECT EXISTS(SELECT 1 FROM user_documentList_columns WHERE user_id = $1 AND category = $2)
       `;
      const {
        rows: [categoryExists],
      } = await pools2.query(checkCategoryExistsQuery, [user_id, category]);

      if (!categoryExists.exists) {
        // Category doesn't exist, so insert it
        const insertCategoryQuery = `
           INSERT INTO user_documentList_columns (user_id, category,columns)
           VALUES ($1, $2, $3)
         `;
        await pools2.query(insertCategoryQuery, [user_id, category, columns]);
      } else if (categoryExists.exists) {
        const insertCategoryQuery = `
        UPDATE user_documentList_columns
        SET columns = $3::varchar
        WHERE user_id = $1::int4 AND category = $2::varchar;
        
    `;
        await pools2.query(insertCategoryQuery, [user_id, category, columns]);
      }
    } else {
      // Step 4: User_id does not exist, insert new row
      const insertUserQuery = `
         INSERT INTO user_documentList_columns (user_id, columns, category)
         VALUES ($1, $2, $3)
       `;
      await pools2.query(insertUserQuery, [user_id, columns, category]);
    }

    res.json({ message: "Columns and categories updated successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = document;
