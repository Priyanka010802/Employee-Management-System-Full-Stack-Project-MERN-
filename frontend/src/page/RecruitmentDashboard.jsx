import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RecruitmentDashboard = () => {
    const { user, logout, apiCall } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        interviewCalls: 0,
        students: 0,
        companies: 0,
        offers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [callsData, studentsData, companiesData] = await Promise.all([
                    apiCall('/interviewCalls'),
                    apiCall('/students'),
                    apiCall('/companies')
                ]);

                setStats({
                    interviewCalls: Array.isArray(callsData) ? callsData.length : 0,
                    students: Array.isArray(studentsData) ? studentsData.length : 0,
                    companies: Array.isArray(companiesData) ? companiesData.length : 0,
                    offers: 0
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [apiCall]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const NavCard = ({ icon, color, title, desc, count, onClick }) => (
        <div
            onClick={onClick}
            className={`p-6 rounded-2xl border border-slate-100 bg-${color}-50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 flex items-start gap-4 group bg-white`}
        >
            <div className={`h-14 w-14 rounded-xl bg-${color}-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
                <p className="text-sm text-slate-500 mt-1">{desc}</p>
                {count !== undefined && (
                    <div className={`mt-3 text-2xl font-bold text-${color}-600`}>
                        {loading ? '...' : count}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full relative font-sans">
            {/* Top Bar for Shell - Optional if Sidebar is enough, but keeping for specialized admin feel */}
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <p className="text-[10px] font-bold text-sky-600 tracking-widest uppercase mb-1">INNOVAHIRE ADMIN</p>
                    <h1 className="text-2xl font-bold text-slate-900">Placement & Recruitment</h1>
                    <p className="text-sm text-slate-400 mt-1">Centralized control for placement drives, recruitment pipeline, and hiring analytics.</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user?.name || user?.email || 'Administrator'}</p>
                        <p className="text-[10px] text-slate-400 font-bold text-sky-500 uppercase">Admin Access</p>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all font-semibold text-sm group border border-slate-100 hover:border-red-100"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT CARD: PLACEMENT DRIVES */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="h-32 w-32 rounded-full bg-emerald-500 blur-3xl"></div>
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase mb-2">PLACEMENT DRIVES</p>
                            <h2 className="text-2xl font-bold text-slate-800">Campus Recruitment</h2>
                            <p className="text-sm text-slate-500 mt-2 max-w-xs">Coordinate interviews, track student participation and company engagements.</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-lg rotate-12">
                            🎓
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        <NavCard
                            title="Interview Calls"
                            desc="Schedule and manage upcoming interviews"
                            icon="📞"
                            color="emerald"
                            count={stats.interviewCalls}
                            onClick={() => navigate('/interviewCalls')}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <NavCard
                                title="Students"
                                desc="Registered candidates"
                                icon="👨‍🎓"
                                color="cyan"
                                count={stats.students}
                                onClick={() => navigate('/students')}
                            />
                            <NavCard
                                title="Companies"
                                desc="Partner organizations"
                                icon="🏢"
                                color="indigo"
                                count={stats.companies}
                                onClick={() => navigate('/companies')}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT CARD: RECRUITMENTS */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="h-32 w-32 rounded-full bg-sky-500 blur-3xl"></div>
                    </div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <p className="text-[10px] font-bold text-sky-500 tracking-widest uppercase mb-2">RECRUITMENTS</p>
                            <h2 className="text-2xl font-bold text-slate-800">Job Pipeline</h2>
                            <p className="text-sm text-slate-500 mt-2 max-w-xs">Manage job postings, interviews, offers and reporting.</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-lg -rotate-6">
                            💼
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                        <NavCard
                            title="Job Portal"
                            desc="Manage student portal view"
                            icon="📢"
                            color="sky"
                            onClick={() => navigate('/student-portal')}
                        />
                        <NavCard
                            title="Schedule"
                            desc="Interview Calendar"
                            icon="🗓️"
                            color="purple"
                            onClick={() => navigate('/schedule')}
                        />
                        <NavCard
                            title="Offers"
                            desc="Manage Offer Letters"
                            icon="✉️"
                            color="purple"
                            onClick={() => navigate('/offers')}
                        />
                        <NavCard
                            title="Reports"
                            desc="View Analytics"
                            icon="📊"
                            color="emerald"
                            onClick={() => navigate('/reports')}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RecruitmentDashboard;
