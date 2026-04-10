import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    address: { type: String, default: '' },
    salary: { type: Number, default: 0 },
    department: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, default: '' },
    empCode: { type: String, default: '' },
    hireDate: { type: String, default: '' },
    // Additional fields found in some records
    employeeName: String,
    position: String,
    jobTitle: String,
    designation: String,
    division: String,
    departmentName: String,
    emailAddress: String,
    phone: String,
    phoneNumber: String,
    mobile: String
}, { timestamps: true });

export const Employee = mongoose.model('Employee', employeeSchema);
