const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtGenerator(userid1){
    const payload = {
        user : userid1
    }
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "20d"})
}

module.exports = jwtGenerator;