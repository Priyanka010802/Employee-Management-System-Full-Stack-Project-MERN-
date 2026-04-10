// models/Department.js
import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Department name is required'],
        trim: true,
        unique: true
    },
    code: { 
        type: String, 
        required: [true, 'Department code is required'],
        uppercase: true,
        unique: true,
        match: [/^[A-Z]{2,4}\d{0,3}$/, 'Code must be 2-4 letters followed by optional numbers']
    },
    description: { 
        type: String, 
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    manager: {
        name: String,
        email: String,
        phone: String
    },
    location: {
        type: String,
        trim: true
    },
    floor: {
        type: String,
        trim: true
    },
    employeeCount: {
        type: Number,
        default: 0,
        min: 0
    },
    budget: {
        type: Number,
        default: 0,
        min: 0
    },
    projectsCount: {
        type: Number,
        default: 0,
        min: 0
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'archived'], 
        default: 'active' 
    },
    establishedDate: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    versionKey: false
});

// Update timestamp before save
departmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Auto-generate code if not provided
departmentSchema.pre('save', function(next) {
    if (!this.code && this.name) {
        const initials = this.name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 3);
        const randomNum = Math.floor(Math.random() * 90) + 10;
        this.code = `${initials}${randomNum}`;
    }
    next();
});

export const Department = mongoose.model('Department', departmentSchema);