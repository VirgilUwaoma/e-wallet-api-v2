const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const {
  debitValidation,
  creditValidation,
  transferValidation,
  tokenValidation,
} = require("../utilities/validation");
const createError = require("http-errors");

function issueToken(payload) {
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  return token;
}

async function verifyToken(req, res, next) {
  const { error } = tokenValidation({ token: req.body.token });
  if (error) {
    const message = error.details[0].message;
    return next(createError(400, `${message}`));
  }
  const token = req.body.token;
  try {
    const verifiedToken = await jwt.verify(token, process.env.SECRET_KEY);
    req.body.token = verifiedToken;
  } catch (error) {
    return res.status(403).json({ message: "invalid token" });
  }
  next();
}

module.exports = { issueToken, verifyToken };
