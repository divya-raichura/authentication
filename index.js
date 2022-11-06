require("dotenv").config();
const express = require("express");
const app = express();
const auth = require("./router/authRoutes");
const db = require("./db/db");
// const cookieParser = require("cookie-parser");
// app.use(cookieParser());

app.use(express.json());

app.get("/home", (req, res) => {
  res.send("hi");
});

app.use("/", auth);

async function startServer() {
  try {
    await db(process.env.MONGO_URI);
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`server listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
}

startServer();
