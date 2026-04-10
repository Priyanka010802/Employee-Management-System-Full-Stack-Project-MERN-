import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        // HR PORTAL LINKS
        { to: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['hr'] },
        { to: '/employee-dashboard', label: 'My Portal', icon: '🏠', roles: ['employee'] },
        { to: '/employees', label: 'Manage Employees', icon: '👥', roles: ['hr'] },
        { to: '/attendance', label: 'Time & Attendance', icon: '⏱️', roles: ['hr'] },
        { to: '/departments', label: 'Departments', icon: '📂', roles: ['hr'] },
        { to: '/projects', label: 'Projects Management', icon: '✅', roles: ['hr'] },
        { to: '/goals', label: 'Goals', icon: '🎯', roles: ['hr'] },

        // HIRING & PLACEMENT SHELL (ADMIN) LINKS
        { to: '/recruitment-shell', label: 'Home Shell', icon: '🏠', roles: ['admin'] },
        { to: '/interviewCalls', label: 'Interview Calls', icon: '📞', roles: ['admin', 'hr'] },
        { to: '/companies', label: 'View Companies', icon: '🏢', roles: ['admin', 'hr'] },
        { to: '/students', label: 'View Students', icon: '👨‍🎓', roles: ['admin', 'hr'] },
        { to: '/offers', label: 'Job Offers', icon: '📜', roles: ['admin', 'hr'] },
        { to: '/schedule', label: 'Schedule', icon: '📅', roles: ['admin', 'hr'] },
        { to: '/student-portal', label: 'Job Portal', icon: '💼', roles: ['admin', 'hr'] },
        { to: '/reports', label: 'Recruitment Reports', icon: '📈', roles: ['admin', 'hr'] },

        // Shared / Utility
        { to: '/messages', label: 'Messages', icon: '💬', roles: ['admin', 'hr', 'employee'] },
        { to: '/sessions', label: 'Active Sessions', icon: '🔐', roles: ['admin'] },
        { to: '/settings', label: 'Settings', icon: '⚙️', roles: ['admin', 'hr', 'employee'] },
        { to: '/help', label: 'Help', icon: '❓', roles: ['admin', 'hr', 'employee'] },
    ];

    // Filter items based on user role strict matching
    const visibleItems = navItems.filter(item =>
        item.roles.includes(user?.role || '')
    );

    return (
        <aside className={`bg-white border-r border-slate-200 text-slate-600 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'} h-screen sticky top-0 shadow-sm z-50`}>
            {/* Brand */}
            <div className="h-16 flex items-center justify-center border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xl tracking-tight">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white text-xs font-bold">IH</span>
                    </div>
                    {!collapsed && <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">InnovaHire</span>}
                </div>
            </div>

            {/* Nav List */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm ring-1 ring-indigo-200'
                                : 'hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${collapsed ? 'mx-auto' : ''}`}>{item.icon}</span>
                        {!collapsed && <span className="text-sm">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Toggle */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mb-2"
                >
                    {collapsed ? '→' : '← Collapse'}
                </button>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:shadow-sm border border-transparent hover:border-rose-100 transition-all ${collapsed ? 'justify-center' : ''}`}
                >
                    <span>🚪</span>
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
