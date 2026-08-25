package com.elementopia.backend.features.domain_interaction;

import com.elementopia.backend.features.diagnostic_feedback.DiagnosticLoggerService;
import com.elementopia.backend.features.hazmat_failsafe.SlidingWindowEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import com.elementopia.backend.features.diagnostic_feedback.FeedbackLibraryService;

@RestController
@RequestMapping("/api/features/domain-interaction")
@CrossOrigin(origins = "*")
public class ReactionController {

    private final ValidationService validationService;
    private final TelemetryService telemetryService;
    private final FeedbackLibraryService feedbackService;
    private final DiagnosticLoggerService diagnosticLoggerService;
    private final SlidingWindowEvaluationService slidingWindowService;

    public ReactionController(ValidationService validationService,
            TelemetryService telemetryService,
            FeedbackLibraryService feedbackService,
            DiagnosticLoggerService diagnosticLoggerService,
            SlidingWindowEvaluationService slidingWindowService) {
        this.validationService = validationService;
        this.telemetryService = telemetryService;
        this.feedbackService = feedbackService;
        this.diagnosticLoggerService = diagnosticLoggerService;
        this.slidingWindowService = slidingWindowService;
    }

    @PostMapping("/synthesize")
    public ResponseEntity<?> postCompositionPayload(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("nickname");

        @SuppressWarnings("unchecked")
        List<String> elements = (List<String>) payload.get("elements");

        Integer timeSeconds = (Integer) payload.get("time_seconds");
        double elapsedSeconds = (timeSeconds != null) ? timeSeconds.doubleValue() : 0.0;

        if (elements == null || elements.isEmpty() || nickname == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Malformed payload parameters.",
                    "action", "ERROR"));
        }

        boolean isValid = validationService.evaluateChemicalValidity(elements);

        if (isValid) {
            telemetryService.writePerformanceTelemetry(nickname, elapsedSeconds);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Elemental Resonance triggered! The obstacle dissolves.",
                    "action", "UNLOCK_PATH"));
        }

        String diagnosticMessage = feedbackService.generateDiagnosticFeedback(elements);

        diagnosticLoggerService.logFailedAttempt(nickname, elements, diagnosticMessage);

        boolean isHazmatActive = slidingWindowService.evaluateAttempts(nickname);

        if (isHazmatActive) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", diagnosticMessage,
                    "action", "LOCK_POINTER_INTERACTIONS"));
        }

        return ResponseEntity.ok(Map.of(
                "success", false,
                "message", diagnosticMessage,
                "action", "TRIGGER_DIAGNOSTIC"));
    }

    @PostMapping("/reset-session")
    public ResponseEntity<?> resetSessionPayload(@RequestBody Map<String, Object> payload) {
        String nickname = (String) payload.get("nickname");
        if (nickname != null) {
            slidingWindowService.clearFailedAttempts(nickname);
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Session failure logs wiped successfully."));
    }
}