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
import addressRoutes from './routes/addressRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Mount Routes with proper API versioning and resource prefixes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/otp', otpRoutes);

export default app;
