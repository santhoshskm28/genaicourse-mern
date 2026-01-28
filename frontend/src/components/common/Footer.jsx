import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#020617] border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-[-10%] w-[30%] h-full bg-indigo-500/5 blur-[100px] pointer-events-none -z-10"></div>

            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="lg:col-span-1">
                        <Link to="/" className="text-2xl font-black mb-8 block tracking-tight">
                            <span className="text-gradient">genaicourse</span>.io
                        </Link>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8">
                            The world's most advanced learning platform for Generative AI and Neural Engineering. Connect with the future.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={<FaGithub />} />
                            <SocialLink icon={<FaTwitter />} />
                            <SocialLink icon={<FaLinkedin />} />
                            <SocialLink icon={<FaDiscord />} />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Intelligence</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/courses">Nexus Academy</FooterLink>
                            <FooterLink to="/how-it-works">Neural Path</FooterLink>
                            <FooterLink to="/pricing">Clearance Plans</FooterLink>
                            <FooterLink to="/dashboard">Sync Dashboard</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8">Support Hub</h4>
                        <ul className="space-y-4">
                            <FooterLink to="#">Terminal FAQ</FooterLink>
                            <FooterLink to="#">Data Rights</FooterLink>
                            <FooterLink to="#">Security Protocol</FooterLink>
                            <FooterLink to="#">Signal Help</FooterLink>
                        </ul>
                    </div>

                    <div className="glass-card p-8 border-indigo-500/20">
                        <h4 className="text-white font-bold mb-4">Neural Updates</h4>
                        <p className="text-slate-400 text-sm mb-6 font-medium">Get the latest AI breakthroughs delivered to your inbox.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Protocol..."
                                className="w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-all text-white"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-indigo-500 text-white px-4 rounded-lg text-xs font-bold hover:bg-indigo-600 transition-colors">Join</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} GENAICOURSE.IO // ALL SYSTEMS OPERATIONAL
                    </p>
                    <div className="flex gap-10">
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Privacy</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Terms</Link>
                        <Link to="#" className="text-slate-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Status</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-bold flex items-center group">
            <span className="w-0 group-hover:w-4 h-0.5 bg-indigo-500 mr-0 group-hover:mr-2 transition-all"></span>
            {children}
        </Link>
    </li>
);

const SocialLink = ({ icon }) => (
    <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white hover:scale-110 transition-all duration-300">
        {icon}
    </a>
);

export default Footer;
