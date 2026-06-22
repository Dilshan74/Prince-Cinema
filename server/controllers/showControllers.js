import axios from 'axios';
import Movie from '../models/movie.js';
import Show from '../models/show.js';

export const getNowPlayingMovies = async (req, res) => {
    try {
        // Default: return the local admin now-playing list so Admin UI and Postman match.
        // Use `?source=tmdb` to fetch live TMDB data instead.
        if (String(req.query.source || '').toLowerCase() === 'tmdb') {
            const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
                params: { api_key: process.env.TMDB_API_KEY, page: 1 }
            });
            return res.json({ success: true, movies: data.results });
        }

        const localMovies = [
            {
                adult: false,
                backdrop_path: null,
                genre_ids: [],
                id: 1,
                title: 'Deadpool & Wolverine',
                original_language: 'en',
                overview: 'Deadpool teams up with Wolverine for a chaotic multiverse mission packed with sharp humor and brutal action.',
                popularity: 0,
                poster_path: null,
                release_date: '2024-01-01',
                video: false,
                vote_average: 7.6,
                vote_count: 1,
            },
            {
                adult: false,
                backdrop_path: null,
                genre_ids: [],
                id: 2,
                title: 'Avatar: The Way of Water',
                original_language: 'en',
                overview: 'Jake Sully and Neytiri fight to protect their family as the oceans of Pandora reveal new allies and dangers.',
                popularity: 0,
                poster_path: null,
                release_date: '2022-12-16',
                video: false,
                vote_average: 7.6,
                vote_count: 1,
            },
            {
                adult: false,
                backdrop_path: null,
                genre_ids: [],
                id: 3,
                title: 'Kung Fu Panda 4',
                original_language: 'en',
                overview: 'Po faces a shape-shifting villain while searching for the next Dragon Warrior.',
                popularity: 0,
                poster_path: null,
                release_date: '2024-01-01',
                video: false,
                vote_average: 6.9,
                vote_count: 1,
            },
            {
                adult: false,
                backdrop_path: null,
                genre_ids: [],
                id: 4,
                title: 'Mission: Impossible - Dead Reckoning Part One',
                original_language: 'en',
                overview: 'Ethan Hunt races across the globe to stop a dangerous intelligence threat.',
                popularity: 0,
                poster_path: null,
                release_date: '2023-07-12',
                video: false,
                vote_average: 7.7,
                vote_count: 1,
            },
        ];

        return res.json({ success: true, movies: localMovies });
    } catch (error) {
        console.error('Now-playing Error:', error.response?.status, error.response?.data || error.message);
        return res.json({ success: false, message: 'Failed to fetch now playing movies', error: error.response?.data || error.message });
    }
}

//API to add a new show to the database
export const addShow = async (req, res) => {
    try {
        const { movieID, showInput, showPrice } = req.body;
        let movie = await Movie.findById(movieID);
        if (!movie) {
            //Fetch movie details from TMDB API if not found in database
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieID}`, {
                    params: {
                        api_key: process.env.TMDB_API_KEY
                    }
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieID}/credits`, {
                    params: {
                        api_key: process.env.TMDB_API_KEY
                    }
                })

            ]);

            const movieData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;
            
            const movieDetails = {
                _id: movieID,
                title: movieData.title,
                overview: movieData.overview,
                poster_path: movieData.poster_path,
                backdrop_path: movieData.backdrop_path,
                genres: movieData.genres,
                casts: movieCreditsData.cast,
                release_date: movieData.release_date,
                original_language: movieData.original_language,
                tagline: movieData.tagline || '',
                vote_average: movieData.vote_average,
                runtime: movieData.runtime
            };

            
            //Add the movie to the database
            movie = await Movie.create(movieDetails);

        }

        //Create a new show
        const showToCreate = [];
        showInput.forEach((show) => {
           const showDate  = show.date;
           show.times.forEach((time) => {
                const dateTimeString = `${showDate}T${time}:00`;
                showToCreate.push({ movie: movie._id, showDateTime: new Date(dateTimeString), showPrice, occupiedSeats: [] });
            });
        });

        if (showToCreate.length > 0) {
            await Show.insertMany(showToCreate);
        }

        res.json({ success: true, message: 'Show added successfully' });


    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to add show' })
    }
}