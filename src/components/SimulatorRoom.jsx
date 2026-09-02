import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Send, PhoneOff, Sparkles, Volume2, 
  RefreshCw, Video, VideoOff, MessageSquare, AlertCircle, Award
} from 'lucide-react';
import AvatarCanvas from './AvatarCanvas';
import TelemetryHUD from './TelemetryHUD';
import { speechService } from '../utils/speechService';
import { analyzeTranscriptText, calculateWPM, generateSessionScorecard } from '../utils/pitchEvaluator';
import { saveSession } from '../utils/storage';

export default function SimulatorRoom({
  persona,
  pitchTopic = 'AI Workflow Automation',
  onFinishSession,
  onExit
}) {
  // Session State
  const [sessionTime, setSessionTime] = useState(0);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [avatarExpression, setAvatarExpression] = useState('neutral');
  const [currentObjectionIndex, setCurrentObjectionIndex] = useState(-1);
  const [transcriptHistory, setTranscriptHistory] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [currentInputText, setCurrentInputText] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(88);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  // Audio & Speech state
  const [micSupported, setMicSupported] = useState(true);
  const [liveTranscript, setLiveTranscript] = useState('');
  const videoRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Setup timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [transcriptHistory, liveTranscript]);

  // Initial greeting from Avatar on mount
  useEffect(() => {
    setMicSupported(speechService.isSpeechRecognitionSupported());

    const initialGreeting = persona.initialGreeting;
    const initialItem = {
      id: 'msg-0',
      sender: 'avatar',
      senderName: persona.name,
      text: initialGreeting,
      timestamp: '0:00'
    };

    setTranscriptHistory([initialItem]);
    triggerAvatarSpeech(initialGreeting, 'neutral');

    return () => {
      speechService.stopSpeaking();
      speechService.stopListening();
    };
  }, [persona]);

  // Toggle User Camera
  const toggleCamera = async () => {
    if (!webcamEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamEnabled(true);
      } catch (err) {
        console.warn('Webcam permission error:', err);
        setWebcamEnabled(false);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      setWebcamEnabled(false);
    }
  };

  // Avatar Speech Trigger
  const triggerAvatarSpeech = (text, expression = 'neutral') => {
    setAvatarExpression(expression);
    setIsAvatarSpeaking(true);

    speechService.speak(text, {
      persona,
      onStart: () => setIsAvatarSpeaking(true),
      onEnd: () => {
        setIsAvatarSpeaking(false);
        setAvatarExpression('neutral');
      }
    });
  };

  // Toggle Microphone
  const toggleMicrophone = () => {
    if (isRecordingMic) {
      speechService.stopListening();
      setIsRecordingMic(false);
      if (liveTranscript.trim()) {
        handleSendUserMessage(liveTranscript.trim());
        setLiveTranscript('');
      }
    } else {
      setLiveTranscript('');
      const started = speechService.startListening({
        onResult: ({ raw }) => {
          setLiveTranscript(raw);
        },
        onError: (err) => {
          console.warn('STT error:', err);
          setIsRecordingMic(false);
        },
        onEnd: () => {
          setIsRecordingMic(false);
        }
      });
      if (started) setIsRecordingMic(true);
    }
  };

  // Process User Response & Generate Adaptive Avatar Next Question
  const handleSendUserMessage = (textToSend) => {
    const text = (textToSend || currentInputText || liveTranscript).trim();
    if (!text) return;

    if (isRecordingMic) {
      speechService.stopListening();
      setIsRecordingMic(false);
    }

    const newResponseItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      senderName: 'You (Founder)',
      text,
      timestamp: formatTime(sessionTime)
    };

    const updatedUserResponses = [...userResponses, newResponseItem];
    setUserResponses(updatedUserResponses);
    setTranscriptHistory(prev => [...prev, newResponseItem]);
    setCurrentInputText('');
    setLiveTranscript('');

    // Update real-time confidence estimate
    const { fillerCount } = analyzeTranscriptText(text);
    const newConf = Math.max(65, Math.min(96, 90 - (fillerCount * 5)));
    setConfidenceScore(newConf);

    // Determine Avatar's next question / pushback
    setTimeout(() => {
      const nextIdx = currentObjectionIndex + 1;
      let nextScenario;

      if (nextIdx < persona.scenarios.length) {
        nextScenario = persona.scenarios[nextIdx];
        setCurrentObjectionIndex(nextIdx);
      } else {
        // Final evaluation question
        nextScenario = {
          avatarDialogue: `Understood. You've answered my toughest questions. I'm crunching the numbers with my partners. Let's look at your full pitch scorecard now.`,
          expression: 'smiling'
        };
      }

      const avatarReplyItem = {
        id: `avatar-${Date.now()}`,
        sender: 'avatar',
        senderName: persona.name,
        text: nextScenario.avatarDialogue,
        timestamp: formatTime(sessionTime)
      };

      setTranscriptHistory(prev => [...prev, avatarReplyItem]);
      triggerAvatarSpeech(nextScenario.avatarDialogue, nextScenario.expression);
    }, 900);
  };

  // End Session & Generate Post-Pitch Scorecard
  const handleCompleteSession = () => {
    speechService.stopSpeaking();
    speechService.stopListening();

    const scorecard = generateSessionScorecard({
      persona,
      transcriptHistory,
      durationSeconds: sessionTime,
      userResponses
    });

    const sessionData = {
      id: `sess-${Date.now().toString().slice(-4)}`,
      founder: 'You (Founder)',
      personaId: persona.id,
      personaName: persona.name,
      pitchTopic,
      date: new Date().toISOString().split('T')[0],
      duration: formatTime(sessionTime),
      score: scorecard.overallScore,
      verdict: scorecard.verdict,
      wpm: scorecard.wpm,
      fillerWords: scorecard.fillerCount,
      radar: scorecard.radar,
      scorecard,
      transcriptHistory,
      userResponses
    };

    saveSession(sessionData);
    onFinishSession(sessionData);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Live real-time filler word & WPM calculation
  const allUserWords = userResponses.map(r => r.text).join(' ') + ' ' + (liveTranscript || currentInputText);
  const { wordCount, fillerCount, detectedFillers } = analyzeTranscriptText(allUserWords);
  const liveWPM = calculateWPM(wordCount, sessionTime);

  // Quick preset answers for fast testing
  const quickAnswerPresets = [
    "Our blended CAC is $380 with an 18-month LTV of $4,200 and an 84% gross margin on compute.",
    "We have a proprietary dataset of 2M validated workflow graphs that horizontal LLMs cannot access.",
    "Our p99 latency is under 180ms with SOC2 Type II compliance and zero data retention for enterprises.",
    "We are raising $2M to scale enterprise sales and reach $1.5M ARR over the next 18 months."
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Top Simulation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-dark-900/90 border border-slate-800 rounded-xl p-3 px-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-display">
              Pitching: <span className="text-indigo-400">{persona.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${persona.badgeColor}`}>
                {persona.role}
              </span>
            </h2>
            <p className="text-xs text-slate-400 truncate max-w-md">
              Topic: <span className="text-slate-300">{pitchTopic}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleCamera}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              webcamEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {webcamEnabled ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            {webcamEnabled ? 'Camera On' : 'Enable Camera'}
          </button>

          <button
            onClick={handleCompleteSession}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            Finish & Get Scorecard
          </button>

          <button
            onClick={onExit}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
            title="Exit Session"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Telemetry HUD Bar */}
      <TelemetryHUD
        wpm={liveWPM}
        fillerCount={fillerCount}
        detectedFillers={detectedFillers}
        sessionTimeSeconds={sessionTime}
        isUserSpeaking={isRecordingMic || liveTranscript.length > 0}
        confidenceScore={confidenceScore}
      />

      {/* Main Roleplay Arena: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Avatar & User Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video max-h-[460px] w-full bg-dark-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
            {/* Main Animated Avatar Canvas */}
            <AvatarCanvas
              persona={persona}
              isSpeaking={isAvatarSpeaking}
              expression={avatarExpression}
              audioLevel={isAvatarSpeaking ? 0.6 : 0}
              className="w-full h-full"
            />

            {/* Picture-in-Picture User Camera */}
            <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden border-2 border-slate-700/80 bg-slate-900 shadow-xl z-20">
              {webcamEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-slate-900/90 text-slate-400">
                  <span className="text-xl mb-1">👤</span>
                  <span className="text-[10px] font-semibold text-slate-300">You (Founder)</span>
                  <span className="text-[9px] text-slate-500">Camera Off</span>
                </div>
              )}
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-dark-950/80 text-[8px] font-mono text-emerald-400 font-bold">
                LIVE
              </div>
            </div>

            {/* Speaking Status Subtitle Ribbon */}
            <div className="absolute bottom-4 left-4 z-20 max-w-[65%]">
              {isAvatarSpeaking && (
                <div className="glass-panel px-3 py-1.5 rounded-lg border border-indigo-500/40 text-xs text-slate-200 flex items-center gap-2 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate italic">"{persona.name} is speaking..."</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Click-to-Test Sample Answers */}
          <div className="glass-panel rounded-xl p-3 border border-slate-800 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Quick Practice Rebuttal Suggestions (Click to Test):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickAnswerPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendUserMessage(preset)}
                  className="text-left text-xs bg-dark-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 p-2 rounded-lg transition-colors truncate"
                  title={preset}
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Dialogue Transcript & Interaction Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col h-[540px] glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          {/* Transcript Header */}
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-dark-900/60">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Live Conversation Stream
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {transcriptHistory.length} turns recorded
            </span>
          </div>

          {/* Scrollable Chat Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {transcriptHistory.map((item) => {
              const isUser = item.sender === 'user';
              return (
                <div
                  key={item.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">{item.senderName}</span>
                    <span>•</span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-md'
                        : 'bg-dark-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              );
            })}

            {/* Interim live speech recognition streaming */}
            {liveTranscript && (
              <div className="flex flex-col items-end space-y-1">
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Transcribing Voice...
                </div>
                <div className="max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 italic">
                  "{liveTranscript}..."
                </div>
              </div>
            )}
          </div>

          {/* User Input & Microphone Controls */}
          <div className="p-3 border-t border-slate-800 bg-dark-900/80 space-y-2">
            {!micSupported && (
              <div className="text-[10px] text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Speech Recognition unavailable in this browser. Use text input below.
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMicrophone}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                  isRecordingMic
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                }`}
                title={isRecordingMic ? 'Click to Stop Speaking' : 'Click to Speak (STT)'}
              >
                {isRecordingMic ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentInputText}
                  onChange={(e) => setCurrentInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendUserMessage();
                  }}
                  placeholder={isRecordingMic ? 'Listening to your voice...' : 'Type or speak your answer...'}
                  className="w-full bg-dark-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={() => handleSendUserMessage()}
                disabled={!currentInputText.trim() && !liveTranscript.trim()}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-[9px]">Enter</kbd> to submit answer</span>
              <span className="font-mono text-emerald-400">Zero-latency simulation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
