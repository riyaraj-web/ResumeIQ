import Groq from 'groq-sdk';

let groq: Groq;

function getGroqClient(): Groq {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

interface ResumeData {
  name: string;
  skills: string[];
  experience_years: number;
  roles: Array<{ title: string; company: string; duration_months: number }>;
  education: Array<{ degree: string; field: string }>;
  projects: Array<{ name: string; tech_stack: string[] }>;
  certifications: string[];
}

interface JDData {
  role_title: string;
  required_skills: string[];
  preferred_skills: string[];
  min_experience_years: number;
  responsibilities: string[];
  keywords: string[];
}

interface GapAnalysis {
  match_score: number;
  dimension_scores: {
    skills_match: number;
    experience_match: number;
    keyword_coverage: number;
    role_alignment: number;
  };
  matched_skills: string[];
  missing_skills: string[];
  keyword_gaps: string[];
  strengths: string[];
  weaknesses: string[];
  rewritten_bullets: Array<{ original: string; rewritten: string; reason: string }>;
  interview_questions: string[];
}

function parseJSONResponse(text: string): any {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

async function callGroq(systemPrompt: string, userPrompt: string, retries = 1): Promise<any> {
  const client = getGroqClient();
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });

      const text = completion.choices[0].message.content || '';
      return parseJSONResponse(text);
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }
  }
}

export async function extractResumeData(resumeText: string): Promise<ResumeData> {
  const systemPrompt = 'You are a resume parser. Extract structured data and return ONLY valid JSON.';
  const userPrompt = `Extract the following from this resume text and return as JSON:
{
  name: string,
  skills: string[],
  experience_years: number,
  roles: [{ title: string, company: string, duration_months: number }],
  education: [{ degree: string, field: string }],
  projects: [{ name: string, tech_stack: string[] }],
  certifications: string[]
}

Resume:
"""
${resumeText}
"""`;

  return await callGroq(systemPrompt, userPrompt);
}

export async function extractJDData(jdText: string): Promise<JDData> {
  const systemPrompt = 'You are a job description analyzer. Extract requirements and return ONLY valid JSON.';
  const userPrompt = `Extract the following from this job description and return as JSON:
{
  role_title: string,
  required_skills: string[],
  preferred_skills: string[],
  min_experience_years: number,
  responsibilities: string[],
  keywords: string[]
}

Job description:
"""
${jdText}
"""`;

  return await callGroq(systemPrompt, userPrompt);
}

export async function analyzeGap(resumeData: ResumeData, jdData: JDData): Promise<GapAnalysis> {
  const systemPrompt = 'You are an expert career coach. Analyze fit between a candidate and a job. Return ONLY valid JSON.';
  const userPrompt = `Compare this candidate profile against the job requirements and return as JSON:
{
  match_score: number (0-100 overall fit),
  dimension_scores: {
    skills_match: number (0-100),
    experience_match: number (0-100),
    keyword_coverage: number (0-100),
    role_alignment: number (0-100)
  },
  matched_skills: string[],
  missing_skills: string[],
  keyword_gaps: string[],
  strengths: string[] (2-3 items),
  weaknesses: string[] (2-3 items),
  rewritten_bullets: [{ original: string, rewritten: string, reason: string }] (rewrite 3-5 weak resume bullets to be more ATS-friendly and impact-driven for this specific JD),
  interview_questions: string[] (5 likely interview questions based on the candidate's gaps)
}

Candidate profile:
${JSON.stringify(resumeData, null, 2)}

Job requirements:
${JSON.stringify(jdData, null, 2)}`;

  return await callGroq(systemPrompt, userPrompt);
}
