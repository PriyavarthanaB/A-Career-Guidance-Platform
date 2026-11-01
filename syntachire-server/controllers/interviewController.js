const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { evaluateAnswerWithGemini, generateFinalReportWithGemini } = require('../services/geminiService');
const { generateSingleQuestionWithGemini } = require('../services/questionGeneratorService');

const shuffleArray = (array) => array.slice().sort(() => Math.random() - 0.5);

const selectQuestionSet = (pool, count, difficultyLabel) => {
  const filtered = pool.filter((q) => q.difficulty === difficultyLabel);
  const source = filtered.length >= count ? filtered : pool;
  const chosen = shuffleArray(source).slice(0, Math.min(count, source.length));

  if (chosen.length < count) {
    const remaining = shuffleArray(pool.filter((item) => !chosen.includes(item)));
    chosen.push(...remaining.slice(0, count - chosen.length));
  }

  return chosen;
};

// Seed Question Generator tailored by type, difficulty, and role
const generateQuestionsForRole = (type, difficulty, targetRole, count = 5) => {
  const roleStr = targetRole || 'Software Engineer';
  const normalizedRole = (roleStr || '').toLowerCase();

  const getRoleContext = () => {
    if (normalizedRole.includes('frontend') || normalizedRole.includes('react') || normalizedRole.includes('ui')) {
      return {
        label: 'Frontend',
        example: 'frontend web application',
        focus: 'component architecture, user experience, performance, and browser APIs',
      };
    }

    if (normalizedRole.includes('backend') || normalizedRole.includes('full stack') || normalizedRole.includes('software engineer')) {
      return {
        label: 'Backend',
        example: 'scalable backend service',
        focus: 'API design, databases, reliability, and distributed systems',
      };
    }

    if (normalizedRole.includes('data scientist') || normalizedRole.includes('machine learning') || normalizedRole.includes('ai')) {
      return {
        label: 'Data/AI',
        example: 'machine learning pipeline',
        focus: 'data pipelines, experimentation, model evaluation, and deployment',
      };
    }

    if (normalizedRole.includes('devops') || normalizedRole.includes('cloud') || normalizedRole.includes('sre')) {
      return {
        label: 'DevOps',
        example: 'cloud-native platform',
        focus: 'CI/CD, monitoring, incident response, and infrastructure automation',
      };
    }

    if (normalizedRole.includes('product') || normalizedRole.includes('manager')) {
      return {
        label: 'Product',
        example: 'product delivery system',
        focus: 'prioritization, stakeholder management, and product strategy',
      };
    }

    return {
      label: 'General Engineering',
      example: 'modern software product',
      focus: 'trade-offs, collaboration, and pragmatic delivery',
    };
  };

  const roleContext = getRoleContext();
  const difficultyLabel = (difficulty || 'Medium').toLowerCase();

  const QUESTION_BANK = {
    hr: [
      {
        question: `Tell me about a time you worked successfully with a team to deliver a ${roleStr} project on time.`,
        category: 'Teamwork & Delivery',
        difficulty: 'easy',
        hint: 'Keep this answer clear, practical, and focused on collaboration.',
      },
      {
        question: `Why are you interested in this ${roleStr} role and what motivates you to contribute?`,
        category: 'Motivation & Career Fit',
        difficulty: 'easy',
        hint: 'Share meaningful motivations and how they match the role’s impact.',
      },
      {
        question: `Describe how you handled a sudden change in priorities on a project.`,
        category: 'Adaptability & Delivery',
        difficulty: 'medium',
        hint: 'Show how you stayed calm, communicated, and adjusted your plan.',
      },
      {
        question: `How do you use feedback to improve your work on a ${roleStr} assignment?`,
        category: 'Feedback & Growth',
        difficulty: 'medium',
        hint: 'Explain a concrete example of listening, learning, and improving.',
      },
      {
        question: `Tell me about a disagreement with a teammate and how you turned it into a better result.`,
        category: 'Conflict Resolution',
        difficulty: 'hard',
        hint: 'Explain your process, empathy, and how you reached a constructive conclusion.',
      },
      {
        question: `Share an example of taking ownership to improve a process or delivery outcome.`,
        category: 'Ownership & Initiative',
        difficulty: 'medium',
        hint: 'Describe the action you took and the measurable result.',
      },
    ],
    technical: [
      {
        question: `What is the difference between GET and POST requests and when would you use each?`,
        category: 'Web Fundamentals',
        difficulty: 'easy',
        hint: 'Answer with clear examples of safe reads versus state-changing writes.',
      },
      {
        question: `How would you explain the difference between an array and an object in a real application?`,
        category: 'Data Structures',
        difficulty: 'easy',
        hint: 'Keep your answer simple and use a practical example.',
      },
      {
        question: `Explain how you would optimize ${roleContext.focus} in a production ${roleStr} system.`,
        category: 'Practical Engineering',
        difficulty: 'medium',
        hint: 'Describe performance, reliability, and maintainability trade-offs.',
      },
      {
        question: `How would you debug a production issue in a ${roleStr} system when the symptoms are unclear?`,
        category: 'Debugging & Resilience',
        difficulty: 'medium',
        hint: 'Mention observability, logging, and rollback or mitigation steps.',
      },
      {
        question: `How would you design a scalable ${roleContext.example} that needs strong reliability and low latency?`,
        category: 'System Design',
        difficulty: 'hard',
        hint: 'Cover architecture, trade-offs, and how you would handle failures.',
      },
      {
        question: `What would you improve first in a legacy ${roleStr} codebase that is slowing down delivery?`,
        category: 'Maintainability',
        difficulty: 'medium',
        hint: 'Discuss prioritization, risk reduction, and iterative improvements.',
      },
    ],
    behavioral: [
      {
        question: `Tell me about a situation where you had to manage competing priorities on a ${roleStr} project.`,
        category: 'STAR Method & Prioritization',
        difficulty: 'easy',
        hint: 'Describe the Situation, Task, Action, and Result clearly.',
      },
      {
        question: `Describe a time when you received tough feedback on your ${roleStr} work and how you acted on it.`,
        category: 'Growth Mindset & Feedback',
        difficulty: 'easy',
        hint: 'Highlight receptiveness, concrete steps taken, and the positive outcome.',
      },
      {
        question: `Give an example of a project where you took initiative beyond your direct responsibilities.`,
        category: 'Leadership & Initiative',
        difficulty: 'medium',
        hint: 'Explain the problem you noticed, your proactive actions, and the measurable impact.',
      },
      {
        question: `Tell me about a time a technical task or project failed or went wrong. What did you learn?`,
        category: 'Accountability & Resilience',
        difficulty: 'medium',
        hint: 'Be honest about what happened, take responsibility, and share the key lesson learned.',
      },
      {
        question: `Describe how you communicated a complex technical decision to non-technical stakeholders.`,
        category: 'Stakeholder Communication',
        difficulty: 'hard',
        hint: 'Explain how you simplified technical concepts and focused on business value.',
      },
      {
        question: `Tell me about a high-stress scenario near a release deadline. How did you maintain focus and quality?`,
        category: 'Stress Management & Morale',
        difficulty: 'hard',
        hint: 'Focus on composure, clear prioritization, and effective team communication.',
      },
    ],
    mixed: [
      {
        question: `How do you balance writing clean, tested code with meeting aggressive deadlines?`,
        category: 'Engineering Pragmatism',
        difficulty: 'easy',
        hint: 'Give a simple example of balancing quality and speed.',
      },
      {
        question: `What steps would you take to add value quickly on a new team?`,
        category: 'Onboarding & Ownership',
        difficulty: 'easy',
        hint: 'Talk about learning fast, communicating clearly, and delivering impact.',
      },
      {
        question: `Explain how you would ensure a solution is reliable, secure, and maintainable.`,
        category: 'Reliability & Security',
        difficulty: 'medium',
        hint: 'Mention testing, monitoring, authentication, and fallback strategies.',
      },
      {
        question: `Tell me about a technical challenge you solved and how you measured success.`,
        category: 'Outcome & Measurement',
        difficulty: 'medium',
        hint: 'Reference metrics, feedback loops, or user impact where possible.',
      },
      {
        question: `Walk me through an end-to-end ${roleContext.example} you would build and explain your key trade-offs.`,
        category: 'Architecture & Trade-offs',
        difficulty: 'hard',
        hint: 'Cover requirements, data flow, technical choices, and delivery concerns.',
      },
      {
        question: `How would you handle a situation where product goals and technical constraints conflict?`,
        category: 'Product & Engineering',
        difficulty: 'medium',
        hint: 'Show how you balance stakeholder needs with practical technical solutions.',
      },
    ],
  };

  const pool = QUESTION_BANK[type] || QUESTION_BANK.mixed;
  const safeCount = Math.max(1, Number(count) || 5);
  const difficultyHint = difficultyLabel === 'hard'
    ? 'Focus on depth, trade-offs, and edge cases.'
    : difficultyLabel === 'easy'
      ? 'Keep your answer clear and practical.'
      : 'Provide a balanced explanation with concrete examples.';

  const selectedQuestions = selectQuestionSet(pool, safeCount, difficultyLabel);

  return selectedQuestions.map((qObj) => ({
    question: qObj.question,
    category: qObj.category,
    hint: `${qObj.hint} ${difficultyHint}`,
    userAnswer: '',
    score: 0,
    strengths: '',
    improvements: '',
    difficulty: qObj.difficulty || 'medium',
  }));
};

/**
 * Helper to fetch candidate profile, resume skills, project details,
 * multi-interview performance memory, topic mastery priority decay, and all historical questions.
 */
const getCandidateProfileContext = async (userId, targetRole = '') => {
  let candidateSkills = [];
  let candidateWeakAreas = [];
  let masteredTopics = [];
  let candidateProjects = '';
  let historicalQuestions = [];
  let performanceTrajectory = '';

  if (!userId) {
    return {
      candidateSkills,
      candidateWeakAreas,
      masteredTopics,
      candidateProjects,
      historicalQuestions,
      performanceTrajectory,
    };
  }

  try {
    // 1. Fetch latest Resume document for user
    const latestResume = await Resume.findOne({ userId }).sort({ analyzedAt: -1 });
    if (latestResume) {
      candidateSkills = latestResume.extractedSkills || [];
      if (Array.isArray(latestResume.missingSkills)) {
        candidateWeakAreas.push(...latestResume.missingSkills);
      }
      candidateProjects = latestResume.rawText || latestResume.summary || '';
    }

    // 2. Fetch past completed interview sessions for user, prioritizing same target role
    const pastQuery = { userId, status: 'completed' };
    if (targetRole) {
      pastQuery.targetRole = targetRole;
    }
    let pastInterviews = await Interview.find(pastQuery).sort({ completedAt: 1 });
    if (pastInterviews.length === 0) {
      pastInterviews = await Interview.find({ userId, status: 'completed' }).sort({ completedAt: 1 });
    }

    const topicMemoryMap = {}; // topic -> { priority: number, recentScores: number[], isMastered: boolean }

    // Initialize resume missing skills with base priority score of 50
    candidateWeakAreas.forEach((w) => {
      const norm = String(w).trim();
      if (norm) {
        topicMemoryMap[norm] = { priority: 50, recentScores: [], isMastered: false };
      }
    });

    pastInterviews.forEach((inv) => {
      if (Array.isArray(inv.questions)) {
        inv.questions.forEach((q) => {
          // Collect ALL previously asked questions to prevent repetition across entire account history
          if (q.question && typeof q.question === 'string') {
            historicalQuestions.push(q.question.trim());
          }

          const topic = q.category ? String(q.category).trim() : null;
          const score = typeof q.score === 'number' ? q.score : 0;

          if (topic) {
            if (!topicMemoryMap[topic]) {
              topicMemoryMap[topic] = { priority: 10, recentScores: [], isMastered: false };
            }

            topicMemoryMap[topic].recentScores.push(score);

            if (score < 65) {
              // Struggled on this topic -> Increase weakness priority
              topicMemoryMap[topic].priority += 30;
              topicMemoryMap[topic].isMastered = false;
            } else if (score >= 75) {
              // Answered well -> Apply Priority Decay (gradually reduce priority weight)
              topicMemoryMap[topic].priority *= 0.5;

              // If candidate scores >= 80 on recent attempts, mark as Mastered Topic
              const recent2 = topicMemoryMap[topic].recentScores.slice(-2);
              if (recent2.length >= 1 && recent2.every((s) => s >= 80)) {
                topicMemoryMap[topic].isMastered = true;
                topicMemoryMap[topic].priority = Math.min(topicMemoryMap[topic].priority, 5);
              }
            }
          }

          // Process explicit weaknesses and missing points
          if (Array.isArray(q.weaknesses)) {
            q.weaknesses.forEach((w) => {
              const norm = String(w).trim();
              if (norm) {
                if (!topicMemoryMap[norm]) topicMemoryMap[norm] = { priority: 20, recentScores: [], isMastered: false };
                topicMemoryMap[norm].priority += 15;
              }
            });
          }

          if (Array.isArray(q.missingPoints)) {
            q.missingPoints.forEach((m) => {
              const norm = String(m).trim();
              if (norm) {
                if (!topicMemoryMap[norm]) topicMemoryMap[norm] = { priority: 20, recentScores: [], isMastered: false };
                topicMemoryMap[norm].priority += 15;
              }
            });
          }
        });
      }

      // Also process explicit session-level weakest and strongest topics
      if (Array.isArray(inv.weakestTopics)) {
        inv.weakestTopics.forEach((t) => {
          const norm = String(t).trim();
          if (norm) {
            if (!topicMemoryMap[norm]) topicMemoryMap[norm] = { priority: 30, recentScores: [], isMastered: false };
            topicMemoryMap[norm].priority += 20;
          }
        });
      }

      if (Array.isArray(inv.strongestTopics)) {
        inv.strongestTopics.forEach((t) => {
          const norm = String(t).trim();
          if (norm) {
            if (topicMemoryMap[norm]) {
              topicMemoryMap[norm].priority *= 0.5; // Priority decay on demonstrated strength
            }
          }
        });
      }
    });

    // Separate into active high-priority weak topics vs mastered topics
    const activeWeakList = [];
    const masteredList = [];

    Object.keys(topicMemoryMap).forEach((topic) => {
      const data = topicMemoryMap[topic];
      if (data.isMastered) {
        masteredList.push(topic);
      } else if (data.priority >= 15) {
        activeWeakList.push({ topic, priority: data.priority });
      }
    });

    // Sort active weak topics by priority (highest priority weak topics first)
    activeWeakList.sort((a, b) => b.priority - a.priority);
    candidateWeakAreas = activeWeakList.map((item) => item.topic).slice(0, 10);
    masteredTopics = masteredList.slice(0, 6);

    // Build performance trajectory summary
    if (pastInterviews.length > 0) {
      const firstScore = pastInterviews[0].overallScore || 0;
      const lastScore = pastInterviews[pastInterviews.length - 1].overallScore || 0;
      const diff = lastScore - firstScore;

      performanceTrajectory = `Completed ${pastInterviews.length} sessions. Overall score growth: ${diff >= 0 ? '+' : ''}${diff}% (from ${firstScore}% to ${lastScore}%). Mastered topics: ${masteredTopics.join(', ') || 'None yet'}. Priority focus areas: ${candidateWeakAreas.slice(0, 4).join(', ') || 'None'}.`;
    }
  } catch (err) {
    console.error('Error fetching candidate profile context & persistent memory:', err.message);
  }

  return {
    candidateSkills,
    candidateWeakAreas,
    masteredTopics,
    candidateProjects,
    historicalQuestions,
    performanceTrajectory,
  };
};

/**
 * @desc    Start a new mock interview session with single AI question generation
 * @route   POST /api/interview/start
 */
exports.startInterview = async (req, res) => {
  try {
    const {
      type = 'mixed',
      difficulty = 'Medium',
      targetRole = 'Full Stack Software Developer',
      seniorityLevel = 'Mid-Level',
      industryFocus = 'Technology & SaaS',
      jobDescription = '',
      responseMode = 'text',
      questionCount = 5,
      durationMinutes = 30,
    } = req.body;

    // Fetch user's latest resume skills, persistent interview memory, mastered topics & project context
    const {
      candidateSkills,
      candidateWeakAreas,
      masteredTopics,
      candidateProjects,
      historicalQuestions,
      performanceTrajectory,
    } = await getCandidateProfileContext(req.user?.id, targetRole);

    // Generate Question #1 dynamically via AI service with zero cross-session repetition
    const firstQuestionObj = await generateSingleQuestionWithGemini({
      targetRole,
      difficulty,
      type,
      seniorityLevel,
      industryFocus,
      jobDescription,
      candidateSkills,
      candidateWeakAreas,
      masteredTopics,
      candidateProjects,
      previousQuestions: historicalQuestions,
      performanceTrajectory,
      questionIndex: 0,
    });

    const interviewData = {
      type,
      difficulty,
      targetRole,
      seniorityLevel,
      industryFocus,
      jobDescription,
      responseMode,
      durationMinutes: Number(durationMinutes) || 30,
      questionCount: Number(questionCount) || 5,
      status: 'in-progress',
      questions: [firstQuestionObj],
      startedAt: new Date(),
    };

    if (req.user && req.user.id) {
      interviewData.userId = req.user.id;
    }

    const newInterview = await Interview.create(interviewData);

    return res.status(201).json({
      success: true,
      message: 'Interview session started successfully with dynamic AI question',
      interviewId: newInterview._id,
      data: newInterview,
    });
  } catch (error) {
    console.error('Error starting interview session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Failed to start interview session',
      error: error.message,
    });
  }
};

/**
 * @desc    Standalone evaluation endpoint using Gemini API
 * @route   POST /api/interview/evaluate
 */
exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, targetRole, difficulty, type } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Both question and candidate answer are required.',
      });
    }

    const feedback = await evaluateAnswerWithGemini({
      question,
      answer,
      targetRole,
      difficulty,
      type,
    });

    return res.status(200).json({
      success: true,
      message: 'Answer evaluated successfully with Gemini AI',
      data: feedback,
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate answer with AI model',
      error: error.message,
    });
  }
};

/**
 * @desc    Get interview session details by ID
 * @route   GET /api/interview/:id
 */
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    const interviewObj = interview.toObject();

    // Do NOT expose internal evaluation details before the interview is completed
    if (interviewObj.status !== 'completed') {
      interviewObj.questions = interviewObj.questions.map((q) => {
        const {
          score,
          technicalScore,
          problemSolvingScore,
          communicationScore,
          relevanceScore,
          confidenceScore,
          aiFeedback,
          strengths,
          weaknesses,
          missingPoints,
          improvements,
          ...safeQ
        } = q;
        return safeQ;
      });
    }

    return res.status(200).json({
      success: true,
      data: interviewObj,
    });
  } catch (error) {
    console.error('Error fetching interview details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch interview session',
      error: error.message,
    });
  }
};

/**
 * Helper to calculate dynamic adaptive difficulty based on candidate's recent performance
 */
const calculateAdaptiveDifficulty = (interview) => {
  const answeredQuestions = interview.questions.filter((q) => q.score > 0 || (q.userAnswer && q.userAnswer.trim()));
  if (answeredQuestions.length === 0) {
    return interview.difficulty || 'Medium';
  }

  const recent = answeredQuestions.slice(-2);
  const avgRecentScore = Math.round(recent.reduce((acc, curr) => acc + (curr.score || 70), 0) / recent.length);

  const currentLevel = (interview.difficulty || 'Medium').toLowerCase();

  // Increase difficulty when candidate performs consistently well (score >= 80)
  if (avgRecentScore >= 80 && recent.length >= 1) {
    if (currentLevel === 'easy') return 'Medium';
    if (currentLevel === 'medium') return 'Hard';
    return 'Hard';
  }

  // Decrease difficulty when candidate struggles (score < 60)
  if (avgRecentScore < 60 && recent.length >= 1) {
    if (currentLevel === 'hard') return 'Medium';
    if (currentLevel === 'medium') return 'Easy';
    return 'Easy';
  }

  return interview.difficulty || 'Medium';
};

/**
 * @desc    Submit answer for a question in an interview session, evaluate via Gemini, adapt difficulty & generate follow-up/next single question
 * @route   POST /api/interview/:id/submit
 */
exports.submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer, answerStartedAt, answerEndedAt, durationMs } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    const targetIndex =
      questionIndex !== undefined ? Number(questionIndex) : 0;

    if (targetIndex < 0 || targetIndex >= interview.questions.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question index',
      });
    }

    const currentQuestion = interview.questions[targetIndex];
    const audioUrl = req.file
      ? `/uploads/interviews/${req.file.filename}`
      : currentQuestion.audioUrl || '';

    // Query Gemini API for answer evaluation
    const geminiFeedback = await evaluateAnswerWithGemini({
      question: currentQuestion.question,
      answer,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      type: interview.type,
    });

    // Validate and record structured evaluation parameters internally in MongoDB
    currentQuestion.userAnswer = answer || '';
    currentQuestion.audioUrl = audioUrl;
    currentQuestion.answerStartedAt = answerStartedAt ? new Date(answerStartedAt) : currentQuestion.answerStartedAt;
    currentQuestion.answerEndedAt = answerEndedAt ? new Date(answerEndedAt) : currentQuestion.answerEndedAt;
    currentQuestion.durationMs = durationMs ? Number(durationMs) : currentQuestion.durationMs;
    currentQuestion.score = geminiFeedback.score || 0;
    currentQuestion.technicalScore = geminiFeedback.technicalScore || 0;
    currentQuestion.problemSolvingScore = geminiFeedback.problemSolvingScore || 0;
    currentQuestion.communicationScore = geminiFeedback.communicationScore || 0;
    currentQuestion.relevanceScore = geminiFeedback.relevanceScore || 0;
    currentQuestion.confidenceScore = geminiFeedback.confidenceScore || 0;
    currentQuestion.aiFeedback = geminiFeedback.improvementFeedback || geminiFeedback.aiFeedback || '';
    currentQuestion.strengths = Array.isArray(geminiFeedback.strengths) ? geminiFeedback.strengths : [];
    currentQuestion.weaknesses = Array.isArray(geminiFeedback.weaknesses) ? geminiFeedback.weaknesses : [];
    currentQuestion.missingPoints = Array.isArray(geminiFeedback.missingConcepts) ? geminiFeedback.missingConcepts : [];
    currentQuestion.improvements = geminiFeedback.improvementFeedback || '';
    currentQuestion.idealAnswer = geminiFeedback.idealAnswer || '';

    // Compute dynamic adaptive difficulty based on performance trend
    const newAdaptiveDifficulty = calculateAdaptiveDifficulty(interview);
    const difficultyChanged = newAdaptiveDifficulty !== interview.difficulty;
    interview.difficulty = newAdaptiveDifficulty;

    // Check if the candidate's answer was incomplete or missing key concepts
    const isAnswerIncomplete =
      (geminiFeedback.score < 70) ||
      (Array.isArray(geminiFeedback.missingConcepts) && geminiFeedback.missingConcepts.length > 0) ||
      (currentQuestion.userAnswer.split(/\s+/).length < 20);

    const shouldAskFollowUp = isAnswerIncomplete && !currentQuestion.isFollowUp;

    // Generate next dynamic question or probing follow-up if interview is in-progress
    let nextQuestionObj = null;
    if (
      interview.questions.length < interview.questionCount &&
      targetIndex === interview.questions.length - 1
    ) {
      // Fetch candidate's verified skills, persistent interview memory & project details
      const {
        candidateSkills,
        candidateWeakAreas,
        masteredTopics,
        candidateProjects,
        historicalQuestions,
        performanceTrajectory,
      } = await getCandidateProfileContext(interview.userId, interview.targetRole);

      const sessionPreviousQuestions = interview.questions.map((q) => q.question);
      const combinedPreviousQuestions = [...new Set([...historicalQuestions, ...sessionPreviousQuestions])];

      nextQuestionObj = await generateSingleQuestionWithGemini({
        targetRole: interview.targetRole,
        difficulty: newAdaptiveDifficulty,
        type: interview.type,
        seniorityLevel: interview.seniorityLevel || 'Mid-Level',
        industryFocus: interview.industryFocus || 'Technology & SaaS',
        jobDescription: interview.jobDescription || '',
        candidateSkills,
        candidateWeakAreas,
        masteredTopics,
        candidateProjects,
        previousQuestions: combinedPreviousQuestions,
        performanceTrajectory,
        questionIndex: interview.questions.length,
        lastAnswerContext: shouldAskFollowUp
          ? {
              question: currentQuestion.question,
              answer: currentQuestion.userAnswer,
              missingConcepts: geminiFeedback.missingConcepts,
              score: geminiFeedback.score,
            }
          : null,
        isFollowUp: shouldAskFollowUp,
      });

      interview.questions.push(nextQuestionObj);
    }

    await interview.save();

    // Return feedback + adaptive difficulty so the frontend can show scorecard immediately
    return res.status(200).json({
      success: true,
      message: 'Answer recorded and evaluated successfully.',
      recorded: true,
      questionIndex: targetIndex,
      nextQuestion: nextQuestionObj,
      nextDifficulty: newAdaptiveDifficulty,
      evaluation: geminiFeedback,
      difficultyChanged,
      interviewId: interview._id,
      feedback: {
        score:                   geminiFeedback.score,
        technicalKnowledgeScore: geminiFeedback.technicalKnowledgeScore,
        correctnessScore:        geminiFeedback.correctnessScore,
        problemSolvingScore:     geminiFeedback.problemSolvingScore,
        communicationScore:      geminiFeedback.communicationScore,
        relevanceScore:          geminiFeedback.relevanceScore,
        confidenceScore:         geminiFeedback.confidenceScore,
        timeManagementScore:     geminiFeedback.timeManagementScore,
        strengths:               geminiFeedback.strengths,
        weaknesses:              geminiFeedback.weaknesses,
        missingPoints:           geminiFeedback.missingPoints,
        idealAnswer:             geminiFeedback.idealAnswer,
        followUpQuestion:        geminiFeedback.followUpQuestion,
        improvementFeedback:     geminiFeedback.improvementFeedback,
      },
    });
  } catch (error) {
    console.error('Error submitting interview answer:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Could not evaluate answer',
      error: error.message,
    });
  }
};

/**
 * @desc    Generate next single question dynamically on demand
 * @route   POST /api/interview/:id/next-question
 */
exports.generateNextQuestion = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    const {
      candidateSkills,
      candidateWeakAreas,
      masteredTopics,
      candidateProjects,
      historicalQuestions,
      performanceTrajectory,
    } = await getCandidateProfileContext(interview.userId);

    const sessionPreviousQuestions = interview.questions.map((q) => q.question);
    const combinedPreviousQuestions = [...new Set([...historicalQuestions, ...sessionPreviousQuestions])];

    const nextQuestionObj = await generateSingleQuestionWithGemini({
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      type: interview.type,
      candidateSkills,
      candidateWeakAreas,
      masteredTopics,
      candidateProjects,
      previousQuestions: combinedPreviousQuestions,
      performanceTrajectory,
      questionIndex: interview.questions.length,
    });

    interview.questions.push(nextQuestionObj);
    await interview.save();

    return res.status(200).json({
      success: true,
      message: 'Next question generated dynamically',
      questionData: nextQuestionObj,
      interview,
    });
  } catch (error) {
    console.error('Error generating next question:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Could not generate next question',
      error: error.message,
    });
  }
};

/**
 * @desc    Finish an interview session & generate comprehensive AI performance report
 * @route   PATCH /api/interview/:id/finish
 */
exports.finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    const answered = interview.questions.filter((q) => q.score > 0 || (q.userAnswer && q.userAnswer.trim()));
    const avgScore = answered.length
      ? Math.round(answered.reduce((acc, curr) => acc + curr.score, 0) / answered.length)
      : 0;

    const average = (field) =>
      answered.length
        ? Math.round(answered.reduce((acc, curr) => acc + (curr[field] || 0), 0) / answered.length)
        : 0;

    const categoryScores = {
      technical: average('technicalScore'),
      problemSolving: average('problemSolvingScore'),
      communication: average('communicationScore'),
      relevance: average('relevanceScore'),
      confidence: average('confidenceScore'),
      timeManagement: average('timeManagementScore'),
    };

    // Aggregate topic strengths and weaknesses from answered questions
    const strongestList = [];
    const weakestList = [];

    answered.forEach((q) => {
      if (q.score >= 75 && q.category) strongestList.push(q.category);
      if (Array.isArray(q.strengths)) strongestList.push(...q.strengths);

      if (q.score < 70 && q.category) weakestList.push(q.category);
      if (Array.isArray(q.weaknesses)) weakestList.push(...q.weaknesses);
      if (Array.isArray(q.missingPoints)) weakestList.push(...q.missingPoints);
    });

    const strongestTopics = [...new Set(strongestList.map((s) => String(s).trim()).filter(Boolean))].slice(0, 5);
    const weakestTopics = [...new Set(weakestList.map((w) => String(w).trim()).filter(Boolean))].slice(0, 5);

    // Synthesize final AI performance report via Gemini AI
    const aiReport = await generateFinalReportWithGemini({
      targetRole: interview.targetRole,
      type: interview.type,
      difficulty: interview.difficulty,
      overallScore: avgScore,
      categoryScores,
      questions: answered,
      strongestTopics,
      weakestTopics,
    });

    interview.status = 'completed';
    interview.overallScore = avgScore;
    interview.overallTechnicalScore = categoryScores.technical;
    interview.overallProblemSolvingScore = categoryScores.problemSolving;
    interview.overallCommunicationScore = categoryScores.communication;
    interview.overallRelevanceScore = categoryScores.relevance;
    interview.overallConfidenceScore = categoryScores.confidence;
    interview.overallTimeManagementScore = categoryScores.timeManagement;

    interview.summary = aiReport.summary || `Candidate completed ${answered.length}/${interview.questions.length} questions in a ${interview.difficulty} ${interview.type.toUpperCase()} interview round for ${interview.targetRole}. Overall match score: ${avgScore}%.`;
    interview.personalizedFeedback = aiReport.personalizedFeedback || '';
    interview.strongestTopics = Array.isArray(aiReport.strongestTopics) && aiReport.strongestTopics.length ? aiReport.strongestTopics : strongestTopics;
    interview.weakestTopics = Array.isArray(aiReport.weakestTopics) && aiReport.weakestTopics.length ? aiReport.weakestTopics : weakestTopics;
    interview.recommendedTopics = Array.isArray(aiReport.recommendedTopics) ? aiReport.recommendedTopics : [];

    interview.completedAt = new Date();
    interview.totalDurationMs = interview.completedAt - new Date(interview.startedAt || interview.completedAt);

    await interview.save();

    return res.status(200).json({
      success: true,
      message: 'Interview session completed and final report generated successfully',
      overallScore: avgScore,
      summary: interview.summary,
      report: {
        overallScore: avgScore,
        categoryScores,
        strongestTopics: interview.strongestTopics,
        weakestTopics: interview.weakestTopics,
        personalizedFeedback: interview.personalizedFeedback,
        recommendedTopics: interview.recommendedTopics,
      },
      data: interview,
    });
  } catch (error) {
    console.error('Error finishing interview session:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Could not complete interview session',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all interview sessions for a user
 * @route   GET /api/interview/user/history
 */
exports.getUserInterviews = async (req, res) => {
  try {
    const query = req.user && req.user.id ? { userId: req.user.id } : {};
    const interviews = await Interview.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    });
  } catch (error) {
    console.error('Error fetching user interview history:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to fetch interview history',
      error: error.message,
    });
  }
};

/**
 * @desc    Get progress tracking analytics across multiple AI interviews
 * @route   GET /api/interview/progress
 */
exports.getUserProgress = async (req, res) => {
  try {
    const query = req.user && req.user.id
      ? { userId: req.user.id, status: 'completed' }
      : { status: 'completed' };

    const completed = await Interview.find(query).sort({ completedAt: 1 });

    if (completed.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalInterviews: 0,
          initialScore: 0,
          latestScore: 0,
          overallImprovement: 0,
          averageScore: 0,
          scoreTimeline: [],
          recurringWeakTopics: [],
          recurringStrongTopics: [],
          categoryAverages: {
            technical: 0,
            problemSolving: 0,
            communication: 0,
            relevance: 0,
            confidence: 0,
            timeManagement: 0,
          },
        },
      });
    }

    const firstSession = completed[0];
    const latestSession = completed[completed.length - 1];
    const initialScore = firstSession.overallScore || 0;
    const latestScore = latestSession.overallScore || 0;
    const overallImprovement = latestScore - initialScore;

    const totalScoreSum = completed.reduce((acc, curr) => acc + (curr.overallScore || 0), 0);
    const averageScore = Math.round(totalScoreSum / completed.length);

    // Build timeline for score progression charts
    const scoreTimeline = completed.map((item, idx) => ({
      sessionIndex: idx + 1,
      id: item._id,
      date: item.completedAt || item.createdAt,
      overallScore: item.overallScore || 0,
      targetRole: item.targetRole,
      type: item.type,
      difficulty: item.difficulty,
      technicalScore: item.overallTechnicalScore || 0,
      problemSolvingScore: item.overallProblemSolvingScore || 0,
      communicationScore: item.overallCommunicationScore || 0,
      relevanceScore: item.overallRelevanceScore || 0,
      confidenceScore: item.overallConfidenceScore || 0,
      timeManagementScore: item.overallTimeManagementScore || 0,
    }));

    // Aggregate topic frequency across sessions to identify recurring weak & strong topics
    const weaknessCounts = {};
    const strengthCounts = {};

    completed.forEach((inv) => {
      if (Array.isArray(inv.weakestTopics)) {
        inv.weakestTopics.forEach((t) => {
          const norm = String(t).trim();
          if (norm) weaknessCounts[norm] = (weaknessCounts[norm] || 0) + 1;
        });
      }

      if (Array.isArray(inv.strongestTopics)) {
        inv.strongestTopics.forEach((t) => {
          const norm = String(t).trim();
          if (norm) strengthCounts[norm] = (strengthCounts[norm] || 0) + 1;
        });
      }

      if (Array.isArray(inv.questions)) {
        inv.questions.forEach((q) => {
          if (Array.isArray(q.weaknesses)) {
            q.weaknesses.forEach((w) => {
              const norm = String(w).trim();
              if (norm) weaknessCounts[norm] = (weaknessCounts[norm] || 0) + 1;
            });
          }
          if (Array.isArray(q.missingPoints)) {
            q.missingPoints.forEach((m) => {
              const norm = String(m).trim();
              if (norm) weaknessCounts[norm] = (weaknessCounts[norm] || 0) + 1;
            });
          }
        });
      }
    });

    const recurringWeakTopics = Object.keys(weaknessCounts)
      .map((topic) => ({
        topic,
        count: weaknessCounts[topic],
        percentageOfSessions: Math.round((weaknessCounts[topic] / completed.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const recurringStrongTopics = Object.keys(strengthCounts)
      .map((topic) => ({
        topic,
        count: strengthCounts[topic],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const categoryAverages = {
      technical: Math.round(completed.reduce((acc, curr) => acc + (curr.overallTechnicalScore || 0), 0) / completed.length),
      problemSolving: Math.round(completed.reduce((acc, curr) => acc + (curr.overallProblemSolvingScore || 0), 0) / completed.length),
      communication: Math.round(completed.reduce((acc, curr) => acc + (curr.overallCommunicationScore || 0), 0) / completed.length),
      relevance: Math.round(completed.reduce((acc, curr) => acc + (curr.overallRelevanceScore || 0), 0) / completed.length),
      confidence: Math.round(completed.reduce((acc, curr) => acc + (curr.overallConfidenceScore || 0), 0) / completed.length),
      timeManagement: Math.round(completed.reduce((acc, curr) => acc + (curr.overallTimeManagementScore || 0), 0) / completed.length),
    };

    return res.status(200).json({
      success: true,
      data: {
        totalInterviews: completed.length,
        initialScore,
        latestScore,
        overallImprovement,
        averageScore,
        scoreTimeline,
        recurringWeakTopics,
        recurringStrongTopics,
        categoryAverages,
      },
    });
  } catch (error) {
    console.error('Error fetching user interview progress analytics:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to compute interview progress',
      error: error.message,
    });
  }
};
