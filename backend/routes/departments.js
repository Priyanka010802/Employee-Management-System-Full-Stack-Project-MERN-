// routes/departments.js
import express from 'express';
import { Department } from '../models/Department.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Manual validation function
const validateDepartment = (req, res, next) => {
    const {
        name, code, description, location, floor, budget, projectsCount,
        status, email, phone, establishedDate
    } = req.body;

    // Handle nested manager object or flat manager fields
    const manager = req.body.manager || {};
    const managerName = manager.name || req.body['manager.name'];
    const managerEmail = manager.email || req.body['manager.email'];
    const managerPhone = manager.phone || req.body['manager.phone'];

    // Required: name (2-50 chars)
    if (!name || !name.trim() || name.trim().length < 2 || name.trim().length > 50) {
        return res.status(400).json({
            message: 'Department name is required and must be 2-50 characters'
        });
    }

    // Optional: code (2-4 uppercase letters + optional numbers)
    if (code && !/^[A-Z]{2,4}\d{0,3}$/.test(code)) {
        return res.status(400).json({
            message: 'Code must be 2-4 uppercase letters followed by optional numbers'
        });
    }

    // Optional: description (max 500 chars)
    if (description && description.length > 500) {
        return res.status(400).json({
            message: 'Description cannot exceed 500 characters'
        });
    }

    // Optional: manager fields
    if (managerName || managerEmail || managerPhone) {
        req.body.manager = {
            name: managerName ? managerName.trim() : undefined,
            email: managerEmail,
            phone: managerPhone ? managerPhone.trim() : undefined
        };
    }

    // Optional: manager.email (valid email)
    if (managerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerEmail)) {
        return res.status(400).json({
            message: 'Please enter a valid email for manager'
        });
    }

    // Optional: location (trim)
    if (location) {
        req.body.location = location.trim();
    }

    // Optional: floor (trim)
    if (floor) {
        req.body.floor = floor.trim();
    }

    // Optional: budget (positive number)
    if (budget !== undefined && (isNaN(budget) || budget < 0)) {
        return res.status(400).json({
            message: 'Budget must be a positive number'
        });
    }

    // Optional: projectsCount (positive integer)
    if (projectsCount !== undefined && (!Number.isInteger(projectsCount) || projectsCount < 0)) {
        return res.status(400).json({
            message: 'Projects count must be a positive integer or zero'
        });
    }

    // Optional: status (active, inactive, archived)
    if (status && !['active', 'inactive', 'archived'].includes(status)) {
        return res.status(400).json({
            message: 'Status must be active, inactive, or archived'
        });
    }

    // Optional: email (valid email)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: 'Please enter a valid department email'
        });
    }

    // Optional: phone (trim)
    if (phone) {
        req.body.phone = phone.trim();
    }

    // Optional: establishedDate (ISO date)
    if (establishedDate && isNaN(Date.parse(establishedDate))) {
        return res.status(400).json({
            message: 'Please enter a valid date for established date'
        });
    }

    // Trim main name
    req.body.name = name.trim();
    next();
};

// GET all departments with optional filters
router.get('/', verifyToken, async (req, res) => {
    try {
        const { status, search } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { code: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { 'manager.name': { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const departments = await Department.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v');

        // Calculate statistics
        const stats = {
            total: departments.length,
            active: departments.filter(d => d.status === 'active').length,
            inactive: departments.filter(d => d.status === 'inactive').length,
            archived: departments.filter(d => d.status === 'archived').length,
            totalEmployees: departments.reduce((sum, d) => sum + (d.employeeCount || 0), 0),
            totalBudget: departments.reduce((sum, d) => sum + (d.budget || 0), 0),
            totalProjects: departments.reduce((sum, d) => sum + (d.projectsCount || 0), 0)
        };

        res.json({ departments, stats });
    } catch (err) {
        console.error('Error fetching departments:', err);
        res.status(500).json({
            message: 'Failed to fetch departments',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// POST create new department
router.post('/', verifyToken, validateDepartment, async (req, res) => {
    try {
        // Check if department with same name or code exists
        const existingDept = await Department.findOne({
            $or: [
                { name: req.body.name },
                { code: req.body.code }
            ]
        });

        if (existingDept) {
            return res.status(409).json({
                message: existingDept.name === req.body.name
                    ? 'Department with this name already exists'
                    : 'Department with this code already exists'
            });
        }

        const department = new Department(req.body);
        const savedDepartment = await department.save();

        res.status(201).json({
            message: 'Department created successfully',
            department: savedDepartment
        });
    } catch (err) {
        console.error('Error creating department:', err);
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Department with this name or code already exists' });
        }
        res.status(500).json({ message: 'Failed to create department' });
    }
});

// PUT update department
router.put('/:id', verifyToken, validateDepartment, async (req, res) => {
    try {
        // Check for duplicate name/code excluding current department
        const existingDept = await Department.findOne({
            _id: { $ne: req.params.id },
            $or: [
                { name: req.body.name },
                { code: req.body.code }
            ]
        });

        if (existingDept) {
            return res.status(409).json({
                message: existingDept.name === req.body.name
                    ? 'Another department with this name already exists'
                    : 'Another department with this code already exists'
            });
        }

        const updated = await Department.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!updated) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.json({
            message: 'Department updated successfully',
            department: updated
        });
    } catch (err) {
        console.error('Error updating department:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid department ID' });
        }
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Department with this name or code already exists' });
        }
        res.status(500).json({ message: 'Failed to update department' });
    }
});

// DELETE department
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        // Prevent deletion of departments with employees
        if (department.employeeCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete department with assigned employees. Please reassign employees first.'
            });
        }

        await Department.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Department deleted successfully',
            department: { id: department._id, name: department.name }
        });
    } catch (err) {
        console.error('Error deleting department:', err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid department ID' });
        }
        res.status(500).json({ message: 'Failed to delete department' });
    }
});

export default router;
