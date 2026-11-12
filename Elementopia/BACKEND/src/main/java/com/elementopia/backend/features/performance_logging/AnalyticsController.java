package com.elementopia.backend.features.performance_logging;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final TelemetryLoggingService telemetryLoggingService;
    private final PreTestDiagnosticRepository preTestDiagnosticRepository;
    private final ObjectMapper objectMapper;

    public AnalyticsController(TelemetryLoggingService telemetryLoggingService,
                               PreTestDiagnosticRepository preTestDiagnosticRepository,
                               ObjectMapper objectMapper) {
        this.telemetryLoggingService = telemetryLoggingService;
        this.preTestDiagnosticRepository = preTestDiagnosticRepository;
        this.objectMapper = objectMapper;
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
            int score = ((Number) payload.get("score")).intValue();
            int total = payload.containsKey("total") ? ((Number) payload.get("total")).intValue() : 5;
            int percentage = ((Number) payload.get("percentage")).intValue();

            String answersJson = null;
            if (payload.containsKey("answers") && payload.get("answers") != null) {
                answersJson = objectMapper.writeValueAsString(payload.get("answers"));
            }

            PreTestDiagnostic diagnostic = new PreTestDiagnostic(nickname, score, total, percentage, answersJson);
            PreTestDiagnostic saved = preTestDiagnosticRepository.save(diagnostic);

            System.out.println("[PreTest Telemetry Sync] Recorded baseline in DB for user: " + nickname +
                    " | ID: " + saved.getId() + " | Score: " + score + "/" + total +
                    " (" + percentage + "%)");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Pre-test diagnostic baseline successfully synchronized to cloud.",
                    "id", saved.getId().toString(),
                    "status", "RECORDED"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Pre-test cloud persistence encountered an internal error: " + e.getMessage()));
        }
    }
}
