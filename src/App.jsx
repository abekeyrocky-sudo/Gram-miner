import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

// উড়ন্ত পাখি
function RealisticBird({ className, scale = 1 }) {
  return (
    <g className={`realistic-bird ${className}`} transform={`scale(${scale})`}>
      <path className="wing wing-back" d="M 12 12 C 16 6 22 1 30 -2 C 26 4 23 9 19 14 Z" fill="#1e293b" />
      <path className="bird-torso" d="M 4 24 C 7 21 11 18 16 16 C 22 14 27 12 32 10 C 31 12 28 14 24 16 C 19 18 13 22 8 28 C 7 26 5 25 4 24 Z" fill="#0f172a" />
      <path className="wing wing-front" d="M 17 15 C 13 8 7 1 -2 -2 C 3 5 8 11 14 17 Z" fill="#334155" />
    </g>
  );
}

// প্রফেশনাল ভেক্টর আপেল
function Apple({ x, y, id, harvested, onCollect }) {
  if (harvested) return null;

  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      onClick={(e) => onCollect(e, id)}
      className="clickable-apple"
      style={{ cursor: 'pointer' }}
    >
      {/* ক্লিক এরিয়া বড় করার জন্য স্বচ্ছ বৃত্ত */}
      <circle cx="0" cy="0" r="16" fill="transparent" />

      {/* আপেলের বোঁটা ও পাতা */}
      <path d="M 0 -8 Q 3 -15 8 -14" stroke="#4a2c11" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 2 -11 Q 8 -16 12 -12 Q 10 -6 2 -11 Z" fill="#4ade80" />

      {/* আপেলের মূল বডি (লাল গ্রেডিয়েন্ট ও শাইন) */}
      <path 
        d="M 0 -7 C -6 -10 -11 -4 -11 3 C -11 10 -5 13 0 14 C 5 13 11 10 11 3 C 11 -4 6 -10 0 -7 Z" 
        fill="url(#appleGrad)" 
      />

      {/* চকচকে আলোর আভা (Glossy Shine) */}
      <ellipse cx="-4" cy="-1" rx="3" ry="5" fill="#fca5a5" opacity="0.75" transform="rotate(-20 -4 -1)" />
      <circle cx="4" cy="5" r="1.5" fill="#ffffff" opacity="0.6" />
    </g>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('mine'); // 'mine' | 'task' | 'wallet'
  const [walletConnected, setWalletConnected] = useState(false);
  const [gramBalance, setGramBalance] = useState(12.50);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Join Telegram Channel', reward: 50, done: false },
    { id: 2, title: 'Follow on X (Twitter)', reward: 30, done: false },
    { id: 3, title: 'Invite 3 Friends', reward: 100, done: false },
  ]);

  const [isDay, setIsDay] = useState(true);
  const [collectedApples, setCollectedApples] = useState(0);
  const [treeShake, setTreeShake] = useState(false);
  const [popups, setPopups] = useState([]);

  // আপেলের তালিকা (স্থান ও স্ট্যাটাস)
  const [apples, setApples] = useState([
    { id: 1, x: -42, y: -110, harvested: false },
    { id: 2, x: -18, y: -135, harvested: false },
    { id: 3, x: 22, y: -140, harvested: false },
    { id: 4, x: 45, y: -115, harvested: false },
    { id: 5, x: -30, y: -80, harvested: false },
    { id: 6, x: 2, y: -95, harvested: false },
    { id: 7, x: 35, y: -85, harvested: false },
    { id: 8, x: -3, y: -60, harvested: false },
  ]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsDay(currentHour >= 6 && currentHour < 18);
  }, []);

  // আপেলে ট্যাপ করলে কালেকশন লজিক
  const handleAppleTap = (e, id) => {
    e.stopPropagation();

    // গাছ কাঁপবে
    setTreeShake(true);
    setTimeout(() => setTreeShake(false), 350);

    // আপেল হার্ভেস্ট মার্ক করা
    setApples(prev => prev.map(apple => apple.id === id ? { ...apple, harvested: true } : apple));
    setCollectedApples(prev => prev + 1);

    // ফ্লোটিং টেক্সট পপআপ তৈরি
    const rect = e.target.getBoundingClientRect();
    const newPopup = {
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top
    };
    setPopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== newPopup.id));
    }, 800);

    // টেলিগ্রাম হ্যাপটিক্স
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  // সব আপেল নতুন করে ফলানো (Regrow)
  const handleRegrow = () => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#4ade80', '#ffd700']
    });

    setApples(prev => prev.map(a => ({ ...a, harvested: false })));
  };

  const remainingApples = apples.filter(a => !a.harvested).length;

  return (
    <div className="game-screen">
      
      {/* ================= হুবহু রেফারেন্সের মতো ২টি গেম ব্যালেন্স কার্ড ================= */}
      <div className="top-bar-hud">
        {/* ডে/নাইট সুইচ */}
        <button className="time-toggle-btn" onClick={() => setIsDay(!isDay)}>
          {isDay ? '☀️ Day' : '🌙 Night'}
        </button>

        {/* ডান পাশের ২টি হুবহু ক্যাপসুল কার্ড */}
        <div className="game-cards-container">
          
          {/* ১. ৩ডি ডায়মন্ড / GRAM ব্যালেন্স কার্ড */}
          <div className="game-capsule-card">
            <div className="capsule-icon-wrap">
              {/* প্রিমিয়াম ৩ডি ভেক্টর ডায়মন্ড */}
              <svg width="27" height="25" viewBox="0 0 38 36" style={{ overflow: 'visible' }}>
                <defs>
                  <linearGradient id="diaTop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d5f8ff" />
                    <stop offset="100%" stopColor="#7be5ff" />
                  </linearGradient>
                  <linearGradient id="diaCenter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38c9ff" />
                    <stop offset="100%" stopColor="#0088dd" />
                  </linearGradient>
                  <linearGradient id="diaLeft" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#00aaff" />
                    <stop offset="100%" stopColor="#0066aa" />
                  </linearGradient>
                  <linearGradient id="diaRight" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0077cc" />
                    <stop offset="100%" stopColor="#004d80" />
                  </linearGradient>
                </defs>
                <polygon points="19,34 6,12 19,16" fill="url(#diaCenter)" />
                <polygon points="19,34 6,12 0,14" fill="url(#diaLeft)" />
                <polygon points="19,34 32,12 38,14" fill="url(#diaRight)" />
                <polygon points="19,34 19,16 32,12" fill="#0099ee" />
                <polygon points="6,12 11,3 27,3 32,12" fill="url(#diaTop)" />
                <polygon points="0,14 6,12 11,3" fill="#a8f2ff" />
                <polygon points="38,14 32,12 27,3" fill="#38c9ff" />
                <polygon points="6,12 19,16 32,12 19,8" fill="#e8fcff" opacity="0.95" />
                <circle cx="12" cy="7" r="2" fill="#ffffff" />
                <polygon points="12,3 13.5,7 12,11 10.5,7" fill="#ffffff" opacity="0.9" />
                <polygon points="8,7 12,8.5 16,7 12,5.5" fill="#ffffff" opacity="0.9" />
              </svg>
            </div>
            <span className="capsule-value">{gramBalance.toFixed(2)}</span>
            <button className="capsule-plus-btn" onClick={() => setGramBalance(prev => Number((prev + 10).toFixed(2)))}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V12M2 7H12" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ২. ৩ডি পাকা আম / ম্যাঙ্গো ব্যালেন্স কার্ড */}
          <div className="game-capsule-card">
            <div className="capsule-icon-wrap">
              {/* প্রিমিয়াম ৩ডি ভেক্টর ম্যাঙ্গো */}
              <svg width="25" height="27" viewBox="0 0 36 38" style={{ overflow: 'visible' }}>
                <defs>
                  <radialGradient id="mangoBodyGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#fff066" />
                    <stop offset="30%" stopColor="#ffc800" />
                    <stop offset="70%" stopColor="#ff9900" />
                    <stop offset="100%" stopColor="#e65c00" />
                  </radialGradient>
                  <linearGradient id="mangoLeafGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                </defs>
                <path d="M 17 8 Q 16 2 13 0" stroke="#5c3818" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <path d="M 17 7 Q 28 2 31 9 Q 26 14 17 8 Z" fill="url(#mangoLeafGrad)" stroke="#166534" strokeWidth="0.8" />
                <path d="M 17 7 Q 24 8 30 9" stroke="#bbf7d0" strokeWidth="0.8" fill="none" />
                <path 
                  d="M 17 7 C 7 7 3 15 3 24 C 3 32 9 37 17 37 C 27 37 32 30 32 21 C 32 12 25 7 17 7 Z" 
                  fill="url(#mangoBodyGrad)" 
                  stroke="#b45309"
                  strokeWidth="0.8"
                />
                <path d="M 8 16 Q 7 24 12 30" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.65" />
                <ellipse cx="12" cy="14" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.6" transform="rotate(-25 12 14)" />
                <circle cx="25" cy="27" r="1.5" fill="#ffffff" opacity="0.5" />
              </svg>
            </div>
            <span className="capsule-value">{collectedApples.toLocaleString()}</span>
            <button className="capsule-plus-btn" onClick={() => setCollectedApples(prev => prev + 5)}>
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V12M2 7H12" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* ভাসমান স্কোর অ্যানিমেশন (+1 🍎) */}
      {popups.map(p => (
        <div key={p.id} className="float-score" style={{ left: p.x, top: p.y }}>
          +1 🍎
        </div>
      ))}

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

          {/* আপেলের রিয়ালিস্টিক লাল গ্রেডিয়েন্ট */}
          <radialGradient id="appleGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>

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
            <stop offset="0%" stopColor={isDay ? "#38bdf8" : "#5bb3d6"} />
            <stop offset="100%" stopColor={isDay ? "#0284c7" : "#3b90b8"} />
          </linearGradient>

          <linearGradient id="fieldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDay ? "#52b74b" : "#45a342"} />
            <stop offset="50%" stopColor={isDay ? "#3ea138" : "#358e33"} />
            <stop offset="100%" stopColor={isDay ? "#2c7e26" : "#256f23"} />
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
          </g>
        )}

        {/* দিনের মেঘ */}
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

        {/* পর্বতমালা */}
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

        {/* সোলার প্যানেল */}
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

        {/* লেক ও ঘাস */}
        <path d="M -10 440 Q 60 445 95 470 Q 70 495 -10 485 Z" fill={isDay ? "#0284c7" : "#4aa7c7"} opacity="0.9" />
        <path d="M -10 444 Q 50 448 85 470 Q 60 490 -10 480 Z" fill={isDay ? "#38bdf8" : "#60c5e8"} />

        {/* ================= প্রফেশনাল অর্গানিক আপেল গাছ ================= */}
        <g transform="translate(200, 510) scale(1.38)">
          {/* সাদা চক দাগের রিং ও মাটি */}
          <ellipse cx="0" cy="18" rx="44" ry="13" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" />
          <ellipse cx="0" cy="18" rx="34" ry="9" fill="#c26322" />
          <ellipse cx="0" cy="19" rx="30" ry="7" fill="#a54e14" />
          <circle cx="-14" cy="18" r="1.5" fill="#7a3406" />
          <circle cx="10" cy="20" r="1.2" fill="#7a3406" />

          {/* পুরো গাছ (ট্যাপ করলে কাঁপবে) */}
          <g className={`organic-tree-group ${treeShake ? 'shake-animation' : ''}`}>
            
            {/* ১. অর্গানিক কাঠের গুঁড়ি ও শিকড় (Natural Bark & Branches) */}
            <path 
              d="M -16 20 C -12 -20 -10 -60 -12 -90 C -22 -110 -35 -125 -42 -135 C -39 -137 -34 -134 -26 -126 C -18 -118 -12 -105 -8 -98 C -6 -112 -4 -128 -2 -145 C 0 -145 2 -135 2 -120 C 6 -108 14 -116 24 -130 C 30 -137 34 -138 36 -136 C 30 -126 18 -114 8 -95 C 10 -60 12 -20 16 20 Z" 
              fill="#543310" 
            />
            {/* গুঁড়ির কাঠামোর ছায়া ও টেক্সচার */}
            <path d="M -10 18 C -6 -20 -5 -60 -7 -90" stroke="#3d2107" strokeWidth="2.5" fill="none" />
            <path d="M 4 18 C 8 -20 8 -60 5 -90" stroke="#78481a" strokeWidth="2" fill="none" />

            {/* ২. ঘন বহুমাত্রিক পাতার ক্যানোপি (Layered 3D Canopy) */}
            {/* ডার্ক ব্যাকগ্রাউন্ড শ্যাডো লিফ লেয়ার */}
            <ellipse cx="0" cy="-115" rx="66" ry="50" fill="#1b4d2e" />
            <circle cx="-42" cy="-95" r="38" fill="#1b4d2e" />
            <circle cx="42" cy="-95" r="38" fill="#1b4d2e" />

            {/* মিডটোন গ্রিন লেয়ার */}
            <circle cx="-35" cy="-110" r="36" fill="#2d6a4f" />
            <circle cx="35" cy="-110" r="36" fill="#2d6a4f" />
            <circle cx="-20" cy="-135" r="35" fill="#40916c" />
            <circle cx="20" cy="-135" r="35" fill="#40916c" />

            {/* টপ হাইলাইট লাইট গ্রিন ক্রাউন */}
            <circle cx="0" cy="-145" r="36" fill="#52b788" />
            <circle cx="0" cy="-158" r="26" fill="#74c69d" />
            <circle cx="-15" cy="-152" r="18" fill="#95d5b2" opacity="0.6" />

            {/* ৩. ইন্টারঅ্যাক্টিভ ট্যাপযোগ্য আপেলসমূহ */}
            {apples.map(apple => (
              <Apple 
                key={apple.id} 
                id={apple.id} 
                x={apple.x} 
                y={apple.y} 
                harvested={apple.harvested}
                onCollect={handleAppleTap}
              />
            ))}

          </g>
        </g>
      </svg>

      {/* ================= বটম অ্যাকশন এরিয়া ================= */}
      <div className="bottom-action-container">
        {remainingApples > 0 ? (
          <div className="tap-hint-pill">
            <span className="pulse-dot"></span>
            গাছের আপেলে ট্যাপ করে সংগ্রহ করুন! ({remainingApples} টি বাকি)
          </div>
        ) : (
          <button className="regrow-btn" onClick={handleRegrow}>
            <span className="btn-shine"></span>
            🌱 নতুন করে আপেল ফলান!
          </button>
        )}
      </div>

      {/* ================= TASK PAGE ================= */}
      {activeTab === 'task' && (
        <div className={`tab-page-modal ${isDay ? 'day-modal' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* ভেক্টর টাস্ক আইকন */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="m9 14 2 2 4-4" />
            </svg>
            <h2>Tasks & Quests</h2>
          </div>
          <p className="modal-sub">টাস্ক সম্পন্ন করে GRAM আর্ন করুন</p>
          
          <div className="tasks-list">
            {tasks.map(t => (
              <div key={t.id} className="task-item-card">
                <div>
                  <h4>{t.title}</h4>
                  <span className="task-reward">+{t.reward} GRAM</span>
                </div>
                <button 
                  className="task-btn" 
                  disabled={t.done}
                  onClick={() => {
                    setTasks(tasks.map(item => item.id === t.id ? { ...item, done: true } : item));
                    setGramBalance(prev => Number((prev + t.reward).toFixed(2)));
                  }}
                >
                  {t.done ? '✓ Claimed' : 'Claim'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ASSET / WALLET PAGE ================= */}
      {activeTab === 'wallet' && (
        <div className={`tab-page-modal ${isDay ? 'day-modal' : ''}`}>
          <h2>Asset & Wallet</h2>
          <div className="asset-card">
            <span style={{ fontSize: '12px', opacity: 0.8 }}>Total Balance</span>
            <h1 style={{ fontSize: '36px', margin: '8px 0' }}>{gramBalance} <span style={{ fontSize: '20px', color: '#0284c7' }}>GRAM</span></h1>
            <p style={{ color: '#16a34a', fontSize: '13px', fontWeight: 'bold' }}>≈ ${(gramBalance * 0.085).toFixed(2)} USD</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <button 
              className="ton-connect-btn"
              onClick={() => setWalletConnected(!walletConnected)}
            >
              {walletConnected ? '🟢 EQB9...4f71 (Connected)' : '⚡ Connect TON Wallet'}
            </button>
          </div>
        </div>
      )}

      {/* ================= ৩টি প্রফেশনাল ভেক্টর আইকনযুক্ত ন্যাভ বার ================= */}
      <nav className={`bottom-nav-bar ${isDay ? 'day-nav' : ''}`}>
        
        {/* ۱. Mine ভেক্টর আইকন (Pickaxe) */}
        <button className={`nav-btn ${activeTab === 'mine' ? 'active' : ''}`} onClick={() => setActiveTab('mine')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m14 10 7-7" />
            <path d="M3 21l6.5-6.5" />
            <path d="M12.5 5.5l1.5-1.5a4.24 4.24 0 0 1 6 6l-1.5 1.5" />
            <path d="M7 13.5a4.24 4.24 0 0 1-6-6l1.5-1.5a4.24 4.24 0 0 1 6 6l-1.5 1.5" />
          </svg>
          <span>Mine</span>
        </button>

        {/* ২. Task ভেক্টর আইকন (Checklist) */}
        <button className={`nav-btn ${activeTab === 'task' ? 'active' : ''}`} onClick={() => setActiveTab('task')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            <path d="m9 14 2 2 4-4" />
          </svg>
          <span>Task</span>
        </button>

        {/* ৩. Wallet ভেক্টর আইকন (Wallet) */}
        <button className={`nav-btn ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          </svg>
          <span>Wallet</span>
        </button>
      </nav>

    </div>
  );
}
