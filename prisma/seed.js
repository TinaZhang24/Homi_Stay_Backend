const prisma = require("../prisma");
const { faker } = require("@faker-js/faker");
const seed = async (numUsers = 1, numBookings = 3, numReviews = 1) => {
  // Create users
  const users = Array.from({ length: numUsers }, () => ({
    email: faker.internet.email(),
    name: faker.internet.displayName(),
    password: faker.internet.password(),
  }));
  // users.push({
  //   email: "kkk@gmail.com",
  //   name: "kkk",
  //   password: "kkk",
  //   isAdmin: true,
  // });
  await prisma.user.createMany({ data: users });
  // await prisma.user.register("nnn", "nnn@nnn.com", "nnn", true);

  // Create rooms
  const rooms = [
    {
      roomName: "Santa Monica",
      description: faker.lorem.sentence(3),
      price: 200,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgkMx8bhidyErnEeCzKvW4b5RXdOq85JyLug&s",
      type: "Double Room",
    },
    {
      roomName: "Huntington Beach",
      description: faker.lorem.sentence(3),
      price: 150,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROIpMERRZPtCPEbqNEuWndobk3t2KweLqvLA&s",
      type: "Single Room",
    },
    {
      roomName: "Venice Beach",
      description: faker.lorem.sentence(3),
      price: 150,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOdV0QLDUm-0uCa9TM-3s82v6JSUnU95Yizg&s",
      type: "Single Room",
    },
    {
      roomName: "Laguna Beach",
      description: faker.lorem.sentence(3),
      price: 200,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN4xUZ9GaqUJ0baKuS8xKEnZPek7NurJ8lwA&s",
      type: "Double Room",
    },
    {
      roomName: "Big Sur",
      description: faker.lorem.sentence(3),
      price: 150,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjH6KUF6E_bpbRe62DYZCKxglMkQV3fFJjDw&s",
      type: "Single Room",
    },
    {
      roomName: "Golden Gate Bridge",
      description: faker.lorem.sentence(3),
      price: 200,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAHzjSjquFO7kWabJ53Oj9zL6IewcfEgVlRQ&s",
      type: "Double Room",
    },
    {
      roomName: "Joshua Tree",
      description: faker.lorem.sentence(3),
      price: 150,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNRif49_jxEd8YwvX2oWReqkXmtGBMnYlVcg&s",
      type: "Single Room",
    },
    {
      roomName: "Yosemite",
      description: faker.lorem.sentence(3),
      price: 200,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe7xFSiVo5eoZGaZLqt4ZqP-glOMcYvyQhIw&s",
      type: "Double Room",
    },
    {
      roomName: "Disneyland",
      description: faker.lorem.sentence(3),
      price: 150,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ-07YrE8PiMnO7OjIdB6uP2KbN3uPS0SWng&s",
      type: "Single Room",
    },
    {
      roomName: "Universal Studio",
      description: faker.lorem.sentence(3),
      price: 250,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRECU3nWI-hcHcc_wZStKK3kU7kP6civaBC0w&s",
      type: "Suite",
    },
  ];

  await prisma.room.createMany({ data: rooms });

  // Create bookings
  const start = faker.date.soon();
  const end = faker.date.soon({ refDate: start });

  const bookings = Array.from({ length: numBookings }, () => ({
    fromDate: start,
    toDate: end,
    userId: 1,
    roomId: 4,
  }));
  await prisma.booking.createMany({ data: bookings });

  // Create reviews

  const reviews = Array.from({ length: numReviews }, () => ({
    description: faker.lorem.sentence(4),
    rating: Math.floor(Math.random() * 5) + 1,
    image: faker.image.url(),
    roomId: 4,
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
