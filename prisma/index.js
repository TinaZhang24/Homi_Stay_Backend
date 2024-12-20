const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(name, email, password, isAdmin, saltRounds = 10) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword, isAdmin },
        });
        return user;
      },
      async login(email, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { email },
        });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Invalid password");
        return user;
      },
    },
  },
});
module.exports = prisma;
