import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const JobPortal = () => {
    const { apiCall } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        role: '',
        name: '',
        contact: '',
        email: '',
        gender: '',
        experience: '',
        count: '',
        status: 'Active',
        applicants: 0
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/jobListings');
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching jobs:", error);
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
            if (editingJob) {
                await apiCall(`/jobListings/${editingJob.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Job listing updated successfully!');
            } else {
                await apiCall('/jobListings', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Job listing posted successfully!');
            }
            fetchJobs();
            closeModal();
        } catch (error) {
            console.error("Error saving job:", error);
            alert(error.message || "Failed to save job listing");
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title || '',
            role: job.role || '',
            name: job.name || '',
            contact: job.contact || '',
            email: job.email || '',
            gender: job.gender || '',
            experience: job.experience || '',
            count: job.count || '',
            status: job.status || 'Active',
            applicants: job.applicants || 0
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job listing?')) return;

        try {
            await apiCall(`/jobListings/${id}`, {
                method: 'DELETE'
            });
            alert('Job listing deleted successfully!');
            fetchJobs();
        } catch (error) {
            console.error("Error deleting job:", error);
            alert(error.message || "Failed to delete job listing");
        }
    };

    const openModal = () => {
        setEditingJob(null);
        setFormData({
            title: '',
            role: '',
            name: '',
            contact: '',
            email: '',
            gender: '',
            experience: '',
            count: '',
            status: 'Active',
            applicants: 0
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingJob(null);
    };

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Job Portal</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage active job listings and applicants.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-sky-500 text-white rounded-xl shadow-lg shadow-sky-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Post New Job
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center p-8 text-slate-400">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-slate-400">No job listings found. Click "Post New Job" to add one.</div>
                ) : jobs.map((job) => (
                    <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="font-bold text-lg text-slate-800">{job.title}</h2>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${job.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="bg-slate-100 p-1 rounded">👤</span> {job.role}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="bg-slate-100 p-1 rounded">💼</span> {job.experience} Exp
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="bg-slate-100 p-1 rounded">👥</span> {job.applicants} Applicants
                            </div>
                            {job.count && (
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="bg-slate-100 p-1 rounded">📊</span> {job.count} Positions
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="text-xs text-slate-400">
                                Posted by <span className="font-semibold text-slate-600">{job.name}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(job)}
                                className="flex-1 text-sky-500 hover:text-sky-700 text-sm font-bold bg-sky-50 py-2 rounded-lg hover:bg-sky-100 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(job.id)}
                                className="flex-1 text-red-500 hover:text-red-700 text-sm font-bold bg-red-50 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingJob ? "Edit Job Listing" : "Post New Job"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g., Senior Software Engineer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Role *</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="e.g., Full Stack Developer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Required *</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="e.g., 2-5 years"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Positions</label>
                            <input
                                type="text"
                                name="count"
                                value={formData.count}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="e.g., 5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Gender Preference</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">Any</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Posted By (Name) *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="e.g., John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="e.g., hr@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Number *</label>
                            <input
                                type="tel"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="e.g., +1234567890"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Closed">Closed</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Current Applicants</label>
                            <input
                                type="number"
                                name="applicants"
                                value={formData.applicants}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition-colors"
                        >
                            {editingJob ? 'Update Job' : 'Post Job'}
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

export default JobPortal;
