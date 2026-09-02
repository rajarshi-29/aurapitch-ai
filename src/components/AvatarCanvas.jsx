import React, { useEffect, useRef } from 'react';

/**
 * Procedural Vector Canvas Avatar Engine
 * Renders smooth 60 FPS interactive avatar with micro-expressions,
 * eye contact tracking, blinking, and audio-synced lip movement.
 */
export default function AvatarCanvas({
  persona,
  isSpeaking = false,
  expression = 'neutral', // 'neutral', 'skeptical', 'analytical', 'interested', 'smiling', 'challenging', 'serious'
  audioLevel = 0,
  className = ''
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    blinkProgress: 0,
    isBlinking: false,
    lastBlinkTime: Date.now(),
    nextBlinkInterval: 3000,
    mouthOpen: 0,
    mouthWidth: 0,
    headTilt: 0,
    headY: 0,
    eyeGazeX: 0,
    eyeGazeY: 0,
    eyebrowL: 0,
    eyebrowR: 0,
    breathOffset: 0,
    particles: []
  });

  // Initialize floating ambient particles
  useEffect(() => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
    stateRef.current.particles = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = (time) => {
      const state = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Update Breathing & Subtle Micro-Movement
      state.breathOffset = Math.sin(time * 0.002) * 3;
      
      // 2. Blinking Logic
      const now = Date.now();
      if (!state.isBlinking && now - state.lastBlinkTime > state.nextBlinkInterval) {
        state.isBlinking = true;
        state.blinkProgress = 0;
      }
      if (state.isBlinking) {
        state.blinkProgress += 0.15;
        if (state.blinkProgress >= 1) {
          state.isBlinking = false;
          state.blinkProgress = 0;
          state.lastBlinkTime = now;
          state.nextBlinkInterval = 2500 + Math.random() * 3500;
        }
      }

      // 3. Lip sync / Mouth Movement
      if (isSpeaking) {
        const targetMouth = Math.sin(time * 0.02) * 0.6 + 0.4 + (audioLevel * 0.5);
        state.mouthOpen += (targetMouth - state.mouthOpen) * 0.3;
        state.mouthWidth = Math.sin(time * 0.015) * 6;
      } else {
        state.mouthOpen += (0 - state.mouthOpen) * 0.2;
        state.mouthWidth += (0 - state.mouthWidth) * 0.2;
      }

      // 4. Expression Transitions
      let targetEyebrowL = 0;
      let targetEyebrowR = 0;
      let targetHeadTilt = 0;
      let targetSmile = 0;

      switch (expression) {
        case 'skeptical':
          targetEyebrowL = -7; // Left eyebrow raised high
          targetEyebrowR = 2;  // Right eyebrow lowered
          targetHeadTilt = 0.04;
          break;
        case 'analytical':
          targetEyebrowL = 3;
          targetEyebrowR = 3;
          targetHeadTilt = -0.02;
          break;
        case 'interested':
        case 'smiling':
          targetEyebrowL = -3;
          targetEyebrowR = -3;
          targetSmile = 1;
          targetHeadTilt = Math.sin(time * 0.003) * 0.03;
          break;
        case 'challenging':
        case 'serious':
          targetEyebrowL = 5;
          targetEyebrowR = 5;
          targetHeadTilt = 0;
          break;
        default:
          targetEyebrowL = 0;
          targetEyebrowR = 0;
          targetHeadTilt = 0;
          break;
      }

      state.eyebrowL += (targetEyebrowL - state.eyebrowL) * 0.1;
      state.eyebrowR += (targetEyebrowR - state.eyebrowR) * 0.1;
      state.headTilt += (targetHeadTilt - state.headTilt) * 0.1;

      // 5. Clear Canvas with Gradient
      ctx.clearRect(0, 0, width, height);

      // Ambient Background Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 240);
      glowGrad.addColorStop(0, persona?.avatar?.glowColor || 'rgba(99, 102, 241, 0.25)');
      glowGrad.addColorStop(0.7, 'rgba(11, 15, 25, 0.8)');
      glowGrad.addColorStop(1, 'rgba(7, 9, 14, 0.98)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Floating Tech Dust Particles
      ctx.save();
      state.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${p.alpha * 0.6})`;
        ctx.fill();
      });
      ctx.restore();

      // Begin Avatar Group Transformation (Head Bob & Tilt)
      ctx.save();
      ctx.translate(cx, cy + 20 + state.breathOffset);
      ctx.rotate(state.headTilt);

      // --- 6. Torso / Suit / Shoulders ---
      const suitColor = persona?.avatar?.suitColor || '#1E1B4B';
      ctx.fillStyle = suitColor;
      ctx.beginPath();
      ctx.moveTo(-130, 200);
      ctx.bezierCurveTo(-110, 100, -70, 75, -45, 80);
      ctx.lineTo(45, 80);
      ctx.bezierCurveTo(70, 75, 110, 100, 130, 200);
      ctx.closePath();
      ctx.fill();

      // Shirt Collar & Tie/Lapel
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(-25, 80);
      ctx.lineTo(0, 125);
      ctx.lineTo(25, 80);
      ctx.closePath();
      ctx.fill();

      // Lapel Shadow
      ctx.strokeStyle = persona?.avatar?.accentColor || '#6366F1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-45, 80);
      ctx.lineTo(-10, 145);
      ctx.lineTo(0, 190);
      ctx.moveTo(45, 80);
      ctx.lineTo(10, 145);
      ctx.lineTo(0, 190);
      ctx.stroke();

      // --- 7. Neck ---
      const skinTone = persona?.avatar?.skinTone || '#F3D2C1';
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.rect(-24, 25, 48, 65);
      ctx.fill();

      // Neck Shadow under Chin
      ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.beginPath();
      ctx.arc(0, 28, 26, 0, Math.PI);
      ctx.fill();

      // --- 8. Head Base / Face Contour ---
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.moveTo(-58, -35);
      ctx.bezierCurveTo(-60, 25, -40, 58, 0, 62);
      ctx.bezierCurveTo(40, 58, 60, 25, 58, -35);
      ctx.bezierCurveTo(55, -95, -55, -95, -58, -35);
      ctx.fill();

      // Subtle Cheek Rouge / Lighting
      ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
      ctx.beginPath();
      ctx.arc(-35, 12, 14, 0, Math.PI * 2);
      ctx.arc(35, 12, 14, 0, Math.PI * 2);
      ctx.fill();

      // --- 9. Ears ---
      ctx.fillStyle = skinTone;
      ctx.beginPath();
      ctx.arc(-60, -2, 11, 0, Math.PI * 2);
      ctx.arc(60, -2, 11, 0, Math.PI * 2);
      ctx.fill();

      // --- 10. Hair (Back & Front) ---
      const hairColor = persona?.avatar?.hairColor || '#2A2438';
      ctx.fillStyle = hairColor;
      
      if (persona?.avatar?.hairStyle === 'sleek_bob') {
        // Elena Vance Sleek Professional Bob
        ctx.beginPath();
        ctx.moveTo(-65, -30);
        ctx.bezierCurveTo(-65, -100, 65, -100, 65, -30);
        ctx.bezierCurveTo(72, 20, 62, 50, 52, 55);
        ctx.lineTo(44, 10);
        ctx.bezierCurveTo(30, -50, -30, -50, -44, 10);
        ctx.lineTo(-52, 55);
        ctx.bezierCurveTo(-62, 50, -72, 20, -65, -30);
        ctx.fill();
      } else if (persona?.avatar?.hairStyle === 'short_fade') {
        // Marcus Chen Crisp Modern Fade
        ctx.beginPath();
        ctx.moveTo(-62, -25);
        ctx.bezierCurveTo(-60, -105, 60, -105, 62, -25);
        ctx.bezierCurveTo(62, -45, 50, -65, 0, -68);
        ctx.bezierCurveTo(-50, -65, -62, -45, -62, -25);
        ctx.fill();
      } else {
        // Sarah Jenkins Curly / Updo
        ctx.beginPath();
        ctx.arc(-35, -75, 24, 0, Math.PI * 2);
        ctx.arc(0, -90, 28, 0, Math.PI * 2);
        ctx.arc(35, -75, 24, 0, Math.PI * 2);
        ctx.arc(-55, -45, 22, 0, Math.PI * 2);
        ctx.arc(55, -45, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- 11. Eyebrows ---
      ctx.strokeStyle = hairColor;
      ctx.lineWidth = 3.8;
      ctx.lineCap = 'round';

      // Left Eyebrow
      ctx.beginPath();
      ctx.moveTo(-44, -28 + state.eyebrowL);
      ctx.quadraticCurveTo(-28, -35 + state.eyebrowL, -14, -27 + state.eyebrowL * 0.5);
      ctx.stroke();

      // Right Eyebrow
      ctx.beginPath();
      ctx.moveTo(14, -27 + state.eyebrowR * 0.5);
      ctx.quadraticCurveTo(28, -35 + state.eyebrowR, 44, -28 + state.eyebrowR);
      ctx.stroke();

      // --- 12. Eyes & Eye Contact Logic ---
      const eyeL = { x: -28, y: -12 };
      const eyeR = { x: 28, y: -12 };
      const blinkScale = state.isBlinking ? Math.sin(state.blinkProgress * Math.PI) : 0;
      const eyeHeight = Math.max(1, 10 * (1 - blinkScale));

      // Sclera (White of the eyes)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(eyeL.x, eyeL.y, 13, eyeHeight, 0, 0, Math.PI * 2);
      ctx.ellipse(eyeR.x, eyeR.y, 13, eyeHeight, 0, 0, Math.PI * 2);
      ctx.fill();

      // Irises & Pupils
      if (!state.isBlinking || blinkScale < 0.8) {
        const irisColor = persona?.avatar?.eyeColor || '#4338CA';
        const gazeX = Math.sin(time * 0.001) * 1.5;
        const gazeY = Math.cos(time * 0.001) * 0.8;

        // Left Eye Iris
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(eyeL.x, eyeL.y, 13, eyeHeight, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = irisColor;
        ctx.beginPath();
        ctx.arc(eyeL.x + gazeX, eyeL.y + gazeY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F172A'; // Pupil
        ctx.beginPath();
        ctx.arc(eyeL.x + gazeX, eyeL.y + gazeY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        // Eye Catchlight (Sparkle)
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeL.x + gazeX + 2, eyeL.y + gazeY - 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Right Eye Iris
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(eyeR.x, eyeR.y, 13, eyeHeight, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = irisColor;
        ctx.beginPath();
        ctx.arc(eyeR.x + gazeX, eyeR.y + gazeY, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F172A'; // Pupil
        ctx.beginPath();
        ctx.arc(eyeR.x + gazeX, eyeR.y + gazeY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        // Eye Catchlight
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(eyeR.x + gazeX + 2, eyeR.y + gazeY - 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Eyelashes & Upper Lid
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(eyeL.x - 14, eyeL.y - 1);
      ctx.quadraticCurveTo(eyeL.x, eyeL.y - 11 * (1 - blinkScale), eyeL.x + 14, eyeL.y - 1);
      ctx.moveTo(eyeR.x - 14, eyeR.y - 1);
      ctx.quadraticCurveTo(eyeR.x, eyeR.y - 11 * (1 - blinkScale), eyeR.x + 14, eyeR.y - 1);
      ctx.stroke();

      // --- 13. Glasses (if Persona has glasses) ---
      if (persona?.avatar?.glasses) {
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
        ctx.lineWidth = 2.6;
        // Left frame
        ctx.beginPath();
        ctx.roundRect(eyeL.x - 17, eyeL.y - 15, 34, 28, 7);
        ctx.stroke();
        // Right frame
        ctx.beginPath();
        ctx.roundRect(eyeR.x - 17, eyeR.y - 15, 34, 28, 7);
        ctx.stroke();
        // Bridge
        ctx.beginPath();
        ctx.moveTo(eyeL.x + 17, eyeL.y - 3);
        ctx.lineTo(eyeR.x - 17, eyeR.y - 3);
        ctx.stroke();
      }

      // --- 14. Nose ---
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(-3, 14);
      ctx.quadraticCurveTo(0, 18, 5, 15);
      ctx.stroke();

      // --- 15. Mouth & Dynamic Speech Visemes ---
      const mouthY = 36;
      const mouthOpenAmount = state.mouthOpen * 14;
      const smileCurve = targetSmile * 4;

      if (mouthOpenAmount > 2) {
        // Open Mouth (Talking)
        ctx.fillStyle = '#4A0E17';
        ctx.beginPath();
        ctx.moveTo(-16 - state.mouthWidth, mouthY);
        ctx.quadraticCurveTo(0, mouthY - 3, 16 + state.mouthWidth, mouthY);
        ctx.quadraticCurveTo(0, mouthY + mouthOpenAmount, -16 - state.mouthWidth, mouthY);
        ctx.fill();

        // Upper Teeth
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.rect(-10, mouthY - 1, 20, Math.min(4, mouthOpenAmount * 0.4));
        ctx.fill();

        // Lip outline
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      } else {
        // Closed / Resting Mouth (Subtle Smile or Serious Line)
        ctx.strokeStyle = '#C2410C';
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-16, mouthY);
        ctx.quadraticCurveTo(0, mouthY + smileCurve, 16, mouthY);
        ctx.stroke();
      }

      ctx.restore(); // End Avatar Group

      // --- 16. Live Audio Visualizer Halo (when speaking) ---
      if (isSpeaking) {
        ctx.save();
        ctx.strokeStyle = persona?.avatar?.accentColor || '#6366F1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const haloRadius = 145 + Math.sin(time * 0.01) * 8 + (audioLevel * 12);
        ctx.arc(cx, cy + 10, haloRadius, 0, Math.PI * 2);
        ctx.globalAlpha = 0.35 + Math.sin(time * 0.008) * 0.2;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [persona, isSpeaking, expression, audioLevel]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-dark-900 border border-slate-800 shadow-2xl flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={440}
        height={440}
        className="w-full h-full object-contain pointer-events-none select-none"
      />
      
      {/* Dynamic Expression Tag Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-950/80 backdrop-blur-md border border-slate-700/60 text-xs font-medium text-slate-300">
        <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'}`} />
        <span className="capitalize">{expression} Mode</span>
        {isSpeaking && <span className="text-emerald-400 font-semibold ml-1">Speaking...</span>}
      </div>
    </div>
  );
}
