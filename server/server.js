import './configs/env.js';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

console.log('Starting server...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('ADMIN_EMAIL loaded:', !!process.env.ADMIN_EMAIL);
console.log('showRoutes imported:', typeof showRoutes);

const app = express()
const PORT = process.env.PORT || 3000

await connectDB()

//Middleware
app.use(express.json())
app.use(cors())



//API routes
app.get('/', (req, res) => {
  res.send('Server is Live!')
})

app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/auth', authRoutes);
app.use('/api/show', showRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);


console.log('Routes registered');

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

