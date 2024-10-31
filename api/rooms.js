const express = require("express");
const router = express.Router();
module.exports = router;

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
