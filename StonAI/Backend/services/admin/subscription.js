const { Router } = require("express");
const pools = require("../../db")
const axios = require('axios');
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require('express')
const subscription = express.Router()

subscription.post('/registerSubscription',authorize,async(req,res) =>{
    const {enterprise_id,amount,expiry} = req.body
    try {
        console.log("enterprise_id:",enterprise_id);
        console.log("amount:",amount);
        console.log("expiry:",expiry);
        const pools2=await pools.getPool();
        const DatasetsInDbQuery = await pools2.query(
            "INSERT INTO subscription (enterprise_id, amount, expiry) VALUES($1, $2, $3) RETURNING *",
            [enterprise_id,amount,expiry]
        );
        DatasetsInDb =DatasetsInDbQuery.rows;
        res.json(DatasetsInDb);   
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

subscription.get('/getAllSubscription',authorize,async(req,res) =>{
    try {
        const pools2=await pools.getPool();
        const DatasetsInDbQuery = await pools2.query(
            "SELECT * FROM subscription"
        );
        DatasetsInDb =DatasetsInDbQuery.rows;
        res.json(DatasetsInDb);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

subscription.delete('/deleteSubscription',authorize,async(req,res) =>{
    const {subscription_id } = req.body
    try {
        const pools2=await pools.getPool();
        const DatasetsInDbQuery = await pools2.query(
            "DELETE FROM subscription WHERE subscription_id  = '"+subscription_id +"' RETURNING *"
        );
        DatasetsInDb =DatasetsInDbQuery.rows;
        res.json(DatasetsInDb);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
})

module.exports = subscription