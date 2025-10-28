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
const coverPage = express.Router();

coverPage.post("/getCoverPages", authorize, async (req, res) => {
  var { project, startFrom, user_id } = req.body;
  console.log("startFrom", startFrom);
  try {
    const client1 = await client.getEs();
    var query = {
      from: startFrom,
      size: 10,
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project.project_id,
              },
            },
            {
              bool: {
                should: [
                  {
                    bool: {
                      must: [
                        {
                          match: {
                            uploader_id: user_id,
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must: [
                        {
                          bool: {
                            should: [
                              {
                                match: {
                                  coverPagePhase: "review",
                                },
                              },
                              {
                                match: {
                                  coverPagePhase: "issue",
                                },
                              },
                            ],
                          },
                        },
                        {
                          term: {
                            "receivers_list.user_id": user_id,
                          },
                        },
                      ],
                    },
                  },
                  {
                    bool: {
                      must: [
                        {
                          match: {
                            coverPagePhase: "issue",
                          },
                        },
                        {
                          term: {
                            "approvals_list.user_id": user_id,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const { body } = await client1.search({
      index: "cover_page",
      body: query,
    });
    console.log("body", body.hits.hits);
    res.json({ hits: body.hits.hits, totalHits: body.hits.total.value });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
coverPage.post("/getCoverPageDetails", authorize, async (req, res) => {
  const { coverpage_id } = req.body;
  console.log("coverDet", coverpage_id);
  try {
    const client1 = await client.getEs();
    const { body } = await client1.get({
      index: "cover_page",
      id: coverpage_id,
    });
    console.log("res123", body);
    res.send(body);
  } catch (error) {
    console.log("error", error);
  }
});
coverPage.post(
  "/getCoverPageAfterSubmittalIdSelected",
  authorize,
  async (req, res) => {
    const { coverpage_id } = req.body;
    console.log("coverDet", coverpage_id);
    try {
      const client1 = await client.getEs();
      const { body } = await client1.get({
        index: "cover_page",
        id: coverpage_id,
      });
      console.log("res123", body);
      res.send(body);
    } catch (error) {
      console.log("error", error);
    }
  }
);

coverPage.post("/getCoverPageEntities", authorize, async (req, res) => {
  const { project_id } = req.body;
  console.log("project_id", project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT abbreviation_contractor, abbreviation_project FROM projects where project_id=${project_id}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
coverPage.post("/generateSubmittalNo", authorize, async (req, res) => {
  const { project_id, abbreviation_project, abbreviation_contractor } =
    req.body;
  console.log("project_id", project_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM generated_sumbittals_no WHERE project_id=${project_id} AND abbreviation_project=${abbreviation_project} AND abbreviation_contractor=${abbreviation_contractor}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

coverPage.post("/getCoverPageSubmittalIds", authorize, async (req, res) => {
  const { project_id, document_category } = req.body;
  console.log("project_id", project_id);
  console.log("document_category", document_category);
  const query = {
    query: {
      bool: {
        must: [
          {
            term: {
              project_id: project_id,
            },
          },
          {
            term: {
              "document_category.keyword": document_category,
            },
          },
        ],
      },
    },
    aggs: {
      unique_submittal_ids: {
        terms: { field: "coverPage.SUBMITTAL_NO.keyword" },
        aggs: {
          max_rev: {
            top_hits: {
              sort: [{ revision_number: { order: "desc" } }],
              _source: { includes: [""] },
              size: 1,
            },
          },
        },
      },
    },
  };
  try {
    const client1 = await client.getEs();
    const { body } = await client1.search({
      index: "cover_page",
      body: query,
    });
    console.log("WesayBody", body);
    hits = [];
    body.aggregations.unique_submittal_ids.buckets.forEach((item) => {
      hits.push({ coverpage_id: item.max_rev.hits.hits[0]._id, key: item.key });
    });
    console.log("hits", hits);
    res.send(hits);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
coverPage.post("/saveCoverPage", authorize, async (req, res) => {
  const {
    isCoverPage,
    coverPageOf,
    name,
    uploaded_by,
    uploader_id,
    project_id,
    uploaded_time,
    coverPage,
    category,
    coverPagePhase,
    approvals_list,
    receivers_list,
    logoList,
    abbreviation_project,
    abbreviation_contractor,
    categoryAbbr,
  } = req.body;
  var coverPage2;
  var rev = 1;
  console.log("coverPage.SUBMITTAL_NO", coverPage.SUBMITTAL_NO);
  if (!coverPage.SUBMITTAL_NO) {
    const query = {
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              wildcard: {
                "coverPage.SUBMITTAL_NO.keyword":
                  abbreviation_project +
                  "-" +
                  abbreviation_contractor +
                  "-" +
                  categoryAbbr +
                  "-*",
              },
            },
          ],
        },
      },
      aggs: {
        max_serial: {
          max: {
            field: "serialNo",
          },
        },
      },
    };
    var nextSerial;
    try {
      const client1 = await client.getEs();
      const { body } = await client1.search({
        index: "cover_page",
        body: query,
      });
      if (!body.aggregations.max_serial.value) {
        nextSerial = 1;
      } else {
        nextSerial = body.aggregations.max_serial.value + 1;
      }
      console.log("body", body.aggregations.max_serial.value);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
    coverPage2 = {
      ...coverPage,
      SUBMITTAL_NO:
        abbreviation_project +
        "-" +
        abbreviation_contractor +
        "-" +
        categoryAbbr +
        "-" +
        nextSerial,
    };
  } else {
    const query = {
      size: 0,
      query: {
        bool: {
          must: [
            {
              term: {
                project_id: project_id,
              },
            },
            {
              term: {
                "coverPage.SUBMITTAL_NO.keyword": coverPage.SUBMITTAL_NO,
              },
            },
          ],
        },
      },
      aggs: {
        max_rev: {
          max: {
            field: "revision_number",
          },
        },
      },
    };
    var nextRev;
    try {
      const client1 = await client.getEs();
      const { body } = await client1.search({
        index: "cover_page",
        body: query,
      });
      if (!body.aggregations.max_rev.value) {
        nextRev = 1;
      } else {
        nextRev = body.aggregations.max_rev.value + 1;
      }
      console.log("nextRevnextRev", nextRev);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
    coverPage2 = { ...coverPage, SUBMITTAL_NO: coverPage.SUBMITTAL_NO };
    rev = nextRev;
  }

  const document = {
    project_id: project_id,
    coverPageOf: coverPageOf,
    document_name: name,
    isCoverPage: isCoverPage,
    revision_number: rev,
    document_category: category,
    uploaded_by: uploaded_by,
    uploader_id: uploader_id,
    uploaded_time: uploaded_time,
    coverPagePhase: coverPagePhase,
    coverPage: coverPage2,
    approvals_list: approvals_list,
    receivers_list: receivers_list,
    logoList: logoList,
    serialNo: nextSerial,
  };

  try {
    const client1 = await client.getEs();
    var { body } = await client1.index({
      index: "cover_page",
      body: document,
      refresh: true,
    });
    console.log("body123", body);
    console.log("body123save", body._id);
    res.send(body._id);
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});
coverPage.post("/addCoverPageComments", authorize, async (req, res) => {
  const { coverPage_id, comments_list } = req.body;
  console.log("coverpage_id", coverPage_id);
  console.log("comments_list", comments_list);
  try {
    const client1 = await client.getEs();
    var index_name = "cover_page";
    var { body } = await client1.update({
      id: coverPage_id,
      index: index_name,
      body: {
        doc: {
          comments_list: comments_list,
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
coverPage.post("/getComments", authorize, async (req, res) => {
  const { coverpage_id } = req.body;
  console.log("coverDet", coverpage_id);
  try {
    const client1 = await client.getEs();
    const { body } = await client1.get({
      index: "cover_page",
      id: coverpage_id,
    });
    console.log("res123", body);
    res.send(body);
  } catch (error) {
    console.log("error", error);
  }
});
coverPage.post("/updateCoverPage", authorize, async (req, res) => {
  const {
    coverpage_id,
    isCoverPage,
    coverPageOf,
    name,
    uploaded_by,
    uploader_id,
    project_id,
    uploaded_time,
    coverPage,
    category,
    coverPagePhase,
    approvals_list,
    receivers_list,
    logoList,
  } = req.body;
  const document = {
    project_id: project_id,
    coverPageOf: coverPageOf,
    document_name: name,
    isCoverPage: isCoverPage,
    revision_number: 1,
    document_category: category,
    uploaded_by: uploaded_by,
    uploader_id: uploader_id,
    uploaded_time: uploaded_time,
    coverPage: coverPage,
  };
  console.log("coverpage_id", coverpage_id);
  console.log("document", document);

  try {
    const client1 = await client.getEs();
    var index_name = "cover_page";
    var { body } = await client1.update({
      id: coverpage_id,
      index: index_name,
      body: {
        doc: {
          document_name: document.document_name,
          coverPage: document.coverPage,
          approvals_list: approvals_list,
          receivers_list: receivers_list,
          coverPagePhase: coverPagePhase,
          logoList: logoList,
        },
      },
      refresh: true,
    });
    console.log("body123", body._id);
    res.json(body._id);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
coverPage.post("/deleteCoverPage", authorize, async (req, res) => {
  const { name } = req.body;
  console.log("filetodelete", name);
  try {
    const client1 = await client.getEs();

    const { body } = await client1.delete({
      index: "cover_page",
      type: "_doc",
      id: name,
    });
    console.log("boday", body);
    res.send(body);
    // const DatasetsInDbQuery = await pools2.query(
    //   "INSERT INTO documents (project_id, document_name,document_size,last_modified,document_type,revision_number,document_category,uploaded_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    //   [55, name, size, lastModified, type, 1, category, uploaded_by]
    // );
    // DatasetsInDb = DatasetsInDbQuery.rows;
  } catch (error) {
    console.error(error.message);
    res.send("File with similar name already exists! and will not be uploaded");
  }
});
module.exports = coverPage;
