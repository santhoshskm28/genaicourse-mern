import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 mt-auto">
            <div className="container">
                <div className="grid grid-3 gap-8 mb-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                            genaicourse.io
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Empowering the next generation of AI engineers and developers with cutting-edge skills.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaGithub size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link to="/courses" className="text-gray-400 hover:text-primary transition-colors">Browse Courses</Link></li>
                            <li><Link to="/how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</Link></li>
                            <li><Link to="/login" className="text-gray-400 hover:text-primary transition-colors">Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-400 hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} genaicourse.io. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
