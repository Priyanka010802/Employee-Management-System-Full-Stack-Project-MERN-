import React from 'react';

const Help = () => {
    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-slate-800 mb-3">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for help articles..."
                        className="w-full px-5 py-3 rounded-full border border-slate-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                    <button className="absolute right-2 top-1.5 bg-emerald-500 text-white p-2 rounded-full w-8 h-8 flex items-center justify-center">🔍</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-4">📚</div>
                    <h3 className="font-bold text-slate-800 mb-2">Knowledge Base</h3>
                    <p className="text-sm text-slate-500">Guides and tutorials to help you get the most out of the platform.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-4">🔧</div>
                    <h3 className="font-bold text-slate-800 mb-2">Troubleshooting</h3>
                    <p className="text-sm text-slate-500">Solutions to common issues and technical problems.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-3xl mb-4">💬</div>
                    <h3 className="font-bold text-slate-800 mb-2">Live Chat</h3>
                    <p className="text-sm text-slate-500">Chat with our support team in real-time for immediate assistance.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="flex cursor-pointer items-center justify-between bg-slate-50 p-4 font-medium text-slate-900 transition hover:bg-slate-100">
                            How do I reset my password?
                            <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="border-t border-slate-200 p-4 text-sm text-slate-600 bg-white">
                            Go to Settings {'>'} Security {'>'} Change Password. If you cannot login, use the "Forgot Password" link on the login page.
                        </div>
                    </details>
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="flex cursor-pointer items-center justify-between bg-slate-50 p-4 font-medium text-slate-900 transition hover:bg-slate-100">
                            How is attendance calculated?
                            <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="border-t border-slate-200 p-4 text-sm text-slate-600 bg-white">
                            Attendance is tracked based on your Check-In and Check-Out times. The system automatically marks check-out if you are idle for more than 10 minutes (Zira Monitoring).
                        </div>
                    </details>
                    <details className="group border border-slate-200 rounded-xl overflow-hidden">
                        <summary className="flex cursor-pointer items-center justify-between bg-slate-50 p-4 font-medium text-slate-900 transition hover:bg-slate-100">
                            Can I edit a submitted report?
                            <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="border-t border-slate-200 p-4 text-sm text-slate-600 bg-white">
                            Reports are locked 24 hours after submission. Contact your HR manager for edits to locked reports.
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default Help;
