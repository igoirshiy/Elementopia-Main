package com.elementopia.backend.features.challenge_generation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/features/challenges")
public class ChallengeController {

    private final ChallengeRandomizerService randomizerService;

    public ChallengeController(ChallengeRandomizerService randomizerService) {
        this.randomizerService = randomizerService;
    }

    @GetMapping("/random-set")
    public ResponseEntity<?> getRandomChallengeSet(
            @RequestParam String sessionId,
            @RequestParam int domainId) {

        UUID sessionUuid;
        try {
            sessionUuid = UUID.fromString(sessionId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Malformed session token identifier.");
        }

        // Generate the randomized selection structure
        List<Challenge> challengeSet = randomizerService.selectChallengesForSession(sessionUuid, domainId);

        // Return a structural metrics wrapper payload optimized for client-side state caching
        return ResponseEntity.ok(Map.of(
                "success", true,
                "domainId", domainId,
                "challenges", challengeSet
        ));
    }
}