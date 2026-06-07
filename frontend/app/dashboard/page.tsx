'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconFileAnalytics,
  IconTrendingUp,
  IconTarget,
  IconClock,
  IconChartBar,
  IconBriefcase,
} from '@tabler/icons-react';
import HistoryList from '@/components/HistoryList';

interface Stats {
  total_analyses: number;
  avg_score: number;
  best_score: number;
  score_trend: Array<{ score: number; date: string }>;
}

interface Analysis {
  id: string;
  role_title: string;
  final_score: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analysesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/stats`, {
            credentials: 'include',
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyses`, {
            credentials: 'include',
          }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (analysesRes.ok) {
          const analysesData = await analysesRes.json();
          setAnalyses(analysesData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--c-surface)] flex items-center justify-center">
        <div className="text-[14px] text-[var(--c-gray-2)]">Loading dashboard...</div>
      </div>
    );
  }

  const getScoreDelta = () => {
    if (!stats || stats.score_trend.length < 2) return null;
    const latest = stats.score_trend[stats.score_trend.length - 1].score;
    const previous = stats.score_trend[stats.score_trend.length - 2].score;
    const delta = latest - previous;
    return delta;
  };

  const delta = getScoreDelta();

  return (
    <div className="min-h-screen bg-[var(--c-surface)] flex fade-in">
      {/* Dark Sidebar */}
      <div className="w-[220px] bg-[var(--c-sidebar-bg)] p-4 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-7">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <span className="text-[var(--c-black)] text-[11px] font-bold">R</span>
          </div>
          <span className="text-[13px] font-semibold text-[var(--c-sidebar-white)]">
            ResumeIQ
          </span>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div className="text-[9px] font-semibold text-[var(--c-sidebar-muted)] uppercase tracking-[.08em] px-2 mb-1.5">
            Main
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[var(--c-sidebar-item)] text-[var(--c-sidebar-white)] text-[12px] font-medium">
              <IconChartBar size={14} />
              Dashboard
            </div>
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-[var(--c-sidebar-text)] text-[12px] font-medium hover:bg-[var(--c-sidebar-item)] hover:text-[var(--c-sidebar-white)]"
            >
              <IconFileAnalytics size={14} />
              New Analysis
            </button>
          </div>
        </div>

        {/* User */}
        <div className="mt-auto pt-2 border-t border-[#222]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--c-purple)] flex items-center justify-center text-[11px] font-semibold text-white">
              U
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-[#ccc] truncate">User</div>
              <div className="text-[10px] text-[var(--c-sidebar-muted)]">Free Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-[16px] font-semibold text-[var(--c-black)] mb-0.5">
            Welcome back
          </h1>
          <p className="text-[12px] text-[var(--c-gray-2)]">
            Here's your resume optimization progress
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2.5 mb-4">
          <div className="bg-white border border-[var(--c-border)] rounded-[10px] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--c-gray-2)] mb-1.5">
              <IconFileAnalytics size={13} />
              Total Scans
            </div>
            <div className="text-[22px] font-bold text-[var(--c-black)] leading-none mb-1">
              {stats?.total_analyses || 0}
            </div>
            <div className="text-[10px] font-medium text-[var(--c-gray-3)]">All time</div>
          </div>

          <div className="bg-white border border-[var(--c-border)] rounded-[10px] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--c-gray-2)] mb-1.5">
              <IconTarget size={13} />
              Avg Score
            </div>
            <div className="text-[22px] font-bold text-[var(--c-black)] leading-none mb-1">
              {stats?.avg_score || 0}
            </div>
            <div className="text-[10px] font-medium text-[var(--c-gray-3)]">
              {delta !== null && delta !== 0 && (
                <span className={delta > 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}>
                  {delta > 0 ? '+' : ''}
                  {delta} from last
                </span>
              )}
              {(delta === null || delta === 0) && <span>No change</span>}
            </div>
          </div>

          <div className="bg-white border border-[var(--c-border)] rounded-[10px] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--c-gray-2)] mb-1.5">
              <IconTrendingUp size={13} />
              Best Score
            </div>
            <div className="text-[22px] font-bold text-[var(--c-black)] leading-none mb-1">
              {stats?.best_score || 0}
            </div>
            <div className="text-[10px] font-medium text-[#16a34a]">Personal best</div>
          </div>

          <div className="bg-white border border-[var(--c-border)] rounded-[10px] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--c-gray-2)] mb-1.5">
              <IconClock size={13} />
              This Week
            </div>
            <div className="text-[22px] font-bold text-[var(--c-black)] leading-none mb-1">
              {analyses.filter((a) => {
                const date = new Date(a.created_at);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date > weekAgo;
              }).length}
            </div>
            <div className="text-[10px] font-medium text-[var(--c-gray-3)]">Last 7 days</div>
          </div>
        </div>

        {/* Middle Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Score Trend */}
          <div className="bg-white border border-[var(--c-border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold text-[var(--c-black)]">Score Trend</h2>
            </div>
            {stats && stats.score_trend.length > 0 ? (
              <div className="h-[70px] flex items-end gap-1">
                {stats.score_trend.map((item, i) => {
                  const isToday = i === stats.score_trend.length - 1;
                  const isPast = i < stats.score_trend.length - 3;
                  const color = isPast
                    ? '#d1d5db'
                    : isToday
                    ? '#4ade80'
                    : '#86efac';
                  const height = (item.score / 100) * 70;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full rounded-t-sm"
                        style={{ height: `${height}px`, backgroundColor: color }}
                      />
                      <div
                        className={`text-[9px] mt-1 ${
                          isToday ? 'font-semibold text-[#16a34a]' : 'text-[var(--c-gray-4)]'
                        }`}
                      >
                        {isToday ? 'Today' : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[70px] flex items-center justify-center text-[11px] text-[var(--c-gray-3)]">
                No data yet
              </div>
            )}
          </div>

          {/* Top Missing Skills */}
          <div className="bg-white border border-[var(--c-border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold text-[var(--c-black)]">
                Common Skill Gaps
              </h2>
            </div>
            <div className="space-y-1.5">
              {['Python', 'AWS', 'Docker', 'React'].map((skill, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 border-b border-[var(--c-border-2)] last:border-0"
                >
                  <span className="text-[11px] font-medium text-[#333]">{skill}</span>
                  <span className="text-[10px] text-[var(--c-gray-3)] bg-[var(--c-surface-2)] px-1.5 py-0.5 rounded">
                    {4 - i}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-white border border-[var(--c-border)] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[12px] font-semibold text-[var(--c-black)]">Recent Scans</h2>
            <button
              onClick={() => router.push('/')}
              className="text-[11px] text-[var(--c-purple)] hover:text-[var(--c-purple-dark)] font-medium"
            >
              New scan
            </button>
          </div>
          {analyses.length > 0 ? (
            <HistoryList analyses={analyses.slice(0, 10)} />
          ) : (
            <div className="py-8 text-center text-[12px] text-[var(--c-gray-3)]">
              No analyses yet. Start by uploading your resume!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
