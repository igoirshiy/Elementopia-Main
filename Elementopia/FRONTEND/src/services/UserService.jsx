// Simplified UserService for Registration-Free Environment
// All data is stored in the browser's localStorage.

const USERS_KEY = "elementopia_users";
const CURRENT_USER_KEY = "elementopia_current_user";

// Helper to get all users
const getLocalUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper to save users
const saveLocalUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const UserService = {
  // Simulate Login
  loginUser: async (username, password) => {
    console.log("Logging in locally:", username);
    const users = getLocalUsers();
    
    // Find the user or create a default mock one if it doesn't exist
    let user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      // In a registration-free environment, let's just let them in as a guest
      // if they use generic credentials or haven't registered
      user = {
        userId: Date.now().toString(),
        username: username || "Guest",
        firstName: "Guest",
        lastName: "User",
        role: "STUDENT"
      };
    }

    // Set local storage session
    localStorage.setItem("token", "mock_local_token_" + user.userId);
    localStorage.setItem("role", user.role);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    return { token: "mock_local_token_" + user.userId, role: user.role, user };
  },

  // Get current user info (Reads from local storage or returns Guest)
  getCurrentUser: async () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (userStr) {
        return JSON.parse(userStr);
    }
    
    // Fallback if accessed without login
    return {
      userId: "guest_id",
      username: "Guest Alchemist",
      firstName: "Guest",
      lastName: "User",
      role: "STUDENT",
      discoveries: [],
      achievements: []
    };
  },

  // Join Section (Mocked)
  joinSection: async (sectionCode) => {
    console.log("Mock joined section:", sectionCode);
    return Promise.resolve({ message: "Joined successfully locally" });
  },

  // Get all users (Reads from local storage)
  getAllUsers: async () => {
    return getLocalUsers();
  },

  // Update profile info
  updateProfile: async (id, profileData) => {
    const users = getLocalUsers();
    const index = users.findIndex(u => u.userId === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...profileData };
        saveLocalUsers(users);
        
        // Update current user if it's the one logged in
        const current = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (current && current.userId === id) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
        }
        
        return users[index];
    }
    throw new Error("User not found");
  },

  // Update entire user record
  updateUser: async (id, userData) => {
    return UserService.updateProfile(id, userData);
  },

  // Register new user (Saves to local storage)
  registerUser: async (userData) => {
    console.log("Registering user locally:", userData);
    const users = getLocalUsers();
    
    // Avoid duplicate usernames
    if (users.find(u => u.username === userData.username)) {
        throw new Error("Username already exists");
    }

    const newUser = {
        userId: Date.now().toString(),
        role: "STUDENT",
        ...userData
    };

    users.push(newUser);
    saveLocalUsers(users);

    return newUser;
  },

  // Logout by clearing session data
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Delete User
  deleteUser: async (id) => {
    let users = getLocalUsers();
    users = users.filter(u => u.userId !== id);
    saveLocalUsers(users);
    
    const current = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    if (current && current.userId === id) {
        UserService.logout();
    }
    return { success: true };
  },

  getUserRole: () => {
    return localStorage.getItem("role");
  },
};

export default UserService;
