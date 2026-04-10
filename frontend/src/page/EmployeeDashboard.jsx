import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Clock,
    CheckCircle2,
    Calendar,
    TrendingUp,
    LayoutDashboard,
    MessageSquare,
    Bell,
    ArrowUpRight,
    UserCircle,
    Timer,
    Zap,
    Target
} from 'lucide-react';

const AnimatedCounter = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value);
        if (start === end) return;

        let duration = 1000;
        let counter = setInterval(() => {
            start += 1;
            setDisplayValue(Math.floor(start * (end / (duration / 20))));
            if (start >= duration / 20) {
                clearInterval(counter);
                setDisplayValue(end);
            }
        }, 20);

        return () => clearInterval(counter);
    }, [value]);

    return <span>{displayValue}</span>;
};

const EmployeeDashboard = () => {
    const { user, apiCall } = useAuth();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [attData, taskData, goalData] = await Promise.all([
                apiCall('/attendance'),
                apiCall('/tasks'),
                apiCall('/goals')
            ]);

            // Filter for current user
            setAttendance(Array.isArray(attData) ? attData.filter(a => a.employeeEmail === user?.email) : []);

            // Tasks where user is in the team
            setTasks(Array.isArray(taskData) ? taskData.filter(t =>
                t.team?.some(member => member.email === user?.email || member.id === user?.id)
            ) : []);

            // Goals for user
            setGoals(Array.isArray(goalData) ? goalData.filter(g =>
                g.employeeEmail === user?.email || g.employeeName?.toLowerCase().includes(user?.name?.toLowerCase())
            ) : []);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchDashboardData();
    }, [user]);

    const handleClockIn = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            const newRecord = {
                id: `att_${Date.now()}`,
                employeeEmail: user.email,
                date: today,
                status: 'Present',
                checkIn: now,
                checkOut: null
            };

            await apiCall('/attendance', {
                method: 'POST',
                body: JSON.stringify(newRecord)
            });

            fetchDashboardData();
        } catch (err) {
            console.error("Clock In failed:", err);
        }
    };

    const handleClockOut = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = attendance.find(a => a.date === today);

            if (!todayRecord) return;

            const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

            const updatedRecord = {
                ...todayRecord,
                checkOut: now
            };

            await apiCall(`/attendance/${todayRecord.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedRecord)
            });

            fetchDashboardData();
        } catch (err) {
            console.error("Clock Out failed:", err);
        }
    };

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todayRecord = attendance.find(a => a.date === today);
        const completedTasks = tasks.filter(t => t.status?.toLowerCase() === 'completed').length;
        const pendingTasks = tasks.length - completedTasks;
        const avgProgress = tasks.length > 0
            ? Math.round(tasks.reduce((acc, t) => acc + (t.progress || 0), 0) / tasks.length)
            : 0;

        return {
            todayStatus: todayRecord?.status || 'Not Punched In',
            checkIn: todayRecord?.checkIn || '--:--',
            checkOut: todayRecord?.checkOut || '--:--',
            completedTasks,
            pendingTasks,
            avgProgress,
            totalTasks: tasks.length
        };
    }, [attendance, tasks]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening with your work today.</p>
                </div>
                <div className="flex items-center gap-3">
                    {stats.todayStatus === 'Not Punched In' ? (
                        <button onClick={handleClockIn} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2 font-bold animate-bounce-subtle">
                            <Timer size={18} />
                            CLOCK IN NOW
                        </button>
                    ) : stats.checkOut === '--:--' ? (
                        <button onClick={handleClockOut} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all flex items-center gap-2 font-bold">
                            <Clock size={18} />
                            CLOCK OUT
                        </button>
                    ) : (
                        <div className="px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 flex items-center gap-2 font-bold opacity-75">
                            <CheckCircle2 size={18} />
                            SHIFT COMPLETED
                        </div>
                    )}
                </div>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Today's Status</p>
                            <h3 className="text-lg font-bold text-slate-900">{stats.todayStatus}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Tasks Done</p>
                            <h3 className="text-lg font-bold text-slate-900">{stats.completedTasks} / {stats.totalTasks}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Avg. Progress</p>
                            <h3 className="text-lg font-bold text-slate-900">{stats.avgProgress}%</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Active Goals</p>
                            <h3 className="text-lg font-bold text-slate-900">{goals.length}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tasks & Goals */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Recent Tasks Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <LayoutDashboard size={20} className="text-indigo-600" />
                                Assigned Tasks
                            </h2>
                            <button onClick={() => navigate('/projects')} className="text-sm text-indigo-600 font-semibold hover:underline">View All</button>
                        </div>
                        <div className="p-4">
                            {tasks.length > 0 ? (
                                <div className="space-y-2">
                                    {tasks.slice(0, 5).map(task => (
                                        <div key={task.id} className="p-4 hover:bg-slate-50 rounded-2xl transition-colors group flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold
                                                    ${task.priority === 'High' ? 'bg-rose-500' : task.priority === 'Normal' ? 'bg-amber-500' : 'bg-blue-500'}
                                                `}>
                                                    {task.title?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-slate-800">{task.title}</h4>
                                                    <p className="text-xs text-slate-500">{task.projectTitle}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="hidden md:block">
                                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${task.progress}%` }}></div>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold
                                                    ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                                                `}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-slate-400">No tasks assigned to you yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Goals Progress */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-indigo-600" />
                            My Goals
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {goals.map(goal => (
                                <div key={goal.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-slate-800 leading-tight pr-4">{goal.yearlyTarget}</h4>
                                        <span className="text-2xl font-black text-indigo-600">{goal.progress}%</span>
                                    </div>
                                    <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner mb-4">
                                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${goal.progress}%` }}></div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {goal.kpis?.slice(0, 2).map((kpi, idx) => (
                                            <span key={idx} className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded-full text-slate-500 font-medium">{kpi}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {goals.length === 0 && <p className="text-slate-400 col-span-2 text-center p-8">No specific goals set yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Attendance & Info */}
                <div className="space-y-8">
                    {/* Today's Times card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Clock size={20} />
                            Today's Log
                        </h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-indigo-100">Check In</span>
                                <span className="text-2xl font-black">{stats.checkIn}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                <span className="text-indigo-100">Check Out</span>
                                <span className="text-2xl font-black">{stats.checkOut}</span>
                            </div>
                            <div className="pt-2 text-center italic text-indigo-200 text-sm">
                                "Efficiency is doing things right; effectiveness is doing the right things."
                            </div>
                        </div>
                    </div>

                    {/* Quick Access or Notifications */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Bell size={20} className="text-indigo-600" />
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">HR updated the policy</p>
                                    <p className="text-xs text-slate-400">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">Holiday on next Friday</p>
                                    <p className="text-xs text-slate-400">Yesterday</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => navigate('/messages')} className="w-full mt-8 py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-colors">
                            Open Messages
                        </button>
                    </div>

                    {/* My Profile Quick Preview */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center group transition-all hover:border-indigo-200">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1">
                                <div className="h-full w-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                                    <UserCircle size={88} className="text-slate-200" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0 h-6 w-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                        </div>
                        <h3 className="mt-4 font-black text-xl text-slate-900">{user?.name}</h3>
                        <p className="text-sm font-semibold text-indigo-600">{user?.role?.toUpperCase()}</p>
                        <p className="mt-2 text-xs text-slate-400 italic">Connected since 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
