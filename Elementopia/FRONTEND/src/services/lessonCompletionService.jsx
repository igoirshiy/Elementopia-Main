import axios from "axios";

const API_URL = "http://localhost:8080/api/lesson-completion";
// const API_URL = "http://localhost:8080/api/lesson-completion";

const getAuthHeader = () => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
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
      console.warn("Error parsing user token for LessonCompletionService:", e);
    }
  }
  return {};
};

const LessonCompletionService = {
  // Complete a lesson (POST /complete)
  completeLesson: async (studentId, lessonId) => {
    try {
      const completionData = { studentId, lessonId };

      const response = await axios.post(
        `${API_URL}/complete`,
        completionData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to complete lesson:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get all completions for a user (GET /user/{studentId})
  getUserCompletions: async (studentId) => {
    try {
      const response = await axios.get(
        `${API_URL}/user/${studentId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch user completions:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a completion record (DELETE /delete/{id})
  deleteCompletion: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/delete/${id}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to delete completion:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default LessonCompletionService;
