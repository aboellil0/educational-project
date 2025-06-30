import server from './src/app';
import connectDB from './src/config/database';

// Connect to MongoDB
connectDB();
server();
