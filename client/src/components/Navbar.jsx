import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-finwise-mint">
      <Link to="/" className="flex items-center gap-2 text-finwise-green">
        <Wallet size={32} />
        <span className="text-2xl font-bold tracking-tight">FinWise</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <Link 
          to="/login" 
          className="border border-finwise-green text-finwise-green px-5 py-2 rounded-full font-medium hover:bg-finwise-mint transition-colors shadow-sm"
        >
          Log In
        </Link>
        <Link 
          to="/signup" 
          className="bg-finwise-green text-white px-5 py-2 rounded-full font-medium hover:bg-finwise-medium transition-colors shadow-sm"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
