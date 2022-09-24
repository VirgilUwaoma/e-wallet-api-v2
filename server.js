require("dotenv").config();
const dbSetup = require("./database/db-setup");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const createError = require("http-errors");
const server = express();
const port = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  mas: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
const authRoutes = require("./routes/auth");
// const walletRoutes = require("./routes/wallet");

server.use(express.json());
server.use("/api/auth", authRoutes);
// server.use("/api/wallet", walletRoutes);
server.use(helmet());
server.use(limiter);

server.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

server.use(function (req, res, next) {
  next(createError(404));
});

// error handler
server.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message });
});

server.listen(port, () => {
  console.log(`\nServer running on port ${port}\n`);
});

module.exports = server;
