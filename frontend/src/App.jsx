import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import "./index.css";

// Lazy Load Pages
import Layout from "./components/Layout";
const LandingPage = lazy(() => import("./page/LandingPage"));
const Home = lazy(() => import("./page/Home"));
const Dashboard = lazy(() => import("./page/Dashboard"));
const Employee = lazy(() => import("./page/Employees")); // Ensure filename matches (Employees.jsx vs Employess.jsx in user's system)
// Note: User system had 'Employess.jsx' but user renamed import to 'Employees' in diff. I will use 'Employess' if that's the file name, or 'Employees' if user renamed file.
// Checking previous file list: 'Employees.jsx' exists.
const Attendance = lazy(() => import("./page/Attendance"));
const RecruitmentDashboard = lazy(() => import("./page/RecruitmentDashboard"));
const Projects = lazy(() => import("./page/Projects"));
const Departments = lazy(() => import("./page/Departments"));
const EmployeeDashboard = lazy(() => import("./page/EmployeeDashboard"));

// Subpages
const InterviewCalls = lazy(() => import("./page/recruitment/InterviewCalls"));
const Students = lazy(() => import("./page/recruitment/Students"));
const Companies = lazy(() => import("./page/recruitment/Companies"));
const OfferPage = lazy(() => import("./page/recruitment/Offers"));
const SchedulePage = lazy(() => import("./page/recruitment/Schedule"));
const StudentPortal = lazy(() => import("./page/recruitment/JobPortal"));
const Goals = lazy(() => import("./page/Goals"));
const Reports = lazy(() => import("./page/recruitment/Reports"));

// Utility Pages
const Sessions = lazy(() => import("./page/Sessions"));
const Messages = lazy(() => import("./page/Messages"));
const Settings = lazy(() => import("./page/Settings"));
const Help = lazy(() => import("./page/Help"));

// Config moved to AuthContext.jsx

// Loading Spinner
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // DEBUG PROTECTED ROUTE
  console.log('ProtectedRoute Check:', {
    path: window.location.pathname,
    userRole: user?.role,
    loading,
    allowedRoles
  });

  if (loading) return <Spinner />;
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // Role Check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'admin') return children; // Superuser bypass
    console.log(`ProtectedRoute: Role mismatch (User: ${user.role}, Allowed: ${allowedRoles}), redirecting to /`);
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen">
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Home />} />

          {/* Protected Routes - Wrapped in Layout */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'hr', 'employee']}><Layout /></ProtectedRoute>}>
            {/* Note: The Layout itself is now protected, but inner routes have specific role checks too if needed. 
                 Actually, simpler is to have Layout as a public wrapper relative to Auth, but the children are protected. 
                 Or better: Layout is the shell, and ProtectedRoute guards access. 
                 Let's put Layout inside ProtectedRoute for generic access, then specific checks on pages.
             */}

            {/* Core Management */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['hr']}><Dashboard /></ProtectedRoute>} /> {/* RESTRICTED TO HR */}
            <Route path="/recruitment-shell" element={<ProtectedRoute allowedRoles={['admin']}><RecruitmentDashboard /></ProtectedRoute>} /> {/* RESTRICTED TO ADMIN */}
            <Route path="/employees" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><Employee /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><Projects /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><Departments /></ProtectedRoute>} />

            {/* Recruitment Module */}
            <Route path="/interviewCalls" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><InterviewCalls /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><Students /></ProtectedRoute>} />
            <Route path="/companies" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><Companies /></ProtectedRoute>} />
            <Route path="/offers" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><OfferPage /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><SchedulePage /></ProtectedRoute>} />

            {/* Student Module */}
            <Route path="/student-portal" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><StudentPortal /></ProtectedRoute>} />

            {/* Employee Module */}
            <Route path="/employee-dashboard" element={<ProtectedRoute allowedRoles={['employee', 'admin', 'hr']}><EmployeeDashboard /></ProtectedRoute>} />
            <Route path="/attendance" element={<ProtectedRoute allowedRoles={['employee', 'admin', 'hr']}><Attendance /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute allowedRoles={['employee', 'admin', 'hr']}><Goals /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['employee', 'admin', 'hr']}><Reports /></ProtectedRoute>} />

            {/* Utility / System Pages */}
            <Route path="/sessions" element={<ProtectedRoute allowedRoles={['admin']}><Sessions /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute allowedRoles={['admin', 'hr', 'employee']}><Messages /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'hr', 'employee']}><Settings /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute allowedRoles={['admin', 'hr', 'employee']}><Help /></ProtectedRoute>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
