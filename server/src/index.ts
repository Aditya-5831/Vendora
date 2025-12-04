import express from 'express';
import { ENV } from './config/env.js';

// Configuration
const app = express();

// Server is running on port 5000   
app.listen(ENV.PORT, () => console.log(`Server is running on port ${ENV.PORT}`));