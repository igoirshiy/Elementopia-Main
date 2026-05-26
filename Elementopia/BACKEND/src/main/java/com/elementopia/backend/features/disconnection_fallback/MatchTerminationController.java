package com.elementopia.backend.features.disconnection_fallback;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/match-termination")
public class MatchTerminationController {

    private final MatchTerminationService terminationService;

    public MatchTerminationController(MatchTerminationService terminationService) {
        this.terminationService = terminationService;
    }

    @PostMapping("/drop")
    public ResponseEntity<?> handlePlayerDrop(@RequestBody Map<String, String> payload) {
        String roomCode = payload.get("roomCode");
        String nickname = payload.get("nickname");

        if (roomCode == null || nickname == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid termination payload."
            ));
        }

        try {
            // Execute the abort sequence
            terminationService.terminateMatch(roomCode, nickname);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Match safely aborted and opponent notified."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to execute abort sequence."
            ));
        }
    }
}