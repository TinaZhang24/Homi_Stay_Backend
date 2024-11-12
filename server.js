const express = require("express");
const app = express();
const PORT = 3000;

const cors = require("cors");
app.use(cors({ origin: /localhost/ }));

const dotenv = require("dotenv");
dotenv.config();

app.use(require("morgan")("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`" METHOD : ${req.method} ${req.originalUrl}`);
  next();
});
//Routes for auth, bookings, rooms, admin
app.use(require("./api/auth").router);
app.use("/bookings", require("./api/bookings"));
app.use("/rooms", require("./api/rooms"));
app.use("/reviews", require("./api/reviews"));
app.use("/admin", require("./api/admin"));

// Logging middleware

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
