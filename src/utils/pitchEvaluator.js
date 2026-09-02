// Pitch Evaluator & Performance Scoring Engine

const FILLER_WORDS = [
  'um', 'uh', 'like', 'basically', 'actually', 'you know', 'sort of',
  'kind of', 'literally', 'honestly', 'right', 'so yeah', 'i mean'
];

export function analyzeTranscriptText(text) {
  if (!text || typeof text !== 'string') {
    return {
      wordCount: 0,
      fillerCount: 0,
      detectedFillers: [],
      fillerDensity: 0
    };
  }

  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const wordCount = words.length;

  const detectedFillers = [];
  let fillerCount = 0;

  const lowerText = text.toLowerCase();

  FILLER_WORDS.forEach(filler => {
    // Check regex word boundary
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      fillerCount += matches.length;
      detectedFillers.push({ word: filler, count: matches.length });
    }
  });

  const fillerDensity = wordCount > 0 ? ((fillerCount / wordCount) * 100).toFixed(1) : 0;

  return {
    wordCount,
    fillerCount,
    detectedFillers,
    fillerDensity: parseFloat(fillerDensity)
  };
}

export function calculateWPM(totalWords, durationSeconds) {
  if (!durationSeconds || durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round(totalWords / minutes);
}

export function getWpmStatus(wpm) {
  if (wpm === 0) return { label: 'Silent', color: 'text-slate-400', badge: 'neutral' };
  if (wpm < 110) return { label: 'Too Slow / Hesitant', color: 'text-amber-400', badge: 'warning' };
  if (wpm <= 155) return { label: 'Optimal Executive Pace', color: 'text-emerald-400', badge: 'success' };
  if (wpm <= 180) return { label: 'Fast / Slightly Rushed', color: 'text-amber-400', badge: 'warning' };
  return { label: 'Rushing / High Anxiety', color: 'text-rose-400', badge: 'danger' };
}

export function generateSessionScorecard({
  persona,
  transcriptHistory = [],
  durationSeconds = 180,
  userResponses = []
}) {
  const allUserText = userResponses.map(r => r.text).join(' ');
  const { wordCount, fillerCount, detectedFillers } = analyzeTranscriptText(allUserText);
  const wpm = calculateWPM(wordCount, durationSeconds);

  // Calculate dimension scores (0-100)
  // 1. Clarity: based on answer length, structure, and low filler density
  const fillerPenalty = Math.min(30, fillerCount * 4);
  const clarity = Math.max(45, Math.min(98, 92 - fillerPenalty + (wordCount > 100 ? 5 : -10)));

  // 2. Defense: how directly the user addressed objections
  let defenseBonus = 0;
  if (allUserText.toLowerCase().includes('cac') || allUserText.toLowerCase().includes('margin') || allUserText.toLowerCase().includes('moat') || allUserText.toLowerCase().includes('security') || allUserText.toLowerCase().includes('customer')) {
    defenseBonus += 12;
  }
  const defense = Math.max(50, Math.min(96, 75 + defenseBonus - (fillerCount > 6 ? 8 : 0)));

  // 3. Composure / Pacing: optimal WPM (120-150) scores highest
  let composureScore = 85;
  if (wpm >= 120 && wpm <= 155) composureScore = 94;
  else if (wpm > 175 || wpm < 100) composureScore = 68;
  const composure = Math.max(40, Math.min(96, composureScore - (fillerCount > 5 ? 6 : 0)));

  // 4. Conciseness: not rambling beyond 150 words per single turn
  const avgWordsPerTurn = userResponses.length > 0 ? wordCount / userResponses.length : 60;
  let conciseness = 88;
  if (avgWordsPerTurn > 140) conciseness = 65;
  else if (avgWordsPerTurn < 25) conciseness = 70;

  // 5. Storytelling / Conviction: passion keywords and vision terms
  let story = 82;
  if (allUserText.toLowerCase().includes('mission') || allUserText.toLowerCase().includes('vision') || allUserText.toLowerCase().includes('obsessed') || allUserText.toLowerCase().includes('growth')) {
    story += 10;
  }

  // Overall Score (Weighted average)
  const overallScore = Math.round(
    clarity * 0.25 +
    defense * 0.25 +
    composure * 0.20 +
    conciseness * 0.15 +
    story * 0.15
  );

  let verdict = 'Needs Additional Rehearsal';
  let badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

  if (overallScore >= 88) {
    verdict = 'Venture Ready • High Partner Conviction';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (overallScore >= 75) {
    verdict = 'Strong Fundamentals • Polish Objection Defense';
    badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
  }

  // Actionable Coach Reframing Tips
  const coachReframing = [
    {
      topic: "Defending Against Big Tech / Moat",
      observation: "When asked about Microsoft or Salesforce competing, you focused on speed rather than proprietary data gravity.",
      recommendedScript: "Instead of 'we move faster', say: 'Our moat is the proprietary vertical workflow data graph we capture daily, which horizontal platforms cannot fine-tune for.'",
      impact: "+14 pts in Defense rating"
    },
    {
      topic: "Pacing & Filler Word Reduction",
      observation: `Detected ${fillerCount} filler words (${detectedFillers.map(f => `"${f.word}" (${f.count}x)`).slice(0, 3).join(', ')}).`,
      recommendedScript: "Use the '2-Second Power Pause'. When asked a tough valuation or margin question, pause in silence for 2 seconds before speaking. It projects executive mastery.",
      impact: "+18 pts in Composure rating"
    },
    {
      topic: "Unit Economics & CAC/LTV",
      observation: "You gave qualitative answers on growth without anchoring to a concrete payback period.",
      recommendedScript: "State: 'Our blended CAC is $420 with a 3.8-month payback period and 82% gross margins after API inference.'",
      impact: "+12 pts in Investor Conviction"
    }
  ];

  return {
    overallScore,
    verdict,
    badgeColor,
    wpm,
    wpmStatus: getWpmStatus(wpm),
    wordCount,
    fillerCount,
    detectedFillers,
    durationSeconds,
    radar: {
      clarity: Math.round(clarity),
      defense: Math.round(defense),
      composure: Math.round(composure),
      conciseness: Math.round(conciseness),
      story: Math.round(story)
    },
    coachReframing,
    timestamp: new Date().toISOString()
  };
}
