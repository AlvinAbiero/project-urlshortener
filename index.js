require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dns = require("node:dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let urlDatabase = {}; // This will hold the short URL mappings
let shortUrlCounter = 1; // Counter to generate short URLs

app.use(cors());
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// POST route to create a short URL
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
