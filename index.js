const mysql = require("mysql2");
const rushing = require("./rushing.json");

// create the connection to database
const connection = mysql.createConnection({
  host: "34.68.135.75",
  user: "root",
  password: "password",
  database: "tst1",
});

function createTable() {
  return `
CREATE TABLE players(
  \`Player\` VARCHAR(64) NOT NULL,
  \`Team\` VARCHAR(3) NOT NULL,
  \`Pos\`  VARCHAR(2) NOT NULL,
  \`Att\`  INTEGER  NOT NULL,
  \`AttG\` NUMERIC(8,1) NOT NULL,
  \`Yds\`  INTEGER  NOT NULL,
  \`Avg\`  NUMERIC(8,1) NOT NULL,
  \`YdsG\` NUMERIC(8,1) NOT NULL,
  \`TD\`   INTEGER  NOT NULL,
  \`Lng\`  INTEGER  NOT NULL,
  \`1st\`  INTEGER  NOT NULL,
  \`1st%\` NUMERIC(8,1) NOT NULL,
  \`20+\`  INTEGER  NOT NULL,
  \`40+\`  INTEGER  NOT NULL,
  \`FUM\`  INTEGER  NOT NULL,
  \`LngTD\` BOOLEAN  NOT NULL
);
  `;
}

function processRawRushingJSON(input) {
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
  return arr;
}

function batchInsertFromJSON(arr) {
  let procArr = processRawRushingJSON(arr);
  let queryString = `
    INSERT INTO players(\`Player\`,\`Team\`,\`Pos\`,\`Att\`,\`AttG\`,\`Yds\`,\`Avg\`,\`YdsG\`,\`TD\`,\`Lng\`,\`1st\`,\`1st%\`,\`20+\`,\`40+\`,\`FUM\`,\`LngTD\`) VALUES
    `;

  for (e in procArr) {
    obj = procArr[e];
    queryString += `
    ("${obj["Player"]}",'${obj["Team"]}','${obj["Pos"]}',${obj["Att"]},${obj["Att/G"]},${obj["Yds"]},${obj["Avg"]},${obj["Yds/G"]},${obj["TD"]},${obj["Lng"]},${obj["1st"]},${obj["1st%"]},${obj["20+"]},${obj["40+"]},${obj["FUM"]},${obj["LngTD"]}),`;
  }

  return queryString.replace(/,\s*$/, "");
}

async function query(string) {
  let result = await connection.promise().execute(string);
  return result;
}

query(`SELECT * from players ORDER BY Yds DESC LIMIT 10`).then(
  ([result, ...metadata]) => {
    console.log(result);
  }
);
connection.end();
