import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './enviroment';
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.mongoUri;
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;