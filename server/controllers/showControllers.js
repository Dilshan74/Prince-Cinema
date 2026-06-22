import axios from 'axios';
import Movie from '../models/movie.js';
import Show from '../models/show.js';

const LOCAL_MOVIES = [
    {
        _id: '1',
        adult: false,
        backdrop_path: '',
        genre_ids: [],
        title: 'Deadpool & Wolverine',
        original_language: 'en',
        overview: 'Deadpool teams up with Wolverine for a chaotic multiverse mission packed with sharp humor and brutal action.',
        popularity: 0,
        poster_path: '',
        release_date: '2024-01-01',
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
        backdrop_path: '',
        genre_ids: [],
        title: 'Avatar: The Way of Water',
        original_language: 'en',
        overview: 'Jake Sully and Neytiri fight to protect their family as the oceans of Pandora reveal new allies and dangers.',
        popularity: 0,
        poster_path: '',
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
        backdrop_path: '',
        genre_ids: [],
        title: 'Kung Fu Panda 4',
        original_language: 'en',
        overview: 'Po faces a shape-shifting villain while searching for the next Dragon Warrior.',
        popularity: 0,
        poster_path: '',
        release_date: '2024-01-01',
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
        backdrop_path: '',
        genre_ids: [],
        title: 'Mission: Impossible - Dead Reckoning Part One',
        original_language: 'en',
        overview: 'Ethan Hunt races across the globe to stop a dangerous intelligence threat.',
        popularity: 0,
        poster_path: '',
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
            const parsed = new Date(`${iso}T${rawTime}`);
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

        if (!effectiveMovieID) {
            return res.status(400).json({ success: false, message: 'movieID or movieTitle is required' });
        }

        movie = await Movie.findById(String(effectiveMovieID));

        if (!movie && localMovie) {
            movieData = {
                ...localMovie,
                poster_path: localMovie.poster_path || '/images/placeholder.png',
                backdrop_path: localMovie.backdrop_path || '/images/placeholder.png',
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
                let tmdbMovieId = effectiveMovieID;
                if (!resolvedMovieID && resolvedMovieTitle) {
                    const searchResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
                        params: {
                            api_key: process.env.TMDB_API_KEY,
                            query: resolvedMovieTitle,
                            page: 1,
                        },
                    });
                    const firstResult = Array.isArray(searchResponse.data.results) ? searchResponse.data.results[0] : null;
                    if (!firstResult) {
                        return res.status(404).json({ success: false, message: `Movie not found for title '${resolvedMovieTitle}'` });
                    }
                    tmdbMovieId = firstResult.id;
                }

                const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovieId}`, {
                        params: {
                            api_key: process.env.TMDB_API_KEY
                        }
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovieId}/credits`, {
                        params: {
                            api_key: process.env.TMDB_API_KEY
                        }
                    })
                ]);

                const movieData = movieDetailsResponse.data;
                const movieCreditsData = movieCreditsResponse.data;

                movie = await Movie.create({
                    _id: String(tmdbMovieId),
                    title: movieData.title || 'Untitled',
                    overview: movieData.overview || '',
                    poster_path: movieData.poster_path || '/images/placeholder.png',
                    backdrop_path: movieData.backdrop_path || '/images/placeholder.png',
                    genres: Array.isArray(movieData.genres) ? movieData.genres.map((g) => (g.name ? g.name : g)) : [],
                    casts: Array.isArray(movieCreditsData.cast) ? movieCreditsData.cast.map((cast) => cast.name) : [],
                    release_date: movieData.release_date || '',
                    original_language: movieData.original_language || 'en',
                    tagline: movieData.tagline || '',
                    vote_average: movieData.vote_average || 0,
                    runtime: movieData.runtime || 0
                });
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
                showToCreate.push({ movie: movie._id, showDateTime, showPrice: normalizedShowPrice, occupiedSeats: [] });
            });
        });

        if (showToCreate.length === 0) {
            return res.status(400).json({ success: false, message: 'No valid show times found in showInput' });
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
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate
        ('movie').sort({ showDateTime: 1 });

        //filter unique shows
        const uniqueShowsMap = new Set(shows.map((show) => show.movie));
        
        res.json({ success: true, shows: Array.from(uniqueShowsMap) });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'error.message' });
        

    }
}