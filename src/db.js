const DB_NAME = "prod";
const TABLE_NAME = "players";

// create the connection to database
const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "34.68.135.75",
    user: "root",
    password: "password",
    database: DB_NAME,
  },
});

module.exports = { knex, TABLE_NAME };
