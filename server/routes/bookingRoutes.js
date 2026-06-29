import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  getGuestBookings,
  getOccupiedSeats,
} from "../controllers/bookingControllers.js";

const bookingRoutes = express.Router();

bookingRoutes.post("/create", createBooking);
bookingRoutes.get("/all", getAllBookings);
bookingRoutes.get("/user/:userId", getUserBookings);
bookingRoutes.get("/guest", getGuestBookings);
bookingRoutes.get("/occupied-seats/:showId", getOccupiedSeats);

export default bookingRoutes;