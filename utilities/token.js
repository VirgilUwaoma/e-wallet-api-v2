const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");

function issueToken(payload) {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
}

async function verifyToken(req, res, next) {
  const authToken = req.headers["auth-token"];
  if (typeof authToken == "undefined")
    return res.status(403).json({ message: "no authorization token" });
  try {
    const token = await jwt.verify(authToken, process.env.SECRET_KEY);
    req.token = token;
  } catch (error) {
    return res.status(403).json({ message: "invalid token" });
  }
  next();
}

module.exports = { issueToken, verifyToken };
