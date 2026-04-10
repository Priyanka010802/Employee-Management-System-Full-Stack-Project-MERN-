import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const Students = () => {
    const { apiCall } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        course: '',
        company: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/students');
            setStudents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching students:", error);
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
            if (editingStudent) {
                await apiCall(`/students/${editingStudent.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
                alert('Student updated successfully!');
            } else {
                await apiCall('/students', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
                alert('Student added successfully!');
            }
            fetchStudents();
            closeModal();
        } catch (error) {
            console.error("Error saving student:", error);
            alert(error.message || "Failed to save student");
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name || '',
            email: student.email || '',
            contact: student.contact || '',
            course: student.course || '',
            company: student.company || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this student?')) return;

        try {
            await apiCall(`/students/${id}`, {
                method: 'DELETE'
            });
            alert('Student removed successfully!');
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert(error.message || "Failed to remove student");
        }
    };

    const openModal = () => {
        setEditingStudent(null);
        setFormData({
            name: '',
            email: '',
            contact: '',
            course: '',
            company: ''
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
    };

    return (
        <div className="w-full relative font-sans">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center justify-between border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Database</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage registered students and their details.</p>
                </div>
                <button
                    onClick={openModal}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                    + Add Student
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center p-8 text-slate-400">Loading students...</div>
                ) : students.length === 0 ? (
                    <div className="col-span-full text-center p-8 text-slate-400">No students found. Click "Add Student" to add one.</div>
                ) : students.map((student) => (
                    <div key={student.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-xl">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{student.name}</h3>
                                <p className="text-xs text-slate-400">{student.course}</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">📧</span> {student.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">📱</span> {student.contact}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400">🏢</span> {student.company || 'Not Placed'}
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEdit(student)}
                                className="text-xs font-bold text-slate-400 hover:text-cyan-600 px-3 py-2 bg-slate-50 rounded-lg hover:bg-cyan-50 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(student.id)}
                                className="text-xs font-bold text-slate-400 hover:text-red-600 px-3 py-2 bg-slate-50 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStudent ? "Edit Student" : "Add New Student"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., john@example.com"
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
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., +1234567890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Course *</label>
                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., Computer Science"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Company (Optional)</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., Google (if placed)"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-cyan-500 text-white py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
                        >
                            {editingStudent ? 'Update Student' : 'Add Student'}
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

export default Students;
