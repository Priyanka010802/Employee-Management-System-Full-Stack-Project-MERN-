// src/pages/Departments.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "../context/AuthContext";

// Department Form Component
const DepartmentForm = ({ department, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: department?.name || '',
        code: department?.code || '',
        description: department?.description || '',
        manager: {
            name: department?.manager?.name || '',
            email: department?.manager?.email || '',
            phone: department?.manager?.phone || ''
        },
        location: department?.location || '',
        floor: department?.floor || '',
        email: department?.email || '',
        phone: department?.phone || '',
        budget: department?.budget || 0,
        establishedDate: department?.establishedDate ? new Date(department.establishedDate).toISOString().split('T')[0] : '',
        status: department?.status || 'active'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900">{department ? 'Edit Department' : 'Add New Department'}</h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Department Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="e.g. Engineering"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Department Code</label>
                            <input
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="e.g. ENG (Auto-generated if empty)"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Manager Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                name="manager.name"
                                value={formData.manager.name}
                                onChange={handleChange}
                                placeholder="Manager Name"
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                            <input
                                name="manager.email"
                                value={formData.manager.email}
                                onChange={handleChange}
                                placeholder="Manager Email"
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                            <input
                                name="manager.phone"
                                value={formData.manager.phone}
                                onChange={handleChange}
                                placeholder="Manager Phone"
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="e.g. Building A"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Floor</label>
                            <input
                                name="floor"
                                value={formData.floor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="e.g. 4"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Budget (₹)</label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">Established Date</label>
                            <input
                                type="date"
                                name="establishedDate"
                                value={formData.establishedDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                        >
                            {department ? 'Update' : 'Create'} Department
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Department Card Component
const DepartmentCard = ({ department, onEdit, onDelete, onToggleStatus, onView }) => {
    const statusColors = {
        active: 'bg-green-100 text-green-800 border-green-200',
        inactive: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{department.name}</h3>
                        <p className="text-sm text-gray-600 font-medium">{department.code}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[department.status]}`}>
                        {department.status}
                    </span>
                </div>

                {department.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                        {department.description}
                    </p>
                )}
            </div>

            {/* Card Body */}
            <div className="p-5">
                {/* Manager Info */}
                {department.manager?.name && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Department Manager</p>
                        <p className="text-sm font-medium text-gray-900">{department.manager.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {department.manager.email && (
                                <span className="text-xs text-gray-600">📧 {department.manager.email}</span>
                            )}
                            {department.manager.phone && (
                                <span className="text-xs text-gray-600">📞 {department.manager.phone}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Location Info */}
                {(department.location || department.floor) && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span>📍</span>
                            <span>{department.location || 'Location not specified'}</span>
                            {department.floor && (
                                <span className="text-gray-500">• Floor {department.floor}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className="mb-4 space-y-2">
                    {department.email && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">📧</span>
                            <span className="text-gray-700 truncate">{department.email}</span>
                        </div>
                    )}
                    {department.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">📞</span>
                            <span className="text-gray-700">{department.phone}</span>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Employees</p>
                        <p className="text-lg font-bold text-gray-900">{department.employeeCount || 0}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">Budget</p>
                        <p className="text-lg font-bold text-gray-900">
                            ₹{department.budget ? department.budget.toLocaleString() : '0'}
                        </p>
                    </div>
                    <div className="text-center p-2 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">Projects</p>
                        <p className="text-lg font-bold text-gray-900">{department.projectsCount || 0}</p>
                    </div>
                </div>

                {/* Established Date */}
                {department.establishedDate && (
                    <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Established</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(department.establishedDate)}</p>
                    </div>
                )}

                {/* Actions - Added View Button */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                        onClick={() => onView(department)}
                        className="flex-1 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>👁️</span> View
                    </button>
                    <button
                        onClick={() => onEdit(department)}
                        className="flex-1 py-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>✏️</span> Edit
                    </button>
                    <button
                        onClick={() => onToggleStatus(department)}
                        className="flex-1 py-2 rounded-lg border border-yellow-200 bg-yellow-50 text-sm font-medium text-yellow-600 hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>🔄</span> Status
                    </button>
                    <button
                        onClick={() => onDelete(department._id)}
                        className="flex-1 py-2 rounded-lg border border-red-200 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <span>🗑️</span> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Department View Modal
const DepartmentViewModal = ({ department, onClose }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!department) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-slide-up">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl p-5 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-lg font-bold">Department Details</h2>
                        <p className="text-sm text-white/90 mt-1">Complete information about {department.name}</p>
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
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{department.name}</h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-gray-500">Department Code:</span>
                                    <p className="font-medium text-gray-900">{department.code}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Status:</span>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${department.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                                        department.status === 'inactive' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                            'bg-gray-100 text-gray-800 border-gray-200'
                                        } border`}>
                                        {department.status}
                                    </span>
                                </div>
                                {department.establishedDate && (
                                    <div>
                                        <span className="text-xs text-gray-500">Established:</span>
                                        <p className="font-medium text-gray-900">{formatDate(department.establishedDate)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Employees</p>
                                    <p className="text-2xl font-bold text-gray-900">{department.employeeCount || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Projects</p>
                                    <p className="text-2xl font-bold text-gray-900">{department.projectsCount || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Budget</p>
                                    <p className="text-xl font-bold text-green-600">₹{department.budget?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500">Status</p>
                                    <p className="text-sm font-bold text-gray-900 capitalize">{department.status}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {department.description && (
                        <div className="bg-white border border-gray-200 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Description</h3>
                            <p className="text-gray-600">{department.description}</p>
                        </div>
                    )}

                    {/* Manager Information */}
                    {department.manager?.name && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-xl p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Department Manager</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">Name:</span>
                                        <p className="font-medium text-gray-900">{department.manager.name}</p>
                                    </div>
                                    {department.manager.email && (
                                        <div>
                                            <span className="text-xs text-gray-500">Email:</span>
                                            <p className="font-medium text-gray-900">{department.manager.email}</p>
                                        </div>
                                    )}
                                    {department.manager.phone && (
                                        <div>
                                            <span className="text-xs text-gray-500">Phone:</span>
                                            <p className="font-medium text-gray-900">{department.manager.phone}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="bg-gray-50 rounded-xl p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Location Details</h3>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-xs text-gray-500">Location:</span>
                                        <p className="font-medium text-gray-900">{department.location || 'Not specified'}</p>
                                    </div>
                                    {department.floor && (
                                        <div>
                                            <span className="text-xs text-gray-500">Floor:</span>
                                            <p className="font-medium text-gray-900">{department.floor}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {department.email && (
                            <div className="bg-blue-50 rounded-xl p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-2">Department Contact</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500">📧</span>
                                        <span className="font-medium text-gray-900">{department.email}</span>
                                    </div>
                                    {department.phone && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500">📞</span>
                                            <span className="font-medium text-gray-900">{department.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Additional Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-gray-500">Created:</span>
                                    <p className="font-medium text-gray-900">{formatDate(department.createdAt)}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Last Updated:</span>
                                    <p className="font-medium text-gray-900">{formatDate(department.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
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

// Main Component
const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [viewingDepartment, setViewingDepartment] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const { apiCall } = useAuth();

    // Load departments
    const loadDepartments = useCallback(async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (search) params.append('search', search);

            const data = await apiCall(`/departments?${params.toString()}`);
            setDepartments(data.departments);
            setStats(data.stats);
        } catch (err) {
            console.error('Failed to load departments:', err);
            // Error handled by apiCall or custom alert
        } finally {
            setIsLoading(false);
        }
    }, [search, statusFilter, apiCall]);

    useEffect(() => {
        loadDepartments();
    }, [loadDepartments]);

    // Form handlers
    const handleSubmit = async (formData) => {
        try {
            if (selectedDepartment) {
                await apiCall(`/departments/${selectedDepartment._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Department updated successfully!');
            } else {
                await apiCall(`/departments`, {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Department created successfully!');
            }
            resetForm();
            loadDepartments();
        } catch (err) {
            console.error('Failed to save department:', err);
            alert(err.message || 'Failed to save department');
        }
    };

    const resetForm = () => {
        setSelectedDepartment(null);
        setIsFormOpen(false);
    };

    const handleEdit = (dept) => {
        setSelectedDepartment(dept);
        setIsFormOpen(true);
    };

    const handleView = (dept) => {
        setViewingDepartment(dept);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;

        try {
            await apiCall(`/departments/${id}`, { method: 'DELETE' });
            alert('Department deleted successfully!');
            loadDepartments();
        } catch (err) {
            console.error('Failed to delete department:', err);
            alert(err.message || 'Failed to delete department');
        }
    };

    const handleToggleStatus = async (department) => {
        const newStatus = department.status === 'active' ? 'inactive' : 'active';
        if (!window.confirm(`Change department status to ${newStatus}?`)) return;

        try {
            await apiCall(`/departments/${department._id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...department, status: newStatus })
            });
            alert(`Department status updated to ${newStatus}`);
            loadDepartments();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert(err.message || 'Failed to update status');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8 animate-slide-down">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Departments Management
                            </h1>
                            <p className="text-gray-600">
                                Organize and manage your company departments with detailed information
                            </p>
                        </div>

                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="text-lg">🏢</span>
                                Add New Department
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search departments by name, code, manager, or location..."
                                    className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-400"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="archived">Archived</option>
                            </select>

                            <button
                                onClick={() => {
                                    setSearch('');
                                    setStatusFilter('all');
                                }}
                                className="px-4 py-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white text-gray-700 font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </header>

                {/* Updated Stats - Removed total employees & projects, added inactive count */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 animate-slide-up">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Total Departments</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.total || 0}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Active</p>
                        <p className="text-3xl font-bold text-green-600">{stats.active || 0}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Inactive</p>
                        <p className="text-3xl font-bold text-yellow-600">{stats.inactive || 0}</p>
                    </div>
                    {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
                        <p className="text-sm text-gray-600 mb-1">Archived</p>
                        <p className="text-3xl font-bold text-gray-600">{stats.archived || 0}</p>
                    </div> */}
                </div>

                {/* Departments Grid */}
                <main className="animate-slide-up animation-delay-100">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600">Loading departments...</p>
                        </div>
                    ) : departments.length === 0 ? (
                        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
                            <div className="text-5xl mb-4">🏢</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
                            <p className="text-gray-600 mb-4">
                                {search || statusFilter !== 'all' ? 'Try different filters' : 'Create your first department to get started'}
                            </p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                Add First Department
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {departments.map((dept, index) => (
                                <div
                                    key={dept._id}
                                    className="animate-fade-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <DepartmentCard
                                        department={dept}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                        onView={handleView}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>
                        Showing {departments.length} of {stats.total || 0} departments
                        {search && ` • Searching: "${search}"`}
                        {statusFilter !== 'all' && ` • Status: ${statusFilter}`}
                    </p>
                </footer>
            </div>

            {/* Modals */}
            {isFormOpen && (
                <DepartmentForm
                    department={selectedDepartment}
                    onClose={resetForm}
                    onSubmit={handleSubmit}
                />
            )}

            {viewingDepartment && (
                <DepartmentViewModal
                    department={viewingDepartment}
                    onClose={() => setViewingDepartment(null)}
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
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-slide-down { animation: slide-down 0.6s ease-out; }
                .animate-slide-up { animation: slide-up 0.6s ease-out; }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }
                .animate-fade-up { animation: fade-up 0.6s ease-out; }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-100 { animation-delay: 100ms; }
                .animation-delay-2000 { animation-delay: 2000ms; }
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

export default Departments;