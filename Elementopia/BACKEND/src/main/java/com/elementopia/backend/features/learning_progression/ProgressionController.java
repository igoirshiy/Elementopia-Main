package com.elementopia.backend.features.learning_progression;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/progression")
@CrossOrigin(origins = "*")
public class ProgressionController {

    private final ProgressionValidationService validationService;

    public ProgressionController(ProgressionValidationService validationService) {
        this.validationService = validationService;
    }

    @GetMapping("/verify-access")
    public ResponseEntity<?> verifyRoomAccess(
            @RequestParam String nicknameWithTag,
            @RequestParam int roomId) {

        if (nicknameWithTag == null || nicknameWithTag.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "accessGranted", false,
                    "message", "Invalid session identifier."));
        }

        boolean hasAccess = validationService.verifyRoomAccess(nicknameWithTag, roomId);

        if (hasAccess) {
            return ResponseEntity.ok(Map.of(
                    "accessGranted", true,
                    "message", "Authorization confirmed. Entering Chamber.",
                    "action", "LAUNCH_PUZZLE_ARENA"));
        } else {
            return ResponseEntity.ok(Map.of(
                    "accessGranted", false,
                    "message", "Chamber is Sealed. You need to complete at least 3 foundational reactions first.",
                    "action", "DISPLAY_LOCKED_WARNING"));
        }
    }

    @PostMapping("/log-reaction")
    public ResponseEntity<?> logReaction(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("sessionNickname");
        int roomId = ((Number) payload.get("roomId")).intValue();
        int correctReactionCount = ((Number) payload.get("correctReactionCount")).intValue();

        validationService.logRoomCompletion(nickname, roomId, correctReactionCount);

        return ResponseEntity.ok(Map.of("success", true, "message", "Progression logged successfully"));
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetProgression(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("sessionNickname");
        if (nickname != null) {
            validationService.resetRoomCompletion(nickname);
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Room completion wiped successfully."));
    }

}