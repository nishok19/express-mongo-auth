require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const User = require("./model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const { SECRET } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hellloooo b");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.send(401).send("All fields are required");

    const hashPwd = await bcrypt.hash(password, 10);

    const isUserFound = await User.findOne({ email });

    //   console.log(isUserFound);

    if (isUserFound)
      res.status(401).send("This email id is already registered");

    const user = await User.create({
      username,
      email,
      password: hashPwd,
    });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error is signup ", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.send(401).send("All the fields are required");

    let user = await User.findOne({ email });
    if (!user) res.status(404).send("User not found. Please signup first");

    const isPwdCrct = await bcrypt.compare(password, user.password);
    if (!isPwdCrct) res.status(401).send("Password is incorrect");

    const token = await jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      SECRET,
      { expiresIn: "2h" }
    );
    user.password = undefined;
    console.log("User .. ", user);

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(201).cookie("token", token, options).json({ user, token });
  } catch (error) {
    console.log("Error in login ", error);
  }
});

app.post("/dashboard", auth, (req, res) => {
  console.log("dashboard");
  res.status(200).json(req.body);
});

module.exports = app;
