const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require("express");
const tasks = express.Router();

/////////////Get Queries/////////////

tasks.post("/getTasks", authorize, async (req, res) => {
  const { user_id, project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM task
      JOIN task_groups ON task_groups.group_id =  task.group_id
      join users on task.task_creator = users.user_id
      WHERE task.project_id = ${project_id} AND task.task_creator = ${user_id} AND task.my_task = TRUE  order by task_deadline`
    );

    console.log("checckkkk", DatasetsInDbQuery);

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

////// Dash Board Apis
tasks.post("/getMyTasksStats", authorize, async (req, res) => {
  const { user_id, project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select
      task_status, count(task_status)
    from
      task_status
    where
      status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id)
     AND project_id = ${project_id} AND user_id = ${user_id}  AND task_status.my_task = TRUE  group by task_status.task_status;
      `
    );

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getTaskCreators", authorize, async (req, res) => {
  const { user_id, project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select distinct user_id,username from task join users on task.task_creator=users.user_id   WHERE task.project_id = ${project_id} `
    );

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getMyTasksStatsFilter", authorize, async (req, res) => {
  let { user_id, project_id, task_creator, start_date, deadline } = req.body;
  console.log(
    "checkkkk",
    user_id,
    project_id,
    task_creator,
    start_date,
    deadline
  );

  if (task_creator) {
    user_id = task_creator.user_id;
  }
  if (!start_date) {
    start_date = "1900-12-21 10:34:32.507124";
  }
  if (!deadline) {
    deadline = "2090-12-21 10:34:32.507124";
  }
  console.log();
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select
      task_status, count(task_status)
    from
      task_status
    where
      status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id)
     AND project_id = ${project_id} AND user_id = ${user_id}  AND task_status.my_task = TRUE  
      AND status_update_date BETWEEN '${start_date}' AND '${deadline}'  group by task_status.task_status;
      `
    );

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getAssignedTasksStats", authorize, async (req, res) => {
  const { user_id, project_id } = req.body;

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select
      task_status, count(task_status)
    from
      task_status
    where
      status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id)
     AND project_id = ${project_id}  AND task_status.my_task = FALSE  group by task_status.task_status;
      `
    );

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getTotalTasksHODStats", authorize, async (req, res) => {
  const { user_id, project_id, department_id } = req.body;

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select
      task_status, count(task_status)
    from
      task_status
    where
      status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id)
     AND project_id = ${project_id} AND department_id=${department_id}  AND task_status.my_task = FALSE  group by task_status.task_status;
      `
    );

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getAssignedTasksStatsFilter", authorize, async (req, res) => {
  let { user_id, project_id, task_creator, start_date, deadline } = req.body;
  console.log(
    "ASDSfdsfnwnfiwrenfirwenfirnfernenernejkng",
    user_id,
    project_id,
    task_creator,
    start_date,
    deadline
  );
  if (!start_date) {
    start_date = "1900-12-21 10:34:32.507124";
  }
  if (!deadline) {
    deadline = "2090-12-21 10:34:32.507124";
  }

  if (task_creator) {
    try {
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery = await pools2.query(
        `select
        task_status.task_status, count(task_status.task_status)
      from
        task_status
        join user_task on user_task.task_id =  task_status.task_id
      where
        status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id)
       AND task_status.project_id = ${project_id}  AND task_status.my_task = FALSE    AND  user_task.user_id = ${task_creator}
       AND task_status.status_update_date BETWEEN '${start_date}' AND '${deadline}'
        group by task_status.task_status `
      );

      res.json(DatasetsInDbQuery);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  } else {
    try {
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery = await pools2.query(
        `select
        task_status, count(task_status)
      from
        task_status
      where
        status_update_date = (select max(status_update_date) from task_status i where i.task_id = task_status.task_id)
       AND project_id = ${project_id}  AND task_status.my_task = FALSE   
       AND task_status.status_update_date BETWEEN '${start_date}' AND '${deadline}'
        group by task_status.task_status `
      );

      res.json(DatasetsInDbQuery);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
});

tasks.post("/getProjectPendingTasks", authorize, async (req, res) => {
  const { user_id, project_id } = req.body;
  console.log("pid", project_id);

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select count(*) 
       from task
       where project_id=${project_id} AND my_task = FALSE AND (task_status='In Process' OR task_status='Delayed')`
    );

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

////// Dash Board Apis

tasks.post("/getTasksFilter", authorize, async (req, res) => {
  var {
    user_id,
    project_id,
    group_name,
    task_name,
    status,
    assigned_task_userid,
    start_date,
    deadline,
  } = req.body;

  console.log(
    "SADasdsadasdsafd",
    user_id,
    project_id,
    group_name,
    task_name,
    status,
    start_date,
    deadline
  );
  if (!group_name) {
    console.log("group_name");
    group_name = "";
  }

  if (!task_name) {
    console.log("group_task");

    task_name = "";
  }

  if (!status) {
    console.log("group_status");

    status = "";
  }
  if (!assigned_task_userid) {
    assigned_task_userid = [];
  }

  if (!start_date) {
    console.log("group_date");

    start_date = "1900-12-21 10:34:32.507124";
  }

  if (!deadline) {
    console.log("group_deadline");

    deadline = "2090-12-21 10:34:32.507124";
  }

  try {
    const pools2 = await pools.getPool();
    var DatasetsInDbQuery = null;
    if (assigned_task_userid.length < 1) {
      DatasetsInDbQuery = await pools2.query(
        `SELECT * FROM task
        JOIN task_groups ON task_groups.group_id =  task.group_id
        join users on task.task_creator = users.user_id
        WHERE task.project_id = ${project_id} AND task.task_creator = ${user_id} AND task.my_task = TRUE AND task.task_status  LIKE '` +
        status +
        `%'
    AND LOWER(task.task_name) LIKE LOWER('` +
        task_name +
        `%')
    AND LOWER(task_groups.group_name) LIKE LOWER('` +
        group_name +
        `%')
      AND task_startdate >=  '` +
        start_date +
        `'
      AND task_deadline <=  '` +
        deadline +
        `' ` +
        `      order by task_deadline
        `
      );
    } else {
      DatasetsInDbQuery = await pools2.query(
        `SELECT * FROM task
        JOIN task_groups ON task_groups.group_id =  task.group_id
        join users on task.task_creator = users.user_id
        WHERE task.project_id = ${project_id} AND task.task_creator = ${user_id} AND task.my_task = TRUE AND task.task_status  LIKE '` +
        status +
        `%' 
    AND user_task.user_id IN (SELECT unnest(ARRAY[` +
        assigned_task_userid +
        `])) 
    AND LOWER(task.task_name) LIKE LOWER('` +
        task_name +
        `%')
    AND LOWER(task_groups.group_name) LIKE LOWER('` +
        group_name +
        `%')
      AND task_startdate >=  '` +
        start_date +
        `'
      AND task_deadline <=  '` +
        deadline +
        `' ` +
        `      order by task_deadline
        `
      );
    }

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// tasks.post("/getAssignedTasks", authorize, async (req, res) => {
//   const { user_id, project_id } = req.body;
//   console.log("heree", user_id, project_id);
//   try {
//     const pools2 = await pools.getPool();
//     const DatasetsInDbQuery = await pools2.query(
//       `SELECT task.*,user_task.user_id,task_groups.group_name,task_groups.group_color,users.email_address FROM task
//       JOIN user_task on task.task_id = user_task.task_id
//       JOIN task_groups on task.group_id = task_groups.group_id
//       Join users on users.user_id = ${user_id}
//       WHERE task.project_id = ${project_id} AND task.task_id IN  (
//         SELECT task_id FROM user_task WHERE user_id = ${user_id}
//       )
//       order by task_deadline
//      `
//     );

//     res.json(DatasetsInDbQuery);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

tasks.post("/getAssignedTasks", authorize, async (req, res) => {
  const { user_id, project_id } = req.body;
  console.log("heree", user_id, project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM task 
      JOIN user_task on task.task_id = user_task.task_id 
      JOIN task_groups on task.group_id = task_groups.group_id
      join users on user_task.user_id = users.user_id

      WHERE  task.project_id = ${project_id} AND task.my_task = FALSE AND task.is_approved = TRUE AND task.task_id IN  (
        SELECT task_id FROM user_task 
      )
      order by task_deadline
     `
    );

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getAssignedTasksGroupAssigne", authorize, async (req, res) => {
  const { group_id } = req.body;
  console.log("heree", group_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT user_id,username,email_address FROM group_task 
      join users on group_task.group_users = users.user_id
      WHERE group_task.group_id = ${group_id}
     `
    );
    console.log("get group members", DatasetsInDbQuery.rows);


    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getDraftedTasks", authorize, async (req, res) => {
  const { user_id, project_id, department_id, userPosition } = req.body;
  console.log("drafted heree", user_id, project_id, department_id);
  try {
    const pools2 = await pools.getPool();
    let DatasetsInDbQuery;
    if (userPosition == "Head of Department") {
      DatasetsInDbQuery = await pools2.query(
        `SELECT * FROM task 
      JOIN user_task on task.task_id = user_task.task_id 
      JOIN task_groups on task.group_id = task_groups.group_id
      join users on user_task.user_id = users.user_id

      WHERE  task.project_id = ${project_id} AND task.department_id = ${department_id}  AND task.my_task = FALSE AND task.is_approved = FALSE AND task.task_id IN  (
        SELECT task_id FROM user_task 
      )
      order by task_deadline
     `
      );
    } else {
      DatasetsInDbQuery = await pools2.query(
        `SELECT * FROM task 
      JOIN user_task on task.task_id = user_task.task_id 
      JOIN task_groups on task.group_id = task_groups.group_id
      join users on user_task.user_id = users.user_id

      WHERE  task.project_id = ${project_id} AND task.department_id = ${department_id}  AND task.my_task = FALSE AND task.is_approved = FALSE AND task.task_creator = ${user_id} AND task.task_id IN  (
        SELECT task_id FROM user_task 
      )
      order by task_deadline
     `
      );
    }
    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/updateApproveTask", authorize, async (req, res) => {
  const { task_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `update task set is_approved = TRUE where task_id =${task_id}`
    );

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
tasks.post("/getAssignedTasksFilter", authorize, async (req, res) => {
  var {
    user_id,
    project_id,
    group_name,
    task_name,
    assigned_task_userid,
    status,
    start_date,
    deadline,
  } = req.body;

  console.log(
    "SADasdsadasdsafd",
    user_id,
    project_id,
    group_name,
    task_name,
    status,
    start_date,
    deadline,
    assigned_task_userid
  );
  if (!group_name) {
    console.log("group_name");
    group_name = "";
  }

  if (!task_name) {
    console.log("group_task");

    task_name = "";
  }

  if (!status) {
    console.log("group_status");

    status = "";
  }
  if (!assigned_task_userid) {
    assigned_task_userid = [];
    console.log("assigned_task_userid", assigned_task_userid);
  }

  if (!start_date) {
    console.log("group_date");

    start_date = "1900-12-21 10:34:32.507124";
  }

  if (!deadline) {
    console.log("group_deadline");

    deadline = "2090-12-21 10:34:32.507124";
  }
  console.log("heree", assigned_task_userid);
  try {
    const pools2 = await pools.getPool();
    var DatasetsInDbQuery = null;
    if (assigned_task_userid.length > 0) {
      DatasetsInDbQuery = await pools2.query(
        `SELECT * FROM task 
        JOIN user_task on task.task_id = user_task.task_id 
        JOIN task_groups on task.group_id = task_groups.group_id
        join users on user_task.user_id = users.user_id
  
        WHERE  task.project_id = ${project_id} AND task.my_task = FALSE AND task.is_approved = TRUE AND task.task_id IN  (
          SELECT task_id FROM user_task 
        )
        AND task.task_status LIKE '` +
        status +
        `%' 
        AND user_task.user_id IN (SELECT unnest(ARRAY[` +
        assigned_task_userid +
        `])) 
AND LOWER(task.task_name) LIKE LOWER('` +
        task_name +
        `%')

AND LOWER(task_groups.group_name) LIKE LOWER('` +
        group_name +
        `%')
  AND task_startdate >=  '` +
        start_date +
        `'
  AND task_deadline <=  '` +
        deadline +
        `' ` +
        `      order by task_deadline
        `
      );
    } else {
      DatasetsInDbQuery = await pools2.query(
        `SELECT * FROM task 
        JOIN user_task on task.task_id = user_task.task_id 
        JOIN task_groups on task.group_id = task_groups.group_id
        join users on user_task.user_id = users.user_id
  
        WHERE  task.project_id = ${project_id} AND task.my_task = FALSE AND task.task_id IN  (
          SELECT task_id FROM user_task 
        )
        AND
      task.task_status LIKE '` +
        status +
        `%' 
    
AND LOWER(task.task_name) LIKE LOWER('` +
        task_name +
        `%')

AND LOWER(task_groups.group_name) LIKE LOWER('` +
        group_name +
        `%')
  AND task_startdate >=  '` +
        start_date +
        `'
  AND task_deadline <=  '` +
        deadline +
        `' ` +
        `      order by task_deadline
        `
      );
    }

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getDraftedTasksFilter", authorize, async (req, res) => {
  var {
    user_id,
    project_id,
    group_name,
    task_name,
    assigned_task_userid,
    status,
    start_date,
    deadline,
    userPosition,
  } = req.body;

  console.log(
    "SADasdsadasdsafd",
    user_id,
    project_id,
    group_name,
    task_name,
    status,
    start_date,
    deadline,
    assigned_task_userid
  );
  if (!group_name) {
    console.log("group_name");
    group_name = "";
  }

  if (!task_name) {
    console.log("group_task");

    task_name = "";
  }

  if (!status) {
    console.log("group_status");

    status = "";
  }
  if (!assigned_task_userid) {
    assigned_task_userid = [];
    console.log("assigned_task_userid", assigned_task_userid);
  }

  if (!start_date) {
    console.log("group_date");

    start_date = "1900-12-21 10:34:32.507124";
  }

  if (!deadline) {
    console.log("group_deadline");

    deadline = "2090-12-21 10:34:32.507124";
  }
  console.log("heree", assigned_task_userid);
  try {
    const pools2 = await pools.getPool();
    var DatasetsInDbQuery = null;
    if (userPosition == "Head of Department") {
      if (assigned_task_userid.length > 0) {
        DatasetsInDbQuery = await pools2.query(
          `SELECT * FROM task 
        JOIN user_task on task.task_id = user_task.task_id 
        JOIN task_groups on task.group_id = task_groups.group_id
        join users on user_task.user_id = users.user_id
  
        WHERE  task.project_id = ${project_id} AND task.department_id = ${department_id} AND task.my_task = FALSE AND task.is_approved = FALSE   AND task.task_id IN  (
          SELECT task_id FROM user_task 
        )
        AND task.task_status LIKE '` +
          status +
          `%' 
        AND user_task.user_id IN (SELECT unnest(ARRAY[` +
          assigned_task_userid +
          `])) 
AND LOWER(task.task_name) LIKE LOWER('` +
          task_name +
          `%')

AND LOWER(task_groups.group_name) LIKE LOWER('` +
          group_name +
          `%')
  AND task_startdate >=  '` +
          start_date +
          `'
  AND task_deadline <=  '` +
          deadline +
          `' ` +
          `      order by task_deadline
        `
        );
      } else {
        DatasetsInDbQuery = await pools2.query(
          `SELECT * FROM task 
        JOIN user_task on task.task_id = user_task.task_id 
        JOIN task_groups on task.group_id = task_groups.group_id
        join users on user_task.user_id = users.user_id
  
        WHERE  task.project_id = ${project_id} AND task.my_task = FALSE AND task.task_id IN  (
          SELECT task_id FROM user_task 
        )
        AND
      task.task_status LIKE '` +
          status +
          `%' 
    
AND LOWER(task.task_name) LIKE LOWER('` +
          task_name +
          `%')

AND LOWER(task_groups.group_name) LIKE LOWER('` +
          group_name +
          `%')
  AND task_startdate >=  '` +
          start_date +
          `'
  AND task_deadline <=  '` +
          deadline +
          `' ` +
          `      order by task_deadline
        `
        );
      }
    } else {
      if (assigned_task_userid.length > 0) {
        DatasetsInDbQuery = await pools2.query(
          `SELECT * FROM task 
        JOIN user_task on task.task_id = user_task.task_id 
        JOIN task_groups on task.group_id = task_groups.group_id
        join users on user_task.user_id = users.user_id
  
        WHERE  task.project_id = ${project_id} AND task.task_creator = ${user_id} AND task.department_id = ${department_id} AND task.my_task = FALSE AND task.is_approved = FALSE  AND task.task_id IN  (
          SELECT task_id FROM user_task 
        )
        AND task.task_status LIKE '` +
          status +
          `%' 
        AND user_task.user_id IN (SELECT unnest(ARRAY[` +
          assigned_task_userid +
          `])) 
AND LOWER(task.task_name) LIKE LOWER('` +
          task_name +
          `%')

AND LOWER(task_groups.group_name) LIKE LOWER('` +
          group_name +
          `%')
  AND task_startdate >=  '` +
          start_date +
          `'
  AND task_deadline <=  '` +
          deadline +
          `' ` +
          `      order by task_deadline
        `
        );
      } else {
        DatasetsInDbQuery = await pools2.query(
          `SELECT * FROM task 
        JOIN user_task on task.task_id = user_task.task_id 
        JOIN task_groups on task.group_id = task_groups.group_id
        join users on user_task.user_id = users.user_id
  
        WHERE  task.project_id = ${project_id} AND task.task_creator = ${user_id} AND task.department_id = ${department_id} AND task.my_task = FALSE AND task.is_approved = FALSE  AND task.task_id IN  (
          SELECT task_id FROM user_task 
        )
        AND
      task.task_status LIKE '` +
          status +
          `%' 
    
AND LOWER(task.task_name) LIKE LOWER('` +
          task_name +
          `%')

AND LOWER(task_groups.group_name) LIKE LOWER('` +
          group_name +
          `%')
  AND task_startdate >=  '` +
          start_date +
          `'
  AND task_deadline <=  '` +
          deadline +
          `' ` +
          `      order by task_deadline
        `
        );
      }
    }

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getUsers", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT distinct username,users.user_id,users.email_address FROM users
      JOIN user_project ON users.user_id = user_project.user_id
      
      WHERE user_project.project_id = ${project_id}`
    );

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getAssignees", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT distinct username,users.user_id,users.email_address FROM users
      JOIN user_task ON user_task.user_id = users.user_id
      
      WHERE user_task.project_id = ${project_id}`
    );

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

/////////////Create Task Queries/////////////

tasks.post("/createAssignedTasks", authorize, async (req, res) => {
  let {
    user_id,
    project_id,
    task_name,
    task_status,
    task_deadline,
    task_assigned_to,
    group_name,
    group_color,
    task_details,
    task_startdate,
    projectUsers,
    group_id,
    department_id,
    action,
    group_users
  } = req.body;

  const pools2 = await pools.getPool();

  if (!task_status) {
    task_status = "";
  }
  if (!task_assigned_to) {
    task_assigned_to = "";
  }
  console.log("hereeeeeeeeeeeeeeeeeeee", group_users);

  var task_id = null;
  try {
    await pools2.query("BEGIN");

    if (group_id) {

      const DatasetsInDbQuery2 = await pools2.query(
        "INSERT INTO task (project_id,task_name,task_status,task_deadline,task_creator,group_id,task_details,task_startdate,department_id,action) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING task_id",
        [
          project_id,
          task_name,
          task_status,
          task_deadline,
          user_id,
          group_id,
          task_details,
          task_startdate,
          department_id,
          action
        ]
      );
      task_id = DatasetsInDbQuery2.rows[0].task_id;
      const DatasetsInDbQuery4 = await pools2.query(
        "INSERT INTO task_status (task_id,task_status,project_id,user_id,department_id)VALUES($1,$2,$3,$4,$5);",
        [task_id, task_status, project_id, user_id, department_id]
      );

      if (task_assigned_to && task_assigned_to.length > 0) {
        for (const element of task_assigned_to) {
          const DatasetsInDbQuery3 = await pools2.query(
            "INSERT INTO user_task (user_id,task_id,project_id) VALUES($1,$2,$3)",
            [element.user_id, task_id, project_id]
          );
        }
      }

    } else {
      const DatasetsInDbQuery1 = await pools2.query(
        "INSERT INTO task_groups (group_name,group_color) VALUES($1,$2) RETURNING group_id",
        [group_name, group_color]
      );

      if (group_users && group_users.length > 0) {
        for (const element of group_users) {
          const DatasetsInDbQuery4 = await pools2.query(
            "INSERT INTO group_task (group_users,group_id,project_id) VALUES($1,$2,$3)",
            [element.user_id, DatasetsInDbQuery1.rows[0].group_id, project_id]
          );
        }
      }
      const DatasetsInDbQuery2 = await pools2.query(
        "INSERT INTO task (project_id,task_name,task_status,task_deadline,task_creator,group_id,task_details,task_startdate,department_id,action) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING task_id",
        [
          project_id,
          task_name,
          task_status,
          task_deadline,
          user_id,
          DatasetsInDbQuery1.rows[0].group_id,
          task_details,
          task_startdate,
          department_id,
          action
        ]
      );
      task_id = DatasetsInDbQuery2.rows[0].task_id;
      const DatasetsInDbQuery4 = await pools2.query(
        "INSERT INTO task_status (task_id,task_status,project_id,user_id,department_id)VALUES($1,$2,$3,$4,$5);",
        [task_id, task_status, project_id, user_id, department_id]
      );

      if (task_assigned_to && task_assigned_to.length > 0) {
        for (const element of task_assigned_to) {
          const DatasetsInDbQuery3 = await pools2.query(
            "INSERT INTO user_task (user_id,task_id,project_id) VALUES($1,$2,$3)",
            [element.user_id, task_id, project_id]
          );
        }
      }
    }

    await pools2.query("COMMIT");
    res.send(task_id);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

/////////////Create Task Queries/////////////

tasks.post("/createTasks", authorize, async (req, res) => {
  let {
    user_id,
    project_id,
    task_name,
    task_status,
    task_deadline,
    group_name,
    group_color,
    task_details,
    task_startdate,
    projectUsers,
    group_id,
    department_id,
    action
  } = req.body;

  const pools2 = await pools.getPool();
  console.log("hereeeeeeeeeeeeeeeeeeee", group_name, group_color);
  if (!task_status) {
    task_status = "";
  }

  var task_id = null;
  try {
    await pools2.query("BEGIN");

    if (group_id) {
      console.log("hereeeeeeeeeeeeeeeeeeee");

      const DatasetsInDbQuery2 = await pools2.query(
        "INSERT INTO task (project_id,task_name,task_status,task_deadline,task_creator,group_id,task_details,task_startdate,my_task,department_id,action) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING task_id",
        [
          project_id,
          task_name,
          task_status,
          task_deadline,
          user_id,
          group_id,
          task_details,
          task_startdate,
          true,
          department_id,
          action
        ]
      );
      task_id = DatasetsInDbQuery2.rows[0].task_id;
      const DatasetsInDbQuery4 = await pools2.query(
        "INSERT INTO task_status (task_id,task_status,project_id,user_id,my_task,department_id)VALUES($1,$2,$3,$4,$5,$6);",
        [task_id, task_status, project_id, user_id, true, department_id]
      );
    } else {
      const DatasetsInDbQuery1 = await pools2.query(
        "INSERT INTO task_groups (group_name,group_color) VALUES($1,$2) RETURNING group_id",
        [group_name, group_color]
      );
      const DatasetsInDbQuery2 = await pools2.query(
        "INSERT INTO task (project_id,task_name,task_status,task_deadline,task_creator,group_id,task_details,task_startdate,my_task,department_id,action) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING task_id",
        [
          project_id,
          task_name,
          task_status,
          task_deadline,
          user_id,
          DatasetsInDbQuery1.rows[0].group_id,
          task_details,
          task_startdate,
          true,
          department_id,
          action
        ]
      );
      task_id = DatasetsInDbQuery2.rows[0].task_id;
      const DatasetsInDbQuery4 = await pools2.query(
        "INSERT INTO task_status (task_id,task_status,project_id,user_id,my_task,department_id)VALUES($1,$2,$3,$4,$5,$6);",
        [task_id, task_status, project_id, user_id, true, department_id]
      );
    }

    await pools2.query("COMMIT");
    res.send(task_id);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/createTasksFromEmail", authorize, async (req, res) => {
  const {
    user_id,
    project_id,
    task_name,
    task_deadline,
    task_assigned_to,
    task_startdate,
    group_name,
    group_id,
    department_id,
    task_status,

  } = req.body;
  console.log("Assigned tasks", task_assigned_to);

  const pools2 = await pools.getPool();
  var task_id = null;
  try {
    await pools2.query("BEGIN");

    if (group_id) {
      console.log("hereeeeeeeeeeeeeeeeeeee", group_id, department_id);

      const DatasetsInDbQuery2 = await pools2.query(
        "INSERT INTO task (project_id,task_name,task_deadline,task_creator,group_id,task_startdate,department_id,task_status,is_created_from_email) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING task_id",
        [
          project_id,
          task_name,
          task_deadline,
          user_id,
          group_id,
          task_startdate,
          department_id,
          task_status,
          true
        ]
      );
      task_id = DatasetsInDbQuery2.rows[0].task_id;
      // const DatasetsInDbQuery4 = await pools2.query(
      //   "INSERT INTO task_status (task_id,task_status,project_id,user_id,my_task,department_id)VALUES($1,$2,$3,$4,$5,$6);",
      //   [task_id, task_status, project_id, user_id, true, department_id]
      // );

      if (task_assigned_to && task_assigned_to.length > 0) {
        for (const element of task_assigned_to) {
          const DatasetsInDbQuery3 = await pools2.query(
            "INSERT INTO user_task (user_id,task_id,project_id) VALUES($1,$2,$3)",
            [element.user_id, task_id, project_id]
          );
        }
      }
    } else {
      const DatasetsInDbQuery1 = await pools2.query(
        "INSERT INTO task_groups (group_name) VALUES($1) RETURNING group_id",
        [group_name]
      );
      const DatasetsInDbQuery2 = await pools2.query(
        "INSERT INTO task (project_id,task_name,task_deadline,task_creator,group_id,task_startdate,department_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING task_id",
        [
          project_id,
          task_name,
          task_deadline,
          user_id,
          DatasetsInDbQuery1.rows[0].group_id,
          task_startdate,
          department_id,
        ]
      );
      task_id = DatasetsInDbQuery2.rows[0].task_id;
      // const DatasetsInDbQuery4 = await pools2.query(
      //   "INSERT INTO task_status (task_id,task_status,project_id,user_id,my_task,department_id)VALUES($1,$2,$3,$4,$5,$6);",
      //   [task_id, task_status, project_id, user_id, true, department_id]
      // );

      if (task_assigned_to && task_assigned_to.length > 0) {
        for (const element of task_assigned_to) {
          const DatasetsInDbQuery3 = await pools2.query(
            "INSERT INTO user_task (user_id,task_id,project_id) VALUES($1,$2,$3)",
            [element.user_id, task_id, project_id]
          );
        }
      }
    }

    const DatasetsInDbQuery4 = await pools2.query(
      "INSERT INTO task_status (task_id,task_status,project_id,user_id,my_task,department_id)VALUES($1,$2,$3,$4,$5,$6);",
      [task_id, task_status, project_id, user_id, true, department_id]
    );

    await pools2.query("COMMIT");
    res.send(task_id);
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

/////////////Update Task Queries/////////////

tasks.post("/updateTask", authorize, async (req, res) => {
  var {
    user_id,
    project_id,
    task_name,
    task_status,
    task_deadline,
    task_assigned_to,
    task_details,
    task_startdate,
    taskId,
    tabValue,
    department_id,
    action
  } = req.body;

  console.log("for update", tabValue);

  const pools2 = await pools.getPool();
  try {
    await pools2.query("BEGIN");

    const DatasetsInDbQuery1 = await pools2.query(
      "Update task Set task_name=$1,task_status=$2,task_details=$3,task_deadline=$4, task_startdate=$5, action=$6 WHERE task_id = $7",
      [
        task_name,
        task_status,
        task_details,
        task_deadline,
        task_startdate,
        action,
        taskId,
      ]
    );
    if (tabValue === "one") {
      const DatasetsInDbQuery4 = await pools2.query(
        "INSERT INTO task_status (task_id,task_status,project_id,user_id,my_task,department_id)VALUES($1,$2,$3,$4,$5,$6);",
        [taskId, task_status, project_id, user_id, true, department_id]
      );
    } else if (tabValue === "two") {
      const DatasetsInDbQuery4 = await pools2.query(
        "INSERT INTO task_status (task_id,task_status,project_id,user_id,department_id)VALUES($1,$2,$3,$4,$5);",
        [taskId, task_status, project_id, user_id, department_id]
      );
    }

    if (task_assigned_to && task_assigned_to.length > 0) {
      const DatasetsInDbQuery2 = await pools2.query(
        `Delete from user_task where task_id = ${taskId}`
      );

      for (const element of task_assigned_to) {
        const DatasetsInDbQuery3 = await pools2.query(
          "INSERT INTO user_task (user_id,task_id,project_id) VALUES($1,$2,$3)",
          [element.user_id, taskId, project_id]
        );
      }
    }

    await pools2.query("COMMIT");
    res.send("task created success");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/updateTaskGroup", authorize, async (req, res) => {
  const { group_name, group_color, group_id } = req.body;

  console.log(group_name, group_color, group_id);
  const pools2 = await pools.getPool();
  try {
    const DatasetsInDbQuery1 = await pools2.query(
      `Update task_groups Set group_name='${group_name}',
      group_color='${group_color}' WHERE group_id = ${group_id}`
    );

    res.send("task group update success");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/updateTaskGroupStatus", authorize, async (req, res) => {
  const { group_id } = req.body;

  const pools2 = await pools.getPool();
  try {
    const DatasetsInDbQuery1 = await pools2.query(
      "Update task_groups Set is_read=TRUE"
    );

    res.send("task group update success");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

/////////////Delete Queries/////////////

tasks.delete("/deleteTasks:id", authorize, async (req, res) => {
  const { id } = req.params;
  const pools2 = await pools.getPool();
  try {
    await pools2.query("BEGIN");

    const DatasetsInDbQuery1 = await pools2.query(
      `Delete from task_status WHERE task_id= ${id}`
    );
    const DatasetsInDbQuery2 = await pools2.query(
      `Delete from user_task WHERE task_id= ${id}`
    );
    const DatasetsInDbQuery3 = await pools2.query(
      `Delete from task_attachments WHERE task_id= ${id}`
    );
    const DatasetsInDbQuery4 = await pools2.query(
      `Delete from comments WHERE task_id= ${id}`
    );
    const DatasetsInDbQuery5 = await pools2.query(
      `Delete from task WHERE task_id= ${id}`
    );

    await pools2.query("COMMIT");
    console.log("task deleted");
    res.send("task deletion success");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});
tasks.delete("/groupDelete:id", authorize, async (req, res) => {
  const { id } = req.params;
  const pools2 = await pools.getPool();

  const deleteUsersTask = async (task_id) => {
    const DatasetsInDbQuery2 = await pools2.query(
      `Delete from user_task WHERE task_id= ${task_id}`
    );
    const DatasetsInDbQuery3 = await pools2.query(
      `Delete from task_status WHERE task_id= ${task_id}`
    );
  };

  try {
    await pools2.query("BEGIN");
    const DatasetsInDbQuery1 = await pools2.query(
      `select task_id from task WHERE group_id= ${id}`
    );

    for (const iterator of DatasetsInDbQuery1.rows) {
      await deleteUsersTask(iterator.task_id);
    }
    const DatasetsInDbQuery3 = await pools2.query(
      `Delete from task WHERE group_id= ${id} RETURNING task_id`
    );

    const DatasetsInDbQuery4 = await pools2.query(
      `Delete from task_groups WHERE group_id= ${id}`
    );

    await pools2.query("COMMIT");
    console.log("taskGroup deleted");
    res.send("task deletion success");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/uploadAttachments", authorize, async (req, res) => {
  const { task_id, project_id, name, type, size } = req.body;
  console.log(task_id, project_id, name, type, size);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO task_attachments (task_id,project_id,name,type,size)VALUES($1,$2,$3,$4,$5) returning id",
      [task_id, project_id, name, type, size]
    );


    res.json(DatasetsInDbQuery.rows[0].id);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

tasks.post("/getTaskAttachments", authorize, async (req, res) => {
  const { task_id, project_id } = req.body;
  console.log(task_id, project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM task_attachments WHERE task_id=${task_id} AND project_id=${project_id}`,
    );

    console.log(DatasetsInDbQuery.rows);
    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = tasks;
