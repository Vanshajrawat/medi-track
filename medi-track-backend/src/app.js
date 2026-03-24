import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Routes
import authRoutes from './routes/auth.routes.js';
import campRoutes from './routes/camp.routes.js';
import patientRoutes from './routes/patient.routes.js';
import medicineRoutes from './routes/medicine.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/camps', campRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/medicines', medicineRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'MediTrack Backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  const errors = err.errors || [];

  return res.status(statusCode).json({
    statusCode,
    message,
    errors,
    success: false,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Route not found',
    success: false,
  });
});

export { app };
