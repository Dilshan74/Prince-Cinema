import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const TITLES_TO_DELETE = ['Colony', 'Backrooms', 'The Guilty'];

const movieSchema = new mongoose.Schema({ _id: String, title: String }, { strict: false });
const showSchema = new mongoose.Schema({ movie: String }, { strict: false });
const Movie = mongoose.model('Movie', movieSchema);
const Show = mongoose.model('Show', showSchema);

async function cleanup() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const title of TITLES_TO_DELETE) {
        // Find all movies matching this title (case-insensitive)
        const movies = await Movie.find({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        
        for (const movie of movies) {
            const deletedShows = await Show.deleteMany({ movie: String(movie._id) });
            console.log(`Deleted ${deletedShows.deletedCount} shows for "${movie.title}" (ID: ${movie._id})`);
            await Movie.deleteOne({ _id: movie._id });
            console.log(`Deleted movie "${movie.title}"`);
        }

        if (movies.length === 0) {
            console.log(`No DB record found for "${title}" — may only be in localStorage`);
        }
    }

    await mongoose.disconnect();
    console.log('\nDone! Now clear localStorage in the browser:');
    console.log('Open DevTools → Console → paste:');
    console.log(`
const shows = JSON.parse(localStorage.getItem('scheduledShows') || '[]');
const filtered = shows.filter(s => !['colony','backrooms','the guilty'].includes(s.movie?.toLowerCase().trim()));
localStorage.setItem('scheduledShows', JSON.stringify(filtered));
console.log('Removed', shows.length - filtered.length, 'shows from localStorage');
location.reload();
    `);
}

cleanup().catch(err => { console.error(err); process.exit(1); });
