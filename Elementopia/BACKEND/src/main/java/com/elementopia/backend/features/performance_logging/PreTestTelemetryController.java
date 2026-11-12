package com.elementopia.backend.features.performance_logging;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class PreTestTelemetryController {

    private final PreTestDiagnosticRepository repository;
    private final ObjectMapper objectMapper;

    public PreTestTelemetryController(PreTestDiagnosticRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/pretest")
    public ResponseEntity<?> recordPreTestDiagnostic(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("nickname");

        if (nickname == null || !payload.containsKey("score") || !payload.containsKey("percentage")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Malformed pre-test payload."));
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
            PreTestDiagnostic saved = repository.save(diagnostic);

            System.out.println("[PreTest Cloud Sync] Baseline stored in DB for: " + nickname +
                    " | ID: " + saved.getId() + " | Score: " + score + "/" + total +
                    " (" + percentage + "%)");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Diagnostic pre-test baseline persisted to cloud.",
                    "id", saved.getId().toString(),
                    "action", "BASELINE_PERSISTED"));
        } catch (Exception e) {
            System.err.println("[PreTest Cloud Sync Error] " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to persist pre-test baseline: " + e.getMessage()));
        }
    }
}
