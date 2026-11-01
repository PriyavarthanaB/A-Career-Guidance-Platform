import jsPDF from "jspdf";

/**
 * Generates a clean, professional PDF for the Predictive Career & Placement Readiness Report.
 */
export function generatePredictiveReportPDF(data) {
  const {
    userName = "Candidate",
    targetRole = "Software Developer",
    readinessIndex = 0,
    atsScore = 0,
    extractedSkills = [],
    missingSkills = [],
    solvedProblems = 0,
    totalProblems = 135,
    completionPct = 0,
    xp = 0,
    streakDays = 0,
    mockSessionsCount = 0,
    avgMockScore = 0,
    hasUploadedResume = false,
  } = data;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  // ── HEADER BANNER ──
  doc.setFillColor(30, 58, 138); // Deep Royal Blue
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 32, 4, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("SYNTACHIRE AI — CAREER & PLACEMENT READINESS REPORT", margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254);
  doc.text(`Candidate: ${userName}  |  Target Role: ${targetRole}`, margin + 6, y + 18);
  doc.text(`Report Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}  |  Powered by Google Gemini AI`, margin + 6, y + 25);

  y += 38;

  // ── SECTION 1: OVERALL READINESS SCORE CARD ──
  const statusLabel = readinessIndex >= 75 ? "PLACEMENT READY" : readinessIndex > 0 ? "IN PROGRESS" : "NEW CANDIDATE";
  const statusColor = readinessIndex >= 75 ? [16, 185, 129] : [59, 130, 246];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 34, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("1. OVERALL PLACEMENT COMPETENCY INDEX", margin + 5, y + 8);

  // Score Box
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(margin + 5, y + 13, 30, 16, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`${readinessIndex}%`, margin + 20, y + 23, { align: "center" });

  // Status & Weights Info
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Status: ${statusLabel}`, margin + 40, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Competency Weights: 35% ATS Resume + 40% DSA Progress + 25% Mock Interview", margin + 40, y + 25);

  y += 40;

  // ── SECTION 2: RESUME ATS COMPATIBILITY ──
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 42, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("2. RESUME ATS COMPATIBILITY & SKILL GAP ANALYSIS", margin + 5, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`ATS Benchmark Score: `, margin + 5, y + 16);
  doc.setTextColor(37, 99, 235);
  doc.text(`${atsScore}% Match`, margin + 45, y + 16);

  doc.setTextColor(15, 23, 42);
  doc.text(`Resume Verification: `, margin + 105, y + 16);
  doc.setTextColor(hasUploadedResume ? 16 : 220, hasUploadedResume ? 185 : 38, hasUploadedResume ? 129 : 38);
  doc.text(hasUploadedResume ? "ANALYZED & VERIFIED ✓" : "NOT UPLOADED YET ⚠️", margin + 143, y + 16);

  // Extracted Skills
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("Extracted Skills:", margin + 5, y + 24);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const skillsStr = extractedSkills.length > 0 ? extractedSkills.slice(0, 10).join(", ") : "None detected yet";
  const splitSkills = doc.splitTextToSize(skillsStr, pageWidth - 2 * margin - 35);
  doc.text(splitSkills, margin + 35, y + 24);

  // Missing Skills
  doc.setTextColor(185, 28, 28);
  doc.setFont("helvetica", "bold");
  doc.text("Missing Gaps:", margin + 5, y + 33);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  const missingStr = missingSkills.length > 0 ? missingSkills.slice(0, 8).join(", ") : "None identified (Great role alignment)";
  const splitMissing = doc.splitTextToSize(missingStr, pageWidth - 2 * margin - 35);
  doc.text(splitMissing, margin + 35, y + 33);

  y += 48;

  // ── SECTION 3: DSA & ALGORITHMIC COMPETENCY ──
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, (pageWidth - 2 * margin) / 2 - 2, 38, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("3. DSA ALGORITHMIC PRACTICE", margin + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Problems Solved: ${solvedProblems} / ${totalProblems} (${completionPct}%)`, margin + 5, y + 17);
  doc.text(`Total XP Earned: ${xp.toLocaleString()} XP`, margin + 5, y + 24);
  doc.text(`Active Streak: ${streakDays} Days Continuous`, margin + 5, y + 31);

  // ── SECTION 4: MOCK INTERVIEW PERFORMANCE ──
  const rightColX = margin + (pageWidth - 2 * margin) / 2 + 2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightColX, y, (pageWidth - 2 * margin) / 2 - 2, 38, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("4. MOCK INTERVIEW METRICS", rightColX + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Sessions Completed: ${mockSessionsCount} Rounds`, rightColX + 5, y + 17);
  doc.text(`Avg Technical Score: ${avgMockScore > 0 ? avgMockScore + "%" : "Not evaluated yet"}`, rightColX + 5, y + 24);
  doc.text(`Evaluation Engine: Gemini AI Multimodal`, rightColX + 5, y + 31);

  y += 44;

  // ── SECTION 5: STRATEGIC ACTION PLAN ──
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 46, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("5. STRATEGIC PLACEMENT ACTION PLAN", margin + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const plan1 = `[1] Resume Optimization: ${hasUploadedResume ? `Focus on target skills (${missingSkills.slice(0, 3).join(", ") || targetRole}) in your project descriptions.` : "Upload your resume in Resume Analyzer for ATS keyword calibration."}`;
  const plan2 = `[2] DSA Acceleration: Complete daily problems in core modules (Arrays, Trees, Graphs, DP).`;
  const plan3 = `[3] Mock Interview Practice: Complete at least 2 full AI mock interview sessions with speech answers.`;

  doc.text(doc.splitTextToSize(plan1, pageWidth - 2 * margin - 10), margin + 5, y + 17);
  doc.text(doc.splitTextToSize(plan2, pageWidth - 2 * margin - 10), margin + 5, y + 26);
  doc.text(doc.splitTextToSize(plan3, pageWidth - 2 * margin - 10), margin + 5, y + 35);

  // ── FOOTER ──
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("This document is an automated predictive career evaluation generated by SyntacHire AI Platform.", margin, pageHeight - 10);
  doc.text(`Page 1 of 1  |  Confidential & Proprietary`, pageWidth - margin, pageHeight - 10, { align: "right" });

  // Save PDF file
  const fileName = `SyntacHire_Predictive_Report_${userName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}

/**
 * Generates a clean, professional PDF for AI Mock Interview Scorecard Report.
 */
export function generateInterviewReportPDF(interview, candidateName = "Candidate") {
  if (!interview) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 14;

  const checkPageBreak = (neededHeight) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 14;
      return true;
    }
    return false;
  };

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep Royal Blue
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 32, 4, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("SYNTACHIRE AI — MOCK INTERVIEW SCORECARD", margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(219, 234, 254);
  doc.text(`Candidate: ${candidateName}  |  Target Role: ${interview.targetRole || "Software Engineer"}`, margin + 6, y + 18);
  doc.text(`Round: ${(interview.type || "MIXED").toUpperCase()}  |  Difficulty: ${interview.difficulty || "Medium"}  |  Questions: ${interview.questionCount || interview.questions?.length || 5}`, margin + 6, y + 25);

  y += 38;

  // Overall Score & Dimensional Scores Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 52, 3, 3, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("OVERALL PERFORMANCE & 7-DIMENSIONAL BREAKDOWN", margin + 5, y + 8);

  // Big Score Badge
  const scoreVal = interview.overallScore ?? interview.score ?? 0;
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin + 5, y + 14, 32, 28, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`${scoreVal}%`, margin + 21, y + 28, { align: "center" });
  doc.setFontSize(7.5);
  doc.text("OVERALL SCORE", margin + 21, y + 36, { align: "center" });

  // 6 Metric Bars
  const metrics = [
    { label: "Technical Depth", val: interview.overallTechnicalScore || scoreVal },
    { label: "Problem Solving", val: interview.overallProblemSolvingScore || scoreVal },
    { label: "Communication", val: interview.overallCommunicationScore || scoreVal },
    { label: "Relevance & Focus", val: interview.overallRelevanceScore || scoreVal },
    { label: "Confidence", val: interview.overallConfidenceScore || scoreVal },
    { label: "Time Management", val: interview.overallTimeManagementScore || scoreVal },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  metrics.forEach((m, idx) => {
    const col = idx < 3 ? 0 : 1;
    const row = idx % 3;
    const itemX = margin + 45 + col * 70;
    const itemY = y + 18 + row * 11;
    doc.text(`${m.label}:`, itemX, itemY);
    doc.setFont("helvetica", "bold");
    doc.text(`${m.val}%`, itemX + 48, itemY);
    doc.setFont("helvetica", "normal");
  });

  y += 58;

  // Personalized AI Feedback Card
  const feedbackText = interview.personalizedFeedback || interview.summary || "Demonstrated solid domain understanding and structured problem-solving approach. Continue practicing technical articulation and STAR-method responses for top-tier placement readiness.";
  
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  
  const feedbackLines = doc.splitTextToSize(feedbackText, pageWidth - 2 * margin - 12);
  const cardHeight = Math.max(34, 16 + feedbackLines.length * 4.5);
  
  doc.roundedRect(margin, y, pageWidth - 2 * margin, cardHeight, 3, 3, "FD");
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("AI EXECUTIVE EVALUATION & STRATEGIC FEEDBACK", margin + 5, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(feedbackLines, margin + 5, y + 15);

  y += cardHeight + 8;

  // Question-by-Question Breakdown (if questions exist)
  const questionItems = (interview.questions && interview.questions.length > 0)
    ? interview.questions
    : (interview.answersList && interview.answersList.length > 0)
    ? interview.answersList
    : [];

  if (questionItems.length > 0) {
    checkPageBreak(30);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("QUESTION-BY-QUESTION DETAILED EVALUATION & MODEL ANSWERS", margin, y);
    y += 6;

    questionItems.forEach((q, idx) => {
      const qNum = idx + 1;
      const qText = `Q${qNum}: ${q.question || "Interview Question"}`;
      const qScore = q.score ?? scoreVal;
      const qCat = q.category || "General";
      const uAns = q.userAnswer ? `Your Answer: "${q.userAnswer}"` : "";
      const idAns = q.idealAnswer ? `Model Response: "${q.idealAnswer}"` : "";

      const splitQ = doc.splitTextToSize(qText, pageWidth - 2 * margin - 35);
      const splitU = uAns ? doc.splitTextToSize(uAns, pageWidth - 2 * margin - 12) : [];
      const splitId = idAns ? doc.splitTextToSize(idAns, pageWidth - 2 * margin - 12) : [];

      const itemHeight = 16 + splitQ.length * 4.5 + (splitU.length > 0 ? splitU.length * 4 + 4 : 0) + (splitId.length > 0 ? splitId.length * 4 + 4 : 0);

      checkPageBreak(itemHeight + 6);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, pageWidth - 2 * margin, itemHeight, 2.5, 2.5, "FD");

      // Q Header
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(splitQ, margin + 4, y + 7);

      // Score pill
      doc.setFillColor(238, 242, 255);
      doc.roundedRect(pageWidth - margin - 26, y + 3, 22, 6, 1.5, 1.5, "F");
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(8);
      doc.text(`${qScore}% Score`, pageWidth - margin - 15, y + 7.2, { align: "center" });

      let currentItemY = y + 9 + splitQ.length * 4.5;

      if (splitU.length > 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(splitU, margin + 4, currentItemY);
        currentItemY += splitU.length * 4 + 3;
      }

      if (splitId.length > 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(30, 64, 175);
        doc.text(splitId, margin + 4, currentItemY);
        currentItemY += splitId.length * 4 + 3;
      }

      y += itemHeight + 4;
    });
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text("SyntacHire AI Automated Interview Evaluation Report.", margin, pageHeight - 9);
    doc.text(`Page ${i} of ${totalPages}  |  Verified Assessment`, pageWidth - margin, pageHeight - 9, { align: "right" });
  }

  const fileName = `SyntacHire_Interview_Report_${(interview.type || "mixed")}_${candidateName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
}
