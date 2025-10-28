const { Router, text } = require("express");
const pools = require("../../db");
const dotenv = require("dotenv");
const format = require("pg-format");
const axios = require("axios");
const { response } = require("express");
const client = require("../../elasticSearch");
const authorize = require("../../middleware/authorization");
("use strict");
const fs = require("fs");
var qs = require("qs");
const express = require("express");
const { Console } = require("console");
const { start } = require("repl");
const recentDocuments = express.Router();

recentDocuments.post("/getRecentDocs", authorize, async (req, res) => {
  var { category, project, startFrom, uploader_id, pageSize } = req.body;

  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: pageSize,
      sort: [{ uploaded_time: { order: "desc" } }],
      query: {
        bool: {
          must: [
            {
              term: {
                uploader_id: uploader_id,
              },
            },
            { term: { project_id: project.project_id } },
            {
              term: {
                isDeleted: false,
              },
            },
          ],
        },
      },
    };

    const { body } = await client1.search({
      index: "documents",
      body: query,
    });
    console.log("body", body.hits.hits);
    res.json({ hits: body.hits.hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = recentDocuments;
