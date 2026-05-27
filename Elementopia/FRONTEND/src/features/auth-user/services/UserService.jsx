// Cloud-Syncing UserService with Local Storage Fallback
const USERS_KEY = "elementopia_users";
const CURRENT_USER_KEY = "elementopia_current_user";
const BASE_URL = "http://localhost:8080/api/users";

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
  // Simulate Login (Queries cloud, fallbacks locally)
  loginUser: async (username, password) => {
    console.log("Logging in user:", username);
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
        return data;
      }
    } catch (e) {
      console.warn("Backend down. Falling back to local login flow:", e);
    }

    // Local fallback
    const users = getLocalUsers();
    let user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      user = {
        userId: Date.now().toString(),
        username: username || "Guest",
        firstName: username || "Guest",
        lastName: "User",
        role: "STUDENT"
      };
    }

    localStorage.setItem("token", "mock_local_token_" + user.userId);
    localStorage.setItem("role", user.role);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

    return { token: "mock_local_token_" + user.userId, role: user.role, user };
  },

  // Get current user info (Attempts cloud refresh, falls back to localStorage cache)
  getCurrentUser: async () => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    if (userStr) {
      try {
        const localUser = JSON.parse(userStr);
        if (localUser && localUser.username) {
          const response = await fetch(`${BASE_URL}/${localUser.username}`);
          if (response.ok) {
            const user = await response.json();
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return user;
          }
        }
      } catch (e) {
        console.warn("Backend down. Reading from cached local session:", e);
      }
      return JSON.parse(userStr);
    }
    
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
    return Promise.resolve({ message: "Joined successfully" });
  },

  // Get all users (Attempts cloud, fallbacks locally)
  getAllUsers: async () => {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Backend down. Reading all users from localStorage:", e);
    }
    return getLocalUsers();
  },

  // Update profile info (Attempts cloud, fallbacks locally)
  updateProfile: async (id, profileData) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        const currentStr = localStorage.getItem(CURRENT_USER_KEY);
        if (currentStr) {
          const current = JSON.parse(currentStr);
          if (current.userId === id) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
          }
        }
        return updatedUser;
      }
    } catch (e) {
      console.warn("Backend down. Updating profile locally:", e);
    }

    const users = getLocalUsers();
    const index = users.findIndex(u => u.userId === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...profileData };
        saveLocalUsers(users);
        
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

  // Register new user (Attempts cloud, fallbacks locally)
  registerUser: async (userData) => {
    console.log("Registering user:", userData);
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        return await response.json();
      } else if (response.status === 409) {
        throw new Error("Username already exists");
      }
    } catch (e) {
      if (e.message === "Username already exists") throw e;
      console.warn("Backend down. Registering user locally:", e);
    }

    const users = getLocalUsers();
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

  // Delete User (Attempts cloud, fallbacks locally)
  deleteUser: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        const current = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (current && current.userId === id) {
            UserService.logout();
        }
        return { success: true };
      }
    } catch (e) {
      console.warn("Backend down. Deleting user locally:", e);
    }

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
