const LOCAL_STORAGE_KEY = "elementopia_discoveries";

const getLocalDiscoveries = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalDiscoveries = (discoveries) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(discoveries));
};

const DiscoveryService = {
  // Fetch all discoveries (admin/global view)
  getAllDiscoveries: async () => {
    return getLocalDiscoveries();
  },

  // Fetch a discovery by its ID
  getDiscoveryById: async (id) => {
    const discoveries = getLocalDiscoveries();
    return discoveries.find((d) => d.id === id) || null;
  },

  // Fetch discoveries for a specific user
  getDiscoveriesByUserId: async (userId) => {
    return getLocalDiscoveries();
  },

  // Create a new discovery (user-generated compound)
  createDiscovery: async (userId, discoveryData) => {
    console.log("Creating discovery locally for user:", userId);
    const discoveries = getLocalDiscoveries();
    const newDiscovery = {
      id: Date.now(),
      userId: userId,
      ...discoveryData
    };
    
    // Avoid duplicates
    const exists = discoveries.find(d => d.name === discoveryData.name);
    if (!exists) {
        discoveries.push(newDiscovery);
        saveLocalDiscoveries(discoveries);
    }
    
    return newDiscovery;
  },

  // Update an existing discovery
  updateDiscovery: async (id, updatedData) => {
    const discoveries = getLocalDiscoveries();
    const index = discoveries.findIndex((d) => d.id === id);
    if (index !== -1) {
      discoveries[index] = { ...discoveries[index], ...updatedData };
      saveLocalDiscoveries(discoveries);
      return discoveries[index];
    }
    throw new Error("Discovery not found");
  },

  // Delete a discovery
  deleteDiscovery: async (id) => {
    let discoveries = getLocalDiscoveries();
    discoveries = discoveries.filter((d) => d.id !== id);
    saveLocalDiscoveries(discoveries);
    return { success: true };
  },

  // Get all discoveries for the logged-in user
  getCurrentUserDiscoveries: async (userId) => {
    return { data: getLocalDiscoveries() };
  },
};

export default DiscoveryService;
