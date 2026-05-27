package com.elementopia.backend.features.domain_interaction;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features/domain-interaction")
@CrossOrigin(origins = "*") // Direct connection for your React development server
public class ReactionController {

    private final ValidationService validationService;
    private final TelemetryService telemetryService;

    public ReactionController(ValidationService validationService, TelemetryService telemetryService) {
        this.validationService = validationService;
        this.telemetryService = telemetryService;
    }

    @PostMapping("/synthesize")
    public ResponseEntity<?> postCompositionPayload(@RequestBody Map<String, Object> payload) {
        // Matches the frontend parameters: nickname, chosen elements, and elapsed time tracker
        String nickname = (String) payload.get("nickname");
        @SuppressWarnings("unchecked")
        List<String> elements = (List<String>) payload.get("elements");

        // Safely extract the time elapsed from the frontend state
        Integer timeSeconds = (Integer) payload.get("time_seconds");
        double elapsedSeconds = (timeSeconds != null) ? timeSeconds.doubleValue() : 0.0;

        if (elements == null || elements.isEmpty() || nickname == null) {
            return ResponseEntity.badRequest().body("Malformed payload parameters. Synthesize aborted.");
        }

        // 1. Evaluate chemical validity against Grade 8 curriculum rules
        boolean isValid = validationService.evaluateChemicalValidity(elements);

        if (isValid) {
            // 2. Log performance telemetry instantly under the 2-second SLA constraint
            telemetryService.writePerformanceTelemetry(nickname, elapsedSeconds);

            // Return success tracking flags back to GameBoard.jsx
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Elemental Resonance triggered! The obstacle dissolves.",
                    "action", "UNLOCK_PATH"
            ));
        }

        // Fallback flag allowing Module 1.2 Diagnostic Feedback to intercept the failure layout
        return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Reaction failed. Invalid element composition sequence.",
                "action", "TRIGGER_DIAGNOSTIC"
        ));
    }
}