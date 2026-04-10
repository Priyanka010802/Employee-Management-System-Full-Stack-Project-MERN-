import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from '../../components/Modal';

const Schedule = () => {
    const { apiCall } = useAuth();
    const [events, setEvents] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({
        role: '',
        title: '',
        candidateName: '',
        contact: '',
        email: '',
        date: '',
        time: '',
        status: 'Scheduled',
        applicants: 0
    });

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/interviewSchedules');
            setSchedules(data);
            // Transform data for FullCalendar
            const formattedEvents = data.map(item => ({
                id: item.id,
                title: `${item.title} - ${item.candidateName}`,
                start: `${item.date}T${item.time}`,
                backgroundColor: item.status === 'Completed' ? '#10b981' : item.status === 'Cancelled' ? '#ef4444' : '#3b82f6',
                borderColor: 'transparent',
                extendedProps: {
                    scheduleData: item
                }
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching schedule:", error);
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
            if (editingSchedule) {
                await apiCall(`/interviewSchedules/${editingSchedule.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Schedule updated successfully!');
            } else {
                await apiCall('/interviewSchedules', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Schedule created successfully!');
            }
            fetchSchedule();
            closeModal();
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert(error.message || "Failed to save schedule");
        }
    };

    const handleEventClick = (clickInfo) => {
        const scheduleData = clickInfo.event.extendedProps.scheduleData;
        if (scheduleData) {
            handleEdit(scheduleData);
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            role: schedule.role || '',
            title: schedule.title || '',
            candidateName: schedule.candidateName || '',
            contact: schedule.contact || '',
            email: schedule.email || '',
            date: schedule.date || '',
            time: schedule.time || '',
            status: schedule.status || 'Scheduled',
            applicants: schedule.applicants || 0
        });
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!editingSchedule) return;
        if (!window.confirm('Are you sure you want to delete this schedule?')) return;

        try {
            await apiCall(`/interviewSchedules/${editingSchedule.id}`, {
                method: 'DELETE'
            });
            alert('Schedule deleted successfully!');
            fetchSchedule();
            closeModal();
        } catch (error) {
            console.error("Error deleting schedule:", error);
            alert(error.message || "Failed to delete schedule");
        }
    };

    const openModal = () => {
        setEditingSchedule(null);
        setFormData({
            role: '',
            title: '',
            candidateName: '',
            contact: '',
            email: '',
            date: '',
            time: '',
            status: 'Scheduled',
            applicants: 0
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSchedule(null);
    };

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Interview Schedule</h1>
                    <p className="text-sm text-slate-400 mt-1">Calendar view of all upcoming interviews. Click on events to edit.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Add Schedule
                </button>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                {loading ? <p className="text-center p-8 text-slate-400">Loading calendar...</p> : (
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        height="auto"
                        eventClick={handleEventClick}
                        eventContent={(eventInfo) => (
                            <div className="px-2 py-1 overflow-hidden cursor-pointer">
                                <div className="font-bold text-xs truncate">{eventInfo.timeText}</div>
                                <div className="text-xs truncate">{eventInfo.event.title}</div>
                            </div>
                        )}
                    />
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingSchedule ? "Edit Interview Schedule" : "Add New Schedule"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Interview Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Technical Round"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Role *</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Software Engineer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Candidate Name *</label>
                        <input
                            type="text"
                            name="candidateName"
                            value={formData.candidateName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., John Doe"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Contact *</label>
                            <input
                                type="tel"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., +1234567890"
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
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Applicants</label>
                            <input
                                type="number"
                                name="applicants"
                                value={formData.applicants}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                        >
                            {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                        </button>
                        {editingSchedule && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-6 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        )}
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

export default Schedule;
