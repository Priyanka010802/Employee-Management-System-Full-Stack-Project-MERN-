import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    name: { type: String, default: 'Admin' }
}, { timestamps: true });

export const Admin = mongoose.model('Admin', adminSchema);
