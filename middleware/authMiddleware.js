const { sign, verify } = require("jsonwebtoken");

const createToken = (user) => {
  const accessToken = sign(
    { username: user.username, id: user.id },
    process.env.SECRET_TOKEN,
    { expiresIn: "30d" }
  );

  return accessToken;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "not authorized" });
  }

  const accessToken = authHeader.split(" ")[1];
  try {
    const verified = verify(accessToken, process.env.SECRET_TOKEN);
    console.log(verified);
    const { id, username } = verified;
    req.user = { id, username };
    next();
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

module.exports = { createToken, verifyToken };
