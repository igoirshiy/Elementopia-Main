package com.elementopia.backend.features.hazmat_failsafe;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/features/failsafe")
public class FailsafeMonitorController {

    private final SlidingWindowEvaluationService evaluationService;

    public FailsafeMonitorController(SlidingWindowEvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @GetMapping("/check-status")
    public ResponseEntity<?> evaluateCombination(@RequestParam String nicknameWithTag) {
        if (nicknameWithTag == null || nicknameWithTag.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Nickname with tag context is required.");
        }

        // Run verification loop evaluating recent transaction logs
        boolean isProtocolActive = evaluationService.evaluateAttempts(nicknameWithTag);

        if (isProtocolActive) {
            return ResponseEntity.ok(Map.of(
                    "isProtocolActive", true,
                    "message", "System Volatility High. Hazardous elements isolated.",
                    "action", "LOCK_POINTER_INTERACTIONS"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "isProtocolActive", false,
                "message", "System stable. Workspace interaction clear.",
                "action", "CONTINUE_MONITORING"
        ));
    }
}