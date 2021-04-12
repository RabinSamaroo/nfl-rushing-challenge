const { knex, TABLE_NAME } = require("./db.js");
const express = require("express");
const app = express();
const port = 3000;

// TODO: Move to util functions
function generateQuery(queryParams) {
  const { filterField, filterAsc, filterPlayer } = queryParams;
  let query = knex(TABLE_NAME)
    .select()
    .orderBy(filterField, filterAsc == "Ascending" ? "asc" : "desc");

  if (filterPlayer) query.where("Player", "like", `%${filterPlayer}%`);
  return query;
}

function jsonToCsv(items) {
  const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  return csv;
}

function LngToString(items) {
  return items.map((e) => {
    e["Lng"] = e["Lng"].toString() + (e["LngTD"] == "1" ? "T" : "");
    delete e["LngTD"];
    return e;
  });
}

app.use(express.static("public"));

app.get("/json", (req, res) => {
  const query = generateQuery(req.query);
  query
    .then((result) => {
      res.json(LngToString(result));
    })
    .catch((err) => {
      res.send(404);
    });
});

app.get("/csv", (req, res) => {
  const query = generateQuery(req.query);
  query
    .then((result) => {
      csv = jsonToCsv(LngToString(result));
      res.attachment("rushing.csv");
      res.type(".csv");
      res.send(csv);
    })
    .catch((err) => {
      res.send(404);
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
