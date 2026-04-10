import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../../components/Modal';

const Reports = () => {
    const { apiCall } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Monthly',
        createdOn: ''
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/recruitmentReports');
            setReports(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingReport) {
                await apiCall(`/recruitmentReports/${editingReport.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Report updated successfully!');
            } else {
                const reportData = {
                    ...formData,
                    createdOn: formData.createdOn || new Date().toISOString().split('T')[0]
                };
                await apiCall('/recruitmentReports', {
                    method: 'POST',
                    body: JSON.stringify(reportData)
                });
                alert('Report created successfully!');
            }
            fetchReports();
            closeModal();
        } catch (error) {
            console.error("Error saving report:", error);
            alert(error.message || "Failed to save report");
        }
    };

    const handleEdit = (report) => {
        setEditingReport(report);
        setFormData({
            name: report.name || '',
            type: report.type || 'Monthly',
            createdOn: report.createdOn || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;

        try {
            await apiCall(`/recruitmentReports/${id}`, {
                method: 'DELETE'
            });
            alert('Report deleted successfully!');
            fetchReports();
        } catch (error) {
            console.error("Error deleting report:", error);
            alert(error.message || "Failed to delete report");
        }
    };

    const openModal = () => {
        setEditingReport(null);
        setFormData({
            name: '',
            type: 'Monthly',
            createdOn: new Date().toISOString().split('T')[0]
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingReport(null);
    };

    const data = [
        { name: 'Jan', hired: 4 },
        { name: 'Feb', hired: 7 },
        { name: 'Mar', hired: 5 },
        { name: 'Apr', hired: 10 },
        { name: 'May', hired: 12 },
        { name: 'Jun', hired: 8 },
    ];

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Recruitment Reports</h1>
                    <p className="text-sm text-slate-400 mt-1">Analytics and performance metrics.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Generate Report
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Hiring Velocity (6 Months)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="hired" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6">Generated Reports</h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {loading ? (
                            <p className="text-center text-slate-400">Loading reports...</p>
                        ) : reports.length === 0 ? (
                            <p className="text-center text-slate-400">No reports found. Click "Generate Report" to create one.</p>
                        ) : reports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm">
                                        📄
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800">{report.name}</h4>
                                        <p className="text-xs text-slate-400">
                                            {report.type} • Created: {report.createdOn}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(report)}
                                        className="text-blue-500 hover:text-blue-700 text-sm font-bold px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-bold px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button className="text-emerald-500 hover:text-emerald-700 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingReport ? "Edit Report" : "Generate New Report"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Report Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="e.g., Q1 2026 Recruitment Report"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Report Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Created On *</label>
                        <input
                            type="date"
                            name="createdOn"
                            value={formData.createdOn}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-sm text-blue-700">
                                <p className="font-semibold mb-1">Report Generation</p>
                                <p className="text-xs">This will create a report entry. The actual report data will be compiled based on current recruitment metrics.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            {editingReport ? 'Update Report' : 'Generate Report'}
                        </button>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Reports;
