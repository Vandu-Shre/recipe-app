// server/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import recipeRoutes from './routes/recipeRoutes';
import ratingRoutes from './routes/ratingRoutes';
import { protect } from './middleware/authMiddleware';

// UPDATED: Import setupI18n and i18n from our new config file
import { setupI18n, i18n } from './config/i18nConfig';
import path from 'path'; // Still needed for i18nConfig, but not directly here anymore. You can remove if not used elsewhere.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// NEW: Call the setup function to configure i18n and get its middleware
const i18nMiddleware = setupI18n();


const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());

// NEW: Use the i18n middleware
app.use(i18nMiddleware);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(i18n.__('mongo_uri_not_defined')); // Using i18n here for consistency, need to add this key.
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log(i18n.__('mongodb_connected'))) // Using i18n here for consistency, need to add this key.
  .catch((err) => {
    console.error(i18n.__('mongodb_connection_error'), err); // Using i18n here for consistency, need to add this key.
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.send(res.__('welcome_message'));
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use recipe routes
app.use('/api/recipes', recipeRoutes);

// Use rating routes
app.use('/api/ratings', ratingRoutes);

// Protected route example
app.get('/api/protected', protect, (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({
      message: res.__('protected_route_access', req.user.username),
      userId: req.user._id,
      userEmail: req.user.email,
    });
  } else {
    res.status(500).json({ message: res.__('authenticated_user_not_found') });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(i18n.__('server_running', PORT.toString())); // Using i18n from the exported object
});