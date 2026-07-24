import API from "./axios";

/**
 * Fetch all coding modules from the backend
 * @returns {Promise<Array>} List of coding modules
 */
export const getModules = async () => {
  const response = await API.get("/api/modules");
  return response.data.data;
};

/**
 * Fetch a single coding module by ID
 * @param {string} id - The MongoDB ObjectID of the module
 * @returns {Promise<Object>} The coding module details
 */
export const getModuleById = async (id) => {
  const response = await API.get(`/api/modules/${id}`);
  return response.data.data;
};

/**
 * Fetch detailed theory for a specific coding module, including adjacent module navigation
 * @param {string} id - The MongoDB ObjectID of the module
 * @returns {Promise<Object>} Object containing target module theory and adjacent IDs
 */
export const getModuleTheory = async (id) => {
  const response = await API.get(`/api/modules/${id}/theory`);
  return response.data.data;
};

/**
 * Fetch all coding problems associated with a specific module ID
 * @param {string} moduleId - The MongoDB ObjectID of the module
 * @returns {Promise<Array>} List of problems
 */
export const getProblemsByModule = async (moduleId) => {
  const response = await API.get(`/api/problems/module/${moduleId}`);
  return response.data.data;
};

/**
 * Fetch a single coding problem by ID from the database
 * @param {string} id - The MongoDB ObjectID of the problem
 * @returns {Promise<Object>} The coding problem details
 */
export const getProblemById = async (id) => {
  const response = await API.get(`/api/problems/${id}`);
  return response.data.data;
};

/**
 * Toggle the bookmark state of a coding problem
 * @param {string} problemId - The MongoDB ObjectID of the problem
 * @returns {Promise<Object>} The updated problem object
 */
export const toggleProblemBookmark = async (problemId) => {
  const response = await API.patch(`/api/problems/${problemId}/bookmark`);
  return response.data.data;
};

/**
 * Toggle/Update the solved status of a coding problem
 * @param {string} problemId - The MongoDB ObjectID of the problem
 * @param {string} status - 'solved' or 'unsolved'
 * @returns {Promise<Object>} The updated problem object
 */
export const updateProblemStatus = async (problemId, status) => {
  const response = await API.patch(`/api/problems/${problemId}`, { status });
  return response.data;
};
