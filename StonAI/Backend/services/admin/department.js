const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require("express");
const department = express.Router();

department.post("/registerDepartment", authorize, async (req, res) => {
  const {
    project_id,
    department_name,
    resposibility,
    project_users,
    created_by,
  } = req.body;
  console.log("project_id:", project_id);
  console.log("department_name:", department_name);
  console.log("resposibility:", resposibility);
  console.log("projectUsers:", project_users);

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO department (project_id, department_name, resposibility,created_by,head_of_department,created_on) VALUES($1, $2, $3,$4,$5,$6) RETURNING *",
      [
        project_id,
        department_name,
        resposibility,
        created_by,
        project_users.user_id,
        "now()",
      ]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

department.get("/getAllDepartment", authorize, async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM department");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

department.post("/getCurrentDep", authorize, async (req, res) => {
  const { project_id, user_id } = req.body;

  console.log("recieved", project_id, user_id);

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery =
      await pools2.query(`SELECT department.department_name,department.department_id,department.head_of_department FROM department join user_department on
     user_department.department_id = department.department_id where user_id=${user_id} AND project_id = ${project_id}`);
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

department.post("/getProjectDepartments", authorize, async (req, res) => {
  const { project_id } = req.body;
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

department.post("/getProjectDepartmentsStats", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT count(*) FROM department where project_id =${project_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

department.post(
  "/getProjectDepartmentsWhileCreatingUser",
  authorize,
  async (req, res) => {
    const { project_id } = req.body;
    try {
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery = await pools2.query(
        `SELECT department_id,department_name FROM department where project_id =${project_id} order by department_name`
      );
      DatasetsInDb = DatasetsInDbQuery.rows;
      res.json(DatasetsInDb);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

department.post("/getProjectDepartmentsFilter", authorize, async (req, res) => {
  let { name, description, createdBy, createdOn, project_id } = req.body;
  if (!name) {
    name = "";
  }

  if (!description) {
    description = "";
  }

  if (!createdBy) {
    createdBy = "";
  }
  if (!createdOn) {
    createdOn = "1900-12-21 10:34:32.507124";
  }

  console.log(name, description, createdBy, createdOn, project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM department where project_id =${project_id} AND 
  
      LOWER(department_name) LIKE LOWER('` +
        name +
        `%')
     
     AND LOWER(resposibility) LIKE LOWER('` +
        description +
        `%')
        AND LOWER(created_by) LIKE LOWER('` +
        createdBy +
        `%')
       order by department_name
           `
    );
    console.log("deppp", DatasetsInDbQuery.rows);
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

department.post("/updateDepartment", authorize, async (req, res) => {
  const { department_id, department_name, resposibility, hod } = req.body;
  console.log("depppp", department_id, department_name, resposibility, hod);
  try {
    console.log("department_name:", department_name);
    console.log("resposibility:", resposibility);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "Update department Set department_name=$1,resposibility=$2,head_of_department=$3 WHERE department_id = $4",
      [department_name, resposibility, hod, department_id]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

department.post("/deleteDepartment", authorize, async (req, res) => {
  const { department_id } = req.body;
  console.log("department called", department_id);

  const pools2 = await pools.getPool();

  try {
    await pools2.query("BEGIN");
    const DatasetsInDbQuery1 = await pools2.query(
      `delete from user_department where department_id =${department_id} `
    );
    const DatasetsInDbQuery2 = await pools2.query(
      `delete from task_status where task_id IN (select task_id  from task_status where department_id =${department_id} )`
    );
    const DatasetsInDbQuery3 = await pools2.query(
      `delete from user_task where task_id IN (select task_id  from task where department_id =${department_id} ) `
    );
    const DatasetsInDbQuery4 = await pools2.query(
      `delete from comments where task_id IN (select task_id  from task where department_id =${department_id} ) `
    );
    const DatasetsInDbQuery5 = await pools2.query(
      `delete from task where department_id =${department_id} `
    );

    const DatasetsInDbQuery6 = await pools2.query(
      `delete from department where department_id =${department_id} `
    );

    await pools2.query("COMMIT");
    res.json("department deleted sucess");
  } catch (error) {
    await pools2.query("ROLLBACK");

    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// department.delete("/deleteDepartment", authorize, async (req, res) => {
//   const { enterprise_id } = req.body;
//   try {
//     const pools2 = await pools.getPool();
//     const DatasetsInDbQuery = await pools2.query(
//       "DELETE FROM enterprise WHERE enterprise_id = '" +
//         enterprise_id +
//         "' RETURNING *"
//     );
//     DatasetsInDb = DatasetsInDbQuery.rows;
//     res.json(DatasetsInDb);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

module.exports = department;
