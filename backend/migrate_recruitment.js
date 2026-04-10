import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { InterviewCall, Student, Company, JobListing, InterviewSchedule, Offer, RecruitmentReport } from './models/Recruitment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-management';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const migrateData = async () => {
    try {
        const dbPath = path.join(__dirname, '../frontend/json_data/db.json');
        const rawData = fs.readFileSync(dbPath, 'utf-8');
        const data = JSON.parse(rawData);

        // Clear existing data to avoid duplicates (optional, strictly for clean seed)
        await InterviewCall.deleteMany({});
        await Student.deleteMany({});
        await Company.deleteMany({});
        await JobListing.deleteMany({});
        await InterviewSchedule.deleteMany({});
        await Offer.deleteMany({});
        await RecruitmentReport.deleteMany({});

        console.log('Cleared existing recruitment collections.');

        // 1. InterviewCalls
        if (data.interviewCalls) {
            await InterviewCall.insertMany(data.interviewCalls);
            console.log(`Migrated ${data.interviewCalls.length} InterviewCalls`);
        }

        // 2. Students
        if (data.students) {
            await Student.insertMany(data.students);
            console.log(`Migrated ${data.students.length} Students`);
        }

        // 3. Companies
        if (data.companies) {
            await Company.insertMany(data.companies);
            console.log(`Migrated ${data.companies.length} Companies`);
        }

        // 4. HR Data -> JobListing & InterviewSchedule
        if (data.hrdata) {
            const jobs = data.hrdata.filter(item => item.type === 'job').map(item => ({
                ...item,
                // Ensure ID is unique if needed, or keeping original
                // Mapping fields if necessary
            }));
            const interviews = data.hrdata.filter(item => item.type === 'interview').map(item => ({
                ...item,
                // Mapping fields if necessary
            }));

            if (jobs.length > 0) {
                await JobListing.insertMany(jobs);
                console.log(`Migrated ${jobs.length} Job Listings from hrdata`);
            }
            if (interviews.length > 0) {
                await InterviewSchedule.insertMany(interviews);
                console.log(`Migrated ${interviews.length} Interview Schedules from hrdata`);
            }
        }

        // 5. Offers - (Mock data since not in DB)
        const mockOffers = [
            { id: 1, candidateName: "Rahul Sharma", email: "rahul.s@example.com", position: "Frontend Dev", company: "TechNova", offerDate: "2025-12-01", salary: "12 LPA", status: "Accepted" },
            { id: 2, candidateName: "Priya Patel", email: "priya.p@example.com", position: "Backend Dev", company: "InnovateLabs", offerDate: "2025-12-05", salary: "14 LPA", status: "Pending" }
        ];
        await Offer.insertMany(mockOffers);
        console.log(`Seeded ${mockOffers.length} Mock Offers`);

        // 6. Reports - (Mock data)
        const mockReports = [
            { id: 1, name: "December Recruitment Stats", type: "Monthly", createdOn: "2025-12-31" },
            { id: 2, name: "Annual Hiring Review", type: "Yearly", createdOn: "2025-12-30" }
        ];
        await RecruitmentReport.insertMany(mockReports);
        console.log(`Seeded ${mockReports.length} Mock Reports`);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
