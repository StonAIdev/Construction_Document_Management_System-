const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require("express");
const department = require("./department");
const rolePermissions = express.Router();

rolePermissions.post("/addPermissions", authorize, async (req, res) => {
  const {
    username,
    user_password,
    enterprise_id,
    email_address,
    user_role,
    firstName,
    lastName,
    permissions,
    project_id,
    department_id,
    creator,
    phone,
  } = req.body.values;
  console.log("--->", req.body.values);
  // console.log("logogog", permissions);
  const pools2 = await pools.getPool();
  try {
    const userByEmail = await pools2.query(
      "SELECT * FROM users WHERE email_address = $1",
      [email_address]
    );

    if (userByEmail.rows.length > 0) {
      return res
        .status(402)
        .json(
          "Email already registered. Use a new email for account creation."
        );
    }
    const userByUsername = await pools2.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userByUsername.rows.length > 0) {
      return res.status(401).json("User already exists!");
    }

    // Check if the email address already exists

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(user_password, salt);
    await pools2.query("BEGIN");
    const DatasetsInDbQuery3 = await pools2.query(
      "INSERT INTO users (username,user_password,enterprise_id,email_address,user_role,firstname,lastname,created_by,phone) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING user_id",
      [
        username,
        bcryptPassword,
        enterprise_id,
        email_address,
        user_role,
        firstName,
        lastName,
        creator,
        phone,
      ]
    );
    const user_id = DatasetsInDbQuery3.rows[0].user_id;
    const DatasetsInDbQuery5 = await pools2.query(
      "INSERT INTO user_project (project_id,user_id) VALUES($1,$2) RETURNING *",
      [project_id, user_id]
    );

    const DatasetsInDbQuery4 = await pools2.query(
      `INSERT INTO permission (
        user_id,
        project_id,
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
        canApplyDocClassificationsdocument,
        canViewTender,
        canDeleteDocumentTender,
        canDownloadDocumentTender,
        canShareDocumentThoughEmailTender,
        canViewBoq,
        canDeleteDocumentBoq,
        canDownloadDocumentBoq,
        canShareDocumentThoughEmailBoq,
        canViewBucket,
        canDeleteDocumentBucket,
        canDownloadDocumentBucket,
        canShareDocumentThoughEmailBucket,
        canviewprequalificationsubmittal,
        canupdateextractedfeildsprequalificationsubmittal,
        cansharedocumentthoughemailprequalificationsubmittal,
        candeletedocumentprequalificationsubmittal,
        candownloaddocumentprequalificationsubmittal,
        canexportdocumentinfoasexcelfileprequalificationsubmittal,
        canviewtechnicalsubmittal,
        canupdateextractedfeildstechnicalsubmittal,
        cansharedocumentthoughemailtechnicalsubmittal,
        candeletedocumenttechnicalsubmittal,
        candownloaddocumenttechnicalsubmittal,
        canexportdocumentinfoasexcelfiletechnicalsubmittal,
        canviewmethodstatementsubmittal,
        canupdateextractedfeildsmethodstatementsubmittal,
        cansharedocumentthoughemailmethodstatementsubmittal,
        candeletedocumentmethodstatementsubmittal,
        candownloaddocumentmethodstatementsubmittal,
        canexportdocumentinfoasexcelfilemethodstatementsubmittal,
        canviewrequestforinformation,
        canupdateextractedfeildsrequestforinformation,
        cansharedocumentthoughemailrequestforinformation,
        candeletedocumentrequestforinformation,
        candownloaddocumentrequestforinformation,
        canexportdocumentinfoasexcelfilerequestforinformation,
        canviewmaterialinspectionrequest,
        canupdateextractedfeildsmaterialinspectionrequest,
        cansharedocumentthoughemailmaterialinspectionrequest,
        candeletedocumentmaterialinspectionrequest,
        candownloaddocumentmaterialinspectionrequest,
        canexportdocumentinfoasexcelfilematerialinspectionrequest,
        canviewworkinspectionrequest,
        canupdateextractedfeildsworkinspectionrequest,
        cansharedocumentthoughemailworkinspectionrequest,
        candeletedocumentworkinspectionrequest,
        candownloaddocumentworkinspectionrequest,
        canexportdocumentinfoasexcelfileworkinspectionrequest,
        canviewarchitecturalinspectionrequest,
        canupdateextractedfeildsarchitecturalinspectionrequest,
        cansharedocumentthoughemailarchitecturalinspectionrequest,
        candeletedocumentarchitecturalinspectionrequest,
        candownloaddocumentarchitecturalinspectionrequest,
        canexportdocumentinfoasexcelfilearchitecturalinspectionrequest,
        canviewnonconformancereport,
        canupdateextractedfeildsnonconformancereport,
        cansharedocumentthoughemailnonconformancereport,
        candeletedocumentnonconformancereport,
        candownloaddocumentnonconformancereport,
        canexportdocumentinfoasexcelfilenonconformancereport,
        canviewsiteinstruction,
        canupdateextractedfeildssiteinstruction,
        cansharedocumentthoughemailsiteinstruction,
        candeletedocumentsiteinstruction,
        candownloaddocumentsiteinstruction,
        canexportdocumentinfoasexcelfilesiteinstruction,
        candeletetaskgroup,
        canedittaskgroup) 
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98,$99,$100,$101,$102  ,$103,$104,$105,$106,$107,$108,$109,$110,$111,$112,$113,$114,$115,$116,$117,$118,$119,$120,$121,$122,$123,$124,$125,$126,$127,$128,$129,$130,$131,$132,$133,$134,$135,$136,$137,$138,$139,$140,$141,$142,$143,$144,$145,$146,$147,$148,$149,$150,$151,$152,$153,$154,$155,$156,$157,$158,$159,$160,$161,$162,$163,$164,$165,$166,$167,$168,$169,$170,$171,$172,$173) RETURNING *`,
      [
        user_id,
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
        permissions.canViewTender,
        permissions.canDeleteDocumentTender,
        permissions.canDownloadDocumentTender,
        permissions.canShareDocumentThoughEmailTender,
        permissions.canViewBoq,
        permissions.canDeleteDocumentBoq,
        permissions.canDownloadDocumentBoq,
        permissions.canShareDocumentThoughEmailBoq,
        permissions.canViewBucket,
        permissions.canDeleteDocumentBucket,
        permissions.canDownloadDocumentBucket,
        permissions.canShareDocumentThoughEmailBucket,
        permissions.canviewprequalificationsubmittal,
        permissions.canupdateextractedfeildsprequalificationsubmittal,
        permissions.cansharedocumentthoughemailprequalificationsubmittal,
        permissions.candeletedocumentprequalificationsubmittal,
        permissions.candownloaddocumentprequalificationsubmittal,
        permissions.canexportdocumentinfoasexcelfileprequalificationsubmittal,
        permissions.canviewtechnicalsubmittal,
        permissions.canupdateextractedfeildstechnicalsubmittal,
        permissions.cansharedocumentthoughemailtechnicalsubmittal,
        permissions.candeletedocumenttechnicalsubmittal,
        permissions.candownloaddocumenttechnicalsubmittal,
        permissions.canexportdocumentinfoasexcelfiletechnicalsubmittal,
        permissions.canviewmethodstatementsubmittal,
        permissions.canupdateextractedfeildsmethodstatementsubmittal,
        permissions.cansharedocumentthoughemailmethodstatementsubmittal,
        permissions.candeletedocumentmethodstatementsubmittal,
        permissions.candownloaddocumentmethodstatementsubmittal,
        permissions.canexportdocumentinfoasexcelfilemethodstatementsubmittal,
        permissions.canviewrequestforinformation,
        permissions.canupdateextractedfeildsrequestforinformation,
        permissions.cansharedocumentthoughemailrequestforinformation,
        permissions.candeletedocumentrequestforinformation,
        permissions.candownloaddocumentrequestforinformation,
        permissions.canexportdocumentinfoasexcelfilerequestforinformation,
        permissions.canviewmaterialinspectionrequest,
        permissions.canupdateextractedfeildsmaterialinspectionrequest,
        permissions.cansharedocumentthoughemailmaterialinspectionrequest,
        permissions.candeletedocumentmaterialinspectionrequest,
        permissions.candownloaddocumentmaterialinspectionrequest,
        permissions.canexportdocumentinfoasexcelfilematerialinspectionrequest,
        permissions.canviewworkinspectionrequest,
        permissions.canupdateextractedfeildsworkinspectionrequest,
        permissions.cansharedocumentthoughemailworkinspectionrequest,
        permissions.candeletedocumentworkinspectionrequest,
        permissions.candownloaddocumentworkinspectionrequest,
        permissions.canexportdocumentinfoasexcelfileworkinspectionrequest,
        permissions.canviewarchitecturalinspectionrequest,
        permissions.canupdateextractedfeildsarchitecturalinspectionrequest,
        permissions.cansharedocumentthoughemailarchitecturalinspectionrequest,
        permissions.candeletedocumentarchitecturalinspectionrequest,
        permissions.candownloaddocumentarchitecturalinspectionrequest,
        permissions.canexportdocumentinfoasexcelfilearchitecturalinspectionrequest,
        permissions.canviewnonconformancereport,
        permissions.canupdateextractedfeildsnonconformancereport,
        permissions.cansharedocumentthoughemailnonconformancereport,
        permissions.candeletedocumentnonconformancereport,
        permissions.candownloaddocumentnonconformancereport,
        permissions.canexportdocumentinfoasexcelfilenonconformancereport,
        permissions.canviewsiteinstruction,
        permissions.canupdateextractedfeildssiteinstruction,
        permissions.cansharedocumentthoughemailsiteinstruction,
        permissions.candeletedocumentsiteinstruction,
        permissions.candownloaddocumentsiteinstruction,
        permissions.canexportdocumentinfoasexcelfilesiteinstruction,
        permissions.canDeleteTaskGroupworkSpace,
        permissions.canEditTaskGroupworkSpace,
      ]
    );
    const DatasetsInDbQuery6 = await pools2.query(
      "INSERT INTO user_department (user_id,department_id) VALUES($1,$2)",
      [user_id, department_id]
    );
    if (user_role === "hod") {
      const DatasetsInDbQuery7 = await pools2.query(
        "Update department SET head_of_department = $1 WHERE department_id = $2",
        [user_id, department_id]
      );
    }
    await pools2.query("COMMIT");
    DatasetsInDb = DatasetsInDbQuery3.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.post("/registerRole", authorize, async (req, res) => {
  const { role_name } = req.body;
  try {
    console.log("role_name:", role_name);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO roles (role_name) VALUES($1) RETURNING *",
      [role_name]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.post("/addusers_permissions", authorize, async (req, res) => {
  const { permissions_id, user_id } = req.body;
  try {
    console.log("permissions_id:", permissions_id);
    console.log("user_id:", user_id);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO users_permissions (permissions_id,user_id) VALUES($1,$2) RETURNING *",
      [permissions_id, user_id]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.get("/getAllRole", authorize, async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM roles");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.delete("/deleteRole", authorize, async (req, res) => {
  const { role_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "DELETE FROM roles WHERE role_id  = '" + role_id + "' RETURNING *"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.get("/getAllpermissions", authorize, async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM permissions");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.delete("/deletepermissions", authorize, async (req, res) => {
  const { permissions_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "DELETE FROM permissions WHERE permissions_id  = '" +
        permissions_id +
        "' RETURNING *"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

rolePermissions.post("/addroles_permissions", authorize, async (req, res) => {
  const { permissions_id, role_id } = req.body;
  try {
    console.log("permissions_id:", permissions_id);
    console.log("role_id:", role_id);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO roles_permissions (permissions_id,role_id) VALUES($1,$2) RETURNING *",
      [permissions_id, role_id]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = rolePermissions;
