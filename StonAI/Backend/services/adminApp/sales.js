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

const sales = express.Router();

sales.post("/sales", async (req, res) => {
  // a client can be shared by different commands.

  res.json("hi");
});

module.exports = sales;
