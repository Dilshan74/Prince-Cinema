import express from 'express';
import { getNowPlayingMovies, addShow } from '../controllers/showControllers.js';

const showRoutes = express.Router();

showRoutes.get('/now-playing', getNowPlayingMovies);
showRoutes.post('/add', addShow);

export default showRoutes;