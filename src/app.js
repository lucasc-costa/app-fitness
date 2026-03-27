import express from "express";
import database from "./config/database.js";

const app = express();

app.get("/", function (req, res) {
  res.send("Olá mundo!");
});

app.listen(process.env.PORT || 3000, async function () {
  console.log("Servidor iniciado!");

  const result = await database.query("SELECT 1+ 1 as sum;");
  console.log(result.rows);
});
