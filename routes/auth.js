import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

////Register////
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({ ...req.body, password: hash });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

////Login ////
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) res.status(500).json("wrong username!");

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) res.status(500).json("wrong password!");

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT
  );
  const { password,isAdmin, ...other } = user._doc;

  try {
    res.cookie("access_token", token, {httpOnly: true}).status(200).json({ ...other});
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
