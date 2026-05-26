package com.elementopia.backend.features.domain_interaction;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/features/domain-interaction")
@CrossOrigin(origins = "*")
public class ReactionController {

    private final ValidationService validationService;
    private final TelemetryService telemetryService;

    // Spring automatically injects our vertical slice services here
    public ReactionController(ValidationService validationService, TelemetryService telemetryService) {
        this.validationService = validationService;
        this.telemetryService = telemetryService;
    }

    @PostMapping("/synthesize")
    public ResponseEntity<?> postCompositionPayload(@RequestBody Map<String, Object> payload) {
        // Extract parameters safely matching our anonymous identity strategy
        String nicknameWithTag = (String) payload.get("nicknameWithTag");
        @SuppressWarnings("unchecked")
        List<String> elements = (List<String>) payload.get("elements");
        Double elapsedSeconds = ((Number) payload.get("elapsedSeconds")).doubleValue();

        if (elements == null || elements.isEmpty() || nicknameWithTag == null) {
            return ResponseEntity.badRequest().body("Invalid request payload parameters.");
        }

        // 1. Evaluate chemical validity against high school curriculum rules
        boolean isValid = validationService.evaluateChemicalValidity(elements);

        if (isValid) {
            // 2. Automatically capture and pipe telemetry straight to cloud data collections
            telemetryService.writePerformanceTelemetry(nicknameWithTag, elapsedSeconds);

            // Return success payload containing instructions to clear obstacles
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Elemental Resonance triggered! The obstacle dissolves.",
                    "action", "UNLOCK_PATH"
            ));
        }

        // If invalid, return a standard response so Module 1.2 Diagnostic Feedback can intercept it
        return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Reaction failed. Invalid element composition sequence.",
                "action", "TRIGGER_DIAGNOSTIC"
        ));
    }
}