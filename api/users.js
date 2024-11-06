const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate, isAdmin } = require("./auth");
const prisma = require("../prisma");

// if admin, GET all bookings, all users, all rooms.
// if not admin, GET his own bookings
router.get("/", authenticate, async (req, res, next) => {
  console.log("REQ USER :", req.user.isAdmin);
  if (req.user.isAdmin) {
    try {
      const users = await prisma.user?.findMany({
        include: {
          booking: true,
        },
      });
      const bookings = await prisma.booking.findMany({
        include: {
          user: true,
          room: true,
        },
      });
      const rooms = await prisma.room.findMany({
        include: {
          booking: true,
        },
      });
      res.json(users);
      res.json(bookings);
      res.json(rooms);
    } catch (e) {
      next(e);
    }
  } else {
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
  }
});

//you create an object with that info so you send back
// res.json(an array with all that info)

// DELETE/users should delete an existing user giver an ID
// router.delete("/:id", isAdmin, async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     // Check if the user exists
//     const user = await prisma.user.findUnique({ where: { id: +id } });
//     if (!user) {
//       return next({
//         status: 404,
//         message: `User with id ${id} does not exist.`,
//       });
//     }

// Delete the user
//     await prisma.user.delete({ where: { id: +id } });
//     res.sendStatus(204);
//   } catch (e) {
//     next(e);
//   }
// });
