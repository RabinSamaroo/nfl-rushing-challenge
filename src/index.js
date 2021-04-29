require("dotenv").config(); // setup environment variables from .env
const {
  generateQuery,
  jsonToCsv,
  lngToString,
  validateInput,
  countQuery,
} = require("./util/util.js");
const express = require("express");
const app = express();
const port = process.env.PORT;

// Serve public folder
app.use(express.static("public"));

// Api request responds data as json, based on query
app.get("/json", (req, res) => {
  if (!validateInput(req.query)) return res.sendStatus(400);

  let promises = [];

  // Get count for pagination
  promises[0] = countQuery()
    .then((result) => {
      return result[0]["count(*)"];
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });

  // Get data
  promises[1] = generateQuery(req.query)
    .then((result) => {
      return lngToString(result);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });

  Promise.all(promises).then((result) => {
    res.json({
      count: result[0],
      offset: req.query.offset,
      data: result[1],
    });
  });
});

// Download data in csv format based on query
app.get("/csv", (req, res) => {
  if (!validateInput(req.query)) return res.sendStatus(400);
  const query = generateQuery(req.query);
  query
    .then((result) => {
      let csv = jsonToCsv(lngToString(result));
      res.attachment("rushing.csv");
      res.type(".csv");
      res.send(csv);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

//Serve app
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app; // for testing
