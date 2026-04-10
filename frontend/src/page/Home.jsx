import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Mail, Lock, CheckCircle2, User, Shield, Briefcase, Zap } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [selectedRole, setSelectedRole] = useState('admin');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { id: 'admin', label: 'Hiring & Placement Shell', icon: <Shield size={16} /> },
        { id: 'hr', label: 'HR Manager', icon: <Briefcase size={16} /> },
        { id: 'employee', label: 'Employee', icon: <User size={16} /> }
    ];

    const currentRoleLabel = roles.find(r => r.id === selectedRole)?.label;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        // Relaxed frontend email validation
        // (Previously restricted to @company.com)

        setLoading(true);
        const res = await login(email, password, selectedRole);

        if (res.success) {
            if (selectedRole === 'admin') navigate('/recruitment-shell');
            else if (selectedRole === 'hr') navigate('/dashboard');
            else navigate('/employee-dashboard');
        } else {
            console.error('Login Failed:', res);
            alert('Login Failed: ' + (res.message || 'Unknown Error'));
            setError(res.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
            {/* Soft Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[60%] rounded-full bg-blue-50/50 blur-3xl filter opacity-70"></div>
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[50%] rounded-full bg-indigo-50/50 blur-3xl filter opacity-70"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-slate-50/80 blur-3xl filter opacity-80"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl p-4 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-[600px]">

                    {/* Left Side: Visuals & Branding */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl -ml-20 -mb-20"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-lg text-indigo-600">
                                    <Zap size={24} fill="currentColor" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight">InnovaHire</span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                                Empowering Your Workforce.
                            </h1>
                            <p className="text-blue-100 text-lg leading-relaxed max-w-md">
                                Streamline recruitment, manage talent, and track performance with our all-in-one centralized platform.
                            </p>
                        </div>

                        <div className="relative z-10 mt-12 flex gap-4 opacity-80">
                            <div className="h-1.5 w-12 bg-white rounded-full"></div>
                            <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
                            <div className="h-1.5 w-2 bg-white/30 rounded-full"></div>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="p-10 lg:p-14 flex flex-col justify-center bg-white relative">

                        {/* Role Selector */}
                        <div className="absolute top-8 right-8">
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 py-2.5 px-5 rounded-full text-sm font-semibold text-slate-600 border border-slate-200 transition-all shadow-sm"
                                >
                                    <span>{currentRoleLabel}</span>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 p-1">
                                        {roles.map(role => (
                                            <button
                                                key={role.id}
                                                onClick={() => {
                                                    setSelectedRole(role.id);
                                                    setIsDropdownOpen(false);
                                                    if (role.id === 'admin' || role.id === 'hr') {
                                                        setEmail('admin@gmail.com');
                                                    } else {
                                                        setEmail('');
                                                    }
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-colors
                                                    ${selectedRole === role.id ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'}
                                                `}
                                            >
                                                <div className={`p-2 rounded-lg ${selectedRole === role.id ? 'bg-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                                                    {role.icon}
                                                </div>
                                                {role.label}
                                                {selectedRole === role.id && <CheckCircle2 size={16} className="ml-auto text-indigo-600" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 max-w-sm mx-auto w-full">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Hello Again! 👋</h2>
                                <p className="text-slate-500">
                                    Welcome back to the <span className="font-semibold text-indigo-600">{currentRoleLabel}</span> portal.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-in slide-in-from-left-2">
                                    <Shield size={18} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-800 font-medium transition-all placeholder:text-slate-400"
                                            placeholder={selectedRole === 'employee' ? "Enter Name or Email" : "admin@gmail.com"}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-slate-800 font-medium transition-all placeholder:text-slate-400"
                                            placeholder="Use 'admin123' for demo"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button type="button" className="text-xs font-semibold text-indigo-500 hover:text-indigo-600">Forgot Password?</button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-500/30 transition-all transform
                                        ${loading
                                            ? 'bg-indigo-400 cursor-not-allowed scale-[0.98]'
                                            : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98]'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                            Authenticating...
                                        </span>
                                    ) : (
                                        'Login to Dashboard'
                                    )}
                                </button>

                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-xs text-slate-400">
                                    By logging in, you agree to the <span className="underline cursor-pointer hover:text-indigo-500">Privacy Policy</span> and <span className="underline cursor-pointer hover:text-indigo-500">Terms of Service</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
