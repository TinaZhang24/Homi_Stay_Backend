const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async register(name, email, password, saltRounds = 10) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword },
        });
        return user;
      },
      async login(email, password) {
        const user = await prisma.user.findUniqueOrThrow({
          where: { email },
        });
        // debugging here
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw Error("Invalid password");
        return user;
      },
    },
  },
});
module.exports = prisma;
