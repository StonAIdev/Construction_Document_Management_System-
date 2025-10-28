const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");
const format = require("pg-format");

const express = require("express");
const kpi = express.Router();

kpi.post("/getKPI", authorize, async (req, res) => {
    const { userID, departmentID, projectID, startDate, endDate, userPosition } = req.body;
    try {
        const pools2 = await pools.getPool();
        var DatasetsInDbQuery;
        if (userPosition == "Head of Department") {
            DatasetsInDbQuery = await pools2.query(
                "SELECT search_type, count_search, (search_date at time zone 'utc') AS search_date, user_position FROM kpi WHERE department_id='" +
                departmentID +
                "' AND project_id ='" +
                projectID +
                "' AND search_date >='" +
                startDate +
                "' AND search_date <='" +
                endDate +
                "' ORDER BY search_date ASC"
            );
        }
        else if (userPosition == "Project Manager") {
            DatasetsInDbQuery = await pools2.query(
                "SELECT search_type, count_search, (search_date at time zone 'utc') AS search_date, user_position FROM kpi WHERE project_id='" +
                projectID +
                "' AND search_date >='" +
                startDate +
                "' AND search_date <='" +
                endDate +
                "' ORDER BY search_date ASC"
            );
        }
        else {
            DatasetsInDbQuery = await pools2.query(
                "SELECT search_type, count_search, (search_date at time zone 'utc') AS search_date, user_position FROM kpi WHERE department_id='" +
                departmentID +
                "' AND user_id='" +
                userID +
                "' AND project_id='" +
                projectID +
                "' AND search_date >='" +
                startDate +
                "' AND search_date <='" +
                endDate +
                "' ORDER BY search_date ASC"
            );
        }

        DatasetsInDb = DatasetsInDbQuery.rows;
        res.json(DatasetsInDb);
    } catch (error) {
        console.error("err msg: ", error.message);
        res.status(500).send("Server error");
    }
});

kpi.post("/updateKPI", authorize, async (req, res) => {
    const { userID, departmentID, projectID, searchType, todayDate, userPosition, totalTime } = req.body;
    console.log("caleed", userID, departmentID, projectID, searchType, todayDate, userPosition, totalTime);
    try {
        const pools2 = await pools.getPool();
        const DatasetsInDbQuery = await pools2.query(
            "UPDATE kpi SET count_search = count_search + '" + totalTime + "'  WHERE department_id='" +
            departmentID +
            "' AND user_id='" +
            userID +
            "' AND project_id='" +
            projectID +
            "' AND search_type='" +
            searchType +
            "'  AND cast(search_date AS DATE)='" +
            todayDate +
            "'  AND user_position='" +
            userPosition +
            "' RETURNING kpi_id"
        );
        DatasetsInDb = DatasetsInDbQuery.rows;

        if (DatasetsInDb.length == 0) {
            const pools2 = await pools.getPool();
            await pools2.query(
                "INSERT INTO kpi(department_id,user_id,project_id,search_date,search_type,count_search,user_position) VALUES($1,$2,$3,$4,$5,$6,$7)",
                [
                    departmentID,
                    userID,
                    projectID,
                    "now()",
                    searchType,
                    totalTime,
                    userPosition,
                ]
            );
            res.json("KPI inserted successfully");
        }
        else {
            res.json("KPI updated successfully");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = kpi;