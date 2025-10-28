const { Router } = require("express");
const pools = require("../../db");
const dotenv = require("dotenv");
const format = require("pg-format");
const axios = require("axios");
const { response } = require("express");
const client = require("../../elasticSearch");
const authorize = require("../../middleware/authorization");
("use strict");
const fs = require("fs");
const express = require("express");
const projects = require("../user/projects");
const aliases = express.Router();

aliases.post("/getTenderAliases", authorize, async (req, res) => {
  const { project_id } = req.body;

  try {
    const pools2 = await pools.getPool();


    const DatasetsInDbQuery2 = await pools2.query("SELECT tenderaddendumsaliases_id,questionnumber,question,answer FROM tenderAddendumsAliases WHERE project_id='"+project_id+"'");

    DatasetsInDb = DatasetsInDbQuery2.rows;
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  } finally {
    res.json(DatasetsInDb);
  }
});
aliases.post("/AddTenderAliases", authorize, async (req, res) => {
    const { project_id,enterprise_id,user_id, row } = req.body;
  console.log("row",row);
  console.log("project_id",project_id);
    try {
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery2 = await pools2.query("INSERT INTO tenderAddendumsAliases(project_id,enterprise_id,user_id,questionnumber,question,answer) VALUES("+project_id+","+enterprise_id+","+user_id+",'"+row.questionNumber+"','"+row.question+"','"+row.answer+"')");
  
      DatasetsInDb = DatasetsInDbQuery2.rows;
      res.json(DatasetsInDb);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    } 
  });
  aliases.post("/DeleteTenderAliases", authorize, async (req, res) => {
    const { tenderaddendumsaliases_id} = req.body;
    try {
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery2 = await pools2.query("DELETE FROM tenderAddendumsAliases WHERE tenderaddendumsaliases_id='"+tenderaddendumsaliases_id+"'");
  
      DatasetsInDb = DatasetsInDbQuery2.rows;
      res.json(DatasetsInDb);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    } 
  });

  aliases.post("/UpdateTenderAliases", authorize, async (req, res) => {
    const {tenderaddendumsaliases_id, project_id,enterprise_id,user_id, row } = req.body;
    try {
      const pools2 = await pools.getPool();
      const DatasetsInDbQuery2 = await pools2.query("UPDATE tenderAddendumsAliases SET questionnumber='"+row.questionNumber+"',question='"+row.question+"',answer='"+row.answer+"' WHERE tenderaddendumsaliases_id='"+tenderaddendumsaliases_id+"'");
  
      DatasetsInDb = DatasetsInDbQuery2.rows;
      res.json(DatasetsInDb);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    } 
  });

  aliases.post("/getReMatAliases", authorize, async (req, res) => {
    const { project_id } = req.body;
  
    try {
      const pools2 = await pools.getPool();
  
  
      const DatasetsInDbQuery2 = await pools2.query("SELECT responsibilitymatrixaliases_id,serialnumber,activity,remarks FROM responsibilityMatrixAliases WHERE project_id='"+project_id+"'");
  
      DatasetsInDb = DatasetsInDbQuery2.rows;
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    } finally {
      res.json(DatasetsInDb);
    }
  });
  aliases.post("/AddReMatAliases", authorize, async (req, res) => {
      const { project_id,enterprise_id,user_id, row } = req.body;
    console.log("row",row);
    console.log("project_id",project_id);
      try {
        const pools2 = await pools.getPool();
        const DatasetsInDbQuery2 = await pools2.query("INSERT INTO responsibilityMatrixAliases(project_id,enterprise_id,user_id,serialnumber,activity,remarks) VALUES("+project_id+","+enterprise_id+","+user_id+",'"+row.serialnumber+"','"+row.activity+"','"+row.remarks+"')");
    
        DatasetsInDb = DatasetsInDbQuery2.rows;
        res.json(DatasetsInDb);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      } 
    });
    aliases.post("/DeleteReMatAliases", authorize, async (req, res) => {
      const { responsibilitymatrixaliases_id} = req.body;
      console.log("responsibilitymatrixaliases_id",responsibilitymatrixaliases_id);
      try {
        const pools2 = await pools.getPool();
        const DatasetsInDbQuery2 = await pools2.query("DELETE FROM responsibilityMatrixAliases WHERE responsibilitymatrixaliases_id='"+responsibilitymatrixaliases_id+"'");
    
        DatasetsInDb = DatasetsInDbQuery2.rows;
        res.json(DatasetsInDb);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      } 
    });
  
    aliases.post("/UpdateReMatAliases", authorize, async (req, res) => {
      const {responsibilitymatrixaliases_id, project_id,enterprise_id,user_id, row } = req.body;
      try {
        const pools2 = await pools.getPool();
        const DatasetsInDbQuery2 = await pools2.query("UPDATE responsibilityMatrixAliases SET serialnumber='"+row.serialnumber+"',activity='"+row.activity+"',remarks='"+row.remarks+"' WHERE responsibilitymatrixaliases_id='"+responsibilitymatrixaliases_id+"'");
    
        DatasetsInDb = DatasetsInDbQuery2.rows;
        res.json(DatasetsInDb);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
      } 
    });
module.exports = aliases;
