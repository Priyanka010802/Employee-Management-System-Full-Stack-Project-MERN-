import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const Companies = () => {
    const { apiCall } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        hrName: '',
        hrEmail: '',
        hrContact: '',
        location: '',
        platform: '',
        roles: '',
        status: 'Active',
        companyHistory: '',
        applications: 0,
        shortlisted: 0,
        placed: 0
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/companies');
            setCompanies(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching companies:", error);
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
            if (editingCompany) {
                await apiCall(`/companies/${editingCompany.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Company updated successfully!');
            } else {
                await apiCall('/companies', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Company added successfully!');
            }
            fetchCompanies();
            closeModal();
        } catch (error) {
            console.error("Error saving company:", error);
            alert(error.message || "Failed to save company");
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name || '',
            hrName: company.hrName || '',
            hrEmail: company.hrEmail || '',
            hrContact: company.hrContact || '',
            location: company.location || '',
            platform: company.platform || '',
            roles: company.roles || '',
            status: company.status || 'Active',
            companyHistory: company.companyHistory || '',
            applications: company.applications || 0,
            shortlisted: company.shortlisted || 0,
            placed: company.placed || 0
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this company?')) return;

        try {
            await apiCall(`/companies/${id}`, {
                method: 'DELETE'
            });
            alert('Company removed successfully!');
            fetchCompanies();
        } catch (error) {
            console.error("Error deleting company:", error);
            alert(error.message || "Failed to remove company");
        }
    };

    const openModal = () => {
        setEditingCompany(null);
        setFormData({
            name: '',
            hrName: '',
            hrEmail: '',
            hrContact: '',
            location: '',
            platform: '',
            roles: '',
            status: 'Active',
            companyHistory: '',
            applications: 0,
            shortlisted: 0,
            placed: 0
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCompany(null);
    };

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Partner Companies</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage company details and HR contacts.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Add Company
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full text-center p-8 text-slate-400">Loading companies...</div>
                ) : companies.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-slate-400">No companies found. Click "Add Company" to add one.</div>
                ) : companies.map((company) => (
                    <div key={company.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <span className="text-6xl">🏢</span>
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{company.name}</h2>
                                <p className="text-sm text-indigo-500 font-semibold">{company.location}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${company.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                {company.status}
                            </span>
                        </div>

                        <p className="text-slate-500 text-sm mb-6 line-clamp-2">{company.companyHistory || 'No description available'}</p>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-slate-50 p-3 rounded-xl text-center">
                                <div className="text-xs text-slate-400 uppercase font-bold">Applied</div>
                                <div className="text-lg font-bold text-slate-800">{company.applications}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl text-center">
                                <div className="text-xs text-slate-400 uppercase font-bold">Shortlisted</div>
                                <div className="text-lg font-bold text-indigo-600">{company.shortlisted}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl text-center">
                                <div className="text-xs text-slate-400 uppercase font-bold">Placed</div>
                                <div className="text-lg font-bold text-emerald-600">{company.placed}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                HR
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800">{company.hrName}</p>
                                <p className="text-xs text-slate-400">{company.hrEmail}</p>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(company)}
                                    className="text-indigo-500 hover:text-indigo-700 text-sm font-bold"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(company.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCompany ? "Edit Company" : "Add New Company"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Google"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., New York, NY"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Company Description</label>
                        <textarea
                            name="companyHistory"
                            value={formData.companyHistory}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Brief description of the company..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">HR Name *</label>
                            <input
                                type="text"
                                name="hrName"
                                value={formData.hrName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Jane Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">HR Email *</label>
                            <input
                                type="email"
                                name="hrEmail"
                                value={formData.hrEmail}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., hr@company.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">HR Contact *</label>
                            <input
                                type="tel"
                                name="hrContact"
                                value={formData.hrContact}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., +1234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Platform</label>
                            <input
                                type="text"
                                name="platform"
                                value={formData.platform}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., LinkedIn"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Roles Available</label>
                            <input
                                type="text"
                                name="roles"
                                value={formData.roles}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., Software Engineer, PM"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Applications</label>
                            <input
                                type="number"
                                name="applications"
                                value={formData.applications}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Shortlisted</label>
                            <input
                                type="number"
                                name="shortlisted"
                                value={formData.shortlisted}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Placed</label>
                            <input
                                type="number"
                                name="placed"
                                value={formData.placed}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition-colors"
                        >
                            {editingCompany ? 'Update Company' : 'Add Company'}
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

export default Companies;
