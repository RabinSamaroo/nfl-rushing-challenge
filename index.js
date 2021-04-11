const { connection, TABLE_NAME } = require("./db.js");
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  connection
    .promise()
    .execute(`SELECT * FROM ${TABLE_NAME}`)
    .then((result) => {
      res.json(result[0]);
    })
    .catch((err) => {
      res.send(404);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
