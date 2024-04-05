import express from "express";
import User from "../models/User.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";
const router = express.Router();

// //veify Token//
// router.get("/checkverification", verifyToken, (req, res) => {
//   res.send("you are logged in")
// });

// //verify user///
// router.get("/checkuser/:id", verifyUser, (req, res) => {
//   res.send("hello user you are logged in you can delete your account!")
// });

// //verify Admin////
// router.get("/checkadmin/:id", verifyAdmin, (req, res) => {
//   res.send("hello Admin you are logged in you can delete all accounts!")
// });

//Update User///
router.put("/:id", verifyUser, async (req, res) => {
  const UpdateUser = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  try {
    res.status(200).json(UpdateUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete User//
router.delete("/:id", verifyUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("user has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get User//
router.get("/:id", verifyUser, async (req, res) => {
  const user = await User.findById(req.params.id);
  try {
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all Users
router.get("/", verifyAdmin, async (req, res) => {
  const users = await User.find();
  try {
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
