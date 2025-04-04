require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("node:dns");
const app = express();
const { URL } = require("url");

// Basic Configuration
const port = process.env.PORT || 3000;

let urlDatabase = {}; // This will hold the short URL mappings
let counter = 1; // Counter to generate short URLs

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For x-www-form-urlencoded

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// POST a URL to shorten
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  let urlObject;
  try {
    urlObject = new URL(originalUrl);
  } catch (error) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(urlObject.hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    const short_url = counter++;
    urlDatabase[short_url] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: short_url,
    });
  });
});

// GET redirect from short URL
app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  const originalUrl = urlDatabase[shortUrl];
  if (!originalUrl) {
    return res.json({ error: "No short URL found for given input" });
  }

  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
