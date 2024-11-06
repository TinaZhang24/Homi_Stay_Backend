const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function createToken(id, isAdmin) {
  return jwt.sign({ id, isAdmin }, JWT_SECRET, { expiresIn: "1d" });
}

module.exports = createToken;
