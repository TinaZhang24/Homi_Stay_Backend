const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
}

const prisma = require("../prisma");

router.use(async (req, res, next) => {
  // Grab token from headers only if it exists
  const authHeader = req.headers.authorization;
  // Slice off the first 7 characters (Bearer ), leaving the token
  const token = authHeader?.split(" ")[1];
  console.log("TOKEN: ", token); // "Bearer <token>"
  // If there is no token move on to the next middleware
  if (!token) {
    return next();
  }

  // Find user with ID decrypted from the token and attach to the request
  try {
    // Decodes the id from the token, using the secret code in env
    // Assigns the id to variable id
    const { id } = jwt.verify(token, JWT_SECRET);
    console.log("ID :", id);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });
    // Attach the found customer to the request object
    req.user = user;
    console.log(req.user);
    // Move to the next middleware
    next();
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.register(name, email, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.login(email, password);

    const token = createToken(user.id);
    console.log("BACKEND LOGIN:", user);
    res.json({ token, admin: user.isAdmin });
  } catch (error) {
    next(error);
  }
});

/** Checks the request for an authenticated user. */
function authenticate(req, res, next) {
  console.log("AUTH REQ: ", req);
  if (req.user) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in." });
  }
}

/** Admin Route checking */
function isAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    next({ status: 401, message: "You must be an administrator." });
  }
}

module.exports = { router, authenticate, isAdmin };
