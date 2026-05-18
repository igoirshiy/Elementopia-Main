import axios from "axios";

// const API_URL = "http://localhost:8080/api/labs";
const API_URL = "http://localhost:8080/api/labs";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found!");
    throw new Error("Authorization token is missing.");
  }
  return { Authorization: `Bearer ${token}` };
};

const LabService = {
  // Fetch all labs
  getAllLab: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch all laboratories",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get a lab by its labCode
  getLabByCode: async (labCode) => {
    try {
      const response = await axios.get(`${API_URL}/${labCode}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch lab with code ${labCode}`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create a new lab
  createLab: async (labData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, labData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to create lab",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Add a student to a lab
  addStudentToLab: async (labCode, studentId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${labCode}/add-student`,
        null,
        {
          params: { studentId },
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Failed to add student ${studentId} to lab ${labCode}`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a lab by ID
  deleteLab: async (labId) => {
    try {
      await axios.delete(`${API_URL}/${labId}`, {
        headers: getAuthHeader(),
      });
    } catch (error) {
      console.error(
        `Failed to delete lab with ID ${labId}`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default LabService;
