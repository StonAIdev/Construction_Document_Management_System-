const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");
const client = require("../../elasticSearch");

var format = require("pg-format");
const express = require("express");
const projects = express.Router();

projects.post("/registerProjects", authorize, async (req, res) => {
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
      [DatasetsInDbQuery2.rows[0].project_id, user_id]
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
    res.json(DatasetsInDb);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

projects.post(
  "/registerProjectsWithDepartment",
  authorize,
  async (req, res) => {
    const { project_name, department_name } = req.body;
    console.log("project_name", project_name);
    console.log("department_name", department_name);
    try {
      console.log("project_name:", project_name);
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery = await pools2.query(
        "INSERT INTO projects (project_name) VALUES($1) RETURNING *",
        [project_name]
      );
      DatasetsInDb = DatasetsInDbQuery.rows;
      for (department in department_name) {
        console.log("department_name[department]", department_name[department]);

        console.log("DatasetsInDb[0].project_id", DatasetsInDb[0].project_id);
        const DatasetsInDbQuery = await pools2.query(
          "INSERT INTO department_project (project_id,department_id) VALUES($1,$2)",
          [
            DatasetsInDb[0].project_id,
            department_name[department].department_id,
          ]
        );
      }
      DatasetsInDb = DatasetsInDbQuery.rows;
      res.json(DatasetsInDb);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

projects.post("/getDistinctProjectsForOneUser", authorize, async (req, res) => {
  const { username } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT DISTINCT projects.project_name,projects.project_id
            FROM users
            JOIN department ON users.department_id=department.department_id
            JOIN department_project ON department.department_id=department_project.department_id
            JOIN projects ON department_project.project_id=projects.project_id
            JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
            WHERE users.username = '` +
      username +
      `'`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
projects.post("/getDepartmentsForEnterprise", authorize, async (req, res) => {
  const { username } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT department.department_id,department.department_name, enterprise.enterprise_name
            FROM department 
            JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
            WHERE enterprise.enterprise_id =(
              SELECT enterprise.enterprise_id
              FROM users
              JOIN department ON users.department_id=department.department_id
              JOIN enterprise ON department.enterprise_id=enterprise.enterprise_id
              WHERE users.username = '` +
      username +
      `'
            )`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/getEnterpriseProjects", authorize, async (req, res) => {
  const { enterprise_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT distinct * FROM projects where enterprise_id=${enterprise_id}  order by project_name`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/getEnterpriseProjectsCount", authorize, async (req, res) => {
  const { enterprise_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT count(*) FROM projects where enterprise_id=${enterprise_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
projects.post("/getEnterpriseProjectsFilter", authorize, async (req, res) => {
  let { name, type, startdate, enddate, enterprise_id } = req.body;
  console.log(req.body);
  if (!name) {
    name = "";
  }

  if (!type) {
    type = "";
  }

  if (!startdate) {
    startdate = "1900-12-21 10:34:32.507124";
  }
  if (!enddate) {
    enddate = "2090-12-21 10:34:32.507124";
  }
  console.log(name, type, startdate, enddate, enterprise_id);

  try {
    const pools2 = await pools.getPool();
    DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM projects WHERE enterprise_id = ${enterprise_id}  AND 
  
 LOWER(project_name) LIKE LOWER('` +
      name +
      `%')

AND LOWER(project_type) LIKE LOWER('` +
      type +
      `%')
AND start_date >=  '` +
      startdate +
      `'
AND end_date <=  '` +
      enddate +
      `' ` +
      `      order by project_name
      `
    );

    DatasetsInDb = DatasetsInDbQuery.rows;
    console.log("filter projects", DatasetsInDbQuery.rows);
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

projects.get("/getAllProjects", authorize, async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM projects");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/updateProject", authorize, async (req, res) => {
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
    project_admin
  );

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery2 = await pools2.query(
      "update projects Set project_name=$1,plot_number=$2,sector_number=$3,area=$4,city=$5,county=$6,country=$7,project_type=$8,contract_scope=$9,work_scope=$10,start_date=$11,end_date=$12,project_admin=$13 where project_id=$14",
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
        project_id,
      ]
    );
    res.json("project updated");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/deleteProject", authorize, async (req, res) => {
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

    await pools2.query("COMMIT");
    console.log("project deleted");
    res.send("project deletion success");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/registerdepartment_project", authorize, async (req, res) => {
  const { department_id, project_id } = req.body;
  try {
    console.log("department_id:", department_id);
    console.log("project_id:", project_id);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO department_project (department_id,project_id) VALUES($1,$2) RETURNING *",
      [department_id, project_id]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/addSubcontractor", authorize, async (req, res) => {
  const {
    project_id,
    name,
    country,
    city,
    location,
    manager_name,
    manager_email_address,
    scope,
    contract_type,
    logo
  } = req.body;
  try {
    console.log(
      "project_id:",
      project_id,
      name,
      country,
      city,
      location,
      manager_name,
      manager_email_address,
      scope,
      contract_type
    );
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO subcontractor (name,country,city,location,manager_name,manager_email_address,scope,contract_type,project_id,logo) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",
      [
        name,
        country,
        city,
        location,
        manager_name,
        manager_email_address,
        scope,
        contract_type,
        project_id,
        logo
      ]
    );
    res.send("subcontractor created");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//Get Subcontractor
projects.get("/getSubcontractors", authorize, async (req, res) => {
  const project_id = req.query.project_id;

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM subcontractor where project_id = ${project_id}`
    );
    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

//Delete Subcontractor

projects.delete("/deleteSubcontractor", async (req, res) => {
  try {
    const sub_id = req.query.sub_id;
    const pools2 = await pools.getPool();
    console.log("......", req.query.sub_id);

    const deleteSubcontractor = await pools2.query(`DELETE FROM subcontractor WHERE sub_id = ${sub_id}`);
    res.json("subcontractor is deleted")
  } catch (err) {
    console.log(err.message);

  }
})

//Edit subcontractor

projects.post("/updateSubcontractor", authorize, async (req, res) => {
  const {
    sub_id,
    name,
    scope,
    contract_type,
    country,
    city,
    location,
    manager_name,
    manager_email_address
  } = req.body.values;
  console.log("req--->", req.body.values);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery2 = await pools2.query(
      `update subcontractor Set name = '${name}',scope = '${scope}',contract_type = '${contract_type}',city = '${city}',country = '${country}',location = '${location}',manager_name = '${manager_name}',manager_email_address = '${manager_email_address}' where sub_id = ${sub_id}`,
      []
    );
    res.json("subcontractor updated");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }

})

projects.post("/getSubcontractors", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    console.log("project_id:", project_id);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select name from subcontractor where project_id = ${project_id}`
    );
    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
projects.post("/getProject", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    console.log("project_id:", project_id);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select * from projects where project_id = ${project_id}`
    );
    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

projects.post("/getOtherCategoryNames", authorize, async (req, res) => {
  const { project_id,subContractor } = req.body;
  console.log("project_id,subContractor",project_id,subContractor);
  
  var filterList = [];
  if(typeof subContractor=== "undefined" ||subContractor === ""){
    filterList.push(                
      {
        "term": {
            "project_id.keyword": project_id
        }
      }
    )
  }else{
    filterList.push(
      {
        "term": {
            "project_id.keyword": project_id
        }
      },
      {
        "term": {
            "subContractor.keyword": subContractor
        }
      }
    )
  }
  query = {
          "query": {
            "bool": {
              "must":filterList
            }
          },
          "size": 0,
          "aggs": {
              "distinct_OtherCat": {
                  "terms": {
                      "field": "otherDocumentCategory.keyword",
                      "size" : 100
                  }
              }
          }
      
    };
  try {
      const client1 = await client.getEs();
      const { body } = await client1.search({
        index: "documents",
        body: query,
      });
      console.log("boday", body.aggregations.distinct_OtherCat.buckets);
      var list = body.aggregations.distinct_OtherCat.buckets.map((item)=>item.key);
      res.send(list);
    } catch (error) {
      console.error(error.message);
      res.send("File with similar name already exists! and will not be uploaded");
    }
});

module.exports = projects;
