const DB_NAME = "prod";
const TABLE_NAME = "players";

//TODO: move to util functions
const rushing = require("./rushing.json");
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

function createTable(table) {
  return knex.schema.createTable(table, (table) => {
    table.string("Player", 64).notNull();
    table.string("Team", 3).notNull();
    table.string("Pos", 2).notNull();
    table.integer("Att").notNull();
    table.float("Att/G").notNull();
    table.integer("Yds").notNull();
    table.float("Avg").notNull();
    table.float("Yds/G").notNull();
    table.integer("TD").notNull();
    table.integer("Lng").notNull();
    table.integer("1st").notNull();
    table.float("1st%").notNull();
    table.integer("20+").notNull();
    table.integer("40+").notNull();
    table.integer("FUM").notNull();
    table.boolean("LngTD").notNull();
  });
}

//TODO use map
function batchInsertFromJSON(input, table) {
  let arr = input;
  for (let e in arr) {
    // Fix Yds to all be numbers
    if (typeof arr[e].Yds === "string")
      arr[e].Yds = parseFloat(arr[e].Yds.replace(",", ""));

    // Fix Lng to be a number and the trailing T to be  LngTD - new boolean
    if (typeof arr[e].Lng === "string") {
      arr[e].LngTD = arr[e].Lng.includes("T");
      arr[e].Lng = parseFloat(arr[e].Lng);
    } else {
      arr[e].LngTD = false;
    }
  }
  return knex(table).insert(arr);
}

module.exports = { knex, TABLE_NAME };
