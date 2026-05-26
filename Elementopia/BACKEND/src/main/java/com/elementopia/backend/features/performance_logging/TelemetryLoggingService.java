package com.elementopia.backend.features.performance_logging;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class TelemetryLoggingService {

    private static final Logger logger = Logger.getLogger(TelemetryLoggingService.class.getName());
    private final SessionPerformanceRepository repository;

    public TelemetryLoggingService(SessionPerformanceRepository repository) {
        this.repository = repository;
    }

    public void processAndPersistPayload(Map<String, Object> payloadDTO) {
        // Isolate internal database commit speeds from external client network latency
        long startTime = System.currentTimeMillis();

        String nickname = (String) payloadDTO.get("sessionNickname");
        double speed = ((Number) payloadDTO.get("completionSpeedSeconds")).doubleValue();
        double accuracy = ((Number) payloadDTO.get("compoundAccuracyPercentage")).doubleValue();

        // Compute reaction path efficiency parameters based on behavioral log inputs
        double efficiency = computeReactionEfficiency(speed, accuracy);

        // Build our entity representation map matching persistent database schema rules
        SessionPerformance entity = new SessionPerformance(nickname, speed, accuracy, efficiency);

        // Orchestrate persistent Supabase write execution paths
        repository.save(entity);

        long endTime = System.currentTimeMillis();
        long executionDuration = endTime - startTime;

        logger.info("Telemetry transaction saved successfully for player: " + nickname);
        logger.info("Internal database commit speed isolated runtime: " + executionDuration + "ms");

        // System constraint warning validation check
        if (executionDuration > 2000) {
            logger.warning("Performance SLA warning: Telemetry write exceeded 2-second target threshold.");
        }
    }

    private double computeReactionEfficiency(double speed, double accuracy) {
        if (speed <= 0) return 0.0;
        // Calculation algorithm scoring system mapping parameters
        return (accuracy / speed) * 100.0;
    }
}