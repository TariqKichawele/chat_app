import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoute.js';
import messageRoutes from './routes/MessageRoute.js';
import userRoutes from './routes/UserRoute.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import path from 'path';
import { app, server }from './socket/socket.js';

dotenv.config();

const PORT = process.env.PORT || 3005;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`);
});

