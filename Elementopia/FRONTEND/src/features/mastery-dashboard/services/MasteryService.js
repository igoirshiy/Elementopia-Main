const BASE_URL = "http://localhost:8080/api/features/mastery";

const MasteryService = {
  getPersonalProficiencyMap: async (nickname) => {
    if (!nickname || nickname === "Guest Alchemist") return null;
    
    try {
      const response = await fetch(`${BASE_URL}/${nickname}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Backend down. Mastery dashboard cloud fetch failed:", e.message);
    }
    return null;
  }
};

export default MasteryService;
