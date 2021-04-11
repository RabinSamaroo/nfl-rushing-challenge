const { knex, TABLE_NAME } = require("./db.js");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/json", (req, res) => {
  knex(TABLE_NAME)
    .select()
    .orderBy("Yds", "desc")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.send(404);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
