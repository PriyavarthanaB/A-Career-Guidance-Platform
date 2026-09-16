import API from "./axios";

// Fetch role-specific learning roadmap data
export const getRoleRoadmap = async (role = "") => {
  try {
    const url = role ? `/api/roadmap?role=${encodeURIComponent(role)}` : "/api/roadmap";
    const res = await API.get(url);
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch role roadmap:", err);
    throw err;
  }
};

// Fetch list of all available job roles
export const getAvailableRoles = async () => {
  try {
    const res = await API.get("/api/roadmap/roles");
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch available roles:", err);
    throw err;
  }
};
