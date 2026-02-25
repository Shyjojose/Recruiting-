import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, Lock, Building2, User, ArrowRight } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('HR');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: role === 'HR' ? 'Admin User' : `${company} Manager`,
        email: email,
        role: role,
        company: role === 'COMPANY' ? company : undefined,
        avatar: `https://picsum.photos/seed/${email}/100/100`,
      };
      onLogin(user);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200 mb-4">
            <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HireJoy</h1>
          <p className="text-slate-500 mt-2">The delightful recruitment portal</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setRole('HR')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${role === 'HR' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600'}`}
            >
              HR Portal
            </button>
            <button
              onClick={() => setRole('COMPANY')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${role === 'COMPANY' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Company Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              {role === 'COMPANY' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="TechFlow Inc."
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In to {role === 'HR' ? 'HR Portal' : 'Company Dashboard'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <div className="text-center">
              <a href="#" className="text-sm text-indigo-600 font-semibold hover:underline">Forgot password?</a>
            </div>
          </form>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account? <a href="#" className="text-indigo-600 font-semibold hover:underline">Contact HR Support</a>
        </p>
      </motion.div>
    </div>
  );
};
