import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    const location = window.location;
    // Routes where Sidebar should be HIDDEN (Recruitment Shell logic)
    const isRecruitmentShell = location.pathname.startsWith('/recruitment-shell') ||
        ['/interviewCalls', '/students', '/companies', '/offers', '/reports', '/schedule', '/student-portal'].some(path => location.pathname.startsWith(path));

    // However, HR also accesses some of these (e.g. employees). 
    // The user requirement is "in that recuriment shell remove sidebar". 
    // This implies that if I am in the "Hiring & Placement Shell" flow, I don't want the sidebar.
    // The safest check is: do I want to show the sidebar? 
    // Default: Yes. Exception: Recruitment paths if intended looking like a standalone shell.

    // Simpler approach per user request: "recuriment shell remove sidebar".
    // I will hide it if the path matches the shell or its sub-tools.

    const showSidebar = !isRecruitmentShell;

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {showSidebar && <Sidebar />}
            <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
                <div className={`container mx-auto ${showSidebar ? 'px-6 py-8' : 'p-0'}`}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
