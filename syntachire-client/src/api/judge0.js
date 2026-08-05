import axios from "axios";

const JUDGE0_KEY =
  import.meta.env.VITE_JUDGE0_KEY ||
  process.env.REACT_APP_JUDGE0_KEY ||
  "34010cd7a8mshb9bbc571bddbbd8p1a5d68jsn0c0a17bd1bcb";

const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";
const PUBLIC_JUDGE0_URL = "https://ce.judge0.com/submissions?wait=true&fields=*";

/**
 * Execute source code using Judge0 API with automatic fallback to public endpoint
 * @param {string} sourceCode - Code string to execute
 * @param {number} languageId - Judge0 Language ID
 * @param {string} stdin - Custom input parameters
 * @returns {Promise<Object>} Execution result
 */
export const executeCode = async (sourceCode, languageId, stdin = "") => {
  // 1. Try RapidAPI first if key is present
  if (JUDGE0_KEY) {
    try {
      const response = await axios.post(
        `https://${RAPIDAPI_HOST}/submissions?wait=true&fields=*`,
        {
          source_code: sourceCode,
          language_id: languageId,
          stdin: stdin,
        },
        {
          headers: {
            "x-rapidapi-key": JUDGE0_KEY,
            "x-rapidapi-host": RAPIDAPI_HOST,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      // Check if RapidAPI returned a subscription error inside 200 payload
      if (response.data?.message?.includes("not subscribed")) {
        throw new Error("RapidAPI Subscription Required");
      }

      return response.data;
    } catch (rapidErr) {
      console.warn("RapidAPI Judge0 failed or not subscribed. Switching to public Judge0 server...", rapidErr.message);
      // Fall through to public endpoint fallback below
    }
  }

  // 2. Fallback to official public Judge0 CE server (Free, no subscription required!)
  try {
    const response = await axios.post(
      PUBLIC_JUDGE0_URL,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    return response.data;
  } catch (publicErr) {
    console.error("Public Judge0 API Execution Error:", publicErr);
    throw new Error(
      publicErr.response?.data?.message ||
        publicErr.message ||
        "Failed to execute code on Judge0 compiler server."
    );
  }
};
