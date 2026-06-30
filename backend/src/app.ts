import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { setupSwagger } from './config/swagger.js';
import { loggerMiddleware } from './middleware/logger.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, CustomError } from './middleware/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './modules/auth/auth.routes.js';
import movieRoutes from './modules/movies/movie.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Setup Middlewares
app.use(helmet());
app.use(
  cors({
    origin: '*', // Adjust origins as necessary in production
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Apply rate limiter to all API endpoints
app.use('/api', apiRateLimiter);

// Register routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Setup Swagger API Docs
setupSwagger(app);

// 404 handler
app.use((req, res, next) => {
  next(new CustomError(`Route not found - ${req.originalUrl}`, 404));
});

// Centralized error handler
app.use(errorHandler);

// Bootstrap servers
const bootstrap = async () => {
  console.log('Bootstrapping Netflix Clone Pro Backend...');
  
  // Establish connections
  await connectDB();
  connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Fatal error during startup bootstrap:', error);
  process.exit(1);
});

export default app;
