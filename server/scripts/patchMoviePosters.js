/**
 * Run this script ONCE to patch movies in MongoDB that have empty poster_path.
 * Usage: node --env-file=.env scripts/patchMoviePosters.js
 */
import mongoose from 'mongoose';
import axios from 'axios';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prince-cinema';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const movieSchema = new mongoose.Schema({
  _id: String,
  title: String,
  poster_path: String,
  backdrop_path: String,
  overview: String,
  release_date: String,
  original_language: String,
  vote_average: Number,
  runtime: Number,
  genres: [String],
  casts: mongoose.Schema.Types.Mixed,
  tagline: String,
}, { strict: false });

const Movie = mongoose.model('Movie', movieSchema);

async function patchPosters() {
  try {
    // Connect to DB
    let uri = MONGODB_URI;
    const hasDb = /mongodb(?:\+srv)?:\/\/.+?\/.+/.test(uri);
    if (!hasDb) {
      uri = uri.includes('/?') ? uri.replace('/?', '/prince-cinema?') : `${uri.replace(/\/?$/, '')}/prince-cinema`;
    }
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 15000 });
    console.log('✓ Connected to MongoDB');

    // Find movies with no poster
    const movies = await Movie.find({
      $or: [
        { poster_path: '' },
        { poster_path: null },
        { poster_path: '/images/placeholder.png' },
        { poster_path: { $exists: false } }
      ]
    });

    console.log(`Found ${movies.length} movies without posters. Patching...`);

    for (const movie of movies) {
      try {
        console.log(`  Searching TMDB for: "${movie.title}"`);
        const searchRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
          params: { api_key: TMDB_API_KEY, query: movie.title, page: 1 }
        });
        const result = searchRes.data.results?.[0];
        if (!result) {
          console.log(`  ✗ Not found on TMDB: "${movie.title}"`);
          continue;
        }
        
        const [detailsRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${result.id}`, { params: { api_key: TMDB_API_KEY } }),
          axios.get(`https://api.themoviedb.org/3/movie/${result.id}/credits`, { params: { api_key: TMDB_API_KEY } }),
        ]);

        const d = detailsRes.data;
        const casts = Array.isArray(creditsRes.data.cast)
          ? creditsRes.data.cast.slice(0, 5).map(c => ({
              id: String(c.id),
              name: c.name,
              role: c.character || 'Role',
              image: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path.startsWith('/') ? '' : '/'}${c.profile_path}` : '',
            }))
          : movie.casts;

        await Movie.findByIdAndUpdate(movie._id, {
          poster_path: d.poster_path || movie.poster_path,
          backdrop_path: d.backdrop_path || movie.backdrop_path,
          overview: d.overview || movie.overview,
          genres: d.genres?.map(g => g.name) || movie.genres,
          runtime: d.runtime || movie.runtime,
          vote_average: d.vote_average || movie.vote_average,
          release_date: d.release_date || movie.release_date,
          tagline: d.tagline || movie.tagline,
          casts,
        });

        console.log(`  ✓ Patched "${movie.title}" → poster: ${d.poster_path}`);
        await new Promise(r => setTimeout(r, 300)); // Rate limit
      } catch (err) {
        console.error(`  ✗ Error patching "${movie.title}":`, err.message);
      }
    }

    console.log('\n✓ Done patching movie posters.');
  } catch (err) {
    console.error('Fatal error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

patchPosters();
