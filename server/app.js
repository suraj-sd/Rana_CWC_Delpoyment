const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// 🔹 Middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());

// 🔹 Existing static folders (keep them)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "uploads")));

// 🔹 API routes (keep as-is)
require("./src/routes/index")(app);

// 🔥 Serve React dist (ADD THIS)
app.use(express.static(path.join(__dirname, "../client/dist")));

// 🔥 React fallback (IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

module.exports = app;
