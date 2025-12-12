import "dotenv/config"

import express from 'express';
import { ENV } from './config/env.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { functions, inngest } from './config/inngest.js';
import adminRoutes from './modules/admin/admin.routes.js'
import userRoutes from './modules/user/user.routes.js'
import orderRoutes from './modules/order/order.routes.js'
import { errorHandler } from "./middlewares/error.middleware.js";




// Configuration
const app = express();


// Middlewares
app.use(express.json())
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions }))

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);


// Error handler middleware
app.use(errorHandler);

// Server is running on port 5000   
app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));