import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, LayoutGrid, List, Sparkles, Users, TrendingUp, CheckCircle2, Building2, ChevronDown, ChevronRight, LogOut, User as UserIcon } from 'lucide-react';
import { Candidate, INITIAL_CANDIDATES, STAGES, Stage, UserProfile } from './types';
import { CandidateCard } from './components/CandidateCard';
import { AddCandidateModal } from './components/AddCandidateModal';
import { Login } from './components/Login';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'board' | 'sections'>('sections');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const filteredCandidates = useMemo(() => {
    let list = candidates;
    
    // Filter by company if user is a company rep
    if (user?.role === 'COMPANY' && user.company) {
      list = list.filter(c => c.company.toLowerCase() === user.company?.toLowerCase());
    }

    return list.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [candidates, searchQuery, user]);

  const groupedCandidates = useMemo(() => {
    const groups: Record<string, Record<string, Candidate[]>> = {};
    filteredCandidates.forEach(c => {
      if (!groups[c.company]) groups[c.company] = {};
      if (!groups[c.company][c.role]) groups[c.company][c.role] = [];
      groups[c.company][c.role].push(c);
    });
    return groups;
  }, [filteredCandidates]);

  const handleAddCandidate = (newCandidate: { name: string; email: string; role: string; company: string; stage: Stage }) => {
    const candidate: Candidate = {
      ...newCandidate,
      id: Math.random().toString(36).substr(2, 9),
      appliedDate: new Date().toISOString().split('T')[0],
      avatar: `https://picsum.photos/seed/${newCandidate.name}/100/100`,
    };
    setCandidates([candidate, ...candidates]);
  };

  const handleMoveStage = (id: string, direction: 'next' | 'prev') => {
    setCandidates(prev => prev.map(c => {
      if (c.id !== id) return c;
      const currentIndex = STAGES.indexOf(c.stage);
      const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= STAGES.length) return c;
      return { ...c, stage: STAGES[nextIndex] };
    }));
  };

  const stats = useMemo(() => ({
    total: filteredCandidates.length,
    offers: filteredCandidates.filter(c => c.stage === 'Job Offer').length,
    active: filteredCandidates.filter(c => c.stage !== 'Job Offer').length,
  }), [filteredCandidates]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Sparkles size={24} />
              </div>
              <div className="flex flex-col -space-y-1">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">HireJoy</h1>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                  {user.role === 'HR' ? 'HR Portal' : user.company}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  className="bg-transparent border-none outline-none text-sm w-48 lg:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {user.role === 'HR' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add Candidate</span>
                </motion.button>
              )}

              <div className="h-8 w-px bg-slate-200 mx-2" />

              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.role === 'HR' ? 'Administrator' : 'Hiring Manager'}</p>
                </div>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover"
                  referrerPolicy="no-referrer"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUser(null)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: user.role === 'HR' ? 'Total Candidates' : 'My Candidates', value: stats.total, icon: Users, color: 'blue' },
            { label: 'Active Pipeline', value: stats.active, icon: TrendingUp, color: 'indigo' },
            { label: 'Job Offers', value: stats.offers, icon: CheckCircle2, color: 'emerald' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {user.role === 'HR' ? 'Recruitment Pipeline' : `${user.company} Pipeline`}
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredCandidates.length}
            </span>
          </h2>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setView('sections')}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${view === 'sections' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Building2 size={18} />
              <span className="text-xs font-bold hidden sm:inline">Sections</span>
            </button>
            <button
              onClick={() => setView('board')}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${view === 'board' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
              <span className="text-xs font-bold hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 ${view === 'grid' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
              <span className="text-xs font-bold hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Sectioned View */}
        {view === 'sections' && (
          <div className="space-y-8">
            {Object.entries(groupedCandidates).map(([company, roles]) => (
              <div key={company} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-sm text-indigo-600">
                    <Building2 size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{company}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  {Object.entries(roles).map(([role, roleCandidates]) => {
                    const sectionKey = `${company}-${role}`;
                    const isExpanded = expandedSections[sectionKey] !== false;

                    return (
                      <div key={role} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <button 
                          onClick={() => toggleSection(sectionKey)}
                          className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>
                            <div className="text-left">
                              <h4 className="font-bold text-slate-900">{role}</h4>
                              <p className="text-xs text-slate-500">{roleCandidates.length} Candidates</p>
                            </div>
                          </div>
                          <div className="flex -space-x-2">
                            {roleCandidates.slice(0, 3).map(c => (
                              <img 
                                key={c.id} 
                                src={c.avatar} 
                                className="w-8 h-8 rounded-full border-2 border-white object-cover" 
                                alt={c.name}
                                referrerPolicy="no-referrer"
                              />
                            ))}
                            {roleCandidates.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                +{roleCandidates.length - 3}
                              </div>
                            )}
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-slate-50/30">
                                {roleCandidates.map(candidate => (
                                  <CandidateCard
                                    key={candidate.id}
                                    candidate={candidate}
                                    onMoveStage={handleMoveStage}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Board View */}
        {view === 'board' && (
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {STAGES.map((stage) => (
              <div key={stage} className="flex-shrink-0 w-80 snap-start">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs">{stage}</h3>
                    <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md">
                      {filteredCandidates.filter(c => c.stage === stage).length}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 min-h-[500px] p-2 bg-slate-100/50 rounded-3xl border border-dashed border-slate-300">
                  <AnimatePresence mode="popLayout">
                    {filteredCandidates
                      .filter(c => c.stage === stage)
                      .map(candidate => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          onMoveStage={handleMoveStage}
                        />
                      ))}
                  </AnimatePresence>
                  {filteredCandidates.filter(c => c.stage === stage).length === 0 && (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic">
                      No candidates here
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onMoveStage={handleMoveStage}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCandidate}
      />

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 HireJoy Recruitment Portal. Crafted for HR Excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}
