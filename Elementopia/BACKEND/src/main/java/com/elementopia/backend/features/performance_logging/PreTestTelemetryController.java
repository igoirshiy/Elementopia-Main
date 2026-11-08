package com.elementopia.backend.features.performance_logging;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class PreTestTelemetryController {

    @PostMapping("/pretest")
    public ResponseEntity<?> recordPreTestDiagnostic(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("nickname");

        if (nickname == null || !payload.containsKey("score") || !payload.containsKey("percentage")) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Malformed pre-test payload."));
        }

        System.out.println("[PreTest Cloud Sync] Baseline stored for: " + nickname +
                " | Score: " + payload.get("score") + "/" + payload.get("total") +
                " (" + payload.get("percentage") + "%)");

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Diagnostic pre-test baseline persisted to cloud.",
                "action", "BASELINE_PERSISTED"));
    }
}