package com.elementopia.backend.features.diagnostic_feedback;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedbackLibraryService {

    private final FailedAttemptLogRepository attemptLogRepository;

    public FeedbackLibraryService(FailedAttemptLogRepository attemptLogRepository) {
        this.attemptLogRepository = attemptLogRepository;
    }

    public String analyzeAndLogFailure(String nicknameWithTag, List<String> submittedElements) {
        // 1. Format the submission into a readable string (e.g., "H, O, O")
        String submissionString = String.join(" + ", submittedElements);

        // 2. Query diagnostic syntax (Mocked here, but would query your FEEDBACK_LIBRARY table)
        String diagnosticMessage = queryDiagnosticSyntax(submissionString);
        String messageId = "MSG-" + Math.abs(submissionString.hashCode()); // Simulated ID

        // 3. Log the failed attempt to the database (Supabase)
        FailedAttemptLog logEntry = new FailedAttemptLog(nicknameWithTag, submissionString, messageId);
        attemptLogRepository.save(logEntry);

        // 4. Return the educational lesson
        return diagnosticMessage;
    }

    private String queryDiagnosticSyntax(String submissionString) {
        // In a full DB implementation, this runs a SELECT on the FEEDBACK_LIBRARY table.
        // For now, we use a curriculum-based switch statement.
        if (submissionString.contains("He") || submissionString.contains("Ne")) {
            return "Noble gases like Helium (He) are inert and rarely form compounds. Try combining halogens or alkali metals instead!";
        } else if (submissionString.contains("Na") && submissionString.contains("H2O")) {
            return "Warning: Sodium (Na) reacts explosively with water! This creates Sodium Hydroxide and Hydrogen gas.";
        }

        // Fallback Principle as defined in the SDD
        return "These elements do not share compatible valence electrons. Review their groups on the periodic table.";
    }
}