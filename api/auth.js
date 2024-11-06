const express = require("express");
const router = express.Router();
require('dotenv').config();
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");
const createToken = require('../utils/token');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Extract the token
  console.log("Token received:", token); // Log token for debugging

  if (!token) {
    return res.status(401).send({ message: "You must be logged in" });
  }

  try {
    // Verify and decode the token
    const { id, isAdmin } = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded ID:", id, "isAdmin:", isAdmin);

    // Fetch the user from the database
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    // Attach the found user to the request object
    req.user = user;

    // If the route requires admin privileges, check the `isAdmin` field
    if (req.adminOnly && !user.isAdmin) {
      return res.status(403).send({ message: "Admin privileges required" });
    }

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send({ message: "Invalid or expired token" });
  }
};

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.register(name, email, password);
    const token = createToken(user.id, user.isAdmin);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.login(email, password);

    const token = createToken(user.id, user.isAdmin);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

// /** Checks the request for an authenticated user. */
// function authenticate(req, res, next) {
//   if (req.user) {
//     next();
//   } else {
//     next({ status: 401, message: "You must be logged in." });
//   }
// }

// /** Admin Route checking */
// function isAdmin(req, res, next) {
//   if (req.user.isAdmin) {
//     next();
//   } else {
//     next({ status: 401, message: "You must be an administrator." });
//   }
// }

module.exports = { router, verifyToken };
