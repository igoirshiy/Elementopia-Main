package com.elementopia.backend.features.hazmat_failsafe;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class FailsafeTelemetryService {

    private static final Logger logger = Logger.getLogger(FailsafeTelemetryService.class.getName());
    private final JdbcTemplate jdbcTemplate;

    public FailsafeTelemetryService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void logHazmatActivation(String nicknameWithTag) {
        long startTime = System.currentTimeMillis();

        try {
            String protocolId = UUID.randomUUID().toString();
            LocalDateTime triggeredAt = LocalDateTime.now();

            // Commit transaction data mapping straight to the cloud instance schema
            String sql = "INSERT INTO hazmat_protocol_state (protocol_id, session_nickname, is_currently_active, triggered_at) " +
                    "VALUES (?, ?, true, ?)";

            jdbcTemplate.update(sql, protocolId, nicknameWithTag, triggeredAt);

            long endTime = System.currentTimeMillis();
            logger.info("Hazmat metric write executed safely. Isolated DB loop runtime: " + (endTime - startTime) + "ms");

        } catch (Exception e) {
            logger.severe("Failsafe database registration error: " + e.getMessage());
        }
    }
}