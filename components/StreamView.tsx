import React, { useEffect, useRef } from 'react';
import { NotificationItem, AppSource } from '../types';

interface StreamViewProps {
  notifications: NotificationItem[];
  isSilent: boolean;
}

const getIconColor = (source: AppSource) => {
  switch (source) {
    case AppSource.SLACK: return 'text-purple-400';
    case AppSource.GMAIL: return 'text-red-400';
    case AppSource.MESSAGES: return 'text-green-400';
    case AppSource.BANKING: return 'text-yellow-400';
    case AppSource.SYSTEM: return 'text-gray-400';
    default: return 'text-blue-400';
  }
};

export const StreamView: React.FC<StreamViewProps> = ({ notifications, isSilent }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom only if visible and not silent
  useEffect(() => {
    if (!isSilent && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [notifications, isSilent]);

  // If silent, show the Focus Mode overlay (Display Off)
  if (isSilent) {
     return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden select-none">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-950"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center space-y-8">
                
                {/* Central Pulse Indicator */}
                <div className="relative group">
                    <div className="absolute -inset-8 bg-indigo-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
                    
                    {/* Orbit Rings */}
                    <div className="absolute inset-0 rounded-full border border-indigo-500/20 border-dashed animate-spin-slow"></div>
                    <div className="absolute -inset-2 rounded-full border border-slate-700/30 animate-[spin_15s_linear_infinite_reverse]"></div>

                    {/* Main Counter Circle */}
                    <div className="relative w-32 h-32 bg-slate-900/80 backdrop-blur-xl rounded-full flex flex-col items-center justify-center border border-slate-700 shadow-2xl">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-white font-mono">
                            {notifications.length}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Silenced</span>
                    </div>

                    {/* Notification Dot (Simulated Activity) */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse"></div>
                </div>
                
                <div>
                    <h2 className="text-xl font-medium text-slate-200 tracking-tight mb-2">Display Off</h2>
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                        Monitoring in background...
                    </div>
                    <p className="text-xs text-slate-500 mt-4 max-w-[240px] mx-auto leading-relaxed">
                        Notifications are hidden. Your AI assistant is performing a thorough check of all incoming alerts for your review.
                    </p>
                </div>
            </div>

             {/* Footer */}
             <div className="absolute bottom-0 left-0 right-0 p-3 bg-slate-950/50 border-t border-slate-800/50 flex justify-between items-center backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">SilentPulse Engine</span>
                <span className="text-[10px] text-indigo-400/80 font-mono">ACTIVE • RECORDING</span>
            </div>
        </div>
     );
  }

  // Regular View (Review Mode)
  return (
    <div className="flex flex-col h-full bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80 shrink-0">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Live Stream
        </h2>
        <span className="text-xs text-slate-500 font-mono">{notifications.length} items</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
      >
        {notifications.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2">
            <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>No notifications in log</span>
          </div>
        )}
        
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="p-3 rounded-lg border border-slate-700/50 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-200 animate-fade-in group"
          >
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${getIconColor(n.source)}`}>{n.source}</span>
                  <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/50">
                    {n.isPriority ? 'PRIORITY' : 'Normal'}
                  </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{n.timestamp.toLocaleTimeString()}</span>
            </div>
            <div className="text-sm font-medium text-slate-200 mb-1">{n.sender}</div>
            <div className="text-xs text-slate-400 leading-relaxed">{n.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
};