const LOCAL_STORAGE_KEY = "elementopia_achievements";

const getLocalAchievements = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveLocalAchievements = (achievements) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(achievements));
};

const AchievementService = {
  // Get All Achievements
  getAllAchievements: async () => {
    return getLocalAchievements();
  },

  // Get Achievement by ID
  getAchievementById: async (id) => {
    const achievements = getLocalAchievements();
    return achievements.find((a) => a.id === id) || null;
  },

  // Get Achievements by User
  getAchievementsByUser: async (userId) => {
    const achievements = getLocalAchievements();
    return achievements.filter((a) => a.userId === userId);
  },

  // Create Achievement
  createAchievement: async (userId, data) => {
    console.log("Creating achievement locally for user:", userId, data);
    const achievements = getLocalAchievements();
    
    // Check if the user already has this achievement to prevent duplicates
    const exists = achievements.find(a => a.userId === userId && a.title === data.title);
    if (exists) {
        throw new Error("Achievement already exists");
    }

    const newAchievement = {
      id: Date.now().toString(), // Simple unique ID
      userId: userId,
      ...data
    };
    
    achievements.push(newAchievement);
    saveLocalAchievements(achievements);
    
    return newAchievement;
  },

  // Update Achievement
  updateAchievement: async (id, achievementData) => {
    const achievements = getLocalAchievements();
    const index = achievements.findIndex((a) => a.id === id);
    if (index !== -1) {
      achievements[index] = { ...achievements[index], ...achievementData };
      saveLocalAchievements(achievements);
      return achievements[index];
    }
    throw new Error("Achievement not found");
  },

  // Delete Achievement
  deleteAchievement: async (id) => {
    let achievements = getLocalAchievements();
    achievements = achievements.filter((a) => a.id !== id);
    saveLocalAchievements(achievements);
    return { success: true };
  },
};

export default AchievementService;
