import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [parseResult, setParseResult] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('token');
      // Replace with your express resume route
      const res = await fetch('http://localhost:5000/api/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setParseResult(data);
      } else {
        alert(data.message || 'Resume processing failed');
      }
    } catch (err) {
      alert('Failed to connect to backend resume parser');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-[var(--color-primary)]">SyntacHire AI Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <h2 className="text-3xl font-extrabold mb-2">Welcome Back!</h2>
        <p className="text-slate-500 text-base mb-8">Upload your resume to perform AI keyword and ATS optimization analysis.</p>

        {/* Resume Parser Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Resume Parsing & Calibration</h3>
          
          <form onSubmit={handleFileUpload} className="space-y-4">
            <input 
              type="file" 
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-primary)] file:text-white hover:file:opacity-90"
            />
            <button 
              type="submit"
              disabled={!file || uploading}
              className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50 cursor-pointer"
            >
              {uploading ? 'Parsing Resume...' : 'Analyze Resume'}
            </button>
          </form>

          {parseResult && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm">
              <p className="font-bold mb-1">Resume Successfully Processed!</p>
              <pre className="text-xs overflow-auto">{JSON.stringify(parseResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}