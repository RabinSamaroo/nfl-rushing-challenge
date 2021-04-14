const { generateQuery, jsonToCsv, lngToString } = require("./util/util.js");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;

// Serve public folder
app.use(express.static("public"));
app.use(cors());

// Api request responds data as json, based on query
app.get("/json", (req, res) => {
  const query = generateQuery(req.query);
  query
    .then((result) => {
      res.json(lngToString(result));
    })
    .catch(() => {
      res.send(404);
    });
});

// Download data in csv format based on query
app.get("/csv", (req, res) => {
  const query = generateQuery(req.query);
  query
    .then((result) => {
      let csv = jsonToCsv(lngToString(result));
      res.attachment("rushing.csv");
      res.type(".csv");
      res.send(csv);
    })
    .catch(() => {
      res.send(404);
    });
});

//Serve app
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
