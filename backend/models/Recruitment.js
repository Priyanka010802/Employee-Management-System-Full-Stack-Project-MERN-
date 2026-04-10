import mongoose from 'mongoose';

// Interview Call Schema
const interviewCallSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    company: String,
    position: String,
    date: String,
    time: String,
    status: String,
    interviewer: String,
    location: String,
    notes: String,
    avatar: String,
    calls: Number,
    allStudents: Number,
    appliedStudents: Number,
    shortlistedStudents: Number,
    placedStudents: Number
}, { timestamps: true });

export const InterviewCall = mongoose.model('InterviewCall', interviewCallSchema);

// Student Schema
const studentSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: String,
    email: String,
    contact: String,
    course: String,
    company: String
}, { timestamps: true });

export const Student = mongoose.model('Student', studentSchema);

// Company Schema
const companySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: String,
    hrName: String,
    hrEmail: String,
    hrContact: String,
    location: String,
    platform: String,
    roles: String,
    status: String,
    companyHistory: String,
    applications: Number,
    shortlisted: Number,
    placed: Number
}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);

// Job Listing Schema
const jobListingSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: String,
    role: String,
    name: String,
    contact: String,
    email: String,
    gender: String,
    experience: String,
    count: String,
    status: String,
    applicants: Number
}, { timestamps: true });

export const JobListing = mongoose.model('JobListing', jobListingSchema);

// Interview Schedule Schema (from hrdata)
const interviewScheduleSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    role: String,
    title: String,
    candidateName: String,
    contact: String,
    email: String,
    date: String,
    time: String,
    status: String,
    applicants: Number
}, { timestamps: true });

export const InterviewSchedule = mongoose.model('InterviewSchedule', interviewScheduleSchema);

// Offer Schema
const offerSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    candidateName: String,
    email: String,
    position: String,
    company: String,
    offerDate: String,
    salary: String,
    status: String
}, { timestamps: true });

export const Offer = mongoose.model('Offer', offerSchema);

// Recruitment Report Schema
const recruitmentReportSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: String,
    type: String,
    createdOn: String
}, { timestamps: true });

export const RecruitmentReport = mongoose.model('RecruitmentReport', recruitmentReportSchema);
