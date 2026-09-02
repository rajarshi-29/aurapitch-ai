import React, { useState } from 'react';
import { PERSONAS } from '../data/personas';
import { Shield, Sparkles, UserCheck, Flame, ArrowRight, Play, Info } from 'lucide-react';
import AvatarCanvas from './AvatarCanvas';

export default function PersonaSelector({ selectedPersona, onSelectPersona, onStartSimulation }) {
  const [pitchTopic, setPitchTopic] = useState('AI Workflow Automation Platform for Mid-Market Enterprises');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Choose Your High-Stakes Interrogator
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white">
          Who are you pitching today?
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          Select an AI Avatar calibrated for your specific scenario. Each persona features unique visual micro-expressions, speech pacing, and tough objection algorithms.
        </p>
      </div>

      {/* Quick Pitch Topic Configuration */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 max-w-3xl mx-auto">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Your Startup / Pitch Topic
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={pitchTopic}
            onChange={(e) => setPitchTopic(e.target.value)}
            placeholder="e.g. AI-powered code security scanner for fintech..."
            className="flex-1 bg-dark-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={() => onStartSimulation(selectedPersona, pitchTopic)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-white" />
            Launch Live Pitch
          </button>
        </div>
      </div>

      {/* Persona Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PERSONAS.map((p) => {
          const isSelected = selectedPersona.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelectPersona(p)}
              className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between relative group ${
                isSelected
                  ? 'glass-panel border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 bg-dark-850'
                  : 'glass-panel-interactive border border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${p.badgeColor}`}>
                  {p.badge}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-400">
                    <UserCheck className="w-4 h-4" /> Selected
                  </span>
                )}
              </div>

              {/* Avatar Canvas Preview */}
              <div className="w-44 h-44 mx-auto mb-4 relative">
                <AvatarCanvas
                  persona={p}
                  isSpeaking={isSelected}
                  expression={p.id === 'elena' ? 'skeptical' : p.id === 'marcus' ? 'analytical' : 'smiling'}
                  className="w-full h-full"
                />
              </div>

              {/* Persona Metadata */}
              <div className="space-y-2 text-center mb-5">
                <h3 className="text-xl font-bold text-white font-display">{p.name}</h3>
                <div className="text-xs text-indigo-400 font-medium">{p.role}</div>
                <div className="text-xs text-slate-400">{p.firm}</div>
                <p className="text-xs text-slate-300 italic pt-1">
                  "{p.tagline}"
                </p>
              </div>

              {/* Key Traits & Focus Areas */}
              <div className="space-y-2 border-t border-slate-800/80 pt-4 mb-5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-left">
                  Interrogation Focus:
                </div>
                <ul className="space-y-1.5 text-left">
                  {p.traits.map((trait, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPersona(p);
                  onStartSimulation(p, pitchTopic);
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <span>Practice with {p.name.split(' ')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
