import React from 'react';
import { 
  Sparkles, Award, TrendingUp, Presentation, 
  PlusCircle, Mic, Menu, X 
} from 'lucide-react';

export default function Navbar({
  currentView,
  onNavigate,
  hasActiveScorecard = false,
  onOpenLeadCapture
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'simulator', label: 'AI Pitch Studio', icon: Mic },
    { id: 'scorecard', label: 'Diagnostic Scorecard', icon: Award, disabled: !hasActiveScorecard },
    { id: 'traction', label: 'Customer Proof & Benchmarks', icon: TrendingUp },
    { id: 'deck', label: 'Executive Product Tour', icon: Presentation },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-dark-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('simulator')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold font-display tracking-tight text-white">
                AuraPitch<span className="text-indigo-400 font-medium">AI</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <div className="text-[9px] text-slate-400 tracking-wide font-medium">
              Real-Time Executive Presence Simulator
            </div>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                disabled={item.disabled}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : item.disabled
                    ? 'opacity-40 cursor-not-allowed text-slate-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenLeadCapture}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Join Priority Access</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-dark-900 px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                disabled={item.disabled}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : item.disabled
                    ? 'opacity-40 text-slate-500'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenLeadCapture();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Join Priority Access
          </button>
        </div>
      )}
    </header>
  );
}
