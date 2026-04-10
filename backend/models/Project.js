// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Project title is required'],
        trim: true
    },
    description: { 
        type: String, 
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department',
        required: [true, 'Department is required']
    },
    status: { 
        type: String, 
        enum: ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'], 
        default: 'Planned'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    startDate: { 
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: { 
        type: Date,
        required: [true, 'End date is required']
    },
    budget: {
        type: Number,
        default: 0,
        min: 0
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    manager: {
        name: String,
        email: String
    },
    teamMembers: [{
        name: String,
        role: String,
        email: String
    }],
    tags: [{
        type: String,
        trim: true
    }],
    attachments: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
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
projectSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Auto-calculate progress based on status
projectSchema.pre('save', function(next) {
    const statusProgress = {
        'Planned': 0,
        'In Progress': 50,
        'On Hold': 30,
        'Completed': 100,
        'Cancelled': 0
    };
    
    if (this.isModified('status') && !this.isModified('progress')) {
        this.progress = statusProgress[this.status] || 0;
    }
    next();
});

// Validate end date is after start date
projectSchema.pre('save', function(next) {
    if (this.endDate && this.startDate && this.endDate < this.startDate) {
        next(new Error('End date must be after start date'));
    } else {
        next();
    }
});

export const Project = mongoose.model('Project', projectSchema);