const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require("express");
const enterprise = express.Router();
var nodemailer = require("nodemailer");

const sendEmail = async (enterprise) => {
  console.log("email;", enterprise);
  const enterpriseStr = JSON.stringify(enterprise);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "createyourenterprisenow@gmail.com",
      pass: "createyourenterprisenow123",
    },
  });

  var mailOptions = {
    from: "createyourenterprisenow@gmail.com",
    to: "batch16.092@gmail.com",
    subject: "Verify your email address",

    text: enterpriseStr,
    // attachments: [{
    //     filename: 'Alga..png',
    //     path: 'https://algaprofilepictures.s3.us-east-2.amazonaws.com/Alga..png',
    //     cid: 'unique@cid'
    // }],
  };
  var info2;
  const send = await transporter
    .sendMail(mailOptions)
    .then(async function (info) {
      if (info.accepted[0]) {
        console.log("error", info);
        return info;
      }
    });
  return send;
};

enterprise.post("/mailEnterprise", async (req, res) => {
  const enterprise = req.body;
  console.log("enterprise", enterprise);
  const info = await sendEmail(enterprise);
  res.json(info);
});

enterprise.post("/registerEnterprise", authorize, async (req, res) => {
  const { enterprise_name, enterprise_location } = req.body;
  try {
    console.log("enterprise_name:", enterprise_name);
    console.log("enterprise_location:", enterprise_location);
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "INSERT INTO Enterprise (enterprise_name, enterprise_location) VALUES($1, $2) RETURNING *",
      [enterprise_name, enterprise_location]
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

enterprise.get("/getAllEnterprise", authorize, async (req, res) => {
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query("SELECT * FROM Enterprise");
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

enterprise.delete("/deleteEnterprise", authorize, async (req, res) => {
  const { enterprise_id } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "DELETE FROM enterprise WHERE enterprise_id = '" +
        enterprise_id +
        "' RETURNING *"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = enterprise;
