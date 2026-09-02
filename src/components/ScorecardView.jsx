import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, Activity, MessageSquareWarning, Zap, CheckCircle2, 
  RotateCcw, Share2, TrendingUp, Sparkles, Copy, Check, ArrowRight
} from 'lucide-react';

export default function ScorecardView({
  sessionData,
  onRestartSession,
  onNavigateTraction
}) {
  const [copied, setCopied] = useState(false);
  const {
    score = 88,
    verdict = 'Venture Ready',
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    personaName = 'Elena Vance',
    pitchTopic = 'AI Workflow Automation',
    duration = '4m 18s',
    wpm = 138,
    fillerWords = 3,
    radar = { clarity: 90, defense: 88, composure: 92, conciseness: 85, story: 88 },
    scorecard = {},
    transcriptHistory = []
  } = sessionData || {};

  // Trigger celebration confetti on high scores
  useEffect(() => {
    if (score >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [score]);

  const handleCopyShareText = () => {
    const text = `🎯 Just scored ${score}/100 ("${verdict}") in a live venture pitch simulation with ${personaName} on AuraPitch AI!\n\nCadence: ${wpm} WPM | Fillers: ${fillerWords} | Topic: ${pitchTopic}\nRehearse your pitch: https://aurapitch.ai`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper to render SVG Radar Chart
  const renderRadarChart = () => {
    const size = 260;
    const center = size / 2;
    const radius = 95;

    const axes = [
      { key: 'clarity', label: 'Clarity', val: radar.clarity || 85, angle: -Math.PI / 2 },
      { key: 'defense', label: 'Defense', val: radar.defense || 80, angle: -Math.PI / 2 + (2 * Math.PI / 5) },
      { key: 'composure', label: 'Composure', val: radar.composure || 90, angle: -Math.PI / 2 + (4 * Math.PI / 5) },
      { key: 'conciseness', label: 'Conciseness', val: radar.conciseness || 82, angle: -Math.PI / 2 + (6 * Math.PI / 5) },
      { key: 'story', label: 'Story & Conviction', val: radar.story || 88, angle: -Math.PI / 2 + (8 * Math.PI / 5) },
    ];

    // Calculate radar polygon points
    const points = axes.map(axis => {
      const r = (axis.val / 100) * radius;
      const x = center + r * Math.cos(axis.angle);
      const y = center + r * Math.sin(axis.angle);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Concentric Webs */}
          {[0.25, 0.5, 0.75, 1.0].map((scale, i) => {
            const webPoints = axes.map(axis => {
              const r = scale * radius;
              const x = center + r * Math.cos(axis.angle);
              const y = center + r * Math.sin(axis.angle);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={i}
                points={webPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis Radial Lines */}
          {axes.map((axis, i) => {
            const x2 = center + radius * Math.cos(axis.angle);
            const y2 = center + radius * Math.sin(axis.angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* User Score Filled Polygon */}
          <polygon
            points={points}
            fill="rgba(99, 102, 241, 0.35)"
            stroke="#6366F1"
            strokeWidth="2.5"
            className="transition-all duration-700 ease-out"
          />

          {/* Axis Labels & Vertex Dots */}
          {axes.map((axis, i) => {
            const r = (axis.val / 100) * radius;
            const dotX = center + r * Math.cos(axis.angle);
            const dotY = center + r * Math.sin(axis.angle);

            const labelR = radius + 22;
            const labelX = center + labelR * Math.cos(axis.angle);
            const labelY = center + labelR * Math.sin(axis.angle);

            return (
              <g key={i}>
                <circle cx={dotX} cy={dotY} r="4" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="1.5" />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontWeight="600"
                >
                  {axis.label} ({axis.val})
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const coachTips = scorecard.coachReframing || [
    {
      topic: "Defending Against Big Tech / Moat",
      observation: "When asked about Microsoft or Salesforce competing, you focused on speed rather than proprietary data gravity.",
      recommendedScript: "Instead of 'we move faster', say: 'Our moat is the proprietary vertical workflow data graph we capture daily, which horizontal platforms cannot fine-tune for.'",
      impact: "+14 pts in Defense rating"
    },
    {
      topic: "Pacing & Filler Word Reduction",
      observation: `Detected ${fillerWords} filler words in this session.`,
      recommendedScript: "Use the '2-Second Power Pause'. When asked a tough valuation or margin question, pause in silence for 2 seconds before speaking. It projects executive mastery.",
      impact: "+18 pts in Composure rating"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner & Main Scorecard */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Score & Verdict */}
          <div className="space-y-4 text-center lg:text-left max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              Official Venture Readiness Scorecard
            </div>

            <div>
              <div className="flex items-baseline justify-center lg:justify-start gap-3">
                <span className="text-6xl sm:text-7xl font-extrabold font-display tracking-tight text-white">
                  {score}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-slate-500">/ 100</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 font-display">
                {verdict}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Simulation against <strong className="text-slate-200">{personaName}</strong> on the topic: <span className="text-indigo-400 italic">"{pitchTopic}"</span>.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={handleCopyShareText}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Share Scorecard'}
              </button>

              <button
                onClick={onRestartSession}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Rehearse Again
              </button>

              <button
                onClick={onNavigateTraction}
                className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                View Benchmark Traction
              </button>
            </div>
          </div>

          {/* Right: 5-Axis Radar Chart */}
          <div className="flex flex-col items-center glass-panel rounded-2xl p-4 border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Competency Matrix Breakdown
            </span>
            {renderRadarChart()}
          </div>
        </div>
      </div>

      {/* Core Telemetry Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Cadence Pacing</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{wpm} WPM</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Optimal range: 125-155</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Filler Word Count</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{fillerWords}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Top: "um", "basically"</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Session Length</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{duration}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Rapid objection drill</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 text-center">
          <div className="text-xs text-slate-400 font-medium">Venture Readiness</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">Tier 1</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Top 15th percentile</div>
        </div>
      </div>

      {/* Actionable Coach Reframing Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white font-display">
            Actionable Coach Re-framing Guide
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Specific revisions calibrated from your live simulation turns to eliminate weak phrasing and amplify investor conviction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {coachTips.map((tip, idx) => (
            <div key={idx} className="bg-dark-950/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                  {tip.topic}
                </span>
                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Observation:</strong> {tip.observation}
                </p>
                <div className="p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl text-xs text-indigo-200 leading-relaxed italic">
                  💡 "{tip.recommendedScript}"
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                <span>Estimated Impact</span>
                <span>{tip.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timestamped Transcript Replay Accordion */}
      {transcriptHistory.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-display">
            Full Timestamped Simulation Transcript ({transcriptHistory.length} turns)
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {transcriptHistory.map((item, idx) => {
              const isUser = item.sender === 'user';
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                    isUser
                      ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-100 ml-6'
                      : 'bg-dark-950/70 border-slate-800 text-slate-300 mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">{item.senderName}</span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
