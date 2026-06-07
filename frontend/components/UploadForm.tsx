'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { IconCloudUpload, IconFileCheck, IconLoader2 } from '@tabler/icons-react';

export default function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError('');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a resume PDF');
      return;
    }
    
    if (!jdText.trim()) {
      setError('Please paste the job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jd_text', jdText);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await response.json();
      
      // Store results in localStorage for display
      localStorage.setItem('latestAnalysis', JSON.stringify(data));
      
      // Redirect to results page
      router.push('/results/latest');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label className="block text-[11px] font-medium text-[var(--c-gray-1)] mb-1">
          Upload Resume
        </label>
        <div
          {...getRootProps()}
          className={`border-[1.5px] border-dashed rounded-[10px] p-[22px_16px] text-center cursor-pointer transition-all ${
            isDragActive
              ? 'bg-[#f3f2ed] border-[#b0afaa]'
              : file
              ? 'bg-[var(--c-green-bg)] border-[var(--c-green-skill-border)]'
              : 'bg-[#fafaf8] border-[#d0cfca] hover:bg-[#f3f2ed] hover:border-[#b0afaa]'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <IconFileCheck size={22} className="text-[var(--c-green-text)] pointer-events-none" />
              <span className="text-[12px] font-medium text-[var(--c-green-text)]">
                {file.name}
              </span>
            </div>
          ) : (
            <>
              <IconCloudUpload size={22} className="text-[var(--c-gray-3)] mx-auto mb-1.5 pointer-events-none" />
              <div className="text-[12px] font-medium text-[#333]">
                Drop your resume here or click to browse
              </div>
              <div className="text-[11px] text-[var(--c-gray-3)] mt-0.5">PDF only</div>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[11px] font-medium text-[var(--c-gray-1)] mb-1">
          Job Description
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the full job description here..."
          className="w-full border border-[#e5e4df] rounded-lg p-[10px_12px] text-[12px] min-h-[80px] resize-y focus:border-[var(--c-gray-3)] focus:outline-none"
          rows={6}
        />
      </div>

      {error && (
        <div className="mb-3 text-[12px] text-[var(--c-red-text)] bg-[var(--c-red-bg)] p-2 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-[11px] bg-[var(--c-black)] text-white rounded-lg text-[13px] font-semibold tracking-[.01em] hover:bg-[#2a2a28] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <IconLoader2 size={16} className="animate-spin" />
            Scanning...
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </form>
  );
}
