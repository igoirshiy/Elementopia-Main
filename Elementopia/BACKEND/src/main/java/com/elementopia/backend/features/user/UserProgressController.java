package com.elementopia.backend.features.user;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    private final UserProgressRepository progressRepository;
    private final ObjectMapper objectMapper;

    public UserProgressController(UserProgressRepository progressRepository, ObjectMapper objectMapper) {
        this.progressRepository = progressRepository;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/{nickname}")
    public ResponseEntity<?> getProgress(@PathVariable String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nickname is required"));
        }

        Optional<UserProgress> progressOpt = progressRepository.findByNickname(nickname);
        if (progressOpt.isPresent()) {
            UserProgress p = progressOpt.get();
            return ResponseEntity.ok(mapToResponse(p));
        }

        // Return a default mock profile if they don't exist yet, keeping it friction-free!
        Map<String, Object> defaultProfile = Map.of(
            "nickname", nickname,
            "rating", 1200,
            "wins", 0,
            "losses", 0,
            "clearedDomains", List.of(),
            "sessions", List.of()
        );
        return ResponseEntity.ok(defaultProfile);
    }

    @PostMapping
    public ResponseEntity<?> saveProgress(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("nickname");
        if (nickname == null || nickname.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Nickname is required"));
        }

        Optional<UserProgress> existingOpt = progressRepository.findByNickname(nickname);
        UserProgress progress = existingOpt.orElseGet(() -> new UserProgress(nickname));

        if (payload.containsKey("rating")) {
            progress.setRating(((Number) payload.get("rating")).intValue());
        }
        if (payload.containsKey("wins")) {
            progress.setWins(((Number) payload.get("wins")).intValue());
        }
        if (payload.containsKey("losses")) {
            progress.setLosses(((Number) payload.get("losses")).intValue());
        }

        if (payload.containsKey("clearedDomains")) {
            Object domainsObj = payload.get("clearedDomains");
            if (domainsObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> domainsList = (List<String>) domainsObj;
                progress.setClearedDomains(String.join(",", domainsList));
            }
        }

        if (payload.containsKey("sessions")) {
            try {
                String json = objectMapper.writeValueAsString(payload.get("sessions"));
                progress.setSessionsJson(json);
            } catch (Exception e) {
                // Log warning and keep existing JSON
            }
        }

        UserProgress saved = progressRepository.save(progress);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    private Map<String, Object> mapToResponse(UserProgress p) {
        Map<String, Object> response = new HashMap<>();
        response.put("nickname", p.getNickname());
        response.put("rating", p.getRating() != null ? p.getRating() : 1200);
        response.put("wins", p.getWins() != null ? p.getWins() : 0);
        response.put("losses", p.getLosses() != null ? p.getLosses() : 0);

        List<String> clearedDomainsList = new ArrayList<>();
        if (p.getClearedDomains() != null && !p.getClearedDomains().trim().isEmpty()) {
            clearedDomainsList = Arrays.asList(p.getClearedDomains().split(","));
        }
        response.put("clearedDomains", clearedDomainsList);

        List<Object> sessionsList = new ArrayList<>();
        if (p.getSessionsJson() != null && !p.getSessionsJson().trim().isEmpty()) {
            try {
                sessionsList = objectMapper.readValue(p.getSessionsJson(), new TypeReference<List<Object>>() {});
            } catch (Exception e) {
                // Ignore parse errors
            }
        }
        response.put("sessions", sessionsList);

        return response;
    }
}
