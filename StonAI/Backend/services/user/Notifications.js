const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

var format = require("pg-format");
const express = require("express");
const Notifications = express.Router();

Notifications.post("/getNotifications", authorize, async (req, res) => {
  const { user, reciever } = req.body;
  console.log("userssssnext", user.user_id);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "SELECT message,initiators_name,notification_id,notification_status,(NOW()::timestamp - initiated_time)AS initiated_time,(initiated_time at time zone 'utc')AS initiated_date, document_id,type,is_deadline_remainder FROM notifications WHERE user_id='" +
      user.user_id +
      "' ORDER BY initiated_time ASC limit 10"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/getNextNotifications", authorize, async (req, res) => {
  const { user, reciever, startFrom } = req.body;
  console.log("userssssnex", user.user_id);
  console.log("start from: ", startFrom);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "SELECT message,initiators_name,notification_id,notification_status,(NOW()::timestamp - initiated_time)AS initiated_time,(initiated_time)AS initiated_date, document_id,type,is_deadline_remainder FROM notifications WHERE user_id='" +
      user.user_id +
      "' ORDER BY initiated_time ASC limit 10 offset '" +
      startFrom +
      "'"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/updateNotificationStatus", authorize, async (req, res) => {
  const { user, notificationID } = req.body;
  console.log("userssss", user.user_id);
  console.log("notificationID: ", notificationID);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "UPDATE notifications SET notification_status = 'Read' WHERE notification_id=" +
      notificationID +
      " "
    );
    // DatasetsInDb = DatasetsInDbQuery.rows;
    res.json("Successfully status updated");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/eraseNoti", authorize, async (req, res) => {
  const { user } = req.body;
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "UPDATE users SET number_of_notifications = 0 WHERE user_id='" +
      user.user_id +
      "' returning number_of_notifications"
    );
    DatasetsInDb = DatasetsInDbQuery.rows[0];
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/getNoOfUnseenNoti", authorize, async (req, res) => {
  const { user } = req.body;
  console.log("user", user);
  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "SELECT number_of_notifications FROM users WHERE user_id='" +
      user.user_id +
      "'"
    );
    DatasetsInDb = DatasetsInDbQuery.rows[0];
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/getNoOfUnreadNoti", authorize, async (req, res) => {
  const { user, reciever } = req.body;

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      "SELECT COUNT(*) FROM notifications WHERE notification_status='NotRead'"
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/addNotifications", authorize, async (req, res) => {
  const { user, content } = req.body;
  const { action, message, receivers, document_id } = content;
  console.log("content", content);

  const pools2 = await pools.getPool();
  try {
    await receivers.forEach(async (reciever) => {
      await pools2.query("BEGIN");
      const DatasetsInDbQuery = await pools2.query(
        "INSERT INTO notifications(message,action,user_id,initiators_id,initiators_name,initiated_time,notification_status,document_id,type)VALUES('" +
        message +
        "','" +
        action +
        "','" +
        reciever.user_id +
        "','" +
        user.user_id +
        "','" +
        user.username +
        "','now()','NotRead','" +
        document_id +
        "','Doc')"
      );
      const DatasetsInDbQuery2 = await pools2.query(
        "UPDATE users SET number_of_notifications = number_of_notifications+1 WHERE user_id='" +
        reciever.user_id +
        "' returning number_of_notifications"
      );
      await pools2.query("COMMIT");
    });

    res.json("Done");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
Notifications.post("/addNotificationsTask", authorize, async (req, res) => {
  const { user, message, receivers, task_id } = req.body;

  const pools2 = await pools.getPool();
  try {
    await receivers.forEach(async (reciever) => {
      await pools2.query("BEGIN");
      const DatasetsInDbQuery = await pools2.query(
        "INSERT INTO notifications(message,user_id,initiators_id,initiators_name,initiated_time,notification_status,task_id,type) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
        [
          message,
          reciever.user_id,
          user.user_id,
          user.username,
          "now()",
          "NotRead",
          task_id,
          "Task",
        ]
      );

      const DatasetsInDbQuery2 = await pools2.query(
        "UPDATE users SET number_of_notifications = number_of_notifications+1 WHERE user_id='" +
        reciever.user_id +
        "' returning number_of_notifications"
      );
      await pools2.query("COMMIT");
    });

    res.json("Done");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = Notifications;
