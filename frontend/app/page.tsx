'use client';

import { IconSparkles } from '@tabler/icons-react';
import UploadForm from '@/components/UploadForm';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--c-surface-2)]">
      {/* Navbar */}
      <nav className="h-[52px] bg-white border-b border-[#eee] px-7 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] bg-[var(--c-black)] rounded-md flex items-center justify-center">
            <span className="text-white text-[12px] font-bold">R</span>
          </div>
          <span className="text-[14px] font-semibold text-[var(--c-black)]">ResumeIQ</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Navigation items removed per request */}
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-52px)]">
        {/* Left: Copy */}
        <div className="flex-1 p-12 flex flex-col justify-center max-w-2xl relative bg-gradient-to-br from-[#f7f6f1] via-[#fafaf8] to-[#f0efe9]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f0f0e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-[var(--c-purple)] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-[var(--c-green-bar)] opacity-5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[var(--c-purple-bg)] text-[var(--c-purple)] px-3 py-1.5 rounded-full text-[11px] font-medium mb-6 self-start">
            <IconSparkles size={14} />
            AI-Powered Analysis
          </div>
          
          <h1 className="text-[30px] font-bold text-[var(--c-black)] leading-[1.18] mb-4">
            Get your resume past the ATS<br />
            and into human hands
          </h1>
          
          <p className="text-[13px] text-[#666] leading-[1.6] max-w-[340px] mb-6">
            Upload your resume and paste any job description. Our AI analyzes the match, 
            identifies gaps, and rewrites your bullets to maximize your interview chances.
          </p>
          
          <div className="flex items-center gap-4 text-[11px] text-[var(--c-gray-2)]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--c-green-bar)]"></div>
              <span>Instant analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--c-purple)]"></div>
              <span>ATS-optimized rewrites</span>
            </div>
          </div>
          </div>
        </div>

        {/* Right: Upload card */}
        <div className="lg:w-[480px] bg-white border-l border-[#eee] p-7 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[var(--c-purple-bg)] to-transparent opacity-30 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[var(--c-green-bg)] to-transparent opacity-20 rounded-full blur-2xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
          <h2 className="text-[14px] font-semibold text-[var(--c-black)] mb-1">
            Analyze Your Resume
          </h2>
          <p className="text-[12px] text-[var(--c-gray-2)] mb-5">
            Upload your resume and paste the job description to get started
          </p>
          
          <UploadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
