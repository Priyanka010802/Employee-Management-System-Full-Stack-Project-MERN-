import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    id: String,
    name: String,
    role: String,
    department: String,
    email: String,
    phone: String
}, { _id: false });

const taskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    projectTitle: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    assignDate: { type: String },
    finishDate: { type: String },
    priority: { type: String, enum: ['High', 'Normal', 'Low'], default: 'Normal' },
    status: { type: String, enum: ['in-progress', 'completed', 'pending'], default: 'pending' },
    progress: { type: Number, default: 0 },
    team: [teamMemberSchema],
    time: { type: String }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
