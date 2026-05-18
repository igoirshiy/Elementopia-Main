import axios from "axios";

const API_URL = "http://localhost:8080/api/discoveries";
// const API_URL = "http://localhost:8080/api/discoveries";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage!");
    throw new Error("Authorization token is missing.");
  }
  return { Authorization: `Bearer ${token}` };
};

const DiscoveryService = {
  // Fetch all discoveries (admin/global view)
  getAllDiscoveries: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch all discoveries:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Fetch a discovery by its ID
  getDiscoveryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch discovery with ID ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Fetch discoveries for a specific user
  getDiscoveriesByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/getByUser/${userId}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to fetch discoveries for user ${userId}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create a new discovery (user-generated compound)
  createDiscovery: async (userId, discoveryData) => {
    console.log("Creating discovery for user:", userId);
    try {
      const response = await axios.post(
        `${API_URL}/create/${userId}`,
        discoveryData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to create discovery:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update an existing discovery
  updateDiscovery: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/update/${id}`, updatedData, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to update discovery ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a discovery
  deleteDiscovery: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        `Failed to delete discovery ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get all discoveries for the logged-in user
  getCurrentUserDiscoveries: async (userId) => {
    const token = localStorage.getItem("token");

    const authHeader = {
      Authorization: `Bearer ${token}`,
    };

    return axios.get(`${API_URL}/getByUser/${userId}`, {
      headers: authHeader,
    });
  },
};

export default DiscoveryService;
