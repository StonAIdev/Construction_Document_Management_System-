const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");
const format = require("pg-format");

const express = require("express");
const addUsersToProject = express.Router();

addUsersToProject.post("/getEnterpriseUsers", authorize, async (req, res) => {
  const { enterprise_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select users.user_id,users.username,users.enterprise_id from users where enterprise_id =${enterprise_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    console.error("sa", DatasetsInDbQuery.rows);

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

addUsersToProject.post("/getProjects", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select * from user_project where project_id = ${project_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    console.error("SADsadasfd", DatasetsInDbQuery.rows);

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

addUsersToProject.post("/addUsersToProject", authorize, async (req, res) => {
  const { users_to_add, user_id, project_id, permissions, user_role } =
    req.body;
  console.log(users_to_add, user_id, project_id, permissions, user_role);

  const pools2 = await pools.getPool();

  try {
    await pools2.query("BEGIN");

    for (let index = 0; index < users_to_add.length; index++) {
      console.log("arrData", users_to_add[index][0]);

      const DatasetsInDbQuery1 = await pools2.query(
        "Update Users Set user_role=$1 WHERE user_id = $2",
        [user_role, users_to_add[index][0]]
      );
    }

    console.log("Query 1");

    const DatasetsInDbQuery2 = await pools2.query(
      format(
        "insert INTO user_project(user_id,project_id) VALUES %L on conflict do nothing",
        users_to_add
      )
    );
    console.log("Query 2");

    for (let index = 0; index < users_to_add.length; index++) {
      const DatasetsInDbQuery3 = await pools2.query(
        `INSERT INTO permission (user_id,project_id,
            canViewContract,
            canUpdateExtractedFeildsContract,
            canUpdateAliasesContract,
            canDeleteDocumentContract,
            canDownloadDocumentContract,
            canShareDocumentThoughEmailContract,
            canShareDocumentThoughStonAiContract,
            canExportDocumentInfoAsExcelFileContract,
            canExportExtractedDocumentFieldsAsExcelFileContract,
            canViewresponsibilityMatrix,
            canUpdateExtractedFeildsresponsibilityMatrix,
            canUpdateAliasesresponsibilityMatrix,
            canDeleteDocumentresponsibilityMatrix,
            canDownloadDocumentresponsibilityMatrix,
            canShareDocumentThoughEmailresponsibilityMatrix,
            canShareDocumentThoughStonAiresponsibilityMatrix,
            canExportDocumentInfoAsExcelFileresponsibilityMatrix,
            canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix,
            canViewmaterialSubmittal,
            canUpdateExtractedFeildsmaterialSubmittal,
            canUpdateAliasesmaterialSubmittal,
            canDeleteDocumentmaterialSubmittal,
            canDownloadDocumentmaterialSubmittal,
            canShareDocumentThoughEmailmaterialSubmittal,
            canShareDocumentThoughStonAimaterialSubmittal,
            canExportDocumentInfoAsExcelFilematerialSubmittal,
            canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal,
            canViewshopDrawingSubmittal,
            canUpdateExtractedFeildsshopDrawingSubmittal,
            canUpdateAliasesshopDrawingSubmittal,
            canDeleteDocumentshopDrawingSubmittal,
            canDownloadDocumentshopDrawingSubmittal,
            canShareDocumentThoughEmailshopDrawingSubmittal,
            canShareDocumentThoughStonAishopDrawingSubmittal,
            canExportDocumentInfoAsExcelFileshopDrawingSubmittal,
            canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal,
            canViewletter,
            canUpdateExtractedFeildsletter,
            canUpdateAliasesletter,
            canDeleteDocumentletter,
            canDownloadDocumentletter,
            canShareDocumentThoughEmailletter,
            canShareDocumentThoughStonAiletter,
            canExportDocumentInfoAsExcelFileletter,
            canExportExtractedDocumentFieldsAsExcelFileletter,
            canViewminutesOfmeeting,
            canUpdateExtractedFeildsminutesOfmeeting,
            canUpdateAliasesminutesOfmeeting,
            canDeleteDocumentminutesOfmeeting,
            canDownloadDocumentminutesOfmeeting,
            canShareDocumentThoughEmailminutesOfmeeting,
            canShareDocumentThoughStonAiminutesOfmeeting,
            canExportDocumentInfoAsExcelFileminutesOfmeeting,
            canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting,
            canViewpageDashboard,
            canViewFilterspageDashboard,
            canViewEnterpriseStatisticspageDashboard,
            canViewProjectStatisticspageDashboard,
            canViewDepartmentStatisticspageDashboard,
            canViewUserStatisticspageDashboard,
            canViewOrganisationalChartpageDashboard,
            canViewpageWorkSpace,
            canViewMyTaskpageWorkSpace,
            canViewAssingedTaskpageWorkSpace,
            canFilterTaskpageWorkSpace,
            canViewpageAISearch,
            canViewpageMail,
            canViewpageFolder,
            canViewFilterspageFolder,
            canViewDocViewerpageFolder,
            canViewpageAccount,
            canViewpageSetting,
            canViewpageAdmin,
            canViewUserspageAdmin,
            canViewProjectspageAdmin,
            canViewDepartmentspageAdmin,
            canViewusers,
            canCreateUsersusers,
            canDeleteUsersusers,
            canUpdateUsersDetailsusers,
            canAddUsersToProjectusers,
            canViewprojects,
            canCreateProjectsprojects,
            canDeleteProjectsprojects,
            canUpdateProjectsDetailsprojects,
            canViewdepartments,
            canCreateDepartmentsdepartments,
            canDeleteDepartmentsdepartments,
            canUpdateDepartmentsdepartments,
            canViewworkSpace,
            canCreateTaskworkSpace,
            canEditTaskworkSpace,
            canDeleteTaskworkSpace,
            NotifyTaskThroughEmailworkSpace,
            NotifyTaskThroughStonAiworkSpace,
            canAssignTasktoAnyoneInEnterpriseworkSpace,
            canAssingTasktoAnyoneInProjectworkSpace,
            canAssingTasktoAnyoneIndepartmentworkSpace,
            canViewdocument,
            canUplaodDocumentsdocument,
            canBulkUploadDocumentsdocument,
            canApplyForDocExtractiondocument,
            canApplyDocClassificationsdocument) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98, $99, $100, $101, $102, $103, $104, $105) on conflict do nothing`,
        [
          users_to_add[index][0],
          project_id,
          permissions.canViewContract,
          permissions.canUpdateExtractedFeildsContract,
          permissions.canUpdateAliasesContract,
          permissions.canDeleteDocumentContract,
          permissions.canDownloadDocumentContract,
          permissions.canShareDocumentThoughEmailContract,
          permissions.canShareDocumentThoughStonAiContract,
          permissions.canExportDocumentInfoAsExcelFileContract,
          permissions.canExportExtractedDocumentFieldsAsExcelFileContract,
          permissions.canViewresponsibilityMatrix,
          permissions.canUpdateExtractedFeildsresponsibilityMatrix,
          permissions.canUpdateAliasesresponsibilityMatrix,
          permissions.canDeleteDocumentresponsibilityMatrix,
          permissions.canDownloadDocumentresponsibilityMatrix,
          permissions.canShareDocumentThoughEmailresponsibilityMatrix,
          permissions.canShareDocumentThoughStonAiresponsibilityMatrix,
          permissions.canExportDocumentInfoAsExcelFileresponsibilityMatrix,
          permissions.canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix,
          permissions.canViewmaterialSubmittal,
          permissions.canUpdateExtractedFeildsmaterialSubmittal,
          permissions.canUpdateAliasesmaterialSubmittal,
          permissions.canDeleteDocumentmaterialSubmittal,
          permissions.canDownloadDocumentmaterialSubmittal,
          permissions.canShareDocumentThoughEmailmaterialSubmittal,
          permissions.canShareDocumentThoughStonAimaterialSubmittal,
          permissions.canExportDocumentInfoAsExcelFilematerialSubmittal,
          permissions.canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal,
          permissions.canViewshopDrawingSubmittal,
          permissions.canUpdateExtractedFeildsshopDrawingSubmittal,
          permissions.canUpdateAliasesshopDrawingSubmittal,
          permissions.canDeleteDocumentshopDrawingSubmittal,
          permissions.canDownloadDocumentshopDrawingSubmittal,
          permissions.canShareDocumentThoughEmailshopDrawingSubmittal,
          permissions.canShareDocumentThoughStonAishopDrawingSubmittal,
          permissions.canExportDocumentInfoAsExcelFileshopDrawingSubmittal,
          permissions.canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal,
          permissions.canViewletter,
          permissions.canUpdateExtractedFeildsletter,
          permissions.canUpdateAliasesletter,
          permissions.canDeleteDocumentletter,
          permissions.canDownloadDocumentletter,
          permissions.canShareDocumentThoughEmailletter,
          permissions.canShareDocumentThoughStonAiletter,
          permissions.canExportDocumentInfoAsExcelFileletter,
          permissions.canExportExtractedDocumentFieldsAsExcelFileletter,
          permissions.canViewminutesOfmeeting,
          permissions.canUpdateExtractedFeildsminutesOfmeeting,
          permissions.canUpdateAliasesminutesOfmeeting,
          permissions.canDeleteDocumentminutesOfmeeting,
          permissions.canDownloadDocumentminutesOfmeeting,
          permissions.canShareDocumentThoughEmailminutesOfmeeting,
          permissions.canShareDocumentThoughStonAiminutesOfmeeting,
          permissions.canExportDocumentInfoAsExcelFileminutesOfmeeting,
          permissions.canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting,
          permissions.canViewpageDashboard,
          permissions.canViewFilterspageDashboard,
          permissions.canViewEnterpriseStatisticspageDashboard,
          permissions.canViewProjectStatisticspageDashboard,
          permissions.canViewDepartmentStatisticspageDashboard,
          permissions.canViewUserStatisticspageDashboard,
          permissions.canViewOrganisationalChartpageDashboard,
          permissions.canViewpageWorkSpace,
          permissions.canViewMyTaskpageWorkSpace,
          permissions.canViewAssingedTaskpageWorkSpace,
          permissions.canFilterTaskpageWorkSpace,
          permissions.canViewpageAISearch,
          permissions.canViewpageMail,
          permissions.canViewpageFolder,
          permissions.canViewFilterspageFolder,
          permissions.canViewDocViewerpageFolder,
          permissions.canViewpageAccount,
          permissions.canViewpageSetting,
          permissions.canViewpageAdmin,
          permissions.canViewUserspageAdmin,
          permissions.canViewProjectspageAdmin,
          permissions.canViewDepartmentspageAdmin,
          permissions.canViewusers,
          permissions.canCreateUsersusers,
          permissions.canDeleteUsersusers,
          permissions.canUpdateUsersDetailsusers,
          permissions.canAddUsersToProjectusers,
          permissions.canViewprojects,
          permissions.canCreateProjectsprojects,
          permissions.canDeleteProjectsprojects,
          permissions.canUpdateProjectsDetailsprojects,
          permissions.canViewdepartments,
          permissions.canCreateDepartmentsdepartments,
          permissions.canDeleteDepartmentsdepartments,
          permissions.canUpdateDepartmentsdepartments,
          permissions.canViewworkSpace,
          permissions.canCreateTaskworkSpace,
          permissions.canEditTaskworkSpace,
          permissions.canDeleteTaskworkSpace,
          permissions.NotifyTaskThroughEmailworkSpace,
          permissions.NotifyTaskThroughStonAiworkSpace,
          permissions.canAssignTasktoAnyoneInEnterpriseworkSpace,
          permissions.canAssingTasktoAnyoneInProjectworkSpace,
          permissions.canAssingTasktoAnyoneIndepartmentworkSpace,
          permissions.canViewdocument,
          permissions.canUplaodDocumentsdocument,
          permissions.canBulkUploadDocumentsdocument,
          permissions.canApplyForDocExtractiondocument,
          permissions.canApplyDocClassificationsdocument,
        ]
      );
    }
    await pools2.query("COMMIT");
    console.log("Query 1");

    res.send("New user added to project");
  } catch (error) {
    await pools2.query("ROLLBACK");

    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = addUsersToProject;
