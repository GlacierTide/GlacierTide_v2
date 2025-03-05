import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-100 to-cyan-100 shadow-lg sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo/Title */}
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-extrabold text-blue-900 tracking-wider">
            Glaciertide
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <a href="#about" className="text-blue-800 hover:text-cyan-700 transition-colors">
            About
          </a>
          <a href="#prediction" className="text-blue-800 hover:text-cyan-700 transition-colors">
            Prediction Tool
          </a>
          <a href="#worldmap" className="text-blue-800 hover:text-cyan-700 transition-colors">
            World Map
          </a>
          <a href="#contacts" className="text-blue-800 hover:text-cyan-700 transition-colors">
            Contacts
          </a>
        </nav>

        {/* Authentication Buttons */}
        <div className="flex items-center space-x-4">
          <button className="bg-white text-blue-900 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition-colors">
            Sign In
          </button>
          <button className="bg-cyan-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-cyan-700 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;