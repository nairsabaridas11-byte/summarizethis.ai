import React from 'react';
import { Share2, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SummaryData } from '../types';

interface ResultBoxProps {
  data: SummaryData;
  isLoading?: boolean;
}

export const ResultBox: React.FC<ResultBoxProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `
*${data.title}*

*TL;DR:* ${data.tldr}

*The Meat:*
${data.keyInsights.map(k => `• ${k}`).join('\n')}

*Next Steps:*
${data.nextSteps.map(s => `→ ${s}`).join('\n')}

_Summarized by SummarizeThis.ai_
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `*${data.title}*\n\n${data.tldr}\n\nCheck it out here: ${data.url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mt-8"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-electric-500/10 text-electric-400 text-[10px] font-bold uppercase tracking-wider border border-electric-500/20">
                  AI Summary
                </span>
                <a 
                  href={data.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-slate-500 hover:text-electric-400 transition-colors flex items-center gap-1"
                >
                  {new URL(data.url).hostname}
                  <ExternalLink size={10} />
                </a>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-tight">
                {data.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 bg-slate-850">
          {/* TL;DR */}
          <section>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-electric-500" />
              TL;DR
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg border-l-2 border-electric-500 pl-4">
              {data.tldr}
            </p>
          </section>

          {/* Key Insights */}
          <section>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              The Meat (Key Insights)
            </h3>
            <ul className="space-y-3">
              {data.keyInsights.map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-electric-500" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Next Steps */}
          <section>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Next Steps
            </h3>
            <div className="grid gap-3">
              {data.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700/50">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full border border-electric-500/30 flex items-center justify-center text-[10px] text-electric-400 font-bold">
                      {i + 1}
                    </div>
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-700/50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold transition-all shadow-lg shadow-green-900/20 active:scale-95"
          >
            <Share2 size={18} />
            Share to WhatsApp
          </button>
          
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition-all active:scale-95"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
