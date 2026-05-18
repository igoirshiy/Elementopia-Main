import axios from "axios";

// const API_URL = "http://localhost:8080/api/achievement";
const API_URL = "http://localhost:8080/api/achievement";

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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
      }
    } catch (e) {
      console.warn("Error parsing user token for AchievementService:", e);
    }
  }
  return {};
};

const AchievementService = {
  // Get All Achievements
  getAllAchievements: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get all achievements:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get Achievement by ID
  getAchievementById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get achievement by ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get Achievements by User
  getAchievementsByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get user achievements:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create Achievement
  createAchievement: async (userId, data) => {
    try {
      const headers = getAuthHeader();
      console.log("Auth Headers:", headers); // Debug

      const response = await axios.post(`${API_URL}/create/${userId}`, data, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(
        "Failed to create achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update Achievement
  updateAchievement: async (id, achievementData) => {
    try {
      const response = await axios.put(
        `${API_URL}/update/${id}`,
        achievementData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to update achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete Achievement
  deleteAchievement: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to delete achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default AchievementService;
