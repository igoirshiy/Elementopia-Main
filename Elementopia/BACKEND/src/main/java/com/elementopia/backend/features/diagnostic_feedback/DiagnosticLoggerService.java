package com.elementopia.backend.features.diagnostic_feedback;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;

@Service
public class DiagnosticLoggerService {

    private static final Logger logger = Logger.getLogger(DiagnosticLoggerService.class.getName());
    private final FailedAttemptLogRepository attemptLogRepository;

    public DiagnosticLoggerService(FailedAttemptLogRepository attemptLogRepository) {
        this.attemptLogRepository = attemptLogRepository;
    }

    public void logFailedAttempt(String nickname, List<String> elements, String feedbackMessage) {
        try {
            // Convert the list of elements into a single string for the database (e.g., "H,H,O")
            String submissionString = String.join(",", elements);

            // Create the new log entity using your custom constructor
            FailedAttemptLog logEntry = new FailedAttemptLog(nickname, submissionString, feedbackMessage);

            // Save to the PostgreSQL database
            attemptLogRepository.save(logEntry);

            logger.info("Failed attempt logged for session: " + nickname);
        } catch (Exception e) {
            logger.severe("Failed to log diagnostic attempt: " + e.getMessage());
        }
    }
}