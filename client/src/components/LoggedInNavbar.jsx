import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Menu, X, LogOut } from 'lucide-react';

const LoggedInNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Goals', path: '/goals' },
    { name: 'Settings', path: '/settings' }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 text-finwise-green">
              <Wallet size={28} />
              <span className="text-xl font-black tracking-tight text-finwise-navy">FinWise</span>
            </Link>
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold transition-colors ${
                      isActive
                        ? 'border-finwise-green text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Menu (Profile / Logout) */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/settings" className="flex items-center gap-2.5 hover:opacity-85 transition-all">
              <span className="text-xs font-bold text-gray-800">{user?.name}</span>
              <div className="h-9 w-9 bg-finwise-green rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-sm border border-finwise-green/10">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </Link>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-base font-bold transition-all ${
                    isActive
                      ? 'bg-finwise-mint text-finwise-green font-extrabold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 my-2 pt-2 px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-finwise-green rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer border border-red-200/50"
              >
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LoggedInNavbar;
