import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Particle Animation Component
const FloatingParticles = ({ count = 20 }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 20 + 5}px`,
            height: `${Math.random() * 20 + 5}px`,
            animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out ${Math.random() * 5}s`,
            opacity: Math.random() * 0.3 + 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const end = value;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, isVisible]);

  return <span ref={ref}>{count}</span>;
};

// Wave Graph Component
const WaveGraph = ({ percentage, color = "#3B82F6" }) => {
  const waveRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-20 w-full overflow-hidden">
      <svg
        ref={waveRef}
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`wave-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d={`M 0,40 Q 25,${40 - percentage * 0.4} 50,${40 - percentage * 0.4} T 100,40 L 100,40 L 0,40 Z`}
          fill={`url(#wave-gradient-${color})`}
          transform={`translate(${offset}, 0)`}
        />
        <path
          d={`M -100,40 Q -75,${40 - percentage * 0.4} -50,${40 - percentage * 0.4} T 0,40 L 0,40 L -100,40 Z`}
          fill={`url(#wave-gradient-${color})`}
          transform={`translate(${offset}, 0)`}
        />
      </svg>
    </div>
  );
};

// Circular Progress with Particles
const ParticleProgressCircle = ({ percentage, size = 120, color = "#3B82F6" }) => {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const particles = Math.floor(percentage / 10);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
        />
      </svg>

      {/* Floating Particles */}
      {Array.from({ length: particles }).map((_, i) => {
        const angle = (i * (360 / particles)) * (Math.PI / 180);
        const x = size / 2 + (radius + 15) * Math.cos(angle);
        const y = size / 2 + (radius + 15) * Math.sin(angle);

        return (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: "6px",
              height: "6px",
              left: `${x - 3}px`,
              top: `${y - 3}px`,
              backgroundColor: color,
              animationDelay: `${i * 0.2}s`,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
        <span className="text-xs text-gray-500">Progress</span>
      </div>
    </div>
  );
};

// Animated Bar Chart
const AnimatedBarChart = ({ data, height = 100 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end h-full gap-2">
      {data.map((item, index) => (
        <div
          key={index}
          className="relative flex-1 group"
          style={{ height: `${height}px` }}
        >
          <div
            className="absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ease-out hover:scale-y-105"
            style={{
              height: `${(item.value / maxValue) * 100}%`,
              background: `linear-gradient(to top, ${item.color}, ${item.color}80)`,
              animationDelay: `${index * 100}ms`,
            }}
          />
          <div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded shadow-sm"
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { apiCall, user } = useAuth();
  const [data, setData] = useState({
    admins: [],
    employees: [],
    tasks: [],
    departments: [],
    projects: [],
    attendance: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [admins, employees, tasks, departments, projects, attendance] = await Promise.all([
          apiCall("/admins"),
          apiCall("/employees"),
          apiCall("/tasks"),
          apiCall("/departments"),
          apiCall("/projects"),
          apiCall("/attendance")
        ]);

        setData({
          admins: Array.isArray(admins) ? admins : [],
          employees: Array.isArray(employees) ? employees : [],
          tasks: Array.isArray(tasks) ? tasks : [],
          departments: departments?.departments && Array.isArray(departments.departments) ? departments.departments : (Array.isArray(departments) ? departments : []),
          projects: projects?.projects && Array.isArray(projects.projects) ? projects.projects : (Array.isArray(projects) ? projects : []),
          attendance: Array.isArray(attendance) ? attendance : []
        });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        // Alert the user if it's an auth error
        if (error.message?.includes("Unauthorized") || error.message?.includes("token")) {
          console.warn("Authentication failed in Dashboard. Redirecting or showing error...");
        }
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsAnimating(false), 300);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [apiCall]);

  // ✅ FIXED: Calculate statistics with proper project/task connections
  const stats = useMemo(() => {
    const totalEmployees = data.employees.length;
    const totalSalary = data.employees.reduce((sum, emp) => sum + (parseFloat(emp.salary) || 0), 0);
    const totalTasks = data.tasks.length;
    const totalProjects = data.projects.length;

    // Task status calculation
    const completedTasks = data.tasks.filter(task =>
      task.status?.toLowerCase().includes('complete') ||
      task.status?.toLowerCase().includes('done')
    ).length;

    const inProgressTasks = data.tasks.filter(task =>
      task.status?.toLowerCase().includes('progress')
    ).length;

    const pendingTasks = totalTasks - completedTasks - inProgressTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate Project Session Momentum (Tasks completed today related to active projects)
    const today = new Date().toISOString().split('T')[0];
    const tasksCompletedToday = data.tasks.filter(t =>
      (t.status === 'Completed' || t.status === 'done') &&
      (t.updatedAt || t.createdAt)?.startsWith(today)
    ).length;

    const projectSessionMomentum = totalTasks > 0
      ? Math.round((tasksCompletedToday / Math.max(1, totalTasks)) * 100)
      : 0;

    // Project status calculation - refined
    const activeProjects = data.projects.filter(p => p.status === 'In Progress').length;
    const completedProjects = data.projects.filter(p => p.status === 'Completed').length;
    const pendingProjects = data.projects.filter(p => p.status === 'Planned' || p.status === 'On Hold').length;

    const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;
    const projectPendingRate = totalProjects > 0 ? Math.round((pendingProjects / totalProjects) * 100) : 0;
    const projectActiveRate = totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0;

    // Attendance calculation
    const todayAttendance = data.attendance.filter(record => record.date === today);
    const presentCount = todayAttendance.filter(record => record.status === 'Present').length;
    const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

    // Proper Weighted Overall Completion Rate (Average of all project progress)
    const overallCompletionRate = totalProjects > 0
      ? Math.round(data.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects)
      : completionRate; // Fallback to task completion rate if no projects

    return {
      totalEmployees,
      totalSalary,
      totalTasks,
      totalProjects,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      completionRate: overallCompletionRate,
      taskCompletionRate: completionRate,
      activeProjects,
      completedProjects,
      pendingProjects,
      projectCompletionRate,
      projectPendingRate,
      projectActiveRate,
      attendanceRate,
      presentCount,
      sessionMomentum: projectSessionMomentum,
      totalDepartments: data.departments.length,
    };
  }, [data]);

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Navigation handlers
  const handleViewTasksBoard = () => {
    navigate('/projects');
  };

  const handleViewAllTasks = () => {
    navigate('/projects');
  };

  const handleTaskClick = () => {
    navigate('/projects');
  };

  // Sample data for animated charts
  const monthlyData = [
    { month: 'Jan', value: 150, color: '#3B82F6' },
    { month: 'Feb', value: 165, color: '#3B82F6' },
    { month: 'Mar', value: 172, color: '#3B82F6' },
    { month: 'Apr', value: 182, color: '#3B82F6' },
    { month: 'May', value: 175, color: '#3B82F6' },
    { month: 'Jun', value: 190, color: '#3B82F6' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="h-20 w-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-slate-600 font-medium animate-pulse mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 md:p-6 overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingParticles count={30} />

      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20 animate-gradient-shift"></div>

      <div className="relative z-10">
        {/* Header with Glassmorphism Effect */}
        <div className="mb-8 animate-fade-down">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  InnovaHire
                </h1>
                <p className="text-slate-600">Employee Management Dashboard</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-700">
                    {new Date().toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date().toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="relative group">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center cursor-pointer">
                    <span className="text-white font-semibold">
                      {user?.email ? user.email[0]?.toUpperCase() : 'A'}
                    </span>
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/50 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="text-sm font-semibold text-slate-800">{user?.email}</div>
                    <div className="text-xs text-blue-600 font-medium mt-1">Administrator</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Overview - Glass Card with Wave Animation */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fade-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="h-3 w-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></span>
                    Today's Project Performance
                  </h2>
                  <p className="text-slate-500 text-sm flex items-center gap-2">
                    Real-time session momentum: {stats.sessionMomentum}%
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${stats.sessionMomentum > 20 ? 'bg-green-100 text-green-700' :
                      stats.sessionMomentum > 5 ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                      {stats.sessionMomentum > 20 ? 'High Activity' : stats.sessionMomentum > 5 ? 'Stable Flow' : stats.sessionMomentum === 0 ? 'No Current Activity' : 'Low Activity'}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleViewTasksBoard}
                  className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="relative z-10">View Tasks Board</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      <AnimatedCounter value={stats.completionRate} />
                      %
                    </div>
                    <p className="text-slate-500">Overall Completion Rate</p>
                  </div>

                  {/* Particle Progress Circle - ✅ NOW WORKS WITH REAL DATA */}
                  <div className="flex justify-center">
                    <ParticleProgressCircle
                      percentage={stats.completionRate}
                      size={180}
                      color="#6366F1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Stats Grid with Hover Effects - Project Specific */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:shadow-lg group">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        <AnimatedCounter value={stats.activeProjects} />
                      </div>
                      <div className="text-[10px] font-bold text-blue-700 uppercase tracking-tighter">In Progress</div>
                      <div className="h-1 w-8 mx-auto mt-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:shadow-lg group">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        <AnimatedCounter value={stats.completedProjects} />
                      </div>
                      <div className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">Completed</div>
                      <div className="h-1 w-8 mx-auto mt-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-4 text-center transform transition-all hover:scale-105 hover:shadow-lg group">
                      <div className="text-2xl font-bold text-slate-600 mb-1">
                        <AnimatedCounter value={stats.pendingProjects} />
                      </div>
                      <div className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Pending</div>
                      <div className="h-1 w-8 mx-auto mt-2 bg-gradient-to-r from-slate-400 to-gray-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>

                  {/* Animated Wave Graph */}
                  <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Progress Flow</span>
                      <span className="font-semibold text-slate-800">{stats.completionRate}%</span>
                    </div>
                    <WaveGraph percentage={stats.completionRate} color="#6366F1" />
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ REFINED: Active & Recent Projects Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fade-up animation-delay-75">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span className="h-3 w-3 bg-indigo-500 rounded-full"></span>
                  Active Momentum
                </h2>
                <div className="flex gap-4">
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-500"></span> Active
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-slate-300"></span> Planned
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Active Projects (In Progress) */}
                {data.projects.filter(p => p.status === 'In Progress').slice(0, 2).map((project) => (
                  <div
                    key={project._id}
                    className="group p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => navigate('/projects')}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate max-w-[150px]">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider">In Progress</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-600">
                        <span>Momentum</span>
                        <span>{project.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-1000"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Recent Projects (Latest added - regardless of status) */}
                {data.projects.filter(p => !['In Progress'].includes(p.status)).slice(0, 2).map((project) => (
                  <div
                    key={project._id}
                    className="group p-4 bg-white rounded-xl border border-slate-100 hover:border-slate-300 transition-all duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => navigate('/projects')}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">
                          {project.title}
                        </h4>
                        <p className={`text-[11px] font-medium ${project.status === 'Completed' ? 'text-green-600' : 'text-slate-500'}`}>
                          {project.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{project.department?.name || 'Unassigned'}</span>
                      <span className="font-bold text-slate-700">{project.progress || 0}%</span>
                    </div>
                  </div>
                ))}

                {data.projects.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No active projects found.
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics Grid with Creative Animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Team Size - Animated Bar Chart */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-5 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-up animation-delay-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Team Analytics</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full animate-pulse">
                    <AnimatedCounter value={stats.totalEmployees} /> Active
                  </span>
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  <AnimatedCounter value={stats.totalEmployees} />
                </div>
                <p className="text-sm text-slate-500 mb-4">Active Employees</p>

                {/* Animated Bar Chart */}
                <div className="h-32">
                  <AnimatedBarChart
                    data={[
                      { value: stats.totalEmployees, color: '#10B981' },
                      { value: Math.round(stats.totalEmployees * 0.8), color: '#34D399' },
                      { value: Math.round(stats.totalEmployees * 0.6), color: '#6EE7B7' },
                      { value: Math.round(stats.totalEmployees * 0.4), color: '#A7F3D0' },
                    ]}
                    height={100}
                  />
                </div>
              </div>

              {/* User Identity Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-5 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-up animation-delay-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">User Identity</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Active Session
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-800 break-all px-2">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Logged in Account</p>
                </div>
              </div>

              {/* Monthly Cost - Animated Line Chart */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-5 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-fade-up animation-delay-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800">Financial Overview</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-2">
                  {formatCurrency(stats.totalSalary)}
                </div>
                <p className="text-sm text-slate-500 mb-4">Monthly Payroll</p>

                {/* Animated Line Chart */}
                <div className="h-16 relative">
                  <svg viewBox="0 0 100 30" className="w-full h-full">
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,25 Q25,20 40,15 T60,20 T80,10 T100,15"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="2"
                      className="animate-draw"
                    />
                    <path
                      d="M0,25 Q25,20 40,15 T60,20 T80,10 T100,15 L100,30 L0,30 Z"
                      fill="url(#areaGradient)"
                      className="animate-fade-in"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Analytics & Tasks */}
          <div className="space-y-6">
            {/* ✅ FIXED: Status Distribution - 3D Effect */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fade-up animation-delay-400">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Status Distribution</h2>
                <div className="flex items-center gap-2 animate-pulse">
                  <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700">Live Synced</span>
                </div>
              </div>

              {/* 3D Donut Chart */}
              <div className="relative h-48 mb-6">
                <div className="relative h-40 w-40 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl"></div>
                  {[
                    { percent: stats.projectActiveRate, color: '#F59E0B', label: 'Active Projects' },
                    { percent: stats.projectCompletionRate, color: '#10B981', label: 'Completed Projects' },
                    { percent: stats.projectPendingRate, color: '#6B7280', label: 'Pending Projects' }
                  ].map((item, index) => {
                    const totalPercent = 100;
                    const startAngle = index * 120;

                    return (
                      <div
                        key={index}
                        className="absolute inset-0 transform hover:scale-105 transition-transform duration-300"
                        style={{
                          clipPath: `conic-gradient(${item.color} ${startAngle}deg, transparent ${startAngle + 120}deg)`,
                          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                        }}
                      />
                    );
                  })}
                  <div className="absolute inset-10 bg-white/90 backdrop-blur-sm rounded-full shadow-inner"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-800">{stats.totalProjects}</div>
                      <div className="text-xs text-slate-500">Total Projects</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ FIXED: Interactive Legend with real data */}
              <div className="space-y-3">
                {[
                  {
                    label: 'Active Projects',
                    percent: stats.projectActiveRate,
                    color: '#F59E0B',
                    count: stats.activeProjects
                  },
                  {
                    label: 'Completed Projects',
                    percent: stats.projectCompletionRate,
                    color: '#10B981',
                    count: stats.completedProjects
                  },
                  {
                    label: 'Pending Projects',
                    percent: stats.projectPendingRate,
                    color: '#6B7280',
                    count: stats.pendingProjects
                  }
                ].map((item, index) => (
                  <div key={index} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full transition-transform group-hover:scale-125"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {item.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tasks - Glass Cards */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fade-up animation-delay-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800">Recent Activities</h2>
                <button
                  onClick={handleViewAllTasks}
                  className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 font-medium transition-all"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {data.tasks.slice(-4).reverse().map((task, index) => (
                  <div
                    key={index}
                    className="group p-4 bg-gradient-to-r from-slate-50/50 to-white/50 rounded-xl border border-white hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm"
                    onClick={handleTaskClick}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                            {task.projectTitle || 'General Task'}
                          </p>
                        </div>
                        <h4 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all group-hover:scale-105 ${task.status === 'Completed' || task.status === 'done' ? 'bg-green-100 text-green-700' :
                            task.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all group-hover:scale-105 ${task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            task.priority === 'Low' ? 'bg-blue-100 text-blue-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                            {task.priority || 'Medium'}
                          </span>
                        </div>
                      </div>
                      <div className={`ml-3 h-3 w-3 rounded-full animate-pulse ${task.status === 'Completed' || task.status === 'done' ? 'bg-green-500' :
                        task.status === 'In Progress' ? 'bg-amber-500' :
                          'bg-slate-400'
                        }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS Animations */}
      <style jsx global>{`
        @keyframes fade-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        
        .animate-fade-down { animation: fade-down 0.6s ease-out; }
        .animate-fade-up { animation: fade-up 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-draw { animation: draw 2s ease-out forwards; }
        .animate-gradient-shift { 
          background-size: 200% 200%;
          animation: gradient-shift 10s ease infinite; 
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Glassmorphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3B82F6, #8B5CF6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563EB, #7C3AED);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
