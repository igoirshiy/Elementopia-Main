package com.elementopia.backend.features.challenge_generation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    private final ChallengeRandomizerService randomizerService;

    public ChallengeController(ChallengeRandomizerService randomizerService) {
        this.randomizerService = randomizerService;
    }

    @GetMapping("/random-set")
    public ResponseEntity<?> getRandomChallengeSet(
            @RequestParam String sessionId, // This is now safely the Nickname String
            @RequestParam int domainId) {

        if (sessionId == null || sessionId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid session identifier."));
        }

        // Generate the randomized selection structure cross-referenced with User entities
        List<Challenge> challengeSet = randomizerService.selectChallengesForSession(sessionId, domainId);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "domainId", domainId,
                "challenges", challengeSet
        ));
    }
}