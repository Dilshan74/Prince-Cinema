import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
//import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";


console.log('Starting server...');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

const app = express()
const PORT = process.env.PORT || 3000

await connectDB()

//Middleware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//API routes
app.get('/', (req, res) => {
  res.send('Server is Live!')
})

app.use('/api/inngest', serve({ client: inngest, functions }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

