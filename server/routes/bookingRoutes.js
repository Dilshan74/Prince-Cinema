import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getGuestBookings,
  getOccupiedSeats,
} from "../controllers/bookingControllers.js";
import { verifyToken } from "../middleware/auth.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/create", verifyToken, createBooking);
bookingRoutes.get("/all", getAllBookings);
bookingRoutes.get("/user/:userId", getUserBookings);
bookingRoutes.get("/guest", getGuestBookings);
bookingRoutes.get("/occupied-seats/:showId", getOccupiedSeats);

export default bookingRoutes;