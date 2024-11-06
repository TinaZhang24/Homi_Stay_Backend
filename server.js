const express = require("express");
const app = express();
const PORT = 3000;

const cors = require("cors");
app.use(cors({ origin: /localhost/ }));
require('dotenv').config;

app.use(require("morgan")("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// const auth = require('./api/auth');
// app.use('/api/auth', auth.router);

//Routes for auth, bookings, rooms, admin
app.use("/auth",require("./api/auth").router);
app.use("/bookings", require("./api/bookings"));
app.use("/rooms", require("./api/rooms"));
app.use("/admin", require("./api/admin"));
app.use("/users", require("./api/users"));
// Logging middleware

// Error-handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong :(");
});
// 404
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
