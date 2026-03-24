import dotenv from 'dotenv';
import { connectDB } from './src/db/index.js';
import { app } from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 MediTrack Backend Server running on port ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  });
}).catch((error) => {
  console.error('❌ Failed to connect to database:', error);
  process.exit(1);
});
