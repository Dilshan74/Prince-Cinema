import User from '../models/user.js';
import Movie from '../models/movie.js';
import booking from '../models/booking.js';

//API Controller function to get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const user = req.userId; // Provided by verifyToken middleware
        const bookings = await booking.find({ userId: user }).sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    }catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

//API controller function to update favourite movie
export const updateFavouriteMovie = async (req, res) => {
    try {
        const userId = req.userId;
        const { movieId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isFavourite = user.favourites.includes(movieId);
        
        if (!isFavourite) {
            user.favourites.push(movieId);
        } else {
            user.favourites = user.favourites.filter(id => id !== movieId);
        }
        
        await user.save();

        res.json({ success: true, message: 'Favourite movie updated successfully' });
    } catch (error) {
        console.error('Error updating favourite movie:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

//Get favourite movies for a user
export const getFavourites = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: `User not found (ID from token: ${userId})` });
        }

        const favourites = user.favourites || [];
 
        //getting movies from the database
        const favouriteMovies = await Movie.find({ _id: { $in: favourites } });

        res.json({ success: true, Favourites: favouriteMovies });
    }
    catch (error) {
        console.error('Error fetching favourite movies:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }   
}


 