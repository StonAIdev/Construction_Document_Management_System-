const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require("express");
const comment = express.Router();

/////////////Get Queries/////////////

comment.post("/get", authorize, async (req, res) => {
  const { task_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM comments where task_id=${task_id}`
    );

    console.log("getting comments", DatasetsInDbQuery);

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

comment.post("/create", authorize, async (req, res) => {
  const { comment, user_id, username, avatar_url, task_id } = req.body.comment;
  console.log("comments", comment, user_id, username, avatar_url, task_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "insert into comments(user_id,username,task_id,comment,avatar_url) values($1,$2,$3,$4,$5)",
      [user_id, username, task_id, comment, avatar_url]
    );

    console.log("checckkkk", DatasetsInDbQuery);

    res.json(DatasetsInDbQuery);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = comment;
