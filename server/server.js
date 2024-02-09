import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoute.js';
import messageRoutes from './routes/MessageRoute.js';
import userRoutes from './routes/UserRoute.js';
import connectToMongoDB from './db/connectToMongoDB.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);