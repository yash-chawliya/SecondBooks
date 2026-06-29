import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Mount Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', bookRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', reviewRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', contactRoutes);
app.use('/api', otpRoutes);

export default app;
