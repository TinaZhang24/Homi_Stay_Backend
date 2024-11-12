const express = require("express");
const router = express.Router();
module.exports = router;
const { authenticate } = require("./auth");
const prisma = require("../prisma");

// POST/reviews should add a review
router.post("/", authenticate, async (req, res, next) => {
  const { description, rating, image } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        description,
        rating,
        image,
        userId: req.booking.id,
      },
    });
    res.status(201).json(review);
  } catch (e) {
    next(e);
  }
});
