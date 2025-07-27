// ✅ Importing required modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import ProductRouter from './routes/ProductRoute.js';

// ✅ Load env variables
dotenv.config();

// ✅ Connect DB
connectToDatabase();

// ✅ Init app
const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', ProductRouter);

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
