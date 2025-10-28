const { Client } = require("@elastic/elasticsearch");
const dotenv = require("dotenv");

dotenv.config();
async function getEs() {
  const client = new Client({
    node:
      "http://" +
      process.env.esusername +
      ":" +
      process.env.espassword +
      "@" +
      process.env.eshost +
      ":" +
      process.env.esport,
  });

  return client;
}
exports.getEs = getEs;
