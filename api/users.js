const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate } = require("./auth");
const prisma = require("../prisma");

// GET/users should send an array of all users.
router.get("/", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// GET/users/:id should send a single user according to given ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

// DELETE/users should delete an existing user giver an ID
router.delete("/:id", async (req, res, next) => {
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
router.put("/:id", async (req, res, next) => {
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
});
