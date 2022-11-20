require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const User = require("./model/userModel");

const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hellloooo b");
});

app.post("/signup", async (req, res) => {
  const hashPwd = await bcrypt.hash(req.body.password, 10);

  const isUserFound = await User.findOne({ email: req.body.email });

  //   console.log(isUserFound);

  if (isUserFound) res.status(401).send("This email id is already registered");

  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashPwd,
  });

  res.status(200).json(user);
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) res.status(404).send("User not found. Please signup first");
  const isPwdCrct = await bcrypt.compare(req.body.password, user.password);
  isPwdCrct
    ? res.status(201).send("Login Successfull")
    : res.status(401).send("Password is incorrect");
});

module.exports = app;
