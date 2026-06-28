import express from "express";
import { getUserBookings, updateFavouriteMovie, getFavourites } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get('/bookings', getUserBookings);
userRoutes.post('/update-favourite', updateFavouriteMovie);
userRoutes.get('/favourites', getFavourites);

export default userRoutes;
