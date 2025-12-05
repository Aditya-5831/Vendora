import express from 'express';
import { ENV } from './config/env.js';
import { clerkMiddleware } from '@clerk/express'

// Configuration
const app = express();


// Middlewares
app.use(clerkMiddleware())

// Server is running on port 5000   
app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));