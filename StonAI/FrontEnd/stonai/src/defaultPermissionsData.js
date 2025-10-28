import axios from "axios";
import { url } from "./url";

// Default Permissions for Enterprise Admin
export const docRestrictionsEa = {
  Contract: {
    name: "Contract",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  responsibilityMatrix: {
    name: "Responsibility Matrix",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  materialSubmittal: {
    name: "Material Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  shopDrawingSubmittal: {
    name: "Shop Drawing Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  prequalificationSubmittal: {
    name: "Prequalification Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  architecturalInspectionRequest: {
    name: "Architectural Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  materialInspectionRequest: {
    name: "Material Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  methodStatementSubmittal: {
    name: "Method Statement Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  nonConformanceReport: {
    name: "Non Conformance Report",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  requestForInformation: {
    name: "Request For Information",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  siteInstruction: {
    name: "Site Instruction",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  technicalSubmittal: {
    name: "Technical Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  workInspectionRequest: {
    name: "Work Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  minutesOfmeeting: {
    name: "Minutes of Meeting",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },

  boq: {
    name: "BOQ",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  tender: {
    name: "Tender Addendums",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  bucket: {
    name: "Bucket",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
};
export const viewRestrictionsEa = {
  pageWorkSpace: {
    name: "Work Space",
    other: {
      canView: {
        name: "View",
        value: true,
      },

      canViewAssingedTask: {
        name: "Project Tasks",
        value: true,
      },
    },
  },
  pageAISearch: {
    name: "AI Search Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageMail: {
    name: "Mail Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageFolder: {
    name: "Documents",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAccount: {
    name: "User Profile Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAdmin: {
    name: "Admin Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
      canViewUsers: {
        name: "Users",
        value: true,
      },
      // canViewProjects: {
      //   name: "Projects",
      //   value: true,
      // },
      canViewDepartments: {
        name: "Departments",
        value: true,
      },
    },
  },
};
export const actionRestrictionsEa = {
  users: {
    name: "users",
    other: {
      canCreateUsers: {
        name: "Create Users",
        value: true,
      },
      canDeleteUsers: {
        name: "Delete Users",
        value: true,
      },
      canUpdateUsersDetails: {
        name: "Update Users Details",
        value: true,
      },
      canAddUsersToProject: {
        name: "Add Users to Project",
        value: true,
      },
    },
  },
  // projects: {
  //   name: "projects",
  //   other: {
  //     canCreateProjects: {
  //       name: "Create Projects",
  //       value: true,
  //     },
  //     canDeleteProjects: {
  //       name: "Delete Projects",
  //       value: true,
  //     },
  //     canUpdateProjectsDetails: {
  //       name: "Update Project Details",
  //       value: true,
  //     },
  //   },
  // },
  departments: {
    name: "departments",
    other: {
      canCreateDepartments: {
        name: "Create Departments",
        value: true,
      },
      canDeleteDepartments: {
        name: "Delete Departments",
        value: true,
      },
      canUpdateDepartments: {
        name: "Update Departments",
        value: true,
      },
    },
  },
  workSpace: {
    name: "Workspace",
    other: {
      canCreateTask: {
        name: "Create Project Tasks",
        value: true,
      },
      canEditTask: {
        name: "Edit Project Tasks",
        value: true,
      },
      canDeleteTask: {
        name: "Delete Project Tasks",
        value: true,
      },
      canDeleteTaskGroup: {
        name: "Delete Project Tasks Groups",
        value: true,
      },
      canEditTaskGroup: {
        name: "Edit Project Tasks Groups",
        value: true,
      },
    },
  },
  document: {
    name: "document",
    other: {
      canUplaodDocuments: {
        name: "Upload Documents",
        value: true,
      },
      canBulkUploadDocuments: {
        name: "Bulk Upload Documents",
        value: true,
      },
      canApplyForDocExtraction: {
        name: "Apply for Doc Extraction",
        value: true,
      },
    },
  },
};

// Default Permissions for Project Manager
export const docRestrictionsPm = {
  Contract: {
    name: "Contract",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  responsibilityMatrix: {
    name: "Responsibility Matrix",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  materialSubmittal: {
    name: "Material Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  shopDrawingSubmittal: {
    name: "Shop Drawing Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  prequalificationSubmittal: {
    name: "Prequalification Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  architecturalInspectionRequest: {
    name: "Architectural Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  materialInspectionRequest: {
    name: "Material Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  methodStatementSubmittal: {
    name: "Method Statement Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  nonConformanceReport: {
    name: "Non Conformance Report",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  requestForInformation: {
    name: "Request For Information",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  siteInstruction: {
    name: "Site Instruction",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  technicalSubmittal: {
    name: "Technical Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  workInspectionRequest: {
    name: "Work Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  minutesOfmeeting: {
    name: "Minutes of Meeting",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },

  boq: {
    name: "BOQ",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  tender: {
    name: "Tender Addendums",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  bucket: {
    name: "Bucket",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
};
export const viewRestrictionsPm = {
  pageWorkSpace: {
    name: "Work Space",
    other: {
      canView: {
        name: "View",
        value: true,
      },

      canViewAssingedTask: {
        name: "Project Tasks",
        value: true,
      },
    },
  },
  pageAISearch: {
    name: "AI Search Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageMail: {
    name: "Mail Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageFolder: {
    name: "Documents",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAccount: {
    name: "User Profile Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAdmin: {
    name: "Admin Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
      canViewUsers: {
        name: "Users",
        value: true,
      },
      canViewProjects: {
        name: "Projects",
        value: true,
      },
      canViewDepartments: {
        name: "Departments",
        value: true,
      },
    },
  },
};
export const actionRestrictionsPm = {
  users: {
    name: "users",
    other: {
      canCreateUsers: {
        name: "Create Users",
        value: false,
      },
      canDeleteUsers: {
        name: "Delete Users",
        value: false,
      },
      canUpdateUsersDetails: {
        name: "Update Users Details",
        value: false,
      },
      canAddUsersToProject: {
        name: "Add Users to Project",
        value: false,
      },
    },
  },
  // projects: {
  //   name: "projects",
  //   other: {
  //     canCreateProjects: {
  //       name: "Create Projects",
  //       value: true,
  //     },
  //     canDeleteProjects: {
  //       name: "Delete Projects",
  //       value: true,
  //     },
  //     canUpdateProjectsDetails: {
  //       name: "Update Project Details",
  //       value: true,
  //     },
  //   },
  // },
  departments: {
    name: "departments",
    other: {
      canCreateDepartments: {
        name: "Create Departments",
        value: true,
      },
      canDeleteDepartments: {
        name: "Delete Departments",
        value: true,
      },
      canUpdateDepartments: {
        name: "Update Departments",
        value: true,
      },
    },
  },
  workSpace: {
    name: "Workspace",
    other: {
      canCreateTask: {
        name: "Create Project Tasks",
        value: true,
      },
      canEditTask: {
        name: "Edit Project Tasks",
        value: true,
      },
      canDeleteTask: {
        name: "Delete Project Tasks",
        value: true,
      },
      canDeleteTaskGroup: {
        name: "Delete Project Tasks Groups",
        value: true,
      },
      canEditTaskGroup: {
        name: "Edit Project Tasks Groups",
        value: true,
      },
    },
  },
  document: {
    name: "document",
    other: {
      canUplaodDocuments: {
        name: "Upload Documents",
        value: true,
      },
      canBulkUploadDocuments: {
        name: "Bulk Upload Documents",
        value: true,
      },
      canApplyForDocExtraction: {
        name: "Apply for Doc Extraction",
        value: true,
      },
    },
  },
};

// Default Permissions for Document Controller

export const docRestrictionsDc = {
  Contract: {
    name: "Contract",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  responsibilityMatrix: {
    name: "Responsibility Matrix",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  materialSubmittal: {
    name: "Material Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  shopDrawingSubmittal: {
    name: "Shop Drawing Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  prequalificationSubmittal: {
    name: "Prequalification Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  architecturalInspectionRequest: {
    name: "Architectural Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  materialInspectionRequest: {
    name: "Material Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  methodStatementSubmittal: {
    name: "Method Statement Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  nonConformanceReport: {
    name: "Non Conformance Report",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  requestForInformation: {
    name: "Request For Information",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  siteInstruction: {
    name: "Site Instruction",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  technicalSubmittal: {
    name: "Technical Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  workInspectionRequest: {
    name: "Work Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  minutesOfmeeting: {
    name: "Minutes of Meeting",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },

  boq: {
    name: "BOQ",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  tender: {
    name: "Tender Addendums",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  bucket: {
    name: "Bucket",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
};
export const viewRestrictionsDc = {
  pageWorkSpace: {
    name: "Work Space",
    other: {
      canView: {
        name: "View",
        value: true,
      },

      canViewAssingedTask: {
        name: "Project Tasks",
        value: true,
      },
    },
  },
  pageAISearch: {
    name: "AI Search Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageMail: {
    name: "Mail Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageFolder: {
    name: "Documents",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAccount: {
    name: "User Profile Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAdmin: {
    name: "Admin Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
      canViewUsers: {
        name: "Users",
        value: true,
      },
      // canViewProjects: {
      //   name: "Projects",
      //   value: true,
      // },
      canViewDepartments: {
        name: "Departments",
        value: true,
      },
    },
  },
};
export const actionRestrictionsDc = {
  users: {
    name: "users",
    other: {
      canCreateUsers: {
        name: "Create Users",
        value: false,
      },
      canDeleteUsers: {
        name: "Delete Users",
        value: false,
      },
      canUpdateUsersDetails: {
        name: "Update Users Details",
        value: false,
      },
      canAddUsersToProject: {
        name: "Add Users to Project",
        value: false,
      },
    },
  },
  departments: {
    name: "departments",
    other: {
      canCreateDepartments: {
        name: "Create Departments",
        value: false,
      },
      canDeleteDepartments: {
        name: "Delete Departments",
        value: false,
      },
      canUpdateDepartments: {
        name: "Update Departments",
        value: false,
      },
    },
  },
  workSpace: {
    name: "Workspace",
    other: {
      canCreateTask: {
        name: "Create Project Tasks",
        value: true,
      },
      canEditTask: {
        name: "Edit Project Tasks",
        value: true,
      },
      canDeleteTask: {
        name: "Delete Project Tasks",
        value: true,
      },
      canDeleteTaskGroup: {
        name: "Delete Project Tasks Groups",
        value: true,
      },
      canEditTaskGroup: {
        name: "Edit Project Tasks Groups",
        value: true,
      },
    },
  },
  document: {
    name: "document",
    other: {
      canUplaodDocuments: {
        name: "Upload Documents",
        value: true,
      },
      canBulkUploadDocuments: {
        name: "Bulk Upload Documents",
        value: true,
      },
      canApplyForDocExtraction: {
        name: "Apply for Doc Extraction",
        value: true,
      },
    },
  },
};

// Default Permissions for Head of Dept
export const docRestrictionsHod = {
  Contract: {
    name: "Contract",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  responsibilityMatrix: {
    name: "Responsibility Matrix",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  materialSubmittal: {
    name: "Material Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  shopDrawingSubmittal: {
    name: "Shop Drawing Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  prequalificationSubmittal: {
    name: "Prequalification Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  architecturalInspectionRequest: {
    name: "Architectural Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  materialInspectionRequest: {
    name: "Material Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  methodStatementSubmittal: {
    name: "Method Statement Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  nonConformanceReport: {
    name: "Non Conformance Report",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  requestForInformation: {
    name: "Request For Information",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  siteInstruction: {
    name: "Site Instruction",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  technicalSubmittal: {
    name: "Technical Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  workInspectionRequest: {
    name: "Work Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  minutesOfmeeting: {
    name: "Minutes of Meeting",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },

  boq: {
    name: "BOQ",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  tender: {
    name: "Tender Addendums",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  bucket: {
    name: "Bucket",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
};
export const viewRestrictionsHod = {
  pageWorkSpace: {
    name: "Work Space",
    other: {
      canView: {
        name: "View",
        value: true,
      },

      canViewAssingedTask: {
        name: "Project Tasks",
        value: true,
      },
    },
  },
  pageAISearch: {
    name: "AI Search Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageMail: {
    name: "Mail Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageFolder: {
    name: "Documents",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAccount: {
    name: "User Profile Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAdmin: {
    name: "Admin Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
      canViewUsers: {
        name: "Users",
        value: true,
      },
      canViewProjects: {
        name: "Projects",
        value: true,
      },
      canViewDepartments: {
        name: "Departments",
        value: true,
      },
    },
  },
};
export const actionRestrictionsHod = {
  users: {
    name: "users",
    other: {
      canCreateUsers: {
        name: "Create Users",
        value: false,
      },
      canDeleteUsers: {
        name: "Delete Users",
        value: false,
      },
      canUpdateUsersDetails: {
        name: "Update Users Details",
        value: false,
      },
      canAddUsersToProject: {
        name: "Add Users to Project",
        value: false,
      },
    },
  },
  // projects: {
  //   name: "projects",
  //   other: {
  //     canCreateProjects: {
  //       name: "Create Projects",
  //       value: true,
  //     },
  //     canDeleteProjects: {
  //       name: "Delete Projects",
  //       value: true,
  //     },
  //     canUpdateProjectsDetails: {
  //       name: "Update Project Details",
  //       value: true,
  //     },
  //   },
  // },
  departments: {
    name: "departments",
    other: {
      canCreateDepartments: {
        name: "Create Departments",
        value: false,
      },
      canDeleteDepartments: {
        name: "Delete Departments",
        value: false,
      },
      canUpdateDepartments: {
        name: "Update Departments",
        value: false,
      },
    },
  },
  workSpace: {
    name: "Workspace",
    other: {
      canCreateTask: {
        name: "Create Project Tasks",
        value: true,
      },
      canEditTask: {
        name: "Edit Project Tasks",
        value: true,
      },
      canDeleteTask: {
        name: "Delete Project Tasks",
        value: true,
      },
      canDeleteTaskGroup: {
        name: "Delete Project Tasks Groups",
        value: true,
      },
      canEditTaskGroup: {
        name: "Edit Project Tasks Groups",
        value: true,
      },
    },
  },
  document: {
    name: "document",
    other: {
      canUplaodDocuments: {
        name: "Upload Documents",
        value: true,
      },
      canBulkUploadDocuments: {
        name: "Bulk Upload Documents",
        value: true,
      },
      canApplyForDocExtraction: {
        name: "Apply for Doc Extraction",
        value: true,
      },
    },
  },
};

// Default Permissions for Employee
export const docRestrictionsE = {
  Contract: {
    name: "Contract",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  responsibilityMatrix: {
    name: "Responsibility Matrix",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  materialSubmittal: {
    name: "Material Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  shopDrawingSubmittal: {
    name: "Shop Drawing Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  prequalificationSubmittal: {
    name: "Prequalification Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  architecturalInspectionRequest: {
    name: "Architectural Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  materialInspectionRequest: {
    name: "Material Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  methodStatementSubmittal: {
    name: "Method Statement Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  nonConformanceReport: {
    name: "Non Conformance Report",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  requestForInformation: {
    name: "Request For Information",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  siteInstruction: {
    name: "Site Instruction",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  technicalSubmittal: {
    name: "Technical Submittal",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  workInspectionRequest: {
    name: "Work Inspection Request",
    other: {
      canView: { name: "View", value: true },
      canUpdateExtractedFeilds: {
        name: "Update Extracted Feilds",
        value: true,
      },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
      canExportDocumentInfoAsExcelFile: {
        name: "Export Document info as Excel File",
        value: true,
      },
    },
  },
  minutesOfmeeting: {
    name: "Minutes of Meeting",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },

  boq: {
    name: "BOQ",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  tender: {
    name: "Tender Addendums",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
  bucket: {
    name: "Bucket",
    other: {
      canView: { name: "View", value: true },
      canDeleteDocument: { name: "Delete", value: true },
      canDownloadDocument: { name: "Download", value: true },
      canShareDocumentThoughEmail: {
        name: "Share",
        value: true,
      },
    },
  },
};
export const viewRestrictionsE = {
  pageWorkSpace: {
    name: "Work Space",
    other: {
      canView: {
        name: "View",
        value: true,
      },

      canViewAssingedTask: {
        name: "Project Tasks",
        value: true,
      },
    },
  },
  pageAISearch: {
    name: "AI Search Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageMail: {
    name: "Mail Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageFolder: {
    name: "Documents",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAccount: {
    name: "User Profile Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
    },
  },
  pageAdmin: {
    name: "Admin Page",
    other: {
      canView: {
        name: "View",
        value: true,
      },
      canViewUsers: {
        name: "Users",
        value: true,
      },
      canViewProjects: {
        name: "Projects",
        value: true,
      },
      canViewDepartments: {
        name: "Departments",
        value: true,
      },
    },
  },
};
export const actionRestrictionsE = {
  users: {
    name: "users",
    other: {
      canCreateUsers: {
        name: "Create Users",
        value: false,
      },
      canDeleteUsers: {
        name: "Delete Users",
        value: false,
      },
      canUpdateUsersDetails: {
        name: "Update Users Details",
        value: false,
      },
      canAddUsersToProject: {
        name: "Add Users to Project",
        value: false,
      },
    },
  },
  // projects: {
  //   name: "projects",
  //   other: {
  //     canCreateProjects: {
  //       name: "Create Projects",
  //       value: true,
  //     },
  //     canDeleteProjects: {
  //       name: "Delete Projects",
  //       value: true,
  //     },
  //     canUpdateProjectsDetails: {
  //       name: "Update Project Details",
  //       value: true,
  //     },
  //   },
  // },
  departments: {
    name: "departments",
    other: {
      canCreateDepartments: {
        name: "Create Departments",
        value: false,
      },
      canDeleteDepartments: {
        name: "Delete Departments",
        value: false,
      },
      canUpdateDepartments: {
        name: "Update Departments",
        value: false,
      },
    },
  },
  workSpace: {
    name: "Workspace",
    other: {
      canCreateTask: {
        name: "Create Project Tasks",
        value: true,
      },
      canEditTask: {
        name: "Edit Project Tasks",
        value: true,
      },
      canDeleteTask: {
        name: "Delete Project Tasks",
        value: true,
      },
      canDeleteTaskGroup: {
        name: "Delete Project Tasks Groups",
        value: true,
      },
      canEditTaskGroup: {
        name: "Edit Project Tasks Groups",
        value: true,
      },
    },
  },
  document: {
    name: "document",
    other: {
      canUplaodDocuments: {
        name: "Upload Documents",
        value: true,
      },
      canBulkUploadDocuments: {
        name: "Bulk Upload Documents",
        value: true,
      },
      canApplyForDocExtraction: {
        name: "Apply for Doc Extraction",
        value: true,
      },
    },
  },
};
export const rowForDb = {
  canViewContract: true,
  canUpdateExtractedFeildsContract: true,
  canUpdateAliasesContract: true,
  canDeleteDocumentContract: true,
  canDownloadDocumentContract: true,
  canShareDocumentThoughEmailContract: true,
  canShareDocumentThoughStonAiContract: true,
  canExportDocumentInfoAsExcelFileContract: true,
  canExportExtractedDocumentFieldsAsExcelFileContract: true,
  canViewresponsibilityMatrix: true,
  canUpdateExtractedFeildsresponsibilityMatrix: true,
  canUpdateAliasesresponsibilityMatrix: true,
  canDeleteDocumentresponsibilityMatrix: true,
  canDownloadDocumentresponsibilityMatrix: true,
  canShareDocumentThoughEmailresponsibilityMatrix: true,
  canShareDocumentThoughStonAiresponsibilityMatrix: true,
  canExportDocumentInfoAsExcelFileresponsibilityMatrix: true,
  canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix: true,
  canViewmaterialSubmittal: true,
  canUpdateExtractedFeildsmaterialSubmittal: true,
  canUpdateAliasesmaterialSubmittal: true,
  canDeleteDocumentmaterialSubmittal: true,
  canDownloadDocumentmaterialSubmittal: true,
  canShareDocumentThoughEmailmaterialSubmittal: true,
  canShareDocumentThoughStonAimaterialSubmittal: true,
  canExportDocumentInfoAsExcelFilematerialSubmittal: true,
  canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal: true,
  canViewshopDrawingSubmittal: true,
  canUpdateExtractedFeildsshopDrawingSubmittal: true,
  canUpdateAliasesshopDrawingSubmittal: true,
  canDeleteDocumentshopDrawingSubmittal: true,
  canDownloadDocumentshopDrawingSubmittal: true,
  canShareDocumentThoughEmailshopDrawingSubmittal: true,
  canShareDocumentThoughStonAishopDrawingSubmittal: true,
  canExportDocumentInfoAsExcelFileshopDrawingSubmittal: true,
  canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal: true,
  canViewletter: true,
  canUpdateExtractedFeildsletter: true,
  canUpdateAliasesletter: true,
  canDeleteDocumentletter: true,
  canDownloadDocumentletter: true,
  canShareDocumentThoughEmailletter: true,
  canShareDocumentThoughStonAiletter: true,
  canExportDocumentInfoAsExcelFileletter: true,
  canExportExtractedDocumentFieldsAsExcelFileletter: true,
  canViewminutesOfmeeting: true,
  canUpdateExtractedFeildsminutesOfmeeting: true,
  canUpdateAliasesminutesOfmeeting: true,
  canDeleteDocumentminutesOfmeeting: true,
  canDownloadDocumentminutesOfmeeting: true,
  canShareDocumentThoughEmailminutesOfmeeting: true,
  canShareDocumentThoughStonAiminutesOfmeeting: true,
  canExportDocumentInfoAsExcelFileminutesOfmeeting: true,
  canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting: true,
  canViewpageDashboard: true,
  canViewFilterspageDashboard: true,
  canViewEnterpriseStatisticspageDashboard: true,
  canViewProjectStatisticspageDashboard: true,
  canViewDepartmentStatisticspageDashboard: true,
  canViewUserStatisticspageDashboard: true,
  canViewOrganisationalChartpageDashboard: true,
  canViewpageWorkSpace: true,
  canViewMyTaskpageWorkSpace: true,
  canViewAssingedTaskpageWorkSpace: true,
  canFilterTaskpageWorkSpace: true,
  canViewpageAISearch: true,
  canViewpageMail: true,
  canViewpageFolder: true,
  canViewFilterspageFolder: true,
  canViewDocViewerpageFolder: true,
  canViewpageAccount: true,
  canViewpageSetting: true,
  canViewpageAdmin: true,
  canViewUserspageAdmin: true,
  canViewProjectspageAdmin: true,
  canViewDepartmentspageAdmin: true,
  canViewusers: true,
  canCreateUsersusers: true,
  canDeleteUsersusers: true,
  canUpdateUsersDetailsusers: true,
  canAddUsersToProjectusers: true,
  canViewprojects: true,
  canCreateProjectsprojects: true,
  canDeleteProjectsprojects: true,
  canUpdateProjectsDetailsprojects: true,
  canViewdepartments: true,
  canCreateDepartmentsdepartments: true,
  canDeleteDepartmentsdepartments: true,
  canUpdateDepartmentsdepartments: true,
  canViewworkSpace: true,
  canCreateTaskworkSpace: true,
  canEditTaskworkSpace: true,
  canDeleteTaskworkSpace: true,
  NotifyTaskThroughEmailworkSpace: true,
  NotifyTaskThroughStonAiworkSpace: true,
  canAssignTasktoAnyoneInEnterpriseworkSpace: true,
  canAssingTasktoAnyoneInProjectworkSpace: true,
  canAssingTasktoAnyoneIndepartmentworkSpace: true,
  canViewdocument: true,
  canUplaodDocumentsdocument: true,
  canBulkUploadDocumentsdocument: true,
  canApplyForDocExtractiondocument: true,
  canApplyDocClassificationsdocument: true,
};

export function convertDataToRecordForDb(
  docRestriction,
  viewRestriction,
  actionRestriction
) {
  console.log("docRestriction123", docRestriction);
  console.log("viewRestriction", viewRestriction);
  console.log("actionRestriction", actionRestriction);
  var rowForDb = {};
  try {
    rowForDb = {
      canViewContract: docRestriction?.Contract?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsContract:
        docRestriction?.Contract?.other?.canUpdateExtractedFeilds?.value ??
        true,
      canUpdateAliasesContract:
        docRestriction?.Contract?.other?.canUpdateAliases?.value ?? true,
      canDeleteDocumentContract:
        docRestriction?.Contract?.other?.canDeleteDocument?.value ?? true,
      canDownloadDocumentContract:
        docRestriction?.Contract?.other?.canDownloadDocument?.value ?? true,
      canShareDocumentThoughEmailContract:
        docRestriction?.Contract?.other?.canShareDocumentThoughEmail?.value ??
        true,
      canShareDocumentThoughStonAiContract:
        docRestriction?.Contract?.other?.canShareDocumentThoughStonAi?.value ??
        true,
      canViewresponsibilityMatrix:
        docRestriction?.responsibilityMatrix?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsresponsibilityMatrix:
        docRestriction?.Contract?.other?.canUpdateExtractedFeilds?.value ??
        true,
      canUpdateAliasesresponsibilityMatrix:
        docRestriction?.responsibilityMatrix?.other?.canUpdateAliases?.value ??
        true,
      canDeleteDocumentresponsibilityMatrix:
        docRestriction?.responsibilityMatrix?.other?.canDeleteDocument?.value ??
        true,
      canDownloadDocumentresponsibilityMatrix:
        docRestriction?.responsibilityMatrix?.other?.canDownloadDocument
          ?.value ?? true,
      canShareDocumentThoughEmailresponsibilityMatrix:
        docRestriction?.responsibilityMatrix?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canShareDocumentThoughStonAiresponsibilityMatrix:
        docRestriction?.responsibilityMatrix?.other
          ?.canShareDocumentThoughStonAi?.value ?? true,

      canViewmaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsmaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      canUpdateAliasesmaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canUpdateAliases?.value ??
        true,
      canDeleteDocumentmaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canDeleteDocument?.value ??
        true,
      canDownloadDocumentmaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canDownloadDocument?.value ??
        true,
      canShareDocumentThoughEmailmaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canShareDocumentThoughStonAimaterialSubmittal:
        docRestriction?.materialSubmittal?.other?.canShareDocumentThoughStonAi
          ?.value ?? true,
      canExportDocumentInfoAsExcelFilematerialSubmittal:
        docRestriction?.materialSubmittal?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canViewshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      canUpdateAliasesshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other?.canUpdateAliases?.value ??
        true,
      canDeleteDocumentshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other?.canDeleteDocument?.value ??
        true,
      canDownloadDocumentshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other?.canDownloadDocument
          ?.value ?? true,
      canShareDocumentThoughEmailshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canShareDocumentThoughStonAishopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other
          ?.canShareDocumentThoughStonAi?.value ?? true,
      canExportDocumentInfoAsExcelFileshopDrawingSubmittal:
        docRestriction?.shopDrawingSubmittal?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewprequalificationsubmittal:
        docRestriction?.prequalificationSubmittal?.other?.canView?.value ??
        true,
      canupdateextractedfeildsprequalificationsubmittal:
        docRestriction?.prequalificationSubmittal?.other
          ?.canUpdateExtractedFeilds?.value ?? true,
      candeletedocumentprequalificationsubmittal:
        docRestriction?.prequalificationSubmittal?.other?.canDeleteDocument
          ?.value ?? true,
      candownloaddocumentprequalificationsubmittal:
        docRestriction?.prequalificationSubmittal?.other?.canDownloadDocument
          ?.value ?? true,
      cansharedocumentthoughemailprequalificationsubmittal:
        docRestriction?.prequalificationSubmittal?.other
          ?.canShareDocumentThoughEmail?.value ?? true,
      canexportdocumentinfoasexcelfileprequalificationsubmittal:
        docRestriction?.prequalificationSubmittal?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewarchitecturalinspectionrequest:
        docRestriction?.architecturalInspectionRequest?.other?.canView?.value ??
        true,
      canupdateextractedfeildsarchitecturalinspectionrequest:
        docRestriction?.architecturalInspectionRequest?.other
          ?.canUpdateExtractedFeilds?.value ?? true,
      candeletedocumentarchitecturalinspectionrequest:
        docRestriction?.architecturalInspectionRequest?.other?.canDeleteDocument
          ?.value ?? true,
      candownloaddocumentarchitecturalinspectionrequest:
        docRestriction?.architecturalInspectionRequest?.other
          ?.canDownloadDocument?.value ?? true,
      cansharedocumentthoughemailarchitecturalinspectionrequest:
        docRestriction?.architecturalInspectionRequest?.other
          ?.canShareDocumentThoughEmail?.value ?? true,
      canexportdocumentinfoasexcelfilearchitecturalinspectionrequest:
        docRestriction?.architecturalInspectionRequest?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewmaterialinspectionrequest:
        docRestriction?.materialInspectionRequest?.other?.canView?.value ??
        true,
      canupdateextractedfeildsmaterialinspectionrequest:
        docRestriction?.materialInspectionRequest?.other
          ?.canUpdateExtractedFeilds?.value ?? true,
      candeletedocumentmaterialinspectionrequest:
        docRestriction?.materialInspectionRequest?.other?.canDeleteDocument
          ?.value ?? true,
      candownloaddocumentmaterialinspectionrequest:
        docRestriction?.materialInspectionRequest?.other?.canDownloadDocument
          ?.value ?? true,
      cansharedocumentthoughemailmaterialinspectionrequest:
        docRestriction?.materialInspectionRequest?.other
          ?.canShareDocumentThoughEmail?.value ?? true,
      canexportdocumentinfoasexcelfilematerialinspectionrequest:
        docRestriction?.materialInspectionRequest?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewmethodstatementsubmittal:
        docRestriction?.methodStatementSubmittal?.other?.canView?.value ?? true,
      canupdateextractedfeildsmethodstatementsubmittal:
        docRestriction?.methodStatementSubmittal?.other
          ?.canUpdateExtractedFeilds?.value ?? true,
      candeletedocumentmethodstatementsubmittal:
        docRestriction?.methodStatementSubmittal?.other?.canDeleteDocument
          ?.value ?? true,
      candownloaddocumentmethodstatementsubmittal:
        docRestriction?.methodStatementSubmittal?.other?.canDownloadDocument
          ?.value ?? true,
      cansharedocumentthoughemailmethodstatementsubmittal:
        docRestriction?.methodStatementSubmittal?.other
          ?.canShareDocumentThoughEmail?.value ?? true,
      canexportdocumentinfoasexcelfilemethodstatementsubmittal:
        docRestriction?.methodStatementSubmittal?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewnonconformancereport:
        docRestriction?.nonConformanceReport?.other?.canView?.value ?? true,
      canupdateextractedfeildsnonconformancereport:
        docRestriction?.nonConformanceReport?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      candeletedocumentnonconformancereport:
        docRestriction?.nonConformanceReport?.other?.canDeleteDocument?.value ??
        true,
      candownloaddocumentnonconformancereport:
        docRestriction?.nonConformanceReport?.other?.canDownloadDocument
          ?.value ?? true,
      cansharedocumentthoughemailnonconformancereport:
        docRestriction?.nonConformanceReport?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canexportdocumentinfoasexcelfilenonconformancereport:
        docRestriction?.nonConformanceReport?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewrequestforinformation:
        docRestriction?.requestForInformation?.other?.canView?.value ?? true,
      canupdateextractedfeildsrequestforinformation:
        docRestriction?.requestForInformation?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      candeletedocumentrequestforinformation:
        docRestriction?.requestForInformation?.other?.canDeleteDocument
          ?.value ?? true,
      candownloaddocumentrequestforinformation:
        docRestriction?.requestForInformation?.other?.canDownloadDocument
          ?.value ?? true,
      cansharedocumentthoughemailrequestforinformation:
        docRestriction?.requestForInformation?.other
          ?.canShareDocumentThoughEmail?.value ?? true,
      canexportdocumentinfoasexcelfilerequestforinformation:
        docRestriction?.requestForInformation?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewsiteinstruction:
        docRestriction?.siteInstruction?.other?.canView?.value ?? true,
      canupdateextractedfeildssiteinstruction:
        docRestriction?.siteInstruction?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      candeletedocumentsiteinstruction:
        docRestriction?.siteInstruction?.other?.canDeleteDocument?.value ??
        true,
      candownloaddocumentsiteinstruction:
        docRestriction?.siteInstruction?.other?.canDownloadDocument?.value ??
        true,
      cansharedocumentthoughemailsiteinstruction:
        docRestriction?.siteInstruction?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canexportdocumentinfoasexcelfilerequestforinformation:
        docRestriction?.siteInstruction?.other.canExportDocumentInfoAsExcelFile
          ?.value ?? true,

      canviewtechnicalsubmittal:
        docRestriction?.technicalSubmittal?.other?.canView?.value ?? true,
      canupdateextractedfeildstechnicalsubmittal:
        docRestriction?.technicalSubmittal?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      candeletedocumenttechnicalsubmittal:
        docRestriction?.technicalSubmittal?.other?.canDeleteDocument?.value ??
        true,
      candownloaddocumenttechnicalsubmittal:
        docRestriction?.technicalSubmittal?.other?.canDownloadDocument?.value ??
        true,
      cansharedocumentthoughemailtechnicalsubmittal:
        docRestriction?.technicalSubmittal?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canexportdocumentinfoasexcelfiletechnicalsubmittal:
        docRestriction?.technicalSubmittal?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canviewworkinspectionrequest:
        docRestriction?.workInspectionRequest?.other?.canView?.value ?? true,
      canupdateextractedfeildsworkinspectionrequest:
        docRestriction?.workInspectionRequest?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      candeletedocumentworkinspectionrequest:
        docRestriction?.workInspectionRequest?.other?.canDeleteDocument
          ?.value ?? true,
      candownloaddocumentworkinspectionrequest:
        docRestriction?.workInspectionRequest?.other?.canDownloadDocument
          ?.value ?? true,
      cansharedocumentthoughemailworkinspectionrequest:
        docRestriction?.workInspectionRequest?.other
          ?.canShareDocumentThoughEmail?.value ?? true,
      canexportdocumentinfoasexcelfileworkinspectionrequest:
        docRestriction?.workInspectionRequest?.other
          .canExportDocumentInfoAsExcelFile?.value ?? true,

      canViewletter: docRestriction?.letter?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsletter:
        docRestriction?.letter?.other?.canUpdateExtractedFeilds?.value ?? true,
      canUpdateAliasesletter:
        docRestriction?.letter?.other?.canUpdateAliases?.value ?? true,
      canDeleteDocumentletter:
        docRestriction?.letter?.other?.canDeleteDocument?.value ?? true,
      canDownloadDocumentletter:
        docRestriction?.letter?.other?.canDownloadDocument?.value ?? true,
      canShareDocumentThoughEmailletter:
        docRestriction?.letter?.other?.canShareDocumentThoughEmail?.value ??
        true,
      canShareDocumentThoughStonAiletter:
        docRestriction?.letter?.other?.canShareDocumentThoughStonAi?.value ??
        true,

      canViewminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canUpdateExtractedFeilds
          ?.value ?? true,
      canUpdateAliasesminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canUpdateAliases?.value ??
        true,
      canDeleteDocumentminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canDeleteDocument?.value ??
        true,
      canDownloadDocumentminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canDownloadDocument?.value ??
        true,
      canShareDocumentThoughEmailminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canShareDocumentThoughEmail
          ?.value ?? true,
      canShareDocumentThoughStonAiminutesOfmeeting:
        docRestriction?.minutesOfmeeting?.other?.canShareDocumentThoughStonAi
          ?.value ?? true,

      canViewBoq: docRestriction?.boq?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsBoq:
        docRestriction?.boq?.other?.canUpdateExtractedFeilds?.value ?? true,
      canDeleteDocumentBoq:
        docRestriction?.boq?.other?.canDeleteDocument?.value ?? true,
      canDownloadDocumentBoq:
        docRestriction?.boq?.other?.canDownloadDocument?.value ?? true,
      canShareDocumentThoughEmailBoq:
        docRestriction?.boq?.other?.canShareDocumentThoughEmail?.value ?? true,
      canShareDocumentThoughStonAiBoq:
        docRestriction?.boq?.other?.canShareDocumentThoughStonAi?.value ?? true,

      canViewTender: docRestriction?.tender?.other?.canView?.value ?? true,
      canUpdateExtractedFeildsTender:
        docRestriction?.tender?.other?.canUpdateExtractedFeilds?.value ?? true,
      canUpdateAliasesTender:
        docRestriction?.tender?.other?.canUpdateAliases?.value ?? true,
      canDeleteDocumentTender:
        docRestriction?.tender?.other?.canDeleteDocument?.value ?? true,
      canDownloadDocumentTender:
        docRestriction?.tender?.other?.canDownloadDocument?.value ?? true,
      canShareDocumentThoughEmailTender:
        docRestriction?.tender?.other?.canShareDocumentThoughEmail?.value ??
        true,
      canShareDocumentThoughStonAiTender:
        docRestriction?.tender?.other?.canShareDocumentThoughStonAi?.value ??
        true,

      canViewBucket: docRestriction?.bucket?.other?.canView?.value ?? true,
      canDeleteDocumentBucket:
        docRestriction?.bucket?.other?.canDeleteDocument?.value ?? true,
      canDownloadDocumentBucket:
        docRestriction?.bucket?.other?.canDownloadDocument?.value ?? true,
      canShareDocumentThoughEmailBucket:
        docRestriction?.bucket?.other?.canShareDocumentThoughEmail?.value ??
        true,
      canShareDocumentThoughStonAiBucket:
        docRestriction?.bucket?.other?.canShareDocumentThoughStonAi?.value ??
        true,

      canViewpageWorkSpace:
        viewRestriction?.pageWorkSpace?.other?.canView?.value ?? true,

      canViewAssingedTaskpageWorkSpace:
        viewRestriction?.pageWorkSpace?.other?.canViewAssingedTask?.value ??
        true,

      canViewpageAISearch:
        viewRestriction?.pageAISearch?.other?.canView?.value ?? true,
      canViewpageMail: viewRestriction?.pageMail?.other?.canView?.value ?? true,
      canViewpageFolder:
        viewRestriction?.pageFolder?.other?.canView?.value ?? true,
      canViewpageAccount:
        viewRestriction?.pageAccount?.other?.canView?.value ?? true,
      canViewpageSetting:
        viewRestriction?.pageSetting?.other?.canView?.value ?? true,
      canViewpageAdmin:
        viewRestriction?.pageAdmin?.other?.canView?.value ?? true,
      canViewUserspageAdmin:
        viewRestriction?.pageAdmin?.other?.canViewUsers?.value ?? true,
      canViewProjectspageAdmin:
        viewRestriction?.pageAdmin?.other?.canViewProjects?.value ?? true,
      canViewDepartmentspageAdmin:
        viewRestriction?.pageAdmin?.other?.canViewDepartments?.value ?? true,
      canViewusers: actionRestriction?.users?.other?.canView?.value ?? true,
      canCreateUsersusers:
        actionRestriction?.users?.other?.canCreateUsers?.value ?? true,
      canDeleteUsersusers:
        actionRestriction?.users?.other?.canDeleteUsers?.value ?? true,
      canUpdateUsersDetailsusers:
        actionRestriction?.users?.other?.canUpdateUsersDetails?.value ?? true,
      canAddUsersToProjectusers:
        actionRestriction?.users?.other?.canAddUsersToProject?.value ?? true,
      canViewdepartments:
        actionRestriction?.departments?.other?.canView?.value ?? true,
      canCreateDepartmentsdepartments:
        actionRestriction?.departments?.other?.canCreateDepartments?.value ??
        true,
      canDeleteDepartmentsdepartments:
        actionRestriction?.departments?.other?.canDeleteDepartments?.value ??
        true,
      canUpdateDepartmentsdepartments:
        actionRestriction?.departments?.other?.canUpdateDepartments?.value ??
        true,

      canCreateTaskworkSpace:
        actionRestriction?.workSpace.other?.canCreateTask?.value ?? true,
      canEditTaskworkSpace:
        actionRestriction?.workSpace?.other?.canEditTask?.value ?? true,
      canDeleteTaskworkSpace:
        actionRestriction?.workSpace?.other?.canDeleteTask?.value ?? true,

      canDeleteTaskGroupworkSpace:
        actionRestriction?.workSpace?.other?.canDeleteTaskGroup?.value ?? true,
      canEditTaskGroupworkSpace:
        actionRestriction?.workSpace?.other?.canEditTaskGroup?.value ?? true,

      canViewdocument:
        actionRestriction?.document?.other?.canView?.value ?? true,
      canUplaodDocumentsdocument:
        actionRestriction?.document?.other?.canUplaodDocuments?.value ?? true,
      canBulkUploadDocumentsdocument:
        actionRestriction?.document?.other?.canBulkUploadDocuments?.value ??
        true,
      canApplyForDocExtractiondocument:
        actionRestriction?.document?.other?.canApplyForDocExtraction?.value ??
        true,
    };
  } catch (error) {
    console.log("error", error);
  }

  return rowForDb;
}

export const permissionsObjectOfNonSubsForFalseView = {
  canView: { name: "View", value: false },
  canDeleteDocument: { name: "Delete", value: false },
  canDownloadDocument: { name: "Download", value: false },
  canShareDocumentThoughEmail: {
    name: "Share",
    value: false,
  },
};

export const permissionsObjectOfSubsForFalseView = {
  canView: { name: "View", value: false },
  canUpdateExtractedFeilds: {
    name: "Update Extracted Feilds",
    value: false,
  },
  canDeleteDocument: { name: "Delete", value: false },
  canDownloadDocument: { name: "Download", value: false },
  canShareDocumentThoughEmail: {
    name: "Share",
    value: false,
  },
  canExportDocumentInfoAsExcelFile: {
    name: "Export Document info as Excel File",
    value: false,
  },
};

async function getUserPermisionsFromList(user_id, user, project) {
  const response = await axios.post(
    url + "/Userinfo/getUserPermissionsFromList",
    { user_id, project },
    {
      headers: { token: user.token },
    }
  );
  return response.data[0];
}
async function convertPermissionDbToOject(permission) {
  console.log("docRestrictions123", permission.canviewcontract);
  const docRestrictions = {
    Contract: {
      name: "Contract",
      other: {
        canView: { name: "View", value: permission.canviewcontract },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentcontract,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentcontract,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailcontract,
        },
      },
    },
    responsibilityMatrix: {
      name: "Responsibility Matrix",
      other: {
        canView: {
          name: "View",
          value: permission.canviewresponsibilitymatrix,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentresponsibilitymatrix,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentresponsibilitymatrix,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailresponsibilitymatrix,
        },
      },
    },
    materialSubmittal: {
      name: "Material Submittal",
      other: {
        canView: { name: "View", value: permission.canviewmaterialsubmittal },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsmaterialsubmittal,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentmaterialsubmittal,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentmaterialsubmittal,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailmaterialsubmittal,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value: permission.canexportdocumentinfoasexcelfilematerialsubmittal,
        },
      },
    },
    shopDrawingSubmittal: {
      name: "Shop Drawing Submittal",
      other: {
        canView: {
          name: "View",
          value: permission.canviewshopdrawingsubmittal,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsshopdrawingsubmittal,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentshopdrawingsubmittal,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentshopdrawingsubmittal,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailshopdrawingsubmittal,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfileshopdrawingsubmittal,
        },
      },
    },
    prequalificationSubmittal: {
      name: "Prequalification Submittal",
      other: {
        canView: {
          name: "View",
          value: permission.canviewprequalificationsubmittal,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsprequalificationsubmittal,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentprequalificationsubmittal,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentprequalificationsubmittal,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value:
            permission.cansharedocumentthoughemailprequalificationsubmittal,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfileprequalificationsubmittal,
        },
      },
    },
    architecturalInspectionRequest: {
      name: "Architectural Inspection Request",
      other: {
        canView: {
          name: "View",
          value: permission.canviewarchitecturalinspectionrequest,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value:
            permission.canupdateextractedfeildsarchitecturalinspectionrequest,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentarchitecturalinspectionrequest,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentarchitecturalinspectionrequest,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value:
            permission.cansharedocumentthoughemailarchitecturalinspectionrequest,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfilearchitecturalinspectionrequest,
        },
      },
    },
    materialInspectionRequest: {
      name: "Material Inspection Request",
      other: {
        canView: {
          name: "View",
          value: permission.canviewmaterialinspectionrequest,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsmaterialinspectionrequest,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentmaterialinspectionrequest,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentmaterialinspectionrequest,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value:
            permission.cansharedocumentthoughemailmaterialinspectionrequest,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfilematerialinspectionrequest,
        },
      },
    },
    methodStatementSubmittal: {
      name: "Method Statement Submittal",
      other: {
        canView: {
          name: "View",
          value: permission.canviewmethodstatementsubmittal,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsmethodstatementsubmittal,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentmethodstatementsubmittal,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentmethodstatementsubmittal,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailmethodstatementsubmittal,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfilemethodstatementsubmittal,
        },
      },
    },
    nonConformanceReport: {
      name: "Non Conformance Report",
      other: {
        canView: {
          name: "View",
          value: permission.canviewnonconformancereport,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsnonconformancereport,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentnonconformancereport,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentnonconformancereport,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailnonconformancereport,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfilenonconformancereport,
        },
      },
    },
    requestForInformation: {
      name: "Request For Information",
      other: {
        canView: {
          name: "View",
          value: permission.canviewrequestforinformation,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsrequestforinformation,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentrequestforinformation,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentrequestforinformation,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.candownloaddocumentrequestforinformation,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfilerequestforinformation,
        },
      },
    },
    siteInstruction: {
      name: "Site Instruction",
      other: {
        canView: { name: "View", value: permission.canviewsiteinstruction },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildssiteinstruction,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentsiteinstruction,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentsiteinstruction,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailsiteinstruction,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value: permission.canexportdocumentinfoasexcelfilesiteinstruction,
        },
      },
    },
    technicalSubmittal: {
      name: "Technical Submittal",
      other: {
        canView: { name: "View", value: permission.canviewtechnicalsubmittal },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildstechnicalsubmittal,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumenttechnicalsubmittal,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumenttechnicalsubmittal,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailtechnicalsubmittal,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value: permission.canexportdocumentinfoasexcelfiletechnicalsubmittal,
        },
      },
    },
    workInspectionRequest: {
      name: "Work Inspection Request",
      other: {
        canView: {
          name: "View",
          value: permission.canviewworkinspectionrequest,
        },
        canUpdateExtractedFeilds: {
          name: "Update Extracted Feilds",
          value: permission.canupdateextractedfeildsworkinspectionrequest,
        },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentworkinspectionrequest,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentworkinspectionrequest,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailworkinspectionrequest,
        },
        canExportDocumentInfoAsExcelFile: {
          name: "Export Document info as Excel File",
          value:
            permission.canexportdocumentinfoasexcelfileworkinspectionrequest,
        },
      },
    },
    minutesOfmeeting: {
      name: "Minutes of Meeting",
      other: {
        canView: { name: "View", value: permission.canviewminutesofmeeting },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentminutesofmeeting,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentminutesofmeeting,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailminutesofmeeting,
        },
      },
    },

    boq: {
      name: "BOQ",
      other: {
        canView: { name: "View", value: permission.canviewboq },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentboq,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentboq,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailboq,
        },
      },
    },
    tender: {
      name: "Tender Addendums",
      other: {
        canView: { name: "View", value: permission.canviewtender },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumenttender,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumenttender,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailtender,
        },
      },
    },
    bucket: {
      name: "Bucket",
      other: {
        canView: { name: "View", value: permission.canviewbucket },
        canDeleteDocument: {
          name: "Delete",
          value: permission.candeletedocumentbucket,
        },
        canDownloadDocument: {
          name: "Download",
          value: permission.candownloaddocumentbucket,
        },
        canShareDocumentThoughEmail: {
          name: "Share",
          value: permission.cansharedocumentthoughemailbucket,
        },
      },
    },
  };
  const viewRestrictions = {
    pageWorkSpace: {
      name: "Work Space",
      other: {
        canView: {
          name: "View",
          value: permission.canviewpageworkspace,
        },

        canViewAssingedTask: {
          name: "Project Tasks",
          value: permission.canviewassingedtaskpageworkspace,
        },
      },
    },
    pageAISearch: {
      name: "AI Search Page",
      other: {
        canView: {
          name: "View",
          value: permission.canviewpageaisearch,
        },
      },
    },
    pageMail: {
      name: "Mail Page",
      other: {
        canView: {
          name: "View",
          value: permission.canviewpagemail,
        },
      },
    },
    pageFolder: {
      name: "Documents",
      other: {
        canView: {
          name: "View",
          value: permission.canviewpagefolder,
        },
      },
    },
    pageAccount: {
      name: "User Profile Page",
      other: {
        canView: {
          name: "View",
          value: permission.canviewpageaccount,
        },
      },
    },
    pageAdmin: {
      name: "Admin Page",
      other: {
        canView: {
          name: "View",
          value: permission.canviewpageadmin,
        },
        canViewUsers: {
          name: "View Users",
          value: permission.canviewuserspageadmin,
        },
        canViewProjects: {
          name: "View Projects",
          value: permission.canviewprojectspageadmin,
        },
        canViewDepartments: {
          name: "View Departments",
          value: permission.canviewdepartmentspageadmin,
        },
      },
    },
  };
  const actionRestrictions = {
    users: {
      name: "users",
      other: {
        canCreateUsers: {
          name: "Create Users",
          value: permission.cancreateusersusers,
        },
        canDeleteUsers: {
          name: "Delete Users",
          value: permission.candeleteusersusers,
        },
        canUpdateUsersDetails: {
          name: "Update Users Details",
          value: permission.canupdateusersdetailsusers,
        },
        canAddUsersToProject: {
          name: "Add Users to Project",
          value: permission.canadduserstoprojectusers,
        },
      },
    },
    // projects: {
    //   name: "projects",
    //   other: {
    //     canCreateProjects: {
    //       name: "Create Projects",
    //       value: permission.cancreateprojectsprojects,
    //     },
    //     canDeleteProjects: {
    //       name: "Delete Projects",
    //       value: permission.candeleteprojectsprojects,
    //     },
    //     canUpdateProjectsDetails: {
    //       name: "Update Project Details",
    //       value: permission.canupdateprojectsdetailsprojects,
    //     },
    //   },
    // },
    departments: {
      name: "departments",
      other: {
        canCreateDepartments: {
          name: "Create Departments",
          value: permission.cancreatedepartmentsdepartments,
        },
        canDeleteDepartments: {
          name: "Delete Departments",
          value: permission.candeletedepartmentsdepartments,
        },
        canUpdateDepartments: {
          name: "Update Departments",
          value: permission.canupdatedepartmentsdepartments,
        },
      },
    },
    workSpace: {
      name: "Workspace",
      other: {
        canCreateTask: {
          name: "Create Project Tasks",
          value: permission.cancreatetaskworkspace,
        },
        canEditTask: {
          name: "Edit Project Tasks",
          value: permission.canedittaskworkspace,
        },
        canDeleteTask: {
          name: "Delete Project Tasks",
          value: permission.candeletetaskworkspace,
        },
        canDeleteTaskGroup: {
          name: "Delete Project Tasks Groups",
          value: permission.candeletetaskworkspace,
        },
        canEditTaskGroup: {
          name: "Edit Project Tasks Groups",
          value: permission.canedittaskworkspace,
        },
      },
    },
    document: {
      name: "document",
      other: {
        canUplaodDocuments: {
          name: "Upload Documents",
          value: permission.canuplaoddocumentsdocument,
        },
        canBulkUploadDocuments: {
          name: "Bulk Upload Documents",
          value: permission.canbulkuploaddocumentsdocument,
        },
        canApplyForDocExtraction: {
          name: "Apply for Doc Extraction",
          value: permission.canapplyfordocextractiondocument,
        },
      },
    },
  };
  const temp = { docRestrictions, viewRestrictions, actionRestrictions };
  console.log("docRestrictions123", temp);
  return temp;
}

export async function getDefaultPermissionWithUserPermissionsData(
  userRole,
  user_id,
  user,
  project
) {
  const permission = await getUserPermisionsFromList(user_id, user, project);
  console.log("permisison1222", permission);
  const { docRestrictions, viewRestrictions, actionRestrictions } =
    await convertPermissionDbToOject(permission);
  console.log("canView.value", docRestrictions);
  var totalPermisions = {
    docRestrictionsEa: docRestrictionsEa,
    viewRestrictionsEa: viewRestrictionsEa,
    actionRestrictionsEa: actionRestrictionsEa,
    docRestrictionsPm: docRestrictionsPm,
    viewRestrictionsPm: viewRestrictionsPm,
    actionRestrictionsPm: actionRestrictionsPm,
    docRestrictionsDc: docRestrictionsDc,
    viewRestrictionsDc: viewRestrictionsDc,
    actionRestrictionsDc: actionRestrictionsDc,
    docRestrictionsHod: docRestrictionsHod,
    viewRestrictionsHod: viewRestrictionsHod,
    actionRestrictionsHod: actionRestrictionsHod,
    docRestrictionsE: docRestrictionsE,
    viewRestrictionsE: viewRestrictionsE,
    actionRestrictionsE: actionRestrictionsE,
  };
  try {
    if (userRole === "enterpriseAdmin") {
      totalPermisions = {
        ...totalPermisions,
        docRestrictionsEa: docRestrictions,
        viewRestrictionsEa: viewRestrictions,
        actionRestrictionsEa: actionRestrictions,
      };
    } else if (userRole === "projectManager") {
      totalPermisions = {
        ...totalPermisions,
        docRestrictionsPm: docRestrictions,
        viewRestrictionsPm: viewRestrictions,
        actionRestrictionsPm: actionRestrictions,
      };
    } else if (userRole === "documentController") {
      totalPermisions = {
        ...totalPermisions,
        docRestrictionsDc: docRestrictions,
        viewRestrictionsDc: viewRestrictions,
        actionRestrictionsDc: actionRestrictions,
      };
    } else if (userRole === "hod") {
      totalPermisions = {
        ...totalPermisions,
        docRestrictionsHod: docRestrictions,
        viewRestrictionsHod: viewRestrictions,
        actionRestrictionsHod: actionRestrictions,
      };
    } else if (userRole === "employee") {
      totalPermisions = {
        ...totalPermisions,
        docRestrictionsE: docRestrictions,
        viewRestrictionsE: viewRestrictions,
        actionRestrictionsE: actionRestrictions,
      };
    }
    console.log("totalPermisions", totalPermisions);
    return totalPermisions;
  } catch (error) {
    console.log("error", error);
  }
}
