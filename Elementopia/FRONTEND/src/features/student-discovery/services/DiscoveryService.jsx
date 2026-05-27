// Cloud-Syncing DiscoveryService with Local Storage Fallback
const LOCAL_STORAGE_KEY = "elementopia_discoveries";
const BASE_URL = "http://localhost:8080/api/discoveries";

const getLocalDiscoveries = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalDiscoveries = (discoveries) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(discoveries));
};

const DiscoveryService = {
  // Fetch all discoveries (Attempts cloud, fallbacks locally)
  getAllDiscoveries: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Backend down. Fetching all discoveries from local storage:", e);
    }
    return getLocalDiscoveries();
  },

  // Fetch a discovery by its ID (Attempts cloud, fallbacks locally)
  getDiscoveryById: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Backend down. Fetching discovery by ID from local storage:", e);
    }
    const discoveries = getLocalDiscoveries();
    return discoveries.find((d) => d.id === id) || null;
  },

  // Fetch discoveries for a specific user (Attempts cloud, fallbacks locally)
  getDiscoveriesByUserId: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      if (response.ok) {
        const cloudData = await response.json();
        // Sync local storage with latest cloud discoveries to keep cache hot
        saveLocalDiscoveries(cloudData);
        return cloudData;
      }
    } catch (e) {
      console.warn("Backend down. Fetching discoveries by userId from local storage:", e);
    }
    return getLocalDiscoveries();
  },

  // Create a new discovery (Attempts cloud, fallbacks locally)
  createDiscovery: async (userId, discoveryData) => {
    console.log("Creating discovery for user:", userId, discoveryData);
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          name: discoveryData.name,
          dateDiscovered: discoveryData.dateDiscovered || new Date().toLocaleDateString(),
          submissionString: discoveryData.submissionString
        })
      });
      if (response.ok) {
        const cloudDiscovery = await response.json();
        // Also save locally as a warm cache fallback
        const discoveries = getLocalDiscoveries();
        const exists = discoveries.find(d => d.name === discoveryData.name);
        if (!exists) {
            discoveries.push(cloudDiscovery);
            saveLocalDiscoveries(discoveries);
        }
        return cloudDiscovery;
      }
    } catch (e) {
      console.warn("Backend down. Creating discovery locally:", e);
    }

    // Local fallback
    const discoveries = getLocalDiscoveries();
    const newDiscovery = {
      id: Date.now().toString(),
      userId: userId,
      ...discoveryData,
      dateDiscovered: discoveryData.dateDiscovered || new Date().toLocaleDateString()
    };
    
    const exists = discoveries.find(d => d.name === discoveryData.name);
    if (!exists) {
        discoveries.push(newDiscovery);
        saveLocalDiscoveries(discoveries);
    }
    
    return newDiscovery;
  },

  // Update an existing discovery
  updateDiscovery: async (id, updatedData) => {
    // Primarily used locally in sandbox, we'll run locally and return
    const discoveries = getLocalDiscoveries();
    const index = discoveries.findIndex((d) => d.id === id);
    if (index !== -1) {
      discoveries[index] = { ...discoveries[index], ...updatedData };
      saveLocalDiscoveries(discoveries);
      return discoveries[index];
    }
    throw new Error("Discovery not found");
  },

  // Delete a discovery (Attempts cloud, fallbacks locally)
  deleteDiscovery: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        let discoveries = getLocalDiscoveries();
        discoveries = discoveries.filter((d) => d.id !== id);
        saveLocalDiscoveries(discoveries);
        return { success: true };
      }
    } catch (e) {
      console.warn("Backend down. Deleting discovery locally:", e);
    }

    let discoveries = getLocalDiscoveries();
    discoveries = discoveries.filter((d) => d.id !== id);
    saveLocalDiscoveries(discoveries);
    return { success: true };
  },

  // Get all discoveries for the logged-in user (Attempts cloud, fallbacks locally)
  getCurrentUserDiscoveries: async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}`);
      if (response.ok) {
        const cloudData = await response.json();
        saveLocalDiscoveries(cloudData);
        return { data: cloudData };
      }
    } catch (e) {
      console.warn("Backend down. Fetching current user discoveries from local storage:", e);
    }
    return { data: getLocalDiscoveries() };
  },
};

export default DiscoveryService;
