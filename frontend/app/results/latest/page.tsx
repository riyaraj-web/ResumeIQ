'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScoreCard from '@/components/ScoreCard';
import BulletRewriter from '@/components/BulletRewriter';
import { IconArrowLeft, IconLoader2 } from '@tabler/icons-react';

interface AnalysisData {
  role_title: string;
  final_score: number;
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
  rewritten_bullets: Array<{
    original: string;
    rewritten: string;
    reason: string;
  }>;
  interview_questions: string[];
}

export default function LatestResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('latestAnalysis');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setAnalysis(data);
      } catch (error) {
        console.error('Failed to parse analysis data:', error);
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--c-surface-2)] flex items-center justify-center">
        <IconLoader2 size={32} className="animate-spin text-[var(--c-gray-3)]" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[var(--c-surface-2)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[var(--c-red-text)] mb-4">Analysis not found</p>
          <button
            onClick={() => router.push('/')}
            className="text-[12px] font-semibold text-white bg-[var(--c-black)] px-4 py-2 rounded-md hover:bg-[#2a2a28]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--c-surface-2)]">
      {/* Navbar */}
      <nav className="h-[52px] bg-white border-b border-[#eee] px-7 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[12px] text-[var(--c-gray-2)] hover:text-[var(--c-black)]"
          >
            <IconArrowLeft size={16} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-[26px] h-[26px] bg-[var(--c-black)] rounded-md flex items-center justify-center">
              <span className="text-white text-[12px] font-bold">R</span>
            </div>
            <span className="text-[14px] font-semibold text-[var(--c-black)]">ResumeIQ</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-7">
        <div className="mb-6">
          <h1 className="text-[18px] font-semibold text-[var(--c-black)] mb-1">
            Analysis Results: {analysis.role_title}
          </h1>
          <p className="text-[12px] text-[var(--c-gray-2)]">
            Here's how your resume matches this role
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ScoreCard
            title="Overall Match"
            score={analysis.final_score}
            color="purple"
          />
          <ScoreCard
            title="Skills Match"
            score={analysis.dimension_scores.skills_match}
            color="green"
          />
          <ScoreCard
            title="Experience Match"
            score={analysis.dimension_scores.experience_match}
            color="blue"
          />
          <ScoreCard
            title="Keyword Coverage"
            score={analysis.dimension_scores.keyword_coverage}
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Matched Skills */}
          <div className="bg-white rounded-lg border border-[#eee] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--c-black)] mb-3">
              Matched Skills ({analysis.matched_skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.matched_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[var(--c-green-bg)] text-[var(--c-green-text)] text-[11px] font-medium rounded-md border border-[var(--c-green-skill-border)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="bg-white rounded-lg border border-[#eee] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--c-black)] mb-3">
              Missing Skills ({analysis.missing_skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[var(--c-red-bg)] text-[var(--c-red-text)] text-[11px] font-medium rounded-md border border-[var(--c-red-border)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-lg border border-[#eee] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--c-black)] mb-3">
              Strengths
            </h3>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="text-[12px] text-[var(--c-gray-1)] flex items-start gap-2">
                  <span className="text-[var(--c-green-text)] mt-0.5">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-[#eee] p-5">
            <h3 className="text-[13px] font-semibold text-[var(--c-black)] mb-3">
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, idx) => (
                <li key={idx} className="text-[12px] text-[var(--c-gray-1)] flex items-start gap-2">
                  <span className="text-[var(--c-red-text)] mt-0.5">!</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bullet Rewrites */}
        <BulletRewriter bullets={analysis.rewritten_bullets} />

        {/* Interview Questions */}
        <div className="bg-white rounded-lg border border-[#eee] p-5 mt-5">
          <h3 className="text-[13px] font-semibold text-[var(--c-black)] mb-3">
            Likely Interview Questions
          </h3>
          <ul className="space-y-3">
            {analysis.interview_questions.map((question, idx) => (
              <li key={idx} className="text-[12px] text-[var(--c-gray-1)] flex items-start gap-2">
                <span className="text-[var(--c-purple)] font-semibold mt-0.5">{idx + 1}.</span>
                {question}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-[13px] font-semibold text-white bg-[var(--c-black)] px-6 py-2.5 rounded-md hover:bg-[#2a2a28]"
          >
            Analyze Another Resume
          </button>
        </div>
      </div>
    </div>
  );
}
