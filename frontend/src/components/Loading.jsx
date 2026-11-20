import React from 'react';

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#2563EB] border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">{text}</p>
    </div>
  );
}
