'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  IconTarget,
  IconBriefcase,
  IconFileText,
  IconBulb,
  IconAlertTriangle,
  IconPencil,
  IconMessageQuestion,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import ScoreCard from '@/components/ScoreCard';
import BulletRewriter from '@/components/BulletRewriter';

interface Analysis {
  id: string;
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
  rewritten_bullets: Array<{ original: string; rewritten: string; reason: string }>;
  interview_questions: string[];
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!params || !params.id) {
        console.warn('No id param provided');
        setLoading(false);
        return;
      }
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(
          `${API_URL}/api/analyze/${params.id}`,
          { credentials: 'include' }
        );

        if (!response.ok) throw new Error('Failed to fetch analysis');

        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--c-surface)] flex items-center justify-center">
        <div className="text-[14px] text-[var(--c-gray-2)]">Loading analysis...</div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[var(--c-surface)] flex items-center justify-center">
        <div className="text-[14px] text-[var(--c-red-text)]">Analysis not found</div>
      </div>
    );
  }

  const getDimensionColor = (score: number) => {
    if (score >= 70) return 'var(--c-green-bar)';
    if (score >= 50) return 'var(--c-amber-bar)';
    return 'var(--c-red-bar)';
  };

  return (
    <div className="min-h-screen bg-[var(--c-surface)] flex fade-in">
      {/* Left Sidebar */}
      <div className="w-[280px] bg-white border-r border-[#eee] p-5 flex-shrink-0">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-[13px] font-semibold text-[var(--c-black)] mb-0.5">
            {analysis.role_title}
          </h1>
          <p className="text-[11px] text-[var(--c-gray-2)]">Analysis Results</p>
        </div>

        {/* Score Circle */}
        <ScoreCard score={analysis.final_score} />

        {/* Dimension Bars */}
        <div className="mt-4 mb-4">
          <div className="text-[10px] font-semibold text-[var(--c-gray-3)] uppercase tracking-[.06em] mb-2">
            Dimensions
          </div>
          
          {Object.entries(analysis.dimension_scores).map(([key, value]) => {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
            return (
              <div key={key} className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-medium text-[var(--c-gray-1)]">
                    {label}
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: getDimensionColor(value) }}
                  >
                    {value}%
                  </span>
                </div>
                <div className="h-[5px] bg-[var(--c-surface-2)] rounded-[3px] overflow-hidden">
                  <div
                    className="h-full rounded-[3px] transition-all duration-1000"
                    style={{
                      width: `${value}%`,
                      backgroundColor: getDimensionColor(value),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="space-y-0.5">
          <a
            href="#skills"
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium text-[var(--c-gray-1)] hover:bg-[var(--c-hover)]"
          >
            <IconTarget size={14} />
            Skills Match
          </a>
          <a
            href="#bullets"
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium text-[var(--c-gray-1)] hover:bg-[var(--c-hover)]"
          >
            <IconPencil size={14} />
            Bullet Rewrites
          </a>
          <a
            href="#questions"
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium text-[var(--c-gray-1)] hover:bg-[var(--c-hover)]"
          >
            <IconMessageQuestion size={14} />
            Interview Prep
          </a>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full mt-6 py-2 bg-[var(--c-black)] text-white rounded-lg text-[12px] font-semibold hover:bg-[#2a2a28]"
        >
          Go to Dashboard
        </button>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* Skills Section */}
        <div id="skills" className="bg-white rounded-xl border border-[var(--c-border)] p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconTarget size={14} className="text-[var(--c-purple)]" />
              <h2 className="text-[13px] font-semibold text-[var(--c-black)]">Skills Match</h2>
            </div>
            <span className="text-[11px] text-[var(--c-gray-3)]">
              {analysis.matched_skills.length + analysis.missing_skills.length} total
            </span>
          </div>

          <div className="mb-3">
            <div className="text-[11px] font-medium text-[var(--c-gray-1)] mb-1.5">
              Matched Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.matched_skills.map((skill, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1 bg-[var(--c-green-skill)] text-[var(--c-green-skill-text)] border border-[var(--c-green-skill-border)] px-2.5 py-1 rounded-md text-[11px] font-medium"
                >
                  <IconCheck size={11} />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {analysis.missing_skills.length > 0 && (
            <div>
              <div className="text-[11px] font-medium text-[var(--c-gray-1)] mb-1.5">
                Missing Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {analysis.missing_skills.map((skill, i) => (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1 bg-[var(--c-red-skill)] text-[var(--c-red-skill-text)] border border-[var(--c-red-skill-border)] px-2.5 py-1 rounded-md text-[11px] font-medium"
                  >
                    <IconX size={11} />
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-xl border border-[var(--c-border)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconBulb size={14} className="text-[var(--c-green-bar)]" />
              <h2 className="text-[13px] font-semibold text-[var(--c-black)]">Strengths</h2>
            </div>
            <ul className="space-y-1.5">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="text-[12px] text-[var(--c-gray-1)] leading-[1.5] flex gap-2">
                  <span className="text-[var(--c-green-bar)]">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-[var(--c-border)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconAlertTriangle size={14} className="text-[var(--c-amber-bar)]" />
              <h2 className="text-[13px] font-semibold text-[var(--c-black)]">Areas to Improve</h2>
            </div>
            <ul className="space-y-1.5">
              {analysis.weaknesses.map((weakness, i) => (
                <li key={i} className="text-[12px] text-[var(--c-gray-1)] leading-[1.5] flex gap-2">
                  <span className="text-[var(--c-amber-bar)]">•</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bullet Rewriter */}
        <div id="bullets" className="bg-white rounded-xl border border-[var(--c-border)] p-4 mb-3">
          <div className="flex items-center gap-2 mb-3">
            <IconPencil size={14} className="text-[var(--c-purple)]" />
            <h2 className="text-[13px] font-semibold text-[var(--c-black)]">
              Optimized Resume Bullets
            </h2>
          </div>
          <BulletRewriter bullets={analysis.rewritten_bullets} />
        </div>

        {/* Interview Questions */}
        <div id="questions" className="bg-white rounded-xl border border-[var(--c-border)] p-4">
          <div className="flex items-center gap-2 mb-3">
            <IconMessageQuestion size={14} className="text-[var(--c-purple)]" />
            <h2 className="text-[13px] font-semibold text-[var(--c-black)]">
              Likely Interview Questions
            </h2>
          </div>
          <div className="space-y-2">
            {analysis.interview_questions.map((question, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-[18px] h-[18px] rounded-full bg-[var(--c-surface-2)] flex items-center justify-center text-[9px] font-bold text-[var(--c-gray-2)] flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-[12px] text-[#333] leading-[1.5]">{question}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
