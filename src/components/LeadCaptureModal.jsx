import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Send, Lock } from 'lucide-react';
import { saveLead } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    stage: 'Seed Stage',
    role: 'Founder / CEO',
    pitchGoal: 'Upcoming VC Partner Meeting'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) return;

    saveLead(formData);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl max-w-lg w-full relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Priority Pilot & Beta Access
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                Get Early Access to AuraPitch AI
              </h3>
              <p className="text-xs text-slate-400">
                Join 328+ founders from Y Combinator, Techstars, and top funds practicing with personalized AI avatars.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Work / Founder Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@startup.com"
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Company / Project
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. PulseStream AI"
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Stage
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Idea / Pre-Seed">Idea / Pre-Seed</option>
                    <option value="Seed Stage">Seed Stage</option>
                    <option value="Series A / B">Series A / B</option>
                    <option value="Enterprise Team">Enterprise Team</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Primary Rehearsal Goal
                </label>
                <select
                  value={formData.pitchGoal}
                  onChange={(e) => setFormData({ ...formData, pitchGoal: e.target.value })}
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Upcoming VC Partner Meeting">Upcoming VC Partner Meeting</option>
                  <option value="Accelerator Demo Day">Accelerator Demo Day</option>
                  <option value="Enterprise Sales Discovery Calls">Enterprise Sales Discovery Calls</option>
                  <option value="Executive Job Interview">Executive Job Interview</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                Reserve Pilot Spot
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <Lock className="w-3 h-3" />
              <span>We respect your privacy. No spam. No sensitive pitch data stored.</span>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-white">
                You're on the Priority Pilot List!
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                We've reserved your access pass for <strong className="text-slate-200">{formData.email}</strong>. Our team will invite you to the private cohort onboarding.
              </p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                onClose();
              }}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Back to Simulator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
