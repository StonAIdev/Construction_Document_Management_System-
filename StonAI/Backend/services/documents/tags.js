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
const { match } = require("assert");
const tags = express.Router();

tags.post("/pushTags",authorize, async (req, res) => {
    const { tags, document_id } = req.body;
    console.log("tags",tags);
    console.log("document_id",document_id);
    const index_name = "documents";
    try {
      const client1 = await client.getEs();
        await client1.update({
        id: document_id,
        index: index_name,        
        body:{
            script: {
                "source": "if(ctx._source.tags4 == null){ctx._source.tags4 = new ArrayList()}   ctx._source.tags4.addAll(params.tag)",
                "lang": "painless",
                "params": {
                    "tag": tags
                }
            }
        }
      });

      res.json("Done");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });
  tags.post("/updateTags",authorize, async (req, res) => {
    const { tags, document_id } = req.body;
    console.log("tags",tags);
    console.log("document_id",document_id);
    const index_name = "documents";
    try {
      const client1 = await client.getEs();
        await client1.update({
        id: document_id,
        index: index_name,        
        body: {
            doc: {
              tags4: tags,
            },
        },
      });
      res.json("Done");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });
  tags.post("/getDistinctTags",authorize, async (req, res) => {
    const { project_id } = req.body;
    query = {
            "query": {
              "bool": {
                "must": {
                    "term": {
                        "project_id.keyword": project_id
                    }
                }
              }
            },
            "size": 0,
            "aggs": {
                "distinct_tags": {
                    "terms": {
                        "field": "tags4.keyword",
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
        console.log("boday", body.aggregations.distinct_tags.buckets);
        res.send(body.aggregations.distinct_tags.buckets);
      } catch (error) {
        console.error(error.message);
        res.send("File with similar name already exists! and will not be uploaded");
      }
  });
module.exports = tags;