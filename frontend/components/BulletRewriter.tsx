'use client';

import { IconX, IconCheck, IconSparkles } from '@tabler/icons-react';

interface BulletRewriterProps {
  bullets: Array<{
    original: string;
    rewritten: string;
    reason: string;
  }>;
}

export default function BulletRewriter({ bullets }: BulletRewriterProps) {
  return (
    <div className="space-y-2.5">
      {bullets.map((bullet, index) => (
        <div
          key={index}
          className="pb-2.5 border-b border-[var(--c-border-2)] last:border-0"
        >
          {/* Before */}
          <div className="flex gap-1.5 mb-1.5">
            <IconX size={11} className="text-[#fca5a5] mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-[var(--c-gray-2)] leading-[1.5]">
              {bullet.original}
            </span>
          </div>
          
          {/* After */}
          <div className="flex gap-1.5 mb-1.5">
            <IconCheck size={11} className="text-[#4ade80] mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-[#1a1a18] leading-[1.5]">
              {bullet.rewritten}
            </span>
          </div>
          
          {/* Reason tag */}
          <div className="inline-flex items-center gap-1 bg-[var(--c-purple-bg)] text-[var(--c-purple)] px-2 py-0.5 rounded text-[10px] font-medium">
            <IconSparkles size={10} />
            {bullet.reason}
          </div>
        </div>
      ))}
    </div>
  );
}
