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
  You are an expert technical and HR interviewer evaluating a candidate for a "${targetRole}" position at "${difficulty}" difficulty level in a "${type.toUpperCase()}" interview round.

  Interview Question:
  "${question}"

  Candidate Response:
  "${answer}"

  Evaluate the response thoroughly and return a valid JSON object with the following schema:
  - score: An integer score from 0 to 100 based on overall technical accuracy, clarity, depth, relevance, and completeness.
  - technicalScore: An integer score from 0 to 100 reflecting technical knowledge and correctness.
  - problemSolvingScore: An integer score from 0 to 100 reflecting problem solving and structure.
  - communicationScore: An integer score from 0 to 100 reflecting clarity, tone, and confidence.
  - relevanceScore: An integer score from 0 to 100 showing how well the answer addressed the exact question.
  - confidenceScore: An integer score from 0 to 100 reflecting the candidate's confidence and delivery.
  - timeManagementScore: An integer score from 0 to 100 reflecting pacing and concise coverage.
  - strengths: An array of strings highlighting strong points in the answer.
  - weaknesses: An array of strings highlighting weak areas or inaccuracies.
  - missingPoints: An array of key technical concepts, STAR points, or trade-offs that were omitted.
  - aiFeedback: A concise feedback summary for the candidate.
  - idealAnswer: A concise exemplary response demonstrating ideal structure and technical depth.
  - followUpQuestion: A logical follow-up question to probe deeper into the candidate's knowledge.

  Additional instructions:
  1. If the answer is too short, contains only random characters, or does not meaningfully address the question, assign a score below 60 and clearly note that the response is not sufficient.
  2. If the answer repeats unrelated words, use the actual technical or situational quality; do not reward gibberish.
  3. Provide feedback that is clearly distinct for each answer based on the candidate’s response quality.
  4. Keep all output strictly valid JSON without markdown code fences.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Query Gemini model
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            score: { type: 'INTEGER' },
            strengths: { type: 'ARRAY', items: { type: 'STRING' } },
            weaknesses: { type: 'ARRAY', items: { type: 'STRING' } },
            missingPoints: { type: 'ARRAY', items: { type: 'STRING' } },
            idealAnswer: { type: 'STRING' },
            followUpQuestion: { type: 'STRING' },
          },
          required: [
            'score',
            'strengths',
            'weaknesses',
            'missingPoints',
            'idealAnswer',
            'followUpQuestion',
          ],
        },
      },
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);

    return {
      score: Number(parsedData.score) || 80,
      technicalScore: Number(parsedData.technicalScore) || 0,
      problemSolvingScore: Number(parsedData.problemSolvingScore) || 0,
      communicationScore: Number(parsedData.communicationScore) || 0,
      relevanceScore: Number(parsedData.relevanceScore) || 0,
      confidenceScore: Number(parsedData.confidenceScore) || 0,
      timeManagementScore: Number(parsedData.timeManagementScore) || 0,
      strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [parsedData.strengths],
      weaknesses: Array.isArray(parsedData.weaknesses) ? parsedData.weaknesses : [parsedData.weaknesses],
      missingPoints: Array.isArray(parsedData.missingPoints) ? parsedData.missingPoints : [parsedData.missingPoints],
      aiFeedback: parsedData.aiFeedback || parsedData.idealAnswer || '',
      idealAnswer: parsedData.idealAnswer || '',
      followUpQuestion: parsedData.followUpQuestion || '',
    };
  } catch (error) {
    console.error('Gemini API Evaluation Error:', error.message);
    
    // Try fallback REST API call or heuristic fallback
    return await fallbackGeminiRestCall(apiKey, prompt).catch(() =>
      getFallbackEvaluation(question, answer)
    );
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
