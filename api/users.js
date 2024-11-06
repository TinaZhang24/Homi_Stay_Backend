const express = require("express");
const router = express.Router();
const { verifyToken } = require("./auth");
const prisma = require("../prisma");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const createToken = require('../utils/token');


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
// DELETE/users should delete an existing user giver an ID
router.delete("/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: +id } });
    if (!user) {
      return next({
        status: 404,
        message: `User with id ${id} does not exist.`,
      });
    }
    
    // Delete the user
    await prisma.user.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT/users should update the information of a specific user by ID
router.put("/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  
  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: +id } });
    if (!user) {
      return next({
        status: 404,
        message: `User with id ${id} does not exist.`,
      });
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: +id },
      data: { name, email, password },
    });
    res.json(updatedUser);
  } catch (e) {
    next(e);
  }
  
  // GET/users should send an array of all users.
  router.get("/", verifyToken, async (req, res, next) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (e) {
      next(e);
    }
  });
});
module.exports = router;