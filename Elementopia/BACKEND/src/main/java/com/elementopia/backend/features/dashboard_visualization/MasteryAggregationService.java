package com.elementopia.backend.features.dashboard_visualization;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;

@Service
public class MasteryAggregationService {

    private static final Logger logger = Logger.getLogger(MasteryAggregationService.class.getName());
    private final JdbcTemplate jdbcTemplate;

    // A domain is flagged as "weak" if accuracy drops below 70%
    private static final double WEAK_DOMAIN_THRESHOLD = 70.0;

    public MasteryAggregationService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<DomainMasteryDTO> aggregateStudentMastery(String nicknameWithTag) {
        long startTime = System.currentTimeMillis();

        // Standard SQL Aggregation: Averages out the raw rows logged by Module 2.1
        // Groups by domain_id to provide correct scatter plot metrics for each domain
        String sql = "SELECT domain_id AS domain_name, " +
                "AVG(compound_accuracy_percentage) AS avg_acc, " +
                "AVG(completion_speed_seconds) AS avg_speed " +
                "FROM SESSION_PERFORMANCE " +
                "WHERE session_nickname = ? " +
                "GROUP BY domain_id " +
                "HAVING COUNT(*) > 0"; // Prevents division by zero on empty sets

        List<DomainMasteryDTO> masteryList = jdbcTemplate.query(sql, (rs, rowNum) -> {
            double avgAcc = rs.getDouble("avg_acc");
            double avgSpeed = rs.getDouble("avg_speed");
            boolean isWeak = avgAcc < WEAK_DOMAIN_THRESHOLD;

            return new DomainMasteryDTO(
                    rs.getString("domain_name"),
                    avgAcc,
                    avgSpeed,
                    isWeak
            );
        }, nicknameWithTag);

        // Implementation Plan Requirement: "checks for missing data states to supply Blank Slate triggers"
        if (masteryList.isEmpty()) {
            logger.info("No historical data found for " + nicknameWithTag + ". Returning Blank Slate trigger.");
            // Returning an empty list triggers the frontend to show the onboarding/blank slate UI
            return List.of();
        }

        long endTime = System.currentTimeMillis();
        logger.info("Mastery aggregation completed in " + (endTime - startTime) + "ms.");

        return masteryList;
    }
}