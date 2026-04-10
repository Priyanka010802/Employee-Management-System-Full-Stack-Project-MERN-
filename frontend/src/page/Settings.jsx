import React from 'react';

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Account Settings</h1>
            <p className="text-slate-500 mb-8">Manage your profile, security preferences, and data privacy.</p>

            <div className="space-y-6">
                {/* Profile Section */}
                <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>👤</span> Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" className="w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm" defaultValue="Maria Garcia" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" className="w-full rounded-lg border-slate-300 bg-slate-50 p-2.5 text-sm" defaultValue="maria.g@company.com" disabled />
                        </div>
                    </div>
                </section>

                {/* Security Section */}
                <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>🔒</span> Security
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">Two-Factor Authentication</h3>
                                <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Enable</button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">Change Password</h3>
                                <p className="text-xs text-slate-500">Last changed 3 months ago.</p>
                            </div>
                            <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Update</button>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>🔔</span> Notifications
                    </h2>
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
                            <span className="text-sm text-slate-700">Email me about new tasks</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
                            <span className="text-sm text-slate-700">Team announcements</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500" />
                            <span className="text-sm text-slate-700">Marketing updates</span>
                        </label>
                    </div>
                </section>

                <div className="flex justify-end gap-3 pt-4">
                    <button className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                    <button className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-200">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
