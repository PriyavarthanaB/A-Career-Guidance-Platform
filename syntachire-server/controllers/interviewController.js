const Interview = require('../models/Interview');
const { evaluateAnswerWithGemini } = require('../services/geminiService');

// Seed Question Generator tailored by type & role
const generateQuestionsForRole = (type, difficulty, targetRole, count = 5) => {
  const roleStr = targetRole || 'Software Engineer';

  const QUESTION_BANK = {
    hr: [
      {
        question: `Tell me about a time you faced a major technical disagreement with a team member while working on ${roleStr} projects and how you resolved it.`,
        category: 'Conflict Resolution & Teamwork',
        hint: 'Use the STAR method: Situation, Task, Action, Result. Focus on empathy and objective resolution.',
      },
      {
        question: `Why do you want to work as a ${roleStr}, and what drives your professional growth?`,
        category: 'Motivation & Career Goals',
        hint: 'Highlight your alignment with scalable product building and continuous technical learning.',
      },
      {
        question: `Describe a scenario where project requirements changed unexpectedly near deadline. How did you adapt?`,
        category: 'Adaptability & Pressure Management',
        hint: 'Focus on prioritization, stakeholder communication, and maintaining code standards.',
      },
      {
        question: `How do you handle constructive feedback on your code reviews or architecture proposals?`,
        category: 'Feedback & Growth Mindset',
        hint: 'Emphasize openness to learning, collaborative design, and code quality improvement.',
      },
      {
        question: `Give an example of a project where you took leadership initiative without explicit authority.`,
        category: 'Ownership & Initiative',
        hint: 'Discuss problem identification, driving consensus, and delivering measurable impact.',
      },
    ],
    technical: [
      {
        question: `How would you design a scalable architecture for a ${roleStr} application serving 100,000 requests per minute?`,
        category: 'System Design & Scalability',
        hint: 'Discuss load balancing, caching layers (Redis), database sharding, and stateless server clusters.',
      },
      {
        question: `Explain how state management and asynchronous data fetching are optimized in a production ${roleStr} setup.`,
        category: 'Frontend & API Integration',
        hint: 'Mention optimistic updates, query caching, debouncing, and memory leak prevention.',
      },
      {
        question: `Compare SQL vs NoSQL database models for a ${roleStr} backend. When would you choose PostgreSQL vs MongoDB?`,
        category: 'Database Architecture',
        hint: 'Analyze ACID guarantees, schema flexibility, horizontal scaling, and index optimization.',
      },
      {
        question: `Walk me through how you optimize web application performance when initial bundle size and page render latency are high.`,
        category: 'Performance Engineering',
        hint: 'Touch on code splitting, tree shaking, lazy loading, CDN distribution, and asset compression.',
      },
      {
        question: `Explain how microservice communication or event-driven architecture handles failure recovery and message delivery guarantees.`,
        category: 'Backend & Resilience',
        hint: 'Discuss message queues (RabbitMQ/Kafka), idempotent retries, dead letter queues, and circuit breakers.',
      },
    ],
    mixed: [
      {
        question: `Walk me through an end-to-end ${roleStr} system you designed or built. What were the toughest trade-offs?`,
        category: 'System Architecture & Trade-offs',
        hint: 'Outline data flow, component decoupling, security controls, and trade-off rationales.',
      },
      {
        question: `Describe how you balance writing clean, tested code with delivering features under aggressive business deadlines.`,
        category: 'Engineering Pragmatism',
        hint: 'Discuss test-driven approaches, modular refactoring, and managing technical debt.',
      },
      {
        question: `Explain how you debug complex asynchronous edge cases or memory leaks in a high-traffic ${roleStr} environment.`,
        category: 'Debugging & Profiling',
        hint: 'Detail browser DevTools, APM tools, log aggregation (ELK), and heap snapshot profiling.',
      },
      {
        question: `How do you ensure security best practices (JWT auth, CORS, input sanitization, rate limiting) in a ${roleStr} API?`,
        category: 'Application Security',
        hint: 'Cover OWASP Top 10 mitigation, token expiration, HTTPS headers, and SQL/NoSQL injection prevention.',
      },
      {
        question: `Tell me about a technical failure or outage you experienced. How did you troubleshoot, post-mortem, and prevent recurrence?`,
        category: 'Incident Response & Ownership',
        hint: 'Focus on root-cause analysis, blameless post-mortems, and automated regression tests.',
      },
    ],
  };

  const pool = QUESTION_BANK[type] || QUESTION_BANK.mixed;
  const result = [];
  for (let i = 0; i < count; i++) {
    const qObj = pool[i % pool.length];
    result.push({
      question: qObj.question,
      category: qObj.category,
      hint: qObj.hint,
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
