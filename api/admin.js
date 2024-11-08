const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate, isAdmin } = require("./auth");
const prisma = require("../prisma");

// Users:

// GET/users should send an array of all users.
router.get("/users", isAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// GET/users/:id should send a single user given an ID
router.get("/users/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: +id } });
    if (user) {
      res.json(user);
    } else {
      next({ status: 404, message: `User with id ${id} does not exist.` });
    }
  } catch (e) {
    next(e);
  }
});

// DELETE/users should delete an existing user giver an ID
router.delete("/users/:id", isAdmin, async (req, res, next) => {
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

// Bookings:

// GET/bookings should send an array of all bookings.
router.get("/bookings", isAdmin, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (e) {
    next(e);
  }
});

// DELETE/bookings should delete an existing booking giver an ID
router.delete("/bookings/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the booking exists
    const booking = await prisma.booking.findUnique({ where: { id: +id } });
    if (!booking) {
      return next({
        status: 404,
        message: `Booking with id ${id} does not exist.`,
      });
    }

    // Delete the booking
    await prisma.booking.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT/bookings should update the information of a specific booking by ID
router.put("/bookings/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { fromDate, toDate } = req.body;
  const from = new Date(fromDate).toISOString();
  const to = new Date(toDate).toISOString();

  try {
    // Check if the booking exists
    const booking = await prisma.booking.findUnique({ where: { id: +id } });
    if (!booking) {
      return next({
        status: 404,
        message: `Booking with id ${id} does not exist.`,
      });
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { id: +id },
      data: { fromDate: from, toDate: to },
    });
    res.json(updatedBooking);
  } catch (e) {
    next(e);
  }
});

// Rooms:

// GET/rooms should send an array of all rooms.
router.get("/rooms", isAdmin, async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (e) {
    next(e);
  }
});

// POST/rooms should add a room
router.post("/rooms", isAdmin, async (req, res, next) => {
  const { roomName, description, price, image, type } = req.body;
  try {
    const room = await prisma.room.create({
      data: {
        roomName,
        description,
        price: +price,
        image,
        type,
      },
    });
    res.status(201).json(room);
  } catch (e) {
    next(e);
  }
});

// DELETE/rooms should delete an existing room giver an ID
router.delete("/rooms/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({ where: { id: +id } });
    if (!room) {
      return next({
        status: 404,
        message: `Room with id ${id} does not exist.`,
      });
    }

    // Delete the room
    await prisma.room.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT/rooms/:id should update the information of a specific booking by ID
router.put("/rooms/:id", isAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { roomName, description, price, image, type } = req.body;

  try {
    // Check if the room exists
    const room = await prisma.room.findUnique({ where: { id: +id } });
    if (!room) {
      return next({
        status: 404,
        message: `Room with id ${id} does not exist.`,
      });
    }

    // Update the room
    const updatedRoom = await prisma.room.update({
      where: { id: +id },
      data: { roomName, description, price, image, type },
    });
    res.json(updatedRoom);
  } catch (e) {
    next(e);
  }
});
