import express from 'express';
import {
  getNowPlayingMovies,
  addShow,
  getAllShows,
  getShow,
  deleteShow
} from '../controllers/showControllers.js';
import { protectAdmin } from '../middleware/auth.js';

const showRoutes = express.Router();

// Get now playing movies
showRoutes.get('/now-playing', getNowPlayingMovies);

// Add a show (Admin only)
showRoutes.post('/add', protectAdmin, addShow);

// Delete a show (Admin only)
showRoutes.delete('/:showId', protectAdmin, deleteShow);

// Get all shows
showRoutes.get('/all', getAllShows);

// Get shows for a specific movie
showRoutes.get('/:movieId', getShow);

export default showRoutes;