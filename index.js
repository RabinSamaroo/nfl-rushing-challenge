const { connection, TABLE_NAME } = require("./db.js");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/q", (req, res) => {
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
