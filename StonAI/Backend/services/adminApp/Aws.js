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

const {
  CostExplorerClient,
  CreateAnomalyMonitorCommand,
  GetCostAndUsageCommand,
  GetCostAndUsageCommandInput,
} = require("@aws-sdk/client-cost-explorer");

const aws = express.Router();

aws.post("/aws", async (req, res) => {
  // a client can be shared by different commands.
  const client = new CostExplorerClient({ region: "ap-south-1" });

  const params = {
    /** input parameters */
    Granularity: "DAILY",
    Metrics: ["UsageQuantity"],
    TimePeriod: { Start: "2022-03-04", End: "2022-04-04" },
  };
  //   const input = new GetCostAndUsageCommandInput(params);
  const command = new GetCostAndUsageCommand(params);

  // async/await.
  try {
    const data = await client.send(command);
    // process data.
    res.json({ data: data });
  } catch (error) {
    // error handling.
    console.log(error);
  } finally {
    // finally.
  }
});

module.exports = aws;
