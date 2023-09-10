const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const cors = require("cors");
const privacyLawsRouter = require("./routes");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Connected");
});

app.use("/api", privacyLawsRouter);
app.get("/api/privacylaws", (req, res) => {
  const rawData = fs.readFileSync(__dirname + "/privacyLaws.json", "utf8");
  const jsonData = JSON.parse(rawData);
  res.json(jsonData);
});

mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (error) => console.error("connection error:", error));
db.once("open", function () {
  console.log("MongoDB connection is live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
