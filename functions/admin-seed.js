// ==========================================
// FILE: functions/admin-seed.js
// Serverless function for seeding data (Vercel/Netlify)
// ==========================================

// For Vercel deployment
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminSecret = req.headers['x-admin-secret'];
  
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    // Check what to seed
    const { table } = req.body;

    if (table === 'all' || table === 'compliments') {
      await seedCompliments(supabaseUrl, serviceRoleKey);
    }
    
    if (table === 'all' || table === 'love_notes') {
      await seedLoveNotes(supabaseUrl, serviceRoleKey);
    }
    
    if (table === 'all' || table === 'future_dates') {
      await seedFutureDates(supabaseUrl, serviceRoleKey);
    }
    
    if (table === 'all' || table === 'grateful_entries') {
      await seedGratefulEntries(supabaseUrl, serviceRoleKey);
    }

    return res.status(200).json({ 
      success: true, 
      message: `Successfully seeded ${table}` 
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return res.status(500).json({ 
      error: 'Seeding failed', 
      details: error.message 
    });
  }
}

async function seedCompliments(supabaseUrl, serviceRoleKey) {
  const compliments = [
    { text: 'You make even ordinary days feel special.' },
    { text: 'Your laugh is my favorite sound.' },
    { text: 'I love the way you say my name, melts me every time.' },
    { text: 'You have the kindest heart, Bubu.' },
    { text: 'You make me happy just by being you.' },
    { text: 'Your smile ruins my focus (and I don\'t want it to stop).' },
    { text: 'The way you care about small things amazes me.' },
    { text: 'I feel safest when I\'m with you — even over the phone.' },
    { text: 'You have the best taste in music, and in partners.' },
    { text: 'You look so handsome when you\'re lost in thought.' },
    { text: 'Your jokes are my favorite kind of funny.' },
    { text: 'Watching you care for me makes me swoon.' },
    { text: 'You always know how to cheer me up.' },
    { text: 'Your hugs — real or virtual — fix the day.' },
    { text: 'I love how patient you are with me, Bubu.' },
    { text: 'Your texts make my heart do little somersaults.' },
    { text: 'You remember the tiny details — that\'s my favorite thing about you.' },
    { text: 'Your quiet confidence is unbelievably attractive.' },
    { text: 'Being with you feels like the safest home.' },
    { text: 'You turn my delusional world into the reality I want to be in forever.' },
    { text: 'Your voice is my favorite late-night soundtrack.' },
    { text: 'You always try — even when things are hard. That\'s adoring.' },
    { text: 'You handle me with kindness and love.' },
    { text: 'You\'re my go-to for comfort, chaos, and everything in between.' },
    { text: 'You smell like comfort after a long day.' },
    { text: 'You give the warmest, most genuine compliments back.' },
    { text: 'You make the small moments unforgettable.' },
    { text: 'Your loyalty makes me feel cherished.' },
    { text: 'You\'re my favorite person to send all memes to.' },
    { text: 'You show up in the little things, and I notice everything.' },
    { text: 'You are more than enough — always.' },
    { text: 'You make ordinary mornings feel cinematic.' },
    { text: 'I love the way you laugh at my terrible jokes.' },
    { text: 'You are my favorite notification.' },
    { text: 'You make me want to be a better me — without pressure, only love.' },
    { text: 'You light up when you talk about what you love — it\'s beautiful.' },
    { text: 'You make me melt in the best possible way.' },
    { text: 'Your hugs travel better than any message.' },
    { text: 'You\'re my calm in the storm and my spark at night.' },
    { text: 'Your courage in small things feels heroic to me.' },
    { text: 'I\'m crazy about you — in the sweetest way possible.' },
    { text: 'Your eyes when you smile — unforgettable.' },
    { text: 'Everything about you feels like home to me.' },
    { text: 'You make me fall in love with simple days all over again.' },
    { text: 'My heart does a little dance when I see your name pop up.' },
    { text: 'With you, everything is sweeter.' }
  ];

  const response = await fetch(`${supabaseUrl}/rest/v1/compliments`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(compliments)
  });

  if (!response.ok) {
    throw new Error(`Failed to seed compliments: ${response.statusText}`);
  }
}

async function seedLoveNotes(supabaseUrl, serviceRoleKey) {
  const loveNotes = [
    { category: 'Open when... you miss me', message: 'I miss you too, my baby. Close your eyes and picture that time we were sitting near the lake holding hands — I\'m there with you.', created_at: '2025-10-29' },
    { category: 'Open when... you\'re stressed', message: 'Breathe for 5. I believe in you. Remember that you handle my mood swings — you can handle this too.', created_at: '2025-10-29' },
    { category: 'Open when... you need a laugh', message: 'Remember when we were reading our old texts. And realised that we have literally been using the same statements from day 1. That was romantically so funny.😂', created_at: '2025-10-29' },
    { category: 'Open when... you can\'t sleep', message: 'Play our song and picture my hand holding yours. Remember I love you and I am gonna be your wife soon. Goodnight, Bubu.', created_at: '2025-10-29' },
    { category: 'Open when... you feel proud', message: 'I\'m so proud of you. Tell me everything — I want to clap and celebrate you even from far away.', created_at: '2025-10-29' },
    { category: 'Open when... you miss home', message: 'Think of the streets(Sada) we used to walk and the cigerette we shared — I\'m right there in your pocket of memories.', created_at: '2025-10-29' },
    { category: 'Open when... you\'re angry', message: 'I\'m listening. Breathe. When you\'re ready, tell me and I\'ll hold you over the phone with soft words.', created_at: '2025-10-29' },
    { category: 'Open when... you need motivation', message: 'Tiny steps. One thing at a time. I\'m cheering for you — don\'t forget to breathe between sprints.', created_at: '2025-10-29' },
    { category: 'Open when... you\'re bored', message: 'Reply with the woofiest emoji you can find. I\'ll match it with a crazier one.', created_at: '2025-10-29' },
    { category: 'Open when... you\'re excited', message: 'Your excitement is my favorite thing. Tell me — I want all the details and all the big emojis.', created_at: '2025-10-29' },
    { category: 'Open when... you want to flirt', message: 'Guess what I\'m thinking of right now… (Hint: it involves you on top of me).', created_at: '2025-10-29' },
    { category: 'Open when... you\'re lonely', message: 'I wish I could be there. Until then, imagine me making the silliest face and whispering(moaning) your name while you do me.', created_at: '2025-10-29' },
    { category: 'Open when... you need a pep talk', message: 'You are capable. You are loved. One small win now — then another. I\'m your loudest fan.', created_at: '2025-10-29' },
    { category: 'Open when... you want to remember us', message: 'Look at this gallery photo of our best day and remember how loud we laughed that whole night we spend together.', created_at: '2025-10-29' },
    { category: 'Open when... you need forgiveness', message: 'I forgive you. Breathe. We move forward together, always.', created_at: '2025-10-29' },
    { category: 'Open when... you want a surprise', message: 'Surprise! You owe me a reaction video when we meet — best dramatic face wins a treat.', created_at: '2025-10-29' },
    { category: 'Open when... you\'re celebrating something small', message: 'Small wins deserve confetti. Send a selfie and I\'ll celebrate like it\'s the biggest thing.', created_at: '2025-10-29' },
    { category: 'Open when... you feel insecure', message: 'You are enough. You are wanted. You are loved more than you know.', created_at: '2025-10-29' },
    { category: 'Open when... you\'re tired', message: 'Rest. Let the world wait one hour. I have soft words ready for you when you wake.', created_at: '2025-10-29' },
    { category: 'Open when... you want a memory flash', message: 'Remember our first time we met — I keep replaying your smile from that day.', created_at: '2025-10-29' },
    { category: 'Open when... you want to know what I love about you', message: 'Right now I love your patience, the way you make me laugh, and how you say my name.', created_at: '2025-10-29' },
    { category: 'Open when... you need courage', message: 'Take one tiny brave step. I\'ve got the next one with you. We\'re a team, always.', created_at: '2025-10-29' },
    { category: 'Open when... you want to plan a date', message: 'Pottery or movie night when we meet? I\'ll pack snacks. You pick the playlist.', created_at: '2025-10-29' },
    { category: 'Open when... you feel like giving up', message: 'Pause. I still choose you. One step, then another — I\'ll be here for the next one.', created_at: '2025-10-29' },
    { category: 'Open when... you want to write something', message: 'Write me a tiny love note back right now — I\'ll read it with dramatic whispers.', created_at: '2025-10-29' },
    { category: 'Open when... you want to play', message: 'Truth or dare by text? You start. 😉', created_at: '2025-10-29' },
    { category: 'Open when... you need to know time passed', message: 'We\'ve made a map of small golden moments — pick one and I\'ll name mine.', created_at: '2025-10-29' },
    { category: 'Open when... you want me to say \'I love you\'', message: 'I love you, Ayush — quietly, loudly, always.', created_at: '2025-10-29' }
  ];

  const response = await fetch(`${supabaseUrl}/rest/v1/love_notes`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(loveNotes)
  });

  if (!response.ok) {
    throw new Error(`Failed to seed love notes: ${response.statusText}`);
  }
}

async function seedFutureDates(supabaseUrl, serviceRoleKey) {
  const futureDates = [
    { title: 'Ayush\'s Birthday', target_date: '2025-12-06', category: 'Birthday', status: false, created_at: '2025-10-29' },
    { title: 'My Birthday', target_date: '2025-12-25', category: 'Birthday', status: false, created_at: '2025-10-29' },
    { title: 'Our Anniversary', target_date: '2026-05-10', category: 'Anniversary', status: false, created_at: '2025-10-29' },
    { title: 'Movie night at home', category: 'At Home', status: false, created_at: '2025-10-29' },
    { title: 'Cook a new recipe together', category: 'At Home', status: false, created_at: '2025-10-29' },
    { title: 'Stargazing picnic', category: 'Outdoors', status: false, created_at: '2025-10-29' },
    { title: 'Weekend road trip', category: 'Outdoors', status: false, created_at: '2025-10-29' },
    { title: 'Fancy dinner date', category: 'Expensive', status: false, created_at: '2025-10-29' },
    { title: 'Couple spa day', category: 'Expensive', status: false, created_at: '2025-10-29' },
    { title: 'Learn pottery together', category: 'At Home', status: false, created_at: '2025-10-29' },
    { title: 'Visit local art museum', category: 'Outdoors', status: false, created_at: '2025-10-29' }
  ];

  const response = await fetch(`${supabaseUrl}/rest/v1/future_dates`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(futureDates)
  });

  if (!response.ok) {
    throw new Error(`Failed to seed future dates: ${response.statusText}`);
  }
}

async function seedGratefulEntries(supabaseUrl, serviceRoleKey) {
  const gratefulEntries = [
    { 
      grateful_date: '2025-10-29', 
      grateful_entry: 'Today I\'m grateful for your patience and the way you always make me smile, even through a screen.',
      created_at: '2025-10-29'
    }
  ];

  const response = await fetch(`${supabaseUrl}/rest/v1/grateful_entries`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(gratefulEntries)
  });

  if (!response.ok) {
    throw new Error(`Failed to seed grateful entries: ${response.statusText}`);
  }
}

// For Netlify deployment (alternative export)
// exports.handler = handler;