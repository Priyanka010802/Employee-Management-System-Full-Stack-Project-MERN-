import mongoose from 'mongoose';

// Session Schema (for login tracking)
const sessionSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // Using String ID to match usage or MongoDB _id
    email: { type: String, required: true },
    loginAt: { type: Date, default: Date.now },
    logoutAt: { type: Date }
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    from: String,
    to: String,
    text: String,
    time: String
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
