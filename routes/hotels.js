import express from "express";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

//Create Hotels////
router.post("/", verifyAdmin, async (req, res) => {
  const newHotel = new Hotel(req.body);
  try {
    const hotel = await newHotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update hotels///
router.put("/:id", verifyAdmin, async (req, res) => {
  const Updatehotel = await Hotel.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  try {
    res.status(200).json(Updatehotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Delete hotels//
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json("hotel deleted successfully!");
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get a hotel//
router.get("/find/:id", async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  try {
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get all hotels
router.get("/", async (req, res) => {
  const { min, max, ...others } = req.query;
  const hotels = await Hotel.find({
    ...others,
    cheapestPrice: { $gt: min || 1, $lt: max || 10000 },
  }).limit(req.query.limit);
  try {
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get hotels count by cities///
router.get("/countbycity", async (req, res) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get hotels count by type///
router.get("/countbytype", async (req, res) => {
  const hotelsCount = await Hotel.countDocuments({ type: "hotels" });
  const apartmentsCount = await Hotel.countDocuments({ type: "apartments" });
  const resortsCount = await Hotel.countDocuments({ type: "resorts" });
  const villasCount = await Hotel.countDocuments({ type: "villas" });
  const cabinsCount = await Hotel.countDocuments({ type: "cabins" });
  try {
    res.status(200).json([
      { type: "hotels", count: hotelsCount },
      { type: "apartments", count: apartmentsCount },
      { type: "resorts", count: resortsCount },
      { type: "villas", count: villasCount },
      { type: "cabins", count: cabinsCount },
    ]);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Get Hotel rooms///
router.get("/room/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(hotel.rooms.map((room) => {
      return Room.findById(room);
    }))
    res.status(200).json(list)
  } catch (error) {
    res.status(500).json(error);
  }

})

export default router;
