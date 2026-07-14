import axios from 'axios';
import Movie from '../models/movie.js';
import Show from '../models/show.js';

const LOCAL_MOVIES = [
    {
        _id: '1',
        adult: false,
        backdrop_path: '/qdIMHd4sEfJSckfVJfKQvisL02a.jpg',
        genre_ids: [],
        title: 'Deadpool & Wolverine',
        original_language: 'en',
        overview: 'Deadpool teams up with Wolverine for a chaotic multiverse mission packed with sharp humor and brutal action.',
        popularity: 0,
        poster_path: '/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        release_date: '2024-07-26',
        video: false,
        vote_average: 7.6,
        vote_count: 1,
        genres: ['Action', 'Comedy'],
        casts: ['Deadpool', 'Wolverine'],
        runtime: 128,
        tagline: 'Mutant mayhem returns.',
    },
    {
        _id: '2',
        adult: false,
        backdrop_path: '/53z2fyfBDvYjYMBSaD6fXZoJASi.jpg',
        genre_ids: [],
        title: 'Avatar: The Way of Water',
        original_language: 'en',
        overview: 'Jake Sully and Neytiri fight to protect their family as the oceans of Pandora reveal new allies and dangers.',
        popularity: 0,
        poster_path: '/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
        release_date: '2022-12-16',
        video: false,
        vote_average: 7.6,
        vote_count: 1,
        genres: ['Sci-Fi', 'Adventure'],
        casts: ['Jake Sully', 'Neytiri'],
        runtime: 192,
        tagline: 'Return to Pandora.',
    },
    {
        _id: '3',
        adult: false,
        backdrop_path: '/5PJzuJgVWnMJRO6WaImqPgU5kKQ.jpg',
        genre_ids: [],
        title: 'Kung Fu Panda 4',
        original_language: 'en',
        overview: 'Po faces a shape-shifting villain while searching for the next Dragon Warrior.',
        popularity: 0,
        poster_path: '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
        release_date: '2024-03-08',
        video: false,
        vote_average: 6.9,
        vote_count: 1,
        genres: ['Animation', 'Comedy'],
        casts: ['Po'],
        runtime: 94,
        tagline: 'A fresh start for the Dragon Warrior.',
    },
    {
        _id: '4',
        adult: false,
        backdrop_path: '/jf7plSHwMpGCDXGZMQLzqTEKrz5.jpg',
        genre_ids: [],
        title: 'Mission: Impossible - Dead Reckoning Part One',
        original_language: 'en',
        overview: 'Ethan Hunt races across the globe to stop a dangerous intelligence threat.',
        popularity: 0,
        poster_path: '/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
        release_date: '2023-07-12',
        video: false,
        vote_average: 7.7,
        vote_count: 1,
        genres: ['Action', 'Spy'],
        casts: ['Ethan Hunt'],
        runtime: 163,
        tagline: 'The world depends on it.',
    },
];

const findLocalMovie = (movieID) => LOCAL_MOVIES.find((movie) => String(movie._id) === String(movieID));
const findLocalMovieByTitle = (title) => {
    if (!title) return null;
    const normalizedTitle = String(title).toLowerCase().trim();
    return LOCAL_MOVIES.find((movie) => String(movie.title).toLowerCase().trim() === normalizedTitle);
};

const normalizeShowTimes = (show) => {
    if (Array.isArray(show.times)) return show.times;
    if (Array.isArray(show.time)) return show.time;
    if (typeof show.time === 'string') return [show.time];
    if (typeof show.showTime === 'string') return [show.showTime];
    return [];
};

const parseShowDateTime = (date, time) => {
    if (!date || !time) return null;
    const rawDate = String(date).trim();
    const rawTime = String(time).trim().replace(/\./g, ':');
    const candidates = [
        `${rawDate}T${rawTime}+05:30`,
        `${rawDate} ${rawTime}`,
        `${rawDate}T${rawTime}`,
        `${rawDate.replace(/\//g, '-')}T${rawTime}`,
    ];

    for (const candidate of candidates) {
        const parsed = new Date(candidate);
        if (!Number.isNaN(parsed.getTime())) return parsed;
    }

    if (rawDate.includes('/')) {
        const parts = rawDate.split('/').map((part) => part.padStart(2, '0'));
        if (parts.length === 3) {
            const [first, second, third] = parts;
            const iso = `${third.length === 4 ? third : first}-${third.length === 4 ? first : third}-${second}`;
            const parsed = new Date(`${iso}T${rawTime}+05:30`);
            if (!Number.isNaN(parsed.getTime())) return parsed;
        }
    }

    return null;
};

export const getNowPlayingMovies = async (req, res) => {
    try {
        // Default: return the local admin now-playing list so Admin UI and Postman match.
       
        if (String(req.query.source || '').toLowerCase() === 'tmdb') {
            const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
                params: { api_key: process.env.TMDB_API_KEY, page: 1 }
            });
            return res.json({ success: true, movies: data.results });
        }

        return res.json({ success: true, movies: LOCAL_MOVIES });
    } catch (error) {
        console.error('Now-playing Error:', error.response?.status, error.response?.data || error.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch now playing movies', error: error.response?.data || error.message });
    }
}

//API to add a new show to the database
export const addShow = async (req, res) => {
    try {
        const {
            movieID,
            movieId,
            movieTitle,
            title,
            movie: movieName,
            hall,
            showInput: rawShowInput,
            showPrice,
            date: rawDate,
            time: rawTime,
            showTime: rawShowTime,
        } = req.body;

        const resolvedMovieID = movieID || movieId || null;
        const resolvedMovieTitle = movieTitle || title || movieName || null;

        const showInput = Array.isArray(rawShowInput)
            ? rawShowInput
            : rawShowInput
                ? [rawShowInput]
                : [];

        if (showInput.length === 0 && rawDate && (rawTime || rawShowTime)) {
            showInput.push({ date: rawDate, time: rawTime || rawShowTime });
        }

        if (showInput.length === 0) {
            return res.status(400).json({ success: false, message: 'showInput must be a non-empty array or include date/showTime fields' });
        }

        const normalizedShowPrice = typeof showPrice === 'string' ? Number(showPrice) : showPrice;
        if (typeof normalizedShowPrice !== 'number' || Number.isNaN(normalizedShowPrice)) {
            return res.status(400).json({ success: false, message: 'showPrice must be a number or numeric string' });
        }

        let movie = null;
        let movieData = null;
        const localMovie = resolvedMovieID ? findLocalMovie(resolvedMovieID) : findLocalMovieByTitle(resolvedMovieTitle);
        const effectiveMovieID = resolvedMovieID || localMovie?._id;

        // Require at least a title or an ID
        if (!effectiveMovieID && !resolvedMovieTitle) {
            return res.status(400).json({ success: false, message: 'movieID or movieTitle is required' });
        }

        // Only look up by ID if we have one
        if (effectiveMovieID) {
            movie = await Movie.findById(String(effectiveMovieID));
        }

        if (!movie && localMovie) {
            // Movie is in our local list but not yet in DB — create it with local data
            movieData = {
                ...localMovie,
                poster_path: localMovie.poster_path || '',
                backdrop_path: localMovie.backdrop_path || '',
                genres: Array.isArray(localMovie.genres) ? localMovie.genres : [],
                casts: Array.isArray(localMovie.casts) ? localMovie.casts : [],
                vote_average: typeof localMovie.vote_average === 'number' ? localMovie.vote_average : 0,
                runtime: typeof localMovie.runtime === 'number' ? localMovie.runtime : 0,
            };
        }

        if (!movie) {
            if (movieData) {
                movie = await Movie.create(movieData);
            } else {
                // Movie not found locally — search TMDB by title
                let tmdbMovieId = effectiveMovieID;
                if (resolvedMovieTitle) {
                    const searchResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: process.env.TMDB_API_KEY,
                            query: resolvedMovieTitle,
                            page: 1,
                        },
                    });
                    const firstResult = Array.isArray(searchResponse.data.results) ? searchResponse.data.results[0] : null;
                    if (!firstResult) {
                        return res.status(404).json({ success: false, message: `Movie not found on TMDB for title '${resolvedMovieTitle}'` });
                    }
                    tmdbMovieId = firstResult.id;
                    // Check if this TMDB movie already exists in DB
                    movie = await Movie.findById(String(tmdbMovieId));
                }

                if (!movie) {
                    const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovieId}`, {
                            params: { api_key: process.env.TMDB_API_KEY }
                        }),
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovieId}/credits`, {
                            params: { api_key: process.env.TMDB_API_KEY }
                        })
                    ]);

                    const tmdbData = movieDetailsResponse.data;
                    const tmdbCredits = movieCreditsResponse.data;

                    movie = await Movie.create({
                        _id: String(tmdbMovieId),
                        title: tmdbData.title || resolvedMovieTitle || 'Untitled',
                        overview: tmdbData.overview || '',
                        poster_path: tmdbData.poster_path || '',
                        backdrop_path: tmdbData.backdrop_path || '',
                        genres: Array.isArray(tmdbData.genres) ? tmdbData.genres.map((g) => (g.name ? g.name : g)) : [],
                        casts: Array.isArray(tmdbCredits.cast) ? tmdbCredits.cast.slice(0, 5).map((c) => ({
                            id: String(c.id),
                            name: c.name,
                            role: c.character || 'Role',
                            image: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path.startsWith('/') ? '' : '/'}${c.profile_path}` : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
                        })) : [],
                        release_date: tmdbData.release_date || '',
                        original_language: tmdbData.original_language || 'en',
                        tagline: tmdbData.tagline || '',
                        vote_average: tmdbData.vote_average || 0,
                        runtime: tmdbData.runtime || 0
                    });
                }
            }
        }

        // If movie exists in DB but has no poster (from old broken saves), patch it from TMDB
        if (movie && (!movie.poster_path || movie.poster_path === '/images/placeholder.png') && resolvedMovieTitle) {
            try {
                const searchResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
                    params: { api_key: process.env.TMDB_API_KEY, query: resolvedMovieTitle, page: 1 },
                });
                const firstResult = searchResponse.data.results?.[0];
                if (firstResult) {
                    const tmdbId = firstResult.id;
                    const [detailsRes, creditsRes] = await Promise.all([
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, { params: { api_key: process.env.TMDB_API_KEY } }),
                        axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, { params: { api_key: process.env.TMDB_API_KEY } }),
                    ]);
                    const d = detailsRes.data;
                    await Movie.findByIdAndUpdate(movie._id, {
                        poster_path: d.poster_path || movie.poster_path,
                        backdrop_path: d.backdrop_path || movie.backdrop_path,
                        genres: d.genres?.map(g => g.name) || movie.genres,
                        casts: Array.isArray(creditsRes.data.cast) ? creditsRes.data.cast.slice(0, 5).map(c => ({
                            id: String(c.id),
                            name: c.name,
                            role: c.character || 'Role',
                            image: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path.startsWith('/') ? '' : '/'}${c.profile_path}` : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
                        })) : movie.casts,
                        runtime: d.runtime || movie.runtime,
                        vote_average: d.vote_average || movie.vote_average,
                        overview: d.overview || movie.overview,
                        release_date: d.release_date || movie.release_date,
                    });
                    // Reload updated movie
                    movie = await Movie.findById(movie._id);
                }
            } catch (patchErr) {
                console.warn('Could not patch movie poster from TMDB:', patchErr.message);
            }
        }

        const showToCreate = [];
        showInput.forEach((show) => {
            const showDate = show.date;
            const times = normalizeShowTimes(show);
            times.forEach((time) => {
                if (!showDate || !time) return;
                const showDateTime = parseShowDateTime(showDate, time);
                if (!showDateTime) return;
                showToCreate.push({ movie: movie._id, showDateTime, hall: hall || 'Hall 01', showPrice: normalizedShowPrice, occupiedSeats: [] });
            });
        });

        if (showToCreate.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid show times found in showInput' });
        }

        const runtimeMinutes = movie.runtime || 120;
        
        // 1. Check for self-overlaps within the request
        for (let i = 0; i < showToCreate.length; i++) {
            const start1 = new Date(showToCreate[i].showDateTime);
            const end1 = new Date(start1.getTime() + runtimeMinutes * 60000);
            for (let j = i + 1; j < showToCreate.length; j++) {
                const start2 = new Date(showToCreate[j].showDateTime);
                const end2 = new Date(start2.getTime() + runtimeMinutes * 60000);
                if (showToCreate[i].hall === showToCreate[j].hall && start1 < end2 && end1 > start2) {
                    return res.status(400).json({ success: false, message: 'The provided show times overlap with each other.' });
                }
            }
        }
        
        // 2. Check against database for overlaps in the same hall
        for (const show of showToCreate) {
            const start = new Date(show.showDateTime);
            const end = new Date(start.getTime() + runtimeMinutes * 60000);
            
            const overlappingShows = await Show.find({
                hall: show.hall,
                showDateTime: {
                    $gte: new Date(start.getTime() - 240 * 60000), // Check shows starting up to 4 hours before
                    $lte: new Date(start.getTime() + 240 * 60000)  // And up to 4 hours after
                }
            }).populate('movie');
            
            for (const overlappingShow of overlappingShows) {
                const existingStart = new Date(overlappingShow.showDateTime);
                const existingRuntime = overlappingShow.movie?.runtime || 120;
                const existingEnd = new Date(existingStart.getTime() + existingRuntime * 60000);
                
                if (start < existingEnd && end > existingStart) {
                    const timeStr = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                    return res.status(400).json({ 
                        success: false, 
                        message: `Cannot add show at ${timeStr}. ${show.hall} is already occupied by '${overlappingShow.movie?.title || 'another movie'}'.` 
                    });
                }
            }
        }

        await Show.insertMany(showToCreate);
        res.json({ success: true, message: 'Show added successfully' });
    } catch (error) {
        console.error('Add show error:', error.response?.status, error.response?.data || error.message || error);
        res.status(500).json({ success: false, message: 'Failed to add show', error: error.response?.data || error.message || String(error) });
    }
}

//API get all shows from the database
export const getAllShows = async (req, res) => {
    try {
        const upcomingOnly = String(req.query.upcoming || 'false').toLowerCase() === 'true';
        const filter = upcomingOnly ? { showDateTime: { $gte: new Date() } } : {};
        const shows = await Show.find(filter).populate('movie').sort({ showDateTime: 1 });
        res.json({ success: true, shows });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

//Api get a single show from the database
export const getShow = async (req, res) => {
    try {
        const { movieId } = req.params;

        const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });
        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split('T')[0];
            if (!dateTime[date]) {
                dateTime[date] = [];
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id });
        });

        res.json({ success: true, movie, shows, dateTime });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API to delete a show by ID (Admin only)
export const deleteShow = async (req, res) => {
    try {
        const { showId } = req.params;
        const deleted = await Show.findByIdAndDelete(showId);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Show not found' });
        }
        res.json({ success: true, message: 'Show deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
