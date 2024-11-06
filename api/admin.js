const express = require("express");
const router = express.Router();
require('dotenv').config();
const { verifyToken } = require("./auth");
const prisma = require("../prisma");


router.use(verifyToken);
// GET/users should send an array of all users.
router.get("/users", verifyToken, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(201).json({ message: "all users", users });
  } catch (e) {
    next(e);
  }
});

// DELETE/users should delete an existing user giver an ID
router.delete("/users/:id", verifyToken, async (req, res, next) => {
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
    await prisma.user.delete(user);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT/users should update the information of a specific user by ID
router.put("/users/:id", verifyToken, async (req, res, next) => {
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
// GET /rooms returns all rooms
router.get("/rooms", verifyToken, async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (e) {
    next(e);
  }
});

// DELETE /rooms/:id deletes a specific room
router.delete("/rooms/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id: +id } });
    if (!room) {
      return next({
        status: 404,
        message: `Room with id ${id} does not exist.`
      });
    }
    
    // Delete the room
    await prisma.room.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// GET /bookings returns all bookings
router.get("/bookings", verifyToken, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (e) {
    next(e);
  }
});

// DELETE /bookings/:id deletes a specific booking
router.delete("/bookings/:id", verifyToken, async (req, res, next) => {
  const { id } = req.params;
  
  try {
    // Check if booking exists
    const booking = await prisma.booking.findUnique({ where: { id: +id } });
    if (!booking) {
      return next({
        status: 404,
        message: `Booking with id ${id} does not exist.`
      });
    }
    
    // Delete the booking
    await prisma.booking.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

module.exports = router;