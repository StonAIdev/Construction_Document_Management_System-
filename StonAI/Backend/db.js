const Pool = require('pg').Pool;
const dotenv = require('dotenv');

dotenv.config();
async function getPool() {
    const pool = new Pool({
        user: "postgres",
        password: process.env.password,
        host: process.env.host,
        port: 5432,
        database: "StoneAi"
    });
   
    return pool;
}
exports.getPool=getPool;