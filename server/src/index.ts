import express, { Request } from 'express';
import { ENV } from './config/env.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express'
import { functions, inngest } from './config/inngest.js';

// Configuration
const app = express();


// Middlewares
app.use(express.json())
app.use(clerkMiddleware())
app.use("/api/inngest", serve({ client: inngest, functions }))


// Routes

// Server is running on port 5000   
app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));