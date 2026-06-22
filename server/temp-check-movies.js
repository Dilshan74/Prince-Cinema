import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './configs/db.js';
import Movie from './models/movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const run = async () => {
  try {
    await connectDB();
    const movies = await Movie.find({ _id: { $in: ['1', '2', '3', '4'] } }).lean();
    console.log(JSON.stringify(movies, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};

run();