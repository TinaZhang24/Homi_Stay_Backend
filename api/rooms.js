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
