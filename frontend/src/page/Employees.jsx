// src/pages/ManageEmployees.jsx
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

// Employee Form Component
const EmployeeForm = ({ form, editingId, onClose, onSubmit, onChange }) => {
  const FORM_FIELDS = [
    { name: "name", label: "Name *", type: "text", required: true },
    { name: "email", label: "Email *", type: "email", required: true },
    { name: "empCode", label: "Employee ID", placeholder: "EMP-001" },
    { name: "hireDate", label: "Hiring date", type: "date" },
    { name: "image", label: "Image URL", placeholder: "https://..." },
    { name: "address", label: "Address" },
    { name: "salary", label: "Salary (₹ / month)", type: "number" },
    { name: "department", label: "Department" },
    { name: "role", label: "Role" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-2xl p-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold">
              {editingId ? "✏️ Edit Employee" : "👤 Add New Employee"}
            </h2>
            <p className="text-sm text-white/90 mt-1">
              {editingId ? "Update employee details" : "Fill in the employee information"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="text-lg">×</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORM_FIELDS.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={onChange}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all hover:scale-[1.02]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              {editingId ? "Update Employee" : "Create Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Employee Card Component
const EmployeeCard = ({ employee, onEdit, onDelete, onViewPDF }) => {
  const getAvatar = (emp) => {
    if (emp?.image?.trim()) return emp.image;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || "E")}&background=6366F1&color=fff&size=128`;
  };

  const formatSalary = (salary) =>
    salary ? `₹${Number(salary).toLocaleString()}` : "₹0";

  const getEmpCode = (emp) =>
    emp.empCode || (emp.id ? `EMP-${String(emp.id).padStart(3, "0")}` : "N/A");

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-100 flex items-start gap-4">
        <div className="relative">
          <img
            src={getAvatar(employee)}
            alt={employee.name}
            className="h-14 w-14 rounded-xl object-cover border-2 border-white shadow-lg"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name || "E")}&background=6366F1&color=fff&size=128`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{employee.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{employee.role || "No role specified"}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span>🏢</span> {employee.department || "No department"}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-800 truncate">{employee.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Salary</p>
            <p className="text-sm font-bold text-green-600">{formatSalary(employee.salary)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Employee ID</p>
            <p className="text-sm font-medium text-gray-800">{getEmpCode(employee)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Hire Date</p>
            <p className="text-sm font-medium text-gray-800">{employee.hireDate || "N/A"}</p>
          </div>
        </div>

        {employee.address && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="text-sm text-gray-700 line-clamp-2">{employee.address}</p>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex gap-2">
          <button
            onClick={() => onViewPDF(employee)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1"
          >
            📄 PDF
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
          >
            ✏️ Edit
          </button>
        </div>
        <button
          onClick={() => onDelete(employee.id)}
          className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

// PDF Preview Modal
const PDFPreview = ({ employee, onClose, onPrint }) => {
  if (!employee) return null;

  const getAvatar = (emp) => {
    if (emp?.image?.trim()) return emp.image;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || "E")}&background=6366F1&color=fff&size=256`;
  };

  const formatSalary = (salary) =>
    salary ? `₹${Number(salary).toLocaleString()}` : "₹0";

  const getEmpCode = (emp) =>
    emp.empCode || (emp.id ? `EMP-${String(emp.id).padStart(3, "0")}` : "N/A");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-white/20 animate-slide-up">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-3xl p-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold">Employee Profile</h2>
            <p className="text-sm text-white/90">Print-ready document</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management System</h1>
            <p className="text-gray-600">Professional Employee Profile</p>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div className="flex-shrink-0">
              <img
                src={getAvatar(employee)}
                alt={employee.name}
                className="h-40 w-40 rounded-2xl object-cover border-4 border-white shadow-2xl"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                <p className="text-lg text-gray-600">
                  {employee.role || "No Role"} • {employee.department || "No Department"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Employee ID</p>
                  <p className="text-xl font-bold text-gray-900">{getEmpCode(employee)}</p>
                </div>

                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Hire Date</p>
                  <p className="text-xl font-bold text-gray-900">{employee.hireDate || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Monthly Salary</p>
              <p className="text-3xl font-bold text-emerald-700">{formatSalary(employee.salary)}</p>
            </div>

            <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-2">Department</p>
              <p className="text-xl font-bold text-gray-900">{employee.department || "N/A"}</p>
            </div>

            <div className="lg:col-span-2 p-5 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Contact & Address</p>
              <div className="space-y-2">
                <p className="text-gray-900 font-medium">📧 {employee.email}</p>
                <p className="text-gray-700">{employee.address || "No address provided"}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <p>Generated by Employee Management System</p>
            <p>Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-5 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onPrint(employee)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span className="text-xl">🖨️</span>
            Print PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ManageEmployees = () => {
  const { apiCall } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "", image: "", email: "", address: "", salary: "",
    department: "", role: "", empCode: "", hireDate: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load employees
  const loadEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await apiCall("/employees");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, salary: Number(form.salary) || 0 };

    try {
      if (editingId) {
        await apiCall(`/employees/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiCall(`/employees`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await loadEmployees();
    } catch (error) {
      console.error("Failed to save employee:", error);
    }
  };

  const resetForm = () => {
    setForm({
      name: "", image: "", email: "", address: "", salary: "",
      department: "", role: "", empCode: "", hireDate: ""
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name || "", image: emp.image || "", email: emp.email || "",
      address: emp.address || "", salary: emp.salary ? String(emp.salary) : "",
      department: emp.department || "", role: emp.role || "",
      empCode: emp.empCode || "", hireDate: emp.hireDate || "",
    });
    setEditingId(emp.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await apiCall(`/employees/${id}`, { method: "DELETE" });
      await loadEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  const handlePrintPDF = (employee) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${employee.name} - Employee Profile</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .profile { display: flex; gap: 30px; margin-bottom: 30px; }
          .details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .section { background: #f5f5f5; padding: 20px; border-radius: 8px; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Employee Profile</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="profile">
          <h2>${employee.name}</h2>
          <p>${employee.role} • ${employee.department}</p>
        </div>
        <div class="details">
          <div class="section">Email: ${employee.email}</div>
          <div class="section">Salary: ₹${Number(employee.salary).toLocaleString()}</div>
          <div class="section">Address: ${employee.address || 'N/A'}</div>
          <div class="section">Hire Date: ${employee.hireDate || 'N/A'}</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    const query = search.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query) ||
      emp.department?.toLowerCase().includes(query) ||
      emp.role?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-slide-down">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Employee Directory
              </h1>
              <p className="text-gray-600">
                Manage your team members, roles, and departments
              </p>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-lg">+</span>
                Add New Employee
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees by name, email, role, or department..."
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
            <p className="text-sm text-gray-600 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
            <p className="text-sm text-gray-600 mb-1">Active Search</p>
            <p className="text-3xl font-bold text-gray-900">{filteredEmployees.length}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5">
            <p className="text-sm text-gray-600 mb-1">Departments</p>
            <p className="text-3xl font-bold text-gray-900">
              {[...new Set(employees.map(e => e.department).filter(Boolean))].length}
            </p>
          </div>
        </div>

        {/* Employees Grid */}
        <main className="animate-slide-up animation-delay-100">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-4">
                {search ? "Try a different search term" : "Add your first employee to get started"}
              </p>
              {!search && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Add First Employee
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((emp, index) => (
                <div
                  key={emp.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <EmployeeCard
                    employee={emp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewPDF={setSelectedEmployee}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>
            Showing {filteredEmployees.length} of {employees.length} employees
            {search && ` • Searching for: "${search}"`}
          </p>
        </footer>
      </div>

      {/* Modals */}
      {isFormOpen && (
        <EmployeeForm
          form={form}
          editingId={editingId}
          onClose={resetForm}
          onSubmit={handleSubmit}
          onChange={handleChange}
        />
      )}

      {selectedEmployee && (
        <PDFPreview
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onPrint={handlePrintPDF}
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

export default ManageEmployees;