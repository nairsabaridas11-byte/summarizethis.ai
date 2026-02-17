import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { SummaryData } from '../types';

interface HistoryCardsProps {
  history: SummaryData[];
  onSelect: (summary: SummaryData) => void;
}

export const HistoryCards: React.FC<HistoryCardsProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-12 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-medium uppercase tracking-wider">
        <Clock size={14} />
        <span>Recent Activity</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {history.map((item) => (
          <button
            key={`${item.url}-${item.timestamp}`}
            onClick={() => onSelect(item)}
            className="group flex flex-col items-start p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-electric-500/30 transition-all duration-300 text-left h-full"
          >
            <h3 className="text-slate-200 font-medium text-sm line-clamp-2 mb-2 group-hover:text-electric-400 transition-colors">
              {item.title || item.url}
            </h3>
            <div className="mt-auto flex items-center text-xs text-slate-500 group-hover:text-slate-400">
              <span className="truncate max-w-[120px]">{new URL(item.url).hostname}</span>
              <ArrowRight size={12} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
