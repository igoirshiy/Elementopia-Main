import axios from "axios";

// const BASE_URL = "http://localhost:8080/api";
const BASE_URL = "http://localhost:8080/api/";

const getAuthHeader = () => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);

      // Handle case where userObj is the token string itself, or an object with a .token field
      const token =
        userObj.token || (typeof userObj === "string" ? userObj : null);

      if (token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      }
    } catch (e) {
      console.warn("Error parsing user token:", e);
    }
  }
  return {}; // Return empty if no token found
};

const LessonService = {
  // Called by Map-Tree.jsx to save progress
  saveLessonProgress: async (payload) => {
    try {
      console.log("📡 Sending Progress Payload:", payload);
      // Endpoint: /api/lesson-scores
      const response = await axios.post(
        `${BASE_URL}/lesson-scores`,
        payload,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Save Progress Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Called to color the map nodes (Green/Locked)
  getAllScores: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/lesson-scores`,
        getAuthHeader()
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Fetch Scores Error:", error);
      return [];
    }
  },

  // Get total career score
  getStudentScores: async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/score/${userId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch career scores:", error);
      throw error;
    }
  },

  getAllLessons: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/lessons/getAll`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all lessons:", error);
      throw error;
    }
  },

  getLessonById: async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/lessons/get/${id}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch lesson ${id}:`, error);
      throw error;
    }
  },

  createLesson: async (lessonData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/lessons/create`,
        lessonData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create lesson:", error);
      throw error;
    }
  },

  addTopic: async (lessonId, topicData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/lessons/${lessonId}/addTopic`,
        topicData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add topic:", error);
      throw error;
    }
  },

  updateTopic: async (lessonId, topicId, updatedTopicData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/update`,
        updatedTopicData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update topic:", error);
      throw error;
    }
  },

  deleteTopic: async (lessonId, topicId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/delete`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete topic:", error);
      throw error;
    }
  },

  addSubtopic: async (lessonId, topicId, subtopicData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/add-subtopic`,
        subtopicData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add subtopic:", error);
      throw error;
    }
  },

  updateSubtopic: async (
    lessonId,
    topicId,
    subtopicId,
    updatedSubtopicData
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/subtopic/${subtopicId}/update`,
        updatedSubtopicData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update subtopic:", error);
      throw error;
    }
  },

  deleteSubtopic: async (lessonId, topicId, subtopicId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/subtopic/${subtopicId}/delete`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete subtopic:", error);
      throw error;
    }
  },
};

export default LessonService;
