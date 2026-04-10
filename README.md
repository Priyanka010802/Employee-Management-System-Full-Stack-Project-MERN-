# Employee Management System - MERN Stack

A comprehensive, full-stack Employee Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This application provides complete HR management capabilities including employee tracking, recruitment management, attendance monitoring, project management, and more.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-lightgrey)

## 🌟 Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, HR, Employee)
- Protected routes and API endpoints

### 👥 Employee Management
- Complete employee CRUD operations
- Employee profiles with detailed information
- Department and role assignment
- Employee status tracking

### 📊 HR Dashboard
- Real-time analytics and metrics
- Employee statistics
- Department overview
- Project tracking
- Goal management

### 🎯 Recruitment Module (Full CRUD)
- **Interview Calls**: Schedule and manage interviews
- **Students Database**: Track student/candidate information
- **Companies**: Manage partner companies and HR contacts
- **Job Portal**: Post and manage job listings
- **Offers**: Create and track job offers
- **Schedule**: Interactive calendar for interview scheduling
- **Reports**: Generate recruitment analytics and reports

### ⏰ Attendance System
- Clock in/out functionality
- Daily attendance tracking
- Attendance history and reports
- Real-time status updates

### 📁 Project Management
- Create and assign projects
- Track project progress
- Team collaboration
- Project timelines and deadlines

### 🎯 Goals & Tasks
- Set and track employee goals
- Task assignment and management
- Progress monitoring
- Performance metrics

### 📱 Employee Portal
- Personal dashboard
- Attendance logging
- View assigned tasks and projects
- Profile management

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **FullCalendar** - Interactive calendar
- **Tailwind CSS** - Styling (utility-first CSS)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment variables

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/employee-management-mern.git
cd employee-management-mern
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/employee-management
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Seed Database (Optional)
```bash
cd backend
node seed.js
```

## 🏃‍♂️ Running the Application

### Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Backend will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👤 Default Login Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: `admin@gmail.com`
- Password: `admin123`

**HR Account:**
- Email: `hr@gmail.com`
- Password: `hr123`

**Employee Account:**
- Email: `employee@gmail.com`
- Password: `emp123`

## 📁 Project Structure

```
employee-management-mern/
├── backend/
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware (auth, etc.)
│   ├── server.js         # Express app entry point
│   ├── seed.js           # Database seeding script
│   └── .env              # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React context (Auth)
│   │   ├── page/         # Page components
│   │   │   ├── recruitment/  # Recruitment module pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── ...
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
│
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Employees
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get single employee
- `POST /employees` - Create employee
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Recruitment
- `GET /interviewCalls` - Get all interview calls
- `POST /interviewCalls` - Create interview call
- `PUT /interviewCalls/:id` - Update interview call
- `DELETE /interviewCalls/:id` - Delete interview call

*(Similar CRUD endpoints for students, companies, jobListings, offers, interviewSchedules, recruitmentReports)*

### Attendance
- `GET /attendance` - Get all attendance records
- `POST /attendance/clock-in` - Clock in
- `POST /attendance/clock-out` - Clock out

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

## 🎨 Features Breakdown

### Recruitment Module
All recruitment pages include full CRUD functionality:

1. **Interview Calls** - Schedule and manage interviews with companies
2. **Students** - Maintain database of students/candidates
3. **Companies** - Track partner companies and HR contacts
4. **Job Portal** - Post and manage job listings
5. **Offers** - Create and track job offers
6. **Schedule** - Interactive calendar view of all interviews
7. **Reports** - Generate and download recruitment reports

### Dashboard Analytics
- Total employees count
- Department distribution
- Active projects
- Recent activities
- Attendance overview
- Goal completion rates

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Role-based access control
- Input validation and sanitization

## 🛠️ Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/employee-management
JWT_SECRET=your_secret_key_here
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [Your GitHub Profile](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB team for the excellent database
- Express.js team for the robust framework
- All contributors and supporters

## 📧 Contact

For any queries or support, please reach out:
- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ If you found this project helpful, please give it a star!
