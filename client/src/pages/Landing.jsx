import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Target, TrendingUp, ArrowRight, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-finwise-mint flex flex-col font-poppins">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-finwise-green text-white px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl">
          Take control of your money
        </h1>
        <p className="text-lg md:text-xl mb-10 text-finwise-mint max-w-2xl opacity-90">
          The smart budget manager and tracker designed for university students. Track your spending, hit your savings goals, and grow your wealth.
        </p>
        <Link 
          to="/signup" 
          className="bg-finwise-yellow text-finwise-navy px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 hover:bg-[#E5DFB0] transition-all shadow-lg transform hover:-translate-y-1"
        >
          Get Started For Free <ArrowRight size={20} />
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
            <div className="bg-finwise-mint p-4 rounded-full text-finwise-green mb-6">
              <Activity size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-finwise-navy">Track</h3>
            <p className="text-gray-600">
              Easily log your daily expenses and income. See exactly where your money goes with intuitive charts and insights.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
            <div className="bg-finwise-mint p-4 rounded-full text-finwise-amber mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-finwise-navy">Save</h3>
            <p className="text-gray-600">
              Set personal savings goals for emergencies or that new gadget. We'll help you stay on track and reach them.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
            <div className="bg-finwise-mint p-4 rounded-full text-finwise-medium mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-finwise-navy">Grow</h3>
            <p className="text-gray-600">
              Get AI-powered financial insights tailored to your spending habits to help you build long-term wealth.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-white py-20 px-6 md:px-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-finwise-navy mb-16">How it works</h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-finwise-green/30 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-finwise-green text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-finwise-mint/50 p-6 rounded-xl border border-finwise-mint/80 shadow-sm text-left hover:bg-finwise-mint transition-colors">
                <h3 className="font-bold text-lg text-finwise-navy mb-2">Create an account</h3>
                <p className="text-gray-600">Sign up and set your monthly budget and preferred spending categories.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-finwise-amber text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-finwise-mint/50 p-6 rounded-xl border border-finwise-mint/80 shadow-sm text-left hover:bg-finwise-mint transition-colors">
                <h3 className="font-bold text-lg text-finwise-navy mb-2">Log your spending</h3>
                <p className="text-gray-600">Quickly add your daily transactions. We automatically update your remaining budget.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-finwise-medium text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-finwise-mint/50 p-6 rounded-xl border border-finwise-mint/80 shadow-sm text-left hover:bg-finwise-mint transition-colors">
                <h3 className="font-bold text-lg text-finwise-navy mb-2">Gain insights</h3>
                <p className="text-gray-600">Review your monthly progress and chat with our AI to uncover smart saving opportunities.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-finwise-navy text-finwise-mint py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Wallet size={24} className="text-finwise-green" />
            <span className="text-xl font-bold tracking-tight text-white">FinWise</span>
          </div>
          <div className="text-sm opacity-80 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FinWise. All rights reserved.
          </div>
          <div>
            <a href="mailto:support@finwise.com" className="hover:text-white transition-colors opacity-80 hover:opacity-100">
              Contact: support@finwise.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
