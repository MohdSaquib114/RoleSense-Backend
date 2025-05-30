const express = require("express");
const routes = require("./routes/route");
const cors = require("cors")

const multer = require("multer");

const app = express();

app.use(express.json());
app.use(cors())

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.locals.upload = upload;

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
