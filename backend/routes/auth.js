import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Employee } from '../models/Employee.js';
import { Admin } from '../models/Admin.js';
import { Session } from '../models/Misc.js';
import { Attendance } from '../models/GoalsAndAttendance.js';

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key_123';

// Unified Login Route
router.post('/login', async (req, res) => {
    let { email, password, role } = req.body; // role: 'admin' | 'employee' | 'hr'
    email = email?.trim();
    password = password?.trim();

    try {
        console.log(`Login attempt: email='${email}', role='${role}'`);

        // HARDCODED BYPASS for Project Demo (Ensures admin@gmail.com ALWAYS valid)
        if (email === 'admin@gmail.com' && password === 'admin123') {
            const token = jwt.sign(
                { id: 'admin_master', email: 'admin@gmail.com', role: role },
                SECRET_KEY,
                { expiresIn: '24h' }
            );
            return res.json({
                success: true,
                token,
                user: { id: 'admin_master', name: 'Administrator', email: 'admin@gmail.com', role: role }
            });
        }

        let user;
        if (role === 'admin' || role === 'hr') {
            if (role === 'admin') {
                user = await Admin.findOne({ email });
            } else {
                // For HR, check Employee first (legacy) then Admin fallback
                user = await Employee.findOne({ email });
                if (!user) user = await Admin.findOne({ email });
            }
        } else {
            // Flexible Lookup for Employees
            user = await Employee.findOne({
                $or: [
                    { email: email },
                    { email: email.includes('@') ? email : `${email}@company.com` },
                    { id: email },
                    { name: new RegExp(`^${email}$`, 'i') },
                    { employeeName: new RegExp(`^${email}$`, 'i') }
                ]
            });
            console.log('Lookup result:', user ? `Found (${user.email})` : 'Not Found');
        }

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify Password
        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        const isLegacyValid = user.password === password;

        if (!isPasswordValid && !isLegacyValid) {
            console.log(`Password mismatch for ${user.email}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Automatic Attendance Punch-In for Employees
        if (role === 'employee' || (role === 'hr' && user.email)) {
            const today = new Date().toISOString().split('T')[0];
            const existingAttendance = await Attendance.findOne({
                employeeEmail: user.email,
                date: today
            });

            if (!existingAttendance) {
                const now = new Date();
                const punchIn = new Attendance({
                    id: `ATT-${Date.now()}`,
                    employeeEmail: user.email,
                    date: today,
                    status: 'Present',
                    checkIn: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                    checkOut: '--:--',
                    updatedAt: now
                });
                await punchIn.save();
                console.log(`Auto Punch-In for ${user.email}`);
            }
        }

        // Create Token
        const token = jwt.sign(
            { id: user.id || user._id, email: user.email, role: role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Create Session Record
        const session = new Session({
            id: Date.now().toString(),
            email: user.email,
            loginAt: new Date()
        });
        await session.save();

        res.json({
            token,
            user: {
                id: user.id || user._id,
                name: user.name || user.employeeName,
                email: user.email,
                role: role
            },
            sessionId: session.id
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
