require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dns = require("node:dns");
const { error } = require("node:console");
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

  // Validate the URL format using regex
  const urlPattern =
    /^(https?:\/\/)([a-z0-9-]+\.)+[a-z0-9]{2,}(\/[a-zA-Z0-9#]+\/?)*$/;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Use dns.lookup to verify the domain of the URL
  const urlObject = new URL(originalUrl);
  dns.lookup(urlObject.hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    // Create short URL and store it in the database
    const shortUrl = shortUrlCounter++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl,
    });
  });
});

// GET route to redirect to the original URL
app.get("/api/shorturl/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;

  if (urlDatabase[shortUrl]) {
    return res.redirect(urlDatabase[shortUrl]);
  }

  return res.json({ error: "Short URL not found" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
