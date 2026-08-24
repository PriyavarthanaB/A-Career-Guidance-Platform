const Interview = require('../models/Interview');
const { evaluateAnswerWithGemini } = require('../services/geminiService');

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
 * @desc    Start a new mock interview session
 * @route   POST /api/interview/start
 */
exports.startInterview = async (req, res) => {
  try {
    const {
      type = 'mixed',
      difficulty = 'Medium',
      targetRole = 'Full Stack Software Developer',
      responseMode = 'text',
      questionCount = 5,
    } = req.body;

    const questions = generateQuestionsForRole(
      type,
      difficulty,
      targetRole,
      Number(questionCount) || 5
    );

    const interviewData = {
      type,
      difficulty,
      targetRole,
      responseMode,
      questionCount: Number(questionCount) || 5,
      status: 'in-progress',
      questions,
      startedAt: new Date(),
    };

    if (req.user && req.user.id) {
      interviewData.userId = req.user.id;
    }

    const newInterview = await Interview.create(interviewData);

    return res.status(201).json({
      success: true,
      message: 'Interview session started successfully',
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

    return res.status(200).json({
      success: true,
      data: interview,
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
 * @desc    Submit answer for a question in an interview session and evaluate via Gemini
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

    // Query Gemini API
    const geminiFeedback = await evaluateAnswerWithGemini({
      question: currentQuestion.question,
      answer,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      type: interview.type,
    });

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
    currentQuestion.aiFeedback = geminiFeedback.aiFeedback || geminiFeedback.idealAnswer || '';
    currentQuestion.strengths = Array.isArray(geminiFeedback.strengths)
      ? geminiFeedback.strengths
      : geminiFeedback.strengths ? [geminiFeedback.strengths] : [];
    currentQuestion.weaknesses = Array.isArray(geminiFeedback.weaknesses)
      ? geminiFeedback.weaknesses
      : geminiFeedback.weaknesses ? [geminiFeedback.weaknesses] : [];
    currentQuestion.missingPoints = Array.isArray(geminiFeedback.missingPoints)
      ? geminiFeedback.missingPoints
      : geminiFeedback.missingPoints ? [geminiFeedback.missingPoints] : [];
    currentQuestion.improvements = geminiFeedback.improvements || '';

    await interview.save();

    return res.status(200).json({
      success: true,
      message: 'Answer evaluated and recorded with Gemini AI',
      feedback: geminiFeedback,
      questionData: currentQuestion,
      interview,
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
 * @desc    Finish an interview session & compute overall score
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

    const answered = interview.questions.filter((q) => q.score > 0);
    const avgScore = answered.length
      ? Math.round(
          answered.reduce((acc, curr) => acc + curr.score, 0) / answered.length
        )
      : 0;

    const average = (field) =>
      answered.length
        ? Math.round(
            answered.reduce((acc, curr) => acc + (curr[field] || 0), 0) /
              answered.length
          )
        : 0;

    interview.status = 'completed';
    interview.overallScore = avgScore;
    interview.overallTechnicalScore = average('technicalScore');
    interview.overallProblemSolvingScore = average('problemSolvingScore');
    interview.overallCommunicationScore = average('communicationScore');
    interview.overallRelevanceScore = average('relevanceScore');
    interview.overallConfidenceScore = average('confidenceScore');
    interview.overallTimeManagementScore = average('timeManagementScore');
    interview.completedAt = new Date();
    interview.totalDurationMs = interview.completedAt - new Date(interview.startedAt || interview.completedAt);
    interview.summary = `Candidate completed ${answered.length}/${interview.questions.length} questions in a ${interview.difficulty} ${interview.type.toUpperCase()} interview round for ${interview.targetRole}. Overall match score: ${avgScore}%.`;

    await interview.save();

    return res.status(200).json({
      success: true,
      message: 'Interview session completed',
      overallScore: avgScore,
      summary: interview.summary,
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
