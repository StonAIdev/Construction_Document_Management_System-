const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

var format = require("pg-format");
const express = require("express");
const accounts = express.Router();

accounts.post("/updateEmail", authorize, async (req, res) => {
  const { user_id, email_address } = req.body;

  const pools2 = await pools.getPool();
  try {
    const DatasetsInDbQuery1 = await pools2.query(
      `UPDATE users SET email_address='${email_address}' WHERE user_id=${user_id}`
    );

    res.send("task group update success");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

module.exports = accounts;
