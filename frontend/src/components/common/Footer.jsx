import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-20 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <img src="/logo.png" alt="GenAI" className="h-10 w-auto object-contain bg-blend-multiply" />
                            <span className="text-2xl font-black tracking-tight text-white">genaicourse.io</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                            Empowering professionals with practical, prompt-based AI skills for the modern workplace.
                        </p>
                        <div className="flex gap-4">
                            <SocialLink icon={<FaTwitter />} href="#" />
                            <SocialLink icon={<FaLinkedin />} href="#" />
                            <SocialLink icon={<FaInstagram />} href="#" />
                        </div>
                    </div>

                    {/* Explore Section */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-4">
                            <li><FooterLink to="/">Home</FooterLink></li>
                            <li><FooterLink to="/courses">All Courses</FooterLink></li>
                            <li><FooterLink to="/pricing">Pricing</FooterLink></li>
                            <li><FooterLink to="/contact">Contact Support</FooterLink></li>
                        </ul>
                    </div>

                    {/* Legal Section */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><FooterLink to="/privacy">Privacy Policy</FooterLink></li>
                            <li><FooterLink to="/terms">Terms of Use</FooterLink></li>
                            <li><FooterLink to="/refund">Refund Policy</FooterLink></li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-gray-400 text-sm">
                                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                                <span>5080 Spectrum Drive, Suite 575E, Addison, TX 75001</span>
                            </li>
                            <li className="flex gap-4 text-gray-400 text-sm">
                                <FaEnvelope className="text-orange-500 mt-1 flex-shrink-0" />
                                <a href="mailto:info@genaicourse.io" className="hover:text-orange-500 transition-colors">info@genaicourse.io</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} GENAICOURSE.IO // ALL SYSTEMS OPERATIONAL
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        System Operational
                    </div>
                </div>
            </div>

            {/* Large Shaded Brand Signature */}
            <div className="flex justify-center mt-16 mb-[-20px] md:mb-[-40px] pointer-events-none select-none overflow-hidden h-fit w-full">
                <h2 className="text-[15vw] font-black uppercase leading-none tracking-tighter text-half-shade-light">
                    genaicourse
                </h2>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, children }) => (
    <Link to={to} className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
        {children}
    </Link>
);

const SocialLink = ({ icon, href }) => (
    <a href={href} className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300">
        {icon}
    </a>
);

export default Footer;
