const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const bcrypt = require("bcrypt");
const validInfo = require("../../middleware/validInfo");
const authorize = require("../../middleware/authorization");

const express = require("express");
const userinfo = express.Router();

userinfo.post("/getUserinfo", authorize, async (req, res) => {
  const { user_id } = req.body;
  console.log("user_id", user_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT users.username,users.user_id,users.email_address,users.firstname,users.lastname,users.state,users.country,users.phone_number,
       enterprise.enterprise_name,enterprise.enterprise_id, projects.project_name, projects.project_id, projects.project_admin 
       FROM users
            JOIN enterprise ON users.enterprise_id = enterprise.enterprise_id
            JOIN user_project ON users.user_id = user_project.user_id
            JOIN projects ON user_project.project_id = projects.project_id
            WHERE users.user_id = '` +
        user_id +
        `'`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

userinfo.post("/getProjectUsers", authorize, async (req, res) => {
  const { project_id } = req.body;
  console.log("project_id", project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT  DISTINCT users.username,users.user_id FROM users
            JOIN enterprise ON users.enterprise_id = enterprise.enterprise_id
            JOIN user_project ON users.user_id = user_project.user_id
            JOIN projects ON user_project.project_id = projects.project_id
            where projects.project_id=${project_id}
            
            `
    );
    DatasetsInDb = DatasetsInDbQuery.rows;

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

userinfo.post("/getEnterpriseUsers", authorize, async (req, res) => {
  // const { project_id, user_id } = req.body;
  // try {
  //   const pools2 = await pools.getPool();
  //   const DatasetsInDbQuery = await pools2.query(
  //     ` SELECT  DISTINCT users.* FROM users
  //     JOIN user_project ON users.user_id = user_project.user_id
  //     JOIN projects ON user_project.project_id = projects.project_id
  //     where projects.project_id=${project_id} `
  //     // `select distinct user_id,firstname,lastname,username,user_role,created_by from users where user_id != ${user_id} and project_id=${project_id} order by username`
  //   );
  //   DatasetsInDb = DatasetsInDbQuery.rows;

  //   res.json(DatasetsInDb);
  // } catch (error) {
  //   console.error("=====>", error.message);
  //   res.status(500).send("Server error");
  const { enterprise_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select users.firstname, users.lastname, users.user_id,users.username, users.user_role,users.created_by,users.enterprise_id from users where enterprise_id =${enterprise_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    console.error("sa", DatasetsInDbQuery.rows);

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

userinfo.post("/getEnterpriseUsersCount", authorize, async (req, res) => {
  const { enterprise_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select count(*) from users where enterprise_id=${enterprise_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
userinfo.post("/getEnterpriseUsersFilter", authorize, async (req, res) => {
  let { firstname, lastname, username, role, createdBy, enterprise_id } =
    req.body;

  if (!firstname) {
    firstname = "";
  }

  if (!lastname) {
    lastname = "";
  }

  if (!username) {
    username = "";
  }
  if (!role) {
    role = "";
  }
  if (!createdBy) {
    createdBy = "";
  }
  console.log(
    "User data to filter",
    firstname,
    lastname,
    username,
    role,
    createdBy,
    enterprise_id
  );
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select user_id,firstname,lastname,username,user_role,created_by from users where enterprise_id=${enterprise_id} AND 
  
      LOWER(firstname) LIKE LOWER('` +
        firstname +
        `%')
     
     AND LOWER(lastname) LIKE LOWER('` +
        lastname +
        `%')
        AND LOWER(username) LIKE LOWER('` +
        username +
        `%') 
        AND LOWER(user_role) LIKE LOWER('` +
        role +
        `%') 
        AND LOWER(created_by) LIKE LOWER('` +
        createdBy +
        `%') 
        order by username
      `
    );

    DatasetsInDb = DatasetsInDbQuery.rows;

    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

userinfo.post("/getUserPermissions", authorize, async (req, res) => {
  const { user, project } = req.body;
  console.log("req.body", user, project);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM permission WHERE user_id=${user.user_id} AND project_id =${project.project_id}`
    );

    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
userinfo.post("/getUserRole", authorize, async (req, res) => {
  const { userInfo } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT user_role FROM users WHERE user_id =${userInfo.user_id}  AND enterprise_id =${userInfo.enterprise_id} `
    );

    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message, "error in user role");
    res.status(500).send("Server error");
  }
});
userinfo.post("/getUserPermissionsFromList", authorize, async (req, res) => {
  const { user_id, project } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM permission WHERE user_id=${user_id} AND project_id =${project.project_id}`
    );

    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
userinfo.post("/updateUser", authorize, async (req, res) => {
  const { firstName, lastName, phone, country, userId } = req.body;

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "Update users Set firstname=$1,lastname=$2,phone_number=$3,country=$4 WHERE user_id = $5",
      [firstName, lastName, phone, country, userId]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//Change Password
userinfo.post("/changePassword", validInfo, async (req, res) => {
  const { userId, username, currentPassword, changePassword, confirmPassword } =
    req.body;
  console.log("---->", req.body);

  try {
    const pools2 = await pools.getPool();
    const user = await pools2.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("user----/.", user.rows);
    const validPassword = await bcrypt.compare(
      currentPassword,
      user.rows[0].user_password
    );

    if (!validPassword) {
      console.log("---->", "password not matched");

      return res.send("Password not matched");
    } else if (changePassword === confirmPassword) {
      //  res.json("match password");
      console.log("change password--->", changePassword);
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(changePassword, salt);
      console.log("bcryptPassword---->", bcryptPassword);
      try {
        // const DatasetsInDbQuery = await pools2.query(
        //   "Update users Set user_password=$1 WHERE user_id = $2",
        //   [bcryptPassword, userId]
        // );
        const DatasetsInDbQuery = await pools2.query(
          "Update users Set user_password=$1 WHERE user_id = $2",
          [bcryptPassword, userId]
        );
        res.send("updated");
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      }
    } else {
      console.log("Password not matched");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

userinfo.post("/updateUserPermissions", authorize, async (req, res) => {
  const {
    permissions,
    permission_id,
    user_role,
    user_id,
    project_id,
    department_id,
  } = req.body;
  // console.log(permissions, permission_id, user_role);
  const pools2 = await pools.getPool();
  console.log("ids", user_id, project_id);

  try {
    await pools2.query("BEGIN");

    const DatasetsInDbQuery = await pools2.query(
      "Update users Set user_role=$1 WHERE user_id = $2",
      [user_role, user_id]
    );

    if (user_role === "hod") {
      const DatasetsInDbQuery7 = await pools2.query(
        "Update department SET head_of_department = $1 WHERE department_id = $2",
        [user_id, department_id]
      );
    }

    const DatasetsInDbQuery4 = await pools2.query(
      `Update permission set
            canViewContract=$1,
            canUpdateExtractedFeildsContract=$2,
            canUpdateAliasesContract=$3,
            canDeleteDocumentContract=$4,
            canDownloadDocumentContract=$5,
            canShareDocumentThoughEmailContract=$6,
            canShareDocumentThoughStonAiContract=$7,
            canExportDocumentInfoAsExcelFileContract=$8,
            canExportExtractedDocumentFieldsAsExcelFileContract=$9,
            canViewresponsibilityMatrix=$10,
            canUpdateExtractedFeildsresponsibilityMatrix=$11,
            canUpdateAliasesresponsibilityMatrix=$12,
            canDeleteDocumentresponsibilityMatrix=$13,
            canDownloadDocumentresponsibilityMatrix=$14,
            canShareDocumentThoughEmailresponsibilityMatrix=$15,
            canShareDocumentThoughStonAiresponsibilityMatrix=$16,
            canExportDocumentInfoAsExcelFileresponsibilityMatrix=$17,
            canExportExtractedDocumentFieldsAsExcelFileresponsibilityMatrix=$18,
            canViewmaterialSubmittal=$19,
            canUpdateExtractedFeildsmaterialSubmittal=$20,
            canUpdateAliasesmaterialSubmittal=$21,
            canDeleteDocumentmaterialSubmittal=$22,
            canDownloadDocumentmaterialSubmittal=$23,
            canShareDocumentThoughEmailmaterialSubmittal=$24,
            canShareDocumentThoughStonAimaterialSubmittal=$25,
            canExportDocumentInfoAsExcelFilematerialSubmittal=$26,
            canExportExtractedDocumentFieldsAsExcelFilematerialSubmittal=$27,
            canViewshopDrawingSubmittal=$28,
            canUpdateExtractedFeildsshopDrawingSubmittal=$29,
            canUpdateAliasesshopDrawingSubmittal=$30,
            canDeleteDocumentshopDrawingSubmittal=$31,
            canDownloadDocumentshopDrawingSubmittal=$32,
            canShareDocumentThoughEmailshopDrawingSubmittal=$33,
            canShareDocumentThoughStonAishopDrawingSubmittal=$34,
            canExportDocumentInfoAsExcelFileshopDrawingSubmittal=$35,
            canExportExtractedDocumentFieldsAsExcelFileshopDrawingSubmittal=$36,
            canViewletter=$37,
            canUpdateExtractedFeildsletter=$38,
            canUpdateAliasesletter=$39,
            canDeleteDocumentletter=$40,
            canDownloadDocumentletter=$41,
            canShareDocumentThoughEmailletter=$42,
            canShareDocumentThoughStonAiletter=$43,
            canExportDocumentInfoAsExcelFileletter=$44,
            canExportExtractedDocumentFieldsAsExcelFileletter=$45,
            canViewminutesOfmeeting=$46,
            canUpdateExtractedFeildsminutesOfmeeting=$47,
            canUpdateAliasesminutesOfmeeting=$48,
            canDeleteDocumentminutesOfmeeting=$49,
            canDownloadDocumentminutesOfmeeting=$50,
            canShareDocumentThoughEmailminutesOfmeeting=$51,
            canShareDocumentThoughStonAiminutesOfmeeting=$52,
            canExportDocumentInfoAsExcelFileminutesOfmeeting=$53,
            canExportExtractedDocumentFieldsAsExcelFileminutesOfmeeting=$54,
            canViewpageDashboard=$55,
            canViewFilterspageDashboard=$56,
            canViewEnterpriseStatisticspageDashboard=$57,
            canViewProjectStatisticspageDashboard=$58,
            canViewDepartmentStatisticspageDashboard=$59,
            canViewUserStatisticspageDashboard=$60,
            canViewOrganisationalChartpageDashboard=$61,
            canViewpageWorkSpace=$62,
            canViewMyTaskpageWorkSpace=$63,
            canViewAssingedTaskpageWorkSpace=$64,
            canFilterTaskpageWorkSpace=$65,
            canViewpageAISearch=$66,
            canViewpageMail=$67,
            canViewpageFolder=$68,
            canViewFilterspageFolder=$69,
            canViewDocViewerpageFolder=$70,
            canViewpageAccount=$71,
            canViewpageSetting=$72,
            canViewpageAdmin=$73,
            canViewUserspageAdmin=$74,
            canViewProjectspageAdmin=$75,
            canViewDepartmentspageAdmin=$76,
            canViewusers=$77,
            canCreateUsersusers=$78,
            canDeleteUsersusers=$79,
            canUpdateUsersDetailsusers=$80,
            canAddUsersToProjectusers=$81,
            canViewprojects=$82,
            canCreateProjectsprojects=$83,
            canDeleteProjectsprojects=$84,
            canUpdateProjectsDetailsprojects=$85,
            canViewdepartments=$86,
            canCreateDepartmentsdepartments=$87,
            canDeleteDepartmentsdepartments=$88,
            canUpdateDepartmentsdepartments=$89,
            canViewworkSpace=$90,
            canCreateTaskworkSpace=$91,
            canEditTaskworkSpace=$92,
            canDeleteTaskworkSpace=$93,
            NotifyTaskThroughEmailworkSpace=$94,
            NotifyTaskThroughStonAiworkSpace=$95,
            canAssignTasktoAnyoneInEnterpriseworkSpace=$96,
            canAssingTasktoAnyoneInProjectworkSpace=$97,
            canAssingTasktoAnyoneIndepartmentworkSpace=$98,
            canViewdocument=$99,
            canUplaodDocumentsdocument=$100,
            canBulkUploadDocumentsdocument=$101,
            canApplyForDocExtractiondocument=$102,
            canApplyDocClassificationsdocument=$103,
            canViewTender=$104,
            canDeleteDocumentTender=$105,
            canDownloadDocumentTender=$106,
            canShareDocumentThoughEmailTender=$107,
            canViewBoq=$108,
            canDeleteDocumentBoq=$109,
            canDownloadDocumentBoq=$110,
            canShareDocumentThoughEmailBoq=$111,
            canViewBucket=$112,
            canDeleteDocumentBucket=$113,
            canDownloadDocumentBucket=$114,
            canShareDocumentThoughEmailBucket=$115,
            canviewprequalificationsubmittal=$116,
            canupdateextractedfeildsprequalificationsubmittal=$117,
            cansharedocumentthoughemailprequalificationsubmittal=$118,
            candeletedocumentprequalificationsubmittal=$119,
            candownloaddocumentprequalificationsubmittal=$120,
            canexportdocumentinfoasexcelfileprequalificationsubmittal=$121,
            canviewtechnicalsubmittal=$122,
            canupdateextractedfeildstechnicalsubmittal=$123,
            cansharedocumentthoughemailtechnicalsubmittal=$124,
            candeletedocumenttechnicalsubmittal=$125,
            candownloaddocumenttechnicalsubmittal=$126,
            canexportdocumentinfoasexcelfiletechnicalsubmittal=$127,
            canviewmethodstatementsubmittal=$128,
            canupdateextractedfeildsmethodstatementsubmittal=$129,
            cansharedocumentthoughemailmethodstatementsubmittal=$130,
            candeletedocumentmethodstatementsubmittal=$131,
            candownloaddocumentmethodstatementsubmittal=$132,
            canexportdocumentinfoasexcelfilemethodstatementsubmittal=$133,
            canviewrequestforinformation=$134,
            canupdateextractedfeildsrequestforinformation=$135,
            cansharedocumentthoughemailrequestforinformation=$136,
            candeletedocumentrequestforinformation=$137,
            candownloaddocumentrequestforinformation=$138,
            canexportdocumentinfoasexcelfilerequestforinformation=$139,
            canviewmaterialinspectionrequest=$140,
            canupdateextractedfeildsmaterialinspectionrequest=$141,
            cansharedocumentthoughemailmaterialinspectionrequest=$142,
            candeletedocumentmaterialinspectionrequest=$143,
            candownloaddocumentmaterialinspectionrequest=$144,
            canexportdocumentinfoasexcelfilematerialinspectionrequest=$145,
            canviewworkinspectionrequest=$146,
            canupdateextractedfeildsworkinspectionrequest=$147,
            cansharedocumentthoughemailworkinspectionrequest=$148,
            candeletedocumentworkinspectionrequest=$149,
            candownloaddocumentworkinspectionrequest=$150,
            canexportdocumentinfoasexcelfileworkinspectionrequest=$151,
            canviewarchitecturalinspectionrequest=$152,
            canupdateextractedfeildsarchitecturalinspectionrequest=$153,
            cansharedocumentthoughemailarchitecturalinspectionrequest=$154,
            candeletedocumentarchitecturalinspectionrequest=$155,
            candownloaddocumentarchitecturalinspectionrequest=$156,
            canexportdocumentinfoasexcelfilearchitecturalinspectionrequest=$157,
            canviewnonconformancereport=$158,
            canupdateextractedfeildsnonconformancereport=$159,
            cansharedocumentthoughemailnonconformancereport=$160,
            candeletedocumentnonconformancereport=$161,
            candownloaddocumentnonconformancereport=$162,
            canexportdocumentinfoasexcelfilenonconformancereport=$163,
            canviewsiteinstruction=$164,
            canupdateextractedfeildssiteinstruction=$165,
            cansharedocumentthoughemailsiteinstruction=$166,
            candeletedocumentsiteinstruction=$167,
            candownloaddocumentsiteinstruction=$168,
            canexportdocumentinfoasexcelfilesiteinstruction=$169,
            candeletetaskgroup=$170,
            canedittaskgroup=$171
            where user_id = $172 and project_id = $173`,
      [
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
        user_id,
        project_id,
      ]
    );

    DatasetsInDb = DatasetsInDbQuery4.rows;
    await pools2.query("COMMIT");

    res.json(DatasetsInDb);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

userinfo.post("/deleteUser", authorize, async (req, res) => {
  const { user_id } = req.body;
  console.log("usID", user_id);
  const pools2 = await pools.getPool();
  try {
    await pools2.query("BEGIN");
    const DatasetsInDbQuery0 = await pools2.query(
      `Delete from permission WHERE user_id= ${user_id}`
    );
    console.log("here1");
    const DatasetsInDbQuery1 = await pools2.query(
      `Delete from online_users WHERE user_id= ${user_id}`
    );
    console.log("here2");

    const DatasetsInDbQuery2 = await pools2.query(
      `Delete from user_project WHERE user_id= ${user_id}`
    );
    console.log("here3");

    const DatasetsInDbQuery3 = await pools2.query(
      `Delete from user_task WHERE user_id= ${user_id}`
    );
    console.log("here4");

    const DatasetsInDbQuery4 = await pools2.query(
      `Delete from notifications WHERE user_id= ${user_id}`
    );
    console.log("here5");

    const DatasetsInDbQuery5 = await pools2.query(
      `Delete from user_department WHERE user_id= ${user_id}`
    );
    console.log("here6");

    const DatasetsInDbQuery6 = await pools2.query(
      `Delete from users WHERE user_id= ${user_id}`
    );
    console.log("here7");

    await pools2.query("COMMIT");
    console.log("user deleted");
    res.send("project deletion success");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});
module.exports = userinfo;
