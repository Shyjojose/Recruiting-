import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Briefcase, Calendar, MoreVertical, Sparkles, Building2 } from 'lucide-react';
import { Candidate, STAGE_CONFIG } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  onMoveStage: (id: string, direction: 'next' | 'prev') => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onMoveStage }) => {
  const config = STAGE_CONFIG[candidate.stage];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {candidate.stage === 'Job Offer' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg z-10"
        >
          <Sparkles size={14} className="animate-pulse" />
        </motion.div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <img
          src={candidate.avatar}
          alt={candidate.name}
          className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 truncate">{candidate.name}</h4>
          <p className="text-[10px] text-indigo-600 font-bold uppercase flex items-center gap-1 mt-0.5">
            <Building2 size={10} />
            {candidate.company}
          </p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Briefcase size={12} className="text-slate-400" />
          <span className="truncate">{candidate.role}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Mail size={12} className="text-slate-400" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Calendar size={10} />
          <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider stage-gradient-${candidate.stage === 'Applied' ? '1' : candidate.stage === 'Screening' ? '2' : candidate.stage === 'Technical' ? '3' : candidate.stage === 'Culture' ? '4' : '5'}`}>
          <Icon size={12} />
          {candidate.stage}
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={() => onMoveStage(candidate.id, 'prev')}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-30"
            disabled={candidate.stage === 'Applied'}
          >
            <motion.div whileTap={{ x: -4 }}>←</motion.div>
          </button>
          <button
            onClick={() => onMoveStage(candidate.id, 'next')}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-30"
            disabled={candidate.stage === 'Job Offer'}
          >
            <motion.div whileTap={{ x: 4 }}>→</motion.div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
