import { API_BASE_URL } from "@/config/apiConfig";

// Cloud-Syncing DiscoveryService with Local Storage Fallback
const LOCAL_STORAGE_KEY = "elementopia_discoveries";
const BASE_URL = `${API_BASE_URL}/api/discoveries`;

export const normalizeDiscovery = (d) => {
  if (!d) return d;
  let source = d.source;
  let symbol = d.symbol || d.Symbol || "";

  if (d.submissionString) {
    if (d.submissionString.startsWith("sandbox:")) {
      source = "sandbox";
      symbol = symbol || d.submissionString.replace("sandbox:", "");
    } else if (d.submissionString.startsWith("domain:")) {
      source = "domain";
      symbol = symbol || d.submissionString.replace("domain:", "");
    } else {
      symbol = symbol || d.submissionString;
    }
  }

  if (!source) {
    source = "domain";
  }

  return {
    ...d,
    source,
    symbol: symbol || d.symbol || ""
  };
};

export const getLocalDiscoveries = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeDiscovery) : [];
  } catch (e) {
    console.warn("Error reading local discoveries:", e);
    return [];
  }
};

export const saveLocalDiscoveries = (discoveries) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(discoveries));
  } catch (e) {
    console.warn("Error saving local discoveries:", e);
  }
};

const DiscoveryService = {
  getLocalDiscoveries,
  saveLocalDiscoveries,
  normalizeDiscovery,

  // Fetch all discoveries (Attempts cloud, fallbacks locally)
  getAllDiscoveries: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        const cloud = await response.json();
        if (Array.isArray(cloud)) return cloud.map(normalizeDiscovery);
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
        return normalizeDiscovery(await response.json());
      }
    } catch (e) {
      console.warn("Backend down. Fetching discovery by ID from local storage:", e);
    }
    const discoveries = getLocalDiscoveries();
    return discoveries.find((d) => d.id === id) || null;
  },

  // Fetch discoveries for a specific user (Attempts cloud, fallbacks locally)
  getDiscoveriesByUserId: async (userId) => {
    const local = getLocalDiscoveries();
    try {
      if (userId && userId !== "guest_id") {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (response.ok) {
          const cloudData = await response.json();
          if (Array.isArray(cloudData)) {
            const normalizedCloud = cloudData.map(normalizeDiscovery);
            // Merge cloud and local discoveries without losing source tags
            const merged = [...normalizedCloud];
            local.forEach((l) => {
              const match = merged.find(
                (m) =>
                  m.name?.toLowerCase() === l.name?.toLowerCase() &&
                  m.source === l.source
              );
              if (!match) {
                merged.push(l);
              }
            });
            saveLocalDiscoveries(merged);
            return merged;
          }
        }
      }
    } catch (e) {
      console.warn("Backend down. Fetching discoveries by userId from local storage:", e);
    }
    return local;
  },

  // Create a new discovery (Instant local persistence + background cloud sync)
  createDiscovery: async (userId, discoveryData) => {
    const finalUserId = userId || "guest_id";
    const dateDiscovered = discoveryData.dateDiscovered || new Date().toISOString().split("T")[0];
    const cleanName = (discoveryData.name || "").trim();
    const cleanSym = (discoveryData.symbol || discoveryData.submissionString || "").trim();
    const source = discoveryData.source || "domain";

    // 1. Immediately save into local storage (strictly keyed by name/symbol + source)
    const discoveries = getLocalDiscoveries();
    const existingIndex = discoveries.findIndex(
      (d) =>
        ((d.name && cleanName && d.name.toLowerCase() === cleanName.toLowerCase()) ||
          (d.symbol && cleanSym && d.symbol.toLowerCase() === cleanSym.toLowerCase())) &&
        (d.source || "domain") === source
    );

    const newDiscovery = {
      id: Date.now().toString() + "_" + Math.random().toString(36).substring(2, 6),
      userId: finalUserId,
      name: cleanName,
      symbol: cleanSym,
      source: source,
      ...discoveryData,
      dateDiscovered,
      submissionString: cleanSym
    };

    if (existingIndex === -1) {
      discoveries.push(newDiscovery);
      saveLocalDiscoveries(discoveries);
    } else {
      discoveries[existingIndex] = { ...discoveries[existingIndex], ...newDiscovery };
      saveLocalDiscoveries(discoveries);
    }

    // 2. Dispatch custom window event so open pages can react instantly
    window.dispatchEvent(new CustomEvent("elementopia_discovery_added", { detail: newDiscovery }));

    // 3. Background Cloud Sync (if online and valid user)
    if (finalUserId && finalUserId !== "guest_id") {
      try {
        const response = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: finalUserId,
            name: cleanName,
            dateDiscovered: dateDiscovered,
            submissionString: `${source}:${cleanSym}`
          })
        });
        if (response.ok) {
          const cloudDiscovery = await response.json();
          if (cloudDiscovery && cloudDiscovery.id) {
            const updated = getLocalDiscoveries();
            const idx = updated.findIndex((d) => d.name?.toLowerCase() === cleanName.toLowerCase() && (d.source || "domain") === source);
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], id: cloudDiscovery.id };
              saveLocalDiscoveries(updated);
            }
          }
        }
      } catch (e) {
        console.warn("Backend offline; discovery safely preserved in local storage.");
      }
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
    const local = getLocalDiscoveries();
    try {
      if (userId && userId !== "guest_id") {
        const response = await fetch(`${BASE_URL}/user/${userId}`);
        if (response.ok) {
          const cloudData = await response.json();
          if (Array.isArray(cloudData)) {
            const normalizedCloud = cloudData.map(normalizeDiscovery);
            const merged = [...normalizedCloud];
            local.forEach((l) => {
              const match = merged.find(
                (m) =>
                  m.name?.toLowerCase() === l.name?.toLowerCase() &&
                  m.source === l.source
              );
              if (!match) {
                merged.push(l);
              }
            });
            saveLocalDiscoveries(merged);
            return { data: merged };
          }
        }
      }
    } catch (e) {
      console.warn("Backend down. Fetching current user discoveries from local storage:", e);
    }
    return { data: local };
  },
};

export default DiscoveryService;
