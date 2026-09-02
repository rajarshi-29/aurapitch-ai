export const PERSONAS = [
  {
    id: 'elena',
    name: 'Elena Vance',
    role: 'Tier-1 Venture Partner',
    firm: 'Peak Horizon Ventures',
    tagline: 'Ruthlessly analytical, metrics-obsessed, checks your moat and CAC/LTV.',
    badge: 'Hardest Difficulty',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    avatar: {
      accentColor: '#F43F5E',
      glowColor: 'rgba(244, 63, 94, 0.4)',
      gender: 'female',
      hairColor: '#2A2438',
      hairStyle: 'sleek_bob',
      skinTone: '#F3D2C1',
      suitColor: '#1E1B4B',
      glasses: true,
      eyeColor: '#4338CA',
    },
    voice: {
      pitch: 1.05,
      rate: 1.02,
      lang: 'en-US',
      preferredVoiceNames: ['Samantha', 'Google US English', 'Microsoft Zira', 'Karen'],
    },
    traits: [
      'Questions unit economics & margins',
      'Challenges moat against Big Tech',
      'Expects concise, direct 30s answers'
    ],
    initialGreeting: "Hi there. Thanks for coming in. I have 10 minutes before my partner meeting. Give me your 30-second elevator pitch: what exact problem are you solving, and who pays you?",
    scenarios: [
      {
        id: 'opening',
        triggerKeywords: ['help', 'platform', 'ai', 'build', 'solving', 'customer', 'market'],
        avatarDialogue: "Interesting. But every founder pitching me this week claims to have an AI platform. Why will incumbents like Microsoft or Salesforce not simply ship this as a feature next quarter?",
        expression: 'skeptical',
        expectedPoints: ['Data gravity / proprietary dataset', 'Workflow entrenchment', 'Specialized speed'],
      },
      {
        id: 'economics',
        triggerKeywords: ['revenue', 'pricing', 'cac', 'ltv', 'margin', 'subscription', 'growth', 'charge', 'cost'],
        avatarDialogue: "Let's talk unit economics. What is your Customer Acquisition Cost, and what does your gross margin look like after LLM inference costs and infrastructure compute?",
        expression: 'analytical',
        expectedPoints: ['High LTV/CAC ratio', 'Margin resilience', 'Model optimization'],
      },
      {
        id: 'tam_gtm',
        triggerKeywords: ['market', 'tam', 'sales', 'gtm', 'b2b', 'enterprise', 'scale', 'distribution'],
        avatarDialogue: "How are you acquiring your first 100 paying customers without burning millions on paid ads? What is your unfair distribution advantage?",
        expression: 'challenging',
        expectedPoints: ['Product-led growth loop', 'Direct enterprise outreach', 'Organic viral mechanism'],
      },
      {
        id: 'closing',
        triggerKeywords: ['round', 'raising', 'valuation', 'invest', 'team', 'vision', 'future'],
        avatarDialogue: "If we lead this $2.5M seed round today, what are the exact 3 milestones you will de-risk over the next 18 months before raising Series A?",
        expression: 'evaluating',
        expectedPoints: ['ARR milestone', 'Key enterprise logos', 'Product defensibility'],
      }
    ]
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'Enterprise VP of Engineering & Buyer',
    firm: 'HyperScale Cloud Systems',
    tagline: 'Pragmatic, security-first tech executive evaluating deployment risk & SLAs.',
    badge: 'Technical Pitch',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    avatar: {
      accentColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      gender: 'male',
      hairColor: '#1E293B',
      hairStyle: 'short_fade',
      skinTone: '#E2B89B',
      suitColor: '#0F172A',
      glasses: false,
      eyeColor: '#0284C7',
    },
    voice: {
      pitch: 0.85,
      rate: 0.98,
      lang: 'en-US',
      preferredVoiceNames: ['Daniel', 'Google UK English Male', 'Microsoft David', 'Alex'],
    },
    traits: [
      'Focuses on SOC2, GDPR & security',
      'Probes latency & uptime SLAs',
      'Looks for zero-friction API integration'
    ],
    initialGreeting: "Hey. We run over 40,000 production workloads across multi-cloud. Walk me through your technical architecture and what kind of integration lift my engineering team is looking at.",
    scenarios: [
      {
        id: 'security',
        triggerKeywords: ['api', 'sdk', 'cloud', 'data', 'deploy', 'architecture', 'install'],
        avatarDialogue: "My CISO will veto any solution that routes our proprietary customer telemetry through shared third-party endpoints. How do you handle SOC2 Type II compliance and data isolation?",
        expression: 'serious',
        expectedPoints: ['VPC deployment option', 'Zero data retention policy', 'End-to-end encryption'],
      },
      {
        id: 'latency',
        triggerKeywords: ['realtime', 'speed', 'fast', 'latency', 'seconds', 'performance', 'scale'],
        avatarDialogue: "What is your p99 latency SLA when under heavy batch load? We cannot afford more than a 250ms delay in our critical transaction path.",
        expression: 'analytical',
        expectedPoints: ['Edge caching', 'Sub-200ms p99', 'High availability fallbacks'],
      },
      {
        id: 'closing_tech',
        triggerKeywords: ['pilot', 'poc', 'trial', 'contract', 'engineer', 'test'],
        avatarDialogue: "If we agree to a 30-day technical POC next Monday, what does success criteria look like for your deployment?",
        expression: 'approving',
        expectedPoints: ['Clear quantitative KPI', 'Time-to-first-value in 48 hours', 'Dedicated solutions engineer'],
      }
    ]
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    role: 'Lead Seed Angel & Talent Partner',
    firm: 'FounderFirst Capital',
    tagline: 'High EQ, story-driven, tests founder obsession, resilience, and vision.',
    badge: 'Narrative & Story',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    avatar: {
      accentColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      gender: 'female',
      hairColor: '#9A3412',
      hairStyle: 'curly_updo',
      skinTone: '#FCD34D',
      suitColor: '#064E3B',
      glasses: false,
      eyeColor: '#059669',
    },
    voice: {
      pitch: 1.15,
      rate: 1.05,
      lang: 'en-US',
      preferredVoiceNames: ['Victoria', 'Google UK English Female', 'Microsoft Zira', 'Fiona'],
    },
    traits: [
      'Probes founder origin story & obsession',
      'Assesses storytelling clarity & energy',
      'Looks for authentic customer empathy'
    ],
    initialGreeting: "Welcome! I love backing founders who have lived this problem firsthand. Tell me: what personal insight sparked this idea, and why are you the exact person uniquely equipped to build this?",
    scenarios: [
      {
        id: 'story',
        triggerKeywords: ['built', 'started', 'experience', 'frustrated', 'years', 'working', 'problem'],
        avatarDialogue: "I can feel the passion! But tell me about your earliest painful customer interview. What surprised you that completely overturned your initial hypothesis?",
        expression: 'interested',
        expectedPoints: ['Unexpected customer pain', 'Agile pivot or insight', 'Obsession with feedback'],
      },
      {
        id: 'team',
        triggerKeywords: ['co-founder', 'team', 'engineers', 'hiring', 'culture', 'passion'],
        avatarDialogue: "Early stage is all about velocity and hiring magnetic talent. How did you and your co-founder resolve your last major strategic disagreement?",
        expression: 'empathetic',
        expectedPoints: ['Healthy conflict resolution', 'Customer data-driven decisions', 'Mutual trust'],
      },
      {
        id: 'closing_angel',
        triggerKeywords: ['vision', 'future', '10 years', 'billion', 'impact', 'mission'],
        avatarDialogue: "Imagine it is 2030 and your company is doing $100M ARR. What fundamental aspect of how the world works did you change?",
        expression: 'smiling',
        expectedPoints: ['Bold transformative vision', 'High agency', 'Inspirational clarity'],
      }
    ]
  }
];
