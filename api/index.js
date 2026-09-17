// api/index.js - Vercel Serverless Node.js Backend

// মাইনিং ডুরেশন (টেস্টিংয়ের জন্য ৩০ সেকেন্ড রাখা হয়েছে, রিয়েলে ৮ ঘণ্টা = 8 * 3600 * 1000)
const MINING_DURATION_MS = 30 * 1000; 
const REWARD_AMOUNT = 0.5; // ০.৫ GRAM

// ডেমো মেমোরি ডাটা (পরবর্তীতে এখানে MongoDB/Supabase যুক্ত করতে পারবেন)
let usersDatabase = {};

export default async function handler(req, res) {
  // ১. CORS সেটিংস (যাতে ব্রাউজার বা টেলিগ্রাম থেকে কোনো ব্লকিং ছাড়াই রিকোয়েস্ট আসে)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ২. GET রিকোয়েস্ট: সার্ভার স্টেটাস চেক
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'online',
      message: 'GRAM Miner Node.js Backend is running 24/7 on Vercel!'
    });
  }

  // ৩. POST রিকোয়েস্ট: Start & Claim হ্যান্ডলার
  if (req.method === 'POST') {
    const { action, userId = 'default_user' } = req.body || {};

    // --- START MINING HANDLER ---
    if (action === 'start') {
      const startTime = Date.now();
      usersDatabase[userId] = {
        miningStartedAt: startTime,
        isMining: true
      };

      return res.status(200).json({
        success: true,
        message: 'Mining started successfully',
        startedAt: startTime,
        durationMs: MINING_DURATION_MS
      });
    }

    // --- CLAIM HANDLER ---
    if (action === 'claim') {
      const user = usersDatabase[userId];

      if (!user || !user.isMining) {
        return res.status(400).json({
          success: false,
          error: 'No active mining session found. Please start mining first.'
        });
      }

      const timeElapsed = Date.now() - user.miningStartedAt;

      // সময় শেষ হয়েছে কি না চেক করা
      if (timeElapsed < MINING_DURATION_MS) {
        const remainingSeconds = Math.ceil((MINING_DURATION_MS - timeElapsed) / 1000);
        return res.status(400).json({
          success: false,
          error: `Mining in progress. Wait ${remainingSeconds} seconds.`,
          remainingSeconds
        });
      }

      // ক্লেইম সফল হলে স্টেট ক্লিয়ার করা
      usersDatabase[userId].isMining = false;

      return res.status(200).json({
        success: true,
        message: 'Reward claimed successfully!',
        reward: REWARD_AMOUNT
      });
    }

    return res.status(400).json({ error: 'Invalid action! Use "start" or "claim".' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
