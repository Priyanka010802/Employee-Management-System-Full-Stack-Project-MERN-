import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Role', value: user?.role?.toUpperCase() || 'N/A', icon: '👤' },
    { label: 'Email', value: user?.email || 'N/A', icon: '📧' },
    { label: 'Account Status', value: 'Active', icon: '✅' },
    { label: 'Work Mode', value: 'Hybrid / Remote', icon: '🏠' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
          <p className="text-slate-500">Manage your account settings and preferences.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-white text-center">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-white">
                  {user?.email?.[0].toUpperCase() || 'U'}
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">{user?.email?.split('@')[0]}</h2>
              <p className="text-indigo-600 font-semibold text-sm mb-6">{user?.role?.toUpperCase()}</p>

              <button
                onClick={logout}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-white">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-indigo-50 rounded-lg">🛡️</span> Account Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">
                      {stat.icon}
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-slate-800 font-semibold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200">
              <h3 className="text-lg font-bold mb-2">Need help?</h3>
              <p className="text-indigo-100 mb-6 text-sm">Our support team is always ready to help you with your account management.</p>
              <button className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold text-sm transition-all border border-white/30">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
