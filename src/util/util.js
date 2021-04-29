/**
 * Utility functions that are used by the server
 */
const { knex, TABLE_NAME } = require("../db.js");

/**
 * Generate a knex query that gets the count
 * @returns {Promise} - kneq query
 */
function countQuery() {
  return knex(TABLE_NAME).count();
}

/**
 * Generate a knex mysql query based on queryParams
 * @param {Object} queryParams - query filter options, provided by the webpage filter
 * @returns {Promise} - knex query
 */
function generateQuery(queryParams) {
  const {
    filterField,
    filterAsc,
    filterPlayer,
    filterLimit,
    offset,
  } = queryParams;
  let query = knex(TABLE_NAME)
    .select()
    .orderBy(filterField, filterAsc == "Ascending" ? "asc" : "desc")
    .limit(filterLimit)
    .offset(offset);

  if (filterPlayer)
    query.where(
      "Player",
      "like",
      `%${filterPlayer.replace("%", "\\%").replace("_", "\\_")}%`
    );

  return query;
}

/**
 * Converts an Array of Objects to CSV, where the first row is the keys of the object
 * @param {*} items - Object that will be turned into csv
 * @returns {String}} - CSV String
 */
function jsonToCsv(items) {
  if (items.length == 0) return "";
  // console.log(items.length == 0);

  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName])).join(",")
    ),
  ].join("\r\n");

  return csv;
}

/**
 * Merges the Lng and LngTD values, for display purposes
 * @param {Array<Object>} items - List of player objects that need to merge
 * @returns {Array<Object>} Fixed list of players
 */
function lngToString(items) {
  return items.map((e) => {
    e["Lng"] = e["Lng"].toString() + (e["LngTD"] == "1" ? "T" : "");
    delete e["LngTD"];
    return e;
  });
}

/**
 * Validates parameters to ensure no invalid fields are being queried
 * @param {Object} params - List of parameters to validate, comes from the query url
 * @returns True if the parameters are valid
 */
function validateInput(params) {
  // Object that denoes valid input
  const validInputs = {
    filterField: [
      "Player",
      "Team",
      "Pos",
      "Att",
      "Att/G",
      "Yds",
      "Avg",
      "Yds/G",
      "TD",
      "Lng",
      "1st",
      "1st%",
      "20+",
      "40+",
      "FUM",
    ],
    filterAsc: ["Ascending", "Descending"],
    filterLimit: ["25", "50", "100", "500"],
  };

  // Checks if the parameters are in the valid inputs
  if (
    validInputs["filterField"].includes(params["filterField"]) &&
    validInputs["filterLimit"].includes(params["filterLimit"]) &&
    validInputs["filterAsc"].includes(params["filterAsc"]) &&
    !isNaN(params["offset"]) // offfset is a number
  )
    return true;

  return false;
}

module.exports = {
  generateQuery,
  jsonToCsv,
  lngToString,
  validateInput,
  countQuery,
};
