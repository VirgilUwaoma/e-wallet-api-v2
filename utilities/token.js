const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function issueToken(payload) {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
}
module.exports = { issueToken };
