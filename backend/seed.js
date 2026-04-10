import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Employee } from './models/Employee.js';
import { Admin } from './models/Admin.js';
import { Department } from './models/Department.js';
import { Task } from './models/Task.js';
import { Goal, Attendance, Report } from './models/GoalsAndAttendance.js';
import { InterviewCall, Student, Company } from './models/Recruitment.js';
import { Session, Message } from './models/Misc.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-management';

mongoose.connect(MONGODB_URI)
    .then(() => {
        const dbName = mongoose.connection.name;
        console.log(`Connected to MongoDB for Seeding: ${dbName}`);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        const dbJsonPath = path.join(__dirname, '../frontend/json_data/db.json');
        let data;
        try {
            data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
        } catch (e) {
            try {
                data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
            } catch (e2) {
                console.error("Could not find db.json at", dbJsonPath);
                throw new Error("Could not populate data from db.json");
            }
        }

        // Clear existing data
        await Promise.all([
            Employee.deleteMany({}),
            Admin.deleteMany({}),
            Department.deleteMany({}),
            Task.deleteMany({}),
            Goal.deleteMany({}),
            Attendance.deleteMany({}),
            InterviewCall.deleteMany({}),
            Student.deleteMany({}),
            Company.deleteMany({}),
            Session.deleteMany({}),
            Message.deleteMany({}),
            Report.deleteMany({})
        ]);

        console.log('Cleared existing data');

        const SALT_ROUNDS = 10;
        const defaultPassword = 'password123';

        // 1. ADMINS
        const strictAdmins = [
            { id: 1, email: "admin@gmail.com", password: await bcrypt.hash("admin123", SALT_ROUNDS) },
            { id: 2, email: "hr@company.com", password: await bcrypt.hash("admin123", SALT_ROUNDS), role: "hr", name: "HR Manager" }
        ];

        if (data.admins) {
            for (let admin of data.admins) {
                if (admin.email === "admin@gmail.com") continue;
                const plain = admin.password || 'admin123';
                admin.password = await bcrypt.hash(plain, SALT_ROUNDS);
                admin.id = strictAdmins.length + 1 + (Number(admin.id) || 0);
                strictAdmins.push(admin);
            }
        }
        await Admin.insertMany(strictAdmins);
        console.log('Admins seeded');

        // 2. EMPLOYEES
        if (data.employees) {
            const seenEmails = new Set();
            const cleanedEmps = [];
            for (let emp of data.employees) {
                if (!emp.email || seenEmails.has(emp.email)) continue;
                seenEmails.add(emp.email);
                emp.password = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
                if (!emp.id) emp.id = `EMP${Date.now()}${Math.floor(Math.random() * 100)}`;
                cleanedEmps.push(emp);
            }
            await Employee.insertMany(cleanedEmps);
            console.log('Employees seeded');
        }

        // 3. DEPARTMENTS
        if (data.departments) {
            const seenNames = new Set();
            const seenCodes = new Set();
            const cleanedDepts = data.departments
                .filter(dept => {
                    const name = (dept.name || "").toLowerCase().trim();
                    if (seenNames.has(name) || name === "") return false;
                    seenNames.add(name);
                    return true;
                })
                .map(dept => {
                    let code = dept.code || "";
                    if (!code || code === "" || !/^[A-Z]{2,4}\d{0,3}$/.test(code.toUpperCase()) || seenCodes.has(code.toUpperCase())) {
                        let initials = (dept.name || "DEPT")
                            .split(' ')
                            .map(word => word.charAt(0))
                            .join('')
                            .toUpperCase();

                        if (initials.length < 2) {
                            initials = (dept.name || "DEPT").substring(0, 2).toUpperCase();
                        }
                        initials = initials.slice(0, 4);

                        let count = 0;
                        let finalCode = `${initials}${Math.floor(Math.random() * 90) + 10}`;
                        while (seenCodes.has(finalCode) && count < 10) {
                            finalCode = `${initials}${Math.floor(Math.random() * 90) + 10}`;
                            count++;
                        }
                        code = finalCode;
                    }
                    seenCodes.add(code.toUpperCase());
                    return {
                        ...dept,
                        code: code.toUpperCase(),
                        status: (dept.status && ['active', 'inactive', 'archived'].includes(dept.status.toLowerCase()))
                            ? dept.status.toLowerCase()
                            : 'active'
                    };
                });
            for (let dept of cleanedDepts) {
                try {
                    const d = new Department(dept);
                    await d.save();
                } catch (e) {
                    console.error(`Failed to save department ${dept.name}:`, e.message);
                }
            }
            console.log('Departments seeded (checks completed)');
        }

        // 4. TASKS
        if (data.tasks) {
            const seenTaskIds = new Set();
            const cleanedTasks = data.tasks.filter(t => {
                if (!t.id || seenTaskIds.has(t.id)) return false;
                seenTaskIds.add(t.id);
                return true;
            });
            await Task.insertMany(cleanedTasks);
            console.log('Tasks seeded');
        }

        // 5. OTHERS
        if (data.goals) await Goal.insertMany(data.goals);
        if (data.attendance) await Attendance.insertMany(data.attendance);
        if (data.interviewCalls) await InterviewCall.insertMany(data.interviewCalls);
        if (data.students) await Student.insertMany(data.students);
        if (data.companies) await Company.insertMany(data.companies);
        if (data.messages) await Message.insertMany(data.messages);
        if (data.reports) await Report.insertMany(data.reports);

        console.log('All data seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
