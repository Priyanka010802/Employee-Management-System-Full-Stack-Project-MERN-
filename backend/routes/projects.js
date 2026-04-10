// routes/projects.js
import express from 'express';
import { Project } from '../models/Project.js';
import mongoose from 'mongoose';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Manual validation middleware
const validateProject = (req, res, next) => {
    const {
        title, description, department, status, priority, startDate, endDate,
        budget, progress, manager, tags
    } = req.body;

    // Required: title (3-100 chars)
    if (!title || !title.trim() || title.trim().length < 3 || title.trim().length > 100) {
        return res.status(400).json({
            message: 'Project title is required and must be 3-100 characters'
        });
    }

    // Optional: description (max 1000 chars)
    if (description && description.length > 1000) {
        return res.status(400).json({
            message: 'Description cannot exceed 1000 characters'
        });
    }

    // Required: department (valid ObjectId)
    if (!department || !mongoose.Types.ObjectId.isValid(department)) {
        return res.status(400).json({
            message: 'Valid department ID is required'
        });
    }

    // Optional: status
    const validStatuses = ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
            message: `Status must be one of: ${validStatuses.join(', ')}`
        });
    }

    // Optional: priority
    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    if (priority && !validPriorities.includes(priority)) {
        return res.status(400).json({
            message: `Priority must be one of: ${validPriorities.join(', ')}`
        });
    }

    // Required: startDate (valid ISO date)
    if (!startDate || isNaN(Date.parse(startDate))) {
        return res.status(400).json({
            message: 'Valid start date is required'
        });
    }

    // Required: endDate (valid ISO date)
    if (!endDate || isNaN(Date.parse(endDate))) {
        return res.status(400).json({
            message: 'Valid end date is required'
        });
    }

    // Optional: budget (positive number)
    if (budget !== undefined && (isNaN(budget) || budget < 0)) {
        return res.status(400).json({
            message: 'Budget must be a positive number'
        });
    }

    // Optional: progress (0-100)
    if (progress !== undefined && (isNaN(progress) || progress < 0 || progress > 100)) {
        return res.status(400).json({
            message: 'Progress must be between 0 and 100'
        });
    }

    // Optional: manager validation
    if (manager) {
        if (manager.name) req.body.manager.name = manager.name.trim();
        if (manager.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manager.email)) {
            return res.status(400).json({
                message: 'Invalid manager email'
            });
        }
    }

    // Optional: tags (array of strings)
    if (tags && !Array.isArray(tags)) {
        return res.status(400).json({
            message: 'Tags must be an array'
        });
    }
    if (tags && tags.some(tag => typeof tag !== 'string')) {
        return res.status(400).json({
            message: 'Each tag must be a string'
        });
    }

    // Trim title and description
    req.body.title = title.trim();
    if (description) req.body.description = description.trim();

    next();
};

// GET all projects with filters and search
router.get('/', verifyToken, async (req, res) => {
    try {
        const { status, priority, department, search } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (department) filter.department = department;

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'manager.name': { $regex: search, $options: 'i' } }
            ];
        }

        const projects = await Project.find(filter)
            .populate('department', 'name code')
            .sort({ createdAt: -1 })
            .select('-__v');

        // Calculate statistics
        const stats = {
            total: projects.length,
            planned: projects.filter(p => p.status === 'Planned').length,
            inProgress: projects.filter(p => p.status === 'In Progress').length,
            onHold: projects.filter(p => p.status === 'On Hold').length,
            completed: projects.filter(p => p.status === 'Completed').length,
            cancelled: projects.filter(p => p.status === 'Cancelled').length,
            lowPriority: projects.filter(p => p.priority === 'Low').length,
            mediumPriority: projects.filter(p => p.priority === 'Medium').length,
            highPriority: projects.filter(p => p.priority === 'High').length,
            criticalPriority: projects.filter(p => p.priority === 'Critical').length,
            totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
            averageProgress: projects.length > 0
                ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
                : 0
        };

        res.json({ projects, stats });
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({
            message: 'Failed to fetch projects',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// GET single project by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('department', 'name code manager location')
            .select('-__v');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error('Error fetching project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: 'Failed to fetch project' });
    }
});

// POST create new project
router.post('/', verifyToken, validateProject, async (req, res) => {
    try {
        // Validate dates (endDate > startDate)
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        if (endDate < startDate) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const project = new Project(req.body);
        const savedProject = await project.save();

        // Populate department info
        const populatedProject = await Project.findById(savedProject._id)
            .populate('department', 'name code')
            .select('-__v');

        res.status(201).json({
            message: 'Project created successfully',
            project: populatedProject
        });
    } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Failed to create project' });
    }
});

// PUT update project
router.put('/:id', verifyToken, validateProject, async (req, res) => {
    try {
        // Validate dates (endDate > startDate)
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        if (endDate < startDate) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        )
            .populate('department', 'name code')
            .select('-__v');

        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({
            message: 'Project updated successfully',
            project: updated
        });
    } catch (err) {
        console.error('Error updating project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: 'Failed to update project' });
    }
});

// DELETE project
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Project deleted successfully',
            project: { id: project._id, title: project.title }
        });
    } catch (err) {
        console.error('Error deleting project:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid project ID' });
        }
        res.status(500).json({ message: 'Failed to delete project' });
    }
});

// PATCH update project status
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        )
            .populate('department', 'name code')
            .select('-__v');

        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({
            message: `Project status updated to ${status}`,
            project: updated
        });
    } catch (err) {
        console.error('Error updating project status:', err);
        res.status(500).json({ message: 'Failed to update project status' });
    }
});

// PATCH update project progress
router.patch('/:id/progress', verifyToken, async (req, res) => {
    try {
        const { progress } = req.body;

        if (progress < 0 || progress > 100) {
            return res.status(400).json({ message: 'Progress must be between 0 and 100' });
        }

        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { progress, updatedAt: Date.now() },
            { new: true }
        )
            .select('-__v');

        if (!updated) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({
            message: `Project progress updated to ${progress}%`,
            project: updated
        });
    } catch (err) {
        console.error('Error updating project progress:', err);
        res.status(500).json({ message: 'Failed to update project progress' });
    }
});

export default router;
