import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// হাই-কোয়ালিটি ভেক্টর পাখি
function RealisticBird({ className, scale = 1 }) {
  return (
    <g className={`realistic-bird ${className}`} transform={`scale(${scale})`}>
      <path className="wing wing-back" d="M 12 12 C 16 6 22 1 30 -2 C 26 4 23 9 19 14 Z" fill="#1e293b" />
      <path className="bird-torso" d="M 4 24 C 7 21 11 18 16 16 C 22 14 27 12 32 10 C 31 12 28 14 24 16 C 19 18 13 22 8 28 C 7 26 5 25 4 24 Z" fill="#0f172a" />
      <path className="wing wing-front" d="M 17 15 C 13 8 7 1 -2 -2 C 3 5 8 11 14 17 Z" fill="#334155" />
    </g>
  );
}

// গাছের বিভিন্ন লেভেলের ভেক্টর গ্রাফিক্স (Level 1 থেকে Level 4)
function DynamicTree({ level, isGrowing }) {
  return (
    <g className={`tree-graphic ${isGrowing ? 'tree-pop' : ''}`}>
      
      {/* ============ LEVEL 1: ছোট চারাগাছ ============ */}
      {level === 1 && (
        <g>
          <path d="M 0 17 Q 2 -25 0 -55" stroke="#327529" strokeWidth="3.8" fill="none" strokeLinecap="round" />
          <path d="M 0 -15 Q -14 -25 -22 -22" stroke="#327529" strokeWidth="2.8" fill="none" />
          <path d="M -22 -22 Q -38 -32 -25 -42 Q -12 -32 -22 -22 Z" fill="#48b73b" />
          <path d="M 0 -28 Q 12 -38 20 -35" stroke="#327529" strokeWidth="2.8" fill="none" />
          <path d="M 20 -35 Q 36 -45 23 -55 Q 10 -45 20 -35 Z" fill="#48b73b" />
          <path d="M 0 -55 Q -12 -70 0 -80 Q 3 -68 0 -55 Z" fill="#58cb4a" />
          <path d="M 0 -55 Q 12 -70 0 -80 Q -3 -68 0 -55 Z" fill="#6ee060" />
        </g>
      )}

      {/* ============ LEVEL 2: মাঝারি চারা ============ */}
      {level === 2 && (
        <g>
          {/* শক্ত গুঁড়ি */}
          <path d="M -3 18 L -2 -30 Q 0 -60 0 -85 L 2 -30 L 3 18 Z" fill="#5c3818" />
          {/* ডালপালা */}
          <path d="M -1 -35 Q -25 -50 -35 -40" stroke="#5c3818" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M 1 -45 Q 25 -60 38 -52" stroke="#5c3818" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* পাতার থোকা */}
          <circle cx="-38" cy="-42" r="18" fill="#38a169" />
          <circle cx="-25" cy="-55" r="15" fill="#48bb78" />
          <circle cx="40" cy="-55" r="18" fill="#38a169" />
          <circle cx="28" cy="-68" r="16" fill="#48bb78" />
          <circle cx="0" cy="-90" r="22" fill="#48bb78" />
          <circle cx="0" cy="-105" r="18" fill="#68d391" />
        </g>
      )}

      {/* ============ LEVEL 3: পূর্ণাঙ্গ বড় বৃক্ষ ============ */}
      {level === 3 && (
        <g>
          {/* মোটা গাছের গুঁড়ি ও শিকড় */}
          <path d="M -6 18 Q -4 -30 -2 -80 L 2 -80 Q 4 -30 6 18 Z" fill="#4a2c11" />
          <path d="M -6 18 Q -14 20 -20 22" stroke="#4a2c11" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 6 18 Q 14 20 20 22" stroke="#4a2c11" strokeWidth="3" fill="none" strokeLinecap="round" />
          
          {/* ঘন ক্যানোপি (Lush Foliage Canopy) */}
          <ellipse cx="0" cy="-125" rx="55" ry="42" fill="#22543d" />
          <circle cx="-35" cy="-105" r="32" fill="#276749" />
          <circle cx="35" cy="-105" r="32" fill="#276749" />
          <circle cx="-20" cy="-135" r="32" fill="#2f855a" />
          <circle cx="20" cy="-135" r="32" fill="#2f855a" />
          <circle cx="0" cy="-145" r="30" fill="#38a169" />
          <circle cx="0" cy="-155" r="22" fill="#48bb78" />
        </g>
      )}

      {/* ============ LEVEL 4: ফলধারী রূপালী বৃক্ষ (Fruit Bearing Tree) ============ */}
      {level === 4 && (
        <g>
          {/* গুঁড়ি */}
          <path d="M -7 18 Q -5 -30 -3 -85 L 3 -85 Q 5 -30 7 18 Z" fill="#4a2c11" />
          <path d="M -7 18 Q -16 20 -22 22" stroke="#4a2c11" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 7 18 Q 16 20 22 22" stroke="#4a2c11" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* বড় ক্যানোপি */}
          <ellipse cx="0" cy="-130" rx="60" ry="46" fill="#1c4532" />
          <circle cx="-38" cy="-110" r="35" fill="#22543d" />
          <circle cx="38" cy="-110" r="35" fill="#22543d" />
          <circle cx="-22" cy="-142" r="34" fill="#276749" />
          <circle cx="22" cy="-142" r="34" fill="#276749" />
          <circle cx="0" cy="-155" r="34" fill="#2f855a" />
          <circle cx="0" cy="-168" r="24" fill="#48bb78" />

          {/* ডালে ডালে ঝুলন্ত রসালো লাল ফল (Apples / Golden Fruits) */}
          <g className="fruits-layer">
            {/* ফল ১ */}
            <circle cx="-32" cy="-98" r="6" fill="#ef4444" />
            <circle cx="-34" cy="-100" r="2" fill="#fca5a5" />
            
            {/* ফল ২ */}
            <circle cx="35" cy="-95" r="6.5" fill="#ef4444" />
            <circle cx="33" cy="-97" r="2" fill="#fca5a5" />

            {/* ফল ৩ */}
            <circle cx="-15" cy="-125" r="6.5" fill="#ef4444" />
            <circle cx="-17" cy="-127" r="2" fill="#fca5a5" />

            {/* ফল ৪ */}
            <circle cx="20" cy="-120" r="7" fill="#ef4444" />
            <circle cx="18" cy="-122" r="2.2" fill="#fca5a5" />

            {/* ফল ৫ */}
            <circle cx="-5" cy="-148" r="6" fill="#ef4444" />
            <circle cx="-7" cy="-150" r="1.8" fill="#fca5a5" />

            {/* ফল ৬ */}
            <circle cx="38" cy="-135" r="5.5" fill="#ef4444" />
            <circle cx="36" cy="-137" r="1.8" fill="#fca5a5" />
          </g>
        </g>
      )}

    </g>
  );
}

export default function App() {
  const [isDay, setIsDay] = useState(true);
  const [treeLevel, setTreeLevel] = useState(1);
  const [isGrowing, setIsGrowing] = useState(false);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsDay(currentHour >= 6 && currentHour < 18);
  }, []);

  // Level Up বাটন হ্যান্ডলার
  const handleLevelUp = () => {
    if (treeLevel >= 4) {
      // ম্যাক্স লেভেলে ফল তোলা (Harvest)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#ffd700', '#22c55e']
      });
      // হার্ভেস্ট করে আবার লেভেল ১ থেকে শুরু
      setTreeLevel(1);
      return;
    }

    setIsGrowing(true);
    setTreeLevel(prev => prev + 1);

    // সেলিব্রেশন স্পার্কল
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#4ade80', '#22c55e', '#facc15']
    });

    setTimeout(() => setIsGrowing(false), 800);
  };

  return (
    <div className="game-screen">
      {/* দিন/রাত সুইচ বাটন */}
      <button 
        className="time-toggle-btn"
        onClick={() => setIsDay(!isDay)}
      >
        {isDay ? '☀️ Day Mode' : '🌙 Night Mode'}
      </button>

      {/* ================= SVG সিনারি ================= */}
      <svg className="vector-landscape" viewBox="0 0 400 650" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            {isDay ? (
              <>
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#bae6fd" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0c1738" />
                <stop offset="50%" stopColor="#152759" />
                <stop offset="100%" stopColor="#1e3b78" />
              </>
            )}
          </linearGradient>

          <radialGradient id="sunMoonGlow" cx="50%" cy="50%" r="50%">
            {isDay ? (
              <>
                <stop offset="40%" stopColor="#fde047" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#e2e8f0" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
              </>
            )}
          </radialGradient>

          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            {isDay ? (
              <>
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#5bb3d6" />
                <stop offset="100%" stopColor="#3b90b8" />
              </>
            )}
          </linearGradient>

          <linearGradient id="fieldGrad" x1="0" y1="0" x2="0" y2="1">
            {isDay ? (
              <>
                <stop offset="0%" stopColor="#52b74b" />
                <stop offset="50%" stopColor="#3ea138" />
                <stop offset="100%" stopColor="#2c7e26" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#45a342" />
                <stop offset="50%" stopColor="#358e33" />
                <stop offset="100%" stopColor="#256f23" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* আকাশ */}
        <rect width="400" height="650" fill="url(#skyGrad)" />

        {/* রাতের তারা */}
        {!isDay && (
          <g fill="#ffffff" opacity="0.8">
            <circle cx="45" cy="85" r="1" />
            <circle cx="95" cy="50" r="1.5" />
            <circle cx="150" cy="110" r="1" />
            <circle cx="210" cy="70" r="1.2" />
            <circle cx="260" cy="130" r="1" />
            <circle cx="70" cy="180" r="1.5" />
            <circle cx="180" cy="210" r="1" />
            <circle cx="360" cy="160" r="1.2" />
            <circle cx="290" cy="220" r="1.5" />
            <circle cx="25" cy="240" r="1" />
            <circle cx="120" cy="260" r="1.2" />
          </g>
        )}

        {/* ভাসমান মেঘ */}
        {isDay && (
          <g className="floating-clouds">
            <g className="cloud cloud-1">
              <circle cx="60" cy="90" r="16" fill="#ffffff" opacity="0.85" />
              <circle cx="76" cy="84" r="22" fill="#ffffff" opacity="0.85" />
              <circle cx="95" cy="90" r="16" fill="#ffffff" opacity="0.85" />
              <rect x="60" y="88" width="35" height="18" fill="#ffffff" opacity="0.85" />
            </g>
            <g className="cloud cloud-2">
              <circle cx="200" cy="130" r="12" fill="#ffffff" opacity="0.75" />
              <circle cx="214" cy="125" r="17" fill="#ffffff" opacity="0.75" />
              <circle cx="230" cy="130" r="12" fill="#ffffff" opacity="0.75" />
              <rect x="200" y="128" width="30" height="14" fill="#ffffff" opacity="0.75" />
            </g>
          </g>
        )}

        {/* পাখি */}
        {isDay && (
          <g className="birds-layer">
            <RealisticBird className="leader-bird" scale={1.15} />
            <RealisticBird className="follower-bird-1" scale={0.9} />
            <RealisticBird className="follower-bird-2" scale={0.75} />
          </g>
        )}

        {/* সূর্য / চাঁদ */}
        {isDay ? (
          <g transform="translate(305, 85)">
            <circle cx="0" cy="0" r="48" fill="url(#sunMoonGlow)" />
            <circle cx="0" cy="0" r="28" fill="#fef08a" />
            <circle cx="0" cy="0" r="22" fill="#facc15" />
          </g>
        ) : (
          <g transform="translate(305, 85)">
            <circle cx="0" cy="0" r="42" fill="url(#sunMoonGlow)" />
            <circle cx="0" cy="0" r="28" fill="#f8fafc" />
            <ellipse cx="-7" cy="-5" rx="6" ry="4" fill="#e2e8f0" opacity="0.7" />
            <circle cx="7" cy="9" r="5" fill="#e2e8f0" opacity="0.6" />
          </g>
        )}

        {/* পাহাড় */}
        <g>
          <polygon points="-20,380 40,290 130,380" fill={isDay ? "#3b5c7a" : "#182c4f"} />
          <polygon points="40,290 90,340 130,380 40,380" fill={isDay ? "#2d4760" : "#12203a"} />

          <polygon points="80,380 170,305 260,380" fill={isDay ? "#43688a" : "#1b3057"} />
          <polygon points="170,305 210,350 260,380 170,380" fill={isDay ? "#314f6b" : "#142442"} />

          <polygon points="210,380 300,325 390,380" fill={isDay ? "#4a7296" : "#1c335c"} />
          <polygon points="300,325 340,360 390,380 300,380" fill={isDay ? "#345370" : "#13233f"} />
        </g>

        {/* নদী */}
        <path d="M -10 390 Q 150 360 410 388 L 410 425 Q 180 395 -10 420 Z" fill="url(#waterGrad)" />

        {/* সবুজ টিলা */}
        <path d="M -10 415 Q 30 380 80 405 Q 130 375 180 400 Q 230 385 280 408 L 280 430 L -10 430 Z" fill={isDay ? "#3fa342" : "#2d7a2e"} />
        <path d="M 100 420 Q 150 385 200 412 Q 250 380 300 405 L 300 430 L 100 430 Z" fill={isDay ? "#4cb84f" : "#3a8e3b"} />

        {/* উইন্ডমিল */}
        <g transform="translate(285, 335)">
          <polygon points="0,65 -2,65 -1,0 1,0 2,65" fill="#f1f5f9" />
          <circle cx="0" cy="0" r="3" fill="#cbd5e1" />
          <g className="blade-spin">
            <line x1="0" y1="0" x2="0" y2="-28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="24" y2="14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-24" y2="14" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>

        <g transform="translate(308, 338)">
          <polygon points="0,72 -2.5,72 -1.2,0 1.2,0 2.5,72" fill="#ffffff" />
          <circle cx="0" cy="0" r="3.5" fill="#cbd5e1" />
          <g className="blade-spin" style={{ animationDelay: '-1s' }}>
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="0" x2="27" y2="16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-27" y2="16" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>

        {/* সবুজ মাঠ */}
        <path d="M -10 420 Q 150 400 410 418 L 410 650 L -10 650 Z" fill="url(#fieldGrad)" />

        {/* সোলার প্যানেলসমূহ */}
        <g transform="translate(300, 432)">
          <g>
            <line x1="16" y1="18" x2="16" y2="28" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="10" y1="28" x2="22" y2="28" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="2,18 28,18 34,2 8,2" fill={isDay ? "#2563eb" : "#475569"} stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="11" y1="18" x2="17" y2="2" stroke={isDay ? "#93c5fd" : "#94a3b8"} strokeWidth="0.8" />
            <line x1="19" y1="18" x2="25" y2="2" stroke={isDay ? "#93c5fd" : "#94a3b8"} strokeWidth="0.8" />
            <line x1="5" y1="10" x2="31" y2="10" stroke={isDay ? "#93c5fd" : "#94a3b8"} strokeWidth="0.8" />
          </g>

          <g transform="translate(35, 1)">
            <line x1="16" y1="18" x2="16" y2="28" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="10" y1="28" x2="22" y2="28" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="2,18 28,18 34,2 8,2" fill={isDay ? "#2563eb" : "#475569"} stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="11" y1="18" x2="17" y2="2" stroke={isDay ? "#93c5fd" : "#94a3b8"} strokeWidth="0.8" />
            <line x1="19" y1="18" x2="25" y2="2" stroke={isDay ? "#93c5fd" : "#94a3b8"} strokeWidth="0.8" />
            <line x1="5" y1="10" x2="31" y2="10" stroke={isDay ? "#93c5fd" : "#94a3b8"} strokeWidth="0.8" />
          </g>
        </g>

        {/* পুকুর */}
        <path d="M -10 440 Q 60 445 95 470 Q 70 495 -10 485 Z" fill={isDay ? "#0284c7" : "#4aa7c7"} opacity="0.9" />
        <path d="M -10 444 Q 50 448 85 470 Q 60 490 -10 480 Z" fill={isDay ? "#38bdf8" : "#60c5e8"} />

        {/* ঘাস */}
        <g stroke={isDay ? "#1b5e20" : "#236021"} strokeWidth="2" strokeLinecap="round" fill="none">
          <path d="M 25 530 L 22 518 M 25 530 L 29 520 M 25 530 L 17 524" />
          <path d="M 60 520 L 58 510 M 60 520 L 64 512" />
          <path d="M 330 540 L 327 528 M 330 540 L 335 530" />
          <path d="M 290 620 L 287 608 M 290 620 L 295 610 M 290 620 L 282 613" />
        </g>

        {/* কেন্দ্রের গাছ ও মাটি */}
        <g transform="translate(200, 520)">
          <ellipse cx="0" cy="18" rx="42" ry="12" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" />
          <ellipse cx="0" cy="18" rx="33" ry="9" fill="#c26322" />
          <ellipse cx="0" cy="19" rx="30" ry="7" fill="#a54e14" />
          <circle cx="-12" cy="18" r="1.5" fill="#7a3406" />
          <circle cx="8" cy="20" r="1.2" fill="#7a3406" />
          <circle cx="16" cy="17" r="1.4" fill="#7a3406" />

          {/* ডাইনামিক বড় হওয়া গাছ */}
          <DynamicTree level={treeLevel} isGrowing={isGrowing} />
        </g>
      </svg>

      {/* ================= LEVEL UP অ্যাকশন বাটন ================= */}
      <div className="bottom-action-container">
        <button 
          className={`level-up-btn ${treeLevel === 4 ? 'harvest-btn' : ''}`}
          onClick={handleLevelUp}
        >
          <div className="btn-shine"></div>
          {treeLevel < 4 ? (
            <>
              <span className="btn-icon">⚡</span>
              <span className="btn-text">লেভেল আপ (Lvl {treeLevel})</span>
            </>
          ) : (
            <>
              <span className="btn-icon">🍎</span>
              <span className="btn-text">ফল সংগ্রহ করুন!</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
