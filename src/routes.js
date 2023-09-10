const express = require("express");
const fs = require("fs");

const router = express.Router();

// Endpoint to serve the privacyLaws.json data
router.get("/privacylaws", (req, res) => {
  const rawData = fs.readFileSync(__dirname + "/privacyLaws.json", "utf8");
  const jsonData = JSON.parse(rawData);
  res.json(jsonData);
});

module.exports = router;
