import React, { useState, useEffect } from 'react';
import { API_BASE } from "../context/AuthContext";
import { useAuth } from '../context/AuthContext';

const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const { user, getAuthHeader } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch(`${API_BASE}/sessions`, {
                headers: getAuthHeader()
            });
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleKillSession = async (sessionId) => {
        if (!window.confirm("Are you sure you want to terminate this session?")) return;
        try {
            await fetch(`${API_BASE}/sessions/${sessionId}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            setSessions(sessions.filter(s => s.id !== sessionId));
        } catch (error) {
            console.error("Failed to kill session", error);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Active Sessions</h1>
                    <p className="text-slate-500">Monitor and manage user login sessions.</p>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg font-medium">
                    {sessions.length} Active Users
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">User Email</th>
                                <th className="px-6 py-4">Login Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-10">Loading sessions...</td></tr>
                            ) : sessions.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-10">No active sessions found.</td></tr>
                            ) : (
                                sessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {session.email}
                                            {session.email === user?.email && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>}
                                        </td>
                                        <td className="px-6 py-4">{new Date(session.loginAt || session.createdAt).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleKillSession(session.id)}
                                                className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium"
                                            >
                                                Revoke Access
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Sessions;
