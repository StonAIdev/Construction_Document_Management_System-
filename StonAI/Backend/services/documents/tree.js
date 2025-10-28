// const { Router } = require("express");
// const pools = require("../../db");
// const axios = require("axios");
// const { response } = require("express");
// const authorize = require("../../middleware/authorization");
// const client = require("../../elasticSearch");

// const express = require("express");
// const folder = express.Router();

// folder.post("/createNewDynamicFolder", authorize, async (req, res) => {
//   const { user_id, project_id, username, foldername, component } = req.body;
//   console.log("info", user_id, project_id, username, foldername, component);
//   try {
//     const pools2 = await pools.getPool();
//     if (component === "root") {
//       if (component === "root") {
//         // Check if folder with the same name already exists
//         const checkQuery = await pools2.query(
//           `SELECT EXISTS(
//                        SELECT 1 FROM dynamic_sub_folders WHERE child_name = $1
//                     )`,
//           [foldername]
//         );

//         if (checkQuery.rows[0].exists) {
//           // If folder with the same name exists, return an error
//           return res
//             .status(400)
//             .send({ error: "Folder with the same name already exists" });
//         } else {
//           const DatasetsInDbQuery = await pools2.query(
//             `insert into dynamic_sub_folders(child_name,parent_name,project_id,folder_creator,creator_id) values($1,$2,$3,$4,$5)`,
//             [foldername, null, project_id, username, user_id]
//           );
//         }
//       }
//     } else {
//       // Check if folder with the same name already exists
//       const checkQuery = await pools2.query(
//         `SELECT EXISTS(
//                    SELECT 1 FROM dynamic_sub_folders WHERE child_name = $1, parent_name = $2
//                 )`,
//         [foldername, component]
//       );

//       if (checkQuery.rows[0].exists) {
//         // If folder with the same name exists, return an error
//         return res
//           .status(400)
//           .send({ error: "Folder with the same name already exists" });
//       } else {
//         const DatasetsInDbQuery = await pools2.query(
//           `insert into dynamic_sub_folders(child_name,parent_name,project_id,folder_creator,creator_id) values($1,$2,$3,$4,$5)`,
//           [foldername, component, project_id, username, user_id]
//         );
//       }
//     }
//     res.send("folder created in parent " + component, "of name " + foldername);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });
