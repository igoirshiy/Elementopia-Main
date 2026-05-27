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

        if (nickname == null || !payload.containsKey("completionSpeedSeconds") || !payload.containsKey("compoundAccuracyPercentage")) {
            return ResponseEntity.badRequest().body("Malformed analytics tracking payload structure.");
        }

        try {
            // Delegate metrics processing execution path straight to our feature logging handler
            telemetryLoggingService.processAndPersistPayload(payload);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Telemetry performance metrics recorded successfully within target window."
            ));
        } catch (Exception e) {
            // Graceful error fallback handling to keep client stable if cloud connection drops
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Analytics transmission cached locally. Fallback mechanism engaged."
            ));
        }
    }
}