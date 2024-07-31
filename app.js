const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));

mongoose
  .connect(process.env.DB_HOST)
  .then(() => console.log("Database connection successful"))
  .catch((error) =>
    console.error("Error while establishing connection", error)
  );

app.use("/api/contacts", require("./routes/api/contacts"));
app.use("/api/users", require("./routes/api/users"));

app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

module.exports = app;
