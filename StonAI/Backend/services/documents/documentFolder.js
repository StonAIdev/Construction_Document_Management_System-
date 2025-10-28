const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");
const client = require("../../elasticSearch");

const express = require("express");
const folder = express.Router();

/////////////Get Queries/////////////

folder.post("/createNewFolder", authorize, async (req, res) => {
  const { user_id, project_id, username, foldername, component } = req.body;
  console.log("info", user_id, project_id, username, foldername, component);
  try {
    const pools2 = await pools.getPool();
    if (component === "") {
      const DatasetsInDbQuery = await pools2.query(
        `insert into root_folder(name,project_id,folder_creator,creator_id) values($1,$2,$3,$4)`,
        [foldername, project_id, username, user_id]
      );
    } else if (component === "Submittals") {
      const DatasetsInDbQuery = await pools2.query(
        `insert into submittal_dynamic_folder(name,project_id,folder_creator,creator_id) values($1,$2,$3,$4)`,
        [foldername, project_id, username, user_id]
      );
    } else if (component === "Intelligent Search") {
      const DatasetsInDbQuery = await pools2.query(
        `insert into intelligent_dynamic_folder(name,project_id,folder_creator,creator_id) values($1,$2,$3,$4)`,
        [foldername, project_id, username, user_id]
      );
    } else {
      const DatasetsInDbQuery = await pools2.query(
        `insert into bucket(name,project_id,folder_creator,creator_id) values($1,$2,$3,$4)`,
        [foldername, project_id, username, user_id]
      );
    }

    res.send("folder created");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

folder.post("/createNewDynamicFolder", authorize, async (req, res) => {
  const { user_id, project_id, username, foldername, component } = req.body;
  console.log("info", user_id, project_id, username, foldername, component);
  try {
    const pools2 = await pools.getPool();
    if (component === "") {
      // Check if folder with the same name already exists
      const checkQuery = await pools2.query(
        `SELECT EXISTS(
                       SELECT 1 FROM dynamic_sub_folders WHERE child_name = $1
                    )`,
        [foldername]
      );

      if (checkQuery.rows[0].exists) {
        // If folder with the same name exists, return an error
        return res
          .status(400)
          .send({ error: "Folder with the same name already exists" });
      } else {
        const DatasetsInDbQuery = await pools2.query(
          `insert into dynamic_sub_folders(child_name,parent_name,project_id,folder_creator,creator_id) values($1,$2,$3,$4,$5)`,
          [foldername, null, project_id, username, user_id]
        );
      }
    } else {
      // Check if folder with the same name already exists
      const checkQuery = await pools2.query(
        `SELECT EXISTS(
                   SELECT 1 FROM dynamic_sub_folders WHERE child_name = $1 AND parent_name = $2
                )`,
        [foldername, component]
      );

      if (checkQuery.rows[0].exists) {
        // If folder with the same name exists, return an error
        return res
          .status(400)
          .send({ error: "Folder with the same name already exists" });
      } else {
        const DatasetsInDbQuery = await pools2.query(
          `insert into dynamic_sub_folders(child_name,parent_name,project_id,folder_creator,creator_id) values($1,$2,$3,$4,$5)`,
          [foldername, component, project_id, username, user_id]
        );
      }
    }
    // res.status().send(body);
    res
      .status(200)
      .send("folder created in parent " + component + "of name " + foldername);
    // res.send("folder created in parent " + component, "of name " + foldername);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
// folder.post("/createNewFolderRoot", authorize, async (req, res) => {
//   console.log("Create new folder root");
//   const { user_id, project_id, username, foldername, component } = req.body;
//   console.log("info", user_id, project_id, username, foldername, component);
//   try {
//     const pools2 = await pools.getPool();
//     const DatasetsInDbQuery = await pools2.query(
//       `insert into root_folder(name,project_id,folder_creator,creator_id) values($1,$2,$3,$4)`,
//       [foldername, project_id, username, user_id]
//     );

//     res.send("folder created");
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

folder.post("/getNewFolders", authorize, async (req, res) => {
  const { project_id, component } = req.body;
  try {
    const pools2 = await pools.getPool();
    // const DatasetsInDbQuery = await pools2.query(
    //   `select name from bucket where project_id = ${project_id}`
    // );
    const DatasetsInDbQuery = await pools2.query(
      `select child_name FROM dynamic_sub_folders where project_id = $1 AND parent_name = 'Bucket'`,
      [project_id]
    );

    res.send(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
folder.post("/dynamictree", authorize, async (req, res) => {
  const { project_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DynamicSubFoldersQuery = await pools2.query(`
    SELECT child_name, parent_name
    FROM dynamic_sub_folders
    WHERE project_id = ${project_id}
  `);

    const tree = [];

    DynamicSubFoldersQuery.rows.forEach((row) => {
      if (row.parent_name === null || row.parent_name === "") {
        tree.push({
          name: row.child_name,
          update: false,
          share: true,
          delete: true,
          download: true,
          exportFile: true,
          // move: true,
          children: [],
        });
      }
    });

    DynamicSubFoldersQuery.rows.forEach((row) => {
      if (row.parent_name !== null) {
        const parentNode = findNode(tree, row.parent_name);
        if (parentNode) {
          parentNode.children.push({
            name: row.child_name,
            update: false,
            share: true,
            delete: true,
            download: true,
            exportFile: true,
            // move: true,
            children: [],
          });
        }
      }
    });

    res.send(tree);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Recursive function to find a node in the tree
function findNode(nodes, name) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name === name) {
      return nodes[i];
    } else if (nodes[i].children.length > 0) {
      const result = findNode(nodes[i].children, name);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

// folder.post("/dynamictree", authorize, async (req, res) => {
//   const { project_id } = req.body;
//   try {
//     const pools2 = await pools.getPool();
//     const DynamicSubFoldersQuery = await pools2.query(`
//       SELECT child_name, parent_name
//       FROM dynamic_sub_folders
//       WHERE project_id = ${project_id}
//     `);

//     const tree = [];

//     DynamicSubFoldersQuery.rows.forEach((row) => {
//       if (row.parent_name === null) {
//         tree.push({ name: row.child_name, children: [] });
//       }
//     });

//     DynamicSubFoldersQuery.rows.forEach((row) => {
//       if (row.parent_name !== null) {
//         const parentNode = tree.find((node) => node.name === row.parent_name);
//         if (parentNode) {
//           parentNode.children.push({ name: row.child_name, children: [] });
//         }
//       }
//     });

//     res.send(tree);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

folder.post("/getNewSubmittalFolders", authorize, async (req, res) => {
  const { project_id, component } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `select child_name, parent_name FROM dynamic_sub_folders where project_id = $1`,
      [project_id]
    );
    const submittaldynamic = [];
    const intelligentdynamic = [];
    const bucketdynamic = [];

    DatasetsInDbQuery.rows.forEach((row) => {
      if (row.parent_name === "Submittals") {
        submittaldynamic.push({
          name: row.child_name,
          update: false,
          share: true,
          delete: true,
          move: true,
          children: [],
        });
      } else if (row.parent_name === "Intelligent Search") {
        intelligentdynamic.push({
          name: row.child_name,
          update: false,
          share: true,
          delete: true,
          move: true,
          children: [],
        });
      } else if (row.parent_name === "Bucket") {
        bucketdynamic.push({
          name: row.child_name,
          update: false,
          share: true,
          delete: true,
          move: true,
          children: [],
        });
      }
    });
    // DatasetsInDbQuery.rows.forEach((row) => {
    //   const parentNode = findNode(submittaldynamic, row.parent_name);

    //   if (parentNode) {
    //     parentNode.children.push({
    //       name: row.child_name,
    //       update: false,
    //       share: true,
    //       delete: true,
    //       move: true,
    //       children: [],
    //     });
    //   }
    // });
    DatasetsInDbQuery.rows.forEach((row) => {
      if (row.parent_name) {
        const parentNodeSubmittals = findNode(
          submittaldynamic,
          row.parent_name
        );
        const parentNodeIntelligent = findNode(
          intelligentdynamic,
          row.parent_name
        );
        const parentNodeBucket = findNode(bucketdynamic, row.parent_name);

        if (
          parentNodeSubmittals &&
          row.parent_name === parentNodeSubmittals.name
        ) {
          parentNodeSubmittals.children.push({
            name: row.child_name,
            update: false,
            share: true,
            delete: true,
            move: true,
            children: [],
          });
        }
        if (
          parentNodeIntelligent &&
          row.parent_name === parentNodeIntelligent.name
        ) {
          parentNodeIntelligent.children.push({
            name: row.child_name,
            update: false,
            share: true,
            delete: true,
            move: true,
            children: [],
          });
        }
        if (parentNodeBucket && row.parent_name === parentNodeBucket.name) {
          parentNodeBucket.children.push({
            name: row.child_name,
            update: false,
            share: true,
            delete: true,
            move: true,
            children: [],
          });
        }
      }
    });

    res.send({ submittaldynamic, intelligentdynamic, bucketdynamic });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
folder.post("/getNewIntelligentSearchFolders", authorize, async (req, res) => {
  const { project_id, component } = req.body;
  try {
    const pools2 = await pools.getPool();
    // const DatasetsInDbQuery = await pools2.query(
    //   `select name from intelligent_dynamic_folder where project_id = ${project_id}`
    // );
    const DatasetsInDbQuery = await pools2.query(
      `select child_name FROM dynamic_sub_folders where project_id = $1 AND parent_name = 'Intelligent Search'`,
      [project_id]
    );
    res.send(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
// async function findDocumentsWithOldCategory(oldCategoryName, projectId) {
//   const client1 = await client.getEs();
//   const query = {
//     query: {
//       bool: {
//         must: [
//           { term: { project_id: projectId } },
//           { term: { document_category: oldCategoryName } },
//         ],
//       },
//     },
//   };

//   const { body } = await client1.search({
//     index: "documents",
//     body: query,
//   });

//   return body.hits.hits.map((hit) => ({ id: hit._id, source: hit._source }));
// }
async function findDocumentsWithOldCategory(oldCategoryName, projectId) {
  const client1 = await client.getEs();

  // Query structure without aggregations to get the document IDs
  var query = {
    query: {
      bool: {
        must: [
          { term: { project_id: projectId } },
          { term: { isDeleted: false } },

          // { match_phrase: { document_category: oldCategoryName } },
          { term: { "document_category.keyword": oldCategoryName } },
        ],
      },
    },
  };

  const { body } = await client1.search({
    index: "documents",
    body: query,
  });

  // Return only the IDs of the documents that match the criteria
  return body.hits.hits.map((hit) => hit._id);
}

async function updateDocumentCategory(newCategoryName, document_id) {
  const client1 = await client.getEs();

  await client1.update({
    index: "documents",
    id: document_id,
    body: {
      doc: {
        document_category: newCategoryName,
      },
    },
    refresh: true,
  });
}
// folder.post("/updateFolder", authorize, async (req, res) => {
//   const { project_id, name, updatedName, component, user_id } = req.body;
//   console.log(project_id, name, updatedName);
//   const pools2 = await pools.getPool();

//   try {
//     await pools2.query("BEGIN");

//     let updateQueries = [];
//     let parameters = [updatedName, name, project_id];

//     if (component) {
//       // Check if component is truthy (not empty, null, or undefined)
//       parameters.push(component);
//       updateQueries.push(
//         `update dynamic_sub_folders set child_name = $1 where child_name = $2 and project_id = $3 and parent_name = $4`
//       );
//       updateQueries.push(
//         `update dynamic_sub_folders set parent_name = $1 where parent_name = $2 and project_id = $3`
//       );
//     } else {
//       updateQueries.push(
//         `update dynamic_sub_folders set child_name = $1 where child_name = $2 and project_id = $3 and parent_name is null`
//       );
//       updateQueries.push(
//         `update dynamic_sub_folders set parent_name = $1 where parent_name = $2 and project_id = $3`
//       );
//     }

//     for (const query of updateQueries) {
//       await pools2.query(query, parameters);
//     }

//     // The rest of your code remains unchanged...

//     await pools2.query("COMMIT");
//     res.send("UPDATED");
//   } catch (error) {
//     await pools2.query("ROLLBACK");
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

folder.post("/updateFolder", authorize, async (req, res) => {
  const { project_id, name, updatedName, component, user_id } = req.body;
  console.log(project_id, name, updatedName);
  const pools2 = await pools.getPool();

  try {
    await pools2.query("BEGIN");

    let updateQueries = [];
    let parameters = [updatedName, name, project_id];

    if (component === "" || component === null || component === undefined) {
      updateQueries.push(
        `update dynamic_sub_folders set child_name = $1 where child_name = $2 and project_id = $3 and parent_name is null`
      );
      updateQueries.push(
        `update dynamic_sub_folders set parent_name = $1 where parent_name = $2 and project_id = $3`
      );
    } else {
      parameters.push(component);
      updateQueries.push(
        `update dynamic_sub_folders set child_name = $1 where child_name = $2 and project_id = $3 and parent_name = $4`
      );
      updateQueries.push(
        `update dynamic_sub_folders set parent_name = $1 where parent_name = $2 and project_id = $3 and parent_name = $4`
      );
    }

    for (const query of updateQueries) {
      await pools2.query(query, parameters);
    }

    const oldCategoryName = name;
    const newCategoryName = updatedName;
    const documentsToUpdate = await findDocumentsWithOldCategory(
      oldCategoryName,
      project_id
    );
    console.log(documentsToUpdate, "documents to update");
    for (const id of documentsToUpdate) {
      await updateDocumentCategory(newCategoryName, id);
    }

    await pools2.query(
      `
       UPDATE user_documentlist_columns
       SET category = $1
       WHERE user_id = $2 AND category = $3
     `,
      [newCategoryName, user_id, oldCategoryName]
    );

    await pools2.query(
      `
       UPDATE mappedkeys
       SET category = $1
       WHERE project_id = $2 AND category = $3
     `,
      [newCategoryName, project_id, oldCategoryName]
    );

    await pools2.query("COMMIT");
    res.send("UPDATED");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// folder.post("/updateFolder", authorize, async (req, res) => {
//   const { project_id, name, updatedName, component, user_id } = req.body;
//   console.log(project_id, name, updatedName);
//   const pools2 = await pools.getPool();

//   try {
//     await pools2.query("BEGIN");

//     // const DatasetsInDbQuery = await pools2.query(
//     //   `update bucket set name='${updatedName}' where name = '${name}' and project_id=${project_id}`
//     // );

//     // const DatasetsInDbQuery2 = await pools2.query(
//     //   `select name from bucket where project_id = ${project_id}`
//     // );
//     // console.log(DatasetsInDbQuery2.rows);
//     if (component === "" || component === null || component === undefined) {
//       const DatasetsInDbQuery = await pools2.query(
//         `update dynamic_sub_folders set child_name = '${updatedName}'  where child_name = '${name}' and project_id = ${project_id} and parent_name is null`
//       );
//       const DatasetsInDbQuery2 = await pools2.query(
//         `update dynamic_sub_folders set parent_name = '${updatedName}' where parent_name = '${name}' and project_id = ${project_id}`
//       );

//       await pools2.query("COMMIT");

//       // res.send("updated ");
//     } else {
//       const DatasetsInDbQuery = await pools2.query(
//         "update dynamic_sub_folders set child_name = $1  WHERE child_name = $2 AND project_id = $3 AND parent_name = $4",
//         [updatedName, name, project_id, component]
//       );
//       const DatasetsInDbQuery2 = await pools2.query(
//         `update dynamic_sub_folders set parent_name = '${updatedName}' where parent_name = '${name}' and project_id = ${project_id}`
//       );

//       await pools2.query("COMMIT");
//     }
//     const oldCategoryName = name; // The old folder name
//     const newCategoryName = updatedName;
//     const documentsToUpdate = await findDocumentsWithOldCategory(
//       oldCategoryName,
//       project_id
//     );
//     console.log(documentsToUpdate, "documents to update");
//     for (const id of documentsToUpdate) {
//       await updateDocumentCategory(newCategoryName, id);
//     }
//     const updateUserDocumentListColumnsQuery = `
//  UPDATE user_documentlist_columns
//  SET category = $1
//  WHERE user_id = $2 AND category = $3
// `;

//     await pools2.query(updateUserDocumentListColumnsQuery, [
//       newCategoryName,
//       user_id,
//       oldCategoryName,
//     ]);

//     // Proceed with the commit or rollback as needed
//     await pools2.query("COMMIT");
//     const updateCategoryQuery = `
//     UPDATE mappedkeys
//     SET category = $1
//     WHERE project_id = $2 AND category = $3
//  `;
//     await pools2.query(updateCategoryQuery, [
//       newCategoryName,
//       project_id,
//       oldCategoryName,
//     ]);
//     try {
//       // If the update is successful, commit the transaction
//       await pools2.query("COMMIT");
//       res.send("UPDATED");
//       // res.send("Category updated successfully in mappedkeys");
//     } catch (err) {
//       // Respond with a success message
//       console.log(err);
//     }
//   } catch (error) {
//     await pools2.query("ROLLBACK");
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });
async function findDocumentsforDeletedFolder(name, projectId) {
  const client1 = await client.getEs();

  // Query structure without aggregations to get the document IDs
  var query = {
    query: {
      bool: {
        must: [
          { term: { project_id: projectId } },
          { term: { isDeleted: false } },

          // { match_phrase: { document_category: oldCategoryName } },
          { term: { "document_category.keyword": name } },
        ],
      },
    },
  };

  const { body } = await client1.search({
    index: "documents",
    body: query,
  });

  // Return only the IDs of the documents that match the criteria
  return body.hits.hits.map((hit) => hit._id);
}
async function deleteDocumentCategory(name, document_id) {
  const client1 = await client.getEs();

  await client1.update({
    index: "documents",
    id: document_id,
    body: {
      doc: {
        isDeleted: true,
      },
    },
    refresh: true,
  });
}
folder.post("/deleteFolder", authorize, async (req, res) => {
  const { project_id, name, component, user_id } = req.body;
  console.log(project_id, name);
  const pools2 = await pools.getPool();

  try {
    await pools2.query("BEGIN");
    let query;
    let parameters = [name, project_id]; // Default parameters for queries that don't require component

    if (component === "" || component === null || component === undefined) {
      // For the first condition, where parent_name should be NULL
      query =
        "DELETE FROM dynamic_sub_folders WHERE child_name = $1 AND project_id = $2 AND parent_name IS NULL";
    } else if (component === "Submittals") {
      // For the second condition, where parent_name is 'Submittals'
      query =
        "DELETE FROM dynamic_sub_folders WHERE child_name = $1 AND project_id = $2 AND parent_name = $3";
      parameters.push(component); // Add component to parameters for this specific query
    } else {
      // For the third condition, where parent_name is any other value
      query =
        "DELETE FROM dynamic_sub_folders WHERE child_name = $1 AND project_id = $2 AND parent_name = $3";
      parameters.push(component); // Add component to parameters for this specific query
    }

    await pools2.query(query, parameters);

    const documentsToDelete = await findDocumentsforDeletedFolder(
      name,
      project_id
    );
    console.log(documentsToDelete, "documents to update");
    for (const id of documentsToDelete) {
      await deleteDocumentCategory(name, id);
    }

    await pools2.query(
      `
       DELETE FROM user_documentlist_columns
       WHERE user_id = $1 AND category = $2
     `,
      [user_id, name]
    );

    await pools2.query(
      `
       DELETE FROM mappedkeys
       WHERE project_id = $1 AND category = $2
     `,
      [project_id, name]
    );

    await pools2.query("COMMIT");
    res.send("DELETED");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// folder.post("/deleteFolder", authorize, async (req, res) => {
//   const { project_id, name, component, user_id } = req.body;
//   console.log(project_id, name);
//   const pools2 = await pools.getPool();

//   try {
//     await pools2.query("BEGIN");

//     if (component === "" || component === null || component === undefined) {
//       const DatasetsInDbQuery = await pools2.query(
//         "DELETE FROM dynamic_sub_folders WHERE child_name = $1 AND project_id = $2 AND parent_name IS NULL",
//         [name, project_id]
//       );

//       // console.log(DatasetsInDbQuery2.rows);

//       await pools2.query("COMMIT");

//       // res.send("DELETED ");
//     } else if (component === "Submittals") {
//       // const DatasetsInDbQuery = await pools2.query(
//       //   `delete from submittal_dynamic_folder where name='${name}' and project_id=${project_id} returning name`
//       // );
//       // const DatasetsInDbQuery2 = await pools2.query(
//       //   `select name from submittal_dynamic_folder where project_id = ${project_id}`
//       // );
//       // console.log(DatasetsInDbQuery2.rows);
//       const DatasetsInDbQuery = await pools2.query(
//         `delete from dynamic_sub_folders where child_name = '${name}' and project_id = ${project_id} and parent_name = 'Submittals'`
//       );
//       await pools2.query("COMMIT");

//       // res.send("DELETED");
//     } else {
//       // const DatasetsInDbQuery = await pools2.query(
//       //   `delete from bucket where name='${name}' and project_id=${project_id} returning name`
//       // );
//       // const DatasetsInDbQuery2 = await pools2.query(
//       //   `select name from bucket where project_id = ${project_id}`
//       // );
//       // console.log(DatasetsInDbQuery2.rows);
//       const DatasetsInDbQuery = await pools2.query(
//         "DELETE FROM dynamic_sub_folders WHERE child_name = $1 AND project_id = $2 AND parent_name = $3",
//         [name, project_id, component]
//       );

//       await pools2.query("COMMIT");

//       // res.send("DELETED");
//     }
//     const documentsToDelete = await findDocumentsforDeletedFolder(
//       name,
//       project_id
//     );
//     console.log(documentsToDelete, "documents to update");
//     for (const id of documentsToDelete) {
//       await deleteDocumentCategory(name, id);
//     }
//     const deleteUserDocumentListColumnsQuery = `
//  Delete FROM user_documentlist_columns
//  WHERE user_id = $1 AND category = $2
// `;

//     await pools2.query(deleteUserDocumentListColumnsQuery, [user_id, name]);
//     await pools2.query("COMMIT");
//     const deleteCategoryQuery = `
//     DELETE FROM mappedkeys
//     WHERE project_id = $1 AND category = $2
//  `;
//     await pools2.query(deleteCategoryQuery, [project_id, name]);
//     try {
//       // If the update is successful, commit the transaction
//       await pools2.query("COMMIT");
//       res.send("DELETED");
//       // res.send("Category updated successfully in mappedkeys");
//     } catch (err) {
//       // Respond with a success message
//       console.log(err);
//     }
//   } catch (error) {
//     await pools2.query("ROLLBACK");
//     console.error(error.message);
//     res.status(500).send("Server error");
//   }
// });

folder.post("/updateBucketCategory", authorize, async (req, res) => {
  const { document_id, name } = req.body;
  console.log("document_id", document_id, "documentname", name);
  try {
    const client1 = await client.getEs();
    var index_name = "documents";
    var { body } = await client1.update({
      id: document_id,
      index: index_name,
      body: {
        doc: {
          document_category: name,
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

folder.post("/readDocument", authorize, async (req, res) => {
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
          isRead: true,
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

module.exports = folder;
