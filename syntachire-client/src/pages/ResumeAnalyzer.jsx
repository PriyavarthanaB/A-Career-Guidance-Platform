import React from 'react';

const ResumeAnalyzer = () => {
  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-800">
      <h1 className="text-3xl font-bold">AI Resume Insights</h1>
      <p className="text-slate-500 mt-2">
        Upload area and ATS feedback will render here.
      </p>
    </div>
  );
};

// ⚠️ THIS LINE IS REQUIRED SO APP.JSX CAN IMPORT IT:
export default ResumeAnalyzer;