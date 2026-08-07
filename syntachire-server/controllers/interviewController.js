const Interview = require('../models/Interview');
const { evaluateAnswerWithGemini } = require('../services/geminiService');

// Seed Question Generator tailored by type & role
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
        question: `Tell me about a time you faced a significant disagreement with a teammate while working on a ${roleStr} project and how you resolved it.`,
        category: 'Conflict Resolution & Teamwork',
        hint: 'Use the STAR method and focus on empathy, ownership, and a constructive outcome.',
      },
      {
        question: `Why do you want to work as a ${roleStr}, and how does this role align with your long-term career growth?`,
        category: 'Motivation & Career Goals',
        hint: 'Connect your growth story to product impact, learning, and the role’s responsibilities.',
      },
      {
        question: `Describe a situation where priorities changed suddenly near a deadline. How did you adapt while keeping quality high?`,
        category: 'Adaptability & Delivery',
        hint: 'Show communication, prioritization, and calm decision-making under pressure.',
      },
      {
        question: `How do you receive feedback on your work when it challenges your approach to a ${roleStr} problem?`,
        category: 'Feedback & Growth',
        hint: 'Mention humility, curiosity, and how you improve after feedback.',
      },
      {
        question: `Give an example of when you took initiative without formal authority to improve a delivery or experience.`,
        category: 'Ownership & Initiative',
        hint: 'Describe the problem, the action you took, and the measurable result.',
      },
    ],
    technical: [
      {
        question: `How would you design a scalable ${roleContext.example} that handles high traffic and needs strong reliability for a ${roleStr} role?`,
        category: 'System Design & Scalability',
        hint: "Discuss architecture decisions, trade-offs, and how you'd scale under load.",
      },
      {
        question: `Explain how you would optimize ${roleContext.focus} in a production ${roleStr} setup.`,
        category: 'Practical Engineering',
        hint: 'Include performance, debugging, testing, and maintainability considerations.',
      },
      {
        question: `Compare the trade-offs you would consider when choosing between different storage, API, or deployment patterns for a ${roleStr} system.`,
        category: 'Architecture Trade-offs',
        hint: 'Mention latency, consistency, cost, complexity, and operational concerns.',
      },
      {
        question: `How would you approach debugging a production issue in a ${roleStr} system when the symptoms are unclear?`,
        category: 'Debugging & Resilience',
        hint: 'Mention observability, logs, metrics, and rollback or mitigation strategies.',
      },
      {
        question: `What would you improve first in a legacy ${roleStr} codebase that is slowing down delivery?`,
        category: 'Refactoring & Maintainability',
        hint: 'Discuss prioritization, risk reduction, and iterative improvements.',
      },
    ],
    mixed: [
      {
        question: `Walk me through an end-to-end ${roleContext.example} you would build for a ${roleStr} role and explain your key trade-offs.`,
        category: 'Architecture & Trade-offs',
        hint: 'Cover requirements, data flow, technical choices, and delivery concerns.',
      },
      {
        question: `How do you balance writing clean, tested code with meeting aggressive deadlines in a ${roleStr} environment?`,
        category: 'Engineering Pragmatism',
        hint: 'Show how you balance quality, speed, and business priorities.',
      },
      {
        question: `How would you ensure the solution is reliable, secure, and maintainable for a ${roleStr} role?`,
        category: 'Reliability & Security',
        hint: 'Mention testing, monitoring, authentication, permissions, and fallback strategies.',
      },
      {
        question: `Tell me about a technical challenge you solved and how you measured whether the solution actually worked.`,
        category: 'Outcome & Measurement',
        hint: 'Reference metrics, feedback loops, or user impact where possible.',
      },
      {
        question: `If you were joining a new team in a ${roleStr} role tomorrow, how would you ramp up quickly and add value?`,
        category: 'Onboarding & Ownership',
        hint: 'Discuss learning, communication, context gathering, and early wins.',
      },
    ],
  };

  const pool = QUESTION_BANK[type] || QUESTION_BANK.mixed;
  const result = [];
  const safeCount = Math.max(1, Number(count) || 5);
  const difficultyHint = difficultyLabel === 'hard'
    ? 'Focus on depth, trade-offs, and edge cases.'
    : difficultyLabel === 'easy'
      ? 'Keep your answer clear and practical.'
      : 'Provide a balanced explanation with concrete examples.';

  for (let i = 0; i < safeCount; i++) {
    const qObj = pool[i % pool.length];
    result.push({
      question: qObj.question,
      category: qObj.category,
      hint: `${qObj.hint} ${difficultyHint}`,
      userAnswer: '',
      score: 0,
      strengths: '',
      improvements: '',
    });
  }
  return result;
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
    const { questionIndex, answer } = req.body;
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

    // Query Gemini API
    const geminiFeedback = await evaluateAnswerWithGemini({
      question: currentQuestion.question,
      answer,
      targetRole: interview.targetRole,
      difficulty: interview.difficulty,
      type: interview.type,
    });

    currentQuestion.userAnswer = answer || '';
    currentQuestion.score = geminiFeedback.score;
    currentQuestion.strengths = Array.isArray(geminiFeedback.strengths)
      ? geminiFeedback.strengths.join(' ')
      : geminiFeedback.strengths;
    currentQuestion.improvements = Array.isArray(geminiFeedback.weaknesses)
      ? geminiFeedback.weaknesses.join(' ')
      : geminiFeedback.weaknesses;

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
      : 85;

    interview.status = 'completed';
    interview.overallScore = avgScore;
    interview.completedAt = new Date();
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
