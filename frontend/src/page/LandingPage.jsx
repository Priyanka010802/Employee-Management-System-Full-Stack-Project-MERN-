import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden font-sans">

            {/* Online Background Image */}
            <img
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1920"
                alt="Enterprise Background"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-900/80"></div>

            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

            {/* Navbar */}
            <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3" data-aos="fade-down">
                    <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center font-bold text-slate-900">
                        IH
                    </div>
                    <span className="text-lg font-semibold text-white">
                        InnovaHire
                    </span>
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 rounded-full bg-white text-slate-900 font-medium text-sm hover:bg-slate-100 transition"
                    data-aos="fade-down"
                >
                    Login
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-96px)] px-6">
                <div className="max-w-3xl text-center">

                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                        data-aos="fade-up"
                    >
                        Enterprise Workforce <br />
                        Management Platform
                    </h1>

                    <p
                        className="text-lg text-slate-300 mb-10"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        A secure and scalable HR platform designed to manage employees,
                        attendance, and organizational operations with confidence.
                    </p>

                    <div
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-4 rounded-full bg-white text-slate-900 font-semibold text-lg hover:bg-slate-100 transition shadow-lg"
                        >
                            Access Employee Portal
                        </button>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 text-center text-slate-400 text-sm pb-6">
                © {new Date().getFullYear()} InnovaHire. All rights reserved.
            </footer>

        </div>
    );
};

export default LandingPage;
