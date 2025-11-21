import React, { useState, useEffect, useRef } from 'react';
import { StreamView } from './components/StreamView';
import { ReportCard } from './components/ReportCard';
import { NotificationItem, AIReport } from './types';
import { generateMockNotification, generateInitialBatch } from './utils/mockData';
import { analyzeNotifications } from './services/geminiService';

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isSilent, setIsSilent] = useState<boolean>(true);
  const [userQuery, setUserQuery] = useState<string>('');
  const [report, setReport] = useState<AIReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simulation Logic - Continuous Background Stream
  useEffect(() => {
    // Initial batch
    setNotifications(generateInitialBatch(3));

    const interval = window.setInterval(() => {
      // Continuous background generation
      // Increased frequency slightly to ensure "thorough checks" have enough data
      if (Math.random() > 0.4) {
        setNotifications(prev => {
           const newNotif = generateMockNotification();
           // Keep the list manageable but large enough for thorough analysis
           const newList = [...prev, newNotif];
           // Store up to 200 items to allow for "what did I miss all day" type queries
           if (newList.length > 200) return newList.slice(newList.length - 200);
           return newList;
        });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setReport(null);

    try {
      const result = await analyzeNotifications(notifications, userQuery);
      setReport(result);
    } catch (err) {
      setError("Unable to generate report. Ensure a valid API Key is set in your environment.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearNotifications = () => {
      setNotifications([]);
      setReport(null);
      setUserQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight">Silent<span className="text-indigo-400">Pulse</span></h1>
        </div>

        <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsSilent(!isSilent)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                    isSilent 
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/30' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
             >
                <span className={`w-2 h-2 rounded-full ${isSilent ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`}></span>
                {isSilent ? 'Focus Mode Active' : 'Review Mode'}
             </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden max-h-[calc(100vh-4rem)]">
        
        {/* Left Column: Stream & Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full min-h-[500px]">
          
          {/* Query Input */}
          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-xl shrink-0">
            <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Check Notifications
            </h3>
            <form onSubmit={handleQuerySubmit} className="relative">
                <input 
                  type="text" 
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g. 'Did I miss anything from my boss?'"
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg py-3 px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600 shadow-inner"
                />
                <button 
                  type="submit" 
                  disabled={isAnalyzing || !userQuery}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                >
                    {isAnalyzing ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    )}
                </button>
            </form>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          {/* Stream */}
          <div className="flex-1 min-h-0 relative">
             <StreamView notifications={notifications} isSilent={isSilent} />
          </div>

          {/* Utils */}
          <div className="flex justify-between items-center shrink-0">
             <span className="text-xs text-slate-600">
                System Active · v1.0.4
             </span>
             <button 
                onClick={clearNotifications}
                className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
             >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear History
             </button>
          </div>
        </div>

        {/* Right Column: AI Report */}
        <div className="lg:col-span-8 h-full min-h-[500px] overflow-hidden">
           <ReportCard 
             report={report} 
             isLoading={isAnalyzing} 
             userQuery={userQuery}
           />
        </div>

      </main>
    </div>
  );
};

export default App;