const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate } = require("./auth");
const prisma = require("../prisma");

// GET/bookings should send an array of all bookings.
router.get("/", authenticate, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (e) {
    next(e);
  }
});

// GET/bookings/:id should send a single booking according to given ID
router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: +id },
    });
    res.json(booking);
  } catch (e) {
    next(e);
  }
});

// POST/bookings should add a booking
router.post("/", authenticate, async (req, res, next) => {
  const { fromDate, toDate, roomId } = req.body;
  try {
    // how to convert only one room Id to object format? Do we actually need the conversion?
    // Here, room is not an array, one booking -> one room, not sure if Mapping works
    // const room = roomId.map((id) => ({ id }));
    const booking = await prisma.booking.create({
      data: {
        fromDate,
        toDate,
        userId: req.user.id,
        roomId: +roomId,
      },
    });
    res.status(201).json(booking);
  } catch (e) {
    next(e);
  }
});

// DELETE/bookings should cancel a booking given a specific ID
// To add authenticate param.
router.delete("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUniqueOrThrow({
      where: { id: +id },
    });
    await prisma.booking.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
});

// PUT/bookings should update the information of a specific booking by ID
router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { fromDate, toDate, userId, roomId } = req.body;

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
      data: { fromDate, toDate, userId, roomId },
    });
    res.json(updatedBooking);
  } catch (e) {
    next(e);
  }
});
