'use client';

import Link from 'next/link';

interface Analysis {
  id: string;
  role_title: string;
  final_score: number;
  created_at: string;
}

interface HistoryListProps {
  analyses: Analysis[];
}

export default function HistoryList({ analyses }: HistoryListProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return { bg: 'var(--c-green-bg)', text: 'var(--c-green-text)' };
    if (score >= 55) return { bg: 'var(--c-amber-bg)', text: 'var(--c-amber-text)' };
    return { bg: 'var(--c-red-bg)', text: 'var(--c-red-text)' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-0">
      {analyses.map((analysis) => {
        const colors = getScoreColor(analysis.final_score);
        return (
          <Link
            key={analysis.id}
            href={`/results/${analysis.id}`}
            className="flex items-center gap-2.5 py-2 border-b border-[var(--c-border-2)] last:border-0 hover:bg-[var(--c-hover)] px-2 -mx-2 rounded transition-colors"
          >
            {/* Company logo placeholder */}
            <div className="w-7 h-7 rounded-md bg-[var(--c-surface-2)] flex items-center justify-center text-[10px] font-bold text-[var(--c-gray-2)] flex-shrink-0">
              {analysis.role_title.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-[var(--c-black)] truncate">
                {analysis.role_title}
              </div>
            </div>
            
            {/* Score badge */}
            <div
              className="text-[12px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {analysis.final_score}
            </div>
            
            {/* Date */}
            <div className="text-[10px] text-[var(--c-gray-4)] min-w-[36px] text-right">
              {formatDate(analysis.created_at)}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
