package com.elementopia.backend.features.hazmat_failsafe;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class SlidingWindowEvaluationService {

    private final JdbcTemplate jdbcTemplate;
    private final FailsafeTelemetryService failsafeTelemetryService;

    public SlidingWindowEvaluationService(JdbcTemplate jdbcTemplate,
            FailsafeTelemetryService failsafeTelemetryService) {
        this.jdbcTemplate = jdbcTemplate;
        this.failsafeTelemetryService = failsafeTelemetryService;
    }

    public boolean evaluateAttempts(String nicknameWithTag) {
        int slidingWindowSeconds = 15;
        int maxFailureThreshold = 5;

        LocalDateTime lookbackTime = LocalDateTime.now().minusSeconds(slidingWindowSeconds);

        String sql = "SELECT COUNT(*) FROM FAILED_ATTEMPT_LOG " +
                "WHERE session_nickname = ? AND error_timestamp >= ?";

        Integer failedCount = jdbcTemplate.queryForObject(sql, Integer.class, nicknameWithTag, lookbackTime);

        if (failedCount != null && failedCount >= maxFailureThreshold) {
            failsafeTelemetryService.logHazmatActivation(nicknameWithTag);
            return true;
        }

        return false;
    }

    public void clearFailedAttempts(String nicknameWithTag) {
        try {
            String sql = "DELETE FROM FAILED_ATTEMPT_LOG WHERE session_nickname = ?";
            jdbcTemplate.update(sql, nicknameWithTag);
        } catch (Exception e) {
            System.err.println("Could not reset failed attempt log: " + e.getMessage());
        }
    }

}