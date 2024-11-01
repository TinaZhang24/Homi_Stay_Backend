const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

// GET/bookings should send an array of all bookings.
// To add authenticate.
router.get("/", async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.json(bookings);
  } catch (e) {
    next(e);
  }
});

// PATCH/bookings should update a specific room status from available to not available
// Maybe: To add available property in room @ schema? this step should be auto? should it stay on user end or admin end? How to make it auto change status?
// router.patch("/:id", async (req, res, next) => {
//   const { id } = req.params;
//   const { available } = req.body;

// Check if availability was provided
//   if (!available) {
//     return next({
//       status: 400,
//       message: "An availability status must be provided.",
//     });
//   }

//   try {
//     // Check if the booking exists
//     const booking = await prisma.booking.findUnique({ where: { id: +id } });
//     if (!booking) {
//       return next({
//         status: 404,
//         message: `Booking with id ${id} does not exist.`,
//       });
//     }

// Update the booking status
//     const updatedBooking = await prisma.book.patch({
//       where: { id: +id },
//       data: { available },
//     });
//     res.json(updatedBooking);
//   } catch (e) {
//     next(e);
//   }
// });

// DELETE/booings should cancel a booking given a specific ID
// To add authenticate param.
router.delete("/:id", async (req, res, next) => {
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
