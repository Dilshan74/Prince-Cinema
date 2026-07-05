import { clerkClient } from '@clerk/express';
import booking from '../models/booking.js';

//API Controller function to get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.userId; // Provided by verifyToken middleware
        const bookings = await booking.find({ user }).populate({path: 'show'}).populate({path: 'movie'}).sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    }catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

//API controller function to update favourite movie in clerk user metadata
export const updateFavouriteMovie = async (req, res) => {
    try {
        const { userId } = req.auth().userId;
        const { movieId } = req.body;
        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favouriteMovies) {
            user.privateMetadata.favouriteMovies = [];
        }

        if (!user.privateMetadata.favouriteMovies.includes(movieId)) {
            user.privateMetadata.favouriteMovies.push(movieId);
        }else {
            user.privateMetadata.favouriteMovies = user.privateMetadata.favouriteMovies.filter(id => id !== movieId);
        }
        await clerkClient.users.updateUser(userId, { privateMetadata: user.privateMetadata });

        res.json({ success: true, message: 'Favourite movie updated successfully' });
    } catch (error) {
        console.error('Error updating favourite movie:', error);
        res.json({ success: false, message: 'Internal server error' });
    }
};

//Get favourite movies for a user
export const getFavourites = async (req, res) => {
    try {
        const user = await clerkClient.users.getUser(req.auth().userId);
        const Favourites = user.privateMetadata.Favourites;

 
    //getting movies from the database
    const movies = await movies.find({ _id: { $in: Favourites } });

           res.json({ success: true, Favourites });
    }
    catch (error) {
        console.error('Error fetching favourite movies:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }   
}




 