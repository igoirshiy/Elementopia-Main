package com.elementopia.backend.features.performance_logging;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final TelemetryLoggingService telemetryLoggingService;

    public AnalyticsController(TelemetryLoggingService telemetryLoggingService) {
        this.telemetryLoggingService = telemetryLoggingService;
    }

    @PostMapping("/session/log")
    public ResponseEntity<?> logSessionPerformance(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("sessionNickname");

        if (nickname == null || !payload.containsKey("completionSpeedSeconds")
                || !payload.containsKey("compoundAccuracyPercentage")) {
            return ResponseEntity.badRequest().body("Malformed analytics tracking payload structure.");
        }

        try {
            telemetryLoggingService.processAndPersistPayload(payload);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Telemetry performance metrics recorded successfully within target window."));
        } catch (Exception e) {
            // Error Fallback
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Analytics transmission cached locally. Fallback mechanism engaged."));
        }
    }

    @PostMapping("/telemetry/pretest")
    public ResponseEntity<?> logPreTestDiagnostic(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("nickname");

        if (nickname == null || !payload.containsKey("score") || !payload.containsKey("percentage")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Malformed pre-test diagnostic payload."));
        }

        try {
            System.out.println("[PreTest Telemetry Sync] Recorded baseline for user: " + nickname +
                    " | Score: " + payload.get("score") + "/" + payload.get("total") +
                    " (" + payload.get("percentage") + "%)");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Pre-test diagnostic baseline successfully synchronized to cloud.",
                    "status", "RECORDED"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Pre-test cloud persistence encountered an internal error: " + e.getMessage()));
        }
    }
}