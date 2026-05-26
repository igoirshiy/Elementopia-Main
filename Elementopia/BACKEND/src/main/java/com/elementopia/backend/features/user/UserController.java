package com.elementopia.backend.features.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String password = payload.get("password");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }

        // Default password if not provided
        String pwd = (password == null || password.trim().isEmpty()) ? "password" : password;

        Optional<User> existingUser = userRepository.findByUsername(username);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Verify password if they provided one
            if (password != null && !password.trim().isEmpty() && !user.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
            }
        } else {
            // Auto-register (friction-free!)
            user = new User(username, pwd);
            userRepository.save(user);
        }

        String token = "mock_cloud_token_" + user.getUserId();
        return ResponseEntity.ok(Map.of(
            "token", token,
            "role", user.getRole(),
            "user", user
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User userData) {
        if (userData.getUsername() == null || userData.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }

        Optional<User> existingUser = userRepository.findByUsername(userData.getUsername());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(409).body(Map.of("error", "Username already exists"));
        }

        if (userData.getPassword() == null || userData.getPassword().trim().isEmpty()) {
            userData.setPassword("password");
        }
        if (userData.getFirstName() == null || userData.getFirstName().trim().isEmpty()) {
            userData.setFirstName(userData.getUsername());
        }
        if (userData.getLastName() == null || userData.getLastName().trim().isEmpty()) {
            userData.setLastName("User");
        }
        if (userData.getRole() == null || userData.getRole().trim().isEmpty()) {
            userData.setRole("STUDENT");
        }

        User savedUser = userRepository.save(userData);
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String id, @RequestBody Map<String, Object> profileData) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User user = existingUserOpt.get();
            if (profileData.containsKey("firstName")) {
                user.setFirstName((String) profileData.get("firstName"));
            }
            if (profileData.containsKey("lastName")) {
                user.setLastName((String) profileData.get("lastName"));
            }
            if (profileData.containsKey("role")) {
                user.setRole((String) profileData.get("role"));
            }
            if (profileData.containsKey("password")) {
                user.setPassword((String) profileData.get("password"));
            }
            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
}
