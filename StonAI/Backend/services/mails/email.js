const { Router } = require("express");
const pools = require("../../db");
const axios = require("axios");
const { response } = require("express");
const authorize = require("../../middleware/authorization");

const express = require("express");
const email = express.Router();

email.post("/create", authorize, async (req, res) => {
  let { emails, user_ID } = req.body;

  const pools2 = await pools.getPool();

  await emails.map(async (e) => {
    var {
      subject,
      from,
      fromAdress,
      body,
      to,
      read,
      attachment,
      mailType,
      id,
      user_id,
    } = e;
    try {
      const DatasetsInDbQuery = await pools2.query(
        "Insert into Email(subject,sender,sender_email,email_body,time,is_read,has_attachments,email_type,email_id,user_id) Values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT DO NOTHING RETURNING *",
        [
          subject,
          from,
          fromAdress,
          body,
          to,
          read,
          attachment,
          mailType,
          id,
          user_id,
        ]
      );
      // DatasetsInDb = DatasetsInDbQuery.rows;
      // res.json(DatasetsInDb);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });
  console.log("hree", emails);
  await emails.map(async (e) => {
    var { toRecipients, id, user_id } = e;
    const receiver = toRecipients.map((a) => a.emailAddress.address);
    const receiverLen = receiver.length;
    receiver.forEach((element) => {
      pools2.query(
        "Insert into receiver(email_id,email_address,user_id ) Values($1,$2,$3) ON CONFLICT DO NOTHING",
        [id, element, user_id],
        (error, results) => {
          if (error) {
            throw error;
          }
        }
      );
    });
  });
  res.send("created");
});

email.post("/createReply", authorize, async (req, res) => {
  const { email_id, email_id_reply } = req.body;

  console.log(email_id, email_id_reply);
  const pools2 = await pools.getPool();

  try {
    const DatasetsInDbQuery2 = await pools2.query(
      "INSERT INTO replies (replied_email_id,email_id) VALUES($1,$2)",
      [email_id_reply, email_id]
    );
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

email.post("/getReply", authorize, async (req, res) => {
  const { email_id } = req.body;
  console.log("e_id", email_id);
  const pools2 = await pools.getPool();

  try {
    const DatasetsInDbQuery2 = await pools2.query(
      `
        select replied_email_id AS email_id from replies where replies.email_id='${email_id}'
      `
    );

    const rows = DatasetsInDbQuery2.rows;
    console.log("replyRows", rows);
    res.json(rows);
  } catch (error) {
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

email.post("/getMails", authorize, async (req, res) => {
  const { user_id, title } = req.body;
  console.log("emails", user_id, title);
  console.log("dsadsadasfasfsdafdafdsf", title);

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM Email join receiver on receiver.email_id = email.email_id where email.user_id=${user_id} and email.email_type='${title}' order by time desc limit 15`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    console.log("DatasetsInDb", DatasetsInDb);
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

email.post("/getNextMails", authorize, async (req, res) => {
  const { user_id, title, startFrom } = req.body;
  console.log("dsadsadasfasfsdafdafdsf", title, startFrom);

  try {
    const pools2 = await pools.getPool();
    const DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM Email join receiver on receiver.email_id = email.email_id where email.user_id=${user_id} and email.email_type='${title}' order by time desc limit 15 offset ${startFrom}`
    );
    DatasetsInDb = DatasetsInDbQuery.rows;
    console.log("DatasetsInDb", DatasetsInDb);
    res.json(DatasetsInDb);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
email.post("/getEmailsFiltered", authorize, async (req, res) => {
  var {
    attachment,
    body,
    cc,
    dateFrom,
    dateTo,
    from,
    read,
    subject,
    to,
    user_id,
  } = req.body.values;

  console.log(
    "emailsFiltered",
    attachment,
    body,
    cc,
    dateFrom,
    dateTo,
    from,
    read,
    subject,
    to,
    user_id
  );

  if (!body) {
    body = "";
  }

  if (!cc) {
    cc = "";
  }
  if (!to) {
    to = "";
  }
  if (!from) {
    from = "";
  }
  if (!subject) {
    subject = "";
  }

  if (!dateFrom) {
    dateFrom = "1900-12-21 10:34:32.507124";
  }

  if (!dateTo) {
    dateTo = "2090-12-21 10:34:32.507124";
  }

  try {
    const pools2 = await pools.getPool();
    var DatasetsInDbQuery = null;
    DatasetsInDbQuery = await pools2.query(
      `SELECT * FROM Email  join receiver on receiver.email_id = email.email_id  where email.user_id=${user_id}
      
      
      AND  is_read =` +
        read +
        `
      AND has_attachments = ` +
        attachment +
        `
      AND 
  
      LOWER(subject) LIKE LOWER('` +
        subject +
        `%')
     
     AND LOWER(sender_email) LIKE LOWER('` +
        from +
        `%')
        AND LOWER(email_address) LIKE LOWER('` +
        to +
        `%')
  
        AND LOWER(email_body) LIKE LOWER('` +
        body +
        `%') 

        AND time >=  '` +
        dateFrom +
        `'
    AND time <=  '` +
        dateTo +
        `' ` +
        `      order by time desc
      `
    );

    res.json(DatasetsInDbQuery.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

email.delete("/deleteEmail:id", authorize, async (req, res) => {
  const { id } = req.params;
  const pools2 = await pools.getPool();
  console.log(id);
  try {
    await pools2.query("BEGIN");
    const DatasetsInDbQuery1 = await pools2.query(
      `Delete from receiver WHERE email_id= '${id}'`
    );

    const DatasetsInDbQuery2 = await pools2.query(
      `Delete from email WHERE email_id= '${id}'`
    );

    await pools2.query("COMMIT");
    console.log("email deleted");
    res.send("email deletion success");
  } catch (error) {
    await pools2.query("ROLLBACK");
    console.error("error", error.message);
    res.status(500).send("Server error");
  }
});

email.get("/getRec/:id", authorize, async (req, res) => {
  const id = req.params.id;
  console.log("degesh ki id", id);
  const pools2 = await pools.getPool();

  pools2.query(
    `Select distinct email_address From receiver where user_id =${id}`,
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log("results", results);
      res.send(results);
    }
  );
});

email.get("/updateStatus/:id", authorize, async (req, res) => {
  const id = req.params.id;
  console.log("degesh ki id", id);
  const pools2 = await pools.getPool();

  try {
    await pools2.query(`update Email set is_read=TRUE where email_id ='${id}'`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = email;
