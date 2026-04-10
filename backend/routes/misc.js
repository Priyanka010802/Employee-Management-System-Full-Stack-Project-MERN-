import express from 'express';
import { Attendance, Goal, Report } from '../models/GoalsAndAttendance.js';
import { Session, Message } from '../models/Misc.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const createCrud = (Model, pathName) => {
    router.get(`/${pathName}`, verifyToken, async (req, res) => {
        try {
            const items = await Model.find();
            res.json(items);
        } catch (err) { res.status(500).json({ message: err.message }); }
    });

    router.post(`/${pathName}`, verifyToken, async (req, res) => {
        const item = new Model(req.body);
        try {
            if (!item.id) item.id = Date.now().toString();

            const newItem = await item.save();
            res.status(201).json(newItem);
        } catch (err) { res.status(400).json({ message: err.message }); }
    });

    router.put(`/${pathName}/:id`, verifyToken, async (req, res) => {
        try {
            const updated = await Model.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
            res.json(updated);
        } catch (err) { res.status(400).json({ message: err.message }); }
    });

    router.delete(`/${pathName}/:id`, verifyToken, async (req, res) => {
        try {
            await Model.findOneAndDelete({ id: req.params.id });
            res.json({ message: 'Deleted' });
        } catch (err) { res.status(500).json({ message: err.message }); }
    });
};

createCrud(Attendance, 'attendance');
createCrud(Goal, 'goals');
createCrud(Report, 'reports');
createCrud(Message, 'messages');
createCrud(Session, 'sessions');

export default router;
