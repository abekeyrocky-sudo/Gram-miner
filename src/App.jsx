import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import confetti from 'canvas-confetti';
import { Pickaxe, Gift, Zap } from 'lucide-react';
import MiningScene from './MiningScene';

// টেস্টিংয়ের জন্য ১০ সেকেন্ড রাখা হয়েছে (প্রোডাকশনে যেমন ৪ বা ৮ ঘণ্টা = 4 * 3600)
const MINING_DURATION = 10; 
const REWARD_PER_CLAIM = 0.5; // প্রতি ক্লেইমে ০.৫ GRAM

export default function App() {
  const [balance, setBalance] = useState(12.50);
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'MINING' | 'CLAIMABLE'
  const [timeLeft, setTimeLeft] = useState(MINING_DURATION);

  // মাইনিং টাইমার লজিক
  useEffect(() => {
    let timer;
    if (status === 'MINING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'MINING') {
      setStatus('CLAIMABLE');
      triggerHaptic();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  // টেলিগ্রাম ভাইব্রেশন ফিডব্যাক
  const triggerHaptic = () => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
  };

  // Start Mining হ্যান্ডলার (Node.js API কল)
  const handleStart = async () => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });
      const data = await response.json();
      
      if (data.success) {
        setStatus('MINING');
        setTimeLeft(MINING_DURATION);
        triggerHaptic();
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  // Claim Rewards হ্যান্ডলার (Node.js API কল)
  const handleClaim = async () => {
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' })
      });
      const data = await response.json();

      if (data.success) {
        setBalance((prev) => Number((prev + data.reward).toFixed(2)));
        setStatus('IDLE');
        setTimeLeft(MINING_DURATION);

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#00d2ff', '#00ffaa', '#ffffff']
        });
        triggerHaptic();
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  // টাইমার ফরম্যাটিং (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      
      {/* ১. থ্রি.জেএস ৩ডি ক্যানভাস (Background & 3D Rig) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <Canvas camera={{ position: [0, 2.8, 6.2], fov: 42 }}>
          <MiningScene status={status} />
        </Canvas>
      </div>

      {/* ২. টেলিগ্রাম মিনি অ্যাপ UI ওভারলে (HUD) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        pointerEvents: 'none' // ক্লিক যেন ৩ডি সিনেও যেতে পারে
      }}>
        
        {/* টপ হেডার: ব্যালেন্স ও স্ট্যাটাস */}
        <div style={{ pointerEvents: 'auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(10px)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <Zap size={14} color={status === 'MINING' ? '#00ffaa' : '#888'} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {status === 'MINING' ? 'RIG RUNNING' : status === 'CLAIMABLE' ? 'CORE FULL' : 'STANDBY'}
            </span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#8e9aa8', textTransform: 'uppercase' }}>Mining Balance</p>
            <h1 style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.5px', marginTop: '4px' }}>
              {balance} <span style={{ fontSize: '20px', color: '#00d2ff' }}>GRAM</span>
            </h1>
          </div>
        </div>

        {/* বটম সেকশন: প্রগ্রেস বার ও বাটন */}
        <div style={{ pointerEvents: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* প্রগ্রেস বার (যখন মাইনিং চলছে) */}
          {status === 'MINING' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#aaa' }}>
                <span>Extracting...</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${((MINING_DURATION - timeLeft) / MINING_DURATION) * 100}%`,
                  background: 'linear-gradient(90deg, #00d2ff, #00ffaa)',
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>
          )}

          {/* ইন্টারঅ্যাকশন বাটন */}
          {status === 'IDLE' && (
            <button 
              onClick={handleStart}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #0072ff, #00d2ff)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0, 210, 255, 0.3)'
              }}>
              <Pickaxe size={20} />
              Start Mining
            </button>
          )}

          {status === 'MINING' && (
            <button 
              disabled 
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                color: '#777',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'not-allowed'
              }}>
              Mining in progress...
            </button>
          )}

          {status === 'CLAIMABLE' && (
            <button 
              onClick={handleClaim}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #00b09b, #96c93d)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(0, 255, 170, 0.3)'
              }}>
              <Gift size={20} />
              Claim +{REWARD_PER_CLAIM} GRAM
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
