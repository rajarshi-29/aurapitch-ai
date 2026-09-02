import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PersonaSelector from './components/PersonaSelector';
import SimulatorRoom from './components/SimulatorRoom';
import ScorecardView from './components/ScorecardView';
import TractionDashboard from './components/TractionDashboard';
import SlideDeckView from './components/SlideDeckView';
import LeadCaptureModal from './components/LeadCaptureModal';
import { PERSONAS } from './data/personas';
import { VALIDATION_SESSIONS } from './data/validationData';

export default function App() {
  const [currentView, setCurrentView] = useState('simulator'); // 'simulator', 'scorecard', 'traction', 'deck'
  const [inActiveSimulation, setInActiveSimulation] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0]); // Elena Vance default
  const [currentPitchTopic, setCurrentPitchTopic] = useState('AI Workflow Automation Platform for Mid-Market Enterprises');
  const [latestSessionData, setLatestSessionData] = useState(VALIDATION_SESSIONS[0]);
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);

  const handleStartSimulation = (persona, pitchTopic) => {
    setSelectedPersona(persona);
    setCurrentPitchTopic(pitchTopic);
    setInActiveSimulation(true);
    setCurrentView('simulator');
  };

  const handleFinishSession = (sessionData) => {
    setLatestSessionData(sessionData);
    setInActiveSimulation(false);
    setCurrentView('scorecard');
  };

  const handleExitSimulation = () => {
    setInActiveSimulation(false);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Glass Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view !== 'simulator') {
            setInActiveSimulation(false);
          }
          setCurrentView(view);
        }}
        hasActiveScorecard={Boolean(latestSessionData)}
        onOpenLeadCapture={() => setIsLeadCaptureOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentView === 'simulator' && (
          <>
            {!inActiveSimulation ? (
              <PersonaSelector
                selectedPersona={selectedPersona}
                onSelectPersona={setSelectedPersona}
                onStartSimulation={handleStartSimulation}
              />
            ) : (
              <SimulatorRoom
                persona={selectedPersona}
                pitchTopic={currentPitchTopic}
                onFinishSession={handleFinishSession}
                onExit={handleExitSimulation}
              />
            )}
          </>
        )}

        {currentView === 'scorecard' && (
          <ScorecardView
            sessionData={latestSessionData}
            onRestartSession={() => {
              setInActiveSimulation(true);
              setCurrentView('simulator');
            }}
            onNavigateTraction={() => setCurrentView('traction')}
          />
        )}

        {currentView === 'traction' && (
          <TractionDashboard
            onOpenLeadCapture={() => setIsLeadCaptureOpen(true)}
            onLaunchPractice={() => {
              setInActiveSimulation(true);
              setCurrentView('simulator');
            }}
          />
        )}

        {currentView === 'deck' && (
          <SlideDeckView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-dark-950/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">AuraPitch AI</span>
            <span className="text-slate-500">• Real-Time Executive Presence & High-Stakes Simulator</span>
          </div>
          <div className="text-slate-400">
            Enterprise-Grade Conversational Intelligence • Built for Founders & High-Stakes Leaders
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setCurrentView('deck')} className="hover:text-white transition-colors">
              Product Tour
            </button>
            <button onClick={() => setCurrentView('traction')} className="hover:text-white transition-colors">
              Customer Proof
            </button>
            <button onClick={() => setIsLeadCaptureOpen(true)} className="hover:text-white transition-colors">
              Priority Access
            </button>
          </div>
        </div>
      </footer>

      {/* Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={isLeadCaptureOpen}
        onClose={() => setIsLeadCaptureOpen(false)}
      />
    </div>
  );
}
