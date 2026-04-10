import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const Offers = () => {
    const { apiCall } = useAuth();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [formData, setFormData] = useState({
        candidateName: '',
        email: '',
        position: '',
        company: '',
        offerDate: '',
        salary: '',
        status: 'Pending'
    });

    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/offers');
            setOffers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching offers:", error);
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
            if (editingOffer) {
                await apiCall(`/offers/${editingOffer.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Offer updated successfully!');
            } else {
                await apiCall('/offers', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Offer created successfully!');
            }
            fetchOffers();
            closeModal();
        } catch (error) {
            console.error("Error saving offer:", error);
            alert(error.message || "Failed to save offer");
        }
    };

    const handleEdit = (offer) => {
        setEditingOffer(offer);
        setFormData({
            candidateName: offer.candidateName || '',
            email: offer.email || '',
            position: offer.position || '',
            company: offer.company || '',
            offerDate: offer.offerDate || '',
            salary: offer.salary || '',
            status: offer.status || 'Pending'
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;

        try {
            await apiCall(`/offers/${id}`, {
                method: 'DELETE'
            });
            alert('Offer deleted successfully!');
            fetchOffers();
        } catch (error) {
            console.error("Error deleting offer:", error);
            alert(error.message || "Failed to delete offer");
        }
    };

    const openModal = () => {
        setEditingOffer(null);
        setFormData({
            candidateName: '',
            email: '',
            position: '',
            company: '',
            offerDate: '',
            salary: '',
            status: 'Pending'
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingOffer(null);
    };

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Offer Management</h1>
                    <p className="text-sm text-slate-400 mt-1">Track and manage candidate job offers.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Create Offer
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                                <th className="p-4">Candidate</th>
                                <th className="p-4">Position</th>
                                <th className="p-4">Company</th>
                                <th className="p-4">Salary</th>
                                <th className="p-4">Offer Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-400">Loading offers...</td></tr>
                            ) : offers.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-slate-400">No offers found. Click "Create Offer" to add one.</td></tr>
                            ) : offers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800">{offer.candidateName}</div>
                                        <div className="text-xs text-slate-400">{offer.email}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{offer.position}</td>
                                    <td className="p-4 text-slate-600">{offer.company}</td>
                                    <td className="p-4 font-mono text-slate-700 font-semibold">{offer.salary}</td>
                                    <td className="p-4 text-slate-600">{offer.offerDate}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                            ${offer.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' :
                                                offer.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                                    offer.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                                        'bg-slate-100 text-slate-600'}`}>
                                            {offer.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(offer)}
                                            className="text-purple-500 hover:text-purple-700 font-medium text-sm mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(offer.id)}
                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingOffer ? "Edit Offer" : "Create New Offer"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Candidate Name *</label>
                            <input
                                type="text"
                                name="candidateName"
                                value={formData.candidateName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., john@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Position *</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Software Engineer"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company *</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Google"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Offer Date *</label>
                            <input
                                type="date"
                                name="offerDate"
                                value={formData.offerDate}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Salary *</label>
                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., $120,000/year"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                        >
                            {editingOffer ? 'Update Offer' : 'Create Offer'}
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

export default Offers;
