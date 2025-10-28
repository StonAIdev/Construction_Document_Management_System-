const { Router, text } = require("express");
const pools = require("../../db");
const dotenv = require("dotenv");
const format = require("pg-format");
const axios = require("axios");
const { response } = require("express");
const client = require("../../elasticSearch");
const authorize = require("../../middleware/authorization");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

("use strict");
const fs = require("fs");
var qs = require("qs");
const express = require("express");
const { Console } = require("console");
const { start } = require("repl");

const AdminAppProject = express.Router();

AdminAppProject.post("/createUser", async (req, res) => {
  const {
    username,
    enterprise_id,
    email_address,
    user_role,
    firstName,
    lastName,
    password,
  } = req.body;

  const pools2 = await pools.getPool();

  try {
    const user = await pools2.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      return res.json("User already exist!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery = await pools2.query(
        "INSERT INTO users (username,user_password,enterprise_id,email_address,user_role,firstname,lastname) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING user_id",
        [
          username,
          bcryptPassword,
          enterprise_id,
          email_address,
          user_role,
          firstName,
          lastName,
        ]
      );
      res.json(DatasetsInDbQuery.rows[0].enterprise_id);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
  // a client can be shared by different commands.
});

AdminAppProject.post("/createEnterprise", async (req, res) => {
  const { name, country, city, contact } = req.body;
  console.log("eid", name, country, city, contact, req.body);

  try {
    const pools2 = await pools.getPool();

    const enterprises = await pools2.query(
      "SELECT * FROM enterprise WHERE enterprise_name = $1",
      [name]
    );
    if (enterprises.rows.length > 0) {
      console.log("already exist enterprise");
      return res.json("Enterprise already exist!");
    } else {
      const DatasetsInDbQuery = await pools2.query(
        `insert into enterprise(enterprise_name,enterprise_location, city, contactnumber) values ($1,$2,$3,$4) RETURNING enterprise_id`,
        [name, country, city, contact]
      );
      res.json(DatasetsInDbQuery.rows[0].enterprise_id);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
  // a client can be shared by different commands.
});

AdminAppProject.post("/deleteEnterprise", async (req, res) => {
  const { eid } = req.body;
  console.log("eid", eid);

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery1 = await pools2.query(
      `delete from users where enterprise_id = ${eid}`
    );
    const DatasetsInDbQuery2 = await pools2.query(
      `delete from enterprise where enterprise_id = ${eid}`
    );

    console.log("deleted")
    res.json("Delete success");

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
  // a client can be shared by different commands.
});

AdminAppProject.get("/getAllEnterprise", async (req, res) => {
  // a client can be shared by different commands.
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM Enterprise");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

AdminAppProject.get("/getAllProjects", async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(`SELECT projects.*,enterprise.enterprise_name,enterprise.enterprise_id,users.username,users.user_id FROM projects left join enterprise on projects.enterprise_id = enterprise.enterprise_id  left join  users on projects.project_admin = users.user_id order by enterprise_name`);
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

AdminAppProject.get("/getAllEnterpriseUsers", async (req, res) => {
  // a client can be shared by different commands.
  const { enterprise_id } = req.query;
  console.log("eididdd", enterprise_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select distinct user_id,firstname,lastname,username,user_role,created_by from users where enterprise_id=${enterprise_id} order by username`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


AdminAppProject.post("/deleteProject", async (req, res) => {
  const { project_id } = req.body;
  console.log(project_id);
  const pools2 = await pools.getPool();
  try {
    await pools2.query("BEGIN");
    const DatasetsInDbQuery1 = await pools2.query(
      `Select department_id from department WHERE project_id= ${project_id}`
    );

    console.log("depids", DatasetsInDbQuery1.rows);

    console.log("here1");

    DatasetsInDbQuery1.rows.forEach(async (element) => {
      await pools2.query(
        `Delete from user_department WHERE department_id= ${element.department_id}`
      );
    });
    const DatasetsInDbQuery2 = await pools2.query(
      `Delete from aliases WHERE project_id= ${project_id}`
    );
    console.log("here2");

    const DatasetsInDbQuery4 = await pools2.query(
      `Delete from department WHERE project_id= ${project_id}`
    );
    console.log("here3");

    const DatasetsInDbQuery3 = await pools2.query(
      `Delete from user_project WHERE project_id= ${project_id}`
    );
    console.log("here4");

    const DatasetsInDbQuery5 = await pools2.query(
      `Delete from permission WHERE project_id= ${project_id}`
    );

    const DatasetsInDbQuery6 = await pools2.query(
      `Delete from projects WHERE project_id= ${project_id}`
    );

    console.log("project deleted");
    await pools2.query("COMMIT");
    res.send("project deletion success");


  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

AdminAppProject.post("/updateProject", async (req, res) => {
  const defaultAllowedDelay  = 4;
  const {
    project_name,
    plot_number,
    sector_number,
    area,
    city,
    county,
    country,
    project_type,
    contract_scope,
    work_scope,
    start_date,
    end_date,
    project_id,
    project_admin,
    Shop_Drawing_Submital,
    Material_Submittal,
    Site_Instruction,
    Meterial_Inspection_Request,
    Technical_Submittal,
    Method_Statement_Submittal,
    Non_Conformance_Report,
    Prequalification_Submittal,
    Request_for_Information,
    Work_Inspection_Request,
    Architectural_Inspection_Request
  } = req.body;

  console.log(
    project_name,
    plot_number,
    sector_number,
    area,
    city,
    county,
    country,
    project_type,
    contract_scope,
    work_scope,
    start_date,
    end_date,
    project_id,
    project_admin,
    Shop_Drawing_Submital,
    Material_Submittal,
    Site_Instruction,
    Meterial_Inspection_Request,
    Technical_Submittal,
    Method_Statement_Submittal,
    Non_Conformance_Report,
    Prequalification_Submittal,
    Request_for_Information,
    Work_Inspection_Request,
    Architectural_Inspection_Request
  );

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery2 = await pools2.query(
      "update projects Set project_name=$1,plot_number=$2,sector_number=$3,area=$4,city=$5,county=$6,country=$7,project_type=$8,contract_scope=$9,work_scope=$10,start_date=$11,end_date=$12,project_admin=$13,Shop_Drawing_Submital=$14,Material_Submittal=$15,Site_Instruction=$16,Meterial_Inspection_Request=$17,Technical_Submittal=$18,Method_Statement_Submittal=$19,Non_Conformance_Report=$20,Prequalification_Submittal=$21,Request_for_Information=$22,Work_Inspection_Request=$23,Architectural_Inspection_Request=$24 where project_id=$25",
      [
        project_name,
        plot_number,
        sector_number,
        area,
        city,
        county,
        country,
        project_type,
        contract_scope,
        work_scope,
        start_date,
        end_date,
        project_admin,
        Shop_Drawing_Submital??defaultAllowedDelay,
        Material_Submittal??defaultAllowedDelay,
        Site_Instruction??defaultAllowedDelay,
        Meterial_Inspection_Request??defaultAllowedDelay,
        Technical_Submittal??defaultAllowedDelay,
        Method_Statement_Submittal??defaultAllowedDelay,
        Non_Conformance_Report??defaultAllowedDelay,
        Prequalification_Submittal??defaultAllowedDelay,
        Request_for_Information??defaultAllowedDelay,
        Work_Inspection_Request??defaultAllowedDelay,
        Architectural_Inspection_Request??defaultAllowedDelay,
        project_id
      ]
    );
    res.json("project updated");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});


AdminAppProject.post("/updateEnterprise", async (req, res) => {
  const {
    name,
    city,
    country,
    contact,
    enterprise_id

  } = req.body;

  console.log(
    name,
    city,
    country,
    contact

  );

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery2 = await pools2.query(
      "update enterprise Set enterprise_name=$1,enterprise_location=$2,city=$3,contactnumber=$4  where enterprise_id=$5",
      [
        name,
        city,
        country,
        contact,
        enterprise_id
      ]
    );
    res.json("project updated");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});


AdminAppProject.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // const user = await Users.findOne({
  //   username: username,
  //   password: password,
  // });

  console.log(username, password);

  if (username === "admin" && password === "admin@stonai") {
    const token = jwt.sign(
      {
        username: username,
        password: password,
      },
      "secret123"
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

AdminAppProject.post("/createEnterpriseProject", async (req, res) => {
  const {
    project_name,
    enterprise_id,
    plot_number,
    sector_number,
    area,
    city,
    county,
    country,
    project_type,
    contract_scope,
    work_scope,
    start_date,
    end_date,
    user_id,
    departments,
    project_admin,
    abbreviation_project,
    abbreviation_contractor,
  } = req.body;
  const pools2 = await pools.getPool();

  try {
    await pools2.query("BEGIN");
    const DatasetsInDbQuery2 = await pools2.query(
      "INSERT INTO projects (project_name,enterprise_id,plot_number,sector_number,area,city,county,country,project_type,contract_scope,work_scope,start_date,end_date,project_admin,abbreviation_project,abbreviation_contractor) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING project_id",
      [
        project_name,
        enterprise_id,
        plot_number,
        sector_number,
        area,
        city,
        county,
        country,
        project_type,
        contract_scope,
        work_scope,
        start_date,
        end_date,
        project_admin,
        abbreviation_project,
        abbreviation_contractor,
      ]
    );

    const DatasetsInDbQuery3 = await pools2.query(
      "INSERT INTO user_project (project_id,user_id) VALUES($1,$2) RETURNING *",
      [DatasetsInDbQuery2.rows[0].project_id, project_admin]
    );
    let departmentList = [];
    for (let department of departments) {
      console.log(department);
      departmentList.push([
        department.department_name,
        department.resposibility,
        DatasetsInDbQuery2.rows[0].project_id,
      ]);
    }
    const DatasetsInDbQuery4 = await pools2.query(
      format(
        "INSERT INTO department (department_name,resposibility,project_id) VALUES %L RETURNING *",
        departmentList
      )
    );
    await pools2.query("COMMIT");
    DatasetsInDb = DatasetsInDbQuery3.rows;
    res.json(DatasetsInDbQuery2.rows[0].project_id);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

AdminAppProject.get("/projectDepartments", async (req, res) => {
  const { project_id } = req.query;
  console.log("pidd", project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT distinct * FROM department where project_id =${project_id} order by department_name`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

AdminAppProject.post("/addProjectAdminToDep", async (req, res) => {
  const { department_id, project_id, user_id } = req.body;
  console.log("pidd", department_id, project_id, user_id);
  const pools2 = await pools.getPool();

  try {
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
        canedittaskgroup
            
            
            
            
            
            
            ) 
            
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77, $78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88, $89, $90, $91, $92, $93, $94, $95, $96, $97, $98,$99,$100,$101,$102  ,$103,$104,$105,$106,$107,$108,$109,$110,$111,$112,$113,$114,$115,$116,$117,$118,$119,$120,$121,$122,$123,$124,$125,$126,$127,$128,$129,$130,$131,$132,$133,$134,$135,$136,$137,$138,$139,$140,$141,$142,$143,$144,$145,$146,$147,$148,$149,$150,$151,$152,$153,$154,$155,$156,$157,$158,$159,$160,$161,$162,$163,$164,$165,$166,$167,$168,$169,$170,$171,$172,$173) RETURNING *`,
      [
        user_id,
        project_id,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ]
    );

    const DatasetsInDbQuery1 = await pools2.query(
      "INSERT INTO user_department (user_id,department_id) VALUES($1,$2)",
      [user_id, department_id]
    );

    console.log("user added with permission");

    await pools2.query("COMMIT");
    res.send("user added with permission");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = AdminAppProject;
