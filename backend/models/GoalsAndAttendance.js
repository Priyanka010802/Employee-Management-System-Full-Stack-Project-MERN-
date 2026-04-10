import mongoose from 'mongoose';

// Goal Schema
const goalSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    employeeName: String,
    role: String,
    department: String,
    avatar: String,
    yearlyTarget: String,
    kpis: [String],
    progress: Number,
    achievements: [String],
    isEmployeeOfYear: Boolean
}, { timestamps: true });

export const Goal = mongoose.model('Goal', goalSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    employeeEmail: String,
    date: String,
    status: String,
    checkIn: String,
    checkOut: String,
    updatedAt: { type: Date }
}, { timestamps: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);

// Report Schema
const reportSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    type: String,
    createdOn: String
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
