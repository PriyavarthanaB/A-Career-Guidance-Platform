const { GoogleGenAI } = require('@google/genai');

const isLikelyGibberishAnswer = (answer) => {
  if (!answer || !answer.trim()) return true;
  const normalized = answer.trim();
  const wordCount = normalized.split(/\s+/).length;
  const onlyDigits = /^\d+$/u.test(normalized);
  const onlyShortTokens = /^[a-zA-Z0-9]{1,4}(\s+[a-zA-Z0-9]{1,4})*$/u.test(normalized);
  const repeated123 = /^(123+|\d+\s*123+|\s*123+)$/i.test(normalized);
  const noiseLike = /^[^a-zA-Z]*$/u.test(normalized);
  return onlyDigits || repeated123 || noiseLike || wordCount < 4 || onlyShortTokens;
};

/**
 * Evaluates candidate interview response using Google Gemini API
 * 
 * @param {Object} params
 * @param {string} params.question - The interview question asked
 * @param {string} params.answer - Candidate's spoken or typed answer
 * @param {string} [params.targetRole] - Target job role (e.g. Full Stack Developer)
 * @param {string} [params.difficulty] - Easy, Medium, or Hard
 * @param {string} [params.type] - hr, technical, or mixed
 * 
 * @returns {Promise<Object>} JSON containing score, strengths, weaknesses, missingPoints, idealAnswer, followUpQuestion
 */
/**
 * Validates and normalizes Gemini AI evaluation object structure
 */
const validateAndNormalizeEvaluation = (parsedData) => {
  const clampScore = (val, fallback = 70) => {
    const num = Number(val);
    if (isNaN(num)) return fallback;
    return Math.min(100, Math.max(0, Math.round(num)));
  };

  const toArray = (val) => {
    if (Array.isArray(val)) return val.map((s) => String(s).trim()).filter(Boolean);
    if (typeof val === 'string' && val.trim()) return [val.trim()];
    return [];
  };

  const score = clampScore(parsedData.score, 75);

  const strengths = toArray(parsedData.strengths);
  if (strengths.length === 0) strengths.push('Delivered a relevant response addressing the core question.');

  const weaknesses = toArray(parsedData.weaknesses);
  if (weaknesses.length === 0) weaknesses.push('Could provide more concrete production metrics or trade-off examples.');

  const missingConcepts = toArray(parsedData.missingConcepts || parsedData.missingPoints);
  if (missingConcepts.length === 0) missingConcepts.push('Explicit edge-case handling or failure mode mitigation.');

  const improvementFeedback = (parsedData.improvementFeedback || parsedData.aiFeedback || parsedData.idealAnswer || '').trim() ||
    'Focus on structuring answers with clear technical trade-offs and practical examples.';

  const idealAnswer = (parsedData.idealAnswer || '').trim() ||
    'An ideal response addresses the core requirements, explains technical decisions, highlights trade-offs, and details edge cases.';

  // All 7 evaluation dimensions
  const technicalKnowledgeScore = clampScore(parsedData.technicalKnowledgeScore, score);
  const correctnessScore       = clampScore(parsedData.correctnessScore, score);
  const problemSolvingScore    = clampScore(parsedData.problemSolvingScore, score);
  const communicationScore     = clampScore(parsedData.communicationScore, score);
  const relevanceScore         = clampScore(parsedData.relevanceScore, score);
  const confidenceScore        = clampScore(parsedData.confidenceScore, score);
  const timeManagementScore    = clampScore(parsedData.timeManagementScore, score);

  return {
    score,
    // 7-dimension scores
    technicalKnowledgeScore,
    correctnessScore,
    problemSolvingScore,
    communicationScore,
    relevanceScore,
    confidenceScore,
    timeManagementScore,
    // Legacy aliases kept for backward-compat
    technicalScore: technicalKnowledgeScore,
    technicalDepthScore: technicalKnowledgeScore,
    completenessScore: correctnessScore,
    strengths,
    weaknesses,
    missingConcepts,
    missingPoints: missingConcepts,
    improvementFeedback,
    aiFeedback: improvementFeedback,
    idealAnswer,
    followUpQuestion: (parsedData.followUpQuestion || '').trim() || 'How would you monitor and test this in production?',
  };
};

/**
 * Evaluates candidate interview response using Google Gemini API
 * 
 * @param {Object} params
 * @param {string} params.question - The interview question asked
 * @param {string} params.answer - Candidate's spoken or typed answer
 * @param {string} [params.targetRole] - Target job role (e.g. Full Stack Developer)
 * @param {string} [params.difficulty] - Easy, Medium, or Hard
 * @param {string} [params.type] - hr, technical, behavioral, or mixed
 * 
 * @returns {Promise<Object>} Evaluated and validated evaluation object
 */
exports.evaluateAnswerWithGemini = async ({
  question,
  answer,
  targetRole = 'Full Stack Software Developer',
  difficulty = 'Medium',
  type = 'mixed',
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (isLikelyGibberishAnswer(answer)) {
    return getFallbackEvaluation(question, answer);
  }

  if (!apiKey) {
    console.warn('GEMINI_API_KEY missing. Falling back to default evaluation format.');
    return getFallbackEvaluation(question, answer);
  }

  const prompt = `
  You are an expert technical and HR interviewer evaluating a candidate's response for a "${targetRole}" position at "${difficulty}" difficulty level during a "${type.toUpperCase()}" interview round.

  Interview Question:
  "${question}"

  Candidate Response:
  "${answer}"

  EVALUATION CRITERIA (score each from 0-100):
  1. Technical Knowledge: Accuracy, correctness, and domain-specific knowledge demonstrated
  2. Correctness: Is the core information accurate and free of factual errors?
  3. Problem Solving: Logical thinking, decomposition, trade-offs, and edge case awareness
  4. Communication: Clarity, structure, STAR format (for behavioral), vocabulary, and coherence
  5. Relevance: Does the response directly and completely address the exact question asked?
  6. Confidence & Clarity: Decisiveness, conviction, and clarity of delivery
  7. Time Management: Was the response concise and well-paced (not too brief or too verbose)?

  OUTPUT REQUIREMENT:
  Return a strictly valid JSON object matching this schema:
  {
    "score": <overall integer score 0-100>,
    "technicalKnowledgeScore": <integer 0-100>,
    "correctnessScore": <integer 0-100>,
    "problemSolvingScore": <integer 0-100>,
    "communicationScore": <integer 0-100>,
    "relevanceScore": <integer 0-100>,
    "confidenceScore": <integer 0-100>,
    "timeManagementScore": <integer 0-100>,
    "strengths": [<array of strings listing clear strengths>],
    "weaknesses": [<array of strings listing weak points or inaccuracies>],
    "missingConcepts": [<array of strings listing missing technical concepts or trade-offs>],
    "improvementFeedback": "<short, actionable improvement feedback summary>",
    "idealAnswer": "<concise exemplary answer demonstrating ideal structure>",
    "followUpQuestion": "<logical follow-up question to probe deeper>"
  }

  Do NOT include any markdown code blocks (e.g. \`\`\`json). Return pure JSON only.
  `;

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
            score:                   { type: 'INTEGER' },
            technicalKnowledgeScore: { type: 'INTEGER' },
            correctnessScore:        { type: 'INTEGER' },
            problemSolvingScore:     { type: 'INTEGER' },
            communicationScore:      { type: 'INTEGER' },
            relevanceScore:          { type: 'INTEGER' },
            confidenceScore:         { type: 'INTEGER' },
            timeManagementScore:     { type: 'INTEGER' },
            strengths:               { type: 'ARRAY', items: { type: 'STRING' } },
            weaknesses:              { type: 'ARRAY', items: { type: 'STRING' } },
            missingConcepts:         { type: 'ARRAY', items: { type: 'STRING' } },
            improvementFeedback:     { type: 'STRING' },
            idealAnswer:             { type: 'STRING' },
            followUpQuestion:        { type: 'STRING' },
          },
          required: [
            'score',
            'technicalKnowledgeScore',
            'correctnessScore',
            'problemSolvingScore',
            'communicationScore',
            'relevanceScore',
            'confidenceScore',
            'timeManagementScore',
            'strengths',
            'weaknesses',
            'missingConcepts',
            'improvementFeedback',
            'idealAnswer',
          ],
        },
      },
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);

    // Validate structured JSON response before returning/saving
    return validateAndNormalizeEvaluation(parsedData);
  } catch (error) {
    console.error('Gemini API Evaluation Error:', error.message);
    
    return await fallbackGeminiRestCall(apiKey, prompt).catch(() =>
      getFallbackEvaluation(question, answer)
    );
  }
};

/**
 * Generates a comprehensive final interview evaluation report using Gemini AI
 * 
 * @param {Object} params
 * @param {string} params.targetRole - Target job role
 * @param {string} params.type - Round type (hr, technical, behavioral, mixed)
 * @param {string} params.difficulty - Interview difficulty level
 * @param {number} params.overallScore - Calculated overall performance score
 * @param {Object} params.categoryScores - { technical, problemSolving, communication, relevance, timeManagement }
 * @param {Array} params.questions - Array of question evaluation objects
 * @param {Array<string>} params.strongestTopics - Pre-aggregated strongest topics
 * @param {Array<string>} params.weakestTopics - Pre-aggregated weakest topics
 * 
 * @returns {Promise<Object>} Final report JSON { summary, personalizedFeedback, recommendedTopics, strongestTopics, weakestTopics }
 */
exports.generateFinalReportWithGemini = async ({
  targetRole = 'Full Stack Software Developer',
  type = 'mixed',
  difficulty = 'Medium',
  overallScore = 80,
  categoryScores = {},
  questions = [],
  strongestTopics = [],
  weakestTopics = [],
}) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const defaultReport = {
    summary: `Candidate completed the ${type.toUpperCase()} interview round for ${targetRole} with an overall score of ${overallScore}%.`,
    personalizedFeedback: `Demonstrated good foundational knowledge in ${targetRole}. To reach senior competency, focus on deepening system architecture trade-offs, structured STAR delivery, and edge-case handling.`,
    recommendedTopics: Array.isArray(weakestTopics) && weakestTopics.length > 0
      ? weakestTopics
      : ['System Design & Scalability', 'Advanced Data Structures & Algorithms', 'STAR Behavioral Metrics & Impact'],
    strongestTopics: Array.isArray(strongestTopics) && strongestTopics.length > 0
      ? strongestTopics
      : ['Core Software Concepts', 'Problem Decomposition'],
    weakestTopics: Array.isArray(weakestTopics) && weakestTopics.length > 0
      ? weakestTopics
      : ['Distributed Caching & Indexing', 'STAR Quantifiable Results'],
  };

  if (!apiKey) {
    return defaultReport;
  }

  const questionSummaries = questions.map((q, idx) => `
  Q${idx + 1} [${q.category || 'Topic'} - Score: ${q.score}%]:
  - Question: "${q.question}"
  - Answer: "${(q.userAnswer || '').slice(0, 200)}"
  - Strengths: ${Array.isArray(q.strengths) ? q.strengths.join('; ') : 'None'}
  - Weaknesses: ${Array.isArray(q.weaknesses) ? q.weaknesses.join('; ') : 'None'}
  - Omitted Concepts: ${Array.isArray(q.missingPoints) ? q.missingPoints.join('; ') : 'None'}
  `).join('\n');

  const prompt = `
  You are an executive engineering manager and interview evaluation specialist synthesizing a final performance report for a candidate who completed a "${type.toUpperCase()}" mock interview for a "${targetRole}" position at "${difficulty}" difficulty level.

  PERFORMANCE METRICS:
  - Overall Score: ${overallScore}%
  - Technical Knowledge Score: ${categoryScores.technical || 0}%
  - Problem Solving Score: ${categoryScores.problemSolving || 0}%
  - Communication Score: ${categoryScores.communication || 0}%
  - Relevance Score: ${categoryScores.relevance || 0}%
  - Time Management Score: ${categoryScores.timeManagement || 0}%

  CANDIDATE QUESTION PERFORMANCE BREAKDOWN:
  ${questionSummaries || 'No question details available.'}

  TASK:
  Synthesize a professional, constructive, and highly personalized interview completion report in valid JSON format.

  Return ONLY a valid JSON object matching this schema:
  {
    "summary": "<1-2 sentence executive overview summary of performance>",
    "personalizedFeedback": "<Detailed personalized feedback paragraph addressing strengths, growth areas, technical depth, and actionable advice>",
    "strongestTopics": [<array of 2 to 4 strongest technical or behavioral topics demonstrated by candidate>],
    "weakestTopics": [<array of 2 to 4 weakest topics or skill gaps needing work>],
    "recommendedTopics": [<array of 3 to 5 specific recommended learning topics, frameworks, or practice concepts>]
  }

  Return pure JSON text only without markdown code blocks.
  `;

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
            summary: { type: 'STRING' },
            personalizedFeedback: { type: 'STRING' },
            strongestTopics: { type: 'ARRAY', items: { type: 'STRING' } },
            weakestTopics: { type: 'ARRAY', items: { type: 'STRING' } },
            recommendedTopics: { type: 'ARRAY', items: { type: 'STRING' } },
          },
          required: ['summary', 'personalizedFeedback', 'strongestTopics', 'weakestTopics', 'recommendedTopics'],
        },
      },
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);

    return {
      summary: parsedData.summary || defaultReport.summary,
      personalizedFeedback: parsedData.personalizedFeedback || defaultReport.personalizedFeedback,
      strongestTopics: Array.isArray(parsedData.strongestTopics) && parsedData.strongestTopics.length ? parsedData.strongestTopics : defaultReport.strongestTopics,
      weakestTopics: Array.isArray(parsedData.weakestTopics) && parsedData.weakestTopics.length ? parsedData.weakestTopics : defaultReport.weakestTopics,
      recommendedTopics: Array.isArray(parsedData.recommendedTopics) && parsedData.recommendedTopics.length ? parsedData.recommendedTopics : defaultReport.recommendedTopics,
    };
  } catch (error) {
    console.error('Gemini Final Report Generation Error:', error.message);
    return defaultReport;
  }
};

/**
 * Fallback REST API call if SDK model name differs
 */
async function fallbackGeminiRestCall(apiKey, prompt) {
  const fetch = globalThis.fetch || require('node-fetch');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanJson = text.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleanJson);

  return {
    score: Number(parsed.score) || 82,
    technicalScore: Number(parsed.technicalScore) || 0,
    problemSolvingScore: Number(parsed.problemSolvingScore) || 0,
    communicationScore: Number(parsed.communicationScore) || 0,
    relevanceScore: Number(parsed.relevanceScore) || 0,
    confidenceScore: Number(parsed.confidenceScore) || 0,
    timeManagementScore: Number(parsed.timeManagementScore) || 0,
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    missingPoints: parsed.missingPoints || [],
    aiFeedback: parsed.aiFeedback || parsed.idealAnswer || '',
    idealAnswer: parsed.idealAnswer || '',
    followUpQuestion: parsed.followUpQuestion || '',
  };
}

/**
 * Heuristic fallback if API key or network fails
 */
function getFallbackEvaluation(question, answer) {
  const normalizedAnswer = (answer || '').trim();
  const wordCount = normalizedAnswer ? normalizedAnswer.split(/\s+/).length : 0;
  const isGibberish = /^(\d+|[a-zA-Z]\d+|123+|\W+)$/i.test(normalizedAnswer) || wordCount < 4;
  let score;

  if (isGibberish) {
    score = 45;
  } else {
    score = Math.min(88, Math.max(55, 60 + Math.floor(wordCount / 6)));
  }

  return {
    score,
    technicalScore: isGibberish ? 35 : Math.min(90, Math.max(40, 55 + Math.floor(wordCount / 6))),
    problemSolvingScore: isGibberish ? 35 : Math.min(90, Math.max(40, 55 + Math.floor(wordCount / 7))),
    communicationScore: isGibberish ? 30 : Math.min(90, Math.max(40, 58 + Math.floor(wordCount / 8))),
    relevanceScore: isGibberish ? 30 : Math.min(90, Math.max(40, 60 + Math.floor(wordCount / 9))),
    confidenceScore: isGibberish ? 35 : Math.min(90, Math.max(40, 55 + Math.floor(wordCount / 10))),
    timeManagementScore: isGibberish ? 40 : Math.min(90, Math.max(45, 60 + Math.floor(wordCount / 12))),
    strengths: isGibberish
      ? ['Attempted an answer, but the response was too short or not directly relevant.']
      : ['Delivered a response with some structure and useful keywords.'],
    weaknesses: isGibberish
      ? ['Response did not meaningfully address the question. Please answer with full sentences and examples.']
      : ['Could add more concrete examples and explicit trade-offs.'],
    missingPoints: isGibberish
      ? ['Meaningful answer structure with complete sentences.', 'Directly answer the question asked.']
      : ['Specific technical metrics or examples.', 'Clear mention of edge cases, risks, or alternatives.'],
    aiFeedback: isGibberish
      ? 'This response is too brief or not focused enough. Try answering the question directly with clear examples and structure.'
      : 'Strong response structure, but add more detail on edge cases and trade-offs for a higher score.',
    idealAnswer: isGibberish
      ? 'A strong answer explains the steps you would take, why you made those choices, and what outcomes you expect.'
      : 'An ideal answer explains the problem context, chosen approach, key trade-offs, and supporting examples clearly.',
    followUpQuestion: isGibberish
      ? 'Can you provide a more complete answer that directly addresses the question asked?'
      : 'What additional edge case or failure mode would you consider for this solution?',
  };
}
