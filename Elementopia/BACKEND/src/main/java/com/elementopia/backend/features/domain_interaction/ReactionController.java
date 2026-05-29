package com.elementopia.backend.features.domain_interaction;

import com.elementopia.backend.features.diagnostic_feedback.DiagnosticLoggerService;
import com.elementopia.backend.features.hazmat_failsafe.SlidingWindowEvaluationService; // NEW: MODULE 1.3
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
    private final SlidingWindowEvaluationService slidingWindowService; // NEW: MODULE 1.3

    // Inject all services via Spring's constructor injection
    public ReactionController(ValidationService validationService,
                              TelemetryService telemetryService,
                              FeedbackLibraryService feedbackService,
                              DiagnosticLoggerService diagnosticLoggerService,
                              SlidingWindowEvaluationService slidingWindowService) { // NEW: MODULE 1.3
        this.validationService = validationService;
        this.telemetryService = telemetryService;
        this.feedbackService = feedbackService;
        this.diagnosticLoggerService = diagnosticLoggerService;
        this.slidingWindowService = slidingWindowService; // NEW: MODULE 1.3
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
                    "action", "ERROR"
            ));
        }

        // 1. Check if the reaction is valid (Module 1.1 Retained)
        boolean isValid = validationService.evaluateChemicalValidity(elements);

        if (isValid) {
            // Success path (Module 1.1 Retained)
            telemetryService.writePerformanceTelemetry(nickname, elapsedSeconds);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Elemental Resonance triggered! The obstacle dissolves.",
                    "action", "UNLOCK_PATH"
            ));
        }

        // 2. Failure path: Generate the educational micro-lesson (Module 1.2 Retained)
        String diagnosticMessage = feedbackService.generateDiagnosticFeedback(elements);

        // 3. Save the failure to the database for Module 1.3 tracking (Module 1.2 Retained)
        diagnosticLoggerService.logFailedAttempt(nickname, elements, diagnosticMessage);

        // 4. NEW: MODULE 1.3 HAZMAT CHECK
        // Evaluate if this specific user has failed 5 times in the last 15 seconds
        boolean isHazmatActive = slidingWindowService.evaluateAttempts(nickname);

        if (isHazmatActive) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", diagnosticMessage, // Still passes the Module 1.2 educational message!
                    "action", "LOCK_POINTER_INTERACTIONS"
            ));
        }

        // 5. Default failure return if Hazmat is NOT triggered (Module 1.1/1.2 Retained)
        return ResponseEntity.ok(Map.of(
                "success", false,
                "message", diagnosticMessage,
                "action", "TRIGGER_DIAGNOSTIC"
        ));
    }
}