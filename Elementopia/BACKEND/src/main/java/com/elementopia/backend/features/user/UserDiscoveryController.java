package com.elementopia.backend.features.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/discoveries")
public class UserDiscoveryController {

    private final UserDiscoveryRepository discoveryRepository;

    public UserDiscoveryController(UserDiscoveryRepository discoveryRepository) {
        this.discoveryRepository = discoveryRepository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserDiscovery>> getDiscoveriesByUserId(@PathVariable String userId) {
        List<UserDiscovery> discoveries = discoveryRepository.findByUserId(userId);
        return ResponseEntity.ok(discoveries);
    }

    @PostMapping
    public ResponseEntity<?> createDiscovery(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String name = payload.get("name");
        String dateDiscovered = payload.get("dateDiscovered");
        String submissionString = payload.get("submissionString");

        if (userId == null || name == null || dateDiscovered == null) {
            return ResponseEntity.badRequest().body("userId, name, and dateDiscovered are required.");
        }

        // Check if user already discovered this to avoid duplicate DB rows
        List<UserDiscovery> existing = discoveryRepository.findByUserId(userId);
        boolean alreadyDiscovered = existing.stream().anyMatch(d -> d.getName().equalsIgnoreCase(name));

        if (alreadyDiscovered) {
            return ResponseEntity.ok(Map.of("message", "Already discovered", "success", true));
        }

        UserDiscovery discovery = new UserDiscovery(userId, name, dateDiscovered, submissionString);
        UserDiscovery saved = discoveryRepository.save(discovery);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscovery(@PathVariable String id) {
        Optional<UserDiscovery> discovery = discoveryRepository.findById(id);
        if (discovery.isPresent()) {
            discoveryRepository.delete(discovery.get());
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<UserDiscovery>> getAllDiscoveries() {
        return ResponseEntity.ok(discoveryRepository.findAll());
    }
}
