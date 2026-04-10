import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Routes
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import adminRoutes from './routes/admins.js';
import taskRoutes from './routes/tasks.js';
import departmentRoutes from './routes/departments.js';
import projectRoutes from './routes/projects.js';
import recruitmentRoutes from './routes/recruitment.js';
import miscRoutes from './routes/misc.js';

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-management';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        const dbName = mongoose.connection.name;
        console.log(`Connected to MongoDB: ${dbName}`);
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Basic Rout
app.get('/', (req, res) => {
    res.send('Employee Management API is running');
});

// Mount Routes using a sub-router for Vercel /api proxy compatibility
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/employees', employeeRoutes);
apiRouter.use('/admins', adminRoutes);
apiRouter.use('/tasks', taskRoutes);
apiRouter.use('/departments', departmentRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/', recruitmentRoutes); // Handles /interviewCalls, /students, /companies
apiRouter.use('/', miscRoutes); // Handles /attendance, /goals, /reports, /messages, /sessions

// Apply it globally and onto /api
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Start Server locally
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
