-- ==========================================
-- FILE: sql/create_tables.sql
-- Create all database tables and RLS policies
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE: compliments
-- ==========================================
CREATE TABLE compliments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLE: love_notes
-- ==========================================
CREATE TABLE love_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLE: memory_vault (Gallery)
-- ==========================================
CREATE TABLE memory_vault (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploader_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLE: future_dates
-- ==========================================
CREATE TABLE future_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  target_date DATE,
  category TEXT,
  status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLE: hugs
-- ==========================================
CREATE TABLE hugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- TABLE: grateful_entries
-- ==========================================
CREATE TABLE grateful_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grateful_date DATE NOT NULL,
  grateful_entry TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE compliments ENABLE ROW LEVEL SECURITY;
ALTER TABLE love_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grateful_entries ENABLE ROW LEVEL SECURITY;

-- Compliments: authenticated users can SELECT
CREATE POLICY "Allow authenticated users to read compliments"
  ON compliments FOR SELECT
  TO authenticated
  USING (true);

-- Love Notes: authenticated users can SELECT
CREATE POLICY "Allow authenticated users to read love notes"
  ON love_notes FOR SELECT
  TO authenticated
  USING (true);

-- Memory Vault: authenticated users can INSERT and SELECT
CREATE POLICY "Allow authenticated users to upload photos"
  ON memory_vault FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Allow authenticated users to view all photos"
  ON memory_vault FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to delete their own photos"
  ON memory_vault FOR DELETE
  TO authenticated
  USING (auth.uid() = uploader_id);

-- Future Dates: authenticated users can SELECT and UPDATE
CREATE POLICY "Allow authenticated users to read future dates"
  ON future_dates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update future dates"
  ON future_dates FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert future dates"
  ON future_dates FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Hugs: authenticated users can INSERT and SELECT
CREATE POLICY "Allow authenticated users to send hugs"
  ON hugs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Allow authenticated users to read hugs"
  ON hugs FOR SELECT
  TO authenticated
  USING (true);

-- Grateful Entries: authenticated users can SELECT
CREATE POLICY "Allow authenticated users to read grateful entries"
  ON grateful_entries FOR SELECT
  TO authenticated
  USING (true);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Compliments (50 items)
INSERT INTO compliments (text) VALUES
('You make even ordinary days feel special.'),
('Your laugh is my favorite sound.'),
('I love the way you say my name, melts me every time.'),
('You have the kindest heart, Bubu.'),
('You make me happy just by being you.'),
('Your smile ruins my focus (and I don''t want it to stop).'),
('The way you care about small things amazes me.'),
('I feel safest when I'm with you — even over the phone.'),
('You have the best taste in music, and in partners.'),
('You look so handsome when you're lost in thought.'),
('Your jokes are my favorite kind of funny.'),
('Watching you care for me makes me swoon.'),
('You always know how to cheer me up.'),
('Your hugs — real or virtual — fix the day.'),
('I love how patient you are with me, Bubu.'),
('Your texts make my heart do little somersaults.'),
('You remember the tiny details — that's my favorite thing about you.'),
('Your quiet confidence is unbelievably attractive.'),
('Being with you feels like the safest home.'),
('You turn my delusional world into the reality I want to be in forever.'),
('Your voice is my favorite late-night soundtrack.'),
('You always try — even when things are hard. That's adoring.'),
('You handle me with kindness and love.'),
('You're my go-to for comfort, chaos, and everything in between.'),
('You smell like comfort after a long day.'),
('You give the warmest, most genuine compliments back.'),
('You make the small moments unforgettable.'),
('Your loyalty makes me feel cherished.'),
('You're my favorite person to send all memes to.'),
('You show up in the little things, and I notice everything.'),
('You are more than enough — always.'),
('You make ordinary mornings feel cinematic.'),
('I love the way you laugh at my terrible jokes.'),
('You are my favorite notification.'),
('You make me want to be a better me — without pressure, only love.'),
('You light up when you talk about what you love — it's beautiful.'),
('You make me melt in the best possible way.'),
('Your hugs travel better than any message.'),
('You're my calm in the storm and my spark at night.'),
('Your courage in small things feels heroic to me.'),
('I''m crazy about you — in the sweetest way possible.'),
('Your eyes when you smile — unforgettable.'),
('Everything about you feels like home to me.'),
('You make me fall in love with simple days all over again.'),
('My heart does a little dance when I see your name pop up.'),
('With you, everything is sweeter.');

-- Love Notes (30 items)
INSERT INTO love_notes (category, message, created_at) VALUES
('Open when... you miss me', 'I miss you too, my baby. Close your eyes and picture that time we were sitting near the lake holding hands — I'm there with you.', '2025-10-29'),
('Open when... you''re stressed', 'Breathe for 5. I believe in you. Remember that you handle my mood swings — you can handle this too.', '2025-10-29'),
('Open when... you need a laugh', 'Remember when we were reading our old texts. And realised that we have literally been using the same statements from day 1. That was romantically so funny.😂', '2025-10-29'),
('Open when... you can''t sleep', 'Play our song and picture my hand holding yours. Remember I love you and I am gonna be your wife soon. Goodnight, Bubu.', '2025-10-29'),
('Open when... you feel proud', 'I''m so proud of you. Tell me everything — I want to clap and celebrate you even from far away.', '2025-10-29'),
('Open when... you miss home', 'Think of the streets(Sada) we used to walk and the cigerette we shared — I'm right there in your pocket of memories.', '2025-10-29'),
('Open when... you''re angry', 'I'm listening. Breathe. When you''re ready, tell me and I''ll hold you over the phone with soft words.', '2025-10-29'),
('Open when... you need motivation', 'Tiny steps. One thing at a time. I''m cheering for you — don''t forget to breathe between sprints.', '2025-10-29'),
('Open when... you''re bored', 'Reply with the woofiest emoji you can find. I'll match it with a crazier one.', '2025-10-29'),
('Open when... you''re excited', 'Your excitement is my favorite thing. Tell me — I want all the details and all the big emojis.', '2025-10-29'),
('Open when... you want to flirt', 'Guess what I''m thinking of right now… (Hint: it involves you on top of me).', '2025-10-29'),
('Open when... you''re lonely', 'I wish I could be there. Until then, imagine me making the silliest face and whispering(moaning) your name while you do me.', '2025-10-29'),
('Open when... you need a pep talk', 'You are capable. You are loved. One small win now — then another. I'm your loudest fan.', '2025-10-29'),
('Open when... you want to remember us', 'Look at this gallery photo of our best day and remember how loud we laughed that whole night we spend together.', '2025-10-29'),
('Open when... you need forgiveness', 'I forgive you. Breathe. We move forward together, always.', '2025-10-29'),
('Open when... you want a surprise', 'Surprise! You owe me a reaction video when we meet — best dramatic face wins a treat.', '2025-10-29'),
('Open when... you''re celebrating something small', 'Small wins deserve confetti. Send a selfie and I''ll celebrate like it''s the biggest thing.', '2025-10-29'),
('Open when... you feel insecure', 'You are enough. You are wanted. You are loved more than you know.', '2025-10-29'),
('Open when... you''re tired', 'Rest. Let the world wait one hour. I have soft words ready for you when you wake.', '2025-10-29'),
('Open when... you want a memory flash', 'Remember our first time we met — I keep replaying your smile from that day.', '2025-10-29'),
('Open when... you want to know what I love about you', 'Right now I love your patience, the way you make me laugh, and how you say my name.', '2025-10-29'),
('Open when... you need courage', 'Take one tiny brave step. I've got the next one with you. We're a team, always.', '2025-10-29'),
('Open when... you want to plan a date', 'Pottery or movie night when we meet? I'll pack snacks. You pick the playlist.', '2025-10-29'),
('Open when... you feel like giving up', 'Pause. I still choose you. One step, then another — I'll be here for the next one.', '2025-10-29'),
('Open when... you want to write something', 'Write me a tiny love note back right now — I'll read it with dramatic whispers.', '2025-10-29'),
('Open when... you want to play', 'Truth or dare by text? You start. 😉', '2025-10-29'),
('Open when... you need to know time passed', 'We've made a map of small golden moments — pick one and I'll name mine.', '2025-10-29'),
('Open when... you want me to say ''I love you''', 'I love you, Ayush — quietly, loudly, always.', '2025-10-29');

-- Future Dates (3 countdowns + sample ideas)
INSERT INTO future_dates (title, target_date, category, status, created_at) VALUES
('Ayush''s Birthday', '2025-12-06', 'Birthday', false, '2025-10-29'),
('My Birthday', '2025-12-25', 'Birthday', false, '2025-10-29'),
('Our Anniversary', '2026-05-10', 'Anniversary', false, '2025-10-29'),
('Movie night at home', NULL, 'At Home', false, '2025-10-29'),
('Cook a new recipe together', NULL, 'At Home', false, '2025-10-29'),
('Stargazing picnic', NULL, 'Outdoors', false, '2025-10-29'),
('Weekend road trip', NULL, 'Outdoors', false, '2025-10-29'),
('Fancy dinner date', NULL, 'Expensive', false, '2025-10-29'),
('Couple spa day', NULL, 'Expensive', false, '2025-10-29'),
('Learn pottery together', NULL, 'At Home', false, '2025-10-29'),
('Visit local art museum', NULL, 'Outdoors', false, '2025-10-29');

-- Grateful Entries (sample)
INSERT INTO grateful_entries (grateful_date, grateful_entry, created_at) VALUES
('2025-10-29', 'Today I''m grateful for your patience and the way you always make me smile, even through a screen.', '2025-10-29');