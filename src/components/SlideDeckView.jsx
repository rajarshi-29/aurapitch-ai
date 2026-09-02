import React, { useState, useEffect } from 'react';
import { SLIDE_DECK } from '../data/slideDeckContent';
import { 
  ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Presentation, Sparkles, Printer
} from 'lucide-react';

export default function SlideDeckView() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentSlide = SLIDE_DECK[currentSlideIndex];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentSlideIndex((prev) => Math.min(SLIDE_DECK.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header & Presentation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Presentation className="w-3.5 h-3.5" />
            Executive Product Brief & System Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            AuraPitch AI — Platform Architecture & Strategy
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Export Brief
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Present Mode'}
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {SLIDE_DECK.map((slide, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-2 rounded-xl text-left transition-all border ${
              currentSlideIndex === idx
                ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-dark-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-[10px] font-mono font-bold">Section {slide.slideNumber}</div>
            <div className="text-[10px] font-medium truncate mt-0.5">{slide.title}</div>
          </button>
        ))}
      </div>

      {/* Main Slide Canvas Frame */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative min-h-[580px] flex flex-col justify-between overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* Top Category & Slide Indicator */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {currentSlide.category}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              Section {currentSlide.slideNumber} of {SLIDE_DECK.length}
            </span>
          </div>

          {/* Slide Title & Subtitle */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-sm sm:text-base text-indigo-400 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Highlights Row */}
          {currentSlide.highlights && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentSlide.highlights.map((h, idx) => (
                <div key={idx} className="bg-dark-950/60 border border-slate-800/90 rounded-2xl p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {h.label}
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {h.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide Body Content */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 prose prose-invert max-w-none">
            {currentSlide.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-base font-bold text-white pt-2 font-display">
                    {paragraph.replace('###', '').trim()}
                  </h3>
                );
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={idx} className="space-y-1.5 list-disc pl-5">
                    {paragraph.split('\n').map((item, itemIdx) => (
                      <li key={itemIdx} className="text-slate-300">
                        {item.replace(/^- /, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.includes('|')) {
                // Render Table
                const rows = paragraph.trim().split('\n');
                const headers = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
                const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));

                return (
                  <div key={idx} className="overflow-x-auto my-3">
                    <table className="w-full text-xs text-left border-collapse border border-slate-800">
                      <thead>
                        <tr className="bg-dark-900 border-b border-slate-800 text-slate-300">
                          {headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2.5 font-bold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {dataRows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/20">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 text-slate-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Metric Highlights Footer */}
          {currentSlide.metrics && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              {currentSlide.metrics.map((m, idx) => (
                <div key={idx} className="text-center p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
                  <div className="text-lg sm:text-2xl font-bold font-display text-white">{m.value}</div>
                  <div className="text-xs font-semibold text-indigo-400">{m.label}</div>
                  <div className="text-[10px] text-slate-400">{m.sub}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slide Navigation Bottom Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6 relative z-10">
          <button
            onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Section
          </button>

          <div className="text-xs text-slate-400 font-medium">
            Use <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">←</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px] text-slate-300">→</kbd> or Spacebar to flip
          </div>

          <button
            onClick={() => setCurrentSlideIndex(prev => Math.min(SLIDE_DECK.length - 1, prev + 1))}
            disabled={currentSlideIndex === SLIDE_DECK.length - 1}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            Next Section
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
