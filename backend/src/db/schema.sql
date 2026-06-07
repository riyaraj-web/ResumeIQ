-- ResumeIQ Database Schema

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_title TEXT,
  final_score INTEGER,
  dimension_scores JSONB,
  matched_skills TEXT[],
  missing_skills TEXT[],
  keyword_gaps TEXT[],
  strengths TEXT[],
  weaknesses TEXT[],
  rewritten_bullets JSONB,
  interview_questions TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
