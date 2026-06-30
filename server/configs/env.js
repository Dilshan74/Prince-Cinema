import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Go up one level from configs/ to the server root where .env lives
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
