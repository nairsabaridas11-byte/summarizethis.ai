import React, { useState, useEffect } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { ResultBox } from './components/ResultBox';
import { HistoryCards } from './components/HistoryCards';
import { fetchUrlContent } from './utils/scraper';
import { generateSummary } from './services/aiService';
import { getHistory, saveToHistory, checkRateLimit } from './utils/storage';
import { SummaryData } from './types';

function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [history, setHistory] = useState<SummaryData[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // Check Rate Limit
    if (!checkRateLimit()) {
      setError("You've reached your free limit (5/hour). Please try again later.");
      return;
    }

    setError(null);
    setSummary(null);
    setIsLoading(true);

    try {
      // 1. Scrape
      const content = await fetchUrlContent(url);
      
      // 2. Summarize
      const aiData = await generateSummary(url, content);
      
      // 3. Construct Data object
      const newSummary: SummaryData = {
        ...aiData,
        url,
        originalUrl: url,
        timestamp: Date.now()
      };

      // 4. Update State & History
      setSummary(newSummary);
      const updatedHistory = saveToHistory(newSummary);
      setHistory(updatedHistory);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Make sure the URL is public and valid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: SummaryData) => {
    setSummary(item);
    setUrl(item.url);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto selection:bg-electric-500/30">
      
      {/* Header */}
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-800 ring-1 ring-slate-700/50 shadow-xl shadow-electric-500/10 mb-4">
          <Zap className="w-8 h-8 text-electric-500 fill-electric-500/20" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400">
          SummarizeThis.ai
        </h1>
        <p className="text-lg text-slate-400 max-w-lg mx-auto leading-relaxed">
          Skip the fluff. Get actionable insights from articles, videos, and posts in seconds.
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-2xl relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-electric-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        
        <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2 p-2 bg-slate-900 rounded-xl ring-1 ring-slate-700 shadow-2xl">
          <input
            type="url"
            placeholder="Paste a link to save 15 minutes of reading..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 text-lg px-4 py-3 min-w-0"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-electric-600 hover:bg-electric-500 text-white font-semibold rounded-lg px-8 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Summarize"
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm max-w-xl text-center animate-pulse">
          {error}
        </div>
      )}

      {/* Loading State Animation */}
      {isLoading && !summary && (
        <div className="mt-12 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-electric-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 text-sm font-medium animate-pulse">
            Scanning content & extracting insights...
          </p>
        </div>
      )}

      {/* Result Area */}
      {summary && !isLoading && (
        <ResultBox data={summary} />
      )}

      {/* History */}
      {!isLoading && !summary && (
        <HistoryCards history={history} onSelect={handleHistorySelect} />
      )}

      {/* Footer / Attribution */}
      <div className="mt-24 text-center text-slate-600 text-xs">
        <p>Powered by Gemini Flash & Jina Reader</p>
        <p className="mt-2">No login required. Free to use.</p>
      </div>

    </div>
  );
}

export default App;
