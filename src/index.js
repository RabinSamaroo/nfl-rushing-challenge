const { generateQuery, jsonToCsv, LngToString } = require("./util/util.js");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/json", (req, res) => {
  const query = generateQuery(req.query);
  query
    .then((result) => {
      res.json(LngToString(result));
    })
    .catch(() => {
      res.send(404);
    });
});

app.get("/csv", (req, res) => {
  const query = generateQuery(req.query);
  query
    .then((result) => {
      let csv = jsonToCsv(LngToString(result));
      res.attachment("rushing.csv");
      res.type(".csv");
      res.send(csv);
    })
    .catch(() => {
      res.send(404);
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
