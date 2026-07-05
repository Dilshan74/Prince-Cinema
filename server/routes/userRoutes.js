import express from "express";
import { getUserBookings, updateFavouriteMovie, getFavourites } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const userRoutes = express.Router();

userRoutes.get('/bookings', verifyToken, getUserBookings);
userRoutes.post('/update-favourite', verifyToken, updateFavouriteMovie);
userRoutes.get('/favourites', verifyToken, getFavourites);

export default userRoutes;
