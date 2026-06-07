'use client';

import { useEffect, useState } from 'react';

interface ScoreCardProps {
  score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const [animatedOffset, setAnimatedOffset] = useState(251.2);
  
  const circumference = 251.2; // 2 * π * 40
  const targetOffset = circumference * (1 - score / 100);
  
  const color = score >= 75 ? 'var(--c-green-bar)' : score >= 55 ? 'var(--c-amber-bar)' : 'var(--c-red-bar)';
  const bgColor = score >= 75 ? 'var(--c-green-bg)' : score >= 55 ? 'var(--c-amber-bg)' : 'var(--c-red-bg)';
  const textColor = score >= 75 ? 'var(--c-green-text)' : score >= 55 ? 'var(--c-amber-text)' : 'var(--c-red-text)';
  const label = score >= 75 ? 'Strong match' : score >= 55 ? 'Moderate match' : 'Weak match';

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedOffset(targetOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  return (
    <div className="flex flex-col items-center py-4 border-b border-[var(--c-border-2)]">
      <svg width="100" height="100" className="mb-3">
        {/* Track ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--c-surface-2)"
          strokeWidth="7"
        />
        {/* Progress ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          transform="rotate(-90 50 50)"
          style={{
            transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
        {/* Score text */}
        <text
          x="50"
          y="48"
          textAnchor="middle"
          className="text-[26px] font-bold fill-[var(--c-black)]"
        >
          {score}
        </text>
        <text
          x="50"
          y="60"
          textAnchor="middle"
          className="text-[10px] font-medium fill-[var(--c-gray-3)]"
        >
          /100
        </text>
      </svg>
      
      <div
        className="text-[11px] font-semibold px-3 py-1 rounded-full"
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {label}
      </div>
    </div>
  );
}
