import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord } from 'react-icons/fa';
import { SiFigma, SiSketch, SiAdobexd, SiFramer, SiReact, SiTailwindcss, SiNodedotjs, SiMongodb } from 'react-icons/si';

const Footer = () => {
    return (
        <footer className="bg-[#0B0F1A] border-t border-white/5 pt-0 pb-12 relative overflow-hidden text-white/90">
            {/* Logos Marquee (Dark Mode Version) */}
            <div className="w-full bg-white/5 border-b border-white/5 py-8 mb-16 overflow-hidden relative">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0F1A] to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0F1A] to-transparent z-10"></div>
                <div className="flex animate-scroll whitespace-nowrap opacity-60">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center gap-16 mx-8">
                            <SiFigma size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiSketch size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiAdobexd size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiFramer size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiReact size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiTailwindcss size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiNodedotjs size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <SiMongodb size={32} className="text-gray-400 hover:text-white transition-all duration-300" />
                            <span className="text-xl font-bold text-gray-500 uppercase tracking-widest">ProtoPie</span>
                            <span className="text-xl font-bold text-gray-500 uppercase tracking-widest">Axure</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-0 right-[-10%] w-[40%] h-full bg-violet-600/10 blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 left-[-10%] w-[30%] h-[50%] bg-cyan-600/10 blur-[100px] pointer-events-none -z-10"></div>

            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-3 mb-8 group">
                            <img src="/logo.png" alt="GenAI" className="h-14 w-auto object-contain brightness-0 invert" />
                            <span className="text-2xl font-black tracking-tight text-white">genaicourse.io</span>
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8">
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
                        <h4 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-8">Intelligence</h4>
                        <ul className="space-y-4">
                            <FooterLink to="/courses">Nexus Academy</FooterLink>
                            <FooterLink to="/how-it-works">Neural Path</FooterLink>
                            <FooterLink to="/pricing">Clearance Plans</FooterLink>
                            <FooterLink to="/dashboard">Sync Dashboard</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-8">Support Hub</h4>
                        <ul className="space-y-4">
                            <FooterLink to="#">Terminal FAQ</FooterLink>
                            <FooterLink to="#">Data Rights</FooterLink>
                            <FooterLink to="#">Security Protocol</FooterLink>
                            <FooterLink to="#">Signal Help</FooterLink>
                        </ul>
                    </div>

                    <div className="glass-card p-8 bg-white/5 border border-white/10 shadow-2xl">
                        <h4 className="text-white font-bold mb-4">Neural Updates</h4>
                        <p className="text-gray-400 text-sm mb-6 font-medium">Get the latest AI breakthroughs delivered to your inbox.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email Protocol..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all text-white"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-accent text-white px-4 rounded-lg text-xs font-bold hover:bg-orange-800 transition-colors">Join</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-white/5">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} GENAICOURSE.IO // ALL SYSTEMS OPERATIONAL
                    </p>
                    <div className="flex gap-10">
                        <Link to="#" className="text-gray-500 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Privacy</Link>
                        <Link to="#" className="text-gray-400 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Terms</Link>
                        <Link to="#" className="text-gray-400 hover:text-white transition-colors text-[10px] uppercase font-black tracking-widest">Status</Link>
                    </div>
                </div>
            </div>

            {/* Large Shaded Brand Signature */}
            <div className="flex justify-center mt-16 mb-[-20px] md:mb-[-40px] pointer-events-none select-none overflow-hidden h-fit w-full">
                <h2 className="text-[15vw] font-black uppercase leading-none tracking-tighter text-half-shade">
                    genaicourse
                </h2>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <li>
        <Link to={to} className="text-gray-500 hover:text-accent transition-colors text-sm font-bold flex items-center group">
            <span className="w-0 group-hover:w-4 h-0.5 bg-accent mr-0 group-hover:mr-2 transition-all"></span>
            {children}
        </Link>
    </li>
);

const SocialLink = ({ icon }) => (
    <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white hover:scale-110 transition-all duration-300">
        {icon}
    </a>
);

export default Footer;
