import React from 'react';
import { Activity, Zap, MessageSquareWarning, Clock, Volume2 } from 'lucide-react';
import { getWpmStatus } from '../utils/pitchEvaluator';

export default function TelemetryHUD({
  wpm = 0,
  fillerCount = 0,
  detectedFillers = [],
  sessionTimeSeconds = 0,
  isUserSpeaking = false,
  confidenceScore = 88
}) {
  const wpmStatus = getWpmStatus(wpm);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Speaking Cadence / WPM Meter */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Cadence (WPM)
          </span>
          <span className="text-[10px] text-slate-500">Target: 125-155</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono tracking-tight text-white">{wpm}</span>
          <span className={`text-xs font-medium ${wpmStatus.color}`}>
            {wpmStatus.label}
          </span>
        </div>
        {/* Visual WPM Gauge Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-2 overflow-hidden flex">
          <div className="bg-amber-500/40 w-1/4 h-full" title="Slow" />
          <div className="bg-emerald-500 w-1/2 h-full" title="Optimal" />
          <div className="bg-rose-500/50 w-1/4 h-full" title="Fast" />
        </div>
      </div>

      {/* 2. Filler Word Detector */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <MessageSquareWarning className={`w-3.5 h-3.5 ${fillerCount > 4 ? 'text-rose-400' : 'text-amber-400'}`} />
            Filler Words
          </span>
          <span className="text-[10px] text-slate-500">"um", "like", "actually"</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl font-bold font-mono ${fillerCount > 5 ? 'text-rose-400' : fillerCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {fillerCount}
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[110px]">
            {detectedFillers.length > 0 ? detectedFillers.map(f => f.word).join(', ') : 'Clean delivery'}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          {fillerCount === 0 ? '✨ Flawless composure' : fillerCount < 4 ? '⚠️ Keep pauses silent' : '🚨 High filler density'}
        </div>
      </div>

      {/* 3. Executive Conviction / Stability */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Vocal Conviction
          </span>
          <span className="text-[10px] text-slate-500">Live Bio-Feed</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-cyan-400">{confidenceScore}%</span>
          <span className="text-xs text-slate-300">
            {confidenceScore > 85 ? 'High Authority' : confidenceScore > 70 ? 'Good Composure' : 'Tentative'}
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${confidenceScore}%` }}
          />
        </div>
      </div>

      {/* 4. Session Timer & Mic Status */}
      <div className="glass-panel rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            Drill Duration
          </span>
          <div className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isUserSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-[10px] text-slate-400">{isUserSpeaking ? 'User Mic ON' : 'Avatar Turn'}</span>
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold font-mono text-white">
            {formatTime(sessionTimeSeconds)}
          </span>
          {/* Animated Audio Wave bars */}
          <div className="flex items-end gap-1 h-6">
            <div className={`w-1 bg-indigo-500 rounded-full ${isUserSpeaking ? 'animate-audio-bar-1' : 'h-1'}`} />
            <div className={`w-1 bg-cyan-400 rounded-full ${isUserSpeaking ? 'animate-audio-bar-2' : 'h-1.5'}`} />
            <div className={`w-1 bg-indigo-400 rounded-full ${isUserSpeaking ? 'animate-audio-bar-3' : 'h-1'}`} />
            <div className={`w-1 bg-rose-400 rounded-full ${isUserSpeaking ? 'animate-audio-bar-4' : 'h-2'}`} />
            <div className={`w-1 bg-emerald-400 rounded-full ${isUserSpeaking ? 'animate-audio-bar-5' : 'h-1'}`} />
          </div>
        </div>
        <div className="text-[10px] text-slate-500 mt-1">
          3-5 min target drill limit
        </div>
      </div>
    </div>
  );
}
