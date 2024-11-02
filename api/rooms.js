const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate } = require("./auth");
const prisma = require("../prisma");

// GET/rooms should send an array of all rooms.
router.get("/", async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (e) {
    next(e);
  }
});

// Get List of Available Rooms with checking the already booked date range.
router.get("/available", async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;

    // Transfer dates from strings to dates
    const start = new Date(fromDate);
    const end = new Date(toDate);

    const availableRooms = await prisma.room.findMany({
      where: {
        // should match the field name in module
        booking: {
          none: {
            OR: [
              {
                //should match the field name in module
                fromDate: {
                  lte: end,
                },
                toDate: {
                  gte: start,
                },
              },
            ],
          },
        },
      },
    });
    res.json(availableRooms);
  } catch (e) {
    next(e);
  }
});

// GET/rooms/:id should send a single room according to given ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const room = await prisma.room.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(room);
  } catch (e) {
    next(e);
  }
});

// POST/rooms should add a new room
router.post("/", authenticate, async (req, res, next) => {
  const { roomName, description, price, image, type } = req.body;

  try {
    const room = await prisma.room.create({
      data: { roomName, description, price, image, type },
    });
    res.status(201).json(room);
  } catch (e) {
    next(e);
  }
});

// DELETE/rooms should delete an existing room giver an ID
router.delete("/:id", async (req, res, next) => {
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

// PUT/rooms should update the information of a specific room by ID
router.put("/:id", async (req, res, next) => {
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
