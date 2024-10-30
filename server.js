const express = require("express");
const app = express();
const PORT = 3000;

const dotenv = require("dotenv");
dotenv.config();

// import routes from slice
app.use("/rooms", require("./api/rooms"));

app.use(express.json());
// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
// 404
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});
// Error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
