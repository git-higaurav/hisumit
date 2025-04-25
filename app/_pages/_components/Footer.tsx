"use client"

import { FaLinkedin, FaBehance, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-[var(--footer-bg)] border-t border-gray-800/30 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute h-64 w-64 rounded-full bg-blue-500/5 blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute h-48 w-48 rounded-full bg-purple-500/5 blur-3xl bottom-1/4 right-1/4 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
              Sumit Walia
            </h3>
            <p className="text-gray-400 leading-relaxed max-w-md mb-6">
              Creative professional specializing in graphic design, motion graphics, and video editing. Transforming ideas into compelling visual experiences.
            </p>
            <div className="flex space-x-5">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
                className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300">
                <FaLinkedin size={20} className="transform group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://behance.net" target="_blank" rel="noopener noreferrer"
                className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300">
                <FaBehance size={20} className="transform group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="group p-3 bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-400 hover:text-white hover:bg-blue-500 transition-all duration-300">
                <FaInstagram size={20} className="transform group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <nav className="flex flex-col space-y-4">
              <a href="#work" className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                <span className="relative">
                  Work
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
              <a href="#services" className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                <span className="relative">
                  Services
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
              <a href="#about" className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                <span className="relative">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
              <a href="#contact" className="group text-gray-400 hover:text-white transition-colors duration-300 flex items-center">
                <span className="relative">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <HiMail className="text-gray-400 group-hover:text-blue-400 text-xl transition-colors" />
                </div>
                <a href="mailto:gfxwalia@gmail.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                  gfxwalia@gmail.com
                </a>
              </div>
              
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <HiPhone className="text-gray-400 group-hover:text-blue-400 text-xl transition-colors" />
                </div>
                <a href="tel:+91805723580" className="text-gray-400 hover:text-white transition-colors duration-300">
                  +91 8057 23580
                </a>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <HiLocationMarker className="text-gray-400 group-hover:text-blue-400 text-xl transition-colors" />
                </div>
                <address className="text-gray-400 not-italic group-hover:text-white transition-colors duration-300">
                  {/* 123 Creative Studio<br />
                  Design District<br />
                  San Francisco, CA 94107 */}
                  Uttar Pradesh, India
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 border-t border-gray-800/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Sumit Walia. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Designed & Developed with <span className="text-blue-400">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;