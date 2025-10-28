const { Router, text } = require("express");
const pools = require("../../db");
const dotenv = require("dotenv");
const format = require("pg-format");
const axios = require("axios");
const { response } = require("express");
const client = require("../../elasticSearch");
const authorize = require("../../middleware/authorization");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

("use strict");
const fs = require("fs");
var qs = require("qs");
const express = require("express");
const { Console } = require("console");
const { start } = require("repl");

const ProjectDelays = express.Router();














ProjectDelays.post("/getProject", async (req, res) => {
  const {
    project_name,
    plot_number,
    sector_number,
    area,
    city,
    county,
    country,
    project_type,
    contract_scope,
    work_scope,
    start_date,
    end_date,
    project_id,
    project_admin,
  } = req.body;

  console.log(
    project_name,
    plot_number,
    sector_number,
    area,
    city,
    county,
    country,
    project_type,
    contract_scope,
    work_scope,
    start_date,
    end_date,
    project_id,
    project_admin
  );

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery2 = await pools2.query(
      "update projects Set project_name=$1,plot_number=$2,sector_number=$3,area=$4,city=$5,county=$6,country=$7,project_type=$8,contract_scope=$9,work_scope=$10,start_date=$11,end_date=$12,project_admin=$13 where project_id=$14",
      [
        project_name,
        plot_number,
        sector_number,
        area,
        city,
        county,
        country,
        project_type,
        contract_scope,
        work_scope,
        start_date,
        end_date,
        project_admin,
        project_id,
      ]
    );
    res.json("project updated");
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});






module.exports = ProjectDelays;
