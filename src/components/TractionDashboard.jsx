import React, { useState } from 'react';
import { 
  VALIDATION_METRICS, USER_INTERVIEWS, VALIDATION_SESSIONS 
} from '../data/validationData';
import { 
  TrendingUp, Users, CheckCircle2, Star, Sparkles, DollarSign, 
  MessageSquareQuote, Filter, ArrowUpRight, Search, Zap, PlusCircle
} from 'lucide-react';
import { getSavedSessions, getSavedLeads } from '../utils/storage';

export default function TractionDashboard({ onOpenLeadCapture, onLaunchPractice }) {
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics', 'interviews', 'sessions'

  const localSessions = getSavedSessions();
  const localLeads = getSavedLeads();

  // Combine static and live local sessions
  const allSessions = [...localSessions, ...VALIDATION_SESSIONS];

  const filteredSessions = allSessions.filter(s => {
    const matchesPersona = selectedPersonaFilter === 'all' || s.personaId === selectedPersonaFilter;
    const matchesSearch = s.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.personaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.verdict && s.verdict.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPersona && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            Proven Rehearsal Outcomes & Benchmarks
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white">
            Customer Proof & Performance Analytics
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Aggregated performance data across 48+ founder pitch loops, qualitative case studies, and enterprise pilot results.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenLeadCapture}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            Request Priority Access
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Session Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-display text-emerald-400">
              {VALIDATION_METRICS.completionRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              vs ~22% for plain text bots
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>48h Repeat Usage</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-display text-indigo-400">
              {VALIDATION_METRICS.repeatRehearsalRate}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              3+ rehearsals before pitch
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Customer CSAT</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-display text-amber-400">
              {VALIDATION_METRICS.csatScore} / 5.0
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              NPS +74 across 34 founders
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pilot Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-extrabold font-display text-cyan-400">
              {VALIDATION_METRICS.pilotPipelineValue}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Signed LOIs across 2 sales teams
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'metrics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          📊 Usage & Value Insights
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'interviews'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          💬 Qualitative Founder Interviews ({USER_INTERVIEWS.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'sessions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          📑 Validated Session Logs ({allSessions.length})
        </button>
      </div>

      {/* TAB 1: Metrics & Key Validation Signals */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Signal 1: Usage */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                1. Usage Signal (High Engagement)
              </div>
              <h3 className="text-base font-bold text-white font-display">
                84.6% Completed Drills & 41% Filler Reduction
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlike text-based chat where users churn after 1-2 prompts, the live AI avatar creates conversational urgency that keeps users engaged through all 4 objection rounds.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-400">
                • 48 recorded sessions across 12 tech hubs
              </div>
            </div>

            {/* Signal 2: Demand */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                <Users className="w-4 h-4" />
                2. Demand Signal (Organic Pull)
              </div>
              <h3 className="text-base font-bold text-white font-display">
                328 Waitlist Signups & 4 Accelerators
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Founders shared their Venture Readiness badges on LinkedIn and WhatsApp groups, generating organic inbound demand with zero ad spend.
              </p>
              <div className="pt-2 text-xs font-mono text-cyan-400">
                • YC S24, Techstars, Antler, Berkeley SkyDeck
              </div>
            </div>

            {/* Signal 3: Value */}
            <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                3. Value Signal (Commercial Readiness)
              </div>
              <h3 className="text-base font-bold text-white font-display">
                $4,800 LOI Pipeline & Real Term Sheets
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Two enterprise SaaS sales teams signed pilot LOIs to onboard new SDRs, while 2 beta founders closed real $1.5M+ seed rounds after rehearsing with Elena.
              </p>
              <div className="pt-2 text-xs font-mono text-indigo-400">
                • 100% willing to pay $29-$49/seat/mo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Qualitative Founder Interviews */}
      {activeTab === 'interviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {USER_INTERVIEWS.map((interview) => (
            <div
              key={interview.id}
              className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={interview.avatarImg}
                      alt={interview.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white font-display">{interview.name}</h4>
                      <div className="text-xs text-indigo-400">{interview.title}</div>
                      <div className="text-[10px] text-slate-400">{interview.cohort} • {interview.location}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {interview.scoreImprovement}
                  </span>
                </div>

                <div className="p-3.5 bg-dark-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 italic leading-relaxed">
                  "{interview.quote}"
                </div>

                <div className="text-xs text-slate-300">
                  <strong className="text-indigo-300">Core Product Insight:</strong> {interview.keyInsight}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800/80">
                {interview.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {tag}
                  </span>
                ))}
                <span className="text-[10px] text-slate-500 ml-auto">
                  {interview.sessionCount} sessions logged
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Validated Session Logs Explorer */}
      {activeTab === 'sessions' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-4 p-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sessions or founders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={selectedPersonaFilter}
                onChange={(e) => setSelectedPersonaFilter(e.target.value)}
                className="bg-dark-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Personas</option>
                <option value="elena">Elena Vance (VC)</option>
                <option value="marcus">Marcus Chen (Enterprise)</option>
                <option value="sarah">Sarah Jenkins (Angel)</option>
              </select>
            </div>

            <div className="text-xs text-slate-400">
              Showing <strong className="text-white">{filteredSessions.length}</strong> validated runs
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider bg-dark-900/40">
                  <th className="p-3">Session ID</th>
                  <th className="p-3">Founder / User</th>
                  <th className="p-3">Avatar Interrogator</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Cadence & Fillers</th>
                  <th className="p-3">Outcome Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSessions.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono text-slate-400">{s.id}</td>
                    <td className="p-3 font-medium text-white">{s.founder}</td>
                    <td className="p-3 text-indigo-400">{s.personaName}</td>
                    <td className="p-3 font-bold font-mono">
                      <span className={`px-2 py-0.5 rounded-full ${s.score >= 85 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-indigo-500/10 text-indigo-300'}`}>
                        {s.score} / 100
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-mono">
                      {s.wpm} WPM • {s.fillerWords} fillers
                    </td>
                    <td className="p-3 text-slate-300 truncate max-w-xs">{s.verdict}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
