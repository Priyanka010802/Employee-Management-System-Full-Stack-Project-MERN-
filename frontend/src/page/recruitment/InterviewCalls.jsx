import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const InterviewCalls = () => {
    const { apiCall } = useAuth();
    const [calls, setCalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCall, setEditingCall] = useState(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        date: '',
        time: '',
        interviewer: '',
        location: '',
        status: 'Scheduled',
        notes: ''
    });

    useEffect(() => {
        fetchCalls();
    }, []);

    const fetchCalls = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/interviewCalls');
            setCalls(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching calls:", error);
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
            if (editingCall) {
                await apiCall(`/interviewCalls/${editingCall.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Interview call updated successfully!');
            } else {
                await apiCall('/interviewCalls', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Interview call created successfully!');
            }
            fetchCalls();
            closeModal();
        } catch (error) {
            console.error("Error saving call:", error);
            alert(error.message || "Failed to save interview call");
        }
    };

    const handleEdit = (call) => {
        setEditingCall(call);
        setFormData({
            company: call.company || '',
            position: call.position || '',
            date: call.date || '',
            time: call.time || '',
            interviewer: call.interviewer || '',
            location: call.location || '',
            status: call.status || 'Scheduled',
            notes: call.notes || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this interview call?')) return;

        try {
            await apiCall(`/interviewCalls/${id}`, {
                method: 'DELETE'
            });
            alert('Interview call deleted successfully!');
            fetchCalls();
        } catch (error) {
            console.error("Error deleting call:", error);
            alert(error.message || "Failed to delete interview call");
        }
    };

    const openModal = () => {
        setEditingCall(null);
        setFormData({
            company: '',
            position: '',
            date: '',
            time: '',
            interviewer: '',
            location: '',
            status: 'Scheduled',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCall(null);
    };

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Interview Calls</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage scheduled interviews and candidate status.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Schedule New
                </button>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold">Company</th>
                                <th className="p-4 font-semibold">Position</th>
                                <th className="p-4 font-semibold">Date & Time</th>
                                <th className="p-4 font-semibold">Interviewer</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading...</td></tr>
                            ) : calls.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No interview calls found. Click "Schedule New" to add one.</td></tr>
                            ) : calls.map((call) => (
                                <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-800">{call.company}</div>
                                        <div className="text-xs text-slate-400">{call.location}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">{call.position}</td>
                                    <td className="p-4">
                                        <div className="text-slate-800 font-medium">{call.date}</div>
                                        <div className="text-xs text-slate-400">{call.time}</div>
                                    </td>
                                    <td className="p-4 text-slate-600">{call.interviewer}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                            ${call.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' :
                                                call.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' :
                                                    call.status === 'Completed' ? 'bg-purple-100 text-purple-600' :
                                                        'bg-slate-100 text-slate-600'}`}>
                                            {call.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleEdit(call)}
                                            className="text-blue-500 hover:text-blue-700 transition-colors mr-3 font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(call.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors font-medium"
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

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCall ? "Edit Interview Call" : "Schedule New Interview"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g., Google"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Position *</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g., Software Engineer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Interviewer *</label>
                            <input
                                type="text"
                                name="interviewer"
                                value={formData.interviewer}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g., John Doe"
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
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="e.g., New York, NY"
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
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            {editingCall ? 'Update Interview' : 'Schedule Interview'}
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

export default InterviewCalls;
