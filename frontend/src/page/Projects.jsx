// src/pages/Projects.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";

// Video Background Component
const HeroSection = () => (
    <div className="relative h-[250px] md:h-[400px] rounded-[2rem] overflow-hidden mb-10 shadow-[0_20px_50px_rgba(79,70,229,0.2)] group">
        <img
            src="https://thumbs.dreamstime.com/b/success-goal-concepts-strategic-planning-management-efficient-business-growth-analysis-development-financial-256506793.jpg"
            alt="Office"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-indigo-900/40 to-transparent backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 text-white">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 animate-fade-in-up">Project Pulse </h1>
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl font-light animate-fade-in-up delay-100">
                Track progress, manage teams, and deliver excellence.
            </p>
        </div>
    </div>
);

// Project Form Component
const ProjectForm = ({ project, onClose, onSubmit, departments }) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        department: '',
        status: 'Planned',
        priority: 'Medium',
        startDate: '',
        endDate: '',
        budget: '',
        progress: '',
        manager: { name: '', email: '' },
        tags: []
    });
    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (project) {
            setForm({
                title: project.title || '',
                description: project.description || '',
                department: project.department?._id || project.department || '',
                status: project.status || 'Planned',
                priority: project.priority || 'Medium',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
                budget: project.budget || '',
                progress: project.progress || '',
                manager: project.manager || { name: '', email: '' },
                tags: project.tags || []
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('manager.')) {
            const field = name.split('.')[1];
            setForm(prev => ({
                ...prev,
                manager: { ...prev.manager, [field]: value }
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            setForm(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Project title is required';
        if (!form.department) newErrors.department = 'Please select a department';
        if (!form.startDate) newErrors.startDate = 'Start date is required';
        if (!form.endDate) newErrors.endDate = 'End date is required';

        if (form.startDate && form.endDate) {
            const start = new Date(form.startDate);
            const end = new Date(form.endDate);
            if (end < start) newErrors.endDate = 'End date must be after start date';
        }

        if (form.budget && (isNaN(form.budget) || parseFloat(form.budget) < 0)) {
            newErrors.budget = 'Budget must be a positive number';
        }

        if (form.progress && (isNaN(form.progress) || parseFloat(form.progress) < 0 || parseFloat(form.progress) > 100)) {
            newErrors.progress = 'Progress must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const payload = {
                ...form,
                budget: form.budget ? parseFloat(form.budget) : 0,
                progress: form.progress ? parseFloat(form.progress) : 0
            };
            onSubmit(payload);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-lg font-bold">
                            {project ? '✏️ Edit Project' : '🚀 Create New Project'}
                        </h2>
                        <p className="text-sm text-white/90 mt-1">
                            {project ? 'Update project details' : 'Define your project goals and timeline'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <span className="text-lg">×</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Enter project title"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department *
                            </label>
                            <select
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.department ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name} ({dept.code})
                                    </option>
                                ))}
                            </select>
                            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                        </div>
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date *
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.startDate ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            />
                            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date *
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.endDate ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            />
                            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                        </div>
                    </div>

                    {/* Budget & Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Budget (₹)
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                placeholder="e.g., 100000"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.budget ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            />
                            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Progress (%)
                            </label>
                            <input
                                type="number"
                                name="progress"
                                value={form.progress}
                                onChange={handleChange}
                                placeholder="0-100"
                                min="0"
                                max="100"
                                className={`w-full px-4 py-3 rounded-xl border ${errors.progress ? 'border-red-500' : 'border-gray-200'} bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            />
                            {errors.progress && <p className="text-red-500 text-xs mt-1">{errors.progress}</p>}
                        </div>
                    </div>

                    {/* Manager Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Manager Name
                            </label>
                            <input
                                type="text"
                                name="manager.name"
                                value={form.manager.name}
                                onChange={handleChange}
                                placeholder="Manager's name"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Manager Email
                            </label>
                            <input
                                type="email"
                                name="manager.email"
                                value={form.manager.email}
                                onChange={handleChange}
                                placeholder="manager@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Add a tag and press Enter"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-indigo-500 hover:text-indigo-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the project goals, objectives, and requirements..."
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all hover:scale-[1.02]"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                        >
                            {project ? 'Update Project' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Project View Modal
const ProjectViewModal = ({ project, onClose }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'Planned': 'bg-blue-100 text-blue-800 border-blue-200',
            'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'On Hold': 'bg-orange-100 text-orange-800 border-orange-200',
            'Completed': 'bg-green-100 text-green-800 border-green-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'High': 'bg-orange-100 text-orange-800',
            'Critical': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    if (!project) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-lg font-bold">Project Details</h2>
                        <p className="text-sm text-white/90 mt-1">Complete information about {project.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <span className="text-lg">×</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{project.title}</h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-gray-500">Department:</span>
                                    <p className="font-medium text-gray-900">
                                        {project.department?.name} ({project.department?.code})
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                                        {project.status}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                                        {project.priority} Priority
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Timeline:</span>
                                    <p className="font-medium text-gray-900">
                                        {formatDate(project.startDate)} → {formatDate(project.endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Progress</p>
                                    <p className="text-2xl font-bold text-gray-900">{project.progress || 0}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Budget</p>
                                    <p className="text-xl font-bold text-green-600">₹{project.budget?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Days Left</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {Math.max(0, Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)))} days
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Created</p>
                                    <p className="text-sm font-bold text-gray-900">{formatDate(project.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Description</h3>
                            <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
                        </div>
                    )}

                    {/* Manager Information */}
                    {project.manager?.name && (
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Project Manager</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500">Name:</span>
                                    <p className="font-medium text-gray-900">{project.manager.name}</p>
                                </div>
                                {project.manager.email && (
                                    <div>
                                        <span className="text-xs text-gray-500">Email:</span>
                                        <p className="font-medium text-gray-900">{project.manager.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-5 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Project Card Component
const ProjectCard = ({ project, onEdit, onDelete, onView, onUpdateStatus }) => {
    const getStatusColor = (status) => {
        const colors = {
            'Planned': 'bg-blue-100 text-blue-800 border-blue-200',
            'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'On Hold': 'bg-orange-100 text-orange-800 border-orange-200',
            'Completed': 'bg-green-100 text-green-800 border-green-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-green-100 text-green-800',
            'Medium': 'bg-yellow-100 text-yellow-800',
            'High': 'bg-orange-100 text-orange-800',
            'Critical': 'bg-red-100 text-red-800'
        };
        return colors[priority] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
        });
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Card Header */}
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600">
                            {project.department?.name} • {formatDate(project.startDate)} - {formatDate(project.endDate)}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(project.priority)}`}>
                            {project.priority}
                        </span>
                    </div>
                </div>

                {project.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description}
                    </p>
                )}
            </div>

            {/* Card Body */}
            <div className="p-5">
                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span>Progress</span>
                        <span>{project.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${project.progress >= 80 ? 'bg-green-500' :
                                project.progress >= 50 ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                }`}
                            style={{ width: `${project.progress || 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                            {project.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                                    +{project.tags.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Budget & Manager */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs text-gray-500">Budget</p>
                        <p className="text-sm font-bold text-green-600">₹{project.budget?.toLocaleString() || '0'}</p>
                    </div>
                    {project.manager?.name && (
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Manager</p>
                            <p className="text-sm font-medium text-gray-900">{project.manager.name}</p>
                        </div>
                    )}
                </div>

                {/* Actions - Added View Button */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onView(project)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>👁️</span> View
                    </button>
                    <button
                        onClick={() => onEdit(project)}
                        className="flex-1 py-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>✏️</span> Edit
                    </button>
                    <button
                        onClick={() => onUpdateStatus(project)}
                        className="flex-1 py-2 rounded-lg border border-yellow-200 bg-yellow-50 text-sm font-medium text-yellow-600 hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>🔄</span> Status
                    </button>
                    <button
                        onClick={() => onDelete(project._id)}
                        className="flex-1 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>🗑️</span> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedProject, setSelectedProject] = useState(null);
    const [viewingProject, setViewingProject] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { apiCall } = useAuth();

    // Load projects and departments
    const loadProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (priorityFilter !== 'all') params.append('priority', priorityFilter);
            if (search) params.append('search', search);

            const [projectsData, departmentsData] = await Promise.all([
                apiCall(`/projects?${params.toString()}`),
                apiCall(`/departments`)
            ]);

            setProjects(projectsData.projects);
            setStats(projectsData.stats);
            setDepartments(departmentsData.departments || []);
        } catch (err) {
            console.error('Failed to load data:', err);
            // Error managed by apiCall
        } finally {
            setIsLoading(false);
        }
    }, [search, statusFilter, priorityFilter, apiCall]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    // Form handlers
    const handleSubmit = async (formData) => {
        try {
            if (selectedProject) {
                await apiCall(`/projects/${selectedProject._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Project updated successfully!');
            } else {
                await apiCall(`/projects`, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Project created successfully!');
            }
            resetForm();
            loadProjects();
        } catch (err) {
            console.error('Failed to save project:', err);
            alert(err.message || 'Failed to save project');
        }
    };

    const resetForm = () => {
        setSelectedProject(null);
        setIsFormOpen(false);
    };

    const handleEdit = (project) => {
        setSelectedProject(project);
        setIsFormOpen(true);
    };

    const handleView = (project) => {
        setViewingProject(project);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await apiCall(`/projects/${id}`, { method: 'DELETE' });
            alert('Project deleted successfully!');
            loadProjects();
        } catch (err) {
            console.error('Failed to delete project:', err);
            alert(err.message || 'Failed to delete project');
        }
    };

    const handleUpdateStatus = async (project) => {
        const statuses = ['Planned', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
        const currentIndex = statuses.indexOf(project.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];

        if (!window.confirm(`Update project status to ${nextStatus}?`)) return;

        try {
            await apiCall(`/projects/${project._id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: nextStatus })
            });
            alert(`Project status updated to ${nextStatus}`);
            loadProjects();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert(err.message || 'Failed to update status');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-6">
            {/* Hero Section */}
            <HeroSection />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 animate-slide-down">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Project Management
                            </h1>
                            <p className="text-gray-600">
                                Track, manage, and deliver projects with precision
                            </p>
                        </div>

                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-lg">🚀</span>
                                Create New Project
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search projects..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 placeholder:text-gray-400"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                            >
                                <option value="all">All Status</option>
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>

                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                            >
                                <option value="all">All Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>

                            <button
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('all');
                                    setPriorityFilter('all');
                                }}
                                className="px-4 py-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white text-gray-700 font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 animate-slide-up">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
                    </div>
                    {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">In Progress</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.inProgress || 0}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-green-600">{stats.completed || 0}</p>
                    </div> */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Average Progress</p>
                        <p className="text-3xl font-bold text-indigo-600">{stats.averageProgress || 0}%</p>
                    </div>
                </div>

                {/* Projects Grid */}
                <main className="animate-slide-up animation-delay-100">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                            <p className="text-gray-600 mb-4">
                                {search || statusFilter !== 'all' || priorityFilter !== 'all'
                                    ? 'Try different filters'
                                    : 'Create your first project to get started'}
                            </p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-6 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                            >
                                Create First Project
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project, index) => (
                                <div
                                    key={project._id}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <ProjectCard
                                        project={project}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onView={handleView}
                                        onUpdateStatus={handleUpdateStatus}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>
                        Showing {projects.length} of {stats.total || 0} projects
                        {search && ` • Searching: "${search}"`}
                        {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
                        {priorityFilter !== 'all' && ` • Priority: ${priorityFilter}`}
                    </p>
                </footer>
            </div>

            {/* Modals */}
            {isFormOpen && (
                <ProjectForm
                    project={selectedProject}
                    onClose={resetForm}
                    onSubmit={handleSubmit}
                    departments={departments}
                />
            )}

            {viewingProject && (
                <ProjectViewModal
                    project={viewingProject}
                    onClose={() => setViewingProject(null)}
                />
            )}

            {/* Global Animations */}
            <style jsx global>{`
                @keyframes slide-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-down { animation: slide-down 0.6s ease-out; }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
                .animate-fade-up { animation: fade-in-up 0.6s ease-out; }
                .animation-delay-100 { animation-delay: 100ms; }
                .line-clamp-1 { 
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 { 
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default Projects;