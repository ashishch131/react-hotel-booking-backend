import express from "express";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

//Create room////
router.post("/:hotelid", verifyAdmin, async (req, res) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      res.status(500).json(error);
    }
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update room///
router.put("/:id", verifyAdmin, async (req, res) => {
  const UpdateRoom = await Room.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  try {
    res.status(200).json(UpdateRoom);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete room//
router.delete("/:id/:hotelid", verifyAdmin, async (req, res) => {
  const hotelId = req.params.hotelid;

  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (error) {
      res.status(500).json(error);
    }
    res.status(201).json("Room has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get room//
router.get("/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  try {
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all rooms
router.get("/", async (req, res) => {
  const rooms = await Room.find();
  try {
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update availability//
router.put("/availability/:id", async (req, res) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    res.status(200).json(err);
  }
})
export default router;
