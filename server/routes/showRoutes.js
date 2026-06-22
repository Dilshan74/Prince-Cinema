import express from 'express';
import { getNowPlayingMovies, addShow } from '../controllers/showControllers.js';
import { protectAdmin } from '../middleware/auth.js';

const showRoutes = express.Router();

showRoutes.get('/now-playing', getNowPlayingMovies);
showRoutes.post('/add', protectAdmin, addShow);

export default showRoutes;