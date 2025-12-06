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
app.get("/api/inngest", serve({ client: inngest, functions }))


// Routes
app.get("/health", (req, res) => {
    res.send({ success: true })
})

// Server is running on port 5000   
app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));