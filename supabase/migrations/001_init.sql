-- PROFILES TABLE
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text,
  avatar_url text,
  default_ai_mode text DEFAULT 'therapist',
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  onboarded boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON profiles
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- JOURNAL ENTRIES TABLE
CREATE TABLE journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transcript text NOT NULL,
  ai_response text NOT NULL,
  ai_mode text NOT NULL DEFAULT 'therapist',
  mood text NOT NULL DEFAULT 'neutral',
  word_count integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  tts_pitch numeric DEFAULT 1.0,
  tts_rate numeric DEFAULT 1.0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own entries" ON journal_entries
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create full text search index
CREATE INDEX journal_entries_search_idx ON journal_entries 
  USING gin(to_tsvector('english', transcript || ' ' || ai_response));

-- MOOD STREAKS TABLE
CREATE TABLE mood_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_entry_date date,
  total_entries integer DEFAULT 0,
  total_xp integer DEFAULT 0
);

ALTER TABLE mood_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streak" ON mood_streaks
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- TRIGGER: auto-create profile + streak row on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  
  INSERT INTO mood_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STORAGE: create avatars bucket
-- Run this in Supabase dashboard Storage tab:
-- Bucket name: avatars
-- Public: true
-- Allowed MIME types: image/*
-- Max file size: 2MB
