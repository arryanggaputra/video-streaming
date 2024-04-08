import express from "express";
import got from "got";
import "dotenv/config";
import mysql from "mysql2/promise";

const app = express();

// Create the connection to database
const connection = await mysql.createConnection({
  host: process.env.mysql_host,
  port: process.env.mysql_port,
  user: process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_database,
  pool: true,
});

app.get("/", async (req, res) => {
  const videoId = req.query.id;
  const [results] = await connection.execute(
    "SELECT * FROM YoutubeVideoLists where id = ? limit 1",
    [videoId]
  );

  if (results.length < 1) {
    return res.send("Not found", 404);
  }

  const vidUrl = results[0].url;
  return got.stream(vidUrl).pipe(res);
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
