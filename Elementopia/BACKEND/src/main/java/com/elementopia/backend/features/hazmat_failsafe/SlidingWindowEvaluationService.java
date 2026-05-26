package com.elementopia.backend.features.hazmat_failsafe;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class SlidingWindowEvaluationService {

    private final JdbcTemplate jdbcTemplate;
    private final FailsafeTelemetryService failsafeTelemetryService;

    public SlidingWindowEvaluationService(JdbcTemplate jdbcTemplate, FailsafeTelemetryService failsafeTelemetryService) {
        this.jdbcTemplate = jdbcTemplate;
        this.failsafeTelemetryService = failsafeTelemetryService;
    }

    public boolean evaluateAttempts(String nicknameWithTag) {
        // Look back window parameters matching our SDD requirements exactly
        int slidingWindowSeconds = 15;
        int maxFailureThreshold = 5;

        LocalDateTime lookbackTime = LocalDateTime.now().minusSeconds(slidingWindowSeconds);

        // Directly query the FAILED_ATTEMPT_LOG populated by Module 1.2
        String sql = "SELECT COUNT(*) FROM FAILED_ATTEMPT_LOG " +
                "WHERE session_nickname = ? AND error_timestamp >= ?";

        Integer failedCount = jdbcTemplate.queryForObject(sql, Integer.class, nicknameWithTag, lookbackTime);

        if (failedCount != null && failedCount >= maxFailureThreshold) {
            // Log the Hazmat activation metrics to Supabase under the sub-2-second target
            failsafeTelemetryService.logHazmatActivation(nicknameWithTag);
            return true; // Trigger the protocol lockout mask
        }

        return false; // Safe sequence, keep workspace accessible
    }
}