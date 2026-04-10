import express from 'express';
import { Employee } from '../models/Employee.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// GET all employees
router.get('/', verifyToken, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one employee
router.get('/:id', verifyToken, async (req, res) => {
    try {
        // Try finding by custom id first, then _id
        let employee = await Employee.findOne({ id: req.params.id });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create employee
router.post('/', verifyToken, async (req, res) => {
    const employee = new Employee(req.body);
    try {
        if (!employee.id) {
            employee.id = Date.now().toString();
        }
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE employee
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
        res.json(updatedEmployee);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE employee
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Employee.findOneAndDelete({ id: req.params.id });
        if (!deleted) return res.status(404).json({ message: 'Employee not found' });
        res.json({ message: 'Employee deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
