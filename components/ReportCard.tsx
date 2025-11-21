import React from 'react';
import { AIReport } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ReportCardProps {
  report: AIReport | null;
  isLoading: boolean;
  userQuery: string;
}

const COLORS = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#94a3b8'];

export const ReportCard: React.FC<ReportCardProps> = ({ report, isLoading, userQuery }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-xl border border-slate-700">
        <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
        </div>
        <p className="text-indigo-300 font-medium animate-pulse">Analyzing notification matrix...</p>
        <p className="text-xs text-slate-500 mt-2">Correlating "{userQuery}" with silenced alerts</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
        <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="text-slate-400">Enter a query to generate a report.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 rounded-xl border border-indigo-500/30 shadow-2xl overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-10">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-xl font-bold text-white mb-1">Executive Summary</h2>
                <p className="text-sm text-indigo-300 italic">Query: "{userQuery}"</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                report.sentiment === 'Urgent' ? 'bg-red-500/20 text-red-300 border-red-500/50' : 
                report.sentiment === 'Positive' ? 'bg-green-500/20 text-green-300 border-green-500/50' :
                'bg-slate-500/20 text-slate-300 border-slate-500/50'
            }`}>
                {report.sentiment}
            </span>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Main Answer */}
        <section>
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Analysis</h3>
             <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-indigo-500">
                <p className="text-slate-200 leading-relaxed">{report.answerToQuery}</p>
             </div>
             <p className="mt-3 text-sm text-slate-400">{report.summary}</p>
        </section>

        {/* Action Items */}
        {report.urgentItems.length > 0 && (
            <section>
                <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Requires Attention
                </h3>
                <div className="space-y-3">
                    {report.urgentItems.map((item, idx) => (
                        <div key={idx} className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg flex justify-between items-center group hover:bg-red-900/20 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-red-400">{item.source}</span>
                                </div>
                                <p className="text-sm text-slate-200">{item.detail}</p>
                            </div>
                            <button className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 py-1.5 rounded border border-red-500/30 transition-colors">
                                {item.actionRequired || "Review"}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-slate-800/30 rounded-lg p-4">
                <h4 className="text-xs font-semibold text-slate-500 mb-2 text-center">Volume by Source</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={report.categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="count"
                        >
                            {report.categoryBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-4 flex flex-col justify-center space-y-4">
                <h4 className="text-xs font-semibold text-slate-500 mb-2">Breakdown</h4>
                {report.categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                            <span className="text-sm text-slate-300">{cat.name}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-400">{cat.count}</span>
                    </div>
                ))}
            </div>
        </section>

      </div>
    </div>
  );
};