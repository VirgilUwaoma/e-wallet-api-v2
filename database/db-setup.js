const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const knex = require("knex");
const knexfile = require("./knexfile");

module.exports = knex(knexfile[process.env.NODE_ENV]);
