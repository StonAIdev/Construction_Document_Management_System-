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
const documentLinking = express.Router();

documentLinking.post("/updateDocumentAttachment", authorize, async (req, res) => {
    const { document_id } = req.body;
    console.log("req.body",req.body);
    console.log("document_id", document_id);
    try {
      const client1 = await client.getEs();
      var index_name = "documents";
      const { body } = await client1.get({
        index: "documents",
        id: document_id,
      });
      console.log("bodybody",body._source?.document_attachment);
      var document_attachment = body._source?.document_attachment ?? [];
      document_attachment.push(req.body)
      console.log("document_attachment",document_attachment);
      var { body2 } = await client1.update({
        id: document_id,
        index: index_name,
        body: {
          doc: {
            document_attachment: document_attachment,
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
module.exports = documentLinking;