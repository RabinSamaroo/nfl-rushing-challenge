const rushing = require("./rushing.json");
const { knex, TABLE_NAME } = require("../db.js");

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

function batchInsertFromJSON(input, table) {
  let arr = input.map((e) => {
    // Fix Yds to all be numbers
    if (typeof e.Yds === "string") e.Yds = parseFloat(e.Yds.replace(",", ""));

    // Fix Lng to be a number and the trailing T to be  LngTD - new boolean
    if (typeof e.Lng === "string") {
      e.LngTD = e.Lng.includes("T");
      e.Lng = parseFloat(e.Lng);
    } else {
      e.LngTD = false;
    }
    return e;
  });
  return knex(table).insert(arr);
}

module.exports = { rushing, createTable, batchInsertFromJSON, TABLE_NAME };
