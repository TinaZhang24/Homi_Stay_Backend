const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");
const seed = async (
  numUsers = 30,
  numBookings = 35,
  numRooms = 20,
  numReviews = 28
) => {
  const users = Array.from({ length: numUsers }, () => ({
    email: faker.internet.email(),
    name: faker.person.fullname(),
    password: faker.internet.password(),
  }));
  await prisma.user.createMany({ data: users });

  const bookings = Array.from({ length: numBookings }, () => ({
    fromDate: faker.date.soon(),
    toDate: faker.date.soon({ refDate: start }),
  }));
  await prisma.booking.createMany({ data: bookings });

  const rooms = Array.from({ length: numRooms }, () => ({
    roomNumber: faker.number.int(),
    price: Math.floor(Math.random() * 300) + 1,
    image: faker.image.url(),
    // type:
    // how can i make type in the range of [single, double, suites]
  }));
  await prisma.room.createMany({ data: rooms });

  const reviews = Array.from({ length: numReviews }, () => ({
    description: faker.lorem.sentence(4),
    rating: Math.floor(Math.random() * 6),
    image: faker.image.url(),
  }));
  await prisma.review.createMany({ data: reviews });
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
