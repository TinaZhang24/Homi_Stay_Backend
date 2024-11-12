const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate } = require("./auth");
const prisma = require("../prisma");

// GET/bookings should send an array of all bookings of a single given user.
router.get("/", authenticate, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        room: true,
      },
    });
    res.json(bookings);
  } catch (e) {
    next(e);
  }
});

// POST/bookings should add a booking
router.post("/", authenticate, async (req, res, next) => {
  const { fromDate, toDate, roomId } = req.body;
  const from = new Date(fromDate).toISOString();
  const to = new Date(toDate).toISOString();
  try {
    const booking = await prisma.booking.create({
      data: {
        fromDate: from,
        toDate: to,
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
  const { fromDate, toDate, roomId } = req.body;
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
      data: {
        fromDate: from,
        toDate: to,
        userId: req.user.id,
        roomId: +roomId,
      },
    });
    res.json(updatedBooking);
  } catch (e) {
    next(e);
  }
});
