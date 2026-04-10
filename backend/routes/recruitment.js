import express from 'express';
import { InterviewCall, Student, Company, JobListing, InterviewSchedule, Offer, RecruitmentReport } from '../models/Recruitment.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Helper for CRUD
const createCrud = (Model, pathName) => {
    router.get(`/${pathName}`, verifyToken, async (req, res) => {
        try {
            const items = await Model.find();
            res.json(items);
        } catch (err) { res.status(500).json({ message: err.message }); }
    });

    router.get(`/${pathName}/:id`, verifyToken, async (req, res) => {
        try {
            const item = await Model.findOne({ id: req.params.id });
            if (!item) return res.status(404).json({ message: 'Not found' });
            res.json(item);
        } catch (err) { res.status(500).json({ message: err.message }); }
    });

    router.post(`/${pathName}`, verifyToken, async (req, res) => {
        const item = new Model(req.body);
        try {
            if (!item.id) item.id = Date.now(); // Simple ID gen
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

createCrud(InterviewCall, 'interviewCalls');
createCrud(Student, 'students');
createCrud(Company, 'companies');
createCrud(JobListing, 'jobListings');
createCrud(InterviewSchedule, 'interviewSchedules');
createCrud(Offer, 'offers');
createCrud(RecruitmentReport, 'recruitmentReports');

export default router;
