const { knex, TABLE_NAME } = require("./db.js");
const express = require("express");
const { query } = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/json", (req, res) => {
  const { filterField, filterAsc, filterPlayer } = req.query;
  let query = knex(TABLE_NAME)
    .select()
    .orderBy(filterField, filterAsc == "Ascending" ? "asc" : "desc");

  if (filterPlayer) query.where("Player", "like", `%${filterPlayer}%`);

  query
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
