const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pools = require("../db");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorization");

//authorizeentication

router.post("/register", validInfo, async (req, res) => {
  const { username, user_password, enterprise_id } = req.body;

  try {
    const pools2 = await pools.getPool();
    const user = await pools2.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(user_password, salt);

    let newUser = await pools2.query(
      "INSERT INTO users (enterprise_id,username, user_password) VALUES ($1, $2,$3) RETURNING *",
      [enterprise_id, username, bcryptPassword]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { username, user_password } = req.body;
  const pools2 = await pools.getPool();
  try {
    const user = await pools2.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    const userTemp = {
      jwtToken: jwtToken,
      user_id: user.rows[0].user_id,
      username: user.rows[0].username,
    };
    console.log("userTemp", userTemp);
    return res.json(userTemp);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/resetPassword", validInfo, async (req, res) => {
  const { username, user_password } = req.body;

  console.log(user_password);

  const pools2 = await pools.getPool();
  try {

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(user_password, salt);
    const user = await pools2.query(`update users set user_password = '${bcryptPassword}' where username = '${username}'`);
    return res.send("password changed success");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
