const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createToken } = require("../middleware/authMiddleware");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

// let tokens = [];

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password,
      idOrCreatedAt: Date.now().toString(),
    });
    // why did I first create user and then update for hashed?
    // because if I directly create using hash then :-
    // the validators that I put in db user model won't help
    // if user gives null in password then also it's hash will be more
    // than six chars and pass validations
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ username }, { password: hashedPassword });
    user.password = hashedPassword;
    // await User.deleteMany();
    // tokens = [];
    return res.status(200).json({ msg: "registered successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: "please provide username/password" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "user does not exist" });
    }
    // console.log(user, "\n");
    const dbPassword = user.password;
    // console.log("password", password, "\ndbpassword", dbPassword);
    const compare = await bcrypt.compare(password, dbPassword);
    if (!compare) {
      return res.status(400).json({ msg: "wrong username/password" });
    }

    console.log(user);

    const accessToken = createToken({ username, id: user.idOrCreatedAt });

    // res.cookie("access-token", accessToken, {
    //   maxAge: 60 * 60 * 24 * 30 * 1000,
    //   httpOnly: true,
    // });

    // const newToken = { username, accessToken };
    // tokens.push(newToken);
    // console.log(newToken);
    // console.log(tokens);

    return res
      .status(200)
      .json({ msg: "logged in successfully", user, accessToken });
  } catch (error) {
    console.log(error);
  }
};

const getProfile = (req, res) => {
  const randomNo = Math.floor(Math.random() * 100);
  res.send(
    `<h1>hey ${req.user.username}, your random number is ${randomNo}</h1>`
  );
};

const getUsers = async (req, res) => {
  // console.log(tokens);
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

module.exports = { register, login, getProfile, getUsers };
