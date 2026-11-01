const { GoogleGenAI } = require('@google/genai');

/**
 * Helper to get description of interview type for prompt context
 */
const getInterviewTypeDescription = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'technical':
      return 'Technical Interview Round focusing on coding algorithms, data structures, system design, software architecture, and technical trade-offs.';
    case 'hr':
      return 'HR Interview Round focusing on cultural fit, work history, career motivations, teamwork, soft skills, and professional values.';
    case 'behavioral':
      return 'Behavioral Interview Round focusing on the STAR method (Situation, Task, Action, Result), past workplace scenarios, leadership, conflict resolution, and handling high-pressure situations.';
    case 'mixed':
    default:
      return 'Comprehensive Mixed Round combining technical problem-solving, behavioral scenarios, and HR cultural alignment.';
  }
};

/**
 * Fallback static questions when Gemini API key is unavailable or fails
 */
const FALLBACK_QUESTION_BANK = {
  technical: [
    {
      question: "How would you explain the difference between synchronous and asynchronous execution in a production application?",
      category: "Core Concepts",
      hint: "Use a concrete scenario like database calls vs CPU-bound tasks.",
    },
    {
      question: "Walk me through how you would optimize a slow database query or API endpoint.",
      category: "Performance & Optimization",
      hint: "Mention indexing, caching, query profiling, and async processing.",
    },
    {
      question: "How would you handle authentication and state management securely in a distributed system?",
      category: "Security & Architecture",
      hint: "Discuss JWTs, sessions, tokens, HTTPS, and permission checks.",
    },
    {
      question: "Describe how you approach error handling, logging, and monitoring in a production environment.",
      category: "Observability & Resilience",
      hint: "Cover structured logging, alert metrics, try-catch boundaries, and graceful degradation.",
    },
  ],
  hr: [
    {
      question: "Tell me about yourself, your background, and why you are interested in this position.",
      category: "Career Fit & Background",
      hint: "Keep your summary concise, highlighting key skills and relevant experience.",
    },
    {
      question: "What motivates you most in your engineering work, and what environment brings out your best performance?",
      category: "Motivation & Work Culture",
      hint: "Connect your motivation to problem-solving, team collaboration, and impact.",
    },
    {
      question: "Where do you see your technical career evolving in the next 2 to 3 years?",
      category: "Career Goals",
      hint: "Focus on continuous skill development, leadership, and taking on greater technical responsibility.",
    },
  ],
  behavioral: [
    {
      question: "Tell me about a challenging situation you faced on a project and how you resolved it.",
      category: "STAR Method & Problem Solving",
      hint: "Structure your response using Situation, Task, Action, and Result (STAR).",
    },
    {
      question: "Describe a time when you received constructive feedback on your code or design. How did you handle it?",
      category: "Growth Mindset & Receptiveness",
      hint: "Highlight your open attitude, concrete changes made, and positive outcome.",
    },
    {
      question: "Tell me about a time when project priorities changed suddenly near a deadline. How did you adapt?",
      category: "Adaptability & Crisis Management",
      hint: "Explain how you reprioritized tasks, communicated with stakeholders, and delivered quality.",
    },
  ],
  mixed: [
    {
      question: "Walk me through an end-to-end project you recently worked on. What were the key trade-offs and challenges?",
      category: "Architecture & Trade-offs",
      hint: "Cover project goals, technical choices, unexpected roadblocks, and measurable outcomes.",
    },
    {
      question: "How do you balance writing clean, maintainable code with tight product delivery deadlines?",
      category: "Pragmatism & Delivery",
      hint: "Discuss technical debt management, testing strategies, and transparent communication.",
    },
    {
      question: "Describe how you collaborate with team members when there is a difference of opinion on technical design.",
      category: "Collaboration & Decision Making",
      hint: "Emphasize listening, benchmarking solutions, data-driven trade-offs, and alignment.",
    },
  ],
};

/**
 * Gets a clean fallback question excluding previous questions to avoid duplicates
 */
const getFallbackQuestion = (type, difficulty, previousQuestions = []) => {
  const roundType = (type || 'mixed').toLowerCase();
  const pool = FALLBACK_QUESTION_BANK[roundType] || FALLBACK_QUESTION_BANK.mixed;
  
  // Normalize previous questions for deduplication
  const prevNormalized = previousQuestions.map(q => q.toLowerCase().trim());
  
  const unused = pool.filter(qObj => !prevNormalized.includes(qObj.question.toLowerCase().trim()));
  const chosen = unused.length > 0 ? unused[Math.floor(Math.random() * unused.length)] : pool[Math.floor(Math.random() * pool.length)];

  return {
    question: chosen.question,
    category: chosen.category || 'General',
    hint: `${chosen.hint} Difficulty level: ${difficulty}.`,
    difficulty: difficulty || 'Medium',
  };
};

/**
 * Generates ONE dynamic, personalized interview question using Google Gemini AI based on candidate's 
 * target role, resume skills, projects, weak areas, difficulty, previous questions, and recent answer quality.
 * Enforces project architecture deep-dives, weak topic targeting, and strict factual grounding.
 *
 * @param {Object} params
 * @param {string} params.targetRole - Target job role (e.g. Full Stack Software Developer)
 * @param {string} params.difficulty - Easy, Medium, or Hard (dynamically adjusted)
 * @param {string} params.type - hr, technical, behavioral, or mixed
 * @param {Array<string>} [params.candidateSkills] - Extracted skills from user's latest resume
 * @param {Array<string>} [params.candidateWeakAreas] - Weak areas/gaps identified from resume & past performance
 * @param {string} [params.candidateProjects] - Raw text summary of user's projects/experience
 * @param {Array<string>} [params.previousQuestions] - Questions already asked to prevent duplicates
 * @param {number} [params.questionIndex] - Current question index (0-indexed)
 * @param {Object|null} [params.lastAnswerContext] - { question, answer, missingConcepts, score } of previous answer
 * @param {boolean} [params.isFollowUp] - Whether to generate a conversational follow-up for an incomplete answer
 *
 * @returns {Promise<Object>} Single question object { question, category, hint, difficulty, isFollowUp }
 */
exports.generateSingleQuestionWithGemini = async ({
  targetRole = 'Full Stack Software Developer',
  difficulty = 'Medium',
  type = 'mixed',
  seniorityLevel = 'Mid-Level',
  industryFocus = 'Technology & SaaS',
  jobDescription = '',
  candidateSkills = [],
  candidateWeakAreas = [],
  masteredTopics = [],
  candidateProjects = '',
  previousQuestions = [],
  performanceTrajectory = '',
  questionIndex = 0,
  lastAnswerContext = null,
  isFollowUp = false,
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY missing. Using fallback dynamic question generator.');
    return getFallbackQuestion(type, difficulty, previousQuestions);
  }

  // Format skills, weak areas, mastered topics, and projects context
  const formattedSkills = Array.isArray(candidateSkills) && candidateSkills.length > 0
    ? candidateSkills.slice(0, 12).join(', ')
    : 'Core software engineering fundamentals';

  const formattedWeakAreas = Array.isArray(candidateWeakAreas) && candidateWeakAreas.length > 0
    ? candidateWeakAreas.slice(0, 8).join(', ')
    : 'None explicitly identified yet';

  const formattedMastered = Array.isArray(masteredTopics) && masteredTopics.length > 0
    ? masteredTopics.join(', ')
    : 'None explicitly mastered yet';

  const projectSnippet = candidateProjects && typeof candidateProjects === 'string'
    ? candidateProjects.slice(0, 600).replace(/\s+/g, ' ')
    : '';

  const jdSnippet = jobDescription && typeof jobDescription === 'string'
    ? jobDescription.slice(0, 800).replace(/\s+/g, ' ')
    : '';

  // Format previous questions (current session + all past interview sessions) to prevent duplicates
  const prevQuestionsText = Array.isArray(previousQuestions) && previousQuestions.length > 0
    ? previousQuestions.slice(-30).map((q, idx) => `${idx + 1}. "${q}"`).join('\n')
    : 'None (this is the first question)';

  let prompt = '';

  // Define strict domain boundaries for different role families
  const getRoleDomainGuide = (role) => {
    const r = (role || '').toLowerCase();
    if (r.includes('frontend') || r.includes('react') || r.includes('ui') || r.includes('web developer')) {
      return {
        coreDomain: 'Frontend Web Engineering & Client-Side Architecture',
        allowedTopics: 'React, Vue, TypeScript, JavaScript (Event Loop, Closures, Async), DOM & Virtual DOM, CSS/Tailwind, Responsive Design, State Management (Redux, Zustand, Context), Web Performance (Core Web Vitals, Bundle Splitting, Code Splitting, Memoization, Lazy Loading), Accessibility (a11y, WCAG), Browser APIs, Client-Side Routing, Client-Side Caching (IndexedDB, Service Workers, React Query/SWR), Component Lifecycle, Unit Testing (Jest, RTL).',
        forbiddenTopics: 'Backend database indexing, Redis server caching strategies, SQL migrations, microservice orchestration, server daemons, backend queue workers (RabbitMQ/Kafka).',
      };
    }
    if (r.includes('backend') || r.includes('api') || r.includes('database')) {
      return {
        coreDomain: 'Backend Engineering & Distributed Systems',
        allowedTopics: 'REST/GraphQL/gRPC API design, SQL & NoSQL databases, indexing, transactions, Redis/caching, microservices, authentication (JWT/OAuth), message queues (Kafka/RabbitMQ), concurrency, distributed locking, server performance & scaling.',
        forbiddenTopics: 'CSS layout issues, DOM manipulation, React hooks details, browser rendering pipeline.',
      };
    }
    if (r.includes('data') || r.includes('machine learning') || r.includes('ai')) {
      return {
        coreDomain: 'Data Science & Machine Learning Engineering',
        allowedTopics: 'Model architectures, feature engineering, loss functions, evaluation metrics (F1, ROC-AUC), data pipelines, pandas, PyTorch/TensorFlow, LLMs, embeddings, RAG architectures, model deployment & drift monitoring.',
        forbiddenTopics: 'Frontend CSS, client-side React rendering.',
      };
    }
    if (r.includes('devops') || r.includes('cloud') || r.includes('sre')) {
      return {
        coreDomain: 'DevOps, SRE & Cloud Infrastructure',
        allowedTopics: 'CI/CD pipelines, Docker, Kubernetes, Terraform/IaC, AWS/GCP/Azure services, monitoring & observability (Prometheus, Grafana), incident response, high availability, zero-downtime deployments.',
        forbiddenTopics: 'Frontend UI layout, machine learning model loss optimization.',
      };
    }
    return {
      coreDomain: 'Software Engineering & Architecture',
      allowedTopics: 'Software design patterns, clean code, data structures & algorithms, testing, system architecture, engineering trade-offs.',
      forbiddenTopics: 'Out-of-domain tooling.',
    };
  };

  const domainGuide = getRoleDomainGuide(targetRole);

  if (isFollowUp && lastAnswerContext && lastAnswerContext.question && lastAnswerContext.answer) {
    const missingStr = Array.isArray(lastAnswerContext.missingConcepts) && lastAnswerContext.missingConcepts.length > 0
      ? lastAnswerContext.missingConcepts.join(', ')
      : 'key technical details and trade-offs';

    prompt = `
    You are an expert technical interviewer conducting a live conversational "${type.toUpperCase()}" interview round for a "${seniorityLevel} ${targetRole}" position in the "${industryFocus}" industry at "${difficulty}" difficulty level.

    STRICT ROLE DOMAIN BOUNDARY:
    - Primary Domain: ${domainGuide.coreDomain}
    - Allowed Focus Topics: ${domainGuide.allowedTopics}
    - FORBIDDEN TOPICS (DO NOT ASK): ${domainGuide.forbiddenTopics}

    The candidate just answered the previous question, but their answer was incomplete or missing key concepts.

    Previous Question Asked:
    "${lastAnswerContext.question}"

    Candidate's Answer:
    "${lastAnswerContext.answer}"

    Missing Concepts / Omitted Details:
    "${missingStr}"

    TASK:
    Generate a natural, conversational FOLLOW-UP question probing directly into the candidate's answer and omitted concepts within the "${targetRole}" domain.

    Conversational & Adaptive Style Instructions:
    1. Start with a natural verbal transition (e.g. "Thanks for explaining that. You mentioned X, but how would you handle...", or "That covers part of the solution. Digging deeper into...").
    2. Directly probe into the candidate's specific answer and missing concepts.
    3. Stay strictly within the ${targetRole} domain (${domainGuide.allowedTopics}).
    4. Calibrate depth to ${seniorityLevel} expectations for ${industryFocus}.

    Return ONLY a valid JSON object matching this schema:
    {
      "question": "The conversational follow-up question text",
      "category": "Probing Follow-Up",
      "hint": "Focus directly on addressing the missing concepts from your previous response."
    }

    Return pure JSON text only. Do NOT include markdown code blocks.
    `;
  } else {
    prompt = `
    You are an expert technical interviewer conducting a highly personalized, conversational "${type.toUpperCase()}" interview for a candidate applying for a "${seniorityLevel} ${targetRole}" role in the "${industryFocus}" industry at "${difficulty}" difficulty level.

    STRICT ROLE DOMAIN BOUNDARY (CRITICAL REQUIREMENT):
    - Target Role: ${targetRole}
    - Core Domain: ${domainGuide.coreDomain}
    - ALLOWED TOPICS (MUST CHOOSE FROM THESE): ${domainGuide.allowedTopics}
    - STRICTLY FORBIDDEN TOPICS (NEVER ASK): ${domainGuide.forbiddenTopics}
    - Seniority Level: ${seniorityLevel} (Calibrate question complexity and system scale accordingly)
    - Industry Focus: ${industryFocus}
    ${jdSnippet ? `- Targeted Job Description / Requirements:\n"${jdSnippet}"` : ''}

    ${questionIndex === 0 ? `SESSION OPENER RULE (Question #1):
    This is Question #1 of a brand new interview session.
    DO NOT say "Building on our previous discussion...", "As we discussed earlier...", or reference any prior topics.
    Start with a fresh, direct, engaging question evaluating ${targetRole} fundamentals or architecture.` : ''}

    CANDIDATE PROFILE & CONTEXT:
    - Verified Skills from Resume: ${formattedSkills}
    - Active High-Priority Weak Topics: ${formattedWeakAreas}
    - Mastered Topics: ${formattedMastered}
    - Performance Trajectory: "${performanceTrajectory || 'First session for this candidate.'}"
    ${projectSnippet ? `- Candidate Projects & Experience:\n"${projectSnippet}"` : ''}

    PERSONALIZATION, DOMAIN & SENIORITY RULES:
    1. STRICT ${targetRole.toUpperCase()} FOCUS: The question MUST be 100% relevant to ${targetRole}. For Frontend Developer, ask about React/DOM/CSS/Web Performance/State/Browser APIs; NEVER ask about backend database caching (Redis) or server-side SQL schemas.
    2. SENIORITY CALIBRATION (${seniorityLevel}):
       - Junior/Entry: Focus on fundamentals, component lifecycles, clean code, and basic debugging.
       - Mid-Level: Focus on state management, asynchronous data fetching, web performance, component architecture, and trade-offs.
       - Senior: Focus on Core Web Vitals, large-scale UI architecture, state persistence, bundle optimization, security (XSS/CSRF), and design systems.
       - Lead/Staff: Focus on micro-frontends, cross-cutting performance budgets, build pipelines, rendering strategies (SSR/SSG/ISR/RSC), and technical governance.
    3. ZERO-REPETITION: Do NOT repeat or closely rephrase ANY previously asked question:
    ${prevQuestionsText}

    TASK:
    Generate exactly ONE candidate-specific interview question for Question #${questionIndex + 1} at "${difficulty}" difficulty level.

    Return ONLY a valid JSON object matching this schema:
    {
      "question": "The candidate-specific interview question text strictly within ${targetRole} domain",
      "category": "Short topic category (e.g., React Component Architecture, Core Web Vitals Optimization, State Management)",
      "hint": "A clear, candidate-tailored answer hint explaining what frontend concepts, APIs, or performance metrics to cover"
    }

    Do NOT include markdown code blocks. Return pure JSON text only.
    `;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            question: { type: 'STRING' },
            category: { type: 'STRING' },
            hint: { type: 'STRING' },
          },
          required: ['question', 'category', 'hint'],
        },
      },
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);

    if (!parsedData.question || typeof parsedData.question !== 'string') {
      throw new Error('Invalid question output structure from Gemini model');
    }

    return {
      question: parsedData.question.trim(),
      category: isFollowUp ? 'Probing Follow-Up' : (parsedData.category || 'Interview Question'),
      hint: parsedData.hint || `Difficulty level: ${difficulty}. Include practical examples.`,
      difficulty,
      isFollowUp: Boolean(isFollowUp),
    };
  } catch (error) {
    console.error('Gemini Single Question Generator Error:', error.message);
    return getFallbackQuestion(type, difficulty, previousQuestions);
  }
};
